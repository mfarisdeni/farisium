# 33. AI Agent: Product Catalog (`/ai/product-catalog`)

Agen AI Farisium untuk **screenshot katalog marketplace**: upload beberapa
halaman katalog (Shopee, Tokopedia, Lazada, Blibli, katalog supplier, atau foto
halaman produk) → setiap kartu produk dibaca, diatribusikan ke toko yang
mencetaknya, diperiksa manusia, lalu diekspor ke **Excel (3 sheet)** atau
**PDF multi-halaman**.

Ini **bukan** Receipt/Invoice dengan nama lain. Perbedaan intinya: satu
dokumen katalog berisi **puluhan produk** yang tidak punya total tagihan, dan
satu metadata penting — **nama toko** — muncul sebagai *header* di atas
sekelompok kartu, bukan di dalam kartunya.

## Alur Teknis

```
Browser ──(1) POST /api/r2/presign-upload {feature: "product_catalog", ...}  (per file)
Server  ──(auth, validasi tipe/ukuran, rate limit, buat Firestore job)──> {jobId, uploadUrl}
Browser ──(2) PUT file langsung ke R2 (presigned, bind Content-Type)────────> R2
        (ulangi (1)–(2) untuk semua file, maksimal 8 halaman)

Browser ──(3) POST /api/agents/product-catalog {jobId}   (concurrency = 2, per halaman)
Server  ──(download R2 → Gemini (transkripsi → struktur) → Zod
            → quality gate → update job → HAPUS gambar input dari R2)
            ───────────────────────────────────────────────────> {catalog per halaman}
        (ulangi (3) untuk setiap halaman; satu halaman gagal TIDAK membatalkan
         halaman lain — hasilnya dikumpulkan di sisi client)

Browser ──(4) POST /api/agents/product-catalog/export {format, report}  (dari data SUDAH diperiksa)
Server  ──(Zod validasi ulang → ExcelJS / pdf-lib → stream langsung sebagai attachment)
            ───────────────────────────────────────────────────> file
```

### Keputusan yang berbeda dari Receipt / Invoice / Expense

| Aspek | Receipt & Invoice | Expense Report | Product Catalog |
| --- | --- | --- | --- |
| Jumlah file | 1 | hingga 20 struk | hingga **8 halaman katalog** |
| Ukuran hasil | 1 dokumen | 1 dokumen berisi banyak struk | **hingga 600 produk merged** |
| Atribusi seller | sudah ada (kasir) | per struk | **per kartu produk, dari header toko** |
| Sumber kebenaran export | job Firestore | payload client | payload client |
| Penyimpanan output | R2 (stream + hapus) | tidak disimpan | tidak disimpan |
| Kegagalan | satu file = gagal | per struk terisolasi | per halaman terisolasi + bisa di-retry |

Yang **tidak** ada di agen ini: tidak ada total tagihan yang dikarang. Halaman
katalog tidak punya subtotal/pajak, jadi semua statistik diturunkan dari harga
yang tercetak dan dilabeli apa adanya.

## Modul

