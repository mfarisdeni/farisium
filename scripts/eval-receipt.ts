/**
 * Offline accuracy-eval for the Receipt → Excel AI pipeline.
 *
 * Reads a local receipt image, runs the EXACT same two-stage Gemini pipeline
 * used in production (lib/ai/gemini.ts + features/receipt/*), then prints the
 * transcription, the structured result, and the deterministic validation.
 *
 * Usage:  node scripts/eval-receipt.ts [path/to/receipt.jpg]
 * Requires GEMINI_API_KEY (auto-loaded from .env.local).
 */

import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { transcribeReceiptLines, structureReceiptFromLines } from '../lib/ai/gemini.ts'
import {
  buildTranscribeInstruction,
  buildStructuredInstruction,
} from '../features/receipt/prompt.ts'
import { parseReceiptJson } from '../features/receipt/schema.ts'
import { validateReceiptTotals, applyValidation } from '../features/receipt/validation.ts'

const rootDir = join(fileURLToPath(new URL('.', import.meta.url)), '..')

// Load .env.local into process.env (first one wins).
for (const line of readFileSync(join(rootDir, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m && !process.env[m[1]]) {
    process.env[m[1]] = m[2].replace(/^"?|"?$/g, '').trim()
  }
}

async function main() {
  const imageArg = process.argv[2]
  const imagePath = imageArg ? resolve(imageArg) : join(rootDir, 'public/receipt-example/images.jpeg')

  const buf = readFileSync(imagePath)
  const ext = imagePath.slice(imagePath.lastIndexOf('.')).toLowerCase()
  const mimeType =
    ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
  const base64 = buf.toString('base64')

  console.log(`\n=== Input: ${imagePath} (${buf.length} bytes, ${mimeType}) ===`)
  console.log('Model:', process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite')

  // Stage 1
  const transcriptionRaw = await transcribeReceiptLines(
    base64,
    mimeType,
    buildTranscribeInstruction(),
  )
  let lines: string[] = []
  try {
    const parsed = JSON.parse(transcriptionRaw)
    if (Array.isArray(parsed)) lines = parsed
  } catch {
    lines = []
  }

  console.log('\n--- TRANSCRIPTION (baris per baris) ---')
  lines.forEach((l, i) => console.log(`${String(i + 1).padStart(2, '0')} | ${l}`))
  if (lines.length === 0) console.log('(kosong)')

  if (lines.length === 0) {
    console.error('\nFALLBACK single-call dipakai (transkripsi kosong).')
  }

  // Stage 2 — text-only (same as production).
  const structuredRaw = await structureReceiptFromLines(
    lines,
    '',
    '',
    buildStructuredInstruction(),
  )
  console.log('\n--- STRUCTURED (raw) ---')
  console.log(structuredRaw)

  // Zod + deterministic validation
  console.log('\n--- VALIDATION ---')
  try {
    const receipt = parseReceiptJson(structuredRaw)
    const validation = validateReceiptTotals(receipt)
    const final = applyValidation(receipt, validation)
    console.log('needsReview:', final.needsReview)
    console.log('warnings:', JSON.stringify(final.warnings, null, 2))
    console.log(
      'items:',
      final.items.length,
      '| subtotal:', final.subtotal,
      '| tax:', final.tax,
      '| discount:', final.discount,
      '| grandTotal:', final.grandTotal,
    )
  } catch (err) {
    console.error('Gagal parse/validasi:', err)
  }
}

main().catch((err) => {
  console.error('\nEval gagal:', err)
  process.exit(1)
})