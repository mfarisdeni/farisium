# UI Components Standard

# Pola Halaman v2.2 (Phase 4)

 Setelah Phase 1–3, halaman utama konsisten menerapkan pola baru tanpa mengubah business logic / arsitektur:

 ## Kicker (eyebrow) Hero Halaman
 Ganti `<Badge variant="crimson">` kicker hero dengan `<span className="eyebrow-label text-eyebrow text-frsc-crimson-400 flex items-center gap-1.5">` + ikon lucide (`aria-hidden`). Lebih premium magnet, konsisten lintas halaman (Dashboard, Rewards, Reward, Competition, FRSC, Partnership, Claim-free, Blog).

 ## Heading Hero Halaman
 H1 hero: `heading-fluid text-h1 text-... text-balance` (gunakan token fluida `--text-h1`). Hero blog: `text-hero`.

 ## Sub-heading Section
 H2/H3 section: `heading-fluid text-h3 text-foreground` (ganti `font-heading text-xl font-bold` statis). Lebih besar di layar lebar, tetap nyaman di mobile.

 ## Deskripsi Section
 `<p className="text-pretty text-lead text-...">` — wrapping cantik & fluid responsive.

 ## Card Interactive Inline
 Inline card dengan hover translate+shadow ganti ke utility `hover-lift` (smooth, centralised di globals).

 ## Scroll Reveal Stagger di Halaman Grid
 Tambahkan ke wrapper grid children: `reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]}`. Konsol needScrollReveal — pasang `<ScrollReveal />` sekali di akhir halaman (member global observer).

 ## Aksesibilitas Tambahan
 - Breadcrumb halaman pakai `<nav aria-label="Breadcrumb">`, item aktif `aria-current="page"`.
 - Tombol iklan/iframe pakai `title` + wrapper reserved `minHeight` → no CLS.
 - ArticleFAQ pakai `id` / `aria-controls` / `role="region"` / focus ring inset.
 - `role="alert"` pada error auth.
 - Focus ring crimson konsisten pada CTA (focus-visible:ring-2 ring-frsc-crimson-500/50).

 ## Bug Fix Lama dalam Scope Phase 4
 - `app/blog/[slug]/page.tsx`: `bg-frsc-dark-950` (token tidak ada) → `bg-frsc-black`. `text-frsc-text-400` (token tidak ada) → `text-frsc-text-300` + `eyebrow-label`.
 - `components/blog/BlogFilter.tsx`: hapus `block` (konflik dengan `flex`), tambah `hover-lift` + reveal stagger, lazy image (sudah ada), badge kicker → eyebrow-label.

 ## Bug Lama yang Ditemukan di Luar Scope Phase 4 (ditangani phase terpisah)
 - Navbar dropdown Link `/profile` & `/settings` → halaman tidak ada di routing. Bug data.
 - `lib/queue.ts` (`QueueEngine`) tidak dipakai `useGenerate` (implementasi sendiri di dalam hook). Duplikasi queue logic.
 - `lib/sd-api.ts` masih `console.log` user prompt → privacy/log noise. Akan dibersihkan di Phase 5 (Audit Performa).
 - `middleware.ts` memunculkan warning deprecation Next 16 "middleware → proxy". Bisa di-future-proof, tapi perubahan arsitektur (per keputusan eksplisit).

---

# Komponen Baru v2.1 (Phase 2)

 Komponen ditambahkan secara additive — tidak ada yang dihapus / diganti:

| Komponen | File | Catatan |
|----------|------|---------|
| `Input`, `TextArea` | `components/ui/Input.tsx` | forwardRef + cva. Variant `default`/`ghost`, size `sm`/`md`/`lg`. Premium dark, crimson focus ring, `aria-invalid` styling. |
| `Modal`, `ModalTitle`, `ModalDescription` | `components/ui/Modal.tsx` | Dibangun di atas `@base-ui/react/dialog` (fokus trap, scroll lock, Esc, accessible). Controlled (`open`/`onOpenChange`). Entry motion via framer-motion, liquid glass premium (`glass-base-strong` + `glass-edge-highlight`). |
| `Container` size `xl` | `components/ui/Container.tsx` | Tambahan `max-w-7xl` (selaras dengan homepage yang sudah pakai `max-w-7xl`). Default `lg` tetap. |
| `SectionHeading` | `components/ui/Section.tsx` | Helper reusable: `eyebrow` + `title` + `description` + `align` (`left`/`center`). Pakai token tipografi fluida v2.1. |
| `Skeleton` prop `shimmer` | `components/ui/Skeleton.tsx` | Opt-in premium sweep (`skeleton-shimmer`) sebagai alternatif `animate-pulse`. Default tetap pulse. |

 Komponen yang di-enhance (visual polish, API tidak berubah):

