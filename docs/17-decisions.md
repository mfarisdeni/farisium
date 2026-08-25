# Architectural & Business Decisions

Dokumen ini merupakan sumber keputusan resmi proyek Farisium.

Seluruh AI Agent, Developer, dan kontributor harus mengikuti keputusan pada dokumen ini.

Apabila terdapat keputusan baru yang mengubah arsitektur atau arah proyek, dokumen ini wajib diperbarui.

---

# 2026-06-26

## Farisium adalah satu platform

### Keputusan

Seluruh produk dikembangkan sebagai bagian dari satu platform Farisium.

### Implementasi

Homepage berada pada:

/

Seluruh AI Tools berada pada:

/ai/*

Anime Generator:

/ai/anime-generator

### Alasan

Mempermudah pengembangan.

Meningkatkan konsistensi.

Mengurangi duplikasi kode.

Memperkuat branding.

---

# 2026-06-26

## Backend menggunakan Firebase

### Keputusan

Firebase menjadi backend utama.

### Layanan yang digunakan

* Authentication
* Firestore
* Storage
* Functions (jika diperlukan)

### Alasan

* Serverless.
* Cepat dikembangkan.
* Realtime.
* Skalabel.
* Cocok untuk Farisium.

Backend tidak diganti kecuali terdapat keputusan baru.

---

# 2026-06-26

## Deployment

### Keputusan

Deployment menggunakan Cpanel Rumahweb Node.js.

### Workflow

* Build lokal.
* Upload manual melalui File Manager.
* Tidak menggunakan GitHub Deployment.
* Tidak menggunakan Vercel Deployment.

### Alasan

Sesuai dengan workflow pengembangan Farisium.

---

# 2026-06-26

## AI Lokal

### Keputusan

Seluruh AI Development dilakukan menggunakan AI lokal.

### Teknologi

* Ollama
* Open WebUI
* Continue
* Qwen2.5-Coder
* Qwen3

### Alasan

* Privasi.
* Tidak bergantung API eksternal.
* Biaya operasional lebih rendah.
* Dapat dikembangkan secara mandiri.

---

# 2026-06-26

## FRSC

### Keputusan

FRSC digunakan sebagai utility point resmi.

### Alasan

Menghubungkan seluruh layanan Farisium ke dalam satu ekosistem.

FRSC bukan cryptocurrency maupun instrumen investasi.

---

# 2026-06-26

## Partnership

### Keputusan

Program Partnership menggunakan konsep Win-Win Contribution.

### Prinsip

* Bukan investasi.
* Tidak ada pengembalian modal.
* Tidak menjanjikan keuntungan finansial.

### Alasan

Membangun hubungan jangka panjang yang sehat antara Farisium dan komunitas.

---

# 2026-06-27

## Identitas Visual

### Keputusan

Farisium memiliki identitas visual sendiri.

### Referensi

* Stripe
* Linear
* Raycast
* Vercel
* Notion
* Jitter
* Ponder

Nodera hanya menjadi referensi UX pada halaman AI Compute.

### Alasan

Membangun identitas brand yang kuat tanpa meniru produk lain.

---

# 2026-06-27

## UI & UX

### Keputusan

Seluruh halaman harus:

* Premium.
* Dark.
* Modern.
* Minimalis.
* Mobile First.
* Ramah Google AdSense.

### Alasan

Memberikan pengalaman pengguna terbaik sekaligus mendukung pertumbuhan trafik organik.

---

# 2026-06-29

## Rebranding Visual — Black Platinum + Moving Crimson

### Keputusan

Identitas visual Farisium diubah dari purple/blue AI aesthetic menjadi Black Platinum + Moving Crimson.

### Warna yang diubah

- Dominan: Purple (#8b5cf6) dan Blue (#3b82f6) dihapus.
- Dominan baru: Black Platinum (#0a0a0a, #141414, #1a1a1a).
- Aksen baru: Deep Crimson (#8b0015) dengan Moving Gradient (#c41e3a).

### Font

- Heading: Plus Jakarta Sans (sebelumnya Outfit).
- Body: Plus Jakarta Sans (tetap).
- Monospace: JetBrains Mono (sebelumnya Cascadia Code).

### DNA Desain

- Sebelumnya: Stripe + Linear + Raycast + Vercel + Notion + Glassmorphism.
- Sekarang: Farisium Black Platinum + Moving Crimson.
- Referensi eksternal (Stripe, Linear, dll) tetap digunakan sebagai inspirasi UX, bukan DNA visual.

### Glassmorphism

- Sebelumnya: Digunakan secara luas termasuk hero, card, dashboard.
- Sekarang: Hanya untuk modal, dialog, floating panel, search overlay, navbar blur, image preview.
- Card utama menggunakan solid surface.

### Dampak

- Seluruh komponen perlu diperbarui warnanya.
- Homepage, dashboard, dan AI tool pages perlu diredesain visualnya.
- Dokumentasi yang terkait (03-design-system.md, 27-ui-rules.md, 19-farisium-brand.md, 20-ui-components.md) perlu diperbarui.

### File yang dihapus

- `components/navbar.tsx` — dead code (zero imports).
- `components/footer.tsx` — dead code (zero imports).
- `components/hero.tsx` — dead code (zero imports).
- `components/waifu-parallax.tsx` — dead code (hanya diimpor oleh hero.tsx).
- `lib/freeReward.ts` — broken code (useEffect di luar komponen, undefined variables).
- `docs/21-ui-rules.md` — duplikat dari 27-ui-rules.md.

### File yang ditambahkan

- `lib/rewards.ts` — pengganti freeReward.ts dengan fixed logic dan prefix `frsc_`.
- `lib/queue.ts` — composable queue engine (QueueEngine class).
- `hooks/useQueue.ts` — React hook untuk QueueEngine.
- `hooks/useCountdown.ts` — countdown hook yang diekstrak dari pola berulang.
- `hooks/useParallax.ts` — parallax engine yang diekstrak dari waifu-parallax.
- `components/ui/LanguageToggle.tsx` — komponen toggle bahasa yang diekstrak.
- `components/error-boundary.tsx` — React error boundary (class component).
- `app/error.tsx` — root error page.

### Alasan

Farisium membutuhkan identitas visual yang kuat, premium, dan tidak terlihat seperti template AI SaaS generik. Black Platinum memberikan kesan luxury dan timeless, Moving Crimson memberikan aksen berani tanpa menjadi neon.

---

# 2026-06-28

## AI Workstation

### Keputusan

Farisium menggunakan workstation AI lokal sebagai pusat pengembangan.

### Konfigurasi

* Windows + WSL2
* Docker
* Ollama
* Open WebUI
* Continue
* NVIDIA RTX 3070

### Alasan

Memungkinkan pengembangan AI secara mandiri tanpa bergantung pada layanan cloud.

---

# Aturan Perubahan

Setiap keputusan baru harus:

* Memiliki tanggal.
* Menjelaskan keputusan yang diambil.
* Menjelaskan alasan keputusan tersebut.
* Menjelaskan dampak terhadap arsitektur atau bisnis.

Dokumen ini menjadi referensi utama sebelum mengubah teknologi, struktur proyek, maupun arah pengembangan Farisium.
