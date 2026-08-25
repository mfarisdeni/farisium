# Design System v2 — Black Platinum + Metallic Silver

## Identitas

Premium — Modern — Dark — Elegant — Minimal — Professional — Metallic

---

## Palet Warna

### Distribusi Warna

| Persentase | Warna | Peran |
|------------|-------|-------|
| 40% | Deep Black / Graphite | Background, deep surfaces |
| 25% | Platinum Black | Cards, elevated surfaces |
| 15% | Silver / Chrome | Borders, metallic accents, badges |
| 15% | White & Soft White | Text, highlights, separators |
| 5% | Accent (Red & Purple) | CTAs, focus, active states |

### Foundation — Deep Black / Graphite (40%)

| Token | Hex | Penggunaan |
|-------|-----|------------|
| `--frsc-black` | `#0a0a0a` | Latar utama halaman |
| `--background` | `#0a0a0a` | Body background |

### Platinum Black Surfaces (25%) — lebih terang dari v1

| Token | Hex | Penggunaan |
|-------|-----|------------|
| `--frsc-surface-900` | `#181818` | Container, Section background |
| `--frsc-surface-800` | `#1e1e1e` | Card, Komponen |
| `--frsc-surface-700` | `#2a2a2a` | Surface elevated |
| `--frsc-surface-600` | `#363636` | Border subtle |
| `--frsc-surface-500` | `#424242` | Border medium |

### Primary Accent — Moving Crimson (~5%, #E0304E)

| Token | Hex | Penggunaan |
|-------|-----|------------|
| `--frsc-crimson-900` | `#3a000a` | Hover dark, pressed |
| `--frsc-crimson-800` | `#5c0010` | Badge background, button base |
| `--frsc-crimson-700` | `#8b0020` | Hover button |
| `--frsc-crimson-600` | `#b80030` | Gradient midpoint |
| `--frsc-crimson-500` | `#e0304e` | **Primary brand accent** |
| `--frsc-crimson-400` | `#f0506e` | Text link, icon accent |
| `--frsc-crimson-300` | `#ff8098` | Highlight text, light gradient |

### Ambient Accent — Royal Purple (hanya atmospheric light)

| Token | Hex | Penggunaan |
|-------|-----|------------|
| `--frsc-purple-900` | `#1a002e` | Deep gradient base |
| `--frsc-purple-800` | `#2a0048` | Gradient midpoint |
| `--frsc-purple-700` | `#3f1060` | Gradient |
| `--frsc-purple-600` | `#50206b` | Gradient |
| `--frsc-purple-500` | `#642f7f` | **Ambient accent** |
| `--frsc-purple-400` | `#7d4a96` | Light gradient (blur only) |
| `--frsc-purple-300` | `#9a6db0` | Very subtle decorative |

### Silver / Chrome Metallic (15%)

| Token | Hex | Penggunaan |
|-------|-----|------------|
| `--frsc-platinum` | `#eaeaea` | Text highlights, metallic shine |
| `--frsc-platinum-black` | `#d0d0d0` | Secondary metallic |
| `--frsc-silver` | `#c8c8c8` | Silver accents |
| `--frsc-chrome` | `#d6d6d6` | Chrome reflections |

### White & Soft White (15%)

| Token | Hex | Penggunaan |
|-------|-----|------------|
| `--frsc-white-bright` | `#f5f5f5` | Primary text, bright highlights |
| `--frsc-white-soft` | `rgba(255,255,255,0.07)` | Soft white backgrounds |

### Teks — lebih terang dari v1

| Token | Hex | Penggunaan |
|-------|-----|------------|
| `--frsc-text-100` | `#f0f0f0` | Primary body text |
| `--frsc-text-200` | `#d0d0d0` | Secondary text |
| `--frsc-text-300` | `#b0b0b0` | Muted text |

