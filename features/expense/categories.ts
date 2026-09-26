/**
 * Canonical expense categories + deterministic normalization of whatever the
 * model (or a keyword heuristic) suggests. Pure module — no zod, no server
 * dependencies — so both the client review screen and the server exporters
 * share one vocabulary.
 *
 * Rule: never invent a category. Anything that cannot be matched lands on
 * `other`, which the user can still change in the review table.
 */

export const EXPENSE_CATEGORIES = [
  'food_dining',
  'transportation',
  'accommodation',
  'office_supplies',
  'software_subscription',
  'marketing',
  'entertainment',
  'utilities',
  'travel',
  'shopping',
  'healthcare',
  'other',
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]

export const DEFAULT_CATEGORY: ExpenseCategory = 'other'

export const CATEGORY_LABELS: Record<ExpenseCategory, { id: string; en: string }> = {
  food_dining: { id: 'Makan & Minum', en: 'Food & Dining' },
  transportation: { id: 'Transportasi', en: 'Transportation' },
  accommodation: { id: 'Akomomodasi', en: 'Accommodation' },
  office_supplies: { id: 'Perlengkapan Kantor', en: 'Office Supplies' },
  software_subscription: { id: 'Software & Langganan', en: 'Software & Subscription' },
  marketing: { id: 'Marketing', en: 'Marketing' },
  entertainment: { id: 'Hiburan', en: 'Entertainment' },
  utilities: { id: 'Utilitas', en: 'Utilities' },
  travel: { id: 'Perjalanan', en: 'Travel' },
  shopping: { id: 'Belanja', en: 'Shopping' },
  healthcare: { id: 'Kesehatan', en: 'Healthcare' },
  other: { id: 'Lainnya', en: 'Other' },
}

/** Accepted spellings for each canonical category (AI output is free-form). */
const CATEGORY_ALIASES: Record<ExpenseCategory, string[]> = {
  food_dining: [
    'food_dining',
    'food',
    'dining',
    'food_and_dining',
    'restaurant',
    'meal',
    'cafe',
    'coffee',
    'makan',
    'makanan',
    'minuman',
    'restoran',
  ],
  transportation: [
    'transportation',
    'transport',
    'travel_transport',
    'taxi',
    'grab',
    'gojek',
    'uber',
    'fuel',
    'gasoline',
    'petrol',
    'parking',
    'toll',
    'bensin',
    'parkir',
    'tol',
    'transportasi',
  ],
  accommodation: [
    'accommodation',
    'hotel',
    'hostel',
    'motel',
    'penginapan',
    'inap',
    'akomodasi',
  ],
  office_supplies: [
    'office_supplies',
    'office_supply',
    'office',
    'stationery',
    'alat_tulis',
    'perlengkapan_kantor',
    'atk',
  ],
  software_subscription: [
    'software_subscription',
    'software_and_subscription',
    'software',
    'subscription',
    'saas',
    'hosting',
    'domain',
    'langganan',
    'lisensi',
  ],
  marketing: ['marketing', 'ads', 'advertising', 'promotion', 'backlink', 'promosi', 'iklan'],
  entertainment: ['entertainment', 'entertain', 'hiburan', 'nonton', 'recreation'],
  utilities: [
    'utilities',
    'utility',
    'electricity',
    'water',
    'internet',
    'phone',
    'utilitas',
    'listrik',
    'tagihan',
  ],
  travel: ['travel', 'flight', 'airline', 'plane', 'tiket', 'pesawat', 'perjalanan'],
  shopping: ['shopping', 'retail', 'fashion', 'belanja', 'toko'],
  healthcare: [
    'healthcare',
    'health',
    'medical',
    'clinic',
    'dokter',
    'apotek',
    'kesehatan',
    'rumah_sakit',
  ],
  other: ['other', 'others', 'misc', 'miscellaneous', 'unknown', 'lainnya', 'lain_lain'],
}

/** Second-pass keywords, matched against merchant + item names. */
const CATEGORY_KEYWORDS: Array<[ExpenseCategory, string[]]> = [
  ['food_dining', ['kopi', 'coffee', 'resto', 'cafe', 'warung', 'makan', 'food', 'milestone', 'starbucks', 'kfc', 'mcdonald']],
  ['transportation', ['grab', 'gojek', 'taxi', 'uber', 'mobil', 'bensin', 'parkir', 'tol', 'parking', 'fuel']],
  ['accommodation', ['hotel', 'inn', 'hostel', 'penginapan', 'residence', 'apartemen']],
  ['office_supplies', ['alat tulis', 'stationery', 'kertas', 'pulpen', 'stapler', 'binder', 'printer', 'toner']],
  ['software_subscription', ['hosting', 'domain', 'vps', 'license', 'lisensi', 'subscription', 'saas', 'cloud', 'adobe', 'openai', 'anthropic']],
  ['marketing', ['ads', 'iklan', 'promosi', 'marketing', 'backlink', 'adsense']],
  ['entertainment', ['bioskop', 'cinema', 'hiburan', 'netflix', 'spotify', 'disney', 'steam']],
  ['utilities', ['listrik', 'pln', 'air', 'pdam', 'internet', 'indihome', 'wifi', 'pulsa', 'telkomsel', 'vodafone']],
  ['travel', ['pesawat', 'garuda', 'airasia', 'lion air', 'tiket', 'flight']],
  ['shopping', ['tokopedia', 'shopee', 'lazada', 'amazon', 'bukalapak', 'belanja']],
  ['healthcare', ['apotek', 'kimia farma', 'dokter', 'klinik', 'hospital', 'rumah sakit', 'guardian']],
]

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

/**
 * Map free-form AI text to a canonical category.
 * 1. exact alias match on the normalized value
 * 2. keyword scan over `contextText` (merchant + item names)
 * 3. `other` — never a guess outside the list
 */
export function normalizeCategory(
  value: string | null | undefined,
  contextText?: string | null,
): ExpenseCategory {
  const key = normalizeKey(value ?? '')
  if (key) {
    for (const category of EXPENSE_CATEGORIES) {
      if (CATEGORY_ALIASES[category].includes(key)) return category
    }
  }

  if (contextText) {
    const haystack = contextText.toLowerCase()
    for (const [category, keywords] of CATEGORY_KEYWORDS) {
      if (keywords.some((keyword) => haystack.includes(keyword))) return category
    }
  }

  return DEFAULT_CATEGORY
}

export function isExpenseCategory(value: unknown): value is ExpenseCategory {
  return (
    typeof value === 'string' &&
    (EXPENSE_CATEGORIES as readonly string[]).includes(value)
  )
}
