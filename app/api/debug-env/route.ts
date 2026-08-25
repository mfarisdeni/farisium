import { NextResponse } from 'next/server'
import { getKlikQRISConfig } from '@/lib/klikqris-config'

export async function GET() {
  const fbProject = !!process.env.FIREBASE_PROJECT_ID
  const fbEmail = !!process.env.FIREBASE_CLIENT_EMAIL
  const fbKey = !!process.env.FIREBASE_PRIVATE_KEY
  const klikMode = process.env.KLIKQRIS_MODE ?? '(not set)'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '(not set)'

  // test firebase admin init
  let adminInit: string
  try {
    const { getAdminDb } = await import('@/lib/firebase-admin')
    getAdminDb()
    adminInit = 'ok'
  } catch (e) {
    adminInit = e instanceof Error ? e.message : String(e)
  }

  const cfg = getKlikQRISConfig()

  return NextResponse.json({
    env: {
      FIREBASE_PROJECT_ID: fbProject,
      FIREBASE_CLIENT_EMAIL: fbEmail,
      FIREBASE_PRIVATE_KEY: fbKey,
      KLIKQRIS_MODE: klikMode,
      NEXT_PUBLIC_SITE_URL: siteUrl,
    },
    firebaseAdminInit: adminInit,
    klikqrisConfig: {
      base: cfg.base,
      merchantId: cfg.merchantId,
      apiKeyPrefix: cfg.apiKey.substring(0, 12) + '...',
      mode: klikMode,
    },
  })
}