### Aturan Purple
- Purple **hanya** sebagai ambient light — blur, opacity rendah (`/4`–`/8`), tidak pernah solid.
- Dilarang: `text-frsc-purple-*`, `border-frsc-purple-*` (tanpa blur), `bg-frsc-purple-*` (tanpa blur).
- Diizinkan: `bg-frsc-purple-500/5 blur-3xl`, `via-frsc-purple-400/6` (dengan blur).
- Icon backgrounds dengan `to-frsc-purple-800/10`–`/20` diperbolehkan karena surface sangat kecil dan opacity rendah.

### White Accent Utilities

| Utility | Efek |
|---------|------|
| `text-white-bright` | `color: #f5f5f5` |
| `border-white-subtle` | `border-color: rgba(255,255,255,0.10)` |
| `border-white-bright` | `border-color: rgba(255,255,255,0.18)` |
| `bg-white-soft` | `background: rgba(255,255,255,0.04)` |
| `bg-white-subtle` | `background: rgba(255,255,255,0.07)` |
| `separator-white` | Gradient white horizontal line |

---

## Gradient System — Layered Premium Gradients + Metallic

Gradients harus menggunakan **4+ stop** dengan transisi sinematik:

```
Black Platinum → Deep Crimson → Royal Purple → Soft White Highlight → Black Platinum
```

### Animated Gradients (di `globals.css`)

| Utility | Pattern | Durasi | Penggunaan |
|---------|---------|--------|------------|
| `animated-gradient-premium` | BP → Crimson → Purple → White → BP | 16s | Background section besar |
| `animated-gradient-subtle` | Surface-900 → Crimson-900 → Purple-900 → White → Surface-900 | 12s | Background card/container |
| `animated-gradient-text` | Crimson-500 → Crimson-400 → Purple-500 → Crimson-300 → White | 5s | Teks gradien (hero headline) |
| `animated-gradient-crimson` | Crimson-900 → 800 → 600 → 500 | 8s | Solid crimson surface |

### Metallic Gradients (statis, di `globals.css`)

| Utility | Pattern | Penggunaan |
|---------|---------|------------|
| `metallic-platinum` | `#505050 → #707070 → #505050` | Navbar, card header |
| `metallic-silver` | `#585858 → #7a7a7a → #585858` | Badges, accents |
| `metallic-chrome` | `#404040 → #606060 → #404040` | Separators |
| `metallic-graphite` | `#303030 → #4c4c4c → #303030` | Section backgrounds |
| `metallic-white` | Transparent white stops | Shimmer overlay |
| `animated-gradient-metallic` | Graphite shades | Animated metallic background |

---

## Layout

Banyak whitespace. Grid rapi. Container konsisten (`max-w-7xl`, `px-4 lg:px-6`).

---

## Border Radius

| Level | Radius | Penggunaan |
|-------|--------|------------|
| sm | 6px | Button, badge, tag |
| md | 10px | Input, select, tooltip |
| lg | 14px | Card, modal, dropdown |
| xl | 20px | Dialog besar, hero container |
| full | 9999px | Pill, avatar, chip |

---

## Shadow & Glow

### Metallic Shadows (default)
| Utility | Efek |
|---------|------|
| `shadow-metallic` | `0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.3)` |
| `shadow-metallic-lg` | `0 1px 0 rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.35)` |

### Glow utilities (`globals.css`)
| Utility | Efek |
|---------|------|
| `glow-crimson` | `0 0 30px rgba(224,48,78,0.15)` |
| `glow-crimson-strong` | `0 0 40px rgba(224,48,78,0.3)` |
| `glow-purple` | `0 0 30px rgba(100,47,127,0.12)` |

### Border Metallic
| Utility | Efek |
|---------|------|
| `border-metallic` | Gradient border via `border-image` |

---

## Ambient Lighting

Gunakan reusable `AmbientLight` component (`components/ui/ambient-light.tsx`).

