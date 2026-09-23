# 30. AI Agent: Receipt to Excel (`/ai/receipt-to-excel`)

Agent AI pertama Farisium: foto struk/bukti transaksi → file Excel rapi.
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
| `features/receipt/prompt.ts` | System instruction ekstraksi (tanpa invent value, ISO date, angka polos). |
| `features/receipt/processor.ts` | Orkestrasi: download→AI→validate→Excel→upload→status. Idempoten (job completed dikembalikan tanpa proses ulang). |
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