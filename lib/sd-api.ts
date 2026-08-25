// Internal model — never expose checkpoint name to frontend
import { normalizePrompt } from './prompt-normalizer'

const INTERNAL_CHECKPOINT = 'erosmixSFWNSFW_v10'

const STYLE_SUFFIX = `
masterpiece,
best quality,
ultra detailed,
anime girl,
beautiful face,
perfect eyes,
detailed eyes,
sharp focus,
cinematic lighting,
highly detailed,
fantasy atmosphere,
beautiful composition
`

const NEGATIVE_PROMPT = `
worst quality,
low quality,
normal quality,
blurry,
bad anatomy,
bad hands,
extra fingers,
missing fingers,
extra limbs,
deformed,
mutated,
duplicate,
watermark,
signature,
logo,
username,
text,
cropped,
jpeg artifacts
`

export const SD_API_URL = (
  process.env.SD_API_URL ?? 'https://tidal-imprint-skipper.ngrok-free.dev'
).replace(/\/$/, '')

export type SdResult = { image: string } | { error: string }

export async function generateWithStableDiffusion(prompt: string): Promise<string> {
  // ── Try server-side call ──
  const result = await trySdCall(prompt)
  if ('image' in result) return result.image

  throw new Error(result.error)
}

async function trySdCall(prompt: string): Promise<SdResult> {
  const normalizedPrompt = normalizePrompt(prompt)

  const fullPrompt = `
${normalizedPrompt},

${STYLE_SUFFIX}
`

  const payload: Record<string, unknown> = {
    prompt: fullPrompt,
    negative_prompt: NEGATIVE_PROMPT,
    width: 480,
    height: 640,
    steps: 20,
    cfg_scale: 7,
    sampler_name: 'DPM++ 2M Karras',
    n_iter: 1,
    batch_size: 1,
    override_settings: {
      sd_model_checkpoint: INTERNAL_CHECKPOINT,
    },
    override_settings_restore_afterwards: true,
  }

  const url = `${SD_API_URL}/sdapi/v1/txt2img`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, */*',
      'ngrok-skip-browser-warning': 'true',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      Referer: 'https://farisium.com',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(120_000),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const snippet = text.slice(0, 200)
    let reason = `HTTP ${res.status}`

    if (text.includes('ngrok') || text.includes('interstitial')) {
      reason =
        'Server cannot reach the Stable Diffusion API. The ngrok tunnel may be inactive or blocked. Try restarting your ngrok tunnel.'
    } else if (res.status === 404) {
      reason = `SD API endpoint not found at ${url}. Check if ngrok is running and pointing to the correct local port.`
    }

    return {
      error: `Generation failed: ${reason} (${snippet})`,
    }
  }

  const data = (await res.json()) as { images?: string[] }
  const image = data.images?.[0]
  if (!image) return { error: 'No image returned from SD API.' }

  const prefixed = image.startsWith('data:') ? image : `data:image/png;base64,${image}`
  return { image: prefixed }
}

export function getSdApiUrl(): string {
  return SD_API_URL
}

