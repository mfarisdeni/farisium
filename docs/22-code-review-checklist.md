# Code Review Checklist

# Tujuan

Dokumen ini menjadi standar pemeriksaan akhir sebelum sebuah pekerjaan dianggap selesai.

Seluruh AI Agent, Developer, maupun kontributor wajib melakukan review terhadap implementasi yang telah dibuat.

Kode yang berjalan bukan berarti kode tersebut siap digunakan.

---

# Filosofi

Code Review bertujuan menjaga:

* kualitas;
* konsistensi;
* keamanan;
* performa;
* kemudahan pemeliharaan.

Review dilakukan sebelum menyatakan pekerjaan selesai.

---

# Review Arsitektur

Pastikan:

* mengikuti AGENTS.md;
* mengikuti docs/17-decisions.md;
* mengikuti struktur proyek;
* tidak melanggar Design System.

---

# Review Struktur

Pastikan:

* folder tetap rapi;
* tidak membuat file yang tidak diperlukan;
* tidak membuat struktur yang membingungkan.

---

# Review Komponen

Pastikan:

* menggunakan komponen yang sudah ada;
* tidak membuat duplikasi;
* komponen tetap reusable;
* props tetap sederhana.

---

# Review TypeScript

Pastikan:

* tidak menggunakan any tanpa alasan yang jelas;
* tipe data sesuai;
* interface dan type digunakan dengan benar.

---

# Review Next.js

Pastikan:

* menggunakan App Router;
* menggunakan Server Components apabila memungkinkan;
* Client Components hanya digunakan jika diperlukan.

---

# Review Firebase

Pastikan:

* query efisien;
* tidak membaca data yang tidak diperlukan;
* mengikuti Firestore Rules;
* menggunakan Authentication apabila diperlukan.

---

# Review Performa

Pastikan:

* tidak menambah dependency yang tidak diperlukan;
* bundle tetap kecil;
* gambar telah dioptimalkan;
* menggunakan Lazy Loading apabila sesuai.

---

# Review UI

Pastikan:

* mengikuti Design System;
* Dark Theme tetap konsisten;
* responsive;
* spacing konsisten;
* typography konsisten;
* Glassmorphism digunakan secara wajar.

---

# Review UX

Pastikan:

* navigasi mudah dipahami;
* Loading State tersedia;
* Empty State tersedia apabila diperlukan;
* Error State jelas;
* pengguna memperoleh feedback yang baik.

---

# Review SEO

Pastikan:

* metadata tersedia;
* heading benar;
* Semantic HTML digunakan;
* internal link tersedia apabila relevan.

---

# Review Google AdSense

Pastikan:

* layout tetap stabil;
* area iklan tidak mengganggu konten;
* tidak terdapat popup yang mengganggu.

---

# Review Keamanan

Pastikan:

* tidak ada secret pada source code;
* Environment Variable digunakan;
* input divalidasi;
* hak akses diperiksa.

---

# Review Accessibility

Pastikan:

* keyboard navigation berfungsi;
* Focus State tersedia;
* kontras warna memadai;
* label tersedia pada form.

---

# Review Dokumentasi

Pastikan:

* dokumentasi diperbarui apabila diperlukan;
* keputusan baru dicatat pada docs/17-decisions.md;
* perubahan besar terdokumentasi.

---

# Review Dependency

Pastikan:

* dependency benar-benar diperlukan;
* tidak ada library yang tidak digunakan;
* menggunakan versi stabil.

---

# Review Kode

Pastikan:

* mudah dibaca;
* mudah dipahami;
* tidak ada dead code;
* tidak ada komentar yang tidak diperlukan;
* tidak ada console log yang tertinggal.

---

# Review Final

Sebelum menyatakan pekerjaan selesai, pastikan seluruh poin berikut terpenuhi:

* Fitur berjalan dengan baik.
* Tidak terdapat error.
* Tidak terdapat warning penting.
* Kode bersih.
* Struktur tetap rapi.
* Dokumentasi diperbarui apabila diperlukan.
* Mengikuti seluruh standar Farisium.

---

# Definisi Selesai

Sebuah pekerjaan dianggap selesai apabila:

* memenuhi kebutuhan pengguna;
* mengikuti arsitektur Farisium;
* mempertahankan kualitas kode;
* menjaga konsistensi UI;
* menjaga performa;
* menjaga keamanan;
* siap digunakan pada lingkungan produksi.

Implementasi yang hanya berfungsi tetapi tidak memenuhi standar kualitas Farisium belum dapat dinyatakan selesai.
