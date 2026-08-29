# Deployment Checklist — Farisium

> Dokumen ini berisi daftar periksa untuk deployment produksi melalui **Vercel** yang terintegrasi dengan **GitHub**. Cukup push commit ke branch utama (`main`) — Vercel otomatis build & deploy.

---

## ✅ Pra-push: Verifikasi Lokal

- [ ] `git status` — pastikan tidak ada file/secret sensitif yang akan tercommit
- [ ] `npm ci` — clean install dependencies
- [ ] `npx tsc --noEmit` — pastikan tidak ada type error
- [ ] `npm run build` — production build, pastikan 0 error, 0 warning
- [ ] Test route utama di localhost (dev/start):
  - [ ] `/` — Homepage
  - [ ] `/ai` — AI Tools directory
  - [ ] `/blog` — Blog listing
  - [ ] `/blog/[slug]` — satu artikel
  - [ ] `/frsc` — FRSC info page
  - [ ] `/partnership` — Partnership page
  - [ ] `/login` — Login page
  - [ ] `/dashboard` — Dashboard
  - [ ] `/robots.txt` — Harus ada
  - [ ] `/sitemap.xml` — Harus ada
- [ ] Pastikan environment variables sudah diatur di Vercel Dashboard (Production)

---

## ⬜ Set Environment Variables di Vercel

- [ ] Login ke **Vercel Dashboard**
- [ ] Buka Project → **Settings** → **Environment Variables**
- [ ] Tambahkan variable berikut untuk **Production**:
  - `NEXT_PUBLIC_SITE_URL=https://farisium.com`
  - `NEXT_PUBLIC_FIREBASE_*`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID` (opsional)
  - `NEXT_PUBLIC_API_BASE_URL`
  - SMTP (jika digunakan)
- [ ] Pastikan Build Command terisi: `next build && node scripts/postbuild.mjs`
- [ ] Pastikan framework preset terdeteksi (Next.js)

---

## 🚀 Deploy (Push ke GitHub)

- [ ] `git add` file yang sesuai
- [ ] `git commit -m "..."` — pesan commit yang jelas
- [ ] `git push origin main`
- [ ] Buka **Vercel Dashboard → Deployments** → pastikan deployment terbaru berstatus **Ready**
- [ ] Cek URL production setelah deployment selesai

---

## 🔍 Post-Deployment

- [ ] Visit production URL — pastikan semua halaman termuat
- [ ] Test login dengan Google
- [ ] Test FRSC balance dan reward claim
- [ ] Test fungsionalitas AI (mis. Anime Generator)
- [ ] Test responsive di mobile (Chrome DevTools)
- [ ] Verifikasi `sitemap.xml` bisa diakses
- [ ] Verifikasi `robots.txt` bisa diakses
- [ ] Submit sitemap ke Google Search Console (jika pertama kali)
- [ ] Cek error logs di **Vercel Dashboard → Logs** bila ada kendala
- [ ] Test page speed (Google PageSpeed Insights)

---

## ⚠️ Catatan Penting

1. **Auto-deploy setiap push** — Deployment dipicu otomatis oleh push ke branch `main`; tidak perlu redeploy manual kecuali build gagal.
2. **Hospital & CDN** — Vercel mengelola CDN global, cache, dan env; tidak ada pengaturan server manual.
3. **Environment di Vercel** — Secret/API key tidak boleh dicommit; selalu atur di dashboard Vercel.
4. **API route dinamis** — Pastikan AI backend (mis. Ollama/AI gateway) dapat diakses dari environment Vercel.
5. **Deployment gagal** — Jika deployment berstatus error, periksa Build Logs di Vercel; build lokal (`npm run build`) biasanya mereproduksi error yang sama.
