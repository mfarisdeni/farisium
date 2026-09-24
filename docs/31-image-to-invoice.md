# 31. AI Agent: Image to Invoice (`/ai/image-to-invoice`)

Agent AI kedua Farisium: foto/unggah invoice atau struk → invoice digital
profesional dengan template minimalis. Hasil akhirnya ganda:

- **Excel** — dapat diedit, template profesional.
- **PDF** — plain (tidak bisa diedit), ukuran kecil, dan SELALU sesuai preview
  final di layar (PDF dibuat dari hasil preview yang sama).

Alur ini berbagi keseluruhan infrastruktur agent pertama (Receipt to Excel):
R2 presigned upload, Firestore job, Gemini, Zod + validasi deterministik,
ExcelJS, dan kebijakan penyimpanan sementara (temp storage).

> **Catatan stabilitas (sesi 24 Sep 2026):** dua perbaikan penting sudah
> diuji terhadap contoh invoice di `file-examples-do-not-upload/`
> (`UK-invoice-template_2.png` + `invoice-example.webp`):
>
> 1. **Ekstraksi angka kekar lagi** — instruksi strukturisasi di
>    `features/invoice/prompt.ts` dirombak (transkripsi tabel memakai pemisah
>    `|`, aturan "setiap baris tabel = satu item", "output SEMUA field", dan
>    "jangan pernah mengarang paymentMethod"). Sebelumnya model kecil kerap
>    mengembalikan JSON nyaris kosong (items/harga/jumlah hilang) dan bahkan
>    menghalusinasi `paymentMethod: "Transfer"`. Kini kedua contoh invoice
>    ter-ekstrak lengkap: items, harga satuan, total, subtotal, grand total,
>    seller & buyer.
> 2. **Layout PDF sudah tidak bertabrakan** — kolom tabel di
>    `lib/exporters/invoice-to-pdf.ts` semula terlalu rapat sehingga header
>    "HARGA SATUAN" menimpa "TOTAL" dan angka besar antar kolom saling tumpang
>    tindih (mis. `1.500.000` vs `3.000.000`). Kolom QTY/HARGA/TOTAL kini
>    right-aligned ke sumbu terpisah (356 / 452 / margin) dan blok totals
>    digeser kiri; diverifikasi 0 overlap pada semua 41 teks.

## Alur Teknis

```
Browser ──(1) POST /api/r2/presign-upload {feature: "invoice_from_image", ...}─> Server
Server  ──(auth, validasi, rate limit 5/hari, buat Firestore job)──> {jobId, uploadUrl}
Browser ──(2) PUT file langsung ke R2 (presigned, bind Content-Type)────────────> R2
Browser ──(3) POST /api/agents/image-to-invoice {jobId}─────────────────────────> Server
Server  ──(download R2 → Gemini 2-tahap (transkripsi → struktur) → Zod
            → validasi aritmatika → ExcelJS → upload R2 → update job)
            ────────────────────────────────────────────────────────────────────> {invoice}
Browser ──(4a) POST /api/r2/presign-download {jobId, format: "xlsx"} → stream + hapus → Excel
Browser ──(4b) POST /api/r2/presign-download {jobId, format: "pdf"}  → buat PDF on-demand → PDF
```

## Strategi Output (beda dari Receipt)

- **Excel disimpan di R2** dan, mengikuti kebijakan temp-storage, **stream +
  hapus** saat didownload (`deleteObject(job.outputKey)`).
- **PDF TIDAK disimpan** — dibuat on-demand di `POST /api/r2/presign-download`
  dengan `format: "pdf"` memakai `buildInvoicePdf(job.result)` dari
  `lib/exporters/invoice-to-pdf.ts`. Sumber kebenaran template PDF adalah
  `components/invoice/InvoicePreview.tsx` (desain diturunkan dari design token
  PDF: border-accent, header seller/INVOICE, blok buyer, tabel item, total
  kanan, footer). Karena PDF dibangkitkan dari `job.result` (Firestore), ia
  selalu identik dengan preview yang disetujui pengguna.
- PDF memakai font **Helvetica saja** (built-in PDF) sehingga ukuran file kecil
  dan tidak perlu embed font. PDF ini disengaja **plain text** (tidak editable).

## Modul Utama (baru / diubah)

