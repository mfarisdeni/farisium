# Deployment Preparation — Farisium

> **Fase 7: Production Readiness**
> Dokumen ini mencakup seluruh persiapan yang dilakukan sebelum deployment pertama ke server produksi (Rumahweb cPanel Node.js).

---

## 1. Ringkasan Status

| Area | Status | Keterangan |
|------|--------|------------|
| Build | ✅ Clean | 16 routes, TypeScript bersih, 0 warnings |
| SEO | ✅ Siap | Metadata, sitemap, robots, manifest, canonical, JSON-LD, not-found |
| Performance | ✅ Siap | Compression, caching headers, standalone output, image optimization off |
| Accessibility | ✅ Dasar | Skip-to-content, semantic HTML, ARIA attributes, focus styles |
| Security | ✅ Siap | Security headers, poweredByHeader off, XSS protection |
| Environment | ⚠️ Perlu disesuaikan | .env.local perlu dikonfigurasi ulang untuk production |

---

## 2. Build & Output

### Standalone Output

```bash
npm run build
```

Output berada di:

```
.next/standalone/
├── server.js          # Entry point (gunakan ini untuk menjalankan)
├── package.json       # Production dependencies
├── .next/             # Compiled assets
│   ├── static/        # Static JS/CSS chunks
│   ├── server/        # Server chunks
│   └── ...            # Manifests
├── node_modules/      # Production node_modules
└── public/            # *** HARUS DISALIN MANUAL ***
```

> **PENTING**: Folder `public/` tidak otomatis tercopy ke `.next/standalone/`.  
> Harus disalin manual setelah build:
> ```bash
> Copy-Item -Recurse -Path "public" -Destination ".next/standalone/public"
> ```

### Running Standalone Locally

```bash
cd .next/standalone
node server.js
# Server berjalan di http://localhost:3000
```

### PM2 (Process Manager)

Konfigurasi sudah tersedia di `ecosystem.config.js`:

```js
{
  name: 'farisium',
  script: 'server.js',
  cwd: './.next/standalone',
  instances: 1,
  exec_mode: 'fork',
  env: {
    NODE_ENV: 'production',
    PORT: 3000,
  },
}
```

---

## 3. Environment Variables

### Production Configuration

File `.env.local` harus dikonfigurasi ulang untuk production:

| Variable | Production Value | Keterangan |
|----------|-----------------|------------|
| `NEXT_PUBLIC_SITE_URL` | `https://farisium.com` | **WAJIB** diubah |
| `NEXT_PUBLIC_FIREBASE_*` | Production Firebase config | Dari Firebase Console |
| `FIREBASE_CLIENT_EMAIL` | Production value | Dari Firebase Admin |
| `FIREBASE_PRIVATE_KEY` | Production value | Dari Firebase Admin |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Production ID | Optional |
| `NEXT_PUBLIC_API_BASE_URL` | Production AI backend | URL internal |

### Security Notes

- `.env.local` sudah di-gitignore (tidak akan tercommit).
- Firebase Admin private key tidak terekspos ke publik.
- Seluruh `NEXT_PUBLIC_*` variable aman untuk browser.
- Pastikan `NEXT_PUBLIC_SITE_URL` menggunakan HTTPS di production.

---

## 4. Security Checklist

### Headers

Sudah dikonfigurasi di `next.config.mjs`:

| Header | Value |
|--------|-------|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Powered-By` | Removed (via `poweredByHeader: false`) |

### Static Asset Caching

| Asset Type | Cache Policy |
|------------|--------------|
| Images (png, jpg, svg, webp, mp4) | `public, max-age=31536000, immutable` |
| JS, CSS, fonts | `public, max-age=31536000, immutable` |
| HTML pages | Default Next.js (ETag-based) |

### Robots.txt

- `/api/`, `/dashboard/`, `/profile/`, `/settings/` — disallow.
- Sitemap URL sudah tercantum.
- Admin/Guest pages menggunakan `robots: { index: false, follow: false }`.

---

## 5. SEO Status

### Implemented

- ✅ Title template (`%s | Farisium`) di root layout
- ✅ Metadata untuk setiap halaman:
  - `/` — Platform AI Terpadu
  - `/ai` — AI Tools
  - `/ai/anime-generator` — Anime Generator
  - `/blog` — Blog
  - `/frsc` — FRSC
  - `/partnership` — Partnership
  - `/rewards` — Rewards
  - `/dashboard` — Dashboard (noindex)
  - `/login` — Masuk (noindex)
  - `/reward` — Reward (noindex)
- ✅ Open Graph + Twitter Card
- ✅ Canonical URLs untuk semua halaman utama
- ✅ Sitemap XML (8 URLs)
- ✅ Robots.txt
- ✅ JSON-LD structured data (WebSite schema)
- ✅ Manifest.json (PWA)
- ✅ Custom 404 page (not-found.tsx)
- ✅ Semantic HTML (section, nav, main, figure, heading hierarchy)
- ✅ Icons (light/dark favicon + SVG + apple-touch-icon)

### Belum

- ⚠️ `og-image.png` (1200×630) — belum dibuat. **WAJIB** dibuat sebelum deployment.
- ⚠️ Blog individual pages (`/blog/[slug]`) — routes belum dibuat (akan 404).
- ⚠️ Halaman Terms & Privacy — referenced di login page, belum dibuat.

---

## 6. Performance Status

### Implemented

- ✅ Next.js standalone output (optimized server bundle)
- ✅ Compression enabled (`compress: true`)
- ✅ React Strict Mode
- ✅ Static assets immutable cache (1 year)
- ✅ Lazy loading untuk gallery images (`loading="lazy"`)
- ✅ Video (hero) menggunakan `autoPlay` + `loop` + `muted` + `playsInline`
- ✅ CSS animations via `@keyframes` (GPU-composited)
- ✅ Framer Motion for entrance animations (non-blocking)

### Trade-offs

- `images.unoptimized: true` — Karena cPanel Node.js tidak memiliki sharp. Semua gambar menggunakan `<img>` biasa.
- Font Google di-load via next/font (otomatis dioptimasi). Tidak ada preload manual.
- Bundle size tergantung Next.js production build (tree-shaking otomatis).

---

## 7. Accessibility Status

### Implemented

- ✅ Skip-to-content link (keyboard navigable, visible on focus)
- ✅ Semantic HTML structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<figure>`)
- ✅ ARIA attributes (`aria-label`, `aria-expanded`, `aria-current`, `aria-hidden`, `role="progressbar"`)
- ✅ Heading hierarchy (`h1` → `h2` → `h3`)
- ✅ Focus-visible ring styles
- ✅ Keyboard-navigable dropdown menus
- ✅ Form labels (`htmlFor` on labels)
- ✅ Alt text on images
- ✅ `prefers-reduced-motion` support (loading screen)

