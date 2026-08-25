import { NextResponse } from 'next/server'
import { generateWithStableDiffusion } from '@/lib/sd-api'

export const runtime = 'nodejs'
export const maxDuration = 130

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { prompt } = (body ?? {}) as { prompt?: string }

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 2) {
    return NextResponse.json(
      { error: 'A prompt of at least 2 characters is required.' },
      { status: 400 },
    )
  }

  const cleanPrompt = prompt.trim().slice(0, 800)

  try {
    const image = await generateWithStableDiffusion(cleanPrompt)
    return NextResponse.json({ image, prompt: cleanPrompt })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
