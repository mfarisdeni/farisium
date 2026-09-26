# 32. AI Agent: AI Expense Report Generator (`/ai/expense-report`)

Agen AI ketiga Farisium: upload **banyak struk sekaligus** → laporan
pengeluaran yang sudah dikategorikan, diperiksa manusia, lalu diekspor ke
**Excel (3 sheet)** atau **PDF multi-halaman**.

Alur ini **bukan** fitur baru yang terpisah: ia memakai infrastruktur agent
pertama dan kedua (R2 presigned upload, Firestore job, Gemini, Zod, validasi
aritmatika, ExcelJS, pdf-lib, kebijakan temp-storage) dan **memperluas** schema
struk yang sudah ada, bukan menyalinnya.

## Alur Teknis

```
Browser ──(1) POST /api/r2/presign-upload {feature: "expense_report", ...}  (per file)
Server  ──(auth, validasi tipe/ukuran, rate limit, buat Firestore job)──> {jobId, uploadUrl}
Browser ──(2) PUT file langsung ke R2 (presigned, bind Content-Type)────────> R2
        (ulangi (1)–(2) untuk semua file, maksimal 10 struk)

Browser ──(3) POST /api/agents/expense-report {jobId}   (concurrency = 2, per struk)
Server  ──(download R2 → Gemini 2-tahap (transkripsi → struktur) → Zod
            → validasi aritmatika → normalisasi kategori → update job
            → HAPUS gambar input dari R2)
            ──────────────────────────────────────────────────────> {expense}

Browser ──(4) POST /api/agents/expense-report/export {format, report}  (dari data yang SUDAH diperiksa)
Server  ──(Zod validasi ulang → ExcelJS / pdf-lib → stream langsung sebagai attachment)
            ──────────────────────────────────────────────────────> file
```

### Keputusan yang berbeda dari Receipt & Invoice

| Aspek | Receipt / Invoice | Expense Report |
| --- | --- | --- |
| Jumlah file | 1 | hingga 20, diproses bertahap (concurrency 2) |
| Sumber kebenaran export | job Firestore (`job.result`) | **payload client yang sudah diedit** |
| Penyimpanan output | R2 (stream + hapus saat download) | **tidak pernah disimpan** — langsung di-stream |
| Role output | satu dokumen per job | satu dokumen berisi banyak struk |
| Kegagalan | satu file, gagal = gagal | per-struk terisolasi; sukses tetap tersimpan & bisa di-retry |

Export memakai data client karena setelah layar review angka boleh diubah
manusia —=data client adalah sumber kebenaran. Server tetap memvalidasi ulang
payload dengan kontrak Zod yang sama sebelum membangun file.

## Modul

| File | Tanggung jawab |
| --- | --- |
| `features/expense/categories.ts` | 12 kategori kanonik + alias + keyword fallback. Tidak pernah mengarang kategori di luar daftar. |
| `features/expense/schema.ts` | `expenseRecordSchema` (AI), `expenseRowSchema` (+`id`, kontrak validasi export), `expenseReportSchema`, `MAX_REPORT_ITEMS = 10`. |
| `features/expense/prompt.ts` | Instruksi transkripsi & strukturisasi khusus expense (kategori + metode pembayaran). |
| `features/expense/summary.ts` | **Semua** perhitungan: `resolveExpenseTotal`, `buildExpenseSummary`, `normalizeRowCategory`, `CURRENCY_OPTIONS`. Dipakai bersama oleh UI, Excel, dan PDF. |
| `features/expense/duplicates.ts` | Deteksi duplikat *advisory* (merchant + tanggal kompatibel + total dalam toleransi). |
| `features/expense/validation.ts` | Issue sebelum export sebagai **kode field** (`date`/`merchant`/…), bukan kalimat — supaya UI bisa melokalisasi. Tidak pernah memblokir export. |
| `features/expense/processor.ts` | Orkestrasi per struk (R2 → Gemini → Zod → validasi → kategori → job → hapus input). |
| `lib/exporters/pdf-kit.ts` | Token desain + primitive menggambar PDF (halaman, warna, `fmt`, `money`, `truncate`, `drawRight`). Diekstrak dari `invoice-to-pdf.ts` agar semua PDF Farisium konsisten. |
| `lib/exporters/expense-report-to-excel.ts` | 3 sheet: *Expense Report* (auto-filter + baris total), *Summary* (metadata + rincian kategori), *Items* (detail baris barang, hanya bila ada). |
| `lib/exporters/expense-report-to-pdf.ts` | Multi-halaman: header/meta, total, rincian kategori, tabel detail yang otomatis pecah halaman + footer bernomor. |
| `lib/limits.ts` | Feature key + `DAILY_LIMITS` (murni, tanpa Firebase) — satu sumber kebenaran untuk batas harian yang dibaca server, client, dan test. |
| `components/expense/content.ts` | Semua string bilingual (`id`/`en`) dalam satu objek, mengikuti pola halaman tool lain. Copy angka batas di-interpolasi dari konstanta aslinya. |
| `components/expense/ExpenseUploader.tsx` | Dropzone + input kamera, validasi tipe/ukuran, antrean pratinjau dengan revoke object URL. |
| `components/expense/ExpenseReviewTable.tsx` | Tabel review: ubah tanggal/merchant/kategori/pembayaran/angka/catatan, hapus, tambah pengeluaran manual. |
| `components/expense/ExpenseSummaryPanel.tsx` | Total, rincian per kategori, bar persentase. |
| `app/api/agents/expense-report/route.ts` | Proses satu struk (`maxDuration 120`). |
| `app/api/agents/expense-report/export/route.ts` | Validasi + bangun + stream Excel/PDF (`maxDuration 60`). |

