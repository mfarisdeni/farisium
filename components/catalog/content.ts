/**
 * Bilingual UI strings for the Product Catalog AI agent.
 * Same pattern as the receipt, invoice & expense tool pages: one
 * `catalogContent` object with `id` + `en` keys, only the labels are
 * translated — the logic, API calls, and component interfaces stay
 * locale-independent.
 *
 * The numeric limits are interpolated from their source of truth so the copy
 * can never advertise a different limit than the server enforces.
 */

import { MAX_CATALOG_DOCUMENTS, MAX_CATALOG_PRODUCTS } from '@/features/product-catalog/schema'
import { MAX_FILE_SIZE_BYTES } from '@/lib/r2/keys'
import { DAILY_LIMITS, PRODUCT_CATALOG_FEATURE } from '@/lib/limits'

const MAX_SIZE_MB = Math.round(MAX_FILE_SIZE_BYTES / (1024 * 1024))
const DAILY_PAGES = DAILY_LIMITS[PRODUCT_CATALOG_FEATURE]

/** Limit-derived copy, so the UI can never advertise a stale number. */
const limits = {
  id: {
    perFile: `maksimal ${MAX_SIZE_MB} MB per gambar`,
    perRun: `hingga ${MAX_CATALOG_DOCUMENTS} gambar per katalog`,
    perDay: `${DAILY_PAGES} gambar per hari per pengguna`,
    runFull: `Batas ${MAX_CATALOG_DOCUMENTS} gambar per katalog sudah tercapai.`,
    productsFull: `Batas ${MAX_CATALOG_PRODUCTS} produk sudah tercapai.`,
    tooBig: `Ukuran file melebihi batas ${MAX_SIZE_MB} MB.`,
  },
  en: {
    perFile: `up to ${MAX_SIZE_MB} MB each`,
    perRun: `${MAX_CATALOG_DOCUMENTS} images per catalog`,
    perDay: `${DAILY_PAGES} images per day per user`,
    runFull: `A catalog holds up to ${MAX_CATALOG_DOCUMENTS} images.`,
    productsFull: `A catalog holds up to ${MAX_CATALOG_PRODUCTS} products.`,
    tooBig: `File exceeds the ${MAX_SIZE_MB} MB limit.`,
  },
} as const

