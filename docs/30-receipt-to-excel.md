# 30. AI Agent: Image Receipt to Excel (`/ai/receipt-to-excel`)

Agent AI pertama Farisium: foto struk belanja/bukti transaksi → file Excel rapi.
Alur: upload langsung ke Cloudflare R2 (presigned) → Firestore job → Gemini
ekstrak JSON → validasi Zod + aritmatika deterministik → ExcelJS → simpan ke R2
→ download via presigned URL.

## Alur Teknis

```
Browser ──(1) POST /api/r2/presign-upload {fileName, contentType, fileSize}──> Server
Server  ──(auth, validasi, rate limit 5/hari, buat Firestore job)──> {jobId, uploadUrl}
Browser ──(2) PUT file langsung ke R2 (presigned, bind Content-Type)────────────> R2
Browser ──(3) POST /api/agents/receipt-to-excel {jobId}────────────────────────> Server
Server  ──(download R2 → Gemini JSON → Zod → validasi aritmatika → ExcelJS
            → upload R2 → update job)──────────────────────────────────────────> {receipt}
Browser ──(4) POST /api/r2/presign-download {jobId} → buka URL di tab baru
```

Alasan desain:
- **Upload langsung ke R2** — request body besar tidak lewat Vercel (batas 4.5 MB),
  transfer lebih cepat, dan file tidak pernah tersimpan di disk server.
- **Firestore hanya menyimpan metadata job**, bukan binary. Key R2:
  `users/{uid}/jobs/{jobId}/input/*` dan `.../output/receipt.xlsx`.
- **Server selalu membangun key R2** (uid dari ID token terverifikasi) dan
  mengunci ekstensi dari content-type (`.jpg/.png/.webp`) — klien tidak pernah
  menentukan path penyimpanan.
- **Ownership check pada setiap akses**: `job.userId === uid` di
  `lib/jobs/core.ts` (`requireOwnedJob`). Job orang lain → 403.

## Modul Utama

| File | Tanggung jawab |
|---|---|
| `lib/api.ts` | `ApiError`, `errorResponse` (safety: tidak bocorkan detail 500 ke klien), `extractBearerToken`. Pure & di-test. |
| `lib/server-auth.ts` | `requireAuth(request)` — verifikasi Firebase ID token (Bearer). |
| `lib/r2/keys.ts` | Build key + `validateUploadInput` (tipe JPG/PNG/WebP, max 10 MB), `sanitizeFileName` anti path-traversal. Pure & di-test. |
| `lib/r2/client.ts` | S3Client singleton (region `auto`, endpoint R2), presigned PUT/GET, download/upload buffer. |
| `lib/jobs/core.ts` | Firestore `jobs` (queued→processing→completed/failed), ownership guard, rate limit 5 konversi/hari via `users/{uid}/usage/receipt_to_excel` (transaksi). |
| `lib/ai/gemini.ts` | GoogleGenAI, model dari env (`GEMINI_MODEL`, default `gemini-3.5-flash-lite`), `responseSchema` JSON, temp 0.2. |
| `features/receipt/schema.ts` | Schema Zod + `parseAmount` (dukungan pemisah ribuan & koma desimal ID: `12.500,00`), `parseReceiptJson`. |
| `features/receipt/validation.ts` | Validasi aritmatika deterministik (item total vs subtotal, qty×harga vs total, grandTotal vs subtotal+pajak-diskon). Nilai AI tidak pernah diubah — hanya flag `needsReview` + warnings. |
| `features/receipt/prompt.ts` | System instruction ekstraksi dua tahap (transkripsi verbatim + struktur): tanpa invent value, ISO date, angka polos, "setiap baris item = satu item", blok total (SUBTOTAL/PPN/DISKON/TOTAL) wajib dipertahankan. |
| `features/receipt/processor.ts` | Orkestrasi: download→AI→validate→Excel→upload→status. Idempoten (job completed dikembalikan tanpa proses ulang). Stage 2 mengirim GAMBAR kembali ke Gemini; quality gate `isStubReceipt()` → retry `extractReceiptJson()` (single-call) bila hasil dua-tahap stubs. |
| `lib/exporters/receipt-to-excel.ts` | ExcelJS: sheet "Receipt", freeze pane, header, format angka, blok summary + warnings. |
| `app/api/*` | `r2/presign-upload`, `agents/receipt-to-excel` (maxDuration 120), `r2/presign-download`, `jobs/[jobId]`. Semua `runtime = 'nodejs'`. |

## Env yang Dibutuhkan

Server-side (jangan `NEXT_PUBLIC_`):

```
R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
GEMINI_API_KEY, GEMINI_MODEL=gemini-3.5-flash-lite
FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY  (sudah dipakai)
```

