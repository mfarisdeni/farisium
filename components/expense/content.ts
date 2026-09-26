/**
 * Bilingual UI strings for the AI Expense Report Generator.
 * Same pattern as the receipt & invoice tool pages: one `pageContent` object
 * with `id` + `en` keys, only the labels are translated — the logic, API
 * calls, and component interfaces stay locale-independent.
 *
 * The numeric limits are interpolated from their source of truth so the copy
 * can never advertise a different limit than the server enforces.
 */

import { MAX_REPORT_ITEMS } from '@/features/expense/schema'
import { MAX_FILE_SIZE_BYTES } from '@/lib/r2/keys'
import { DAILY_LIMITS, EXPENSE_FEATURE } from '@/lib/limits'

const MAX_SIZE_MB = Math.round(MAX_FILE_SIZE_BYTES / (1024 * 1024))
const DAILY_RECEIPTS = DAILY_LIMITS[EXPENSE_FEATURE]

/** Limit-derived copy, so the UI can never advertise a stale number. */
const limits = {
  id: {
    perFile: `maksimal ${MAX_SIZE_MB} MB per file`,
    perReport: `hingga ${MAX_REPORT_ITEMS} struk`,
    perDay: `${DAILY_RECEIPTS} struk per hari per pengguna`,
    reportFull: `Batas ${MAX_REPORT_ITEMS} struk per laporan sudah tercapai.`,
    tooBig: `Ukuran file melebihi batas ${MAX_SIZE_MB} MB.`,
  },
  en: {
    perFile: `up to ${MAX_SIZE_MB} MB each`,
    perReport: `${MAX_REPORT_ITEMS} receipts per report`,
    perDay: `${DAILY_RECEIPTS} receipts per day per user`,
    reportFull: `A report holds up to ${MAX_REPORT_ITEMS} receipts.`,
    tooBig: `File exceeds the ${MAX_SIZE_MB} MB limit.`,
  },
} as const