| File | Tanggung jawab |
|---|---|
| `features/parsing.ts` | Shared parsing: `parseAmount`, `nullableAmount`, `nullableString`. Dipakai schema receipt & invoice. |
| `features/invoice/schema.ts` | Schema Zod invoice: `seller`/`buyer` (name/address/contact/taxId), `items`, `subtotal/tax/taxRate/shipping/discount/grandTotal`, `paymentMethod`, `notes`. Semua field nullable dinormalisasi `.default(null)` agar aman untuk Firestore (tidak pernah `undefined`). |
| `features/invoice/prompt.ts` | Prompt instruksi dua tahap: transkripsi baris-baris invoice (tabel dipisah `|`) + strukturisasi JSON (setiap baris tabel → item, never invent paymentMethod, output semua field). |
| `features/invoice/validation.ts` | Validasi aritmatika deterministik (Σ item vs subtotal, qty×harga vs total item, grandTotal vs subtotal+pajak+ongkir−diskon). Nilai AI tidak pernah diubah — hanya `needsReview` + warnings. |
| `features/invoice/processor.ts` | Orkestrasi `processInvoiceConversion`: download→transkripsi→struktur (gambar ikut dikirim ke stage 2; jika hasil stubs, retry single-call `extractInvoiceJson`)→validasi→Excel→upload→`completed`. Idempoten. Input dihapus dari R2. |
| `lib/exporters/invoice-to-excel.ts` | ExcelJS profesional: white cell (tanpa background agar aman untuk print/copy), teks hitam eksplisit, frame border tipis, blok summary + taxRate + warnings amber. |
| `lib/exporters/invoice-to-pdf.ts` | `buildInvoicePdf(invoice)` — pdf-lib, A4, Helvetica-only, canvas minimalis (accent bar, meta kanan, tabel item, tous totals, footer). |
| `components/invoice/InvoicePreview.tsx` | Preview final invoice (bilingual) — satu-satunya sumber kebenaran tampilan yang ditiru PDF. |
| `app/ai/image-to-invoice/{layout,page}.tsx` | Metadata SEO bilingual + halaman client (upload/kamera → processing → preview + download Excel/PDF). |
| `app/api/agents/image-to-invoice/route.ts` | Endpoint agent (POST): `requireAuth`, `processInvoiceConversion`. |
| `app/api/r2/presign-upload/route.ts` | Diubah: menerima `feature` + `isKnownFeature()` default `receipt_to_excel`. |
| `app/api/r2/presign-download/route.ts` | Diubah: `format` (xlsx default / pdf). PDF hanya untuk job `invoice_from_image` (selain itu 400 `invalid_format`). |
| `lib/jobs/core.ts` | Diubah: `INVOICE_FEATURE = 'invoice_from_image'`, `KNOWN_FEATURES`, `Feature`, `isKnownFeature()`; `createJob`/`consumeDailyConversionSlot` menerima param `feature`. |
| `lib/ai/gemini.ts` | Diubah: `transcribeImageLines()`, `structureInvoiceFromLines()`, `extractInvoiceJson()` (retry single-call), `INVOICE_JSON_SCHEMA`. |
| `lib/r2/keys.ts` | Diubah: `buildOutputFileKey`. |
| `tests/invoice-schema.test.ts`, `tests/invoice-validation.test.ts` | Test schema + validasi invoice (mirror pola receipt). |

Catatan ekstraksi: `seller`/`buyer` diparse dengan `z.preprocess` (bukan
`.default({})`) sehingga objek selalu memiliki field bernilai `null` — penting
karena Firestore menolak nilai `undefined`.

## Discoverability

- Homepage `AgenticSection` → 2 kartu agen unggulan (Receipt + Image to Invoice),
  2 kartu pendukung.
- `AIToolsSection` (home) + `/ai` listing → kartu Image to Invoice (Live).
- Sitemap `ai/image-to-invoice` (priority 0.8, weekly).
- Footer grup AI Tools + Dashboard quick links (ID/EN).

## Test

```
npm test          # node --test "tests/*.test.ts" — 42 test lulus
```

## Deploy

Push ke `main` → Vercel auto-deploy. `pdf-lib` adalah dependency runtime biasa,
tidak butuh build tooling khusus.