export const catalogContent = {
  id: {
    badge: 'AI Agent',
    title: 'Product Catalog AI Agent',
    description:
      'Ubah screenshot katalog marketplace atau foto halaman produk menjadi tabel Excel yang rapi.',
    intro:
      'Upload beberapa screenshot katalog, biarkan AI membaca setiap kartu produk beserta nama tokonya, periksa hasilnya, lalu ekspor ke Excel atau PDF.',
    stepsLabel: '4 langkah',
    steps: [
      'Upload screenshot katalog',
      'AI membaca kartu produk',
      'Periksa & perbaiki data',
      'Export Excel atau PDF',
    ],
    loginRequired: 'Login untuk Menggunakan',
    loginTitle: 'Product Catalog butuh login',
    loginDesc:
      'Login gratis dengan Google untuk memproses katalog dan menyimpan progres kerjamu di akun Farisium.',
    signInGoogle: 'Masuk dengan Google',

    catalogNameLabel: 'Nama Katalog',
    catalogNamePlaceholder: 'Contoh: Katalog Lampu Listrik September 2026',
    currencyLabel: 'Mata Uang',
    currencyHint: 'AI tetap mendeteksi mata uang dari tiap halaman katalog.',

    uploadTitle: 'Upload Screenshot Katalog',
    uploadHint: `JPG, PNG, atau WebP — ${limits.id.perFile}, ${limits.id.perRun}, ${limits.id.perDay}`,
    drop: 'Seret & letakkan gambar katalog di sini, atau',
    browse: 'Pilih file',
    camera: 'Buka Kamera',
    cameraHint: 'Ambil foto halaman katalog atau etalase toko',
    addMore: 'Tambah gambar lain',
    fileReady: 'Siap diproses',
    remove: 'Hapus',
    emptyQueue: 'Belum ada gambar dipilih.',
    limitReached: limits.id.runFull,
    productsFull: limits.id.productsFull,
    duplicateFile: 'Gambar ini sudah ada di daftar.',
    typeError: 'Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.',
    sizeError: limits.id.tooBig,
    uploadFailed: 'Gagal mengunggah file ke server. Coba lagi.',
    processFailed: 'Gagal membaca katalog. Coba lagi.',
    genericError: 'Terjadi kesalahan. Coba lagi nanti.',
    processButton: 'Proses Katalog',
    processingButton: 'Memproses...',

    statusReady: 'Siap',
    statusUploading: 'Mengunggah',
    statusProcessing: 'Dibaca AI',
    statusCompleted: 'Selesai',
    statusFailed: 'Gagal',
    processingOf: 'Membaca gambar',
    processingOfCount: 'dari',
    processingHint:
      'Setiap gambar diproses satu per satu oleh AI. Jangan tutup halaman ini.',
    failedSome: 'gagal dibaca.',
    retryFailed: 'Coba Lagi yang Gagal',
    discardFailed: 'Hapus yang Gagal',
    allFailed: 'Tidak ada gambar yang berhasil dibaca. Periksa file lalu coba lagi.',

    summaryTitle: 'Ringkasan Katalog',
    totalListedValue: 'Total Harga Daftar',
    productCount: 'Jumlah Produk',
    pricedCount: 'Produk Berharga',
    discountedCount: 'Produk Diskon',
    shopCount: 'Jumlah Toko',
    minPrice: 'Harga Termurah',
    maxPrice: 'Harga Tertinggi',
    averagePrice: 'Harga Rata-rata',
    storesTitle: 'Rincian per Toko',
    noStores: 'Nama toko tidak tercetak di halaman ini.',
    noStoreLabel: 'Tanpa nama toko',
    percentage: 'Persentase',
    documentsTitle: 'Sumber Gambar',

    reviewTitle: 'Periksa Data Produk',
    reviewSubtitle: 'Cek nama produk, harga, dan nama toko sebelum ekspor.',
    needReview: 'produk perlu diperiksa sebelum ekspor.',
    duplicateWarning: 'kemungkinan produk duplikat.',
    duplicateHint:
      'Data tidak dihapus otomatis. Hapus sendiri lewat ikon tong sampah bila memang duplikat.',
    reviewBadge: 'Perlu dicek',
    duplicateBadge: 'Kemungkinan duplikat',
    issueName: 'Nama produk kosong',
    issuePrice: 'Harga tidak terbaca',
    issuePriceAboveOriginal: 'Harga lebih besar dari harga awal',
    issueRatingRange: 'Rating di luar 0-5',
    issueDiscountRange: 'Diskon di luar 0-100',
    issueStoreIsMarketplace: 'Kolom toko berisi nama marketplace',
    addManual: 'Tambah Produk Manual',
    startOver: 'Katalog Baru',
    backToUpload: 'Kembali ke Upload',
    failedFilesTitle: 'Gambar gagal dibaca',
    failedFilesHint: 'Produk dari gambar ini tidak masuk katalog.',

    colName: 'Nama Produk',
    colVariant: 'Varian / Spesifikasi',
    colStore: 'Toko',
    colBrand: 'Merek',
    colCategory: 'Kategori',
    colPrice: 'Harga',
    colOriginalPrice: 'Harga Awal',
    colDiscount: 'Diskon %',
    colRating: 'Rating',
    colSold: 'Terjual',
    colSku: 'SKU',
    colNotes: 'Catatan',
    editRow: 'Edit produk',
    deleteRow: 'Hapus produk',
    missing: 'Kosong',
    storeHint: 'Nama toko diambil dari header toko di atas kartu produk.',
    shopSelectLabel: 'Toko terdeteksi',

    exportExcel: 'Export Excel',
    exportPdf: 'Export PDF',
    exporting: 'Menyiapkan file...',
    exportFailed: 'Gagal membuat file. Coba lagi.',
    exportEmpty: 'Tambahkan minimal satu produk sebelum export.',

    privacy:
      'Screenshot katalog disimpan sementara di bucket privat dan dihapus otomatis setelah diproses.',
  },
  en: {
    badge: 'AI Agent',
    title: 'Product Catalog AI Agent',
    description:
      'Turn marketplace catalog screenshots or product page photos into a clean Excel table.',
    intro:
      'Upload several catalog screenshots, let AI read every product card together with its shop name, review the results, then export to Excel or PDF.',
    stepsLabel: '4 steps',
    steps: [
      'Upload catalog screenshots',
      'AI reads every product card',
      'Review & correct the data',
      'Export Excel or PDF',
    ],
    loginRequired: 'Sign in to Continue',
    loginTitle: 'Product Catalog needs a sign-in',
    loginDesc:
      'Free Google sign-in lets you process catalogs and keep your work progress on your Farisium account.',
    signInGoogle: 'Sign in with Google',

    catalogNameLabel: 'Catalog Name',
    catalogNamePlaceholder: 'Example: September 2026 Lighting Catalog',
    currencyLabel: 'Currency',
    currencyHint: 'AI still detects the currency from each catalog page.',

    uploadTitle: 'Upload Catalog Screenshots',
    uploadHint: `JPG, PNG or WebP — ${limits.en.perFile}, ${limits.en.perRun}, ${limits.en.perDay}`,
    drop: 'Drag & drop your catalog images here, or',
    browse: 'Browse files',
    camera: 'Open Camera',
    cameraHint: 'Snap a catalog page or a store display',
    addMore: 'Add more images',
    fileReady: 'Ready to process',
    remove: 'Remove',
    emptyQueue: 'No images selected yet.',
    limitReached: limits.en.runFull,
    productsFull: limits.en.productsFull,
    duplicateFile: 'This image is already in the list.',
    typeError: 'Unsupported file type. Use JPG, PNG, or WebP.',
    sizeError: limits.en.tooBig,
    uploadFailed: 'Failed to upload the file. Please try again.',
    processFailed: 'Failed to read the catalog. Please try again.',
    genericError: 'Something went wrong. Please try again later.',
    processButton: 'Process Catalog',
    processingButton: 'Processing...',

    statusReady: 'Ready',
    statusUploading: 'Uploading',
    statusProcessing: 'AI reading',
    statusCompleted: 'Completed',
    statusFailed: 'Failed',
    processingOf: 'Reading image',
    processingOfCount: 'of',
    processingHint: 'Each image is processed one by one. Keep this page open.',
    failedSome: 'could not be read.',
    retryFailed: 'Retry Failed',
    discardFailed: 'Discard Failed',
    allFailed: 'No image could be read. Check the files and try again.',

    summaryTitle: 'Catalog Summary',
    totalListedValue: 'Total Listed Value',
    productCount: 'Product Count',
    pricedCount: 'With Price',
    discountedCount: 'Discounted',
    shopCount: 'Shop Count',
    minPrice: 'Lowest Price',
    maxPrice: 'Highest Price',
    averagePrice: 'Average Price',
    storesTitle: 'Breakdown per Store',
    noStores: 'No shop name is printed on this page.',
    noStoreLabel: 'No shop name',
    percentage: 'Percentage',
    documentsTitle: 'Source Images',

    reviewTitle: 'Review Product Data',
    reviewSubtitle: 'Check product names, prices, and shop names before exporting.',
    needReview: 'products need review before export.',
    duplicateWarning: 'possible duplicate products.',
    duplicateHint:
      'Nothing is deleted automatically. Remove them yourself with the trash icon if they really are duplicates.',
    reviewBadge: 'Needs review',
    duplicateBadge: 'Possible duplicate',
    issueName: 'Product name is empty',
    issuePrice: 'Price could not be read',
    issuePriceAboveOriginal: 'Price is higher than the original price',
    issueRatingRange: 'Rating outside 0-5',
    issueDiscountRange: 'Discount outside 0-100',
    issueStoreIsMarketplace: 'Store column holds a marketplace name',
    addManual: 'Add Manual Product',
    startOver: 'New Catalog',
    backToUpload: 'Back to Upload',
    failedFilesTitle: 'Images that failed',
    failedFilesHint: 'Products from these images are not in the catalog.',

    colName: 'Product Name',
    colVariant: 'Variant / Spec',
    colStore: 'Store',
    colBrand: 'Brand',
    colCategory: 'Category',
    colPrice: 'Price',
    colOriginalPrice: 'Original Price',
    colDiscount: 'Discount %',
    colRating: 'Rating',
    colSold: 'Sold',
    colSku: 'SKU',
    colNotes: 'Notes',
    editRow: 'Edit product',
    deleteRow: 'Delete product',
    missing: 'Empty',
    storeHint: 'The store name comes from the shop header printed above the product card.',
    shopSelectLabel: 'Detected shops',

    exportExcel: 'Export Excel',
    exportPdf: 'Export PDF',
    exporting: 'Preparing file...',
    exportFailed: 'Failed to build the file. Please try again.',
    exportEmpty: 'Add at least one product before exporting.',

    privacy:
      'Catalog screenshots are stored temporarily in a private bucket and deleted automatically once processed.',
  },
} as const

export type CatalogContent = (typeof catalogContent)['id']

/** Default catalog name: "Product Catalog - September 2026". */
export function defaultCatalogName(now = new Date()): string {
  return `Product Catalog - ${now.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  })}`
}
