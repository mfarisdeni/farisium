# Security Guidelines

# Tujuan

Keamanan merupakan bagian dari fondasi Farisium.

Seluruh fitur harus dirancang dengan mempertimbangkan keamanan sejak tahap perencanaan, implementasi, hingga deployment.

Keamanan bukan fitur tambahan, tetapi bagian dari kualitas perangkat lunak.

---

# Filosofi

Gunakan prinsip:

* Secure by Default
* Least Privilege
* Defense in Depth
* Fail Secure
* Principle of Minimum Exposure

Seluruh implementasi harus meminimalkan risiko terhadap pengguna maupun platform.

---

# Prinsip Umum

Selalu:

* validasi seluruh input;
* batasi akses sesuai kebutuhan;
* gunakan komunikasi terenkripsi;
* lindungi data pengguna;
* gunakan autentikasi yang aman.

Jangan pernah menganggap data dari pengguna sebagai data yang terpercaya.

---

# Backend

Backend utama Farisium adalah Firebase.

Gunakan:

* Firebase Authentication
* Firestore Security Rules
* Firebase Storage Rules
* Firebase Functions apabila diperlukan

Jangan memindahkan backend ke teknologi lain tanpa keputusan resmi.

---

# Authentication

Seluruh autentikasi menggunakan Firebase Authentication.

Pastikan:

* status login selalu diverifikasi;
* akses berdasarkan identitas pengguna;
* sesi pengguna dikelola dengan benar.

Jangan membuat sistem autentikasi sendiri.

---

# Authorization

Setiap pengguna hanya boleh mengakses data yang menjadi haknya.

Lakukan pemeriksaan hak akses pada setiap operasi yang memerlukan autentikasi.

Jangan hanya mengandalkan validasi pada sisi frontend.

---

# Firestore Rules

Seluruh koleksi Firestore harus memiliki Security Rules.

Jangan pernah menggunakan aturan yang memberikan akses penuh pada lingkungan produksi.

Aturan keamanan harus mengikuti kebutuhan setiap koleksi.

---

# Firebase Storage

Seluruh file yang diunggah harus divalidasi.

Batasi:

* ukuran file;
* jenis file;
* hak akses terhadap file.

Gunakan URL yang aman dan tidak mengekspos struktur internal.

---

# Environment Variable

Seluruh informasi sensitif harus disimpan pada Environment Variable.

Contohnya:

* API Key
* Secret Key
* Credential
* Access Token
* Endpoint internal

Jangan pernah menuliskan informasi sensitif secara langsung di dalam source code.

---

# API

Seluruh endpoint harus:

* melakukan validasi input;
* memverifikasi identitas pengguna apabila diperlukan;
* mengembalikan respons yang konsisten;
* tidak membocorkan informasi internal.

Pesan kesalahan tidak boleh mengungkapkan struktur sistem.

---

# Validasi Input

Seluruh data dari pengguna harus divalidasi.

Periksa:

* format;
* panjang data;
* tipe data;
* nilai yang diperbolehkan.

Validasi harus dilakukan pada backend meskipun frontend telah melakukan validasi.

---

# Sanitasi Data

Data yang ditampilkan kembali kepada pengguna harus disanitasi apabila diperlukan.

Hindari kemungkinan:

* Cross Site Scripting (XSS)
* HTML Injection
* Script Injection

---

# Upload File

Seluruh file yang diunggah harus:

* memiliki tipe yang diperbolehkan;
* memiliki ukuran maksimum;
* memiliki nama file yang aman.

Jangan menggunakan nama file asli sebagai identitas penyimpanan.

---

# Dependency

Gunakan dependency seminimal mungkin.

Sebelum menambahkan library baru:

* pastikan benar-benar diperlukan;
* gunakan library yang aktif dipelihara;
* gunakan versi yang stabil.

Hapus dependency yang sudah tidak digunakan.

---

# Logging

Log digunakan untuk membantu proses pemantauan dan debugging.

Jangan pernah mencatat:

* password;
* token;
* secret key;
* credential;
* informasi sensitif pengguna.

---

# Error Handling

Pesan kesalahan harus membantu pengguna tanpa mengungkapkan detail internal sistem.

Gunakan pesan yang sederhana dan mudah dipahami.

Detail teknis hanya boleh tersedia pada log internal.

---

# Rate Limiting

Fitur yang berpotensi disalahgunakan harus memiliki mekanisme pembatasan.

Contoh:

* Login
* Generate AI
* Claim Reward
* Referral
* Upload

Pembatasan dapat berdasarkan akun, alamat IP, atau mekanisme lain yang sesuai.

---

# AI Services

Layanan AI harus:

* memvalidasi permintaan;
* membatasi penggunaan sesuai hak akses;
* melindungi resource GPU;
* mencegah penyalahgunaan sistem.

Seluruh proses inferensi harus mempertimbangkan efisiensi penggunaan sumber daya.

---

# Docker

Container hanya menjalankan layanan yang diperlukan.

Hindari:

* menjalankan container dengan hak akses berlebihan;
* membuka port yang tidak digunakan;
* menyimpan credential di dalam image.

Gunakan image resmi dan versi stabil.

---

# Ollama

Ollama digunakan sebagai AI lokal.

Pastikan:

* hanya dapat diakses dari lingkungan yang diizinkan;
* tidak diekspos ke internet tanpa mekanisme keamanan yang sesuai.

---

# Open WebUI

Open WebUI hanya digunakan sebagai antarmuka AI internal.

Apabila digunakan secara publik, wajib menambahkan:

* autentikasi;
* HTTPS;
* pembatasan akses.

---

# HTTPS

Seluruh layanan publik wajib menggunakan HTTPS.

Jangan mengirimkan informasi sensitif melalui koneksi yang tidak terenkripsi.

---

# Backup

Data penting harus memiliki mekanisme backup.

Backup harus dilakukan secara berkala dan dapat dipulihkan apabila terjadi kegagalan.

---

# Monitoring

Pantau:

* status layanan;
* penggunaan resource;
* kesalahan aplikasi;
* aktivitas yang tidak biasa.

Monitoring bertujuan mendeteksi masalah lebih awal.

---

# Privacy

Farisium menghormati privasi pengguna.

Kumpulkan hanya data yang benar-benar diperlukan.

Gunakan data pengguna sesuai tujuan yang telah dijelaskan.

---

# Checklist Sebelum Deploy

Sebelum deployment, pastikan:

* Environment Variable sudah benar.
* Tidak ada secret di repository.
* Firestore Rules sudah diperiksa.
* Storage Rules sudah diperiksa.
* Endpoint telah divalidasi.
* Dependency telah diperbarui.
* Tidak ada debug code.
* Logging aman.
* HTTPS aktif pada layanan publik.
* Backup tersedia.

---

# Prinsip Akhir

Keamanan adalah tanggung jawab seluruh proses pengembangan.

Setiap perubahan pada Farisium harus dievaluasi berdasarkan dampaknya terhadap keamanan, privasi pengguna, dan keberlanjutan platform.

Jika terdapat dua solusi yang memberikan hasil yang sama, pilih solusi yang lebih aman, lebih sederhana, dan lebih mudah dipelihara dalam jangka panjang.
