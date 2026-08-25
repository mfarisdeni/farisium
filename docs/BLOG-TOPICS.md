# Strategi Konten Blog Farisium

Dokumen ini menjadi sumber kebenaran tunggal untuk perencanaan, arsitektur, dan produksi seluruh konten blog Farisium.

Sebelum membuat artikel baru, baca dokumen ini bersama:

- `docs/BLOG-WRITING.md` — standar editorial dan publikasi
- `docs/11-seo.md` — panduan SEO
- `docs/12-adsense.md` — standar Google AdSense
- `docs/24-copywriting.md` — gaya penulisan
- `docs/25-content-guidelines.md` — panduan konten

---

# Filosofi Konten

Blog Farisium adalah aset jangka panjang yang dibangun di atas prinsip:

**Human-first, SEO-informed.**

Artinya:

- Konten ditulis untuk membantu manusia, bukan untuk mesin pencari.
- SEO adalah hasil dari kualitas konten, bukan tujuan utama.
- Setiap artikel harus memberikan nilai nyata: solusi, edukasi, atau wawasan.
- Hindari konten tipis, clickbait, atau artikel yang dibuat hanya untuk mengejar kata kunci.

---

# Target Audiens

| Segmen | Kebutuhan Konten |
|---|---|
| Developer | Tutorial teknis, integrasi AI, workflow automation |
| Content Creator | AI tools, prompt engineering, produktivitas kreatif |
| Pebisnis / UMKM | AI for business, SaaS comparisons, implementasi industri |
| Freelancer | Tools rekomendasi, perbandingan platform, tips produktivitas |
| Mahasiswa | Edukasi AI, teknologi terbaru, panduan pemula |
| AI Enthusiast | Deep dive teknologi, perbandingan model, insight industri |

---

# Arsitektur Kategori

Gunakan kategori utama sebagai navigasi blog. Maksimal 6 kategori aktif.

Setiap kategori adalah **topical cluster** yang berisi pillar article dan supporting articles.

## 1. Artificial Intelligence

Fokus: edukasi AI yang mudah dipahami.

### Subtopik
- Generative AI (text-to-image, text-to-video, text-to-audio)
- Stable Diffusion, Flux, ComfyUI
- Prompt engineering untuk berbagai model
- AI workflow dan automation
- AI untuk kreator dan bisnis
- Perbandingan model AI (open source vs proprietary)
- AI tools review dan tutorial

### Target kata kunci
Long-tail, informational intent. Contoh: "cara membuat prompt anime stable diffusion", "perbedaan flux dan stable diffusion", "ai tools untuk content creator 2026".

---

## 2. AI for Industries

Fokus: implementasi AI spesifik industri dengan studi kasus praktis.

### Subtopik
- AI untuk restoran
- AI untuk kesehatan
- AI untuk pendidikan
- AI untuk legal
- AI untuk properti
- AI untuk ecommerce
- AI untuk marketing
- AI untuk manufaktur
- AI untuk logistik
- AI untuk perhotelan

### Target kata kunci
Commercial investigation intent. Contoh: "software AI untuk restoran Indonesia", "ai tools untuk accounting", "implementasi AI di klinik".

---

## 3. SaaS for Industries

Fokus: perbandingan, rekomendasi, dan panduan implementasi software.

### Subtopik
- SaaS untuk restoran
- SaaS untuk sekolah
- SaaS untuk klinik
- SaaS untuk konstruksi
- SaaS untuk accounting
- SaaS untuk agency
- SaaS untuk freelancer
- SaaS untuk properti

### Target kata kunci
Commercial investigation + high CPC. Contoh: "software kasir restoran terbaik 2026", "aplikasi management klinik murah", "platform learning management untuk sekolah".

---

## 4. Digital Education

Fokus: platform pembelajaran, sertifikasi, dan pengembangan skill digital.

### Subtopik
- LMS platforms
- Sertifikasi online
- Creator education
- Professional training
- AI-assisted learning
- Remote education tools
- EdTech comparisons

### Target kata kunci
High CPC, informational. Contoh: "kursus AI online Indonesia", "platform belajar coding terbaik", "sertifikasi machine learning".

