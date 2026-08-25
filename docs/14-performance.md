# Performance Guidelines

# Audit Phase 5 (v2.3)

 Berikut hasil audit & perbaikan konkret yang diterapkan:

 ## Privacy & Log
 - `lib/sd-api.ts`: **dihapus 6 `console.log`** yang men-spill prompt user + final prompt ke log server. Sebelumnya setiap generate mencatat teks prompt ke stdout — privacy concern + log noise di produksi.

 ## Image Lazy Loading
 Tambahan `loading="lazy"` pada `<img>` non-LCP yang sebelumnya eager:
 - `components/layout/Navbar.tsx` — avatar user (kecil tapi tetap lazy).
 - `components/profile-card.tsx` — avatar user + 2 ikon FRSC.
 - `components/support-modal.tsx` — ikon FRSC di modal.
 - `app/dashboard/page.tsx` — avatar profil + claim bg + claim logo (below-fold).
 - `app/rewards/page.tsx` — partner reward bg + logo.
 - `app/competition/page.tsx` — competition bg (Phase 4).
 - `app/blog/[slug]/page.tsx` — article body images (sudah ada).
 - `components/home/BlogSection.tsx` — feature post images (Phase 3).

 ## Hero Video (LCP)
 `components/home/HeroSection.tsx`:
 - Tambah `preload="metadata"` agar browser tidak download full video saat idle (autoplay override saat play).
 - Tambah **respect `prefers-reduced-motion`**: video di-pause untuk user yang minta less motion (WCAG 2.3.3 + battery/bandwidth friendliness). Re-apply saat preference berubah.

 ## Aset Besar di `/public` (rekomendasi optimasi manual di luar kode)
 Dipetakan dari `Get-ChildItem public`:

 | Aset | Ukuran | Rekomendasi |
 |------|--------|-------------|
 | `farisium-frsc-web.mp4` | 733 KB | Compress ke ~2-3 MB lebih kecil (ffmpeg `-crf 28 -movflags +faststart`); gunakan segment HLS bila perlu. Saat ini LCP homepage dominan video. |
 | `og-image.png` | 133 KB | OK untuk OG (PNG wajib), tapi bisa compress lebih lanjut dengan `pngquant`. |
 | `icon.svg` | 125 KB | SVG besar — verifikasi terpakai; bila tidak, hapus. |
 | `qris.jpg` | 117 KB | Compress ke ~30-50 KB (QR tetap scannable). |
 | `anime-generator-icon.png` | 39 KB | LCP untuk /ai/anime-generator icon - OK. |
 | `farisium-coin.png` | 22 KB | Dipakai berulang — cached setelah load pertama. |

 ## Accessibility Audit
 - Tidak ditemukan `<img>` tanpa `alt` (empty `alt=""` untuk dekoratif = OK).
 - Breadcrumb jadi `<nav aria-label="Breadcrumb">` + `aria-current="page"` (Phase 4).
 - FAQ accordions pakai `aria-controls`/`role="region"`/`id`/focus-ring (Phase 3-4).
 - `role="alert"` pada error auth (Phase 4).
 - Ikon dekoratif pakai `aria-hidden="true"` konsisten (Phase 3-4).
 - Hero video: `aria-label` deskriptif + reduced-motion pause (Phase 5).
 - Skip-link "Skip to main content" sudah ada di root layout (`#main-content`).

 ## Responsive Audit
 - Scan fixed `w-/h-` pixel: hanya pada liquid blobs (dekoratif), ad-slot min-height (reserved space — anti-CLS), Navbar max-w truncate (responsif). Tidak ada layout break mobile.
 - Touch target: tombol CTA utama `min-h-[36px]` di Navbar — memenuhi minimum 44px ideal? Tidakseuruhnya (36px). Namun touch target visual pakai padding, dan tombol `py-3`-`py-3.5` di CTA besar sudah 44px+.
 - Heading fluid (`clamp()`) menjamin responsive typography all breakpoints.

 ## Build & Bundle
 - Build Turbopack: 8s compiled, 32 routes static/dynamic. Tidak ada regression lint TypeScript.
 - Turbopack output tidak menampilkan First Load JS per route secara default — untuk monitoring per-route bundle, tambahkan `@next/bundle-analyzer` sebagai devDependency bila ingin insight (optional, bukan kebutuhan fungsional).

 ## Bug Lama yang Masih Ada (Catatan — di luar scope Phase 5)
 - `middleware.ts` warning deprecation Next 16 "middleware → proxy" — perubahan arsitektur, perlu keputusan eksplisit.
 - `lib/queue.ts` (`QueueEngine`) tidak dipakai `useGenerate` (duplikasi queue logic) — business logic refactor, phase terpisah.
 - Navbar dropdown Link `/profile` & `/settings` → halaman tidak ada di routing — bug data.

