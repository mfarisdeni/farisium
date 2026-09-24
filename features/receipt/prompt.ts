/**
 * System instructions for the receipt extraction pipeline.
 * Pure functions — single source of truth for extraction rules.
 *
 * Two-stage design (transcribe → structure) is far more accurate on real
 * receipts than a single structured call, because the first call preserves
 * every digit verbatim and the second call can reason over the full text
 * instead of compressing the image into JSON in one shot.
 */

export function buildTranscribeInstruction(): string {
  return [
    'You are a precise receipt transcriber.',
    'Read the image of a receipt / transaction proof line by line, from top to bottom.',
    'Transcribe the text exactly as printed, preserving order. Output a JSON array of strings, one string per visible line of text.',
    '',
    'Rules:',
    '1. Preserve ALL digits exactly as printed. Numbers on receipts are the most important content — do not "fix" them.',
    '2. Transcribe EVERY line from the very first to the very last, including the totals block at the bottom (SUBTOTAL, PAJAK/PPN/TAX, DISKON, TOTAL, Tunai, Kembali). Never stop early and never trim the final lines — those bottom amounts are the most important part of the receipt.',
    '3. Keep each printed line as its own array item, in top-to-bottom order. Do not merge or drop lines.',
    '4. For TABLE ROWS (item lines), keep the columns in their printed left-to-right order and join them with a vertical bar " | " inside ONE string. Example: "2 | Kopi Susu | 15.000 | 30.000". Do not merge item rows with header or total lines.',
    '5. Keep currency symbols and separators as printed, e.g. "Rp 12.500", "1 x 5.000", "Rp 2.500,00".',
    '6. Keep unit prices, quantities, subtotal, PPN/tax, discount, and total amounts as separate lines.',
    '7. Keep the merchant/store name even if it is a logo or styled text.',
    '8. Do not add, guess, or complete any text that is cut off or unreadable. If a portion of a line is unreadable, keep the readable part.',
    '9. Keep dates and transaction numbers (invoice/receipt no.) verbatim.',
    '10. If the image is NOT a receipt or contains no readable text, return an empty array.',
    '11. Do not add markdown, commentary, or anything other than the JSON array.',
  ].join('\n')
}

export function buildStructuredInstruction(): string {
  return [
    'Convert the transcribed receipt lines into ONE JSON object with ALL of these fields:',
    'merchantName, transactionDate (ISO YYYY-MM-DD), invoiceNumber, currency,',
    'subtotal, tax, discount, grandTotal,',
    'items (array of objects {name, quantity, unitPrice, total}),',
    'needsReview (boolean), warnings (array of strings).',
    '',
    'Rules:',
    '1. Plain numbers only — strip currency symbols and separators: "Rp 12.500" becomes 12500, "5.000,50" becomes 5000.5. Read digits character by character; a thousands separator is NOT a decimal point.',
    '2. Combine rows like "2 x 5.000" into one item with quantity 2 and unitPrice 5000.',
    '3. Receipts usually list one line per bought item. TRANSFORM EVERY ITEM LINE INTO ONE ITEM and DO NOT drop any row: name = item text, quantity and unitPrice from their values, total = line total. When quantity is missing, set 1.',
    '4. Map SUBTOTAL → subtotal, PPN / PAJAK / TAX → tax, DISKON → discount, and TOTAL / TOTAL AKHIR / GRAND TOTAL → grandTotal.',
    '5. If a value is missing or unreadable, set null and add a warning. NEVER invent numbers.',
    '6. Set needsReview=true when anything is ambiguous or the printed totals do not add up.',
    '7. Date always in ISO format (YYYY-MM-DD). Read printed dates as day/month/year — e.g. "Tgl: 14/09/2026" → transactionDate "2026-09-14".',
    '8. Output the object with EVERY field present. Use null for missing scalars and [] for missing items. Do not omit fields.',
  ].join('\n')
}

/** Legacy single-call instruction (fallback when transcription fails). */
export function buildSystemInstruction(): string {
  return buildStructuredInstruction()
}