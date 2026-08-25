# Farisium

> **Build the Future with Artificial Intelligence.**

Farisium adalah platform AI terpadu yang menghadirkan berbagai layanan berbasis kecerdasan buatan dalam satu ekosistem modern.

Berbeda dengan aplikasi AI yang berdiri sendiri, seluruh produk Farisium dirancang sebagai bagian dari satu platform dengan identitas visual, arsitektur, dan pengalaman pengguna yang konsisten.

---

# Vision

Membangun ekosistem AI modern yang mudah digunakan, memiliki performa tinggi, dan memberikan manfaat nyata bagi individu maupun bisnis.

---

# Current Modules

Saat ini Farisium dikembangkan sebagai satu platform yang terdiri dari beberapa modul.

## AI

* Anime Generator
* AI Compute

## Platform

* Homepage
* Dashboard
* Blog
* Rewards
* Partnership

Semua modul berada dalam satu repository dan menggunakan arsitektur yang sama.

---

# Technology Stack

## Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS

## Backend

* Firebase Authentication
* Firestore
* Firebase Storage
* Firebase Functions

## Artificial Intelligence

* Stable Diffusion
* Ollama
* Qwen2.5 Coder
* Qwen3

Windows

├── Ollama
│     ├── qwen3.5:9b
│     ├── qwen2.5-coder:7b
│     └── nomic-embed-text
│
└── OpenCode
      ├── Architect Agent
      │      └── qwen3.5:9b
      │
      └── Coding Agent
             └── qwen2.5-coder:7b





## Development

* OpenCode menjadi AI Coding Environment.
* Ollama menjalankan seluruh model secara lokal.
* Semua interaksi AI dilakukan melalui OpenCode, bukan langsung ke Ollama.
* Update file dan direktori di root directory

## Deployment

* Rumahweb Node.js
* Manual upload ke Cpanel File Manager yang sudah terinstall Node.js

---

# Project Structure

```text
Farisium
│
├── AGENTS.md
├── README.md
│
├── app/
├── components/
├── hooks/
├── lib/
├── services/
├── types/
├── utils/
├── public/
│
├── docs/
│
└── package.json
```

---

# Documentation

Seluruh dokumentasi proyek berada di folder:

```text
/docs
```

Dokumentasi mencakup:

* Vision
* Architecture
* Design System
* Coding Style
* Firebase
* Homepage
* AI Compute
* Anime Generator
* FRSC
* Partnership
* SEO
* Google AdSense
* Security
* Performance
* Roadmap
* Decisions
* Brand Guideline
* UI Components
* Animation
* UI Rules
* Code Review
* Copywriting

---

# AI Development

Farisium dikembangkan menggunakan AI Assisted Development.

AI yang digunakan antara lain:

* Opencode
* Ollama
* Qwen2.5 Coder
* Qwen3

Seluruh AI Agent harus mengikuti aturan yang terdapat pada:

```text
AGENTS.md
```

---

# Development Principles

Farisium dibangun dengan prinsip:

* Simplicity
* Scalability
* Maintainability
* Reusability
* Performance
* Security

Seluruh implementasi harus mengikuti dokumentasi resmi proyek.

---

# User Experience

Farisium menggunakan pendekatan desain:

* Premium
* Modern
* Minimal
* Dark Theme
* Mobile First
* SEO Friendly
* Google AdSense Friendly

Setiap halaman harus memiliki pengalaman pengguna yang konsisten.

---

# Getting Started

## Install Dependencies

```bash
npm install
```

---

## Development Server

```bash
npm run dev
```

---

## Production Build

```bash
npm run build
```

---

## Start Production

```bash
npm start
```

---

# Development Workflow

Sebelum membuat fitur baru:

1. Baca AGENTS.md.
2. Baca dokumentasi yang relevan di folder docs.
3. Gunakan komponen yang sudah ada.
4. Ikuti Design System Farisium.
5. Perbarui dokumentasi apabila diperlukan.

---

# Project Philosophy

Farisium bukan sekadar kumpulan AI Tools.

Farisium adalah sebuah ekosistem yang menghubungkan berbagai layanan AI ke dalam satu platform dengan identitas visual, pengalaman pengguna, dan arsitektur yang konsisten.

Setiap keputusan pengembangan harus mendukung visi jangka panjang tersebut.

---

# License

Hak cipta © Farisium.

Seluruh hak dilindungi sesuai kebijakan proyek.