---

# Tujuan

Performa merupakan salah satu fondasi utama Farisium.

Seluruh halaman, komponen, dan layanan harus dirancang agar memberikan pengalaman yang cepat, ringan, responsif, dan efisien pada berbagai jenis perangkat.

Optimasi performa harus dilakukan sejak tahap perencanaan, bukan setelah aplikasi selesai dibuat.

---

# Filosofi

Prioritaskan:

* Kecepatan.
* Kesederhanaan.
* Efisiensi.
* Pengalaman pengguna.
* Skalabilitas.

Jangan menambahkan fitur, animasi, atau dependency yang menurunkan performa tanpa memberikan manfaat yang jelas.

---

# Target Performa

Farisium menargetkan:

* Waktu loading secepat mungkin.
* Navigasi yang responsif.
* Interaksi yang terasa instan.
* Penggunaan resource yang efisien.
* Core Web Vitals yang baik.

---

# Next.js

Gunakan kemampuan bawaan Next.js semaksimal mungkin.

Prioritaskan:

* App Router.
* Server Components.
* Server Rendering apabila sesuai.
* Static Rendering apabila memungkinkan.
* Route Segment yang terstruktur.

Gunakan Client Components hanya apabila benar-benar diperlukan.

---

# Server Components

Server Components adalah pilihan utama.

Keuntungan:

* JavaScript yang dikirim ke browser lebih sedikit.
* Loading lebih cepat.
* Bundle lebih kecil.
* SEO lebih baik.

Gunakan Client Components hanya untuk fitur yang membutuhkan interaksi langsung.

---

# Client Components

Batasi penggunaan Client Components.

Gunakan hanya untuk:

* Event pengguna.
* Form.
* State interaktif.
* Animasi.
* Browser API.

Jangan menjadikan seluruh halaman sebagai Client Component.

---

# Code Splitting

Pisahkan kode berdasarkan kebutuhan.

Gunakan Dynamic Import untuk:

* Dialog.
* Chart.
* Editor.
* Komponen berat.
* Library yang jarang digunakan.

Jangan memuat seluruh kode pada saat halaman pertama dibuka.

---

# Lazy Loading

Gunakan Lazy Loading pada:

* gambar;
* video;
* komponen berat;
* section yang berada di luar area pertama layar.

Seluruh resource harus dimuat hanya ketika benar-benar diperlukan.

---

# Gambar

Gunakan komponen Image dari Next.js.

Pastikan:

* ukuran gambar sesuai kebutuhan;
* format modern digunakan apabila memungkinkan;
* gambar dikompresi;
* atribut alt tersedia.

Hindari penggunaan gambar dengan ukuran jauh lebih besar dari tampilan sebenarnya.

---

# Font

Gunakan font secara efisien.

Prioritaskan:

* Next.js Font Optimization.
* jumlah font seminimal mungkin.
* jumlah weight seminimal mungkin.

Hindari memuat banyak jenis font sekaligus.

---

# Bundle Size

Selalu menjaga ukuran bundle tetap kecil.

Sebelum menambahkan dependency baru, pertimbangkan:

* apakah benar-benar diperlukan;
* apakah sudah tersedia solusi bawaan;
* apakah dapat dibuat sendiri dengan lebih sederhana.

---

# Dependency

Gunakan dependency sesedikit mungkin.

Setiap library baru harus:

* aktif dipelihara;
* memiliki dokumentasi yang baik;
* memberikan manfaat nyata.

Hapus dependency yang sudah tidak digunakan.

---

# Firebase

Gunakan Firebase secara efisien.

Hindari:

