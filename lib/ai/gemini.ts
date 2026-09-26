/**
 * Gemini gateway for receipt extraction (two-stage: verbatim transcription
 * → structured JSON). Lazy singleton; model and key come from env (never
 * hardcoded in logic).
 */

import { GoogleGenAI, Type } from '@google/genai'
import { ApiError } from '../api.ts'

const DEFAULT_MODEL = 'gemini-3.5-flash-lite'

export function getModel(): string {
  return process.env.GEMINI_MODEL || DEFAULT_MODEL
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
): Promise<string> {
  const model = getModel()
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
): Promise<string> {
  return transcribeImage(base64Image, mimeType, instruction, 'dokumen')
}

/**
 * Stage 2 — structure a verbatim transcription into a feature JSON contract.
 * Same two-stage rationale as receipts: instructions go in the USER text.
 * The image is passed back alongside the lines so the model can confirm item
 * rows and column order. `documentLabel` only shapes the prompt wording.
 */
async function structureFromLines(
  lines: string[],
  base64Image: string,
  mimeType: string,
  instructions: string,
  responseSchema: object,
  documentLabel: string,
): Promise<string> {
  const model = getModel()
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
      config: {
        responseSchema,
      },
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
  responseSchema: object,
  documentLabel: string,
): Promise<string> {
  const model = getModel()
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
      config: {
        responseSchema,
      },
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