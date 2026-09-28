/**
 * Measure how often each candidate model returns a transient 503, so the
 * catalog feature pins a model that is actually available in production.
 * Not part of the app.
 */

import { GoogleGenAI } from '@google/genai'
import { isTransientProviderError } from '../lib/ai/gemini.ts'

const CANDIDATES = [
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-3.5-flash-lite',
]
const ATTEMPTS = 4

async function main(): Promise<void> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  for (const model of CANDIDATES) {
    let transient = 0
    let hardFail = 0
    let ok = 0
    const times: number[] = []
    for (let i = 0; i < ATTEMPTS; i++) {
      const started = Date.now()
      try {
        await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: 'Reply with the single word: ok' }] }],
          config: { maxOutputTokens: 2048, temperature: 0 },
        })
        ok++
        times.push(Date.now() - started)
      } catch (e) {
        if (isTransientProviderError(e)) transient++
        else hardFail++
      }
    }
    const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0
    console.log(
      `${model.padEnd(24)} ok=${ok}  503/timeout=${transient}  hardFail=${hardFail}  avg=${avg}ms`,
    )
  }
}

void main()