| File | Tanggung jawab |
| --- | --- |
| `features/product-catalog/schema.ts` | `productCatalogSchema` (hasil AI per halaman), `catalogRowSchema` (+`id`, kontrak export), `catalogReportSchema`, `MAX_PRODUCTS_PER_DOCUMENT = 400`, `MAX_CATALOG_DOCUMENTS = 8`, `MAX_CATALOG_PRODUCTS = 600`, `toCatalogRow()`. |
| `features/product-catalog/prompt.ts` | Instruksi marketplace: urutan baca visual, pasangan harga coret vs harga payable, noise UI yang boleh diabaikan, aturan atribusi toko, badge yang **bukan** toko. |
| `features/product-catalog/extract.ts` | Ekstraksi satu halaman (Gemini 2 tahap + quality gate `isStubCatalog`) — murni, tanpa I/O, bisa diuji `node --test`. |
| `features/product-catalog/merge.ts` | `catalogRowId(doc, idx)` + `mergeCatalogs()`: gabung halaman sesuai urutan upload, de-duplikasi daftar toko, cap 600 produk, catat file gagal. |
| `features/product-catalog/summary.ts` | `buildCatalogSummary()`, `catalogDocumentNames()`, `CURRENCY_OPTIONS`. Satu implementasi dipakai bersama oleh UI, Excel, dan PDF. |
| `features/product-catalog/validation.ts` | Issue sebelum export sebagai **kode field** (`name`, `price`, `priceAboveOriginal`, `ratingRange`, `discountRange`, `storeIsMarketplace`), plus `isMarketplaceName()` dan pemisah `countIncompleteRows` / `countAdvisoryRows`. Tidak pernah memblokir export, dan tidak pernah menulis ulang nilai. |
| `features/product-catalog/duplicates.ts` | Deteksi duplikat *advisory* (nama ternormalisasi + harga dalam toleransi absolut/relatif). |
| `features/product-catalog/processor.ts` | Orkestrasi per halaman: unduh R2 → ekstrak → tulis `job.result` → hapus input (best-effort). Job selesai yang dipanggil ulang **tidak** diproses dua kali. |
| `lib/exporters/product-catalog-to-excel.ts` | 3 sheet: *Catalog* (auto-filter + kolom **Review** berisi kode issue + total harga), *Stores* (rincian per toko), *Summary* (metadata, statistik, daftar sumber, file gagal). |
| `lib/exporters/product-catalog-to-pdf.ts` | Multi-halaman bilingual: header/meta, tabel produk dua baris (nama + varian/merek) dengan pecah halaman otomatis, blok total harga, daftar gambar gagal, footer bernomor. |
| `lib/exporters/pdf-kit.ts` | Token + primitive PDF bersama. Ditambah `truncateToWidth()`: memotong teks **lebar kolom**, bukan jumlah karakter, memakai metrik font asli. |
| `lib/limits.ts` | `PRODUCT_CATALOG_FEATURE` + `DAILY_LIMITS` (murni, tanpa Firebase) — satu sumber kebenaran untuk batas harian yang dibaca server, client, dan test. |
| `components/catalog/content.ts` | Semua string bilingual (`id`/`en`) dalam satu objek. Copy angka batas di-interpolasi dari konstanta aslinya. |
| `components/catalog/CatalogUploader.tsx` | Dropzone + input kamera, validasi tipe/ukuran/duplikat, antrean pratinjau dengan revoke object URL. |
| `components/catalog/CatalogReviewTable.tsx` | Tabel review: ubah nama/varian/SKU/merek/kategori/harga/original/diskon/toko/rating/terjual/catatan, tandai perlu diperiksa, tandai duplikat, hapus, tambah produk manual. |
| `components/catalog/CatalogSummaryPanel.tsx` | Statistik, rincian per toko dengan bar persentase, daftar dokumen sumber, file gagal, pilihan mata uang. |
| `app/api/agents/product-catalog/route.ts` | Proses satu halaman (`maxDuration 120`). |
| `app/api/agents/product-catalog/export/route.ts` | Validasi + bangun + stream Excel/PDF (`maxDuration 60`). |
| `.env.example` | `GEMINI_MODEL_CATALOG=gemini-3-flash-preview` (override per-fitur) + `GEMINI_FALLBACK_MODELS` (rantai fallback, opsional). |

## Atribusi Toko (bagian paling rawan)

Di katalog marketplace, kartu produk **tidak** mencantumkan nama penjualnya.
Nama toko muncul sebagai header di atas sekelompok kartu. Aturan yang dipakai
`prompt.ts`:

1. Semua nama toko yang tercetak di halaman dikumpulkan ke array `shops` sesuai
   urutan baca.
2. Setiap produk memakai toko yang header-nya **terdepat di atas kartu itu**,
   dan tetap berlaku sampai header berikutnya muncul.
3. Kartu yang berada **di atas** header toko pertama tidak_pinjamkan toko
   mana pun — `store` dibiarkan `null`.
4. Badge bukan toko: `Star+`, `Official Store`, `PROMO`, `Gajian Sale`, label
   gratis ongkir, dan nama marketplace itu sendiri (`source`).
5. Kota/kabupaten bukan nama toko. Kalau teks di dekat kartu terasa seperti
   lokasi, `store` = `null` dan alasannya ditulis ke `notes`.

Aturan 3–5 adalah hasil pengujian terhadap katalog asli: model kecil cenderung
"meminjam" header di bawahnya, salah membaca label lokasi/b sebagai nama toko,
dan menulis nama marketplace sendiri (`Tokopedia`, `tokopedia.com`,
`Lazada Indonesia`) ke kolom `store`. Array `shops` tingkat atas juga tidak selalu terisi — halaman yang hanya
mengisi `store` per produk tetap menghasilkan daftar toko yang berguna karena
`merge.ts` melengkapi daftar itu dengan nilai `store` dari baris. Kesalahan atribusi **tidak** dihapus/diperbaiki otomatis — nilainya
ditampilkan apa adanya agar pengguna memeriksa, dan hanya baris yang secara
deterministik mencurigakan (`store` kosong) yang diberi atribut review
(`name`/`price` kosong) oleh `validation.ts`.

