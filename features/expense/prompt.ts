/**
 * Extraction instructions for the expense report pipeline.
 * The transcription + structuring rules are the receipt rules (reused
 * verbatim — see `features/receipt/prompt.ts`); only the expense-specific
 * fields are appended here. Pure functions.
 */

import { buildStructuredInstruction, buildTranscribeInstruction } from '../receipt/prompt.ts'
import { EXPENSE_CATEGORIES } from './categories.ts'

/** Reused as-is: an expense report receipt is transcribed like any receipt. */
export { buildTranscribeInstruction }

const CATEGORY_LIST = EXPENSE_CATEGORIES.map((c) => c.replace(/_/g, ' ')).join(', ')

export function buildExpenseStructuredInstruction(): string {
  return [
    buildStructuredInstruction(),
    '',
    'EXPENSE-SPECIFIC RULES:',
    `9. paymentMethod: only what the receipt actually prints (Cash, Debit Card, Credit Card, QRIS, BCA VA, Transfer, E-Wallet, Voucher). If the receipt does not state a payment method, set null — never invent one.`,
    `10. category: pick exactly ONE business expense category from this list: ${CATEGORY_LIST}. Choose from what the merchant and the purchased items actually are, not from the wording of the receipt. If nothing fits confidently, set "other".`,
    '11. notes: at most one short sentence of genuinely useful context for a bookkeeping reviewer (for example "termasuk ongkir", "split 2 orang", "biaya langganan bulanan"). Use null when there is nothing to add.',
    '12. Never merge or combine two different receipts into one record — this agent handles one image per call.',
  ].join('\n')
}

/** Single-call instruction (fallback when the two-stage pipeline stubs). */
export function buildExpenseSystemInstruction(): string {
  return buildExpenseStructuredInstruction()
}
