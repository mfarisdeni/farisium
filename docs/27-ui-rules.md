# UI Rules

# Tujuan

Dokumen ini menjadi standar resmi seluruh antarmuka pengguna pada platform Farisium.

Semua halaman, komponen, fitur, dan AI Tools harus mengikuti aturan ini agar menghasilkan pengalaman pengguna yang konsisten, modern, dan mudah digunakan.

---

# Filosofi

UI Farisium harus terasa:

* Premium
* Modern
* Minimalis
* Elegan
* Futuristik
* Profesional

Desain harus membantu pengguna mencapai tujuan mereka dengan cepat dan nyaman.

Visual yang indah tidak boleh mengorbankan kegunaan.

---

# Identitas Visual

Farisium memiliki identitas visual sendiri.

Inspirasi dapat diambil dari produk lain, namun tidak boleh meniru secara langsung.

Referensi UX:

* Stripe
* Linear
* Raycast
* Jitter
* Ponder

Referensi khusus AI Compute:

* Nodera

Referensi digunakan untuk memahami kualitas pengalaman pengguna, bukan menyalin desain.

---

# Dark Theme First

Dark Theme adalah identitas utama Farisium.

Gunakan warna gelap sebagai fondasi.

Gunakan warna terang hanya untuk:

* teks;
* ikon;
* highlight;
* status.

---

# Layout

Layout harus sederhana.

Gunakan:

* Container yang konsisten.
* Grid yang rapi.
* White Space yang cukup.
* Alignment yang jelas.

Hindari layout yang terlalu padat.

---

# Container

Gunakan satu standar container pada seluruh halaman.

Perubahan ukuran container hanya diperbolehkan apabila memang dibutuhkan oleh jenis halaman tertentu.

---

# White Space

White Space merupakan bagian dari desain.

Jangan memenuhi setiap area layar dengan komponen.

Ruang kosong membantu pengguna memahami hierarki informasi.

---

# Grid

Gunakan sistem grid yang konsisten.

Komponen harus memiliki alignment yang rapi.

Jangan menggunakan posisi acak.

---

# Spacing

Gunakan sistem spacing yang konsisten.

Gunakan kelipatan:

* 4px
* 8px
* 12px
* 16px
* 24px
* 32px
* 48px
* 64px
* 96px

Hindari nilai spacing yang tidak konsisten.

---

# Border Radius

Gunakan radius yang konsisten di seluruh platform.

Komponen yang memiliki fungsi serupa harus memiliki radius yang sama.

---

# Typography

Tipografi harus memiliki hierarki yang jelas.

Prioritaskan:

* keterbacaan;
* konsistensi;
* kontras.

Hindari penggunaan terlalu banyak ukuran font.

---

# Warna

Gunakan warna seperlunya.

Palette Farisium v2:

* Deep Black / Graphite (40%): `#0a0a0a`, `#181818`, `#1e1e1e`
* Platinum Black (25%): `#2a2a2a`, `#363636`, `#424242`
* Silver / Chrome (15%): `#d0d0d0`, `#c8c8c8`, `#d6d6d6`
* White / Soft White (15%): `#f5f5f5`, `rgba(255,255,255,0.07)`
* Moving Crimson (5%): `#5c0010`, `#8b0020`, `#e0304e`, `#f0506e`
* Teks: `#f0f0f0` (primary), `#d0d0d0` (secondary), `#b0b0b0` (muted)

Warna aksen digunakan untuk:

* CTA
* Status
* Highlight
* Focus

Jangan gunakan:

* Biru neon
* Gradient pelangi
* Hijau terang (kecuali untuk status success pada dashboard)
* Warna neon apapun

Ungu hanya digunakan sebagai atmospheric light dengan blur — tidak pernah solid.

---

# Glassmorphism

Glassmorphism adalah aksen visual, bukan fondasi desain.

Gunakan hanya pada:

* Modal / Dialog
* Floating Panel
* Search Overlay
* Navbar saat scroll
* Image Preview

Jangan gunakan glass pada:

* Card
* Section / Hero
* Dashboard panel
* Tombol

---

# Shadow

Gunakan bayangan yang lembut.

