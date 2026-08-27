export const WEB_BUILDER_PACKAGES = {
  startup: {
    name: 'Website Startup',
    pricePerPageIdr: 100000,
    normalPricePerPageIdr: 500000,
    discountPercent: 80,
  },
  freelance: {
    name: 'Website Freelance',
    pricePerPageIdr: 50000,
    normalPricePerPageIdr: 250000,
    discountPercent: 80,
  },
  lokal: {
    name: 'Website Bisnis Lokal',
    pricePerPageIdr: 30000,
    normalPricePerPageIdr: 150000,
    discountPercent: 80,
  },
  portfolio: {
    name: 'Website Portfolio / CV',
    pricePerPageIdr: 20000,
    normalPricePerPageIdr: 100000,
    discountPercent: 80,
  },
} as const

export type WebBuilderTier = keyof typeof WEB_BUILDER_PACKAGES

export const MAX_PAGES = 20

export function calculateWebBuilderTotal(
  tier: string,
  pageCount: number,
): {
  pkg: (typeof WEB_BUILDER_PACKAGES)[WebBuilderTier] | null
  totalPages: number
  totalPriceIdr: number
  normalTotalPriceIdr: number
  discountPercent: number
} {
  const pkg = WEB_BUILDER_PACKAGES[tier as WebBuilderTier] ?? null
  if (!pkg) return { pkg: null, totalPages: 0, totalPriceIdr: 0, normalTotalPriceIdr: 0, discountPercent: 0 }
  const pages = Math.min(Math.max(Math.round(pageCount) || 1, 1), MAX_PAGES)
  return {
    pkg,
    totalPages: pages,
    totalPriceIdr: pkg.pricePerPageIdr * pages,
    normalTotalPriceIdr: pkg.normalPricePerPageIdr * pages,
    discountPercent: pkg.discountPercent,
  }
}

export function generateWebBuilderOrderId(): string {
  const rand = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `WB-${rand}`
}

export type WebBuilderOrderStatus = 'pending_payment' | 'paid' | 'processing' | 'completed' | 'cancelled'

export interface WebBuilderOrderDocument {
  orderId: string
  uid: string
  userEmail: string | null
  name: string
  contact: string
  packageTier: string
  packageName: string
  pages: number
  pricePerPageIdr: number
  normalPricePerPageIdr: number
  totalPriceIdr: number
  discountPercent: number
  notes: string
  status: WebBuilderOrderStatus
  paymentOrderId: string | null
  locale: string
  createdAt: string
  updatedAt: string
  customerOrderEmailSentAt?: string
  customerPaidEmailSentAt?: string
  adminPaidEmailSentAt?: string
}
