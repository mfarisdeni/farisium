// Single model — erosmixSFWNSFW_v10 only. Model details are never exposed to the frontend.
export type ModelId = 'waifu'

export interface GenerateRequest {
  prompt: string
}

export interface GenerateResponse {
  image: string
  prompt: string
}

export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  createdAt: number
}

export interface QueueJob {
  id: string
  prompt: string
  position: number
  createdAt: number
  status: 'queued' | 'active' | 'done' | 'error'
}