---

## 5. Green Technology

Fokus: teknologi ramah lingkungan dan inovasi berkelanjutan.

### Subtopik
- Renewable energy
- Smart building
- Solar technology
- EV charging infrastructure
- Sustainable software
- Carbon reduction tools
- Environmental AI
- Green innovation

### Target kata kunci
High CPM, evergreen. Contoh: "software management energi", "teknologi panel surya untuk bisnis", "green ai computing".

---

## 6. FinTech & Personal Finance

Fokus: edukasi fintech, tools keuangan, dan teknologi pembayaran.

### Subtopik
- Digital payments
- Fintech platforms
- Budgeting apps
- Creator finance
- Accounting software
- Invoicing tools
- QRIS
- Crypto payments (edukasi)
- Payment gateways
- Business finance tools

### Aturan khusus
- Hindari YMYL claims yang membutuhkan saran profesional.
- Gunakan kata "pelajari", "bandingkan", "pahami" — bukan "jamin", "pasti untung".
- Fokus pada edukasi, perbandingan, dan implementasi.

### Target kata kunci
High CPC + High CPM. Contoh: "aplikasi invoice gratis Indonesia", "perbandingan payment gateway", "software accounting untuk UKM".

---

## 7. Tutorials & How-To

Fokus: panduan langkah demi langkah yang memecahkan masalah teknis.

### Cakupan
- Tutorial penggunaan AI Tools Farisium
- Panduan prompt engineering
- Setup dan konfigurasi tools
- Troubleshooting umum
- Workflow dan integrasi

### Target kata kunci
Long-tail, how-to intent. Contoh: "cara generate gambar anime di farisium", "tips prompt anime berkualitas".

---

## 8. Comparisons

Fokus: perbandingan objektif antar tools, platform, atau teknologi.

### Aturan
- Objektif dan berdasarkan data.
- Sebutkan kelebihan dan kekurangan masing-masing.
- Sertakan tabel perbandingan jika relevan.
- Akhiri dengan rekomendasi sesuai use case.

### Target kata kunci
High commercial intent. Contoh: "Stable Diffusion vs Midjourney", "Figma vs Penpot".

---

## 9. Platform Updates & Insights

Fokus: pengumuman fitur baru, perubahan platform, dan insight industri.

### Aturan
- Tetap evergreen — hindari tanggal spesifik di judul.
- Fokus pada analisis, bukan breaking news.
- Hubungkan dengan ekosistem Farisium.

---

# Strategi SEO

## Riset Kata Kunci

1. Targetkan **long-tail keywords** dengan volume pencarian rendah hingga sedang.
2. Prioritaskan **informational intent** dan **commercial investigation**.
3. Hindari head keywords dengan kompetisi tinggi (kecuali sebagai pillar page).
4. Gunakan keyword clustering untuk memperkuat topical authority:

   ```
   Keyword Utama → Artikel Pillar
       ├── Keyword Turunan 1 → Artikel Pendukung
       ├── Keyword Turunan 2 → Tutorial
       ├── Keyword Turunan 3 → Perbandingan
       └── Keyword Turunan 4 → FAQ
   ```

## Metadata

Setiap artikel wajib memiliki:

| Elemen | Aturan |
|---|---|
| Title | Unik, mengandung kata kunci utama, maksimal 60 karakter |
| Meta Description | Unik, 120-160 karakter, mengandung kata kunci dan CTA natural |
| Canonical URL | `https://farisium.com/{locale}/blog/{slug}` |
| Open Graph | title, description, image, url, type |
| Twitter Card | title, description, image |
| Structured Data | BlogPosting + FAQPage (jika ada FAQ) |

## URL & Slug

Format:

```
/{locale}/blog/{slug}
```

Aturan slug:

- huruf kecil semua
- gunakan tanda hubung (-)
- slug Indonesia dan Inggris bisa berbeda
- slug menggambarkan isi artikel secara akurat
- panjang ideal: 3-5 kata

Contoh:

```
/id/blog/stable-diffusion-teknologi-anime-generator
/en/blog/stable-diffusion-technology-behind-anime-generator
```

