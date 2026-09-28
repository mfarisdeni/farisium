/**
 * Gemini gateway for receipt extraction (two-stage: verbatim transcription
 * → structured JSON). Lazy singleton; model and key come from env (never
 * hardcoded in logic).
 */

import { GoogleGenAI, Type } from '@google/genai'
import { ApiError } from '../api.ts'

const DEFAULT_MODEL = 'gemini-3.5-flash-lite'

/**
 * Features that need a different extraction model than the default one.
 *
 * A product catalog page is a grid of many cards with several small text
 * clusters, which is materially harder than a single receipt or invoice: the
 * default `flash-lite` model dropped the whole `products` array on a 20-card
 * page. Such a feature may pin its own model through an env var without
 * affecting the agents already running on the default.
 */
export type ExtractionFeature = 'catalog'

const FEATURE_MODEL_ENV: Record<ExtractionFeature, string> = {
  catalog: 'GEMINI_MODEL_CATALOG',
}

export function getModel(feature?: ExtractionFeature): string {
  if (feature) {
    const override = process.env[FEATURE_MODEL_ENV[feature]]
    if (override) return override
  }
  return process.env.GEMINI_MODEL || DEFAULT_MODEL
}

/**
 * Models tried in order when one model cannot serve a request.
 *
 * Gemini's free tier enforces its daily request quota **per model**, so hitting
 * the quota on one model says nothing about the others: measured on a real
 * catalog page, `gemini-3-flash` was quota-exhausted while `gemini-flash-latest`
 * and the 3.1/3.6 aliases still answered. A single fallback therefore made the
 * whole agent fail for the rest of the day; a chain keeps it serving.
 *
 * Order = feature model → shared default → `GEMINI_FALLBACK_MODELS` (override,
 * comma separated) → these built-ins. `gemini-3.5-flash-lite` comes first
 * because it is the one verified to return every product on a dense page, and
 * the thinking-capable aliases come last as a better-than-nothing tier.
 */
const KNOWN_FALLBACK_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-flash-latest',
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
]

export function getModelChain(feature?: ExtractionFeature): string[] {
  const shared = process.env.GEMINI_MODEL || DEFAULT_MODEL
  const configured = (process.env.GEMINI_FALLBACK_MODELS ?? '')
    .split(',')
    .map((model) => model.trim())
    .filter(Boolean)
  return [...new Set([getModel(feature), shared, ...configured, ...KNOWN_FALLBACK_MODELS])]
}

let ai: GoogleGenAI | null = null

function getAI(): GoogleGenAI {
  if (ai) return ai
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi server.')
  }
  ai = new GoogleGenAI({ apiKey })
  return ai
}

/** JSON Schema handed to Gemini so its output directly matches receiptSchema. */
export const RECEIPT_JSON_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    merchantName: { type: Type.STRING },
    transactionDate: { type: Type.STRING },
    invoiceNumber: { type: Type.STRING },
    currency: { type: Type.STRING },
    subtotal: { type: Type.NUMBER },
    tax: { type: Type.NUMBER },
    discount: { type: Type.NUMBER },
    grandTotal: { type: Type.NUMBER },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          quantity: { type: Type.NUMBER },
          unitPrice: { type: Type.NUMBER },
          total: { type: Type.NUMBER },
        },
      },
    },
    needsReview: { type: Type.BOOLEAN },
    warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
} as const

/** JSON Schema handed to Gemini so its output directly matches invoiceSchema. */
export const INVOICE_JSON_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    invoiceNumber: { type: Type.STRING },
    issueDate: { type: Type.STRING },
    dueDate: { type: Type.STRING },
    currency: { type: Type.STRING },
    seller: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        address: { type: Type.STRING },
        contact: { type: Type.STRING },
        taxId: { type: Type.STRING },
      },
    },
    buyer: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        address: { type: Type.STRING },
        contact: { type: Type.STRING },
      },
    },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          quantity: { type: Type.NUMBER },
          unitPrice: { type: Type.NUMBER },
          total: { type: Type.NUMBER },
        },
      },
    },
    subtotal: { type: Type.NUMBER },
    tax: { type: Type.NUMBER },
    taxRate: { type: Type.NUMBER },
    discount: { type: Type.NUMBER },
    shipping: { type: Type.NUMBER },
    grandTotal: { type: Type.NUMBER },
    paymentMethod: { type: Type.STRING },
    notes: { type: Type.STRING },
    needsReview: { type: Type.BOOLEAN },
    warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
} as const

/**
 * JSON Schema handed to Gemini so its output directly matches expenseSchema.
 * Same contract as a receipt plus paymentMethod / category / notes.
 */
