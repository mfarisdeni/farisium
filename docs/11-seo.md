# SEO Guidelines

# Tujuan

Seluruh halaman pada Farisium harus dirancang agar mudah dipahami oleh mesin pencari sekaligus memberikan pengalaman terbaik bagi pengguna.

SEO bukan sekadar mendapatkan peringkat di Google, tetapi memastikan setiap halaman memiliki struktur yang jelas, cepat diakses, informatif, dan memberikan nilai nyata.

---

# Filosofi SEO

Farisium mengutamakan kualitas konten dibanding manipulasi algoritma.

Seluruh optimasi SEO harus dilakukan secara alami dan berorientasi pada pengguna.

Hindari teknik yang bertujuan memanipulasi hasil pencarian.

---

# Target Utama

Optimasi SEO difokuskan pada:

* Google Search
* Google Discover
* Google Images
* Google AI Overviews
* Bing Search
* Mesin pencari modern lainnya

---

# Struktur Halaman

Setiap halaman wajib memiliki struktur yang jelas.

Minimal terdiri dari:

* Title
* Meta Description
* Hero Section
* Konten utama
* FAQ (jika relevan)
* Internal Link
* Footer

---

# Metadata

Setiap halaman harus memiliki metadata yang unik.

Minimal meliputi:

* Title
* Description
* Canonical URL
* Open Graph
* Twitter Card

Judul dan deskripsi tidak boleh menggunakan teks yang sama pada halaman lain.

---

# URL

Gunakan URL yang:

* pendek;
* mudah dibaca;
* menggunakan huruf kecil;
* menggunakan tanda hubung (-);
* menggambarkan isi halaman.

Contoh:

/ai/anime-generator

/blog/ai-image-generator-guide

Hindari:

* parameter yang tidak perlu;
* angka acak;
* slug yang tidak bermakna.

---

# Heading

Gunakan struktur heading yang benar.

Satu halaman hanya memiliki satu H1.

Gunakan H2, H3, dan H4 secara berurutan sesuai struktur konten.

Jangan menggunakan heading hanya untuk memperbesar ukuran teks.

---

# Konten

Konten harus:

* orisinal;
* relevan;
* mudah dipahami;
* memberikan solusi;
* memiliki nilai tambah.

Hindari:

* keyword stuffing;
* pengulangan yang tidak perlu;
* artikel tipis tanpa informasi.

---

# Internal Linking

Setiap halaman harus memiliki hubungan dengan halaman lain di dalam Farisium apabila relevan.

Contoh:

Homepage → AI Tools

AI Tools → Anime Generator

Anime Generator → Blog

Blog → AI Compute

Internal link harus membantu pengguna menemukan informasi yang berkaitan.

## Related Posts (Blog)

Setiap artikel blog akan menampilkan Related Posts di bagian bawah secara otomatis.

Related Posts dipilih berdasarkan kesamaan kategori (category).

Related Posts membantu:

* meningkatkan dwell time;
* mengurangi bounce rate;
* memperkuat topical cluster;
* memberikan rekomendasi konten relevan.

Related Posts diimplementasikan oleh komponen `RelatedPosts` di `components/blog/RelatedPosts.tsx`.

---

# Gambar

Seluruh gambar harus:

* menggunakan ukuran yang optimal;
* memiliki atribut alt yang deskriptif;
* menggunakan format modern apabila memungkinkan;
* tidak terlalu besar.

Gunakan lazy loading untuk gambar yang berada di luar area pertama layar.

---

# Structured Data

Gunakan Structured Data apabila sesuai.

Jenis yang dapat digunakan:

* Organization
* WebSite
* BreadcrumbList
* FAQPage
* Article
* BlogPosting
* CollectionPage
* Product
* SoftwareApplication

Gunakan hanya schema yang benar-benar sesuai dengan isi halaman.

## Implementasi Blog

Halaman detail artikel blog menggunakan 3 schema secara bersamaan:

1. `BlogPosting` — untuk artikel itu sendiri (headline, description, image, datePublished, author, publisher, wordCount)
2. `BreadcrumbList` — untuk navigasi breadcrumb (Home → Blog → Judul Artikel)
3. `FAQPage` — hanya muncul jika artikel memiliki heading H3 yang terdeteksi sebagai pertanyaan

Halaman listing blog menggunakan:

1. `CollectionPage` — untuk halaman daftar artikel dengan `ItemList` berisi link ke setiap artikel

Seluruh schema di-generate oleh fungsi di `lib/blog.ts`:

* `generatePostSchema()` — BlogPosting
* `generateBreadcrumbSchema()` — BreadcrumbList
* `generateFAQSchema()` — FAQPage
* `generateCollectionPageSchema()` — CollectionPage

---

# Table of Contents

Setiap artikel blog dengan minimal 2 heading akan menampilkan Table of Contents secara otomatis.

Table of Contents:

* dihasilkan oleh komponen `TableOfContents` di `components/blog/TableOfContents.tsx`;
* mengekstrak seluruh heading H2 dan H3 dari konten artikel menggunakan `extractHeadings()`;
* menandai heading yang sedang aktif berdasarkan posisi scroll pengguna (IntersectionObserver via scroll event);
* memberikan smooth scroll saat pengguna mengklik salah satu item;
* bersifat opsional — tidak muncul jika artikel hanya memiliki 1 heading.