| Komponen | Perubahan |
|----------|-----------|
| `Card` | Tambah `shadow-metallic` default + `glass-edge-highlight` pada variant glass + `hover-lift` saat `hover`. |
| `Badge` | Tanpa perubahan API; konsisten struktur. |
| `Navbar` | Hapus padding hack `pt-[15px] md:pt-5` pada logo. Fix bug `xs:` breakpoint (tidak ada di Tailwind). Tambah Esc close untuk user menu. Tambah `aria-current="page"`. Active state pakai underline bar animasi (scale-x) — lebih halus. Drawer pakai `animate-fade-in` + `animate-fade-in-up`. |
| `Footer` | Top separator diganti gradient metallic. Heading pakai `eyebrow-label`. Teks pakai `text-pretty`. Struktur tetap. |

 Bug lama yang ditemukan & diperbaiki:
 - `Navbar` memakai class `xs:inline` / `xs:hidden` — **Tailwind v4 tidak punya breakpoint `xs`**. Selalu j unreadcodeer `hidden`, konsekuensinya teks `{coins}` hanya (tanpa `FRSC`) selalu tampil pada sm. Diperbaiki ke render tunggal.
 - Padding aneh `pt-[15px] md:pt-5` pada Link logo — dihapus, sekarang pakai `flex items-center` bersih di parent.

---

# Tujuan

Dokumen ini menjadi standar resmi seluruh komponen antarmuka pada Farisium.

Seluruh halaman harus dibangun menggunakan komponen yang dapat digunakan kembali (Reusable Components).

Jangan membuat komponen baru apabila fungsi yang sama sudah tersedia.

---

# Filosofi

Komponen harus:

* Reusable
* Modular
* Konsisten
* Mudah dipelihara
* Mudah dikembangkan

Seluruh komponen harus mengikuti Design System Farisium.

---

# Struktur Folder

Seluruh komponen UI berada pada:

```text
/components/ui
```

Komponen yang bersifat khusus dapat berada pada:

```text
/components/features
```

Komponen layout berada pada:

```text
/components/layout
```

Jangan mencampurkan komponen umum dengan komponen yang hanya digunakan oleh satu fitur.

---

# Aturan Umum

Setiap komponen harus:

* memiliki satu tanggung jawab;
* menggunakan TypeScript;
* memiliki props yang jelas;
* mudah digunakan kembali;
* mendukung responsive layout;
* mendukung Dark Theme.

---

# Layout Components

Komponen layout yang digunakan di seluruh Farisium.

* Container
* Section
* Page
* Grid
* Stack
* Divider
* Spacer

Seluruh halaman menggunakan struktur layout yang sama.

---

# Navigation Components

Komponen navigasi.

* Navbar
* Sidebar
* Mobile Menu
* Breadcrumb
* Pagination
* Tabs

Navigasi harus konsisten pada seluruh halaman.

---

# Hero Components

Hero Section terdiri dari:

* Badge
* Heading
* Description
* Primary Button
* Secondary Button
* Hero Illustration

Hero harus menjadi titik fokus halaman.

---

# Card Components

Gunakan Card sebagai komponen utama.

Jenis Card:

* Feature Card
* AI Tool Card
* Reward Card
* Pricing Card
* Partner Card
* Blog Card
* Statistic Card
* Dashboard Card

Semua Card menggunakan identitas visual Farisium.

---

# Button Components

Gunakan Button yang konsisten.

Jenis:

* Primary
* Secondary
* Outline
* Ghost
* Icon Button
* Link Button

Button harus memiliki:

* Loading State
* Disabled State
* Hover State
* Focus State

---

# Form Components

Komponen form meliputi:

* Input
* Textarea
* Select
* Checkbox
* Radio

### Komponen tersedia (v2.1)

| Komponen | File | Catatan |
|----------|------|---------|
| `Input`, `TextArea` | `components/ui/Input.tsx` | forwardRef, cva variants (`default`/`ghost`) + sizes (`sm`/`md`/`lg`). Premium dark, focus ring crimson. Mendukung `aria-invalid`. |
* Switch
* Slider
* Search Box

