import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollReveal } from '@/components/scroll-reveal'
import { Cookie, Settings, Shield, ExternalLink, RefreshCw, FileText } from 'lucide-react'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const titles = { id: 'Kebijakan Cookie — Farisium', en: 'Cookie Policy — Farisium' }
  const descriptions = {
    id: 'Kebijakan Cookie Farisium — informasi tentang bagaimana kami menggunakan cookie dan teknologi pelacakan serupa.',
    en: 'Farisium Cookie Policy — information about how we use cookies and similar tracking technologies.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/cookie-policy')
  const alternates = getHreflangLinks('/cookie-policy', lang)
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: { canonical: canonicalUrl, languages: Object.fromEntries(alternates.map(a => [a.lang, a.href])) },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: canonicalUrl,
      siteName: 'Farisium',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Cookie Policy Farisium' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
  }
}

const pageContent = {
  id: {
    badge: 'Cookie Policy',
    heading: 'Kebijakan Cookie',
    description: 'Dokumen ini menjelaskan bagaimana Farisium menggunakan cookie dan teknologi pelacakan serupa di platform kami.',
    sections: [
      {
        icon: Cookie,
        title: 'Apa itu Cookie?',
        content: 'Cookie adalah file teks kecil yang disimpan di perangkat Anda (komputer, tablet, atau ponsel) saat Anda mengunjungi sebuah website. Cookie memungkinkan website untuk mengenali perangkat Anda, menyimpan preferensi, dan mengumpulkan informasi tentang aktivitas Anda.\n\nCookie biasanya berisi nama server asal, masa berlaku cookie, dan nilai unik acak. Ada dua jenis cookie utama: cookie sesi yang akan terhapus setelah Anda menutup browser, dan cookie persisten yang tetap tersimpan hingga masa berlakunya habis atau Anda menghapusnya secara manual.',
      },
      {
        icon: Settings,
        title: 'Jenis Cookie yang Kami Gunakan',
        content: 'Farisium menggunakan jenis cookie berikut:\n\n1. Cookie Esensial — diperlukan agar platform dapat berfungsi dengan baik. Termasuk cookie untuk menjaga sesi login, keamanan akun, dan pengaturan dasar seperti preferensi bahasa. Tanpa cookie ini, beberapa fitur mungkin tidak dapat berjalan.\n\n2. Cookie Fungsional — menyimpan preferensi Anda seperti pilihan bahasa, tema, dan pengaturan lainnya agar tidak perlu diatur ulang setiap kunjungan.\n\n3. Cookie Analytics — membantu kami memahami bagaimana pengguna berinteraksi dengan platform, halaman mana yang paling sering dikunjungi, dan area mana yang perlu ditingkatkan. Data yang dikumpulkan bersifat anonim dan agregat.\n\nKami tidak menggunakan cookie untuk pelacakan lintas-situs yang invasif atau periklanan perilaku.',
      },
      {
        icon: Shield,
        title: 'Tujuan Penggunaan Cookie',
        content: 'Kami menggunakan cookie untuk tujuan berikut:\n\n- Autentikasi: menjaga sesi login Anda tetap aman dan aktif selama menjelajahi platform.\n- Preferensi: menyimpan pengaturan bahasa, tema, dan preferensi lainnya.\n- Keamanan: melindungi akun Anda dari akses yang tidak sah dan aktivitas mencurigakan.\n- Analitik: menganalisis penggunaan platform untuk meningkatkan kualitas layanan dan pengalaman pengguna.\n- Fungsionalitas: memastikan fitur-fitur seperti Anime Generator dan Dashboard berjalan optimal.\n\nKami tidak menggunakan cookie untuk menargetkan iklan atau melacak aktivitas Anda di luar platform Farisium.',
      },
      {
        icon: ExternalLink,
        title: 'Cookie Pihak Ketiga',
        content: 'Beberapa layanan pihak ketiga yang kami gunakan mungkin menempatkan cookie pada perangkat Anda. Pihak ketiga tersebut meliputi:\n\n- Google Analytics: membantu kami menganalisis penggunaan platform secara anonim. Data yang dikumpulkan meliputi halaman yang dikunjungi, durasi kunjungan, dan sumber trafik. Google Analytics memiliki kebijakan privasi sendiri yang dapat Anda lihat di policies.google.com.\n\n- Firebase Authentication: digunakan untuk proses login dan autentikasi pengguna. Cookie ini penting untuk keamanan akun Anda.\n\nKami telah memastikan bahwa pihak ketiga yang bekerja sama dengan kami mematuhi standar privasi dan keamanan yang ketat. Namun, kami tidak bertanggung jawab atas praktik cookie pihak ketiga.',
      },
      {
        icon: RefreshCw,
        title: 'Kontrol Cookie',
        content: 'Anda memiliki kendali penuh atas penggunaan cookie. Beberapa cara untuk mengelola cookie:\n\n1. Pengaturan Browser — hampir semua browser menyediakan opsi untuk menerima, menolak, atau menghapus cookie. Anda dapat mengakses pengaturan ini melalui menu preferensi atau privasi browser Anda.\n\n2. Penolakan Cookie Esensial — menonaktifkan cookie esensial dapat mempengaruhi fungsionalitas platform. Beberapa fitur mungkin tidak berfungsi dengan baik atau tidak dapat diakses.\n\n3. Penghapusan Cookie — Anda dapat menghapus cookie yang sudah tersimpan kapan saja melalui pengaturan browser Anda.\n\nUntuk panduan lebih detail, kunjungi bagian bantuan browser yang Anda gunakan (Chrome, Firefox, Safari, atau Edge).',
      },
      {
        icon: FileText,
        title: 'Perubahan Kebijakan Cookie',
        content: 'Kami dapat memperbarui Kebijakan Cookie ini dari waktu ke waktu untuk mencerminkan perubahan dalam penggunaan cookie atau persyaratan hukum. Perubahan akan diumumkan melalui platform.\n\nJika Anda memiliki pertanyaan tentang Kebijakan Cookie ini, silakan hubungi kami di support@farisium.com.',
      },
    ],
    lastUpdated: 'Kebijakan Cookie ini terakhir diperbarui pada 1 Januari 2026.',
  },
  en: {
    badge: 'Cookie Policy',
    heading: 'Cookie Policy',
    description: 'This document explains how Farisium uses cookies and similar tracking technologies on our platform.',
    sections: [
      {
        icon: Cookie,
        title: 'What Are Cookies?',
        content: 'Cookies are small text files stored on your device (computer, tablet, or mobile phone) when you visit a website. Cookies enable the website to recognize your device, store preferences, and collect information about your activity.\n\nCookies typically contain the originating server name, cookie lifetime, and a random unique value. There are two main types: session cookies which are deleted when you close your browser, and persistent cookies which remain until they expire or you manually delete them.',
      },
      {
        icon: Settings,
        title: 'Types of Cookies We Use',
        content: 'Farisium uses the following types of cookies:\n\n1. Essential Cookies — required for the platform to function properly. These include cookies for maintaining login sessions, account security, and basic settings like language preference. Without these cookies, some features may not work.\n\n2. Functional Cookies — store your preferences such as language choice, theme, and settings so you don\'t have to reconfigure them on each visit.\n\n3. Analytics Cookies — help us understand how users interact with the platform, which pages are most visited, and which areas need improvement. Data collected is anonymous and aggregated.\n\nWe do not use cookies for invasive cross-site tracking or behavioral advertising.',
      },
      {
        icon: Shield,
        title: 'Purpose of Cookie Usage',
        content: 'We use cookies for the following purposes:\n\n- Authentication: keeping your login session secure and active while browsing the platform.\n- Preferences: storing language settings, theme, and other preferences.\n- Security: protecting your account from unauthorized access and suspicious activity.\n- Analytics: analyzing platform usage to improve service quality and user experience.\n- Functionality: ensuring features like Anime Generator and Dashboard run optimally.\n\nWe do not use cookies for ad targeting or tracking your activity outside the Farisium platform.',
      },
      {
        icon: ExternalLink,
        title: 'Third-Party Cookies',
        content: 'Some third-party services we use may place cookies on your device. These include:\n\n- Google Analytics: helps us anonymously analyze platform usage. Data collected includes pages visited, visit duration, and traffic sources. Google Analytics has its own privacy policy available at policies.google.com.\n\n- Firebase Authentication: used for user login and authentication processes. These cookies are essential for your account security.\n\nWe ensure that third parties we work with comply with strict privacy and security standards. However, we are not responsible for third-party cookie practices.',
      },
      {
        icon: RefreshCw,
        title: 'Cookie Control',
        content: 'You have full control over cookie usage. Ways to manage cookies:\n\n1. Browser Settings — most browsers provide options to accept, reject, or delete cookies. You can access these settings through your browser\'s preference or privacy menu.\n\n2. Essential Cookie Rejection — disabling essential cookies may affect platform functionality. Some features may not work properly or may be inaccessible.\n\n3. Cookie Deletion — you can delete stored cookies at any time through your browser settings.\n\nFor detailed guidance, visit the help section of your browser (Chrome, Firefox, Safari, or Edge).',
      },
      {
        icon: FileText,
        title: 'Changes to This Cookie Policy',
        content: 'We may update this Cookie Policy from time to time to reflect changes in our use of cookies or legal requirements. Changes will be announced through the platform.\n\nIf you have questions about this Cookie Policy, please contact us at support@farisium.com.',
      },
    ],
    lastUpdated: 'This Cookie Policy was last updated on January 1, 2026.',
  },
}