Manfaat Table of Contents untuk SEO:

* meningkatkan pengalaman pengguna dengan navigasi cepat;
* membantu Google memahami struktur artikel;
* meningkatkan kemungkinan rich result / jump-to links di SERP.

# Sitemap

Seluruh halaman publik harus masuk ke sitemap.

Sitemap harus diperbarui secara otomatis ketika terdapat halaman baru.

---

# Robots

Gunakan robots.txt untuk mengatur halaman yang boleh diindeks.

Jangan mengizinkan halaman berikut untuk diindeks:

* Dashboard
* Halaman Login
* Halaman Admin
* API
* Halaman internal lainnya

---

# Open Graph

Setiap halaman harus memiliki Open Graph.

Minimal terdiri dari:

* Title
* Description
* Image
* URL
* Type

Hal ini bertujuan agar halaman tampil dengan baik saat dibagikan di media sosial.

---

# Semantic HTML

Gunakan elemen HTML yang sesuai.

Contoh:

header

main

section

article

nav

aside

footer

Hindari penggunaan div apabila tersedia elemen semantik yang lebih tepat.

---

# Mobile First

Seluruh halaman harus dirancang menggunakan pendekatan Mobile First.

Pastikan:

* navigasi mudah digunakan;
* teks mudah dibaca;
* tombol mudah ditekan;
* layout tidak rusak pada layar kecil.

---

# Core Web Vitals

Optimalkan:

* Largest Contentful Paint (LCP)
* Interaction to Next Paint (INP)
* Cumulative Layout Shift (CLS)

Seluruh halaman harus memprioritaskan pengalaman pengguna.

---

# Performa

SEO selalu mempertimbangkan performa.

Gunakan:

* Server Components
* Dynamic Import
* Lazy Loading
* Image Optimization
* Font Optimization
* Code Splitting

Hindari JavaScript yang tidak diperlukan.

---

# Blog

## Struktur Halaman Artikel

Halaman detail artikel blog memiliki struktur berikut:

1. **Breadcrumb** — navigasi Home → Blog → Judul Artikel (komponen `ArticleBreadcrumb`)
2. **Header** — kategori, tanggal, waktu baca, judul H1, excerpt
3. **Featured Image**
4. **Table of Contents** — daftar isi otomatis dari heading H2/H3 (komponen `TableOfContents`)
5. **Konten artikel** — `PostBody` yang me-render heading, paragraph, list, image, cta
6. **FAQ** — pertanyaan umum otomatis dari heading H3 yang terdeteksi (komponen `ArticleFAQ`)
7. **Related Posts** — artikel terkait berdasarkan kategori yang sama (komponen `RelatedPosts`)
8. **Back to Blog** — link kembali ke halaman blog

## Aturan Penulisan

Artikel blog harus:

* memiliki struktur heading yang jelas (H2 untuk topik utama, H3 untuk subtopik);
* menggunakan H3 untuk pertanyaan FAQ agar otomatis terdeteksi oleh `extractFAQs()`;
* menggunakan bahasa yang mudah dipahami;
* memberikan solusi nyata;
* memiliki internal link ke artikel lain atau halaman Farisium lainnya.

Fokus utama adalah membantu pembaca.

---

# AI Tools

Setiap AI Tool harus memiliki halaman yang dapat diindeks.

Halaman AI Tool harus menjelaskan:

* fungsi;
* manfaat;
* cara penggunaan;
* pertanyaan umum;
* Call To Action.

Jangan hanya menampilkan aplikasi tanpa penjelasan.

---

# Google AdSense

Seluruh halaman harus tetap nyaman dibaca meskipun terdapat area iklan.

SEO dan pengalaman pengguna selalu menjadi prioritas utama.

---

# AI Generated Content

Konten yang dibuat menggunakan AI harus:

* diperiksa kembali sebelum dipublikasikan;
* akurat;
* mudah dipahami;
* memiliki nilai tambah.

Jangan mempublikasikan konten AI tanpa proses review.

---

# Checklist Sebelum Publikasi

Sebelum halaman dipublikasikan, pastikan:

* Memiliki Title yang unik.
* Memiliki Meta Description.
* Menggunakan URL yang jelas.
* Memiliki satu H1.
* Menggunakan heading yang terstruktur.
* Memiliki internal link.
* Menggunakan Semantic HTML.
* Menggunakan Open Graph.
* Menggunakan Structured Data apabila sesuai.
* Mobile Friendly.
* Memenuhi Core Web Vitals.
* Tidak terdapat konten duplikat.

---

# Prinsip Utama

SEO di Farisium selalu berfokus pada pengalaman pengguna.

Jika sebuah optimasi SEO membuat pengalaman pengguna menjadi lebih buruk, maka optimasi tersebut tidak digunakan.

Konten yang bermanfaat, cepat diakses, mudah dipahami, dan memiliki struktur yang baik akan selalu menjadi prioritas utama Farisium.