### Catatan

- Focus trap di SupportModal belum diimplementasi (modal bisa ditutup via backdrop click).
- Color contrast sudah memadai untuk dark theme.

---

## 8. Asset Checklist

### Public Directory

| File | Status | Keterangan |
|------|--------|------------|
| `farisium-logo.png` | ✅ Ada | Logo utama |
| `farisium-logo-w.png` | ✅ Ada | Logo putih |
| `f-lazyload.png` | ✅ Ada | Loading screen image |
| `farisium-coin.png` | ✅ Ada | FRSC coin icon |
| `icon-light-32x32.png` | ✅ Ada | Favicon light |
| `icon-dark-32x32.png` | ✅ Ada | Favicon dark |
| `icon.svg` | ✅ Ada | SVG favicon |
| `apple-icon.png` | ✅ Ada | Apple touch icon |
| `og-image.png` | ❌ **Belum** | **WAJIB dibuat** (1200×630) |
| `farisium-frsc-web.mp4` | ✅ Ada | Hero demo video |
| `google.jpg` | ✅ Ada | Google sign-in image |
| `qris.jpg` | ✅ Ada | QRIS payment |

---

## 9. Environment Validation

### Pre-deployment Commands

```bash
# 1. Clean install dependencies
npm ci

# 2. Build production
npm run build

# 3. Copy public folder to standalone
Copy-Item -Recurse -Path "public" -Destination ".next/standalone/public"

# 4. Test standalone locally
cd .next/standalone
set PORT=3000
set NODE_ENV=production
node server.js
# Visit http://localhost:3000 — verify all pages load

# 5. Lint check
npm run lint
```

### Files to Exclude from Upload

- `node_modules/` (will be installed on server)
- `.next/` (build output, will be re-created)
- `*.local` files (.env.local gitignored)
- `docs/` (not needed in production)
- `AGENTS.md` (development only)
- `Farisium.code-workspace` (VS Code config)
- `pnpm-lock.yaml` (only if using npm)

### Files to Upload

```
.next/standalone/
├── server.js
├── package.json
├── package-lock.json   (or pnpm-lock.yaml)
├── .next/
│   ├── static/
│   ├── server/
│   └── ...
├── public/
│   ├── (all assets)
│   └── ...
└── node_modules/       (or run npm install on server)
```

---

## 10. Rumahweb cPanel Notes

### Node.js App Setup

1. Login ke cPanel Rumahweb.
2. Buka **Setup Node.js**.
3. Buat aplikasi baru:
   - **Application mode**: `Development` (awal) / `Production`
   - **Application root**: Path ke folder upload
   - **Application URL**: Pilih domain/subdomain
   - **Application startup file**: `server.js` (dari `.next/standalone/`)
   - **Passenger log file**: Biarkan default

4. Upload seluruh file `.next/standalone/` isinya ke application root.
5. Install dependencies (jika perlu): `npm install --production`
6. Start application.

### File Upload Method

1. Zip seluruh isi `.next/standalone/` (tanpa folder parent).
2. Upload zip melalui cPanel File Manager.
3. Extract di application root.
4. Set Environment Variables melalui cPanel (NODE_ENV, PORT, Firebase config, dll).

---

## 11. File Referensi

- `next.config.mjs` — Optimization & security config
- `ecosystem.config.js` — PM2 config (jika menggunakan PM2 di server)
- `.env.example` — Template environment variables
- `app/robots.ts` — Search engine crawling rules
- `app/sitemap.ts` — XML sitemap
- `app/manifest.ts` — PWA manifest
- `app/not-found.tsx` — Custom 404 page
- `app/loading.tsx` — Route-level loading state
- `app/layout.tsx` — Root layout dengan JSON-LD

---

## 12. Deployment Checklist

> Lihat dokumen terpisah: `docs/29-deployment-checklist.md`
