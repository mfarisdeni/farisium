/**
 * Extraction pipeline for ONE catalog page: bytes in, validated ProductCatalog
 * out. This module is the pure half of the agent — it performs no I/O of its
 * own, so the whole chain (model call → Zod contract) runs under `node --test`.
 *
 * Mirrors the receipt/invoice/expense pipelines. The important difference is
 * the quality gate: a marketplace grid can be large, and the small extraction
 * model frequently answers a single call with a well-formed but *empty* stub
 * (`products: []`) instead of the 20 cards it was shown. A stub is never
 * treated as success — the two-stage path runs instead, exactly like the fix
 * that made the receipt and invoice agents reliable.
 *
 * The R2/Firestore half that feeds this pipeline lives in `processor.ts`.
 */

import { ApiError } from '../../lib/api.ts'
import {
  extractProductCatalogJson,
  getModel,
  getModelChain,
  structureProductCatalogFromLines,
  transcribeImageLines,
} from '../../lib/ai/gemini.ts'
import {
  parseProductCatalogJson,
  type ProductCatalog,
} from './schema.ts'
import {
  buildCatalogStructuredInstruction,
  buildCatalogTranscribeInstruction,
  type CatalogLanguage,
} from './prompt.ts'

export interface ExtractCatalogInput {
  base64: string
  mimeType: string
  fileName: string
  page?: number
  language?: CatalogLanguage
}

/** A product that carries at least a name or a price is a real extraction. */
function usableProductCount(catalog: ProductCatalog): number {
  return catalog.products.filter((p) => p.name != null || p.price != null).length
}

/**
 * True when the model returned valid JSON that clearly does not reflect the
 * document — either nothing at all, or rows with neither name nor price.
 */
export function isStubCatalog(catalog: ProductCatalog): boolean {
  if (catalog.products.length === 0) return true
  return usableProductCount(catalog) === 0
}

/** Attach provenance to every product so the UI can trace a row to its source. */
function annotate(
  catalog: ProductCatalog,
  fileName: string,
  page?: number,
): ProductCatalog {
  return {
    ...catalog,
    products: catalog.products.map((p) => ({
      ...p,
      sourceFile: p.sourceFile ?? fileName,
      sourcePage: p.sourcePage ?? page ?? null,
    })),
  }
}

/** Advisory shown when the feature's stronger model had to be skipped. */
function degradedNotice(model: string): string {
  return `Model khusus katalog (${getModel('catalog')}) sedang penuh, hasil diambil dengan model ${model}. Nama toko mungkin kurang lengkap.`
}

/** Merge warnings without duplicating the same message. */
function mergeWarnings(
  base: ProductCatalog,
  extra: string[],
): ProductCatalog {
  const warnings = [...base.warnings]
  for (const w of extra) if (!warnings.includes(w)) warnings.push(w)
  return { ...base, warnings }
}

/**
 * Run one catalog call, walking the model chain until a model answers.
 *
 * The catalog model is deliberately a non-lite model because it is the only one
 * that reads shop names on a dense grid, but it is also the first to run out:
 * 503 "high demand", and on the free tier a hard 20-requests-per-day quota that
 * is enforced **per model**. Because the quota is per model, another model in
 * the chain usually still has requests left, so a quota or overload error is
 * moved down the chain instead of failing the request. Anything that is not
 * transient (a malformed request, a bad key) fails immediately, because
 * retrying it on four more models would only burn quota.
 *
 * Returns which model actually served the call so the caller can flag a
 * degraded run — the model that answers may read shop names less reliably.
 */
async function callWithFallback<T>(
  attempt: (model: string) => Promise<T>,
): Promise<{ value: T; degraded: boolean; model: string }> {
  const chain = getModelChain('catalog')
  const primary = chain[0]
  let lastError: unknown

  for (const [index, model] of chain.entries()) {
    try {
      const value = await attempt(model)
      if (index > 0) {
        console.warn(`[product-catalog] model ${primary} unavailable, used ${model} instead`)
      }
      return { value, degraded: model !== primary, model }
    } catch (error) {
      const retryable = error instanceof ApiError && error.retryable
      if (!retryable) throw error
      lastError = error
      console.warn(
        `[product-catalog] model ${model} unavailable (${error.code ?? 'transient'}), trying the next model`,
      )
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new ApiError('Model AI sedang tidak tersedia. Coba lagi beberapa saat.', {
        status: 502,
        code: 'ai_unavailable',
        retryable: true,
      })
}

/**
 * Extract one catalog document. Tries a single call first because it is half
 * the latency; falls back to transcription + structuring when the result is a
 * stub. Both stages keep the image so grid order and price pairs stay checkable.
 */
export async function extractProductCatalog(
  input: ExtractCatalogInput,
): Promise<ProductCatalog> {
  const { base64, mimeType, fileName, page, language = 'id' } = input
  const structured = buildCatalogStructuredInstruction(language)
  const degradedWarnings: string[] = []

  // Every attempt is identical apart from the model it is pinned to, which is
  // what the fallback chain walks through.
  const singleCall = () =>
    callWithFallback((model) =>
      extractProductCatalogJson(base64, mimeType, structured, 'catalog', model).then(
        parseProductCatalogJson,
      ),
    )

  const transcribe = () =>
    callWithFallback((model) =>
      transcribeImageLines(
        base64,
        mimeType,
        buildCatalogTranscribeInstruction(language),
        'catalog',
        model,
      ),
    )

  const structure = (lines: string[]) =>
    callWithFallback((model) =>
      structureProductCatalogFromLines(lines, base64, mimeType, structured, 'catalog', model).then(
        parseProductCatalogJson,
      ),
    )

  let catalog: ProductCatalog
  try {
    const attempt = await singleCall()
    catalog = attempt.value
    if (attempt.degraded) degradedWarnings.push(degradedNotice(attempt.model))
  } catch (error) {
    // Malformed JSON is a stub too — fall through to the two-stage path.
    if (!(error instanceof ApiError)) throw error
    catalog = {
      source: null,
      currency: null,
      shops: [],
      products: [],
      needsReview: false,
      warnings: [],
    }
  }

  if (!isStubCatalog(catalog)) {
    return annotate(catalog, fileName, page)
  }

  const warnings = [
    'Ekstraksi satu tahap tidak menghasilkan produk; hasil diambil lewat transkripsi dua tahap.',
  ]

  const transcribeAttempt = await transcribe()
  const transcription = transcribeAttempt.value
  if (transcribeAttempt.degraded && !degradedWarnings.length) {
    degradedWarnings.push(degradedNotice(transcribeAttempt.model))
  }

  if (!transcription.trim()) {
    throw new ApiError('Halaman katalog tidak terbaca. Coba upload ulang.', {
      status: 422,
      code: 'catalog_unreadable',
    })
  }

  const lines = transcription
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const structureAttempt = await structure(lines)
  const staged = structureAttempt.value
  if (structureAttempt.degraded && !degradedWarnings.length) {
    degradedWarnings.push(degradedNotice(structureAttempt.model))
  }

  if (isStubCatalog(staged)) {
    throw new ApiError(
      'Produk pada halaman ini tidak dapat dibaca. Pastikan gambar katalog jelas dan coba lagi.',
      { status: 422, code: 'catalog_no_products' },
    )
  }

  return mergeWarnings(annotate(staged, fileName, page), [...warnings, ...degradedWarnings])
}
