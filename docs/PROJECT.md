# PROJECT

# Farisium Digital Ecosystem

Farisium adalah platform AI terpadu yang menggabungkan berbagai layanan berbasis Artificial Intelligence ke dalam satu ekosistem dengan arsitektur, identitas visual, dan pengalaman pengguna yang konsisten.

Seluruh fitur merupakan bagian dari satu platform, bukan kumpulan proyek yang berdiri sendiri.

---

# Visi

Membangun platform AI modern yang:

* mudah digunakan;
* memiliki performa tinggi;
* scalable;
* mudah dipelihara;
* memberikan manfaat nyata bagi pengguna.

Seluruh pengembangan harus mendukung visi jangka panjang tersebut.

---

# Tujuan

Farisium dibangun sebagai platform AI yang berkembang secara bertahap.

Prioritas utama:

* kualitas produk;
* pengalaman pengguna;
* performa;
* SEO;
* keamanan;
* maintainability.

Kecepatan pengembangan tidak boleh mengorbankan kualitas arsitektur.

---

# Arsitektur

Farisium menggunakan satu repository.

Jangan memecah fitur menjadi repository terpisah kecuali terdapat keputusan resmi.

Semua AI Tools berada di dalam platform yang sama.

---

# Teknologi

Frontend

* Next.js App Router
* React
* TypeScript
* Tailwind CSS

Backend

* Firebase Authentication
* Firestore
* Firebase Storage
* Firebase Functions

Artificial Intelligence

* Ollama
* Stable Diffusion
* Qwen2.5 Coder
* Qwen3

Development

* Docker
* Open WebUI
* Continue
* VS Code
* WSL Ubuntu

Deployment

* Vercel (Hosting & CDN) terintegrasi dengan GitHub (auto-deploy setiap push ke branch utama)

---

# Modul Saat Ini

Platform

* Homepage
* Dashboard
* Blog
* Rewards
* Partnership

AI

* Anime Generator
* AI Compute

Semua modul menggunakan Design System dan arsitektur yang sama.

---

# Prioritas Pengembangan

Urutan prioritas:

1. Fondasi platform.
2. Anime Generator.
3. FRSC Ecosystem.
4. AI Compute.
5. Blog.
6. Partnership.
7. Dashboard.
8. AI Tools berikutnya.

Jangan menambahkan fitur baru sebelum fondasi stabil.

---

# Struktur Proyek

```text
Farisium
│
├── AGENTS.md
├── PROJECT.md
├── README.md
│
├── docs/
├── app/
├── components/
├── hooks/
├── lib/
├── services/
├── types/
├── utils/
├── public/
└── package.json
```

---

# AI Development

Farisium dikembangkan menggunakan AI Assisted Development.

AI digunakan sebagai software engineer, bukan sekadar code generator.

Sebelum membuat implementasi, AI harus:

1. Membaca PROJECT.md.
2. Membaca AGENTS.md.
3. Membaca dokumentasi yang relevan di folder docs.
4. Memahami struktur proyek.
5. Menggunakan komponen yang sudah ada apabila memungkinkan.

---

# Design Philosophy

Farisium menggunakan identitas visual:

* Premium.
* Modern.
* Dark Theme.
* Elegant.
* Minimalis.
* Glassmorphism seperlunya.
* Mobile First.
* SEO Friendly.
* Google AdSense Friendly.

Desain harus mengutamakan pengalaman pengguna dibanding efek visual.

---

# Development Principles

Seluruh pengembangan mengikuti prinsip:

* Simplicity
* Scalability
* Maintainability
* Reusability
* Performance
* Security

Setiap keputusan harus mendukung keberlanjutan proyek dalam jangka panjang.

---

# AI Coding Principles

AI tidak boleh:

* membuat repository baru;
* mengganti backend tanpa keputusan resmi;
* membuat duplikasi komponen;
* menambahkan dependency tanpa alasan yang jelas;
* mengabaikan dokumentasi proyek.

AI harus selalu mengutamakan penggunaan kembali komponen, utility, dan pola arsitektur yang sudah ada.

---

# FRSC

FRSC merupakan utility point di dalam ekosistem Farisium.

FRSC digunakan untuk:

* AI Tools.
* Rewards.
* Partnership.
* Layanan internal lainnya.

FRSC bukan instrumen investasi dan tidak boleh diperlakukan sebagai produk keuangan.

---

# Partnership

Program Partnership dibangun berdasarkan prinsip:

* Kolaborasi.
* Kontribusi.
* Komunitas.
* Simbiosis Mutualisme.

Seluruh komunikasi harus menghindari istilah yang mengarah pada investasi atau jaminan keuntungan.

---

# Dokumentasi

Dokumentasi lengkap tersedia pada folder:

```text
/docs
```

Seluruh perubahan besar pada arsitektur, workflow, atau keputusan teknis harus memperbarui dokumentasi yang relevan.

---

# Definisi Selesai

Sebuah pekerjaan dianggap selesai apabila:

* fitur berjalan dengan baik;
* mengikuti Design System;
* memenuhi standar keamanan;
* memenuhi standar performa;
* memenuhi standar SEO;
* mengikuti dokumentasi proyek;
* tidak menambah kompleksitas yang tidak diperlukan.

---

# Misi AI

AI bukan hanya membantu menulis kode.

AI adalah bagian dari tim pengembang Farisium.

Setiap keputusan harus membuat platform menjadi:

* lebih sederhana;
* lebih konsisten;
* lebih cepat;
* lebih aman;
* lebih mudah dipelihara;
* lebih mudah dikembangkan.

Apabila terdapat beberapa solusi yang memungkinkan, pilih solusi yang paling sederhana, paling konsisten dengan dokumentasi, dan paling mendukung visi jangka panjang Farisium.