## Heading Structure

```
H1: Judul Artikel (1 kali)
├── H2: Bagian Utama 1
│   ├── H3: Subbagian 1.1
│   ├── H3: Subbagian 1.2
│   └── H3: FAQ (jika inline)
├── H2: Bagian Utama 2
│   ├── H3: Subbagian 2.1
│   └── H3: Subbagian 2.2
└── H2: Kesimpulan
```

Heading wajib:

- Deskriptif dan mengandung variasi kata kunci.
- Mudah dipindai (scannable).
- Tidak boleh sama persis antar artikel.

---

# Topic Clusters

Setiap kategori adalah topical cluster.

Setiap cluster minimal memiliki:

1. **Pillar Article** — panduan komprehensif yang mencakup topik secara luas.
2. **Supporting Articles** — artikel yang membahas subtopik spesifik.
3. **Tutorials** — panduan langkah demi langkah.
4. **Comparisons** — perbandingan dengan kompetitor atau alternatif.
5. **FAQ Articles** — konten berbasis pertanyaan umum.

## Contoh Cluster: AI Image Generation

```
Pillar: Panduan Lengkap AI Image Generation
├── Tutorial: Cara Membuat Prompt Anime yang Baik
├── Tutorial: Panduan Stable Diffusion untuk Pemula
├── Comparison: Stable Diffusion vs Midjourney vs DALL-E
├── Supporting: Teknologi di Balik Diffusion Model
├── Supporting: Tips Optimasi Kualitas Gambar AI
└── FAQ: Pertanyaan Umum tentang AI Image Generation
```

Semua artikel dalam satu cluster harus saling terhubung melalui internal link.

---

# Internal Linking Strategy

Setiap artikel harus memiliki tautan ke:

| Tujuan | Contoh Anchor Text |
|---|---|
| Artikel terkait dalam cluster | "baca juga panduan prompt engineering" |
| Category hub | "jelajahi semua artikel AI" |
| AI Tools Farisium | "coba Anime Generator Farisium" |
| Homepage | "kunjungi Farisium" |
| Halaman FRSC | "pelajari cara mendapatkan FRSC" |
| Halaman Rewards | "klaim daily reward gratis" |

Aturan:

- Minimal 3 internal link per artikel.
- Gunakan anchor text yang natural dan relevan.
- Link ke halaman Farisium, bukan eksternal, kecuali sumber resmi.
- Prioritaskan link ke artikel dalam cluster yang sama.

---

# Multilingual Content Architecture

Setiap topik harus mendukung dua bahasa:

- Bahasa Indonesia (`/id/blog/{slug}`)
- English (`/en/blog/{slug}`)

## Aturan Multilingual

1. **Slug terpisah per bahasa** — slug Indonesia dan Inggris tidak harus sama.
2. **Metadata unik per bahasa** — title, description, keywords terpisah.
3. **Konten equivalent, bukan terjemahan literal** — adaptasi konteks untuk setiap audiens.
4. **Structured data** — gunakan `inLanguage` yang sesuai.
5. **hreflang** — middleware dan sitemap sudah menangani hreflang secara otomatis.
6. **Internal link disesuaikan** — link dalam artikel bahasa Indonesia mengarah ke `/id/...`, bahasa Inggris ke `/en/...`.

## Prioritas Peluncuran

- Artikel baru bisa dimulai dalam satu bahasa terlebih dahulu.
- Versi bahasa kedua menyusul dalam siklus konten berikutnya.
- Cluster yang sudah mature harus memiliki kedua versi bahasa.

---

# Google AdSense Standards

## Kategori dengan Permintaan Iklan Tinggi

| Kategori | CPC/CPM | Catatan |
|---|---|---|
| SaaS for Industries | High CPM | Perbandingan software, buying guides |
| FinTech & Personal Finance | High CPC + High CPM | Hindari YMYL claims |
| Digital Education | High CPC | Kursus, sertifikasi, platform learning |
| Green Technology | High CPM | Energi terbarukan, sustainability |
| AI for Industries | Medium-High | Implementasi bisnis |

