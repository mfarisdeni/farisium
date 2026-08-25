# Firebase

Backend utama.

Gunakan:

Authentication

Firestore

Storage

---

Jangan pernah mengganti backend.

Seluruh data utama menggunakan Firestore.

Selalu mempertimbangkan Security Rules.

Tidak menyimpan Secret pada client.

Gunakan Environment Variable.

---

# Notifikasi User Baru

Saat user login pertama kali via Google:
1. `createUserIfNeeded()` di `lib/user.ts` membuat dokumen di Firestore
2. Fungsi mengembalikan `true` jika user baru
3. `useAuth` hook memanggil `POST /api/auth/login`
4. API menghitung total user via `users.count()`, lalu mengirim email via Resend

## File Terkait

- `lib/email/resend.ts` — Inisialisasi Resend client (lazy)
- `lib/email/sendNewUserNotification.ts` — Template email notifikasi
- `app/api/auth/login/route.ts` — API endpoint notifikasi
- `hooks/useAuth.ts` — Trigger notifikasi setelah create user
- `lib/user.ts` — Return boolean untuk deteksi user baru

## Environment Variables

```
RESEND_API_KEY=       # API Key dari Resend
EMAIL_FROM=           # Pengirim (contoh: Farisium <noreply@farisium.com>)
NOTIFICATION_EMAIL=   # Tujuan notifikasi (contoh: hello@farisium.com)
```