## Aturan Perhitungan

Satu implementasi di `summary.ts`, dipakai UI maupun kedua exporter:

- **`totalValue` = jumlah `price` yang tercetak.** Ini **bukan** total
  bisnis; label di UI maupun dokumen selalu menyebutnya jumlah harga
  tercetak.
- Baris tanpa harga tetap **ikut terhitung** di `productCount` tetapi tidak
  di `pricedCount` maupun `totalValue`.
- `minPrice`/`maxPrice`/`averagePrice` dihitung dari baris berharga saja;
  katalog kosong menghasilkan `null`, bukan `NaN` atau `0`.
- `discountedCount` = baris yang punya `originalPrice` **atau**
  `discountPercent` (dihitung terpisah dari nilai diskon).
- Rincian per toko memakai `Map` dengan kunci `null` untuk baris yang benar-benar
  tercetak tanpa toko, sehingga produk tidak hilang dari statistik.
- Tidak ada nilai yang pernah ditulis ulang oleh kalkulasi. Kalau angkanya
  tidak konsisten (mis. harga payable lebih besar dari harga coret), itu
  dilaporkan sebagai `priceAboveOriginal`, bukan diperbaiki.

## Deteksi Duplikat

Sepenuhnya advisory — **tidak pernah menghapus data**:

- Nama produk dinormalisasi (lowercase, tanpa tanda baca, spasi dirapatkan)
  sehingga judul terpotong marketplace (`LAMPU LED NEON...`) cocok dengan
  versi penuhnya.
- Harga dianggap sama bila selisih ≤ 1 absolut **atau** ≤ 0,5% relatif.
- Baris tanpa nama, tanpa harga, atau nama terlalu pendek tidak pernah
  dituduh — tidak ada sinyal yang cukup untuk menuduh.
- Tiga salinan menghasilkan **satu** grup, bukan tiga.

## Rate Limit

Peta `DAILY_LIMITS` berada di `lib/limits.ts` (modul murni, bisa diimpor client
dan `node --test`), sedangkan `lib/jobs/core.ts` yang menegakkan batas tersebut
di server. Copy batas di UI meng-interpolasi konstanta yang sama, jadi angka
yang tampil selalu sama dengan yang ditegakkan server.

| Feature | Limit/hari |
| --- | --- |
| `receipt_to_excel` | 10 struk |
| `invoice_from_image` | 10 invoice |
| `expense_report` | 20 struk (2 laporan penuh) |
| `product_catalog` | 10 halaman |

Batas katalog 10/hari = 1 halaman penuh per hari, atau satu katalog 8 halaman
plus sisanya untuk retry. Batas lain:

- Maksimal **8 halaman per katalog** (`MAX_CATALOG_DOCUMENTS`).
- Maksimal **600 produk merged** (`MAX_CATALOG_PRODUCTS`) dan **400 per
  halaman** (`MAX_PRODUCTS_PER_DOCUMENT`).
- Maksimal **5 MB per file** (`MAX_FILE_SIZE_BYTES`, di `lib/r2/keys.ts`).

Batas harian sengaja dihitung **per halaman**, bukan per katalog: satu
katalog utuh yang gagal di tengah jalan tidak membuat pengguna kehilangan jatah
harian hanya karena tidak berhasil mengulang 8 halaman sekaligus.

## Privasi & Keamanan

- Bucket R2 **private**; gambar input **dihapus segera** setelah ekstraksi
  (`deleteObject` best-effort, tidak menggagalkan job).
- Semua route memakai `requireAuth` (verifikasi Firebase ID token).
- Ukuran dibatasi 5 MB per file, tipe dikunci ke `jpg/png/webp`, nama file
  di-sanitize anti path-traversal, kunci R2 dibangun dari `uid` + `jobId`.
- Job hanya bisa diakses pemiliknya (`requireOwnedJob`).
- Error 500 tidak pernah membocorkan stack atau secret (`errorResponse`).
- Nama file sumber disimpan pada baris (`sourceFile`) hanya untuk kebutuhan
  review/export, dan selalu berasal dari nama file yang sudah di-sanitize.

## Catatan Teknis

