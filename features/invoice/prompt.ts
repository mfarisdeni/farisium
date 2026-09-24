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
    '2. For TABLE ROWS, keep the columns in their printed left-to-right order and join them with a vertical bar " | " inside ONE string. Example: "1 | Sample service | 400.00 | 400.00". Do not merge table rows with header or total lines.',
    '3. Keep currency symbols and separators as printed, e.g. "£600.00", "$ 500", "Rp 1.250.000", "1 x 750.000".',
    '4. Keep the seller/company name (header), buyer/customer name and address, tax IDs, and contact details.',
    '5. Keep invoice number, issue date, due date, and payment terms verbatim.',
    '6. Keep unit prices, quantities, subtotal, PPN/tax, discount, shipping, and grand total lines verbatim.',
    '7. Keep payment method lines (bank name, account number, QRIS) verbatim.',
    '8. Do not add, guess, or complete text that is cut off or unreadable. Keep the readable part.',
    '9. If the image is NOT an invoice or contains no readable text, return an empty array.',
    '10. Do not add markdown, commentary, or anything other than the JSON array.',
  ].join('\n')
}

export function buildInvoiceStructuredInstruction(): string {
  return [
    'Convert the transcribed invoice lines into ONE JSON object with ALL of these fields:',
    'invoiceNumber, issueDate (ISO YYYY-MM-DD), dueDate (ISO YYYY-MM-DD), currency,',
    'seller {name, address, contact, taxId}, buyer {name, address, contact},',
    'items (array of objects {name, description, quantity, unitPrice, total}),',
    'subtotal, tax, taxRate, discount, shipping, grandTotal,',
    'paymentMethod, notes, needsReview (boolean), warnings (array of strings).',
    '',
    'Rules:',
    '1. Plain numbers only — strip currency symbols and separators: "£600.00" becomes 600, "Rp 1.250.000" becomes 1250000, "750.000,50" becomes 750000.5. Read digits character by character; a thousands separator is NOT a decimal point.',
    '2. The invoice usually has a TABLE with columns like QTY | DESCRIPTION | UNIT PRICE | AMOUNT. TRANSFORM EVERY ROW INTO ONE ITEM and DO NOT drop or merge any row: quantity = QTY column, unitPrice = UNIT PRICE column, total = AMOUNT column, name = DESCRIPTION column (merge wrapped or split lines of the same row into one item). When a row has no QTY column, set quantity to 1.',
    '3. Map TOTAL / Subtotal → subtotal, tax / PPN / PAJAK → tax, and TOTAL DUE / GRAND TOTAL / Amount Due → grandTotal.',
    '4. Put the company/brand header name → seller.name; the customer targets (Bill To / Billed to / To / Customer) → buyer.name. Addresses and contacts belong to the matching party.',
    '5. Only set paymentMethod when the invoice actually states one (bank transfer, QRIS, cash, card). If absent, set null. NEVER invent a payment method.',
    '6. If a value is missing or unreadable, set null and add a warning. NEVER invent numbers.',
    '7. Dates always in ISO format (YYYY-MM-DD).',
    '8. Set needsReview=true when the printed totals do not add up or anything is ambiguous.',
    '9. Output the object with EVERY field present. Use null for missing scalars and [] for missing items. Do not omit fields.',
  ].join('\n')
}

/** Legacy single-call instruction (fallback when transcription fails). */
export function buildInvoiceSystemInstruction(): string {
  return buildInvoiceStructuredInstruction()
}