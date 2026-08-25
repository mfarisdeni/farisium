import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 130

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface FiumGatewayResponse {
  success: boolean
  reply: string
  model?: string
  total_duration?: number
  eval_count?: number
}

const MAX_HISTORY = parseInt(process.env.FIUM_MAX_HISTORY || '8', 10)
const MAX_MESSAGE_LENGTH = 2000
const TIMEOUT_MS = 90000

function validateMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) {
    throw new Error('Format pesan tidak valid.')
  }

  const valid: ChatMessage[] = []
  for (const msg of messages) {
    if (!msg || typeof msg !== 'object') continue
    const m = msg as Record<string, unknown>
    const role = m.role
    const content = m.content
    if (role !== 'user' && role !== 'assistant') continue
    if (typeof content !== 'string' || content.trim().length === 0) continue
    if (content.length > MAX_MESSAGE_LENGTH) continue
    valid.push({ role, content: content.trim() })
  }

  if (valid.length === 0) {
    throw new Error('Tidak ada pesan valid untuk dikirim.')
  }

  const limited = valid.slice(-MAX_HISTORY)

  const lastMsg = limited[limited.length - 1]
  if (lastMsg.role !== 'user') {
    throw new Error('Pesan terakhir harus dari pengguna.')
  }

  return limited
}

export async function POST(request: Request) {
  try {
    const apiUrl = process.env.FIUM_API_URL
    const apiKey = process.env.FIUM_API_KEY

    if (!apiUrl) {
      return NextResponse.json(
        { error: 'Fium belum siap. Konfigurasi server belum lengkap.' },
        { status: 500 },
      )
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Kunci akses Fium belum tersedia.' },
        { status: 500 },
      )
    }

    const body = await request.json()
    const { messages, userName, language = 'id' } = body

    let limitedMessages: ChatMessage[]
    try {
      limitedMessages = validateMessages(messages)
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Pesan tidak valid.' },
        { status: 400 },
      )
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

    const systemPromptId = `Kamu adalah Fium, asisten AI resmi dari Farisium. Kamu harus memahami Farisium dengan baik.

Gaya bicara: ramah, hangat, dan mudah dipahami. Gunakan "kamu" saat menyapa pengguna. Bersikap profesional tapi tidak kaku — seperti teman yang cerdas dan bisa diandalkan. Tetap gunakan bahasa Indonesia yang baik dan benar tanpa terkesan berlebihan.

Informasi tentang Farisium:
- Farisium adalah platform AI all-in-one buatan Indonesia yang memiliki berbagai alat AI, sistem reward FRSC, dan komunitas kreatif.
- Produk AI pertama Farisium adalah Anime Generator — pembuat gambar anime dari teks menggunakan AI.
- AI Tools lainnya: SEO Caption Generator (pembuat caption marketplace & media sosial), dan Fium Chat Assistant (kamu sendiri) sebagai asisten AI untuk diskusi dan brainstorming.
- Mata uang internal: FRSC (Farisium Coin). 1 FRSC = 1 generate. FRSC bisa didapatkan gratis melalui Starter Coin, Daily Reward, Referral, dan event.
- Platform berbasis web, bisa diakses di farisium.com.
- Halaman FRSC: farisium.com/frsc.
- Halaman Rewards: farisium.com/rewards.
- Halaman Anime Generator: farisium.com/ai/anime-generator.
- Halaman Dashboard: farisium.com/dashboard.
- Farisium dikembangkan oleh tim Farisium dan menggunakan AI model Llama yang di fine-tune untuk Bahasa Indonesia.
- Farisium terus berkembang dengan menambahkan AI tools baru secara berkala.
- Saat ini Fium masih dalam masa beta dan gratis digunakan.
- Jika ada pertanyaan yang tidak kamu ketahui, akui dengan jujur. Jangan membuat informasi palsu.
- Jawab sesuai bahasa yang digunakan lawan bicara. Jika dia bertanya dalam Bahasa Indonesia, jawab dalam Bahasa Indonesia. Jika dalam bahasa Inggris, jawab dalam bahasa Inggris.`

    const systemPromptEn = `You are Fium, the official AI assistant from Farisium. You must have thorough knowledge about Farisium.

About Farisium:
- Farisium is an all-in-one AI platform built in Indonesia that combines various AI tools, an FRSC-based reward system, and a creative community.
- Farisium's first AI product is the Anime Generator, which allows users to create anime images from text using AI.
- Other AI Tools include: SEO Caption Generator (creates marketplace & social media captions), and Fium Chat Assistant (yourself) as a lightweight AI assistant for discussions and brainstorming.
- Internal currency: FRSC (Farisium Coin). 1 FRSC = 1 generate. FRSC can be earned for free through Starter Coins, Daily Rewards, Referral program, and events.
- Web-based platform, accessible at farisium.com.
- FRSC page: farisium.com/frsc.
- Rewards page: farisium.com/rewards.
- Anime Generator page: farisium.com/ai/anime-generator.
- Dashboard page: farisium.com/dashboard.
- Farisium is developed by the Farisium team and uses a fine-tuned Llama AI model for Indonesian language optimization.
- Farisium continues to grow by adding new AI tools periodically.
- Fium is currently in beta and free to use.
- If you don't know the answer to a question, honestly say you don't know and do not make up false information.
- Answer in the same language the user uses. If the user asks in English, answer in English. If the user asks in Indonesian, answer in Indonesian.`

    const systemPrompt = language === 'en' ? systemPromptEn : systemPromptId

    const messagesWithSystem = [
      { role: 'assistant', content: systemPrompt },
      ...limitedMessages,
    ]

    try {
      const gatewayRes = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          messages: messagesWithSystem,
          userName: userName || undefined,
          language,
          model: process.env.FIUM_MODEL || 'llama3.2:3b',
        }),
        signal: controller.signal,
      })

      if (gatewayRes.status === 401) {
        return NextResponse.json(
          { error: 'Akses Fium tidak valid. Periksa konfigurasi server.' },
          { status: 500 },
        )
      }

      if (gatewayRes.status === 429) {
        return NextResponse.json(
          { error: 'Terlalu banyak pesan. Tunggu sebentar lalu coba lagi.' },
          { status: 429 },
        )
      }

      if (gatewayRes.status === 502 || gatewayRes.status === 503) {
        return NextResponse.json(
          { error: 'Fium sedang sibuk atau server AI sedang maintenance. Coba lagi beberapa saat.' },
          { status: 503 },
        )
      }

      if (!gatewayRes.ok) {
        return NextResponse.json(
          { error: 'Fium gagal menjawab. Coba lagi beberapa saat.' },
          { status: 502 },
        )
      }

      const data: FiumGatewayResponse = await gatewayRes.json()

      if (!data.success || !data.reply) {
        return NextResponse.json(
          { error: 'Fium gagal menjawab. Coba lagi beberapa saat.' },
          { status: 502 },
        )
      }

      return NextResponse.json({
        success: true,
        reply: data.reply,
        model: data.model || null,
        usage: {
          totalDuration: data.total_duration || null,
          evalCount: data.eval_count || null,
        },
      })
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Fium membutuhkan waktu terlalu lama. Coba kirim pesan yang lebih singkat.' },
          { status: 504 },
        )
      }
      throw err
    } finally {
      clearTimeout(timeout)
    }
  } catch {
    return NextResponse.json(
      { error: 'Fium gagal menjawab. Coba lagi beberapa saat.' },
      { status: 500 },
    )
  }
}