export const expenseContent = {
  id: {
    badge: 'AI Agent',
    title: 'AI Expense Report Generator',
    description:
      'Ubah banyak struk menjadi laporan pengeluaran yang rapi dalam hitungan menit.',
    intro:
      'Upload beberapa struk, biarkan AI mengekstrak dan mengelompokkan datanya, periksa hasilnya, lalu ekspor laporan ke Excel atau PDF.',
    stepsLabel: '4 langkah',
    steps: [
      'Upload struk',
      'AI membaca & mengkategorikan',
      'Periksa & perbaiki data',
      'Export Excel atau PDF',
    ],
    loginRequired: 'Login untuk Menggunakan',
    loginTitle: 'Laporan pengeluaran butuh login',
    loginDesc:
      'Login gratis dengan Google untuk memproses struk dan menyimpan progres laporanmu di akun Farisium.',
    signInGoogle: 'Masuk dengan Google',

    reportNameLabel: 'Nama Laporan',
    reportNamePlaceholder: 'Contoh: Pengeluaran Bisnis September 2026',
    currencyLabel: 'Mata Uang',
    currencyHint: 'AI tetap mendeteksi mata uang dari struk.',

    uploadTitle: 'Upload Foto Struk',
    uploadHint: `JPG, PNG, atau WebP — ${limits.id.perFile}, ${limits.id.perReport}, ${limits.id.perDay}`,
    drop: 'Seret & letakkan struk di sini, atau',
    browse: 'Pilih file',
    camera: 'Buka Kamera',
    cameraHint: 'Ambil foto struk langsung dari kamera HP',
    addMore: 'Tambah struk lain',
    fileReady: 'Siap diproses',
    remove: 'Hapus',
    emptyQueue: 'Belum ada struk dipilih.',
    limitReached: limits.id.reportFull,
    duplicateFile: 'File ini sudah ada di daftar.',
    typeError: 'Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.',
    sizeError: limits.id.tooBig,
    uploadFailed: 'Gagal mengunggah file ke server. Coba lagi.',
    processFailed: 'Gagal memproses struk. Coba lagi.',
    genericError: 'Terjadi kesalahan. Coba lagi nanti.',
    processButton: 'Proses Laporan',
    processingButton: 'Memproses...',

    statusReady: 'Siap',
    statusUploading: 'Mengunggah',
    statusProcessing: 'Diproses AI',
    statusCompleted: 'Selesai',
    statusFailed: 'Gagal',
    processingOf: 'Memproses struk',
    processingOfCount: 'dari',
    processingHint: 'Setiap struk diproses satu per satu oleh AI. Jangan tutup halaman ini.',
    processedAll: 'struk berhasil diproses.',
    processedSome: 'berhasil diproses.',
    failedSome: 'gagal diproses.',
    retryFailed: 'Coba Lagi yang Gagal',
    discardFailed: 'Hapus yang Gagal',
    allFailed: 'Tidak ada struk yang berhasil diproses. Periksa file lalu coba lagi.',

    summaryTitle: 'Ringkasan Pengeluaran',
    totalExpenses: 'Total Pengeluaran',
    receiptCount: 'Jumlah Struk',
    totalSubtotal: 'Total Subtotal',
    totalTax: 'Total Pajak',
    totalDiscount: 'Total Diskon',
    categoriesTitle: 'Rincian per Kategori',
    noCategories: 'Belum ada kategori.',
    percentage: 'Persentase',

    reviewTitle: 'Periksa Data Pengeluaran',
    reviewSubtitle: 'Cek dan perbaiki data sebelum ekspor.',
    needReview: 'struk perlu diperiksa sebelum ekspor.',
    duplicateWarning: 'kemungkinan struk duplikat.',
    duplicateHint:
      'Data tidak dihapus otomatis. Hapus sendiri lewat ikon tong sampah bila memang duplikat.',
    reviewBadge: 'Perlu dicek',
    duplicateBadge: 'Kemungkinan duplikat',
    addManual: 'Tambah Pengeluaran Manual',
    startOver: 'Laporan Baru',
    backToUpload: 'Kembali ke Upload',

    colDate: 'Tanggal',
    colMerchant: 'Merchant',
    colCategory: 'Kategori',
    colPayment: 'Pembayaran',
    colSubtotal: 'Subtotal',
    colTax: 'Pajak',
    colDiscount: 'Diskon',
    colInvoiceNo: 'No. Struk',
    colTotal: 'Total',
    colNotes: 'Catatan',
    colActions: 'Aksi',
    editRow: 'Edit pengeluaran',
    deleteRow: 'Hapus pengeluaran',
    deleteConfirm: 'Hapus pengeluaran ini dari laporan?',
    manualTitle: 'Pengeluaran Manual',
    manualSaved: 'Pengeluaran manual ditambahkan.',
    save: 'Simpan',
    cancel: 'Batal',
    rowTotalHint: 'Total memakai angka tercetak pada struk bila tersedia.',
    missing: 'Kosong',

    exportExcel: 'Export Excel',
    exportPdf: 'Export PDF',
    exporting: 'Menyiapkan file...',
    exportFailed: 'Gagal membuat file. Coba lagi.',
    exportEmpty: 'Tambahkan minimal satu pengeluaran sebelum export.',

    privacy: 'Foto struk disimpan sementara di bucket privat dan dihapus otomatis setelah diproses.',
    categoryOther: 'Lainnya',
  },
  en: {
    badge: 'AI Agent',
    title: 'AI Expense Report Generator',
    description:
      'Turn multiple receipts into a structured expense report in minutes.',
    intro:
      'Upload your receipts, let AI extract and organize the data, review the results, then export your report to Excel or PDF.',
    stepsLabel: '4 steps',
    steps: [
      'Upload receipts',
      'AI reads & categorizes',
      'Review & correct the data',
      'Export Excel or PDF',
    ],
    loginRequired: 'Sign in to Continue',
    loginTitle: 'Expense reports need a sign-in',
    loginDesc:
      'Free Google sign-in lets you process receipts and keep your report progress on your Farisium account.',
    signInGoogle: 'Sign in with Google',

    reportNameLabel: 'Report Name',
    reportNamePlaceholder: 'Example: September 2026 Business Expenses',
    currencyLabel: 'Currency',
    currencyHint: 'AI still detects the currency from each receipt.',

    uploadTitle: 'Upload Receipt Photos',
    uploadHint: `JPG, PNG or WebP — ${limits.en.perFile}, ${limits.en.perReport}, ${limits.en.perDay}`,
    drop: 'Drag & drop your receipts here, or',
    browse: 'Browse files',
    camera: 'Open Camera',
    cameraHint: 'Snap receipts straight from your phone camera',
    addMore: 'Add more receipts',
    fileReady: 'Ready to process',
    remove: 'Remove',
    emptyQueue: 'No receipts selected yet.',
    limitReached: limits.en.reportFull,
    duplicateFile: 'This file is already in the list.',
    typeError: 'Unsupported file type. Use JPG, PNG, or WebP.',
    sizeError: limits.en.tooBig,
    uploadFailed: 'Failed to upload the file. Please try again.',
    processFailed: 'Failed to process the receipt. Please try again.',
    genericError: 'Something went wrong. Please try again later.',
    processButton: 'Process Report',
    processingButton: 'Processing...',

    statusReady: 'Ready',
    statusUploading: 'Uploading',
    statusProcessing: 'AI processing',
    statusCompleted: 'Completed',
    statusFailed: 'Failed',
    processingOf: 'Processing receipt',
    processingOfCount: 'of',
    processingHint: 'Each receipt is processed one by one. Keep this page open.',
    processedAll: 'receipts processed successfully.',
    processedSome: 'processed successfully.',
    failedSome: 'failed to process.',
    retryFailed: 'Retry Failed',
    discardFailed: 'Discard Failed',
    allFailed: 'No receipt could be processed. Check the files and try again.',

    summaryTitle: 'Expense Summary',
    totalExpenses: 'Total Expenses',
    receiptCount: 'Receipt Count',
    totalSubtotal: 'Total Subtotal',
    totalTax: 'Total Tax',
    totalDiscount: 'Total Discount',
    categoriesTitle: 'Category Breakdown',
    noCategories: 'No categories yet.',
    percentage: 'Percentage',

    reviewTitle: 'Review Expense Data',
    reviewSubtitle: 'Check and correct the data before exporting.',
    needReview: 'receipts need review before export.',
    duplicateWarning: 'possible duplicate receipts.',
    duplicateHint:
      'Nothing is deleted automatically. Remove them yourself with the trash icon if they really are duplicates.',
    reviewBadge: 'Needs review',
    duplicateBadge: 'Possible duplicate',
    addManual: 'Add Manual Expense',
    startOver: 'New Report',
    backToUpload: 'Back to Upload',

    colDate: 'Date',
    colMerchant: 'Merchant',
    colCategory: 'Category',
    colPayment: 'Payment',
    colSubtotal: 'Subtotal',
    colTax: 'Tax',
    colDiscount: 'Discount',
    colInvoiceNo: 'Receipt No.',
    colTotal: 'Total',
    colNotes: 'Notes',
    colActions: 'Actions',
    editRow: 'Edit expense',
    deleteRow: 'Delete expense',
    deleteConfirm: 'Remove this expense from the report?',
    manualTitle: 'Manual Expense',
    manualSaved: 'Manual expense added.',
    save: 'Save',
    cancel: 'Cancel',
    rowTotalHint: 'The total uses the printed receipt amount whenever it is readable.',
    missing: 'Empty',

    exportExcel: 'Export Excel',
    exportPdf: 'Export PDF',
    exporting: 'Preparing file...',
    exportFailed: 'Failed to build the file. Please try again.',
    exportEmpty: 'Add at least one expense before exporting.',

    privacy: 'Receipt photos are stored temporarily in a private bucket and deleted automatically once processed.',
    categoryOther: 'Other',
  },
} as const

export type ExpenseContent = (typeof expenseContent)['id']

/** Default report name: "Expense Report - September 2026". */
export function defaultReportName(now = new Date()): string {
  return `Expense Report - ${now.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  })}`
}
