# AGENTS.md

# Aturan Pengembangan AI Farisium

## Gambaran Proyek

Kamu adalah AI Software Engineer utama untuk platform **Farisium**.

Farisium adalah sebuah platform AI terpadu yang berisi berbagai alat berbasis Artificial Intelligence yang bermanfaat. Seluruh fitur merupakan bagian dari satu ekosistem dan **bukan** proyek yang berdiri sendiri.

Produk AI pertama yang dikembangkan adalah **Anime Generator**.

Gunakan Bahasa Indonesia sebagai bahasa komunikasi utama saat menjelaskan, berdiskusi, maupun memberikan rekomendasi.

---

# Tujuan Utama

Selalu prioritaskan prinsip berikut:

1. Sederhana
2. Mudah dikembangkan (Scalable)
3. Mudah dipelihara (Maintainable)
4. Dapat digunakan kembali (Reusable)
5. Performa tinggi

Jangan pernah mengorbankan arsitektur demi solusi jangka pendek.

---

# Tech Stack

## Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS

## Backend

* Firebase Authentication
* Firestore
* Firebase Storage
* Firebase Functions (jika diperlukan)

## Deployment

* Vercel (Hosting & CDN)
* Terintegrasi langsung dengan GitHub (auto-deploy setiap push ke branch utama)

## AI

* Ollama
* Qwen2.5-Coder
* Qwen3
* Opencode VSCode

# Architect

Model:
qwen3.5:9b

Responsibilities

- System Architecture
- Planning
- Documentation
- Feature Breakdown
- Refactoring Strategy

---

# Coding Agent

Model:
qwen2.5-coder:7b

Responsibilities

- Generate Code
- Debugging
- Refactoring
- Unit Test
- Bug Fix

---

# Struktur Proyek

Farisium adalah **satu platform**.

Jangan pernah menyarankan memisahkan fitur menjadi repository yang berbeda kecuali diminta secara eksplisit.

Modul yang saat ini tersedia:

* Homepage
* AI Tools
* Anime Generator
* Dashboard
* Blog
* Rewards
* Partnership

Seluruh AI Tools harus berada pada struktur:

```
/app/ai/
```

Contoh:

```
/app/ai/anime-generator
```

---

# Prinsip Penulisan Kode

Selalu:

* Menulis TypeScript yang bersih.
* Mengutamakan Server Components.
* Mengurangi penggunaan Client Components jika tidak diperlukan.
* Membuat komponen yang reusable.
* Menghindari duplikasi kode.
* Menggunakan async/await.
* Membuat fungsi yang memiliki satu tanggung jawab.
* Membuat komponen kecil dan mudah dipahami.

Jangan pernah:

* Membuat kode yang terlalu rumit.
* Menghasilkan dead code.
* Membuat utility yang sudah tersedia.
* Menggunakan tipe data `any` tanpa alasan yang jelas.
* Menyimpan API Key atau Secret secara hardcode.

---

# Standar Arsitektur

Setiap fitur baru harus:

* Mengikuti struktur folder yang sudah ada.
* Menggunakan utility yang sudah tersedia.
* Menggunakan naming convention yang konsisten.
* Memiliki struktur yang mudah dipelihara.
* Mudah dikembangkan pada masa depan.

---

# Standar UI / UX

Identitas visual Farisium adalah:

* Premium
* Dark
* Modern
* Minimalis
* Elegan
* Profesional

Gunakan:

* Layout yang rapi
* Spacing yang konsisten
* Typography yang konsisten
* Border Radius yang konsisten
* Glassmorphism hanya jika memang diperlukan

Hindari:

* Gradient berlebihan
* Animasi berlebihan
* Warna yang terlalu mencolok
* Desain yang tidak konsisten

---

# Aturan Firebase

Firebase adalah backend utama.

Jangan pernah mengganti Firebase menjadi:

* Supabase
* MongoDB
* PostgreSQL
* Backend lain

kecuali diminta secara eksplisit.

Prioritaskan penggunaan:

* Firestore
* Firebase Storage
* Firebase Authentication

Selalu mempertimbangkan Security Rules.

---

# Prinsip AI Tools

Anime Generator merupakan bagian dari Farisium.

Jangan pernah memperlakukannya sebagai proyek yang berdiri sendiri.

Seluruh AI Tools baru harus mengikuti arsitektur yang sama.

---

# Standar Performa

Selalu optimalkan:

* Fast Loading
* Lazy Loading
* Image Optimization
* Code Splitting
* Bundle Size sekecil mungkin

---

# Standar SEO

Selalu memperhatikan:

* Metadata
* Open Graph
* Structured Data
* Sitemap
* Robots
* Semantic HTML

---

# Aturan Pembuatan Kode

Saat membuat kode:

1. Gunakan utility yang sudah ada.
2. Ikuti struktur folder yang tersedia.
3. Gunakan penamaan yang konsisten.
4. Hindari dependency yang tidak diperlukan.
5. Jelaskan keputusan arsitektur jika penting.
6. Jangan mengubah kode yang tidak berkaitan dengan permintaan.

---

# Dokumentasi

Setiap fitur besar wajib memperbarui dokumentasi pada folder:

```
/docs
```

Jangan pernah membiarkan perubahan arsitektur tanpa dokumentasi.

---

# Gaya Komunikasi

Selalu:

* Menggunakan Bahasa Indonesia.
* Menjelaskan alasan dari setiap rekomendasi.
* Menjelaskan kelebihan dan kekurangan setiap solusi.
* Mengutamakan solusi jangka panjang.
* Memberikan rekomendasi yang mudah dipelihara.

Istilah teknis seperti:

* Next.js
* Server Components
* Firestore
* Authentication
* Deployment
* Code Splitting

tetap menggunakan istilah resminya dalam Bahasa Inggris.

---

# Prioritas Pengambilan Keputusan

