/**
 * Server-side Firebase Auth guard for API routes.
 * Always verifies the Firebase ID token — never trusts client-supplied uid.
 */

import { getAdminAuth } from '@/lib/firebase-admin'
import { ApiError, extractBearerToken } from './api'

export async function requireAuth(request: Request): Promise<string> {
  const token = extractBearerToken(request.headers.get('authorization'))
  if (!token) {
    throw new ApiError('Anda harus login untuk menggunakan fitur ini.', {
      status: 401,
      code: 'unauthorized',
    })
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token)
    return decoded.uid
  } catch {
    throw new ApiError('Sesi tidak valid. Silakan login ulang.', {
      status: 401,
      code: 'invalid_token',
    })
  }
}