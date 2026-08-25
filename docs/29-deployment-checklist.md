# Deployment Checklist — Farisium

> Dokumen ini berisi daftar periksa yang harus diselesaikan **sebelum upload pertama** ke server produksi (Rumahweb cPanel Node.js).

---

## ⬜ Sebelum Build

- [ ] Generate `og-image.png` (1200×630) dan tempatkan di `/public/`
- [ ] Buat halaman `/blog/[slug]` untuk artikel individual (saat ini 404)
- [ ] Buat halaman `/terms` dan `/privacy` (direferensikan di halaman login)
- [ ] Konfigurasi ulang `.env.local` untuk production:
  - `NEXT_PUBLIC_SITE_URL=https://farisium.com`
  - `NEXT_PUBLIC_FIREBASE_*` — pastikan menggunakan project Firebase production
  - `FIREBASE_PRIVATE_KEY` — pastikan valid
  - `NEXT_PUBLIC_API_BASE_URL` — set ke production AI backend
- [ ] Verifikasi Firebase Security Rules untuk Firestore

---

## ✅ Build & Verifikasi Lokal

- [ ] `git status` — pastikan tidak ada file sensitif yang akan tercommit
- [ ] `npm ci` — clean install dependencies
- [ ] `npm run build` — production build, pastikan 16 routes, 0 error, 0 warning
- [ ] Copy folder `public/` ke `.next/standalone/`
- [ ] `npm start` atau `node .next/standalone/server.js` — test lokal
- [ ] Test semua route di localhost:3000:
  - [ ] `/` — Homepage (semua section termuat)
  - [ ] `/ai` — AI Tools directory
  - [ ] `/ai/anime-generator` — Generator page
  - [ ] `/blog` — Blog listing
  - [ ] `/frsc` — FRSC info page
  - [ ] `/partnership` — Partnership page
  - [ ] `/rewards` — Rewards page
  - [ ] `/login` — Login page
  - [ ] `/dashboard` — Dashboard (redirect jika belum login)
  - [ ] `/robots.txt` — Harus ada
  - [ ] `/sitemap.xml` — Harus ada
  - [ ] `/manifest.webmanifest` — Harus ada
  - [ ] Random path (should show 404 page)
- [ ] Verifikasi Firebase Authentication login flow
- [ ] Verifikasi FRSC coin balance tampil

---

## 📦 Persiapan Upload

- [ ] Hapus folder `node_modules/` dari `.next/standalone/` (akan diinstall di server)
- [ ] Hapus file development yang tidak diperlukan:
  - `docs/`
  - `AGENTS.md`
  - `.gitignore`
  - `Farisium.code-workspace`
  - `pnpm-lock.yaml` (jika pakai npm)
- [ ] Zip isi folder `.next/standalone/` (bukan foldernya, tapi isinya)
- [ ] Pastikan file berikut ada dalam zip:
  - `server.js`
  - `package.json`
  - `.next/` (folder)
  - `public/` (folder)

---

## ☁️ Upload ke cPanel

- [ ] Login ke cPanel Rumahweb
- [ ] Setup Node.js app:
  - Application root → tentukan path
  - Application URL → pilih domain/subdomain
  - Startup file → `server.js`
  - Mode → `Production`
- [ ] Upload zip via File Manager
- [ ] Extract zip di application root
- [ ] Set Environment Variables di cPanel:
  - `NODE_ENV=production`
  - `PORT=3000` (atau port yang ditentukan cPanel)
  - Semua variable dari `.env.local`
- [ ] Jalankan `npm install --production` (jika perlu)
- [ ] Start aplikasi

---

## 🔍 Post-Deployment

- [ ] Visit production URL — pastikan semua halaman termuat
- [ ] Test login dengan Google
- [ ] Test FRSC balance dan reward claim
- [ ] Test Anime Generator flow
- [ ] Test responsive di mobile (Chrome DevTools)
- [ ] Verifikasi sitemap.xml bisa diakses
- [ ] Verifikasi robots.txt bisa diakses
- [ ] Submit sitemap ke Google Search Console
- [ ] Monitor error logs di cPanel
- [ ] Test page speed (Google PageSpeed Insights)

---

## ⚠️ Catatan Penting

1. **og-image.png wajib dibuat** — Tanpa ini, Open Graph tidak akan menampilkan preview saat link dibagikan.
2. **Blog individual pages belum ada** — `/blog/[slug]` akan 404 sampai route dibuat.
3. **Halaman Terms & Privacy belum ada** — Link di halaman login akan 404.
4. **API route** `/api/generate` bersifat dinamis — pastikan AI backend berjalan.
5. **Loading screen** menggunakan `sessionStorage` — hanya muncul sekali per sesi browser. Untuk testing, clear session storage.