Jika terdapat beberapa pilihan implementasi, gunakan urutan prioritas berikut:

1. Mengikuti standar proyek Farisium
2. Skalabilitas
3. Kemudahan pemeliharaan
4. Keterbacaan kode
5. Performa
6. Kesederhanaan

---

# Filosofi Desain Farisium

Farisium memiliki identitas visual sendiri.

Referensi dari website lain hanya digunakan sebagai inspirasi untuk tata letak (layout), pengalaman pengguna (UX), atau alur penggunaan (flow), bukan untuk ditiru secara langsung.

Seluruh halaman harus tetap memiliki identitas visual khas Farisium.

Karakter visual Farisium:

- Premium
- Futuristik
- Elegan
- Minimalis
- Dark Theme
- Glassmorphism yang halus
- Fokus pada keterbacaan
- Banyak ruang kosong (whitespace)
- Tidak berlebihan dalam animasi

Jangan pernah menyalin desain website lain secara utuh.

# Standar UI Ramah AdSense

Seluruh halaman harus dirancang agar nyaman digunakan pengguna dan memenuhi praktik terbaik untuk monetisasi iklan.

Selalu utamakan:

- Kecepatan loading
- Struktur halaman yang jelas
- Navigasi yang mudah
- Keterbacaan konten
- Responsif di perangkat mobile
- Tidak mengganggu pengguna

Gunakan:

- Heading yang terstruktur
- Konten yang mudah dibaca
- Section yang jelas
- Call To Action yang natural
- White space yang cukup

Hindari:

- Pop-up berlebihan
- Layout yang membingungkan
- Banner yang memenuhi layar
- Animasi yang mengganggu
- Elemen yang berpindah-pindah (Layout Shift)
- Teks yang sulit dibaca

Saat mendesain halaman, selalu sisakan ruang yang wajar untuk penempatan Google AdSense tanpa mengganggu pengalaman pengguna.

# Standar Homepage

Homepage harus memiliki struktur berikut:

1. Hero Section
2. AI Tools
3. Compute
4. Keunggulan Farisium
5. Blog Terbaru
6. Partnership
7. FAQ
8. Footer

Homepage harus fokus pada konversi pengguna sekaligus tetap nyaman untuk membaca.

# Referensi Desain & UX

Referensi berikut digunakan sebagai inspirasi untuk pengalaman pengguna (UX), struktur halaman, dan kualitas desain.

Jangan pernah menyalin secara langsung.

Gunakan sebagai acuan untuk memahami pola desain modern, kemudian implementasikan menggunakan identitas visual Farisium.

## Referensi Global

### Stripe

Referensi untuk:

- Hero Section
- Layout Landing Page
- White Space
- Call To Action
- Product Showcase

### Linear

Referensi untuk:

- Navbar
- Typography
- Spacing
- Dashboard
- Konsistensi UI

### Raycast

Referensi untuk:

- Card AI Tools
- Feature List
- Tool Directory
- Empty State

### Vercel

Referensi untuk:

- Pricing Section
- Developer Experience
- Component Layout
- Documentation Style

### Notion

Referensi untuk:

- Footer
- Documentation
- Knowledge Base
- Layout Artikel

### Jitter

Referensi untuk:

- Motion
- Transition
- Micro Animation

Gunakan animasi secara halus dan tidak mengganggu pengguna.

### Ponder

Referensi untuk:

- Scroll Interaction
- Storytelling
- Visual Presentation

### Nodera

Referensi KHUSUS untuk:

- AI Compute
- GPU Compute
- Pricing Compute
- Compute Dashboard

Jangan menggunakan Nodera sebagai referensi branding maupun visual utama.

# DNA Desain Farisium

Identitas visual Farisium merupakan kombinasi dari berbagai inspirasi terbaik, namun tetap memiliki karakter sendiri.

Formula desain Farisium:

Stripe
+
Linear
+
Raycast
+
Vercel
+
Notion
+
Glassmorphism Modern
+
Identitas Visual Farisium

Target akhir bukan meniru website lain.

Target akhirnya adalah ketika pengguna melihat halaman Farisium, mereka langsung mengenali bahwa itu adalah Farisium.

# Standar UX Ramah Google AdSense

Seluruh halaman harus dirancang dengan mengutamakan pengalaman pengguna.

Prioritas:

- Fast Loading
- Mobile First
- Accessibility
- Semantic HTML
- Readability
- Clear Navigation
- Low Layout Shift
- High Content Visibility

Selalu sediakan area yang wajar untuk Google AdSense tanpa mengganggu pengalaman pengguna.

Hindari:

- Pop-up berlebihan
- Auto Redirect
- Layout yang membingungkan
- CTA yang menipu
- Banner memenuhi layar
- Animasi yang mengganggu

# Pengalaman Pengguna

Website Farisium harus terasa:

- Premium
- Cepat
- Bersih
- Menyenangkan untuk dijelajahi
- Mudah dipahami
- Mudah digunakan

Gunakan micro interaction seperlunya.

Jangan membuat animasi yang memperlambat loading atau mengganggu fokus pengguna.

Konten harus selalu menjadi prioritas utama dibanding efek visual.

# Standar Komponen

Seluruh komponen harus:

- Reusable
- Responsive
- Accessible
- Mendukung Dark Mode
- Mudah dikembangkan

Komponen yang digunakan berulang harus dibuat di folder:

/components/ui

Jangan membuat komponen yang sama lebih dari satu kali.

# Cara AI Memberikan Jawaban

Saat diminta membuat fitur:

1. Pahami tujuan pengguna.
2. Analisis arsitektur yang sudah ada.
3. Gunakan komponen yang tersedia.
4. Jelaskan alasan teknis jika diperlukan.
5. Berikan solusi yang paling sederhana namun tetap scalable.