Bucket R2 dibuat **Private** di Cloudflare Dashboard.

## Keamanan

- Tidak ada secret/NEXT_PUBLIC untuk R2/Gemini.
- `errorResponse` menyensor error tak terduga menjadi 500 generik (tanpa stack/secret).
- Response 429 saat limit harian; job failure disimpan sebagai `error` string ramah pengguna.
- Presigned URL 5 menit; download memerlukan ownership job `completed`.
- `firestore.rules` diperbarui: `jobs` hanya untuk pemilik, `users/{uid}/usage` milik pemilik.

## Test

Tanpa framework tambahan (Node 24 native type-stripping + `node --test`):

```
npm test          # node --test "tests/*.test.ts"
```

Mencakup: schema valid, malformed JSON, missing values, parsing angka ID,
total mismatch → review, key R2 aman, tipe tak didukung, file > 10 MB,
auth header. Catatan: `allowImportingTsExtensions: true` diaktifkan di tsconfig
agar modul pure bisa di-import langsung oleh Node (relative `.ts`).

## Deploy

Set semuanya via Vercel → seperti biasa push ke `main` (auto-deploy). Tidak ada
variabel baru di build; runtime di Vercel Node 20+ sudah cukup.
## Update: Kebijakan Penyimpanan Sementara (Temp Storage)

Semua file yang di-attach pengguna kini **tidak pernah mengendap** di R2:

- **Input (foto struk)**: dihapus segera dari R2 begitu job masuk status `completed`
  (best-effort `deleteObject(job.inputKey)` di `features/receipt/processor.ts`). File
  hanya diperlukan saat ekstraksi berjalan.
- **Output (Excel)**: endpoint `POST /api/r2/presign-download` berubah dari "kirim
  presigned URL" menjadi **stream-dan-hapus** — rute membaca buffer dari R2,
  langsung `deleteObject(job.outputKey)`, lalu mengembalikan file sebagai attachment
  (`Content-Disposition: attachment; filename="receipt-{jobId}.xlsx"`). Output yang
  tersisa karenanya hanya bertahan selama satu request download.
- **Client**: `handleDownload` di `app/ai/receipt-to-excel/page.tsx` kini melakukan
  `fetch` → `blob()` → simulasi klik `<a download>` (nama file diambil dari header).
  Tidak lagi `window.open(url)`. `r2PresignedDownloadUrl` dihapus dari `lib/r2/client.ts`
  karena tidak terpakai (dead code).
- Privasi pengguna meningkat: tidak ada file pengguna yang tersimpan permanen; hasil
  konversi tetap bisa di-render ulang dari `job.result` di Firestore.

## Update: Reliabilitas Ekstraksi (percobaan pertama tidak lagi blank)

Memperbaiki kasus "hasil kosong / seakan tidak bisa baca file" pada percobaan
pertama. Pola yang sama dengan perbaikan invoice:

- **Instruksi transkripsi & struktur kini masuk ke USER text, bukan
  `systemInstruction`.** `transcribeReceiptLines` dan `transcribeImageLines`
  (di `lib/ai/gemini.ts`) meng-embed instruction ke prompt user — model kecil
  (flash-lite) terbukti mereturn output minimal/terpotong saat instruksi dikirim
  sebagai systemInstruction. Signature fungsi tidak berubah (param `instruction`).
- **`buildTranscribeInstruction` diperkuat**: larang berhenti lebih awal — blok
  total di bagian bawah struk (SUBTOTAL, PPN, DISKON, TOTAL, Tunai) wajib
  ditranskripsikan sampai baris terakhir.
- **`buildStructuredInstruction` diperkuat**: "output SEMUA field (null/[] bila
  kosong)", "setiap baris item = satu item (jangan di-drop)", pemetaan
  SUBTOTAL/PPN/DISKON/TOTAL, pembacaan tanggal dd/mm/yyyy → ISO.
- **Stage 2 mengirim gambar kembali** ke Gemini (`structureReceiptFromLines` dipanggil
  dengan base64 + contentType) agar model bisa memastikan kolom tabel & urutan.
- **Quality gate `isStubReceipt()`**: jika hasil dua-tahap stubs (tanpa items,
  merchant, maupun total) padahal transkripsi terbaca → retry single-call
  `extractReceiptJson()` sebelum job dianggap selesai.

Verifikasi live (struk belanja sintetis ID): merchant, tanggal ISO, invoice no.,
5 item (qty 2x tertangkap), subtotal 215.500, PPN 23.705, grandTotal 239.205 —
semua ter-ekstrak lengkap, `needsReview: false`.
