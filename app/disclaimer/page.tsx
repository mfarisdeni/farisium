import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollReveal } from '@/components/scroll-reveal'
import { Shield, AlertTriangle, Info, FileText } from 'lucide-react'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const titles = { id: 'Disclaimer — Farisium', en: 'Disclaimer — Farisium' }
  const descriptions = {
    id: 'Disclaimer resmi Farisium — informasi penting tentang penggunaan layanan, batasan tanggung jawab, dan kebijakan platform.',
    en: 'Official Farisium disclaimer — important information about service usage, limitations of liability, and platform policies.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/disclaimer')
  const alternates = getHreflangLinks('/disclaimer', lang)
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
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Disclaimer Farisium' }],
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
    badge: 'Disclaimer',
    heading: 'Disclaimer Farisium',
    description: 'Dokumen ini berisi informasi penting mengenai batasan tanggung jawab, penggunaan layanan, dan kebijakan platform Farisium.',
    sections: [
      {
        icon: Info,
        title: 'Informasi Umum',
        content: 'Farisium adalah platform AI yang menyediakan berbagai alat kreatif berbasis kecerdasan buatan. Seluruh layanan disediakan "apa adanya" (as-is) dan "tersedia sebagaimana adanya" (as available) tanpa jaminan dalam bentuk apapun, baik tersurat maupun tersirat.\n\nKonten yang dihasilkan oleh AI bersifat otomatis dan mungkin tidak selalu akurat, sesuai, atau bebas dari kesalahan. Pengguna bertanggung jawab penuh atas penggunaan konten yang dihasilkan melalui platform Farisium.',
      },
      {
        icon: Shield,
        title: 'Batasan Tanggung Jawab',
        content: 'Farisium tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, konsekuensial, atau khusus yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan kami.\n\nFarisium tidak memberikan jaminan bahwa layanan akan berjalan tanpa gangguan, bebas dari kesalahan, atau aman dari serangan pihak ketiga. Penggunaan platform sepenuhnya merupakan risiko pengguna.',
      },
      {
        icon: AlertTriangle,
        title: 'Penggunaan yang Bertanggung Jawab',
        content: 'Pengguna dilarang menggunakan platform Farisium untuk:\n\n- Membuat konten ilegal, berbahaya, mengancam, atau melanggar hukum\n- Membuat konten yang mengandung kekerasan, kebencian, diskriminasi, atau pelecehan\n- Melanggar hak kekayaan intelektual pihak lain\n- Menyebarkan malware, virus, atau kode berbahaya lainnya\n- Melakukan aktivitas yang merusak atau mengganggu layanan Farisium\n\nFarisium berhak menangguhkan atau menghentikan akses pengguna yang melanggar ketentuan ini tanpa pemberitahuan sebelumnya.',
      },
      {
        icon: FileText,
        title: 'Kekayaan Intelektual',
        content: 'Seluruh merek dagang, logo, dan nama layanan yang digunakan di platform Farisium adalah milik Farisium atau pihak ketiga yang sah. Pengguna tidak diizinkan menggunakan, mereproduksi, atau mendistribusikan konten milik Farisium tanpa izin tertulis.\n\nKonten yang dihasilkan pengguna melalui AI Farisium menjadi hak pengguna sesuai dengan ketentuan yang berlaku. Farisium tidak mengklaim kepemilikan atas konten yang dihasilkan pengguna.',
      },
    ],
    lastUpdated: 'Disclaimer ini terakhir diperbarui pada 1 Januari 2026.',
  },
  en: {
    badge: 'Disclaimer',
    heading: 'Farisium Disclaimer',
    description: 'This document contains important information regarding limitations of liability, service usage, and Farisium platform policies.',
    sections: [
      {
        icon: Info,
        title: 'General Information',
        content: 'Farisium is an AI platform providing various creative tools powered by artificial intelligence. All services are provided "as-is" and "as available" without warranties of any kind, either express or implied.\n\nAI-generated content is automated and may not always be accurate, appropriate, or error-free. Users are fully responsible for the use of content generated through the Farisium platform.',
      },
      {
        icon: Shield,
        title: 'Limitation of Liability',
        content: 'Farisium shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from the use or inability to use our services.\n\nFarisium makes no warranty that the services will be uninterrupted, error-free, or secure from third-party attacks. Use of the platform is entirely at the user\'s own risk.',
      },
      {
        icon: AlertTriangle,
        title: 'Responsible Use',
        content: 'Users are prohibited from using the Farisium platform to:\n\n- Create illegal, harmful, threatening, or unlawful content\n- Create content containing violence, hate, discrimination, or harassment\n- Violate the intellectual property rights of others\n- Distribute malware, viruses, or other harmful code\n- Engage in activities that damage or disrupt Farisium services\n\nFarisium reserves the right to suspend or terminate access for users who violate these terms without prior notice.',
      },
      {
        icon: FileText,
        title: 'Intellectual Property',
        content: 'All trademarks, logos, and service names used on the Farisium platform are the property of Farisium or authorized third parties. Users are not permitted to use, reproduce, or distribute Farisium-owned content without written permission.\n\nContent generated by users through Farisium AI becomes the user\'s property in accordance with applicable terms. Farisium does not claim ownership over user-generated content.',
      },
    ],
    lastUpdated: 'This disclaimer was last updated on January 1, 2026.',
  },
}

export default async function DisclaimerPage() {
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
            <Shield className="h-3 w-3" aria-hidden="true" />
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