## Aturan Perhitungan

Satu implementasi di `summary.ts`, dipakai UI maupun kedua exporter:

1. **Total tercetak (`grandTotal`) adalah sumber utama.**
2. Jika total tidak terbaca → `subtotal + tax - discount`.
3. Jika subtotal juga tidak terbaca → jumlah `item.total` + pajak − diskon.
4. Jika semuanya kosong → baris ditandai perlu diperiksa, nilai tetap 0.
5. Nilai hasil ekstraksi **tidak pernah ditulis ulang**. Ketidaksesuaian hanya
   dilaporkan lewat `needsReview` / `warnings` (validasi aritmatika yang sama
   dengan Receipt).

## Deteksi Duplikat

Sepenuhnya advisory — **tidak pernah menghapus data**:

- Dikelompokkan per merchant ternormalisasi (huruf kecil, `PT`/`CV` dibuang,
  non-alnumerik → spasi).
- Tanggal harus sama, **kecuali** salah satu sisi kosong (struk separuh terbaca).
- Total dianggap sama bila selisih ≤ 1 absolut **atau** ≤ 0,5% relatif.
- Baris tanpa merchant atau tanpa total tidak pernah dituduh.
- Tiga salinan menghasilkan **satu** grup, bukan tiga.

> Clustering dilakukan merchant-dulu lalu baru toleransi, bukan pencarian kunci
> persis: dua salinan struk yang sama sering berbeda satu langkah pembulatan
> atau satu tanggal separuh terbaca, yang tidak akan pernah terlihat berpasangan
> oleh lookup kunci persis.

## Rate Limit

Peta `DAILY_LIMITS` berada di `lib/limits.ts` (modul murni, bisa diimpor client
dan `node --test`), sedangkan `lib/jobs/core.ts` yang menegakkan batas tersebut di server.
Copy batas di UI meng-interpolasi konstanta yang sama, jadi angka yang tampil
selalu sama dengan yang ditegakkan server.

| Feature | Limit/hari |
| --- | --- |
| `receipt_to_excel` | 10 struk |
| `invoice_from_image` | 10 invoice |
| `expense_report` | 20 struk |

Batas expense 20/hari = tepat 2 laporan penuh (10 struk per laporan), sehingga
pengguna bisa menyelesaikan dua laporan sehari tanpa kehabisan jatah.

Batas lain:

- Maksimal **10 struk per laporan** (`MAX_REPORT_ITEMS`, di `features/expense/schema.ts`).
- Maksimal **5 MB per file** (`MAX_FILE_SIZE_BYTES`, di `lib/r2/keys.ts`).

## Privasi & Keamanan

- Bucket R2 **private**; gambar input **dihapus segera** setelah ekstraksi sukses
  (`deleteObject` di processor, best-effort sehingga tidak menggagalkan job).
- Semua route memakai `requireAuth` (verifikasi Firebase ID token).
- Ukuran dibatasi 5 MB per file, tipe dikunci ke `jpg/png/webp`, nama file
  di-sanitize anti path-traversal, dan kunci R2 dibangun dari `uid` + `jobId`.
- Job hanya bisa diakses pemiliknya (`requireOwnedJob`).
- Error 500 tidak pernah membocorkan stack atau secret (`errorResponse`).
- Baris duplikat hanya **ditandai**; pengguna sendiri yang menghapus.

## Catatan Teknis

- `lib/jobs/core.ts` memakai `firebase-admin`, jadi tidak bisa diimpor komponen
  client maupun `node --test`. Karena itu feature key + angka batas harian
  dipindah ke `lib/limits.ts` (modul murni). Halaman client sekarang mengimpor
  `EXPENSE_FEATURE` dan `DAILY_LIMITS` dari sana — tidak ada lagi literal
  `'expense_report'` yang harus disinkronkan manual, dan angka batas yang
  tampil di UI dijamin sama dengan yang ditegakkan server.
- `features/expense/summary.ts` sengaja **tidak** mengimpor ulang `ExpenseReport`
  dari `schema.ts`; exporter mengimpor tipe dari `schema.ts` langsung agar
  tidak ada siklus.
- `applyValidation()` dari Receipt mengembalikan bentuk *receipt*, jadi
  processor hanya mengambil `needsReview` + `warnings`-nya dan mempertahankan
  field expense (`paymentMethod`, `category`, `notes`) apa adanya.
- Modul murni (`categories`, `summary`, `duplicates`, `validation`, `schema`)
  diuji dengan `node --test` tanpa dependency baru:
  `tests/expense-schema.test.ts` + `tests/expense-report.test.ts`.
