import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollReveal } from '@/components/scroll-reveal'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const titles = { id: 'FAQ — Farisium', en: 'FAQ — Farisium' }
  const descriptions = {
    id: 'Pertanyaan yang sering diajukan tentang Farisium, FRSC, Anime Generator, dan layanan AI lainnya.',
    en: 'Frequently asked questions about Farisium, FRSC, Anime Generator, and other AI services.',
  }
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: { canonical: getCanonicalUrl(lang, '/faq'), languages: Object.fromEntries(getHreflangLinks('/faq', lang).map(a => [a.lang, a.href])) },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: getCanonicalUrl(lang, '/faq'),
      siteName: 'Farisium',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'FAQ Farisium' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
  }
}

const faqContent = {
  id: {
    badge: 'FAQ',
    heading: 'Pertanyaan yang Sering Diajukan',
    description: 'Temukan jawaban untuk pertanyaan umum seputar Farisium, layanan AI, FRSC, dan banyak lagi.',
    items: [
      {
        question: 'Apa itu Farisium?',
        answer: 'Farisium adalah platform AI terpadu yang menyediakan berbagai layanan berbasis Artificial Intelligence dalam satu ekosistem. Layanan utama kami saat ini meliputi Anime Generator, AI Compute, dan berbagai alat AI lainnya. Farisium dirancang untuk memudahkan siapa saja mengakses teknologi AI terkini tanpa memerlukan keahlian teknis yang mendalam.'
      },
      {
        question: 'Apa itu FRSC dan bagaimana cara mendapatkannya?',
        answer: 'FRSC (Farisium Credit) adalah unit virtual dalam ekosistem Farisium yang digunakan untuk mengakses layanan premium seperti Anime Generator. Anda bisa mendapatkan FRSC melalui: (1) klaim harian gratis di halaman Rewards, (2) mengikuti kompetisi dan event, (3) program partnership, atau (4) pembelian langsung melalui halaman FRSC. FRSC bukan mata uang digital dan tidak dapat ditukarkan dengan uang tunai.'
      },
      {
        question: 'Bagaimana cara menggunakan Anime Generator?',
        answer: 'Anime Generator dapat digunakan langsung melalui halaman AI Tools. Cukup masukkan prompt atau deskripsi karakter yang ingin Anda buat, pilih gaya yang diinginkan, lalu klik Generate. Setiap generasi memerlukan sejumlah FRSC. Hasil gambar dapat diunduh setelah proses selesai. Untuk hasil terbaik, gunakan prompt yang deskriptif dan spesifik.'
      },
      {
        question: 'Apakah konten yang dihasilkan AI Farisium gratis untuk digunakan?',
        answer: 'Ya, konten yang Anda hasilkan melalui layanan AI Farisium sepenuhnya menjadi hak Anda. Anda bebas menggunakan gambar atau konten tersebut untuk keperluan pribadi, komersial, atau proyek lainnya tanpa royalti. Namun, Anda bertanggung jawab penuh atas penggunaan konten tersebut dan memastikan tidak melanggar hukum atau hak pihak ketiga.'
      },
      {
        question: 'Bagaimana cara menghapus akun Farisium?',
        answer: 'Anda dapat menghapus akun melalui halaman Dashboard pada bagian pengaturan akun. Setelah permintaan penghapusan dikonfirmasi, data pribadi Anda akan dihapus atau dianonimkan dalam waktu yang wajar sesuai Kebijakan Privasi kami. Jika mengalami kesulitan, silakan hubungi support@farisium.com untuk bantuan lebih lanjut.'
      },
      {
        question: 'Apakah data saya aman di Farisium?',
        answer: 'Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang wajar untuk melindungi data Anda, termasuk enkripsi TLS/SSL untuk data dalam transit dan penyimpanan data yang aman. Kami tidak menjual informasi pribadi Anda kepada pihak ketiga. Untuk informasi lebih detail, silakan baca Kebijakan Privasi dan Syarat & Ketentuan kami.'
      },
      {
        question: 'Bagaimana cara menghubungi tim Farisium?',
        answer: 'Anda dapat menghubungi kami melalui email di support@farisium.com atau melalui halaman Kontak yang tersedia di platform. Tim kami berusaha merespons setiap pertanyaan dalam waktu 1x24 jam pada hari kerja. Untuk pertanyaan mendesak terkait akun atau keamanan, silakan sebutkan subjek yang jelas agar dapat kami prioritaskan.'
      },
      {
        question: 'Apakah Farisium tersedia dalam bahasa Inggris?',
        answer: 'Ya, Farisium mendukung dua bahasa, yaitu Bahasa Indonesia dan Inggris. Anda dapat mengganti preferensi bahasa melalui toggle yang tersedia di pojok kanan atas halaman. Pengaturan bahasa akan disimpan dan tetap berlaku pada kunjungan berikutnya.'
      },
    ],
  },
  en: {
    badge: 'FAQ',
    heading: 'Frequently Asked Questions',
    description: 'Find answers to common questions about Farisium, AI services, FRSC, and more.',
    items: [
      {
        question: 'What is Farisium?',
        answer: 'Farisium is an integrated AI platform providing various Artificial Intelligence-based services in one ecosystem. Our main services currently include Anime Generator, AI Compute, and other AI tools. Farisium is designed to make cutting-edge AI technology accessible to everyone without requiring deep technical expertise.'
      },
      {
        question: 'What is FRSC and how do I get it?',
        answer: 'FRSC (Farisium Credit) is a virtual unit within the Farisium ecosystem used to access premium services such as Anime Generator. You can earn FRSC through: (1) daily free claims on the Rewards page, (2) competitions and events, (3) partnership programs, or (4) direct purchase on the FRSC page. FRSC is not a digital currency and cannot be exchanged for cash.'
      },
      {
        question: 'How do I use the Anime Generator?',
        answer: 'The Anime Generator can be used directly from the AI Tools page. Simply enter a prompt or character description, select your preferred style, and click Generate. Each generation requires a certain amount of FRSC. The resulting image can be downloaded once the process is complete. For best results, use descriptive and specific prompts.'
      },
      {
        question: 'Is AI-generated content from Farisium free to use?',
        answer: 'Yes, content you generate through Farisium AI services is fully yours. You are free to use the generated images or content for personal, commercial, or other projects without royalty. However, you are fully responsible for how you use such content and must ensure it does not violate any laws or third-party rights.'
      },
      {
        question: 'How do I delete my Farisium account?',
        answer: 'You can delete your account through the Dashboard page in account settings. Once the deletion request is confirmed, your personal data will be deleted or anonymized within a reasonable timeframe in accordance with our Privacy Policy. If you encounter any difficulties, please contact support@farisium.com for further assistance.'
      },
      {
        question: 'Is my data safe on Farisium?',
        answer: 'We implement reasonable technical and organizational security measures to protect your data, including TLS/SSL encryption for data in transit and secure data storage. We do not sell your personal information to third parties. For more detailed information, please read our Privacy Policy and Terms of Service.'
      },
      {
        question: 'How can I contact the Farisium team?',
        answer: 'You can reach us via email at support@farisium.com or through the Contact page available on the platform. Our team strives to respond to every inquiry within 24 hours on business days. For urgent matters regarding accounts or security, please use a clear subject line so we can prioritize your request.'
      },
      {
        question: 'Is Farisium available in English?',
        answer: 'Yes, Farisium supports two languages: Indonesian and English. You can switch your language preference via the toggle available at the top right corner of the page. Your language setting will be saved and persist across your visits.'
      },
    ],
  },
}

export default async function FaqPage() {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const content = faqContent[lang] ?? faqContent.id

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="mx-auto w-full max-w-7xl px-4 py-14 lg:px-6">
          <span className="eyebrow-label text-eyebrow text-frsc-crimson-400 mb-4 flex items-center gap-1.5">
            <HelpCircle className="h-3 w-3" aria-hidden="true" />
            {content.badge}
          </span>
          <h1 className="heading-fluid text-h1 text-foreground text-balance">
            {content.heading}
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-lead text-frsc-text-200">
            {content.description}
          </p>
        </section>

        {/* FAQ Items */}
        <section className="mx-auto w-full max-w-4xl px-4 pb-20 lg:px-6">
          <div className="flex flex-col gap-4">
            {content.items.map((item, index) => (
              <details
                key={index}
                className="group rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic open:ring-1 open:ring-frsc-crimson-500/20"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <h2 className="font-heading text-sm font-semibold text-frsc-white-bright">
                    {item.question}
                  </h2>
                  <ChevronDown className="h-4 w-4 shrink-0 text-frsc-text-300 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="mt-4 border-t border-white/[0.06] pt-4">
                  <p className="text-pretty text-sm text-frsc-text-200 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      <ScrollReveal />
    </div>
  )
}
