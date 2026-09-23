/**
 * System instructions for the invoice extraction pipeline.
 * Same two-stage design (transcribe → structure) as the receipt agent —
 * one shared transcriber, an invoice-specific structuring pass.
 */

export function buildInvoiceTranscribeInstruction(): string {
  return [
    'You are a precise invoice transcriber.',
    'Read the image of an invoice / bill / payment note line by line, from top to bottom.',
    'Transcribe the text exactly as printed, preserving order. Output a JSON array of strings, one string per visible line of text.',
    '',
    'Rules:',
    '1. Preserve ALL digits exactly as printed. Numbers are the most important content — do not "fix" them.',
    '2. Keep currency symbols and separators as printed, e.g. "Rp 1.250.000", "1 x 750.000".',
    '3. Keep the seller/company name (header), buyer/customer name and address, tax IDs, and contact details.',
    '4. Keep invoice number, issue date, due date, and payment terms verbatim.',
    '5. Keep unit prices, quantities, subtotal, PPN/tax, discount, shipping, and grand total as separate lines.',
    '6. Keep payment method lines (bank name, account number, QRIS) verbatim.',
    '7. Do not add, guess, or complete text that is cut off or unreadable. Keep the readable part.',
    '8. If the image is NOT an invoice or contains no readable text, return an empty array.',
    '9. Do not add markdown, commentary, or anything other than the JSON array.',
  ].join('\n')
}

export function buildInvoiceStructuredInstruction(): string {
  return [
    'Convert the transcribed invoice lines into one JSON object with these fields:',
    'invoiceNumber, issueDate (ISO YYYY-MM-DD), dueDate (ISO YYYY-MM-DD), currency,',
    'seller {name, address, contact, taxId}, buyer {name, address, contact},',
    'items (array of objects {name, description, quantity, unitPrice, total}),',
    'subtotal, tax, taxRate, discount, shipping, grandTotal,',
    'paymentMethod (e.g. "Transfer BCA", "QRIS", "Cash"), notes,',
    'needsReview (boolean), warnings (array of strings).',
    '',
    'Rules:',
    '1. Plain numbers only — "Rp 1.250.000" becomes 1250000, "750.000,50" becomes 750000.5. Read digits character by character; a thousands separator is NOT a decimal point.',
    '2. Combine rows like "2 x 750.000" into one item with quantity 2 and unitPrice 750000.',
    '3. Put company/brand header names into seller.name; customer names into buyer.name.',
    '4. If a value is missing or unreadable, set null and add a warning. Never invent numbers.',
    '5. Set needsReview=true when anything is ambiguous or the printed totals do not add up.',
    '6. Dates always in ISO format.',
  ].join('\n')
}

/** Legacy single-call instruction (fallback when transcription fails). */
export function buildInvoiceSystemInstruction(): string {
  return buildInvoiceStructuredInstruction()
}