Jangan langsung membuat kode jika masih ada informasi penting yang kurang.


# AI Agents

Farisium menggunakan OpenCode sebagai AI Development Environment dengan dua agent utama.

---

# Architect Agent

Model:
qwen3.5:9b

Role:

- System Architecture
- Feature Planning
- Database Design
- API Design
- Documentation
- Code Review Strategy

Prompt Rules:

- Fokus pada analisis, bukan implementasi.
- Jangan langsung menghasilkan kode lengkap kecuali diminta.
- Selalu pecah fitur menjadi task yang lebih kecil.
- Prioritaskan maintainability dan scalability.
- Pertimbangkan dampak perubahan terhadap seluruh project.

Output:

- Architecture
- Flow Diagram
- Database Schema
- API Specification
- Task Breakdown

---

# Coding Agent

Model:
qwen2.5-coder:7b

Role:

- Coding
- Refactoring
- Debugging
- Testing
- Bug Fixing


# Prompt Rules

- Implementasikan hanya task yang diberikan.
- Jangan mengubah file di luar scope.
- Ikuti coding style project.
- Jangan membuat dependency baru tanpa alasan.
- Berikan kode yang siap dijalankan.

Output:

- Source Code
- Unit Test
- Refactor
- Bug Fix


# Aturan Khusus Farisium

Selalu ingat bahwa:

* Farisium adalah satu platform terpadu.
* Backend utama menggunakan Firebase.
* Deployment menggunakan Vercel dengan integrasi GitHub (auto-deploy setiap push ke branch utama).
* AI lokal menggunakan Ollama.
* Model utama adalah Qwen2.5-Coder dan Qwen3.
* Seluruh kode harus siap untuk produksi.
* Jangan membuat file, folder, library, atau dependency baru jika tidak benar-benar diperlukan.

---

# Aturan Terakhir

Kamu bukan hanya menghasilkan kode.

Kamu adalah AI Software Engineer yang bertanggung jawab menjaga kualitas, konsistensi, dan perkembangan jangka panjang ekosistem Farisium.

Setiap keputusan harus membuat proyek menjadi lebih mudah dikembangkan, lebih mudah dipelihara, dan lebih siap untuk berkembang di masa depan.

---

# Catatan Sesi untuk AI

## Ringkasan Singkat Sesi Saat Ini

Farisium = Next.js 16.2.6, React 19, TypeScript, Tailwind CSS v4, Firebase, Vercel deployment with GitHub integration. Non-standalone build. Build command: `next build && node scripts/postbuild.mjs`. Released by pushing commits to the main branch — Vercel auto-deploys on every push. No PM2/cPanel; deploy is fully managed by Vercel.

Blog content lives in `lib/blog.ts` — flat `posts` array. Articles are added in ID and EN with links trimmed (max 4 internal + 4 external per article). Slugs differ per locale (ID slug vs EN slug).

SEO Caption Generator (`/ai/seo-caption-generator`): live tool, API uses Ollama (`llama3.2:3b`) via gateway. Cold-start model load can cause first-request 500 — that's infra, not code. The `buildSystemPrompt(language)` fix is in `lib/ai/prompts/seoCaptionPrompt.ts`; route.ts uses it.

The page (`app/ai/seo-caption-generator/page.tsx`) now supports full bilingual UI (ID/EN) following the anime-generator pattern:
- `LangContext.Provider` + `useLangState()` at root level
- `useLang()` inside `CopyButton` and `ResultCard` for small labels (Copy/Salin, characters/karakter)
- `pageContent` object with `id` + `en` keys for all UI strings
- Option arrays (`platforms`, `toneOptions`, `audienceOptions`) use same `value` (API) with translated `label`
- Only plain text translated — generate logic, API calls, component interfaces unchanged
4 SVGs in `public/blog/` updated to `farisium.com` + English text.

Artikel blog terbaru: AI Superintelligence — dibahas lengkap pengertian, pemain utama, manfaat, tantangan safety, timeline, FAQ. 2 SVG animated, 4 internal + 4 external links.

Artikel terbaru kedua: Cara Mengatasi AI Agent Stuck Loop — tutorial troubleshooting infinite loop, deadlock, API timeout, state corruption. 2 SVG animated (hero + solutions), 4 internal + 4 external links. Target keyword: cara mengatasi ai agent stuck loop.

Artikel terbaru ketiga: Ciri-Ciri WA Disadap dan Cara Mengatasinya — panduan lengkap keamanan WhatsApp: tanda penyadapan, cara memeriksa, langkah mitigasi darurat, dan tips pencegahan. 2 SVG animated (warning signs + security steps), 4 internal + 4 external links. Target keyword: ciri ciri wa disadap dan cara mengatasinya.

## Yang Baru / Berubah di Sesi Ini

### Artikel baru: How to Build an AI Workflow That Actually Saves Time (EN-only)

Artikel EN-only baru `ai-workflow-that-saves-time` ditambahkan ke `lib/blog.ts` (tanggal 27 Agustus 2026), mengikuti pola EN-only yang sudah ada (`ai-research-verification`):

