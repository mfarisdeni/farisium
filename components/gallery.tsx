'use client'

import { Download, ImageIcon, Timer, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { useGalleryContext } from '@/contexts/GalleryContext'

function formatTime(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function CountdownBadge({ createdAt }: { createdAt: number }) {
  const expiresAt = createdAt + 600_000
  const [secs, setSecs] = useState(() =>
    Math.max(0, Math.round((expiresAt - Date.now()) / 1000)),
  )

  useEffect(() => {
    const iv = setInterval(() => {
      const left = Math.max(0, Math.round((expiresAt - Date.now()) / 1000))
      setSecs(left)
    }, 1000)
    return () => clearInterval(iv)
  }, [expiresAt])

  if (secs <= 0) return null
  const isUrgent = secs < 60

  return (
    <span
      className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-medium backdrop-blur-sm transition-all duration-300 ${
        isUrgent
          ? 'bg-frsc-crimson-800/50 text-frsc-crimson-300 shadow-[0_0_12px_rgba(224,48,78,0.15)]'
          : 'bg-black/50 text-white/80'
      }`}
      aria-label={`Expires in ${formatTime(secs * 1000)}`}
    >
      <Timer className="size-2.5" aria-hidden="true" />
      {formatTime(secs * 1000)}
    </span>
  )
}

function downloadUrl(url: string, id: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = `farisium-anime-${id.slice(0, 8)}.png`
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function Gallery() {
  const { t, lang } = useLang()
  const { images, removeImage } = useGalleryContext()
  const [tappedId, setTappedId] = useState<string | null>(null)

  useEffect(() => {
    if (!tappedId) return
    const handler = () => setTappedId(null)
    document.addEventListener('touchstart', handler, { passive: true })
    return () => document.removeEventListener('touchstart', handler)
  }, [tappedId])

  const expireMsg =
    lang === 'id'
      ? 'Gambar akan terhapus otomatis setelah 10 menit. Download sekarang agar tidak hilang!'
      : 'Images are deleted automatically after 10 minutes. Download now to keep them!'

  return (
    <section
      id="gallery"
      className="mx-auto w-full max-w-6xl px-4 pb-16"
      aria-label={t('galleryTitle') as string}
    >
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between reveal-on-scroll">
        <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
          {t('galleryTitle') as string}
        </h2>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, i) => {
            const isTapped = tappedId === img.id

            return (
              <figure
                key={img.id}
                className="group relative overflow-hidden rounded-xl border border-border bg-frsc-surface-800 transition-all duration-300 hover:border-frsc-crimson-500/30 hover:shadow-[0_0_24px_rgba(224,48,78,0.08)]"
                onClick={() => setTappedId(isTapped ? null : img.id)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.prompt}
                  className="aspect-[3/4] w-full object-cover transition-all duration-500 group-hover:scale-105"
                  onError={(e) => console.error('Gallery img error:', img.id, img.url.slice(0, 80))}
                  onLoad={() => console.log('Gallery img loaded:', img.id)}
                />
                <figcaption
                  className={`absolute inset-0 flex flex-col justify-between p-2 transition-opacity duration-300 ${
                    isTapped ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-end">
                    <CountdownBadge createdAt={img.createdAt} />
                  </div>

                  <div className="flex flex-col gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-4 rounded-b-xl -mx-2 -mb-2 px-2 pb-2">
                    <p className="line-clamp-2 text-xs text-white/90">{img.prompt}</p>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(img.id)
                        }}
                        className="flex size-8 sm:size-7 items-center justify-center rounded-lg bg-white/10 text-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-frsc-crimson-500/30 hover:text-frsc-crimson-300 hover:scale-105 active:scale-95"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-4 sm:size-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadUrl(img.url, img.id)
                        }}
                        className="flex size-8 sm:size-7 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/35 hover:scale-105 active:scale-95"
                        aria-label={t('downloadBtn') as string}
                      >
                        <Download className="size-4 sm:size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </figcaption>
              </figure>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-frsc-surface-600/50 bg-frsc-surface-800/30 py-14">
          <span className="flex size-12 items-center justify-center rounded-xl bg-frsc-surface-700/50">
            <ImageIcon className="size-6 text-frsc-text-300/40" aria-hidden="true" />
          </span>
          <p className="text-sm text-frsc-text-300/60">
            {t('galleryEmpty') as string}
          </p>
        </div>
      )}

      <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <p className="flex items-center gap-2 text-xs text-amber-400/80">
          <Timer className="size-3.5 shrink-0" aria-hidden="true" />
          {expireMsg}
        </p>
      </div>
    </section>
  )
}
