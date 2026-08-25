# Animation Guidelines

## Tujuan

Animasi meningkatkan pengalaman pengguna, memperjelas interaksi, dan memberikan kesan premium. Bukan dekorasi.

Setiap animasi harus memiliki tujuan yang jelas.

---

## Filosofi

Animasi harus terasa: halus, ringan, elegan, profesional, cepat, tidak mengganggu.

Karakter motion Farisium: premium, futuristik, minimalis, natural.

---

## Motion System — Single Source of Truth

Semua animasi Framer Motion menggunakan preset dari `lib/motion.ts`:

### Spring Presets
```ts
springSoft:  { type: 'spring', stiffness: 200, damping: 20 }  // interaksi umum
springStiff: { type: 'spring', stiffness: 300, damping: 30 }  // drag, tekan
springGentle:{ type: 'spring', stiffness: 150, damping: 25 }  // entrance halus
```

### Easing
```ts
easeEmphasized: [0.16, 1, 0.3, 1]  // default Farisium
easeExit:       [0.4, 0, 1, 1]     // exit animations
easeOut:        [0.0, 0.0, 0.2, 1] // natural out
```

### Stagger
```ts
staggerQuick  (0.06s) — grid cards
staggerMedium (0.08s) — hero items (default)
staggerSlow   (0.12s) — testimonials, slow reveals
```

### Item Variants
```ts
fadeUpItem     — opacity 0 → 1, y 16 → 0 (500ms)
fadeUpItemFast — opacity 0 → 1, y 10 → 0 (350ms) — untuk mobile
fadeInItem     — opacity 0 → 1 (400ms)
```

GPU acceleration dijamin via Framer Motion `transform` + `opacity` — tidak memicu Layout.

---

## Animated Gradient System

Gradients CSS menggunakan keyframe `gradient-shift`:

```css
background-size: 200%+ 100%;
animation: gradient-shift 5–16s var(--anim-ease-gentle) infinite;
```

Utilities:
- `animated-gradient-premium` — 5-stop (BP → Crimson → Purple → White → BP), 16s cycle
- `animated-gradient-subtle` — 5-stop, 12s cycle
- `animated-gradient-text` — 5-stop text, 5s cycle — **JANGAN DIUBAH** (hero title)
- `animated-gradient-crimson` — 4-stop crimson, 8s cycle
- `animated-gradient-metallic` — 5-stop graphite shades, 10s cycle

### Metallic Gradients (statis)
- `metallic-platinum` — `#505050 → #707070 → #505050`
- `metallic-silver` — `#585858 → #7a7a7a → #585858`
- `metallic-chrome` — `#404040 → #606060 → #404040`
- `metallic-graphite` — `#303030 → #4c4c4c → #303030`
- `metallic-white` — transparent white shimmer overlay

Lama siklus (16s untuk premium) menciptakan transisi sinematik yang hampir tidak terlihat.

---

## Ambient Lighting Animation

`components/ui/ambient-light.tsx`:
- Radial gradient mengikuti cursor via `mousemove`
- `opacity: 0` default → `opacity: 1` saat hover (500ms transition)
- Hanya aktif dalam container (bukan document)

CSS utilities: `ambient-glow-crimson`, `ambient-glow-purple`, `lighting-edge-top`, `lighting-edge-bottom`.

---

## Durasi

| Jenis | Durasi |
|-------|--------|
| Hover | 200–300ms |
| Entrance (stagger) | 350–500ms per item |
| Page transition | tidak digunakan (PageLoader menangani initial load) |
| Gradient shift | 5.000–16.000ms (sangat lambat, sinematik) |

---

## Hover / Card / Button

Pattern konsisten:
```css
transition-all duration-300 ease-out
hover:-translate-y-0.5
hover:shadow-[0_0_30px_rgba(224,48,78,0.06)]
hover:border-frsc-crimson-500/20–/30
active:scale-[0.97]  /* button only */
```

---

## Performance

- Gunakan `transform` dan `opacity` saja — jangan animasi `width`, `height`, `top`, `left`.
- Framer Motion otomatis menggunakan GPU via `will-change: transform`.
- Animasi CSS (gradient shift) menggunakan `background-position`.
- Loading screen: preferensi `prefers-reduced-motion: reduce` dihormati.

---

## Prinsip Akhir

Jika pengguna hampir tidak menyadari keberadaan animasi namun merasa aplikasi sangat nyaman digunakan, maka tujuan motion Farisium telah tercapai.
