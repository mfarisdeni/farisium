import { db } from '@/lib/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  type Timestamp,
} from 'firebase/firestore'

export interface FStreamBoostOrder {
  id: string
  uid: string | null
  userEmail: string | null
  artistName: string
  genre: string
  spotifyUrl: string
  contact: string
  paymentMethod: string
  packageName: string
  packageTier: 'paket-1' | 'paket-2'
  priceIdr: number
  priceFrsc: number
  normalPriceIdr: number
  normalPriceFrsc: number
  status:
    | 'pending'
    | 'reviewing'
    | 'waiting_payment'
    | 'processing'
    | 'completed'
    | 'cancelled'
  campaignTarget: {
    streams: string
    listeners: string
    duration: string
  }
  estimatedStartAt: Date | null
  estimatedCompletedAt: Date | null
  adminNote: string
  createdAt: Date
  updatedAt: Date
}

function parseFirestoreDoc(
  doc: { id: string; data: () => Record<string, unknown> },
): FStreamBoostOrder {
  const d = doc.data()
  return {
    id: doc.id,
    uid: (d.uid as string) ?? null,
    userEmail: (d.userEmail as string) ?? null,
    artistName: (d.artistName as string) ?? '',
    genre: (d.genre as string) ?? '',
    spotifyUrl: (d.spotifyUrl as string) ?? '',
    contact: (d.contact as string) ?? '',
    paymentMethod: (d.paymentMethod as string) ?? '',
    packageName: (d.packageName as string) ?? '',
    packageTier: (d.packageTier as FStreamBoostOrder['packageTier']) ?? 'paket-1',
    priceIdr: (d.priceIdr as number) ?? 0,
    priceFrsc: (d.priceFrsc as number) ?? 0,
    normalPriceIdr: (d.normalPriceIdr as number) ?? 0,
    normalPriceFrsc: (d.normalPriceFrsc as number) ?? 0,
    status: (d.status as FStreamBoostOrder['status']) ?? 'pending',
    campaignTarget: (d.campaignTarget as FStreamBoostOrder['campaignTarget']) ?? {
      streams: '',
      listeners: '',
      duration: '',
    },
    estimatedStartAt: d.estimatedStartAt
      ? ((d.estimatedStartAt as Timestamp).toDate?.() ?? null)
      : null,
    estimatedCompletedAt: d.estimatedCompletedAt
      ? ((d.estimatedCompletedAt as Timestamp).toDate?.() ?? null)
      : null,
    adminNote: (d.adminNote as string) ?? '',
    createdAt: d.createdAt
      ? ((d.createdAt as Timestamp).toDate?.() ?? new Date())
      : new Date(),
    updatedAt: d.updatedAt
      ? ((d.updatedAt as Timestamp).toDate?.() ?? new Date())
      : new Date(),
  }
}

export async function getUserFStreamBoostOrders(
  uid: string,
): Promise<FStreamBoostOrder[]> {
  if (!db) return []

  try {
    const ref = collection(db, 'fStreamBoostOrders')
    const q = query(
      ref,
      where('uid', '==', uid),
      orderBy('createdAt', 'desc'),
    )
    const snap = await getDocs(q)
    return snap.docs.map(parseFirestoreDoc)
  } catch {
    return []
  }
}
