# Deployment Preparation — Farisium

> **Fase 7: Production Readiness**
> Dokumen ini mencakup seluruh persiapan untuk deployment produksi melalui **Vercel** yang terintegrasi langsung dengan **GitHub** (auto-deploy setiap push commit ke branch utama).

---

## 1. Ringkasan Status

| Area | Status | Keterangan |
|------|--------|------------|
| Build | ✅ Clean | TypeScript bersih, 0 warnings, 117 halaman statis |
| SEO | ✅ Siap | Metadata, sitemap, robots, manifest, canonical, JSON-LD, hreflang |
| Performance | ✅ Siap | Compression, caching, image optimization via Vercel |
| Accessibility | ✅ Baik | Skip-to-content, semantic HTML, ARIA attributes, focus styles |
| Security | ✅ Siap | Security headers, poweredByHeader off, XSS protection |
| Environment | ⚠️ Perlu disesuaikan | Environment variables dikelola di dashboard Vercel (bukan file `.env` lokal) |

---

## 2. Build & Output

### Build Command

```bash
next build && node scripts/postbuild.mjs
```

Project ini menggunakan **non-standalone** output. Build dilakukan otomatis oleh Vercel setiap kali ada push ke branch utama.

### Output & Artefak

- Build dijalankan sepenuhnya di cloud Vercel (tidak perlu build lokal sebagai prasyarat deploy).
- Tidak ada upload manual file build, folder `public/`, maupun `node_modules`.
- Halaman statis di-generate saat build (117 halaman), halaman dinamis di-render sesuai kebutuhan.

### Verifikasi Build Lokal (opsional, sebelum push)

```bash
npm ci
npm run build        # pastikan 0 error
npx tsc --noEmit     # pastikan tidak ada type error
```

---

## 3. Environment Variables

### Production Configuration

Seluruh production environment diatur di **Vercel Dashboard → Project → Settings → Environment Variables**, bukan di file lokal.

| Variable | Production Value | Keterangan |
|----------|-----------------|------------|
| `NEXT_PUBLIC_SITE_URL` | `https://farisium.com` | **WAJIB** diatur |
| `NEXT_PUBLIC_FIREBASE_*` | Production Firebase config | Dari Firebase Console |
| `FIREBASE_CLIENT_EMAIL` | Production value | Dari Firebase Admin |
| `FIREBASE_PRIVATE_KEY` | Production value | Dari Firebase Admin |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Production ID | Optional |
| `NEXT_PUBLIC_API_BASE_URL` | Production AI backend | URL internal |
| SMTP (jika digunakan) | Production value | Untuk email transaksional |

### Security Notes

- `.env.local` di-gitignore dan **tidak pernah di-upload ke GitHub**.
- Firebase Admin private key tidak terekspos ke publik.
- Seluruh `NEXT_PUBLIC_*` variable aman untuk browser (umumnya di-inline saat build).
- Set variable di Vercel untuk environment **Production** (dan Preview bila perlu).
- Jangan pernah commit secret/API key ke repository.

---

## 4. Security Checklist

### Headers

Dikonfigurasi di `next.config.mjs`:

| Header | Value |
|--------|-------|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Powered-By` | Removed (via `poweredByHeader: false`) |

### Caching

- Vercel menyediakan CDN global untuk asset statis (JS, CSS, gambar, font).
- HTML ditangani Vercel dengan cache berbasis ETag / ISR sesuai konfigurasi.
- Gunakan `Cache-Control` yang tepat untuk asset statis (immutable untuk hashed assets).

### Robots.txt

- `/api/`, `/dashboard/`, `/profile/`, `/settings/` — disallow.
- Sitemap URL tercantum.
- Admin/Guest pages menggunakan `robots: { index: false, follow: false }`.

---

## 5. SEO Status

### Implemented

- ✅ Title template per halaman
- ✅ Metadata untuk setiap halaman (homepage, AI tools, blog, FRSC, dsb.)
- ✅ Open Graph + Twitter Card
- ✅ Canonical URLs (locale-aware `/id`, `/en`)
- ✅ Hreflang links (ID/EN)
- ✅ Sitemap XML (semua route + blog per locale)
- ✅ Robots.txt
- ✅ JSON-LD structured data (WebSite, BlogPosting, FAQ, Breadcrumb)
- ✅ Manifest.json (PWA)
- ✅ Custom 404 page
- ✅ Semantic HTML

---

## 6. Performance Status

### Implemented

- ✅ Vercel CDN global untuk asset statis
- ✅ Compression enabled
- ✅ React Strict Mode
- ✅ Static assets immutable cache
- ✅ Lazy loading untuk gambar gallery (`loading="lazy"`)
- ✅ Video (hero) menggunakan `autoPlay` + `loop` + `muted` + `playsInline`
- ✅ Framer Motion untuk entrance animation (non-blocking)

### Catatan

- `images.unoptimized: true` dipakai karena alur saat ini; Vercel dapat mengoptimasi gambar jika diaktifkan kembali. Semua gambar saat ini menggunakan `<img>` / `next/image` sesuai kebutuhan.
- Font Google di-load via `next/font` (otomatis dioptimasi di Vercel).
- Bundle size tergantung Next.js production build (tree-shaking otomatis).

---

## 7. Accessibility Status

### Implemented

- ✅ Skip-to-content link (keyboard navigable, visible on focus)
- ✅ Semantic HTML structure
- ✅ ARIA attributes (`aria-label`, `aria-expanded`, `aria-current`, `role="progressbar"`)
- ✅ Heading hierarchy (`h1` → `h2` → `h3`)
- ✅ Focus-visible ring styles
- ✅ Keyboard-navigable menus
- ✅ Form labels
- ✅ Alt text pada gambar
- ✅ `prefers-reduced-motion`

---

## 8. Deploy Flow (Vercel + GitHub)

1. Commit perubahan ke branch utama (`main`).
2. Push ke GitHub.
3. Vercel mendeteksi push dan otomatis menjalankan build & deploy (Production).
4. Deployment baru otomatis tersedia di `https://farisium.com`.
5. Setiap preview (branch non-main) dibuat sebagai **Preview Deployment** dengan URL terpisah (opsional).

### Tidak Perlu Dilakukan Manual

- TIDAK ada upload file ke server.
- TIDAK ada proses manager (PM2) / `server.js` manual.
- TIDAK ada konfigurasi port / environment di server.
- Deployment sepenuhnya dikelola Vercel.

---

## 9. File Referensi

- `next.config.mjs` — Optimization & security config
- `.env.example` — Template environment variables
- `app/robots.ts` — Search engine crawling rules
- `app/sitemap.ts` — XML sitemap (+ per locale)
- `app/manifest.ts` — PWA manifest
- `app/not-found.tsx` — Custom 404 page
- `app/layout.tsx` — Root layout dengan JSON-LD

---

## 10. Deployment Checklist

> Lihat dokumen terpisah: `docs/29-deployment-checklist.md`
