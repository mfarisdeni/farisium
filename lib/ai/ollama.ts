interface GenerateOptions {
  model?: string
  system?: string
  temperature?: number
  maxTokens?: number
}

interface GatewayResponse {
  success: boolean
  response: string
  model?: string
  total_duration?: number
  eval_count?: number
}

const LLM_API_URL = process.env.LLM_API_URL
const LLM_API_KEY = process.env.LLM_API_KEY
const DEFAULT_MODEL = process.env.OLLAMA_MODEL ?? 'llama3.2:3b'

function buildFullPrompt(prompt: string, system?: string): string {
  if (!system) return prompt
  return `${system}\n\n${prompt}`
}

export async function generateWithOllama(
  prompt: string,
  options: GenerateOptions = {},
): Promise<string> {
  if (!LLM_API_URL) {
    throw new Error('Konfigurasi AI belum tersedia.')
  }

  if (!LLM_API_KEY) {
    throw new Error('Kunci akses AI belum tersedia.')
  }

  const model = options.model ?? DEFAULT_MODEL
  const fullPrompt = buildFullPrompt(prompt, options.system)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 90_000)

  try {
    const res = await fetch(`${LLM_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        prompt: fullPrompt,
        options: {
          temperature: options.temperature ?? 0.7,
          top_p: 0.9,
          num_predict: options.maxTokens ?? 2048,
        },
      }),
      signal: controller.signal,
    })

    if (res.status === 401) {
      throw new Error('Akses AI tidak valid. Periksa konfigurasi server.')
    }

    if (!res.ok) {
      throw new Error(
        'AI sedang sibuk atau server sedang maintenance. Coba lagi beberapa saat.',
      )
    }

    const data: GatewayResponse = await res.json()

    if (!data.success || !data.response) {
      throw new Error(
        'AI sedang sibuk atau server sedang maintenance. Coba lagi beberapa saat.',
      )
    }

    return data.response.trim()
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(
        'Generate terlalu lama. Coba lagi dengan deskripsi yang lebih singkat.',
      )
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

export async function generateJSON<T>(
  prompt: string,
  options: GenerateOptions = {},
): Promise<T> {
  const raw = await generateWithOllama(prompt, {
    ...options,
    temperature: options.temperature ?? 0.3,
  })

  const jsonStart = raw.indexOf('{')
  const jsonEnd = raw.lastIndexOf('}')

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error(
      'Gagal memproses hasil AI. Coba lagi dengan deskripsi yang berbeda.',
    )
  }

  const jsonStr = raw.slice(jsonStart, jsonEnd + 1)

  try {
    return JSON.parse(jsonStr) as T
  } catch {
    throw new Error(
      'Gagal memproses hasil AI. Coba lagi dengan deskripsi yang berbeda.',
    )
  }
}
