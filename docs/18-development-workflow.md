# Development Workflow

# Tujuan

Dokumen ini menjelaskan standar workflow pengembangan Farisium.

Seluruh AI Agent, Developer, dan kontributor harus mengikuti alur kerja yang sama agar kualitas kode, arsitektur, dan pengalaman pengguna tetap konsisten.

Setiap perubahan pada proyek harus mempertimbangkan keberlanjutan jangka panjang, bukan hanya penyelesaian masalah sesaat.

---

# Prinsip Pengembangan

Selalu utamakan:

* Kesederhanaan.
* Skalabilitas.
* Reusability.
* Maintainability.
* Konsistensi.
* Performa.
* Pengalaman pengguna.

Jangan pernah mengorbankan arsitektur hanya demi solusi yang lebih cepat.

---

# Workflow Pengembangan

Setiap permintaan pengembangan harus mengikuti urutan berikut.

## 1. Memahami Permintaan

Sebelum menulis kode:

* pahami tujuan pengguna;
* pahami masalah yang ingin diselesaikan;
* identifikasi dampak terhadap sistem.

Jangan langsung menghasilkan kode.

---

## 2. Membaca Dokumentasi

AI harus membaca dokumen berikut sebelum membuat implementasi.

1. AGENTS.md
2. docs/17-decisions.md
3. docs/19-farisium-brand.md
4. Dokumen yang berkaitan dengan fitur yang sedang dikerjakan.

Apabila terdapat aturan pada dokumentasi, aturan tersebut harus diprioritaskan.

---

## 3. Analisis Arsitektur

Sebelum membuat file baru:

* cari apakah solusi sudah tersedia;
* identifikasi komponen yang dapat digunakan kembali;
* identifikasi utility yang sudah ada;
* identifikasi pola yang digunakan pada proyek.

Jangan membuat implementasi baru apabila solusi yang sesuai sudah tersedia.

---

## 4. Perencanaan

Sebelum mulai menulis kode:

* tentukan struktur file;
* tentukan komponen yang dibutuhkan;
* tentukan alur data;
* tentukan dependency yang diperlukan.

Tambahkan dependency baru hanya jika benar-benar diperlukan.

---

## 5. Implementasi

Saat menulis kode:

* gunakan TypeScript;
* gunakan React dan Next.js App Router;
* gunakan Server Component sebagai pilihan utama;
* gunakan Client Component hanya apabila diperlukan;
* gunakan Tailwind CSS;
* gunakan Firebase sebagai backend.

Selalu mengikuti struktur proyek Farisium.

---

## 6. Reuse

Prioritaskan penggunaan ulang terhadap:

* Components
* Hooks
* Utilities
* Types
* Constants
* Layout
* Styles

Hindari duplikasi kode.

---

## 7. Penamaan

Gunakan penamaan yang konsisten.

Nama file, folder, komponen, fungsi, dan variabel harus mudah dipahami dan menggambarkan fungsinya.

Hindari singkatan yang tidak jelas.

---

## 8. UI dan UX

Seluruh halaman harus mengikuti Design System Farisium.

Pastikan:

* Dark Theme.
* Premium.
* Modern.
* Minimalis.
* Mobile First.
* SEO Friendly.
* AdSense Friendly.

Setiap halaman harus terasa sebagai bagian dari Farisium.

---

## 9. Performa

Selalu mempertimbangkan performa.

Gunakan:

* Dynamic Import apabila diperlukan.
* Lazy Loading.
* Image Optimization.
* Code Splitting.
* Server Components.
* Suspense apabila sesuai.

Jangan menambahkan library yang tidak memberikan manfaat nyata.

---

## 10. Keamanan

Pastikan:

* tidak ada API Key yang ditulis langsung pada kode;
* menggunakan Environment Variable;
* melakukan validasi input;
* mengikuti Firebase Security Rules.

Keamanan merupakan bagian dari implementasi, bukan tambahan di akhir.

---

## 11. SEO

Setiap halaman publik harus mengikuti panduan pada docs/11-seo.md.

Pastikan:

* metadata lengkap;
* semantic HTML;
* heading yang benar;
* Open Graph;
* internal linking.

---

## 12. Google AdSense

Seluruh halaman harus mengikuti panduan pada docs/12-adsense.md.

Jangan membuat layout yang mengganggu pengalaman pengguna.

Konten selalu lebih penting daripada penempatan iklan.

---

## 13. Self Review

Sebelum menyelesaikan implementasi, lakukan pemeriksaan terhadap:

* kualitas kode;
* konsistensi;
* performa;
* keamanan;
* SEO;
* Design System;
* dokumentasi.

Perbaiki masalah yang ditemukan sebelum melanjutkan.

---

## 14. Dokumentasi

Apabila perubahan memengaruhi arsitektur, fitur, atau workflow, dokumentasi pada folder docs wajib diperbarui.

Dokumentasi merupakan bagian dari proses pengembangan.

---

## 15. Penyelesaian

Sebuah tugas dianggap selesai apabila:

* fitur berjalan dengan benar;
* kode bersih;
* tidak terdapat duplikasi;
* dokumentasi telah diperbarui apabila diperlukan;
* mengikuti seluruh standar Farisium.

Implementasi yang hanya berjalan tetapi tidak mengikuti standar proyek belum dianggap selesai.

---

# Checklist Sebelum Menulis Kode

Sebelum membuat implementasi, AI harus memastikan:

* Memahami tujuan fitur.
* Membaca dokumentasi yang relevan.
* Memahami struktur proyek.
* Tidak membuat duplikasi.
* Menggunakan komponen yang sudah ada.
* Mengikuti keputusan pada docs/17-decisions.md.
* Mengikuti Design System Farisium.

---

# Checklist Sebelum Menyatakan Selesai

Sebelum menyatakan pekerjaan selesai, AI harus memastikan:

* Tidak terdapat error.
* Struktur kode tetap rapi.
* Tidak ada dependency yang tidak diperlukan.
* Performa tetap optimal.
* UI konsisten.
* Mobile responsive.
* SEO tidak terganggu.
* Dokumentasi telah diperbarui apabila diperlukan.

---

# Filosofi Pengembangan

AI bukan hanya menghasilkan kode.

AI adalah bagian dari tim pengembang Farisium.

Setiap keputusan harus mempertimbangkan dampaknya terhadap seluruh ekosistem, bukan hanya fitur yang sedang dikerjakan.

Apabila terdapat beberapa solusi yang memungkinkan, gunakan urutan prioritas berikut:

1. Mengikuti keputusan arsitektur Farisium.
2. Menggunakan komponen yang sudah ada.
3. Menjaga konsistensi Design System.
4. Memilih solusi yang paling sederhana.
5. Memilih solusi yang paling mudah dipelihara.
6. Mengoptimalkan performa.
7. Menghindari penambahan dependency baru.

Tujuan akhir dari seluruh workflow ini adalah membangun platform AI yang stabil, mudah dikembangkan, memiliki identitas yang kuat, dan dapat dipelihara dalam jangka panjang oleh manusia maupun AI.