Shadow digunakan untuk memperjelas hierarki visual.

Hindari shadow yang terlalu gelap atau terlalu besar.

---

# Button

Button harus:

* mudah dikenali;
* memiliki ukuran sentuh yang nyaman;
* memiliki Hover State;
* memiliki Focus State;
* memiliki Active State;
* memiliki Disabled State;
* memiliki Loading State.

Gunakan satu Primary CTA pada setiap section.

---

# Form

Form harus:

* sederhana;
* mudah dipahami;
* memiliki label yang jelas;
* memiliki validasi yang mudah dimengerti.

Jangan membuat form yang panjang tanpa alasan.

---

# Card

Card merupakan komponen utama Farisium.

Card harus:

* memiliki padding yang cukup;
* mudah dipindai;
* memiliki informasi yang jelas;
* konsisten di seluruh platform.

---

# Ikon

Gunakan ikon untuk membantu pemahaman.

Ikon tidak boleh menjadi dekorasi utama.

Seluruh ikon harus berasal dari keluarga ikon yang sama.

---

# Animasi

Animasi digunakan untuk meningkatkan pengalaman pengguna.

Gunakan:

* Fade
* Scale
* Slide
* Micro Interaction

Animasi harus:

* cepat;
* halus;
* tidak mengganggu.

---

# Loading

Gunakan Skeleton sebagai pilihan utama.

Spinner digunakan hanya apabila Skeleton tidak memungkinkan.

Pengguna harus selalu mengetahui bahwa sistem sedang bekerja.

---

# Empty State

Halaman kosong harus memberikan arahan kepada pengguna.

Jangan hanya menampilkan teks "Tidak ada data".

Berikan tindakan yang dapat dilakukan selanjutnya.

---

# Error State

Pesan kesalahan harus:

* jelas;
* sopan;
* memberikan solusi.

Jangan menggunakan istilah teknis yang membingungkan pengguna.

---

# Responsive

Seluruh halaman harus:

* Mobile First.
* Tablet Friendly.
* Desktop Friendly.

Layout tidak boleh rusak pada ukuran layar apa pun.

---

# Accessibility

Seluruh UI harus:

* dapat digunakan dengan keyboard;
* memiliki Focus State;
* memiliki kontras warna yang baik;
* menggunakan Semantic HTML;
* memiliki label yang jelas.

---

# SEO Friendly

Desain harus mendukung struktur HTML yang baik.

Gunakan:

* Heading yang benar.
* Semantic Layout.
* Navigasi yang jelas.

---

# Google AdSense Friendly

UI harus mendukung monetisasi tanpa mengurangi kenyamanan pengguna.

Pastikan:

* area iklan tidak menggeser layout;
* iklan tidak menutupi konten;
* konten tetap menjadi fokus utama.

---

# Konsistensi

Sebelum membuat komponen baru:

* cari komponen yang sudah ada;
* gunakan kembali apabila memungkinkan;
* pertahankan Design System.

Duplikasi harus dihindari.

---

# Hal yang Harus Dihindari

Jangan membuat UI yang:

* terlalu ramai;
* penuh animasi;
* menggunakan terlalu banyak warna;
* menggunakan terlalu banyak font;
* sulit dipahami;
* tidak konsisten;
* mengikuti tren sesaat tanpa alasan.

---

# Checklist Sebelum Implementasi

Pastikan:

* Mengikuti Design System Farisium.
* Mengikuti Brand Guideline.
* Mobile First.
* Responsive.
* Dark Theme.
* Premium.
* Minimalis.
* SEO Friendly.
* Google AdSense Friendly.
* Accessibility terjaga.
* Performa tetap baik.

---

# Prinsip Akhir

Pengguna harus dapat mengenali Farisium tanpa melihat logo.

Identitas visual dibangun melalui konsistensi desain, kualitas pengalaman pengguna, dan perhatian terhadap detail.

Setiap halaman harus terasa seperti bagian dari satu ekosistem yang sama.

Jika terdapat dua solusi desain yang sama baiknya, pilih solusi yang lebih sederhana, lebih mudah digunakan, dan lebih konsisten dengan identitas Farisium.