export const EXPENSE_JSON_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    merchantName: { type: Type.STRING },
    transactionDate: { type: Type.STRING },
    invoiceNumber: { type: Type.STRING },
    currency: { type: Type.STRING },
    paymentMethod: { type: Type.STRING },
    category: { type: Type.STRING },
    notes: { type: Type.STRING },
    subtotal: { type: Type.NUMBER },
    tax: { type: Type.NUMBER },
    discount: { type: Type.NUMBER },
    grandTotal: { type: Type.NUMBER },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          quantity: { type: Type.NUMBER },
          unitPrice: { type: Type.NUMBER },
          total: { type: Type.NUMBER },
        },
      },
    },
    needsReview: { type: Type.BOOLEAN },
    warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
} as const

interface RequestPayload {
  model: string
  contents: Array<{
    role: string
    parts: Array<{ inlineData?: { mimeType: string; data: string }; text?: string }>
  }>
  config?: Record<string, unknown>
}

/**
 * Detect a provider failure that is worth retrying on another model or later:
 * overload, capacity, rate limit, and timeouts. A malformed request (400) or a
 * bad key (401/403) is not retryable and must surface immediately.
 */
export function isTransientProviderError(err: unknown): boolean {
  const raw = err instanceof Error ? err.message : String(err)
  if (/\b(400|401|403)\b/.test(raw) && !/429/.test(raw)) return false
  return /\b(429|500|502|503|504)\b|UNAVAILABLE|RESOURCE_EXHAUSTED|OVERLOADED|high demand|deadline|timed? ?out|ETIMEDOUT|ECONNRESET|socket hang up|fetch failed/i.test(
    raw,
  )
}

async function run(content: RequestPayload, systemInstruction?: string): Promise<string> {
  const client = getAI()
  let response
  try {
    response = await client.models.generateContent({
      ...content,
      config: {
        ...(content.config ?? {}),
        ...(systemInstruction ? { systemInstruction } : {}),
        responseMimeType: 'application/json',
        temperature: 0.1,
        maxOutputTokens: 8192,
      },
    })
  } catch (err) {
    console.error('[gemini] generateContent failed:', err)
    throw new ApiError('Model AI sedang tidak tersedia. Coba lagi beberapa saat.', {
      status: 502,
      code: 'ai_unavailable',
      retryable: isTransientProviderError(err),
    })
  }

  const text =
    response?.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ??
    response?.text ??
    ''

  if (!text.trim()) {
    throw new ApiError('Model AI tidak menghasilkan respons. Coba lagi.', {
      status: 502,
      code: 'empty_ai_response',
    })
  }

  return text.trim()
}

/**
 * Stage 1 — transcribe a document image verbatim into a JSON array of lines.
 * Returns the raw JSON array string (caller parses). Shared by the receipt,
 * invoice, and expense pipelines.
 */
async function transcribeImage(
  base64Image: string,
  mimeType: string,
  instruction: string,
  documentLabel: string,
  model: string = getModel(),
): Promise<string> {
  const parts: Array<{ inlineData?: { mimeType: string; data: string }; text?: string }> = [
    {
      inlineData: { mimeType, data: base64Image },
    },
    {
      text:
        instruction +
        `\n\nTranskripsikan semua baris teks pada ${documentLabel} ini dari baris pertama hingga baris terakhir, lalu kembalikan JSON array-nya sekarang.`,
    },
  ]
  return run(
    {
      model,
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
      config: {
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    },
  )
}

/** Stage 1 — verbatim transcription of a receipt (preserves every digit). */
export function transcribeReceiptLines(
  base64Image: string,
  mimeType: string,
  instruction: string,
): Promise<string> {
  return transcribeImage(base64Image, mimeType, instruction, 'struk')
}

/** Stage 1 — verbatim transcription of any document image. */
export function transcribeImageLines(
  base64Image: string,
  mimeType: string,
  instruction: string,
  feature?: ExtractionFeature,
  /** Explicit model, used by a fallback chain. Wins over `feature`. */
  model?: string,
): Promise<string> {
  return transcribeImage(
    base64Image,
    mimeType,
    instruction,
    'dokumen',
    model ?? getModel(feature),
  )
}

/**
 * Stage 2 — structure a verbatim transcription into a feature JSON contract.
 * Same two-stage rationale as receipts: instructions go in the USER text.
 * The image is passed back alongside the lines so the model can confirm item
 * rows and column order. `documentLabel` only shapes the prompt wording.
 *
 * `responseSchema` may be omitted. Measured on gemini-3.5-flash-lite, a wide
 * `products` array (13 fields per item) made the model return a schema-shaped
 * object with the array *entirely missing* — 50 output tokens, finishReason
 * STOP — while the same prompt without `responseSchema` returned every product.
 * Features whose arrays are too wide for the model to honour a responseSchema
 * therefore ask for plain JSON and rely on `parseJsonObject` + Zod for
 * validation, which is the same guarantee with a stricter failure mode.
 */
async function structureFromLines(
  lines: string[],
  base64Image: string,
  mimeType: string,
  instructions: string,
  responseSchema: object | undefined,
  documentLabel: string,
  model: string = getModel(),
): Promise<string> {
  const parts: Array<{ inlineData?: { mimeType: string; data: string }; text?: string }> = []
  if (base64Image && mimeType) {
    parts.push({
      inlineData: { mimeType, data: base64Image },
    })
  }
  parts.push({
    text:
      instructions +
      `\n\nVerbatim transcription of the ${documentLabel}, one line per element, read top to bottom:\n` +
      lines.join('\n') +
      '\n\nReturn the structured JSON object now.',
  })
  return run(
    {
      model,
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
      config: responseSchema ? { responseSchema } : {},
    },
  )
}

/**
 * Single-call extraction (fallback when the two-stage pipeline returns an
 * empty stub). Reads the image directly with the feature schema. Instructions
 * live in the user text (see structureFromLines for why no systemInstruction).
 */
async function extractWithSchema(
  base64Image: string,
  mimeType: string,
  instructions: string,
  responseSchema: object | undefined,
  documentLabel: string,
  model: string = getModel(),
): Promise<string> {
  return run(
    {
      model,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: { mimeType, data: base64Image },
            },
            {
              text:
                instructions +
                `\n\nRead the provided ${documentLabel} image carefully and return the structured JSON object now.`,
            },
          ],
        },
      ],
      config: responseSchema ? { responseSchema } : {},
    },
  )
}

