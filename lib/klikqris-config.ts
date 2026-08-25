interface KlikQRISConfig {
  base: string
  apiKey: string
  merchantId: string
  snapQuery: string
}

const MODES: Record<string, KlikQRISConfig> = {
  sandbox: {
    base: 'https://klikqris.com/api/sandbox',
    apiKey: 'sk_sandbox_ZVxmxNbH9QeskU6kvuXXWaTt32W0oCfVM6IbNop1IOMc05fKe3EC4l',
    merchantId: '178249170514',
    snapQuery: '?env=sandbox',
  },
  production: {
    base: 'https://klikqris.com/api',
    apiKey: 'AObPeJleuOiYup7YiAiJdNHpRtHexRySd7ipYAJp',
    merchantId: '178249170514',
    snapQuery: '',
  },
}

export function getKlikQRISConfig(): KlikQRISConfig {
  const mode = (process.env.KLIKQRIS_MODE as string) ?? 'sandbox'
  return MODES[mode] ?? MODES.sandbox
}

export function getKlikQRISSnapURL(): string {
  const mode = typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_KLIKQRIS_MODE as string)
    : (process.env.KLIKQRIS_MODE as string)
  const cfg = MODES[mode] ?? MODES.sandbox
  return `https://klikqris.com/js/payment-snap.js${cfg.snapQuery}`
}