- **Pemisahan pure logic vs I/O** (`extract.ts` vs `processor.ts`) dilakukan
  karena `features/receipt/processor.ts` mengimpor `firebase-admin` yang tidak
  bisa diimpor `node --test`. Semua modul katalog yang diuji tidak menyentuh
  Firebase, React, atau jaringan.
- **ID baris deterministik** `d<documentIndex>p<productIndex>` dipilih agar
  merge → review → export memakai kunci baris yang sama di setiap render, tanpa
  counter global yang bisa bergeser saat retry. `re-run` sengaja
  membangun ulang dari nol sehingga ID selalu cocok dengan koordinat baris di
  tabel hasil.
- **Instruksi dikirim lewat user text**, bukan `systemInstruction`, mengikuti
  pola yang memperbaiki akurasi Receipt & Invoice: model kecil lebih patuh
ketika instruksi ikut di user turn.
- **Model katalog dapat dioverride sendiri** lewat `GEMINI_MODEL_CATALOG`
  (default `gemini-3-flash-preview`) karena kebutuhan akurasi OCR berbeda dari
  tool lain; probe kapasitas menunjukkan model ini paling stabil untuk tugas
  katalog saat ini, dengan fallback ke model default bila error transient.
- **Discoverability**: `/ai`, `AgenticSection` homepage, dropdown navbar,
  footer, dashboard, dan `app/sitemap.ts` (priority 0.8, weekly).
- **Kode issue tidak pernah diduplikasi di exporter.** Kolom *Review* di Excel
  dan tanda `*` di PDF memanggil `findCatalogIssues()` yang sama dengan layar
  review, sehingga ketiganya tidak pernah berbeda pendapat. Tanda `*` membuat
  baris yang belum dirapikan ikut terbawa ke dokumen yang dibagikan.
- **Baris produk PDF sengaja dua baris** (nama, lalu varian + merek). Dengan
  satu baris, varian terpotong pada hampir semua judul marketplace yang panjang,
  sehingga kolom yang sudah dirapikan di layar review hilang begitu saja di
  PDF. Nama dan toko dipotong dengan `truncateToWidth()` — batas **lebar kolom**
  memakai metrik font asli, karena 34 karakter Indonesia jauh lebih sempit dari
  34 karakter CJK.
- **Rantai model, bukan satu fallback.** `getModelChain('catalog')` di
  `lib/ai/gemini.ts` menyusun urutan: model fitur → `GEMINI_MODEL` →
  `GEMINI_FALLBACK_MODELS` → daftar bawaan (`gemini-3.5-flash-lite`,
  `gemini-flash-latest`, `gemini-3.6-flash`, `gemini-3.1-flash-lite`). Error
  transien (429 kuota, 503 overload, timeout) memindahkan panggilan ke model
  berikutnya; error non-transien (400/401/404) langsung gagal supaya tidak
  membakar kuota di model lain. Yang berhasil dicatat beserta modelnya, dan
  hasil yang bukan model utama diberi label degraded.
  **Penting:** kuota free tier Gemini dihitung **per model** (20 permintaan/hari
  untuk `gemini-3-flash` di akun ini), sehingga kehabisan kuota pada satu model
  tidak berarti model lain ikut tutup. Terverifikasi live: `gemini-3.5-flash`
  (503) → `gemini-3-flash-preview` (429 kuota) → `gemini-3.5-flash-lite`
  berhasil, total 10 detik untuk 10 produk. Solusi jangka panjangnya tetap
  mengaktifkan billing di project Google AI Studio, bukan mengganti model.
- **Model fallback lebih lemah, dan itu terlihat.** Model lite lebih sering
  menulis nama marketplace ke kolom `store` dan kadang tidak mengisi array
  `shops`; itu sebabnya ada issue `storeIsMarketplace` dan `merge.ts`
  melengkapi daftar toko dari nilai `store` pada baris.
- Test katalog ada di `tests/product-catalog-schema.test.ts` (schema +
  quality gate) dan `tests/product-catalog-report.test.ts` (merge, summary,
  validation, duplikat, `truncateToWidth`) plus `tests/limits.test.ts` untuk
  batas global. Dua skrip lokal (butuh API key, bukan bagian dari aplikasi):
  `scripts/test-catalog-extraction.ts` menjalankan ekstraksi atas file katalog
  asli dan mencetak hasilnya per produk, sedangkan `scripts/probe-capacity.ts`
  menguji model mana yang tersedia dan stabil untuk tugas katalog.
