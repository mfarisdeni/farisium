# Farisium Brand Guidelines

# Identitas Merek

Farisium adalah platform AI terpadu yang menghubungkan berbagai AI Tools, layanan digital, dan komunitas ke dalam satu ekosistem.

Farisium dibangun dengan tujuan memberikan teknologi AI yang mudah diakses, cepat, bermanfaat, dan berkelanjutan.

Farisium bukan sekadar penyedia AI Tools, tetapi sebuah ekosistem yang terus berkembang.

---

# Visi Brand

Menjadi platform AI yang membantu individu, kreator, pelaku usaha, dan developer memanfaatkan Artificial Intelligence dengan cara yang sederhana, modern, dan terpercaya.

---

# Misi Brand

* Mengembangkan AI Tools yang bermanfaat.
* Menyediakan pengalaman pengguna terbaik.
* Membangun ekosistem AI yang saling terhubung.
* Mengembangkan teknologi secara berkelanjutan.
* Memberikan nilai nyata kepada komunitas.

---

# Nilai Utama

Seluruh produk Farisium harus mencerminkan nilai berikut.

* Sederhana
* Cepat
* Modern
* Profesional
* Transparan
* Konsisten
* Berkelanjutan

---

# Karakter Brand

Farisium harus selalu terasa:

* Premium
* Elegan
* Minimalis
* Berwibawa
* Bersih
* Ramah
* Profesional
* Handcrafted — seolah dibuat dengan presisi, bukan template

---

# Target Pengguna

Farisium ditujukan untuk:

* Pengguna umum.
* Kreator.
* Pelaku UMKM.
* Freelancer.
* Software Developer.
* Digital Creator.
* AI Enthusiast.
* Startup.

---

# Positioning

Farisium adalah platform AI lokal dengan kualitas global.

Fokus utama bukan menjadi yang paling banyak fiturnya, tetapi menjadi platform AI yang paling nyaman digunakan.

---

# Tone of Voice

Komunikasi Farisium harus:

* Profesional.
* Ramah.
* Mudah dipahami.
* Tidak berlebihan.
* Tidak menggunakan clickbait.
* Tidak menggunakan klaim yang tidak dapat dibuktikan.

Gunakan bahasa yang sederhana namun tetap menunjukkan kualitas.

---

# Gaya Penulisan

Gunakan kalimat yang:

* Ringkas.
* Informatif.
* Jelas.
* Mudah dipahami.

Hindari istilah teknis jika tidak diperlukan.

Jika menggunakan istilah teknis, sertakan penjelasan yang mudah dipahami.

---

# Identitas Visual — Black Platinum + Moving Crimson + Royal Purple Ambient

Farisium menggunakan identitas visual Black Platinum + Moving Crimson dengan Royal Purple sebagai ambient light.

## Palet Warna v2 — Distribusi Baru

### Distribusi (setelah redesign v2)

| Persentase | Warna | Peran |
|------------|-------|-------|
| 40% | Deep Black / Graphite | Background, deep surfaces |
| 25% | Platinum Black | Cards, elevated surfaces |
| 15% | Silver / Chrome | Borders, metallic accents, badges |
| 15% | White & Soft White | Text, highlights, separators |
| 5% | Accent (Red & Purple) | CTAs, focus, active states |

### Foundation — Deep Black / Graphite (40%)
`#0a0a0a` (frsc-black), `#181818` (surface-900), `#1e1e1e` (surface-800)

Solid, premium, timeless. Warna gelap pekat sebagai fondasi seluruh antarmuka.

### Platinum Black (25%) — Surface lebih terang
`#2a2a2a` (surface-700), `#363636` (surface-600), `#424242` (surface-500)

Warna permukaan yang lebih terang dari v1 untuk memberikan kesan platinum yang lebih premium.

### Silver / Chrome Metallic (15%)
`--frsc-platinum: #eaeaea`, `--frsc-silver: #c8c8c8`, `--frsc-chrome: #d6d6d6`

Digunakan untuk border metallic, badge platinum, aksen metalik pada card dan button.

### White & Soft White (15%)
`--frsc-white-bright: #f5f5f5`, `--frsc-white-soft: rgba(255,255,255,0.07)`

White sebagai elemen desain intentional — bukan sekadar warna teks. Digunakan untuk:
- Border putih halus (`border border-white/[0.06]`)
- Background putih subtle (`bg-white/[0.03]`)
- Teks utama (`text-frsc-white-bright`)
- Separator putih

### Primary Accent — Deep Crimson #E0304E (5%)
`--frsc-crimson-500: #e0304e`

