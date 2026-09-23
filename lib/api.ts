/**
 * Pure HTTP/API helpers shared by route handlers.
 * No framework dependency — testable with `node --test`.
 */

export interface ApiErrorOptions {
  status?: number
  code?: string
  fieldErrors?: Record<string, string>
}

export class ApiError extends Error {
  status: number
  code: string
  fieldErrors?: Record<string, string>

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status ?? 500
    this.code = options.code ?? 'internal_error'
    this.fieldErrors = options.fieldErrors
  }
}

export function errorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    return Response.json(
      {
        error: error.message,
        code: error.code,
        ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
      },
      { status: error.status },
    )
  }

  // Never leak internal error details to the client.
  console.error('[api] unhandled error:', error)
  return Response.json(
    { error: 'Terjadi kesalahan tidak terduga.', code: 'internal_error' },
    { status: 500 },
  )
}

export function extractBearerToken(authHeader: string | null | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.slice(7).trim()
  return token.length > 0 ? token : null
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Terjadi kesalahan tidak terduga.'
}