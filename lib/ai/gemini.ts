/**
 * Gemini gateway for receipt extraction (structured JSON output).
 * Lazy singleton; model and key come from env (never hardcoded in logic).
 */

import { GoogleGenAI, Type } from '@google/genai'
import { ApiError } from '@/lib/api'

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

/**
 * Extract structured data as raw JSON text. The caller validates with zod.
 * Returns the model's text output (first candidate's concatenated text parts).
 */
export async function extractReceiptJson(
  base64Image: string,
  mimeType: string,
  systemInstruction: string,
): Promise<string> {
  const model = getModel()
  const client = getAI()

  let response
  try {
    response = await client.models.generateContent({
      model,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: { mimeType, data: base64Image },
            },
            {
              text: 'Ekstrak semua data dari foto struk/bukti transaksi ini ke dalam JSON sesuai instruksi sistem.',
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: RECEIPT_JSON_SCHEMA,
        temperature: 0.2,
        maxOutputTokens: 4096,
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