Aksen brand dominan. Berani, elegan, hidup. Digunakan pada: button, badge, glow, border hover, icon, gradient endpoint.

Persentase dikurangi dari v1 (20% → 5%) — crimson sekarang digunakan secara lebih selektif sebagai aksen premium.

### Ambient Accent — Royal Purple #642F7F
`--frsc-purple-500: #642f7f`

**Bukan warna UI.** Hanya sebagai atmospheric light: blur, opacity rendah (`/4`–`/8`), floating glow, edge light, background ambient.

Dilarang: purple solid untuk teks, border, atau background tanpa blur.

### Teks — Lebih terang dari v1
`--frsc-text-100: #f0f0f0` — primary body
`--frsc-text-200: #d0d0d0` — secondary
`--frsc-text-300: #b0b0b0` — muted

## Grade — Premium + Metallic

### Animated Gradients (CSS)
- `animated-gradient-premium` — section backgrounds (16s cycle)
- `animated-gradient-subtle` — card/container backgrounds (12s cycle)
- `animated-gradient-text` — headline text (5s cycle) — **JANGAN DIUBAH**
- `animated-gradient-crimson` — solid crimson surfaces (8s cycle)
- `animated-gradient-metallic` — metallic surfaces (10s cycle)

### Metallic Gradients (statis)
- `metallic-platinum` — `#505050 → #707070 → #505050`
- `metallic-silver` — `#585858 → #7a7a7a → #585858`
- `metallic-chrome` — `#404040 → #606060 → #404040`
- `metallic-graphite` — `#303030 → #4c4c4c → #303030`

### Metallic Shadows
- `shadow-metallic` — default card shadow dengan white edge highlight
- `shadow-metallic-lg` — elevated shadow untuk card hover

Semua bergerak lambat, halus, hampir tidak terlihat.

## Aturan Visual v2

* Dark Theme adalah identitas utama — dengan surface lebih terang dari v1.
* Silver/Chrome metallic accents memberikan nuansa premium tanpa berlebihan.
* White adalah elemen desain intentional — border putih, separator putih, bg putih subtle.
* Solid surface adalah default — glass hanya untuk overlay/modal/dialog.
* Aksen crimson ~5% — digunakan secara selektif, setiap kemunculan memiliki fungsi.
* Purple hanya ambient — tidak pernah sebagai UI color solid.
* Jangan gunakan biru neon, rainbow gradient, atau efek "AI SaaS generik".
* Motion halus, spring-based, GPU accelerated.
* Banyak whitespace — setiap elemen memiliki ruang untuk bernapas.

## Typography

Heading: Plus Jakarta Sans (600–800 weight)
Body: Plus Jakarta Sans (300–500 weight)
Monospace: JetBrains Mono

---

# DNA Desain

DNA visual Farisium adalah Farisium Black Platinum + Moving Crimson.

Referensi eksternal (Stripe, Linear, Raycast, Vercel, Notion, Jitter, Ponder) digunakan hanya untuk:

* Inspirasi kualitas UX.
* Pola layout dan interaksi.
* Standar profesionalisme.

Bukan untuk:

* DNA visual.
* Palet warna.
* Gaya tipografi.
* Keputusan branding.

Nodera hanya digunakan sebagai referensi UX pada halaman AI Compute.

Jangan pernah menyalin identitas visual website lain. Farisium harus dapat dikenali tanpa logo.

---

# Pengalaman Pengguna

Setiap halaman harus:

* Cepat dimuat.
* Mudah dipahami.
* Mobile First.
* Responsif.
* Ramah Google AdSense.
* Memiliki navigasi yang jelas.
* Mengutamakan aksesibilitas.

---

# Hubungan Antar Produk

Seluruh layanan merupakan bagian dari Farisium.

Contohnya:

* Anime Generator.
* AI Compute.
* Blog.
* Rewards.
* Partnership.

Produk-produk tersebut bukan brand terpisah.

Seluruh identitas visual harus tetap menggunakan branding Farisium.

---

# Prinsip Pengembangan Brand

Saat membuat halaman, fitur, maupun konten, selalu tanyakan:

Apakah ini terlihat seperti Farisium?

Jika sebuah desain dapat ditempel logo lain tanpa perubahan apa pun, maka desain tersebut belum memiliki identitas Farisium yang kuat.

---

# Tujuan Jangka Panjang

Farisium harus dikenal sebagai platform AI yang:

* Modern.
* Terpercaya.
* Mudah digunakan.
* Berkualitas tinggi.
* Memiliki identitas visual yang konsisten.
* Memberikan pengalaman pengguna terbaik.