- **EN slug**: `how-to-build-ai-workflow-that-saves-time` (~3846 kata, 24 min read, kategori Tutorials)
- **SEO**: title/metadata sesuai brief, primary keyword "AI workflow for small business"
- **3 SVG animated baru** di `public/blog/` (gaya konsisten: dark bg #0a0a0f→#0d1117, crimson #e0304e + purple #642f7f, Inter, grid halus, animasi):
  - `ai-workflow-hero.svg` — hero: 4 layer framework (Trigger → AI Task → Human Control → Output) dengan flow line dash + 2 chip konsep
  - `ai-workflow-failures.svg` — inline: 3 failure pattern (tool-first, undefined process, high-risk too early)
  - `ai-workflow-measure.svg` — inline: Before vs After AI + metrik (completion time, correction rate, quality)
- **4 internal + 4 external link** (EN): freelance-designers, content-marketing, work-productivity, best-ai-agents (+ zapier.com, make.com, openai.com, anthropic.com)
- Konten ditulis ulang dari struktur artikel (framework 4 layer, workflow freelancer/SMB/content, fail-safe, measure, checklist, FAQ, final thoughts) — bukan copy-paste mentah
- 8 H2 + 8 FAQ per locale (EN), path table scoring diubah jadi paragraf karena renderer tidak support table
- Build verified: TypeScript 0 errors, Next.js build success, slug masuk sitemap `/en/blog/how-to-build-ai-workflow-that-saves-time`

### Artikel `ai-research-verification`: dibuat versi ID + slug "halu"

Artikel `ai-research-verification` (EN-only, slug `how-to-use-ai-for-research-without-hallucinations`) kini punya versi **ID** memakai **SVG yang sama** (`ai-research-verification-hero.svg`, 1 gambar inline di section workflow 7 langkah):

- **ID slug**: `cara-memakai-ai-untuk-riset-tanpa-halu` (kata "hallucinasi" di judul & slug diganti "halu" atas permintaan user; ~3550 kata, 18 menit, kategori Teknologi)
- **ID title**: "Cara Memakai AI untuk Riset Tanpa Halu: Workflow Verifikasi 7 Langkah di 2026"
- **Internal links ID** (3 blog + `/ai` CTA): cara-menggunakan-ai-untuk-produktivitas-kerja, masa-depan-ai-indonesia-2026, + `/ai`
- **External links ID** (5, sama dengan EN): Harvard study, TechTarget, Google Scholar, Semantic Scholar, Scite.ai
- Konten diterjemahkan penuh dari EN (7 langkah workflow, contoh desainer grafis, 5 prompt, evaluasi sumber, citation laundering, checklist, 7 FAQ, kesimpulan)
- Build verified: TypeScript 0 errors, Next.js build success (115 halaman), slug ID masuk sitemap `/id/blog/cara-memakai-ai-untuk-riset-tanpa-halu`

### Internal + external links untuk 3 artikel terbaru (sesi berjalan)

Semua 3 artikel baru kini memenuhi standar max 4 internal + 4 external per locale. Audit via script `C:\Users\compa\AppData\Local\Temp\opencode\audit-links.cjs` (hitung link per blok artikel + deteksi format single-bracket yang tidak didukung renderer):

- **`ai-superintelligence-jobs`** ID/EN: internal tetap 4, external ditambah 4 — OpenAI (openai.com), Anthropic (anthropic.com), WEF Future of Jobs Report 2025, McKinsey economic potential of generative AI
- **`ai-voice-cloning-scam`** ID/EN: internal 2→3 (+ agentic-ransomware `apa-itu-agentic-ransomware`/`what-is-agentic-ransomware`), external ditambah 4 — NCSC UK (ncsc.gov.uk), FCC AI robocall ruling, WhatsApp Help Center (faq.whatsapp.com), FTC family emergency scam alert
- **`ai-for-freelance-designers`** ID/EN: internal tetap 3, external ditambah 4 di list "Tools yang Bisa Kamu Coba"/"Tools Worth Trying" — ChatGPT (chatgpt.com), Midjourney (midjourney.com), Notion AI (notion.so/product/ai), Grammarly (grammarly.com)

Catatan teknis: saat menulis link baru mudah typo format `[teks](url)` single-bracket — renderer hanya mendukung `[[teks](url)]`; audit script sekarang bagian dari rutinitas verifikasi artikel. Build verified: TypeScript 0 errors, Next.js build success.

### Artikel baru: AI Superintelligence & Pekerjaan + Penipuan AI Voice Cloning (sesi berjalan)

Dua artikel baru ditambahkan ke `lib/blog.ts` (tanggal 22 Agustus 2026), keduanya ID+EN dengan konten ≥1000 kata per locale:

**Artikel 1: `ai-superintelligence-jobs`** — companion piece ke artikel pillar `ai-superintelligence`/`ai-superintelligence-explained` dengan search intent berbeda (karir/pekerjaan) supaya tidak kanibalisasi:
- ID slug `apakah-ai-superintelligence-menggantikan-pekerjaan` (1115 kata, 7 menit, kategori Artificial Intelligence)
- EN slug `will-ai-superintelligence-replace-your-job` (1130 kata, 8 min read)
- Konten: pekerjaan paling berisiko vs relatif aman, pandangan ekonom, skill anti-ganti, langkah konkret, 4 FAQ
- Internal links: `/blog/ai-superintelligence` (+EN mirror), kursus-ai-online-terbaik-2026, tips-memulai-karir-ai (+EN mirror), masa-depan-ai-indonesia-2026
- SVG hero baru: `public/blog/ai-superintelligence-jobs-hero.svg` (human worker vs AI chip terhubung garis data)

**Artikel 2: `ai-voice-cloning-scam`** — angle keamanan digital, selaras performa artikel ciri-ciri-wa-disadap:
- ID slug `waspada-penipuan-ai-voice-cloning` (1038 kata, 7 menit, kategori Tutorial)
- EN slug `ai-voice-cloning-scams-how-to-recognize` (1132 kata, 8 min read, kategori Tutorials)
- Konten: cara kerja voice cloning, modus penipuan (kecelakaan/penculikan/atasan/OTP), kenapa pengguna Indonesia target empuk, ciri-ciri, langkah verifikasi, perlindungan keluarga, 4 FAQ
- Internal links: ciri-ciri-wa-disadap-dan-cara-mengatasinya (+EN mirror signs-whatsapp-is-hacked-and-how-to-fix), masa-depan-ai-indonesia-2026
- SVG hero baru: `public/blog/ai-voice-cloning-scam-hero.svg` (phone fake call + waveform original vs AI clone)

**PENTING — format inline link blog**: renderer `renderRichText()` di `app/blog/[slug]/page.tsx` HANYA mendukung format `[[teks](/url)]` (kurung tutup SETELAH paren, 468 pemakaian existing). Format `[[teks]](/url)` TIDAK match regex split/match → link dirender sebagai teks mentah. Konten draft eksternal sering datang dengan format salah — selalu konversi sebelum paste.

**ATURAN AUTHORING — body artikel harus PLAIN TEXT**: `renderRichText()` memperlakukan body sebagai plain text dan TIDAK memproses sintaks Markdown emphasis. Saat menempel draft ke `lib/blog.ts`, jangan pernah menyertakan marker styling mentah seperti `**teks**`, `*teks*`, `` `teks` ``, `__teks__`, atau blokquote. Marker `**` dan backtick akan TERLIHAT LITERAL di halaman publik (efek spam double-asterisk). Tulis body apa adanya (tanpa `**`). Satu-satunya sintaks yang boleh dipakai adalah link `[[label](url)]` yang didukung renderer. Jangan menambahkan fitur bold/Markdown baru ke renderer untuk menggantikan asterisk — konvensi editor adalah plain text. (Catatan: identifier teknis seperti nama komponen/kode cukup ditulis polos, mis. `text_to_speech`, tanpa backtick.)

**Catatan teknis**: script hitung kata lama (`count-blog-words.mjs`) rusak karena `lib/blog.ts` kini mengimpor `@/lib/i18n`. Script baru: `C:\Users\compa\AppData\Local\Temp\opencode\count-new-articles.cjs` (parsing substring + regex escape-aware). Semua slug internal link diverifikasi ada sebelum paste. Build verified: TypeScript 0 errors, Next.js build success (107 halaman).

### Fix SEO indexing: semua canonical/locale-aware URL + badge blog Live (sesi berjalan)

**Masalah**: hampir semua canonical URL ditulis bare (`https://farisium.com/about`) padahal middleware mewajibkan prefix locale (`/id|/en`) — Google meng-crawl URL yang self-redirect → gagal indeks (kasus GSC "Redirect error" untuk `/blog/` dan `/blog/<slug>`).

- **Helper baru `lib/i18n.ts`**: `getCanonicalUrl(locale, path)` → `https://farisium.com/${locale}${path}`; dipakai dengan `getHreflangLinks()` existing.
- **Pola wajib generateMetadata** (page/layout): `const cookieStore = await cookies(); const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang`; lalu `alternates: { canonical: getCanonicalUrl(lang, '/path'), languages: Object.fromEntries(getHreflangLinks('/path', lang).map(a => [a.lang, a.href])) }` + `openGraph.url: getCanonicalUrl(lang, '/path')`.
- **Semua page/layout dimigrasi** (~28 file): homepage, `/ai`, `/ai/website-builder`, about, contact, faq, frsc, rewards, competition, privacy, terms, disclaimer, cookie-policy, author/faris, claim-free-frsc, blog listing, community, partnership, login, dashboard, reward, payment-logs, ai/anime-generator, ai/fium, ai/seo-caption-generator, ai/f-stream-spotify-promotion. Halaman noindex tetap noindex tapi canonical-nya ikut diperbaiki. `frsc-audit-trail-x7k9m2n4` dibiarkan.
- **`app/sitemap.ts` full rewrite**: staticPaths + priorities/changeFreq maps, loop locales × paths, blog per-locale pakai `t.slug`.
- **Root `app/layout.tsx`**: alternates.languages → `/id`, `/en`, x-default en; og url locale-aware. JSON-LD entity schema (Organization/Person/author url) sengaja dibiarkan bare — entity ID stabil, bukan canonical halaman.
- **`app/blog/[slug]/page.tsx`**: validasi slug lintas bahasa `if (t && t.slug !== slug) redirect('/' + lang + '/blog/' + t.slug)`; breadcrumb schema locale-aware; `getRelatedPosts(t.slug)`.
- **`lib/blog.ts`**: `generatePostSchema(post, lang, slug?)` + `generateCollectionPageSchema` locale-aware via getCanonicalUrl.
- **PENTING — jebakan berulang saat edit**: import baru sering salah ketik `import { x } = 'mod'` (harusnya `from`) dan menyebabkan TS1005 'from' expected — selalu jalankan `npx tsc --noEmit` setelah batch edit metadata.
- **Badge blog → Live**: entri AI Blog di `app/ai/page.tsx` toolsData DAN `components/home/AIToolsSection.tsx` (ID+EN) dari `available: false, badge: 'Segera'/'Coming Soon', outline` → `available: true, badge: 'Live', crimson`.
- Middleware/next.config dicek: tidak ada redirect ganda dari config Next.js sendiri (hop pertama = middleware locale redirect, normal). "Redirect error" GSC sebelumnya disebabkan canonical bare yang menunjuk URL non-prefix — kini teratasi karena canonical selalu menunjuk URL final ber-prefix.
- Build verified: TypeScript 0 errors, Next.js build success.

### Fitur baru: Jasa Pembuatan Website (`/ai/website-builder`) (sesi berjalan)

Halaman pemesanan pembuatan web untuk awam teknologi — copywriting sederhana, form direct 5 kolom, checkout FRSC server-side:

- **4 paket** (1 FRSC = Rp 1, harga promo diskon 80% dari harga umum pasar, angka normal dicoret):
  - Web Startup: ~~Rp 500rb~~ **Rp 100rb**/halaman (100 FRSC)
  - Web Freelance: ~~Rp 250rb~~ **Rp 50rb**/halaman (50 FRSC)
  - Web Bisnis Lokal: ~~Rp 150rb~~ **Rp 30rb**/halaman (30 FRSC) — default terpilih + badge "Paling Laris" di Portfolio
  - Portfolio/CV: ~~Rp 100rb~~ **Rp 20rb**/halaman (20 FRSC)
- **Ketentuan**: 1x revisi semua paket, fokus landing page, tanpa fitur rumit (login member/e-commerce/API), domain & hosting di luar harga
- **File baru**:
  - `app/ai/website-builder/layout.tsx` — metadata SEO bilingual (title/description/OG/canonical)
  - `app/ai/website-builder/page.tsx` — client component pola `pageContent {id,en}` + LangContext; hero urgency ("harga pembukaan 50 pesanan pertama"), grid paket dengan harga coret + badge -80%, include/exclude section, 4 langkah cara kerja, form (nama, WA, paket, jumlah halaman 1–20, catatan opsional), ringkasan total live + saldo FRSC + saldo setelah bayar, login gate, tombol TopupButton saat saldo kurang, success screen dengan orderId, FAQ `<details>` native
  - `app/api/web-builder/order/route.ts` — checkout server-side pola F-Stream: validasi input, cek & potong saldo via Admin SDK (`users/{uid}.coins`), log `frscTransactions` type 'spend', simpan order ke collection **`webBuilderOrders`**, email notifikasi nodemailer (env SMTP tanpa fallback password hardcode). Harga sumber kebenaran ada DI SINI — mirror client di PACKAGES page.tsx harus disinkronkan manual
- **Kartu ditambahkan** (posisi pertama, icon Globe, badge 'Promo') di `app/ai/page.tsx` toolsData dan `components/home/AIToolsSection.tsx` toolsData (ID+EN)
- **SEO**: entri `ai/website-builder` (priority 0.8, weekly) **dan** `ai/f-stream-spotify-promotion` (priority 0.8, weekly) ditambahkan di `app/sitemap.ts`; robots.txt sudah allow `/ai/*`; layout TANPA noindex (halaman live, beda dari 3 tools maintenance)
- **Footer**: link 'Jasa Pembuatan Website' / 'Website Building Service' ditambahkan ke grup 'AI Tools' (`components/layout/Footer.tsx`) dengan mapping bilingual via `linkLabels`
- **Dashboard**: quick link 'Jasa Pembuatan Website' / 'Website Building Service' ditambahkan ke `quickLinks` ID+EN (`app/dashboard/page.tsx`) posisi setelah Klaim Daily Reward
- Catatan: `useLang()` mengembalikan objek `{ lang, setLang, t }` — destructure dulu, jangan dipakai langsung sebagai string
- Build verified: TypeScript 0 errors, Next.js build success

### Artikel baru: AI untuk Freelancer Desain + bug fix parsing tanggal (sesi berjalan)

**Artikel baru** `ai-for-freelance-designers` (ID slug `ai-untuk-freelancer-desain-brief-sampai-revisi` / EN `ai-for-freelance-designers-brief-to-revision`) — 1213/1318 kata, readTime 9 menit/9 min read, kategori Tutorial/Tutorials, 4 FAQ per locale, 3 internal links per locale (prompt-anime 2x, desain-grafis, produktivitas-kerja), CTA ke /ai:

- 3 SVG animated baru di `public/blog/` (gaya konsisten: dark bg #0a0a0f→#0d1117, crimson #e0304e + purple #642f7f, Inter, grid halus, animasi pulse/glow/dash):
  - `ai-freelance-designer-workflow-hero.svg` — hero: pipeline 5 tahap Brief→Research→Concepts→Communication→Revisions dengan chip AI ASSIST
  - `ai-freelance-designer-brief-checklist.svg` — inline Tahap 5: feedback berantakan (WA/voice note/PDF) → AI → checklist revisi terprioritas P1/P2 + flag SCOPE
  - `ai-freelance-designer-tools-stack.svg` — inline section Tools: 4 kartu (Writing Assistant, Image Generator, Docs AI, Grammar Checker)
- Excerpt di-rewrite agar keyword utama di 100 char pertama (standar on-page SEO)

**Bug fix — parsing tanggal Indonesia**: `new Date('21 Agustus 2026')` = Invalid Date karena parser Date bawaan Node hanya mengenali SEBAGIAN nama bulan Indonesia via ICU (Juli/Juni/September OK; Agustus/Desember gagal — tergantung data ICU runtime). Build gagal di sitemap saat artikel pertama bertanggal Agustus masuk. Fix: `parseDate()` (monthMap lengkap Januari–Desember) di `lib/blog.ts` kini **di-export** dan dipakai di semua tempat yang mem-parse `post.date`:
- `app/sitemap.ts` → `lastModified: parseDate(post.date)`
- `app/rss.xml/route.ts` → `parseDate(post.date).toUTCString()`
- `app/blog/[slug]/page.tsx` → `publishedIso = parseDate(post.date).toISOString()` untuk publishedTime/modifiedTime

Aturan: JANGAN pernah pakai `new Date(string)` untuk mem-parse format "d MMMM yyyy" Indonesia — selalu pakai `parseDate()` dari lib/blog.

- Build verified: TypeScript 0 errors, Next.js build success

### Penempatan AdSense slot di halaman blog (sesi berjalan)

`AdSlot` (`components/ad-slot.tsx`) kini dipasang di `app/blog/[slug]/page.tsx` pada 3 titik — slot kosong di `lib/adsConfig.ts` = tidak render apa pun, jadi aman sudah terpasang sebelum akun AdSense disetujui:

- **Slot B (728×90 leaderboard)**: setelah featured image, sebelum TableOfContents — natural break sebelum user mulai baca
- **Slot A (300×250 medium rectangle)**: inline di dalam PostBody via `buildInlineAdThresholds()` — interval dinamis 3 lalu bergantian 2/3 H2 (bukan index tetap), max 3 iklan/artikel, tidak pernah setelah H2 terakhir; artikel ≤3 H2 dapat 0 iklan inline. Guard: skip jika blok sebelumnya `cta` (jangan campur iklan Google dengan CTA internal)
- **Slot C (336×280 large rectangle)**: setelah ArticleFAQ, sebelum RelatedPosts — pembaca engaged, RPM lebih tinggi
- `components/ad-slot.tsx`: ditambah `maxWidth: '100%'` agar slot fixed-width tidak overflow di mobile

**Saat akun AdSense disetujui:** isi `slotA/slotB/slotC` di `lib/adsConfig.ts` dengan embed code; jika memakai `<ins class="adsbygoogle">`, muat juga script `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js` (mis. via `next/script` di root layout) — config saat ini hanya mendukung raw iframe HTML.

- Build verified: TypeScript 0 errors, Next.js build success

### Brief keyword/LSI: 5 artikel prioritas (sesi berjalan)

Eksekusi brief advisor SEO — leverage entitas pendukung, freshness signal, dan variasi FAQ PAA-style pada 5 artikel prioritas. Semua diedit di `lib/blog.ts`:

- `prompt-engineering` (ID `cara-menulis-prompt-anime-ai` / EN `how-to-write-ai-anime-prompts`) 1030/1081 kata:
  - **Bug dibersihkan**: artikel ID mengandung 3 blok nyasar dari artikel FRSC (H2 EN "When Should You Top Up FRSC?" + paragraf/list, H2 "Frequently Asked Questions" + paragraf/list FRSC, H2 "Pertanyaan Umum" kosong) antara intro dan definisi
  - H2 baru "Teknik Lanjutan untuk Hasil Konsisten"/"Advanced Techniques for Consistent Results" (entitas diffusion model, token, seed, LLM ChatGPT/Claude sebagai asisten prompt)
  - 2 FAQ baru per locale: kenapa hasil beda dari prompt / boleh pakai nama seniman dalam prompt
  - Metrik: E:3→7, FAQ:4→6
- `ai-dalam-pendidikan-2026` / `ai-in-education-2026` 1124/1179 kata: H2 "Personalisasi Pembelajaran dengan Adaptive Learning"/EN mirror (entitas adaptive learning, large language model, machine learning) + 2 FAQ baru (boleh pakai AI untuk tugas sekolah? / cara guru mulai pakai AI). Metrik: E:4→6, FAQ:6→8
- `gemini-ai-plus-pro-features` (ID `fitur-gemini-ai-plus-pro-2026` / EN `gemini-ai-plus-pro-features-2026`) 1129/1163 kata: FAQ 2→6 per locale — worth it?, upgrade/downgrade kapan saja, Gemini app vs Gemini in Workspace, diskon pelajar/mahasiswa
- `masa-depan-ai-indonesia-2026` / `future-of-ai-indonesia-2026` 1091/1132 kata: H2 "Langkah Konkret Menuju 2026 dan Setelahnya"/EN mirror (entitas Stranas KA, LLM lokal, computer vision, NLP, machine learning). Metrik: E:7→11 / E:6→10
- `ai-untuk-bisnis-ecommerce-2026` / `ai-for-ecommerce-business-2026` 1216/1273 kata: H2 "Teknologi AI di Balik Pengalaman Belanja"/EN mirror (entitas recommender system, dynamic pricing, NLP, ChatGPT/Claude). Metrik: E:1→5

Catatan teknis:
- Script audit: `audit-lsi.mjs` (entity coverage 22 entitas, freshness terms unik — bukan frekuensi, FAQ count, words) dan `count-blog-words.mjs` (authoritative untuk target ≥1000) di `C:\Users\compa\AppData\Local\Temp\opencode\`
- Satu-satunya artikel tersisa <1000 kata: `rekomendasi-ai-agent-*` 954/975 — sengaja di luar brief (sudah cukup dalam menurut analisis awal)
- Build verified: TypeScript 0 errors, Next.js build success

### Optimasi On-Page SEO blog (sesi berjalan)

- `app/blog/[slug]/page.tsx`:
  - Title tag: suffix `| Farisium Blog` → `– Farisium` (en dash, 11 char) + helper `buildSeoTitle()` — truncate title utama di word boundary jika total >60 char, keyword tetap di depan
  - `trimMetaDescription()` (155 char, word boundary) dipertahankan
- `lib/blog.ts`: 27 excerpt di-rewrite agar keyword utama (keywords[0]) muncul di 100 karakter pertama + micro-hook (angka/tahun/"Panduan Lengkap") untuk CTR — audit script: `C:\Users\compa\AppData\Local\Temp\opencode\audit-seo.mjs` (0 issues setelah fix)
- Heading audit: 0 artikel low-H2 (ekspansi artikel sebelumnya sudah menutup) — PostBody semantik sudah benar (1 H1 + H2/H3 + anchor id)
- Build verified: TypeScript 0 errors, Next.js build success

### Persiapan AdSense: Ekspansi artikel tipis ke ≥1000 kata (sesi berjalan)

Semua artikel blog yang tadinya <1000 kata (risiko thin content untuk AdSense) diperluas dengan subbab unik — studi kasus, workflow konkret, data biaya, kesalahan umum — bukan sekadar padding. 9 pasang artikel (ID+EN) diekspansi di `lib/blog.ts`:

- `tips-memulai-karir-ai` 403→1120 / `tips-starting-ai-career` 412→1195 (peran karir, roadmap 6 bulan, gaji, kesalahan pemula, pengalaman pertama)
- `cara-mendapatkan-frsc-gratis-farisium` 485→1006 / `how-to-get-free-frsc-farisium` 529→1090 (strategi klaim, simulasi 194 FRSC/bulan, kapan top-up, FAQ baru)
- `ai-untuk-bisnis-ecommerce-2026` 595→1013 / `ai-for-ecommerce-business-2026` 612→1064 (studi kasus toko fashion, checklist, metrik)
- `ai-untuk-marketing-konten-2026` 640→1002 / `ai-for-content-marketing-2026` 628→1001 (workflow mingguan tim konten, kesalahan marketer)
- `kursus-ai-online-terbaik-2026` 694→1011 / `best-online-ai-courses-2026` 731→1091 (roadmap 3 bulan, cara menyelesaikan kursus, estimasi biaya)
- `cara-menggunakan-ai-untuk-produktivitas-kerja` 748→1001 / `how-to-use-ai-for-work-productivity-2026` 735→1013 (etika & batasan AI di kerja, kesalahan adopsi)
- `ai-untuk-ukm-2026` 760→1024 / `ai-for-small-business-2026` 778→1046 (studi kasus kedai kopi, anggaran realistis)
- `ai-untuk-content-creator` 766→1044 / `ai-for-content-creators` 767→1060 (workflow satu orang, kesalahan creator pemula)
- `perbandingan-ai-image-generator-terbaik-2026` 767→1054 / `best-ai-image-generators-comparison-2026` 789→1089 (perbandingan harga, tips hasil maksimal)

- `readTime` dinaikkan sesuai kalibrasi ~140 kata/menit: tips-memulai-karir-ai 7→8 menit, tips-starting-ai-career 7→9 min, frsc-gratis ID/EN 7→8
- Artikel ≥823 kata lainnya (pendidikan, gemini-plus-pro, masa-depan-ai, ai-agent) sengaja tidak diubah — sudah cukup dalam
- Script hitung kata ada di `C:\Users\compa\AppData\Local\Temp\opencode\count-blog-words.mjs` (jalankan dari root project)
- Build verified: TypeScript 0 errors, Next.js build success

### Persiapan AdSense: Tools maintenance jadi orphan page

Karena backend Ollama belum stabil, semua link promosi ke 3 tools (`anime-generator`, `fium`, `seo-caption-generator`) dilepas sementara. Halaman tools TETAP ADA dan tetap menampilkan `MaintenanceModal` jika dikunjungi langsung, tapi kini orphan:

- `lib/blog.ts`: 78 inline link di-strip (teks mention dipertahankan tanpa href), 8 CTA block ke tools dihapus
- Homepage `AIToolsSection.tsx` + `/ai` listing: 3 kartu maintenance dihapus (ID+EN), branch render maintenance dibersihkan
- `app/layout.tsx`: floating chat button Fium dihapus
- `Footer.tsx`: link Anime Generator dihapus
- Dashboard: quick links Anime Generator & Fium dihapus
- `sitemap.ts`: entri `ai/anime-generator` dihapus
- 3 layout tool pages: `robots: { index: false, follow: false }` ditambahkan

**Saat backend stabil, re-enable dengan:** hapus `<MaintenanceModal />` dari 3 page.tsx, hapus `robots noindex` dari 3 layout.tsx, kembalikan kartu di homepage + `/ai` + footer + dashboard + sitemap, dan pertimbangkan tambah ulang link promo di artikel.

- Build verified: TypeScript 0 errors, Next.js build success

### Sesi Sebelumnya

- Artikel baru: AI Superintelligence (ID: `ai-superintelligence`, EN: `ai-superintelligence-explained`)
- 2 SVG animated baru: `ai-superintelligence-hero.svg` (brain/neural network) + `ai-superintelligence-timeline.svg` (evolution timeline)
- Konten lengkap: pengertian, pemain utama (OpenAI, DeepMind, Anthropic), manfaat, tantangan safety, timeline, FAQ
- Internal links: SEO Caption Generator (promo), Anime Generator (promo), Masa Depan AI Indonesia, Kursus AI Online
- External links: Google DeepMind, OpenAI, Anthropic, Nick Bostrom
- Build verified: TypeScript 0 errors, Next.js build success

Artikel kedua: Cara Mengatasi AI Agent Stuck Loop
- 2 SVG animated baru: `ai-agent-stuck-loop-hero.svg` (diagnostic flow) + `ai-agent-stuck-loop-solutions.svg` (step-by-step solutions)
- Target keyword: cara mengatasi ai agent stuck loop
- 4 jenis stuck loop: infinite loop, deadlock, API timeout, state corruption
- 7 solusi praktis: guard clause, circuit breaker, timeout, state machine, logging, exponential backoff, fallback
- Internal links: SEO Caption Generator (promo), AI Agent Otomatisasi Kerja, Masa Depan AI Indonesia, AI Tools Farisium
- External links: Google Cloud, AWS, LangChain, CrewAI

Artikel ketiga: Ciri-Ciri WA Disadap dan Cara Mengatasinya
- 2 SVG animated baru: `ciri-wa-disadap-hero.svg` (warning signs infographic) + `ciri-wa-disadap-solusi.svg` (security steps + checklist)
- Target keyword: ciri ciri wa disadap dan cara mengatasinya
- 6 tanda WhatsApp disadap: aktivitas tidak dikenal, linked device mencurigakan, pesan/panggilan asing, logout otomatis, HP panas, permintaan OTP
- 6 langkah mitigasi: logout device, aktifkan 2FA, clear cache, beri tahu kontak, aktifkan kunci aplikasi, ganti PIN berkala
- 8 tips pencegahan: jangan bagikan OTP, aktifkan 2FA, cek linked devices, hindari phishing, jangan install dari sumber tidak resmi, aktifkan app lock, update WhatsApp, hindari WiFi publik
- 5 FAQ: tanpa akses HP, enkripsi, identitas pelaku, ganti nomor, durasi akses
- Internal links: Agentic Ransomware, Masa Depan AI Indonesia
- External links: WhatsApp Security, WhatsApp FAQ
- Build verified: TypeScript 0 errors, Next.js build success

## Hal yang Belum Selesai / Perlu Dilakukan

- (none — clean state)