## Praktik Konten Ramah AdSense

- Setiap artikel harus memiliki nilai edukasi yang jelas.
- Jangan membuat artikel hanya untuk mengejar CPC tinggi.
- Konten tipis (kurang dari 300 kata) tidak diperbolehkan.
- Gunakan gambar orisinal — jangan mengambil dari sumber lain.
- Setiap halaman harus memiliki struktur heading yang jelas.
- Hindari layout yang membingungkan atau terlalu padat.
- Sediakan whitespace yang cukup, termasuk di sekitar area iklan.
- Jangan gunakan pop-up, auto-redirect, atau interstitials.

## Area Iklan yang Direkomendasikan

1. **After hero section** — sebelum konten utama dimulai.
2. **Between content sections** — di antara dua H2.
3. **In-content (mobile-friendly)** — setelah paragraf ke-3 atau ke-4.
4. **Before footer** — di akhir artikel sebelum related posts.

---

# Struktur Artikel

Setiap artikel blog harus mengikuti template berikut:

```
┌─────────────────────────────────────┐
│ H1: Judul Artikel                    │
│ Meta Description + Open Graph        │
│ Structured Data (BlogPosting + FAQ)  │
├─────────────────────────────────────┤
│ 1. Pendahuluan                       │
│    - Masalah                         │
│    - Mengapa penting                 │
│    - Apa yang akan dibahas           │
├─────────────────────────────────────┤
│ 2. Pembahasan Utama (H2)             │
│    - Subbagian 1 (H3)                │
│    - Subbagian 2 (H3)                │
│    - Subbagian 3 (H3)                │
├─────────────────────────────────────┤
│ 3. Tips / Best Practices (H2)       │
├─────────────────────────────────────┤
│ 4. FAQ (H2)                         │
│    - Pertanyaan 1 (H3) + Jawaban     │
│    - Pertanyaan 2 (H3) + Jawaban     │
├─────────────────────────────────────┤
│ 5. Kesimpulan (H2)                  │
├─────────────────────────────────────┤
│ 6. Related Articles                 │
│ 7. CTA                              │
└─────────────────────────────────────┘
```

## Panduan Per Bagian

### Pendahuluan
- 2-4 paragraf pendek.
- Jawab: apa masalahnya, mengapa relevan, apa solusinya.
- Sebutkan manfaat yang akan didapat pembaca.

### Pembahasan Utama
- Setiap H2 membahas satu aspek utama topik.
- Gunakan contoh nyata dan studi kasus jika relevan.
- Paragraf maksimal 3-4 kalimat.
- Gunakan list, tabel, atau blockquote untuk variasi.

### FAQ
- Minimal 3 pertanyaan.
- Format: heading H3 + paragraf jawaban.
- Jawab dengan singkat, langsung, dan informatif.
- FAQ digunakan untuk structured data FAQPage.

### Kesimpulan
- Ringkas poin utama artikel.
- Jangan memperkenalkan informasi baru.
- Arahkan ke CTA atau artikel terkait.

### CTA
- Natural, tidak memaksa.
- Contoh: "Coba Anime Generator Farisium sekarang", "Pelajari lebih lanjut tentang FRSC".

---

# Image Pipeline

Setiap artikel minimal memiliki:

1. **Hero image** — 1200×630px, digunakan untuk Open Graph.
2. **Content images** — 1-2 gambar ilustrasi yang mendukung penjelasan.

Proses produksi gambar:

1. Cari referensi gambar bebas hak cipta (jika diperlukan).
2. Gunakan hanya sebagai referensi visual, jangan publikasikan langsung.
3. Regenerasi menggunakan image-to-image dengan model Farisium.
4. Hasilkan gambar bergaya Farisium: Black Platinum + Deep Crimson aesthetic.
5. Optimasi ukuran dan format.
6. Buat ALT text yang deskriptif.
7. Simpan dengan nama file SEO-friendly: `{kategori}-{topik}-{deskripsi}.svg`

ALT text harus:
- Mendeskripsikan isi gambar secara akurat.
- Mengandung kata kunci relevan secara alami.
- Minimal 5 kata, maksimal 125 karakter.

