# Image Guidelines Farisium

Dokumen ini menjadi standar resmi untuk seluruh aset visual pada artikel blog Farisium.

Sebelum membuat gambar, baca dokumen ini bersama:

- `docs/19-farisium-brand.md` — identitas visual brand
- `docs/03-design-system.md` — palet warna, gradient, glow
- `docs/11-seo.md` — SEO untuk gambar
- `docs/14-performance.md` — optimasi performa
- `docs/BLOG-WRITING.md` — editorial workflow

---

# Filosofi

Setiap gambar harus memiliki tujuan yang jelas.

Gambar tidak boleh menjadi hiasan tanpa makna.

Setiap gambar harus:

- Membantu pembaca memahami konsep.
- Meningkatkan daya tarik visual artikel.
- Mendukung SEO melalui ALT text yang deskriptif.
- Memperkuat identitas brand Farisium.
- Tetap ringan dan tidak memperlambat halaman.

---

# Strategi Gambar

## Alokasi Default per Artikel

| Jenis | Jumlah | Fungsi |
|---|---|---|
| Hero Image | 1 | Open Graph, social sharing, thumbnail artikel |
| Supporting Images | 0–2 | Ilustrasi konten, diagram, workflow |

Jangan membuat gambar yang tidak diperlukan.

Pillar article diperbolehkan memiliki maksimal 3 supporting images.

---

# Hero Image

Hero image adalah gambar utama artikel, digunakan untuk:

- Open Graph (`og:image`)
- Thumbnail blog
- Social sharing preview
- Header visual artikel

## Spesifikasi

| Aspek | Spesifikasi |
|---|---|
| Format | WebP atau AVIF |
| Ukuran file | Maksimal **100 KB** |
| Resolusi | 1200×630px (Open Graph standard) |
| Kualitas | Medium compression (jangan maksimalkan kualitas) |

## Gaya Visual

Gunakan AI-generated editorial illustration.

- Premium
- Modern
- Editorial
- Cinematic lighting
- Black Platinum sebagai fondasi gelap
- Deep Crimson sebagai aksen dominan
- Royal Purple sebagai ambient light (low opacity, blur)
- Komposisi minimalis
- Tidak ada teks
- Tidak ada logo
- Tidak ada watermark

---

# Supporting Images

Buat hanya jika benar-benar meningkatkan pemahaman pembaca.

## Contoh Penggunaan yang Tepat

| Tipe | Contoh |
|---|---|
| Workflow illustration | Diagram alur proses generate gambar |
| Conceptual visual | Ilustrasi perbandingan dua teknologi |
| UI mockup | Tampilan antarmuka AI Tool |
| Process diagram | Langkah-langkah teknis |

## Contoh Penggunaan yang Tidak Tepat

- Gambar stok tanpa relevansi.
- Screenshot tidak jelas.
- Gambar dekoratif tanpa konteks.
- Gambar yang hanya mengulang penjelasan teks.

## Spesifikasi

| Aspek | Spesifikasi |
|---|---|
| Format | WebP atau AVIF |
| Ukuran file | Maksimal **80 KB** |
| Resolusi | 800×450px atau sesuai konten |
| Kualitas | Medium |

---

# SVG Usage

SVG hanya digunakan untuk grafik eksplanatori:

- Flowcharts
- Architecture diagrams
- Comparison diagrams
- Process illustrations
- Simple technical explanations

## Aturan SVG

- Jangan gunakan SVG sebagai hero image atau thumbnail artikel.
- Jaga SVG tetap minimal dan bersih.
- Hindari teks dekoratif yang tidak perlu.
- SVG styling harus konsisten dengan Farisium brand (dark background, crimson accent).

## Spesifikasi

| Aspek | Spesifikasi |
|---|---|
| Ukuran file | Sekecil mungkin, idealnya di bawah 20 KB |
| Warna | Gunakan token Farisium (frsc-crimson-500, frsc-text-100, dll) |
| Font embedded | Hindari font embedding — gunakan system font stack |

---

# Gaya Visual Farisium

Semua gambar harus mencerminkan identitas visual Farisium:

## Palet Warna

| Peran | Warna | Hex |
|---|---|---|
| Foundation | Black Platinum | `#0a0a0a`, `#141414`, `#1a1a1a` |
| Primary Accent | Deep Crimson | `#e0304e`, `#f0506e` |
| Ambient Accent | Royal Purple | `#642f7f` (low opacity, blur only) |
| Text Primary | Light Gray | `#e0e0e0` |
| Text Muted | Medium Gray | `#a0a0a0` |

## Karakter Visual

- Dark theme — latar gelap pekat.
- Pencahayaan sinematik — gradien halus, glow tipis.
- Crimson sebagai aksen dominan.
- Purple hanya sebagai ambient — low opacity, blurred.
- Komposisi minimalis — tidak ramai, fokus pada satu subjek.
- Tidak ada neon, rainbow gradient, atau efek "AI SaaS generik".
- Whitespace yang cukup.

