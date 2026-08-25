import { NextResponse } from 'next/server'
import { generateJSON } from '@/lib/ai/ollama'
import {
  buildSystemPrompt,
  buildUserPrompt,
  type SEOInput,
} from '@/lib/ai/prompts/seoCaptionPrompt'

export const runtime = 'nodejs'
export const maxDuration = 130

interface SEOResult {
  seoTitles: string[]
  shortCaption: string
  longCaption: string
  marketplaceDescription: string
  instagramCaption: string
  tiktokCaption: string
  hashtags: string[]
  searchKeywords: string[]
  cta: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      uid,
      productName = '',
      description = '',
      platform = '',
      targetAudiences = ['Umum'],
      tone = '',
      language = 'indonesian',
    } = body

    if (!uid) {
      return NextResponse.json(
        { error: 'Silakan login terlebih dahulu.' },
        { status: 401 },
      )
    }

    if (!productName || productName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Nama produk minimal 2 karakter.' },
        { status: 400 },
      )
    }

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Deskripsi produk minimal 10 karakter.' },
        { status: 400 },
      )
    }

    if (!platform) {
      return NextResponse.json(
        { error: 'Pilih platform tujuan.' },
        { status: 400 },
      )
    }

    if (!tone) {
      return NextResponse.json(
        { error: 'Pilih gaya caption.' },
        { status: 400 },
      )
    }

    const raw = await generateJSON<Partial<SEOResult>>(
      buildUserPrompt({
        productName: productName.trim(),
        description: description.trim(),
        platform,
        targetAudiences,
        tone,
        language,
      }),
      {
        system: buildSystemPrompt(language),
        temperature: 0.3,
        maxTokens: 4096,
      },
    )

    const result: SEOResult = {
      seoTitles: raw.seoTitles ?? [],
      shortCaption: raw.shortCaption ?? '',
      longCaption: raw.longCaption ?? '',
      marketplaceDescription: raw.marketplaceDescription ?? '',
      instagramCaption: raw.instagramCaption ?? '',
      tiktokCaption: raw.tiktokCaption ?? '',
      hashtags: raw.hashtags ?? [],
      searchKeywords: raw.searchKeywords ?? [],
      cta: raw.cta ?? '',
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Gagal membuat caption. Silakan coba lagi.'

    console.error('SEO Caption generation error:', message)

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
