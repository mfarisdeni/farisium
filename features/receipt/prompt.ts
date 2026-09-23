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
    '2. Keep currency symbols and separators as printed, e.g. "Rp 12.500", "1 x 5.000", "Rp 2.500,00".',
    '3. Keep unit prices, quantities, subtotal, PPN/tax, discount, and total amounts as separate lines.',
    '4. Keep the merchant/store name even if it is a logo or styled text.',
    '5. Do not add, guess, or complete any text that is cut off or unreadable. If a portion of a line is unreadable, keep the readable part.',
    '6. Keep dates and transaction numbers (invoice/receipt no.) verbatim.',
    '7. If the image is NOT a receipt or contains no readable text, return an empty array.',
    '8. Do not add markdown, commentary, or anything other than the JSON array.',
  ].join('\n')
}

export function buildStructuredInstruction(): string {
  return [
    'Convert the transcribed receipt lines into one JSON object with these fields:',
    'merchantName, transactionDate (ISO YYYY-MM-DD), invoiceNumber, currency,',
    'subtotal, tax, discount, grandTotal,',
    'items (array of objects {name, quantity, unitPrice, total}),',
    'needsReview (boolean), warnings (array of strings).',
    '',
    'Rules:',
    '1. Plain numbers only — "Rp 12.500" becomes 12500, "5.000,50" becomes 5000.5. Read digits character by character; a thousands separator is NOT a decimal point.',
    '2. Combine rows like "2 x 5.000" into one item with quantity 2 and unitPrice 5000.',
    '3. If a value is missing or unreadable, set null and add a warning. Never invent numbers.',
    '4. Set needsReview=true when anything is ambiguous or the printed totals do not add up.',
    '5. Date always in ISO format.',
  ].join('\n')
}

/** Legacy single-call instruction (fallback when transcription fails). */
export function buildSystemInstruction(): string {
  return buildStructuredInstruction()
}