---

# Executive & Editorial Limits

## Per Sesi Produksi

Maksimal: **2 artikel**.

Setelah selesai:

1. Update topical cluster map.
2. Update internal links di artikel terkait.
3. Rekomendasikan 2 topik berikutnya untuk sesi selanjutnya.
4. Berhenti secara otomatis — jangan melanjutkan tanpa persetujuan.

## Quality Gates

Sebelum publish, pastikan:

- [ ] Topik belum pernah dibuat sebelumnya (cek existing articles).
- [ ] Artikel memiliki nilai edukasi yang jelas.
- [ ] Struktur heading benar (H1 sekali, H2/H3/H4 terstruktur).
- [ ] Meta title dan description unik.
- [ ] URL slug sesuai standar.
- [ ] Internal link minimal 3.
- [ ] Gambar memiliki ALT text yang deskriptif.
- [ ] FAQ menyertakan structured data FAQPage.
- [ ] Tidak ada klaim yang tidak bisa dibuktikan.
- [ ] Tidak ada konten tipis atau pengulangan.
- [ ] Mobile-friendly, mudah dipindai.
- [ ] Ramah Google AdSense.

---

# Workflow Produksi

```
1. Baca BLOG-TOPICS.md + BLOG-WRITING.md
2. Review existing articles untuk hindari duplikasi
3. Pilih topik berdasarkan prioritas cluster
4. Riset kata kunci dan tentukan slug
5. Tulis artikel dalam bahasa target
6. Generate gambar (hero + konten)
7. Optimasi SEO (metadata, structured data, internal link)
8. Review akhir
9. Siap untuk upload
10. Update topical cluster map
11. Update internal links di artikel terkait
12. Rekomendasikan 2 topik berikutnya
```

---

# Topical Authority Roadmap

Prioritas pengembangan konten harus mengikuti urutan berikut agar topical authority terbangun secara alami:

## Fase 1: Foundation
Bangun cluster **Artificial Intelligence** sebagai fondasi.

Topik awal:
- Stable Diffusion (sudah ada)
- AI Image Generation (pillar)
- Prompt Engineering (tutorial)
- Cara Kerja Diffusion Model (supporting)

## Fase 2: Ekosistem Farisium
Hubungkan setiap artikel dengan produk Farisium.

- Tutorial Anime Generator
- Panduan FRSC dan Rewards
- AI Compute untuk pengguna

## Fase 3: Ekspansi Industri
Mulai cluster **AI for Industries** dan **SaaS for Industries**.

Pilih industri dengan permintaan iklan tertinggi terlebih dahulu:
- Restoran
- Pendidikan
- Kesehatan

## Fase 4: Diversifikasi
Kembangkan cluster yang tersisa secara bergantian.

---

# Glossary Istilah

| Istilah | Definisi |
|---|---|
| Pillar Article | Artikel komprehensif yang mencakup topik secara luas |
| Supporting Article | Artikel yang membahas subtopik spesifik dalam satu cluster |
| Topic Cluster | Kelompok artikel yang saling terhubung dan memperkuat topical authority |
| Topical Authority | Keahlian yang diakui mesin pencari pada satu topik |
| Internal Link Graph | Jaringan tautan antar halaman dalam satu domain |
| Evergreen Content | Konten yang tetap relevan dalam jangka panjang |
| YMYL | Your Money or Your Life — topik yang bisa memengaruhi keuangan/kesehatan |

---

# Prinsip Akhir

Blog Farisium bukan sekadar kumpulan artikel.

Blog Farisium adalah aset jangka panjang yang membangun:

- **Topical authority** di mata mesin pencari.
- **Kepercayaan** di mata pembaca.
- **Ekosistem** yang menghubungkan setiap bagian Farisium.

Setiap artikel harus menjawab pertanyaan:

> Apakah artikel ini membantu pembaca memahami sesuatu, menyelesaikan masalah, atau mengambil keputusan dengan lebih baik?

Jika jawabannya "tidak", artikel tersebut belum memenuhi standar kualitas Farisium.