export default async function CookiePolicyPage() {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const content = pageContent[lang] ?? pageContent.id

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="mx-auto w-full max-w-7xl px-4 py-14 lg:px-6">
          <span className="eyebrow-label text-eyebrow text-frsc-crimson-400 mb-4 flex items-center gap-1.5">
            <Cookie className="h-3 w-3" aria-hidden="true" />
            {content.badge}
          </span>
          <h1 className="heading-fluid text-h1 text-foreground text-balance">
            {content.heading}
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-lead text-frsc-text-200">
            {content.description}
          </p>
        </section>

        {/* Sections */}
        <section className="mx-auto w-full max-w-4xl px-4 pb-20 lg:px-6">
          <div className="flex flex-col gap-6">
            {content.sections.map(({ icon: Icon, title, content: sectionContent }) => (
              <div key={title} className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10 shadow-sm">
                    <Icon className="h-5 w-5 text-frsc-crimson-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-heading text-sm font-semibold text-frsc-white-bright mb-3">{title}</h2>
                    {sectionContent.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="text-pretty text-sm text-frsc-text-200 leading-relaxed mb-3 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-frsc-text-300">
            {content.lastUpdated}
          </p>
        </section>
      </main>
      <SiteFooter />
      <ScrollReveal />
    </div>
  )
}
