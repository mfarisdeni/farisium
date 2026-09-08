# Farisium Design System — Master (Single Source of Truth)

> Generated via `ui-ux-pro-max` skill + Farisium Design DNA (AGENTS.md).
> Target product: **AI blog / tech media platform** (dark-to-light SaaS content site).
> This file is the single source of truth for all UI work in the blog-redesign-adsense-fix effort.

## 1. Kerangka Tema (Light default, Dark toggle)

- **Light mode = default** (`color-scheme: light`), **dark mode = toggle** (not OS-follow).
- Situs tetap mendukung identitas premium Farisium di KEDUA mode, hanya palet yang berubah.
- Implementasi memakai CSS variables (sudah dipakai project) + Tailwind `dark:` variant.
- Variabel dideklarasikan di `:root` (light) dan override di `.dark` (dark).

## 2. Light Mode Palette

| Token | Light value | Pakai untuk |
|-------|-------------|-------------|
| `--background` | `#FFFFFF` | Latar halaman utama |
| `--foreground` | `#0F172A` (slate-900) | Teks utama (kontras ≥ 4.5:1) |
| `--card` | `#FFFFFF` | Kartu (dengan border) |
| `--card-foreground` | `#0F172A` | Teks kartu |
| `--popover` | `#FFFFFF` | Dropdown/mega-menu |
| `--popover-foreground` | `#0F172A` | |
| `--muted` | `#F1F5F9` (slate-100) | Latar muted |
| `--muted-foreground` | `#475569` (slate-600) | Teks sekunder (kontras ≥ 4.5:1) |
| `--primary` | `#C8102E` (crimson) | CTA primer |
| `--primary-foreground` | `#FFFFFF` | |
| `--accent` | `#E0304E` | Hover/active |
| `--border` | `#E2E8F0` (slate-200) | Border (harus terlihat di light) |
| `--input` | `#E2E8F0` | |
| `--ring` | `#E0304E` | Fokus |

**Farisium accents (tetap dipakai di kedua mode, sebagai aksen SUV/overtone):**
- Crimson `#C8102E` / `#E0304E` — CTA, brand
- Purple `#642F7F` — ambient aksen ringan
- Text body light: `#1E293B`/`#334155`; body text TIDAK pernah `#94A3B8` (kontras kurang).

## 3. Dark Mode Palette (berasal dari desain eksisting)

Pertahankan nilai dark eksisting:

- `--background: #0A0A0A`, `--foreground: #F0F0F0`
- `--card: #1C1C1C`, `--border: rgba(255,255,255,0.10)`
- Crimson/purple surface 900/800/700/600/500, text 100/200/300 eksisting tetap.
- Glass/glass-strong, metallic, shadow, kicker, hero-glow eksisting tetap.

## 4. Typography

- Sans: **Plus Jakarta Sans** (sudah dipakai project) — heading + body.
- Mono: **JetBrains Mono** (sudah dipakai) untuk kode.
- Scale fluid eksisting (`--text-hero/display/h1/h2/h3/lead/eyebrow`) tetap.
- Kontras teks-bg ≥ 4.5:1 (WCAG AA), line-length body nyaman (≈ 65–75ch).

## 5. Layout & Spacing

- Container konsisten `max-w-6xl` / `max-w-7xl`, padding `px-4 sm:px-6 lg:px-8`.
- Whitespace luas; section gap besar (hero → grid).
- Biru: gap grid 24–32px; rounded-2xl untuk kartu (radius `--radius` 0.625rem × 1.4).
- Kartu blog: border tipis + hover ringan (bukan shadow generic "template AI").

## 6. Blog Card / Hero Pattern (blog-focused)

- **Hero**: 1 featured post (kategori, judul besar, ekscerpt, thumbnail).
- **Card**: thumbnail + badge kategori (warna berbeda per kategori) + judul + deskripsi + tanggal + read time + author.
- Badge kategori: AI Tools, Artificial Intelligence, Cybersecurity, Education & Tips, Technology, Tutorials — masing-masing warna map.
- Filter/tab kategori + pagination (URL per halaman).
- Card hover: `cursor-pointer`, `transition-colors/border duration-200`, no layout shift.

## 7. Anti-patterns (HINDAKKAN)

- Emoji sebagai ikon (pakai Lucide).
- Gradient berlebihan / animasi berlebihan.
- Kartu rounded seragam + shadow generic.
- Body text light memakai `slate-400`/`gray-400` (kontras buruk).
- Popup mengganggu, layout shift, banner penuh layar.

## 8. Aksesibilitas

- Focus ring terlihat (`focus-visible` ring-2 ring-crimson).
- `prefers-reduced-motion` dihormati.
- Color bukan satu-satunya indikator.
- Kontras 4.5:1 min di light & dark.
- Responsif: 375 / 768 / 1024 / 1440 px.