/**
 * Stage 2 — structure the verbatim transcription into the invoice JSON.
 */
export function structureInvoiceFromLines(
  lines: string[],
  base64Image: string,
  mimeType: string,
  instructions: string,
): Promise<string> {
  return structureFromLines(
    lines,
    base64Image,
    mimeType,
    instructions,
    INVOICE_JSON_SCHEMA,
    'invoice',
  )
}

/**
 * Stage 2 — structure the verbatim transcription into the receipt JSON.
 * NOTE: instructions are embedded in the USER text, NOT passed as
 * systemInstruction — empirically, systemInstruction makes these small
 * models return minimal/empty output (only merchant + date), while the same
 * text in the user prompt yields the full structured receipt.
 */
export function structureReceiptFromLines(
  lines: string[],
  base64Image: string,
  mimeType: string,
  instructions: string,
): Promise<string> {
  return structureFromLines(
    lines,
    base64Image,
    mimeType,
    instructions,
    RECEIPT_JSON_SCHEMA,
    'receipt',
  )
}

/** Stage 2 — structure a transcription into the expense JSON contract. */
export function structureExpenseFromLines(
  lines: string[],
  base64Image: string,
  mimeType: string,
  instructions: string,
): Promise<string> {
  return structureFromLines(
    lines,
    base64Image,
    mimeType,
    instructions,
    EXPENSE_JSON_SCHEMA,
    'receipt',
  )
}

/** Single-call invoice extraction (fallback). */
export function extractInvoiceJson(
  base64Image: string,
  mimeType: string,
  instructions: string,
): Promise<string> {
  return extractWithSchema(
    base64Image,
    mimeType,
    instructions,
    INVOICE_JSON_SCHEMA,
    'invoice',
  )
}

/** Legacy single-call receipt extraction (fallback only). */
export function extractReceiptJson(
  base64Image: string,
  mimeType: string,
  instructions: string,
): Promise<string> {
  return extractWithSchema(
    base64Image,
    mimeType,
    instructions,
    RECEIPT_JSON_SCHEMA,
    'receipt',
  )
}

/** Single-call expense extraction (fallback). */
export function extractExpenseJson(
  base64Image: string,
  mimeType: string,
  instructions: string,
): Promise<string> {
  return extractWithSchema(
    base64Image,
    mimeType,
    instructions,
    EXPENSE_JSON_SCHEMA,
    'receipt',
  )
}

/**
 * Single-call product catalog extraction.
 *
 * Deliberately passes no `responseSchema` — see `structureFromLines` for the
 * measurement showing the model drops the array when one is supplied.
 */
export function extractProductCatalogJson(
  base64Image: string,
  mimeType: string,
  instructions: string,
  feature?: ExtractionFeature,
  /** Explicit model, used by a fallback chain. Wins over `feature`. */
  model?: string,
): Promise<string> {
  return extractWithSchema(
    base64Image,
    mimeType,
    instructions,
    undefined,
    'product catalog',
    model ?? getModel(feature),
  )
}

/**
 * Stage 2 for the catalog — structure a verbatim transcription into the product
 * contract. The image is passed back so the model can confirm grid order and
 * which of two prices is the struck-through one.
 */
export function structureProductCatalogFromLines(
  lines: string[],
  base64Image: string,
  mimeType: string,
  instructions: string,
  feature?: ExtractionFeature,
  /** Explicit model, used by a fallback chain. Wins over `feature`. */
  model?: string,
): Promise<string> {
  return structureFromLines(
    lines,
    base64Image,
    mimeType,
    instructions,
    undefined,
    'product catalog page',
    model ?? getModel(feature),
  )
}