## Gradien Premium

Gunakan gradien 4+ stop dengan transisi sinematik:

```
Black Platinum → Deep Crimson → Royal Purple → Soft White Highlight → Black Platinum
```

---

# Optimasi Gambar

## Format Prioritas

1. AVIF (jika didukung)
2. WebP (fallback)
3. JPEG (jika WebP/AVIF tidak memungkinkan)

## Target Ukuran File

| Jenis | Maksimal |
|---|---|
| Hero Image | **100 KB** |
| Supporting Image | **80 KB** |
| SVG | 20 KB |

Kualitas medium sudah cukup. Tidak perlu menggunakan kualitas maksimal.

## Tools

Gunakan tools berikut untuk optimasi:

- `squoosh` — untuk kompresi WebP/AVIF manual
- `sharp` — untuk batch processing
- Next.js `<Image>` component — optimasi otomatis untuk gambar yang diimport

---

# Aksesibilitas

Setiap gambar wajib memiliki:

## ALT Text

- Deskriptif dan akurat.
- Minimal 5 kata, maksimal 125 karakter.
- Mengandung kata kunci relevan secara alami.
- Contoh baik: "Ilustrasi proses denoising Stable Diffusion dari noise acak hingga gambar anime jadi"
- Contoh buruk: "Gambar AI" atau "Stable Diffusion"

## Filename SEO

Gunakan format:

```
{kategori}-{topik}-{deskripsi-singkat}.webp
```

Contoh:

- `ai-image-generation-stable-diffusion-workflow.webp`
- `anime-generator-prompt-example-comparison.webp`
- `farisium-frsc-ecosystem-diagram.svg`

Aturan:

- Huruf kecil semua.
- Gunakan tanda hubung (-).
- Deskriptif namun tidak terlalu panjang (3–6 kata).
- Akhiri dengan ekstensi format yang sesuai.

## Caption (Opsional)

Tambahkan caption hanya jika membantu pembaca memahami konteks gambar.

Caption harus singkat — maksimal 15 kata.

---

# Workflow Generasi

Setiap gambar baru harus melalui proses berikut:

```
1. Tentukan kebutuhan gambar (hero atau supporting?)
2. Cari referensi visual bebas hak cipta (jika diperlukan)
3. Gunakan referensi hanya sebagai inspirasi — jangan publikasikan langsung
4. Generate gambar baru menggunakan AI dengan gaya Farisium
5. Optimasi ukuran file (maks 100 KB untuk hero, 80 KB untuk supporting)
6. Hasilkan ALT text yang deskriptif
7. Simpan dengan SEO-friendly filename
8. Verifikasi gambar tidak melanggar hak cipta
```

**Never publish the original reference image directly.**

---

# Integrasi dengan SEO

| Aspek SEO | Implementasi Gambar |
|---|---|
| Open Graph | Hero image sebagai `og:image` |
| Image Search | ALT text + filename deskriptif |
| Page Speed | Ukuran file maks 100 KB, format modern |
| Core Web Vitals | Lazy loading untuk supporting images |
| Structured Data | `image` field di BlogPosting schema |
| Accessibility | ALT text pada setiap gambar |

---

# Larangan

Jangan membuat gambar yang:

- Tidak memiliki tujuan jelas.
- Berukuran lebih besar dari yang ditampilkan.
- Menggunakan teks berlebihan.
- Mengandung logo Farisium sebagai watermark.
- Melanggar hak cipta pihak lain.
- Menggunakan gambar stok tanpa modifikasi.
- Menggunakan warna di luar palet Farisium.
- Terlalu ramai atau membingungkan.

---

# Checklist Sebelum Publikasi

Sebelum gambar digunakan di artikel, pastikan:

- [ ] Format menggunakan WebP atau AVIF.
- [ ] Ukuran file hero maksimal 100 KB.
- [ ] Ukuran file supporting maksimal 80 KB.
- [ ] Resolusi sesuai kebutuhan (jangan lebih besar dari yang ditampilkan).
- [ ] ALT text deskriptif (5–125 karakter).
- [ ] Filename SEO-friendly.
- [ ] Mengikuti gaya visual Farisium.
- [ ] Tidak ada teks atau logo pada gambar.
- [ ] Tidak melanggar hak cipta.
- [ ] Lazy loading diterapkan pada supporting images.
- [ ] Hero image sudah terintegrasi dengan Open Graph.

---

# Prinsip Akhir

Gambar di Farisium bukan sekadar pelengkap visual.

Setiap gambar adalah alat komunikasi yang:

- Membantu pembaca memahami konsep dengan lebih cepat.
- Memperkuat identitas brand Farisium.
- Mendukung SEO dan performa halaman.
- Tetap ringan agar tidak mengorbankan kecepatan.

Kualitas, relevansi, dan performa selalu lebih penting daripada kuantitas.
