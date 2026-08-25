export type Lang = 'id' | 'en'

export const translations = {
  id: {
    // Navbar
    navFind: 'Cari',
    navGallery: 'Galeri',
    navSignIn: 'Masuk',
    navSignOut: 'Keluar',
    navGuestMode: 'Mode Tamu',
    navSupport: 'Dukung Farisium',

    // Hero
    heroBadge: 'Anime Generator — Ciptakan karakter impianmu',
    heroHeadline: 'Hasilkan Anime',
    heroSubheadline: 'dengan 1 Klik',
    heroDescription:
      'Tuliskan deskripsi karakter impianmu. Biarkan AI menciptakan visual terbaiknya.',
    heroCta: 'Hasilkan Anime',

    // Generator
    generatorTitle: 'Hasilkan Karakter Animes',
    promptLabel: 'Deskripsikan Karakter Impianmu',
    promptPlaceholder: 'Anime girl rambut putih panjang, mata biru, kimono fantasi...',
    generateBtn: 'Hasilkan Anime',
    generatingBtn: 'Memproses...',
    enhanceBtn: 'Sempurnakan Deskripsi',
    enhancedBtn: 'Disempurnakan!',
    limitReachedMsg: 'Kamu sudah membuat hari ini. Coba lagi dalam 24 jam.',
    downloadBtn: 'Unduh',
    resultPlaceholder: 'Karakter animemu akan muncul di sini',

    // Queue
    queueTitle: 'Antrian',
    queuePosition: 'Posisi antrian',
    queueEstWait: 'Estimasi tunggu',
    queueSeconds: 'detik',
    queueStatusMessages: [
      'Menyiapkan imajinasi...',
      'Menelusuri dunia anime...',
      'Menciptakan karakter...',
      'Menyelesaikan masterpiece...',
    ] as string[],
    activeJobsLabel: 'Job aktif',

    // Profile
    profileGuest: 'Penjelajah',
    profileNotSignedIn: 'Belum masuk',
    profileCreated: 'Karakter Dibuat',
    profileSignInBtn: 'Masuk dengan Google',
    profileGuestActive: 'Mode tamu aktif',
    profileBenefits: 'Farisium Anime Generator v1.2',
    profileDailyLimit: 'Gratis 1x per 24 jam',
    profileLimitUsed: 'Sudah digunakan hari ini',

    // Support modal
    supportTitle: 'Dukung Farisium',
    supportDescription:
      'Dukung pengembangan Anime Generator agar tetap gratis.',
    supportClose: 'Tutup',
    topupSubtitle: 'Pilih paket FRSC untuk mulai menggunakan layanan AI Farisium.',
    choosePayment: 'Pilih metode pembayaran',
    topupFooter: 'Semua transaksi diproses dengan aman melalui KlikQRIS.',

    // Gallery
    galleryTitle: 'Galeri Anime',
    galleryTemporary: 'Gambar hilang setelah 10 menit atau refresh',
    galleryEmpty: 'Belum ada karakter. Mulai buat sekarang!',

    // Footer
    footerRights: 'Hak cipta dilindungi.',

    // Limit
    limitTitle: 'Sudah Membuat Hari Ini',
    limitMessage: 'Kamu sudah membuat karakter hari ini. Coba lagi dalam 24 jam.',
    limitSubtext: 'Karakter terbaik menunggumu besok!',
  },
  en: {
    // Navbar
    navFind: 'Find',
    navGallery: 'Gallery',
    navSignIn: 'Sign in',
    navSignOut: 'Sign out',
    navGuestMode: 'Guest mode',
    navSupport: 'Support Farisium',

    // Hero
    heroBadge: 'Anime Generator — Create your dream character',
    heroHeadline: 'Generate Anime',
    heroSubheadline: 'in 1 Click',
    heroDescription:
      'Describe your dream character and let AI bring it to life.',
    heroCta: 'Generate Anime',

    // Generator
    generatorTitle: 'Generate Your Anime Character',
    promptLabel: 'Describe Your Dream Character',
    promptPlaceholder: 'Anime girl with long white hair, blue eyes, fantasy kimono...',
    generateBtn: 'Generate Anime',
    generatingBtn: 'Processing...',
    enhanceBtn: 'Enhance Description',
    enhancedBtn: 'Enhanced!',
    limitReachedMsg: 'You have already created today. Please come back in 24 hours.',
    downloadBtn: 'Download',
    resultPlaceholder: 'Your anime character will appear here',

    // Queue
    queueTitle: 'Queue',
    queuePosition: 'Queue position',
    queueEstWait: 'Est. wait',
    queueSeconds: 'sec',
    queueStatusMessages: [
      'Preparing imagination...',
      'Exploring anime worlds...',
      'Creating character...',
      'Finishing masterpiece...',
    ] as string[],
    activeJobsLabel: 'Active jobs',

    // Profile
    profileGuest: 'Guest Explorer',
    profileNotSignedIn: 'Not signed in',
    profileCreated: 'Characters Created',
    profileSignInBtn: 'Sign in with Google',
    profileGuestActive: 'Guest mode active',
    profileBenefits: 'Farisium Anime Generator v1.2',
    profileDailyLimit: 'Free 1x per 24 hours',
    profileLimitUsed: 'Used today',

    // Support modal
    supportTitle: 'Support Farisium',
    supportDescription:
      'Support the development of Anime Generator to keep it free.',
    supportClose: 'Close',
    topupSubtitle: 'Choose a FRSC package to start using Farisium AI services.',
    choosePayment: 'Choose payment method',
    topupFooter: 'All transactions are securely processed via KlikQRIS.',

    // Gallery
    galleryTitle: 'Anime Gallery',
    galleryTemporary: 'Images disappear after 10 minutes or on refresh',
    galleryEmpty: 'No characters yet. Start creating now!',

    // Footer
    footerRights: 'All rights reserved.',

    // Limit
    limitTitle: 'Already Created Today',
    limitMessage: 'You have already created a character today. Please come back in 24 hours.',
    limitSubtext: 'The best character is waiting for you tomorrow!',
  },
} as const

export type TranslationKey = keyof (typeof translations)['id']

export function t(lang: Lang, key: TranslationKey): string | string[] {
  return translations[lang][key] as string | string[]
}