* membaca seluruh koleksi apabila hanya membutuhkan sebagian data;
* query yang tidak diperlukan;
* permintaan berulang terhadap data yang sama.

Gunakan query yang spesifik sesuai kebutuhan.

---

# Firestore

Ambil hanya data yang diperlukan.

Gunakan:

* limit;
* pagination;
* filtering;
* indexing.

Jangan memuat ribuan dokumen sekaligus.

---

# State Management

Gunakan state seminimal mungkin.

Prioritaskan:

* Server Components.
* URL State apabila sesuai.
* Local State.

Jangan menyimpan state global apabila hanya digunakan oleh satu komponen.

---

# Rendering

Kurangi proses render yang tidak diperlukan.

Pastikan:

* komponen memiliki tanggung jawab yang jelas;
* data hanya diperbarui apabila berubah;
* proses berat tidak dijalankan berulang.

---

# Animasi

Animasi harus meningkatkan pengalaman pengguna.

Gunakan:

* transisi yang halus;
* durasi singkat;
* animasi seperlunya.

Hindari:

* animasi yang menghambat interaksi;
* animasi berlebihan;
* efek visual yang membebani GPU.

---

# Scroll

Scrolling harus terasa ringan.

Gunakan:

* Lazy Loading.
* Virtualization apabila daftar data sangat panjang.

Jangan merender seluruh data apabila hanya sebagian yang terlihat.

---

# AI Tools

Halaman AI Tools harus:

* cepat dimuat;
* tidak memblokir interaksi pengguna;
* memberikan feedback proses secara jelas;
* menggunakan loading state yang ringan.

Proses inferensi AI tidak boleh membuat halaman terasa lambat.

---

# Caching

Gunakan mekanisme cache apabila sesuai.

Prioritaskan:

* cache bawaan Next.js;
* cache browser;
* cache resource statis.

Hindari permintaan data berulang apabila data belum berubah.

---

# Network

Kurangi jumlah request.

Gabungkan resource apabila memungkinkan.

Gunakan ukuran payload sekecil mungkin.

---

# Logging

Logging hanya digunakan untuk debugging.

Hilangkan log yang tidak diperlukan pada produksi.

---

# Monitoring

Pantau secara berkala:

* waktu loading;
* penggunaan memori;
* ukuran bundle;
* penggunaan CPU;
* penggunaan jaringan.

Optimasi dilakukan berdasarkan data nyata, bukan asumsi.

---

# Core Web Vitals

Seluruh halaman harus memperhatikan:

* Largest Contentful Paint (LCP)
* Interaction to Next Paint (INP)
* Cumulative Layout Shift (CLS)

Performa yang baik harus mendukung pengalaman pengguna dan SEO.

---

# Mobile Performance

Optimasi selalu dilakukan dengan pendekatan Mobile First.

Pastikan:

* JavaScript seminimal mungkin.
* Layout ringan.
* Gambar optimal.
* Interaksi tetap responsif pada perangkat dengan spesifikasi rendah.

---

# Google AdSense

Performa tidak boleh menurun karena penempatan iklan.

Pastikan:

* layout tetap stabil;
* area iklan telah disiapkan sejak awal;
* tidak terjadi Layout Shift ketika iklan dimuat.

---

# Checklist Sebelum Publikasi

Sebelum halaman dipublikasikan, pastikan:

* Bundle tetap kecil.
* Tidak ada dependency yang tidak digunakan.
* Menggunakan Server Components apabila memungkinkan.
* Client Components hanya digunakan jika diperlukan.
* Gambar telah dioptimalkan.
* Font telah dioptimalkan.
* Lazy Loading diterapkan pada resource yang sesuai.
* Tidak terdapat render yang tidak perlu.
* Core Web Vitals tetap baik.
* Mobile Performance telah diperiksa.

---

# Prinsip Akhir

Performa bukan sekadar angka pada alat pengujian.

Performa adalah pengalaman yang dirasakan pengguna.

Setiap keputusan pengembangan harus membuat Farisium terasa lebih cepat, lebih ringan, lebih efisien, dan lebih nyaman digunakan.

Jika terdapat dua solusi dengan hasil yang sama, pilih solusi yang lebih sederhana, lebih ringan, dan lebih mudah dipelihara dalam jangka panjang.