Semua Form mengikuti Design System Farisium.

---

# Feedback Components

Komponen untuk memberikan umpan balik.

* Alert
* Toast
* Modal
* Dialog
* Drawer
* Tooltip
* Popover

Seluruh feedback harus sederhana dan mudah dipahami.

---

# Loading Components

Gunakan Loading State yang konsisten.

Komponen:

* Skeleton
* Spinner
* Progress Bar
* Progress Circle

Gunakan Skeleton sebagai pilihan utama dibanding Spinner apabila memungkinkan.

---

# Data Components

Komponen untuk menampilkan data.

* Table
* List
* Timeline
* Accordion
* FAQ
* Empty State

Data harus mudah dibaca pada desktop maupun mobile.

---

# Dashboard Components

Komponen Dashboard:

* Statistic Card
* Activity Card
* Balance Card
* Transaction Card
* Usage Card
* History Card

Dashboard harus sederhana dan fokus pada informasi penting.

---

# AI Components

Komponen khusus AI.

* Prompt Input
* Prompt Enhancement
* Negative Prompt
* Generation Settings
* Generate Button
* Progress
* Queue Status
* Image Gallery
* History
* Image Preview

Komponen ini digunakan pada seluruh AI Tools apabila relevan.

---

# Reward Components

Komponen Reward:

* Reward Card
* Reward Detail
* Claim Button
* Requirement Badge
* FRSC Badge

Menggunakan tampilan premium dan mudah dipahami.

---

# Partnership Components

Komponen Partnership:

* Benefit Card
* Contribution Card
* FAQ
* CTA Section

Menggunakan bahasa yang profesional dan transparan.

---

# Blog Components

Komponen Blog:

* Article Card
* Category Badge
* Reading Time
* Author
* Related Article

Artikel harus nyaman dibaca.

---

# Footer Components

Footer minimal terdiri dari:

* Logo
* Deskripsi singkat
* Navigasi
* Social Media
* Copyright

Footer digunakan pada seluruh halaman publik.

---

# Animation

Animasi digunakan untuk meningkatkan pengalaman pengguna.

Gunakan:

* Fade
* Scale
* Slide
* Hover
* Micro Interaction

Hindari animasi yang berlebihan.

---

# Glassmorphism

Glassmorphism digunakan secara terbatas.

Prioritaskan pada:

* Hero
* Dashboard
* Dialog
* Floating Card

Jangan menerapkan Glassmorphism pada seluruh halaman.

---

# Responsive

Seluruh komponen harus:

* Mobile First
* Tablet Friendly
* Desktop Friendly

Komponen tidak boleh memiliki ukuran tetap yang menyebabkan layout rusak pada perangkat kecil.

---

# Accessibility

Seluruh komponen harus:

* mendukung keyboard navigation;
* memiliki focus state;
* menggunakan semantic HTML;
* memiliki label yang jelas;
* memenuhi standar kontras warna.

---

# Reusability

Sebelum membuat komponen baru, AI harus:

1. mencari komponen yang sudah ada;
2. mengevaluasi apakah dapat digunakan kembali;
3. memperluas komponen yang ada apabila memungkinkan.

Duplikasi komponen harus dihindari.

---

# Naming Convention

Nama komponen harus:

* jelas;
* konsisten;
* menggunakan PascalCase.

Contoh:

* HeroSection
* FeatureCard
* RewardCard
* GenerateButton
* PromptInput

Hindari nama yang terlalu umum atau tidak menggambarkan fungsinya.

---

# Checklist Sebelum Membuat Komponen Baru

Sebelum membuat komponen baru, pastikan:

* Belum ada komponen dengan fungsi yang sama.
* Mengikuti Design System Farisium.
* Responsive.
* Mendukung Dark Theme.
* Reusable.
* Mudah dipelihara.
* Tidak menambah kompleksitas yang tidak diperlukan.

---

# Prinsip Akhir

Komponen adalah fondasi antarmuka Farisium.

Setiap komponen harus dirancang agar dapat digunakan pada banyak halaman, menjaga konsistensi visual, mengurangi duplikasi kode, dan mempercepat proses pengembangan.

Jika sebuah komponen hanya digunakan satu kali, evaluasi kembali apakah komponen tersebut benar-benar perlu dipisahkan atau cukup menjadi bagian dari halaman yang menggunakannya.