Fitur:
- Cursor-reactive radial gradient
- Configurable color (crimson / purple) dan intensity
- Scoped ke container (bukan document)
- `opacity-0` default, muncul saat hover via `group-hover/ambient`

CSS utilities tambahan:
| Utility | Efek |
|---------|------|
| `ambient-glow-crimson` | Radial 600px crimson di 6% |
| `ambient-glow-purple` | Radial 600px purple di 5% |
| `ambient-glow-crimson-strong` | Radial 400px crimson di 12% |
| `lighting-edge-top` | `inset 0 1px 0 rgba(224,48,78,0.15)` |
| `lighting-edge-bottom` | `inset 0 -1px 0 rgba(100,47,127,0.10)` |

---

## Animation System

### CSS Custom Properties
```css
--anim-duration-fast: 0.2s;
--anim-duration-base: 0.35s;
--anim-duration-slow: 0.5s;
--anim-ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);
--anim-ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
--anim-ease-gentle: cubic-bezier(0.4, 0, 0.2, 1);
```

### Framer Motion presets (`lib/motion.ts`)
```ts
springSoft:  { type: 'spring', stiffness: 200, damping: 20 }
springStiff: { type: 'spring', stiffness: 300, damping: 30 }
springGentle:{ type: 'spring', stiffness: 150, damping: 25 }
easeEmphasized: [0.16, 1, 0.3, 1]
staggerQuick / staggerMedium / staggerSlow
fadeUpItem / fadeUpItemFast / fadeInItem
```

Durasi animasi: 150–500ms. Hover: 200–300ms. Entrance: 350–500ms.

---

## Glassmorphism

Glass adalah aksen, bukan fondasi. Hanya pada overlay/modal/navbar scroll.

Parameter: `bg rgba(20,20,20,0.6–0.8)`, `blur 12–20px`, `border 1px solid rgba(255,255,255,0.06)`.

Dilarang pada: Card, Section, Hero, Dashboard panel.

---

## Font

Heading: Plus Jakarta Sans (600–800 weight)
Body: Plus Jakarta Sans (300–500 weight)
Monospace: JetBrains Mono

---

## Fluid Typography Scale (v2.1)

Token tipografi fluida `clamp()` ditambahkan **secara additif** — utility Tailwind default (`text-sm/base/lg/xl/2xl/...`) tetap dipakai untuk layout umum. Token baru dipakai pada heading/hero/eyebrow yang ingin responsive rhythm premium.

| Token | Utility | Range |
|-------|---------|-------|
| `--text-eyebrow` | `text-eyebrow` | 0.75 → 0.85rem |
| `--text-lead` | `text-lead` | 1 → 1.25rem |
| `--text-h4` | `text-h4` | 1 → 1.125rem |
| `--text-h3` | `text-h3` | 1.125 → 1.375rem |
| `--text-h2` | `text-h2` | 1.375 → 1.875rem |
| `--text-h1` | `text-h1` | 1.75 → 2.5rem |
| `--text-hero` | `text-hero` | 2 → 3.25rem |
| `--text-display` | `text-display` | 2.5 → 4.5rem |
| `--leading-hero` | `leading-hero` | 1.05 |
| `--leading-display` | `leading-display` | 1.08 |
| `--tracking-eyebrow` | `tracking-eyebrow` | 0.18em |

Hanya nama **baru** yang ditambahkan — tidak ada override terhadap default Tailwind (`leading-tight`, `tracking-wide`, dll) untuk menjaga kompatibilitas ribuan penggunaan yang ada.

Helper utility:
- `heading-fluid` → font-heading + tight letter-spacing + hero leading + text-wrap balance
- `eyebrow-label` → uppercase + tracking-eyebrow + 600 weight (untuk kicker di atas heading)

---

## Z-Index Scale (v2.1)

Hindari magic number `z-[100]` / `z-[9999]`. Gunakan token semantik:

| Token (raw) | Utility | Nilai | Peran |
|-------------|---------|-------|-------|
| `--z-index-base` | `z-base` | 1 | Konten default di dalam stacking context lokal |
| `--z-index-elevated` | `z-elevated` | 10 | Konten yang sedikit di atas同级 |
| `--z-index-sticky` | `z-sticky` | 50 | Navbar / sidebar sticky |
| `--z-index-dropdown` | `z-dropdown` | 100 | Menu dropdown |
| `--z-index-popover` | `z-popover` | 200 | Popover / tooltip kontekstual |
| `--z-index-modal` | `z-modal` | 300 | Modal / dialog |
| `--z-index-toast` | `z-toast` | 400 | Toast notifikasi |
| `--z-index-loader` | `z-loader` | 500 | Full-screen loader |
| `--z-index-max` | `z-max` | 9999 | Override mutlak terakhir |

> Penting Tailwind v4: utility `z-*` di-generate dari namespace `--z-index-*`. Jangan pakai `--z-*` (hanya akan publish CSS var, tidak membuat utility — penyebab sering bug z-index "tidak bekerja").

Alias legacy `--z-modal` dsb. tetap tersedia (menunjuk ke nilai sama) agar pemakaian raw `var(--z-modal)` di file lama tidak rusak.

---

## Elevation / Glow Primitives (v2.1)

Tambahan additive di luar `shadow-metallic` / `shadow-metallic-lg` yang sudah ada.

| Utility | Efek | Penggunaan |
|---------|------|------------|
| `shadow-floating` | `0 1px 0 white/8%, 0 12px 40px black/40%` | Floating card hover default |
| `shadow-floating-lg` | `0 1px 0 white/10%, 0 20px 60px black/50%` | Floating card prominent |
| `shadow-crimson-glow` | Soft crimson ring + outer glow | CTA / reward accent hover |
| `shadow-crimson-glow-lg` | Stronger crimson glow | Hero CTA / premium highlight |
| `shadow-purple-glow` | Soft purple ambient glow | Decorative accent (low opacity) |

---

## Premium Primitives (v2.1)

| Utility | Efek |
|---------|------|
| `glass-edge-highlight` | Inset 1px chrome reflection di tepi atas (efek "lit from above") |
| `glass-edge-highlight-crimson` | Sama + tint crimson halus |
| `hover-lift` | Smooth translateY(-4px) + shadow-floating saat hover |
| `floating-card` | Idle ambient float 7s (auto nonaktif bila reduced-motion) |
| `skeleton-shimmer` | Sweep loading skeleton 1.6s |
| `bg-noise-grain` | Subtle SVG noise inline (tanpa HTTP request) — depth premium |
| `bg-vignette` | Radial depth di tepi viewport (cinematic) |
| `scrollbar-none` | Sembunyikan scrollbar pada horizontal rail/carousel |
| `scrollbar-thin` | Pakai scrollbar tipis pada area scroll |

Custom scrollbar global aktif: thumb `--frsc-surface-700`, hover `--frsc-surface-500`, track transparan, rounded.

---

## Accessibility & OS Preferences (v2.1)

- `prefers-reduced-motion` → mematikan **semua animasi dekoratif/kontinu** (liquid, gradient, shimmer, float, glow-pulse, skeleton). Animasi entrance/reveal (sekali jalan) **tetap** karena tidak membahayakan vestibular.
- `prefers-contrast: more` → border lebih terang (`0.22`), glass border ikut naik untuk kejelasan.
- `prefers-reduced-transparency: reduce` → backdrop-blur glass diganti dengan solid `--frsc-surface-900` (mengakomodasi Windows "Turn off transparency effects" / Reduced Transparency macOS).

---

## DNA UI

Farisium Black Platinum + Moving Crimson + Royal Purple Ambient.

Referensi eksternal (Stripe, Linear, Raycast, Vercel, Notion) digunakan hanya untuk inspirasi UX — bukan DNA visual. Jangan pernah menyalin identitas visual website lain.
