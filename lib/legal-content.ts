import type { Lang } from '@/lib/translations'

export interface LegalSection {
  title: string
  body: string
}

export interface LegalDocument {
  lastUpdated: string
  sections: LegalSection[]
}

type LegalContentMap = Record<string, Record<Lang, LegalDocument>>

export const legalContent: LegalContentMap = {
  terms: {
    id: {
      lastUpdated: '29 Juni 2026',
      sections: [
        {
          title: 'Penerimaan Ketentuan',
          body: 'Dengan mengakses atau menggunakan platform Farisium ("Farisium", "kami", "kita"), Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat & Ketentuan ini. Jika Anda tidak menyetujui sebagian atau seluruh ketentuan ini, jangan gunakan layanan kami. Kami dapat memperbarui ketentuan ini sewaktu-waktu dan akan memberitahukan perubahan material melalui platform.',
        },
        {
          title: 'Deskripsi Layanan',
          body: 'Farisium adalah platform AI terpadu yang menyediakan berbagai layanan berbasis Artificial Intelligence, termasuk namun tidak terbatas pada Anime Generator, AI Compute, dan layanan terkait lainnya. Layanan diberikan "sebagaimana adanya" (as-is) dan dapat berubah seiring pengembangan platform. Kami berupaya menjaga ketersediaan layanan, namun tidak menjamin akses tanpa gangguan atau bebas dari kesalahan teknis.',
        },
        {
          title: 'Akun & Pendaftaran',
          body: 'Beberapa fitur memerlukan akun Farisium. Anda bertanggung jawab menjaga kerahasiaan kredensial akun dan segala aktivitas yang terjadi dalam akun Anda. Anda wajib memberikan informasi yang akurat, terkini, dan lengkap saat mendaftar. Kami berhak menangguhkan atau menghapus akun jika ditemukan pelanggaran terhadap ketentuan ini atau aktivitas mencurigakan. Satu orang hanya diperbolehkan memiliki satu akun, kecuali mendapat persetujuan eksplisit dari kami.',
        },
        {
          title: 'Penggunaan yang Diizinkan',
          body: 'Anda setuju untuk menggunakan Farisium hanya untuk tujuan yang sah dan sesuai dengan ketentuan ini. Anda tidak diperkenankan: (a) menyalahgunakan layanan untuk aktivitas ilegal; (b) mendistribusikan konten yang melanggar hukum, pornografi non-konsensual, kekerasan ekstrem, atau ujaran kebencian; (c) merekayasa balik, memodifikasi, atau mengeksploitasi platform tanpa izin; (d) melakukan automated scraping tanpa persetujuan tertulis; (e) mengganggu atau membebani infrastruktur kami secara berlebihan. Pelanggaran dapat mengakibatkan pemblokiran akun tanpa pemberitahuan.',
        },
        {
          title: 'Hak Kekayaan Intelektual',
          body: 'Seluruh konten, desain, logo, nama, merek, dan elemen visual Farisium dilindungi oleh hak kekayaan intelektual yang berlaku. Anda tidak diperkenankan menggunakan, mereproduksi, atau mendistribusikan aset Farisium tanpa izin tertulis. Terkait konten yang Anda hasilkan melalui layanan AI Farisium: Anda memiliki hak atas konten yang dihasilkan, namun kami diberikan lisensi non-eksklusif, bebas royalti, dan global untuk menyimpan, menampilkan, dan menganalisis konten tersebut dalam rangka meningkatkan layanan. Kami tidak mengklaim kepemilikan atas input atau output dari layanan AI Anda.',
        },
        {
          title: 'FRSC & Transaksi Virtual',
          body: 'FRSC adalah unit virtual dalam ekosistem Farisium yang digunakan untuk mengakses layanan tertentu. FRSC bukan mata uang digital, bukan instrumen investasi, dan tidak dapat ditukarkan dengan uang tunai, aset kripto, atau nilai finansial lainnya. FRSC tidak memiliki nilai di luar platform Farisium. FRSC yang diperoleh melalui reward, partnership, atau pembelian bersifat final dan tidak dapat dikembalikan. Kami berhak menyesuaikan kebijakan FRSC kapan saja dengan pemberitahuan yang wajar.',
        },
        {
          title: 'Disclaimer & Batasan Tanggung Jawab',
          body: 'Farisium disediakan "sebagaimana adanya" tanpa jaminan tersurat maupun tersirat. Kami tidak bertanggung jawab atas: (a) kerugian langsung atau tidak langsung yang timbul dari penggunaan layanan; (b) konten yang dihasilkan oleh AI yang mungkin tidak sesuai harapan; (c) gangguan teknis, downtime, atau kehilangan data; (d) tindakan pengguna lain. Dalam hal apapun, tanggung jawab kami dibatasi pada jumlah yang Anda bayarkan kepada Farisium dalam 12 bulan terakhir. Beberapa yurisdiksi tidak mengizinkan pembatasan tanggung jawab tertentu, sehingga batasan ini mungkin tidak berlaku bagi Anda.',
        },
        {
          title: 'Penghentian Akses',
          body: 'Kami berhak menghentikan atau menangguhkan akses Anda ke Farisium kapan saja, dengan atau tanpa alasan, termasuk tanpa pemberitahuan jika Anda melanggar ketentuan ini. Setelah penghentian, hak Anda untuk menggunakan layanan berakhir, dan kami dapat menghapus data terkait akun Anda sesuai kebijakan retensi data. Ketentuan yang secara alami harus bertahan setelah penghentian tetap berlaku.',
        },
        {
          title: 'Hukum yang Berlaku',
          body: 'Syarat & Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan melalui musyawarah terlebih dahulu. Jika tidak tercapai kesepakatan, sengketa akan diselesaikan di pengadilan yang berwenang di Indonesia.',
        },
        {
          title: 'Hubungi Kami',
          body: 'Jika Anda memiliki pertanyaan, keluhan, atau masukan mengenai Syarat & Ketentuan ini, silakan hubungi kami melalui email di support@farisium.com atau melalui halaman kontak yang tersedia di platform.',
        },
      ],
    },
    en: {
      lastUpdated: 'June 29, 2026',
      sections: [
        {
          title: 'Acceptance of Terms',
          body: 'By accessing or using the Farisium platform ("Farisium", "we", "us", "our"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to any part of these terms, do not use our services. We may update these terms from time to time and will notify you of material changes through the platform.',
        },
        {
          title: 'Description of Services',
          body: 'Farisium is an integrated AI platform providing various Artificial Intelligence-based services, including but not limited to Anime Generator, AI Compute, and other related services. Services are provided on an "as-is" basis and may evolve as the platform develops. We strive to maintain service availability but do not guarantee uninterrupted or error-free access.',
        },
        {
          title: 'Accounts & Registration',
          body: 'Certain features require a Farisium account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration. We reserve the right to suspend or terminate accounts found in violation of these terms or exhibiting suspicious activity. Each person may hold only one account unless explicitly authorized by us.',
        },
        {
          title: 'Acceptable Use',
          body: 'You agree to use Farisium only for lawful purposes and in accordance with these terms. You may not: (a) misuse services for illegal activities; (b) distribute content that violates laws, including non-consensual pornography, extreme violence, or hate speech; (c) reverse engineer, modify, or exploit the platform without authorization; (d) perform automated scraping without written consent; (e) interfere with or excessively burden our infrastructure. Violations may result in account termination without notice.',
        },
        {
          title: 'Intellectual Property',
          body: 'All content, design, logos, names, trademarks, and visual elements of Farisium are protected by applicable intellectual property laws. You may not use, reproduce, or distribute Farisium assets without written permission. Regarding content you generate through Farisium AI services: you retain ownership of your generated content, and we are granted a non-exclusive, royalty-free, worldwide license to store, display, and analyze such content for service improvement purposes. We do not claim ownership of your AI service inputs or outputs.',
        },
        {
          title: 'FRSC & Virtual Transactions',
          body: 'FRSC is a virtual unit within the Farisium ecosystem used to access certain services. FRSC is not a digital currency, investment instrument, or redeemable for cash, cryptocurrency, or any financial value. FRSC holds no value outside the Farisium platform. FRSC acquired through rewards, partnership, or purchase is final and non-refundable. We reserve the right to adjust FRSC policies at any time with reasonable notice.',
        },
        {
          title: 'Disclaimer & Limitation of Liability',
          body: 'Farisium is provided "as-is" without any express or implied warranties. We shall not be liable for: (a) direct or indirect damages arising from service use; (b) AI-generated content that may not meet expectations; (c) technical disruptions, downtime, or data loss; (d) actions of other users. In no event shall our liability exceed the amount you paid to Farisium in the preceding 12 months. Some jurisdictions do not allow certain liability limitations, so these limitations may not apply to you.',
        },
        {
          title: 'Termination',
          body: 'We reserve the right to terminate or suspend your access to Farisium at any time, with or without cause, including without notice if you violate these terms. Upon termination, your right to use the services ceases immediately, and we may delete associated data in accordance with our data retention policy. Provisions that naturally survive termination shall remain in effect.',
        },
        {
          title: 'Governing Law',
          body: 'These Terms of Service are governed by and construed in accordance with the laws of the Republic of Indonesia. Any disputes arising shall be resolved through mediation first. If no agreement is reached, disputes shall be settled in the competent courts of Indonesia.',
        },
        {
          title: 'Contact Us',
          body: 'If you have questions, complaints, or feedback regarding these Terms of Service, please contact us at support@farisium.com or through the contact page available on the platform.',
        },
      ],
    },
  },

  privacy: {
    id: {
      lastUpdated: '29 Juni 2026',
      sections: [
        {
          title: 'Pendahuluan',
          body: 'Farisium ("kami", "kita") berkomitmen untuk melindungi privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda saat menggunakan platform Farisium. Dengan menggunakan layanan kami, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini. Kebijakan ini berlaku untuk seluruh layanan dalam ekosistem Farisium.',
        },
        {
          title: 'Informasi yang Kami Kumpulkan',
          body: 'Kami mengumpulkan informasi berikut: (a) Informasi Akun: nama, alamat email, dan foto profil saat Anda mendaftar melalui Google Authentication; (b) Informasi Penggunaan: data interaksi dengan layanan AI, riwayat generasi, preferensi, dan pengaturan; (c) Data Teknis: alamat IP, jenis browser, sistem operasi, informasi perangkat, dan cookie; (d) Informasi Reward & FRSC: saldo FRSC, riwayat transaksi, dan klaim reward. Kami tidak mengumpulkan informasi pembayaran secara langsung — seluruh transaksi diproses oleh penyedia pihak ketiga yang terpercaya.',
        },
        {
          title: 'Penggunaan Informasi',
          body: 'Kami menggunakan informasi Anda untuk: (a) menyediakan, memelihara, dan meningkatkan layanan Farisium; (b) memproses generasi AI dan menyampaikan hasilnya kepada Anda; (c) mengelola akun, reward, dan saldo FRSC; (d) mengirimkan pembaruan layanan, notifikasi, dan informasi penting terkait platform; (e) menganalisis penggunaan untuk meningkatkan kualitas dan keamanan layanan; (f) mematuhi kewajiban hukum yang berlaku. Kami tidak menjual informasi pribadi Anda kepada pihak ketiga.',
        },
        {
          title: 'Berbagi & Pengungkapan Data',
          body: 'Kami dapat membagikan informasi Anda dalam situasi berikut: (a) dengan penyedia layanan pihak ketiga yang membantu operasional kami (hosting, analytics, autentikasi) — mereka terikat kontrak untuk menjaga kerahasiaan data; (b) dengan mitra periklanan pihak ketiga (seperti Google AdSense) ketika layanan periklanan diaktifkan — mereka menggunakan cookie dan teknologi serupa untuk menyajikan iklan, tanpa menerima informasi pribadi identitas Anda secara langsung dari kami; (c) jika diwajibkan oleh hukum, peraturan, atau proses hukum yang berlaku; (d) untuk melindungi hak, keamanan, dan properti Farisium atau pengguna lain; (e) sehubungan dengan merger, akuisisi, atau penjualan aset — dengan pemberitahuan kepada Anda. Kami tidak membagikan data generasi AI Anda dengan pihak ketiga untuk tujuan pemasaran.',
        },
        {
          title: 'Retensi Data',
          body: 'Kami menyimpan informasi Anda selama diperlukan untuk menyediakan layanan atau sesuai dengan kewajiban hukum. Data akun disimpan selama akun Anda aktif. Data generasi AI dapat disimpan untuk jangka waktu terbatas demi meningkatkan layanan. Jika Anda menghapus akun, informasi pribadi Anda akan dihapus atau dianonimkan dalam waktu yang wajar, kecuali diwajibkan hukum untuk menyimpannya lebih lama. Gambar yang dihasilkan melalui Anime Generator bersifat sementara dan dapat dihapus setelah sesi berakhir.',
        },
        {
          title: 'Hak & Pilihan Anda',
          body: 'Anda memiliki hak untuk: (a) mengakses informasi pribadi yang kami simpan; (b) memperbaiki data yang tidak akurat; (c) menghapus akun dan data terkait; (d) membatasi atau menolak pemrosesan data tertentu; (e) menarik persetujuan kapan saja tanpa mempengaruhi legalitas pemrosesan sebelumnya; (f) mengekspor data Anda dalam format yang portabel. Untuk menggunakan hak-hak ini, silakan hubungi kami di support@farisium.com. Kami akan merespons permintaan Anda dalam waktu yang wajar sesuai peraturan yang berlaku.',
        },
        {
          title: 'Cookie & Pelacakan',
          body: 'Kami menggunakan cookie dan teknologi serupa untuk: (a) menjaga sesi login Anda; (b) menyimpan preferensi bahasa dan pengaturan; (c) menganalisis penggunaan platform untuk perbaikan layanan; (d) mendukung keamanan platform. Anda dapat mengontrol cookie melalui pengaturan browser atau melalui banner persetujuan cookie yang kami sediakan. Menonaktifkan cookie tertentu dapat mempengaruhi fungsionalitas platform. Rincian lebih lanjut tersedia di Kebijakan Cookie kami.',
        },
        {
          title: 'Iklan & Mitra Periklanan',
          body: 'Ketika layanan periklanan seperti Google AdSense diaktifkan di platform kami, iklan dapat ditampilkan berdasarkan konten halaman atau preferensi Anda. Dalam hal tersebut: (a) Google dan mitra iklan pihak ketiga kami dapat menggunakan cookie dan teknologi serupa untuk menyajikan iklan yang relevan; (b) informasi seperti alamat IP, jenis perangkat, dan data penggunaan dapat diproses untuk tujuan periklanan; (c) Anda dapat mengelola preferensi iklan Anda melalui pengaturan iklan Google di google.com/settings/ads atau melalui banner persetujuan cookie kami. Kami tidak menjual informasi pribadi Anda kepada pengiklan. Saat layanan periklanan belum diaktifkan, tidak ada cookie periklanan yang ditempatkan di perangkat Anda.',
        },
        {
          title: 'Keamanan',
          body: 'Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang wajar untuk melindungi informasi Anda, termasuk enkripsi data dalam transit (TLS/SSL) dan penyimpanan data yang aman. Namun, tidak ada metode transmisi atau penyimpanan elektronik yang 100% aman. Kami tidak dapat menjamin keamanan absolut. Kami akan memberitahukan kepada Anda dan otoritas terkait jika terjadi pelanggaran data yang mempengaruhi informasi pribadi Anda sebagaimana diwajibkan oleh hukum.',
        },
        {
          title: 'Privasi Anak-Anak',
          body: 'Layanan Farisium tidak ditujukan untuk anak-anak di bawah usia 13 tahun (atau usia minimum yang ditetapkan oleh hukum yang berlaku di yurisdiksi Anda). Kami tidak dengan sengaja mengumpulkan informasi pribadi dari anak-anak. Jika kami mengetahui bahwa kami telah mengumpulkan informasi dari anak di bawah usia minimum, kami akan segera menghapus data tersebut. Jika Anda yakin seorang anak telah memberikan informasi pribadi kepada kami, harap hubungi kami.',
        },
        {
          title: 'Perubahan Kebijakan',
          body: 'Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diumumkan melalui platform atau email untuk perubahan material. Kami mendorong Anda untuk meninjau kebijakan ini secara berkala. Penggunaan lanjutan Anda setelah perubahan dianggap sebagai penerimaan terhadap kebijakan yang diperbarui.',
        },
        {
          title: 'Hubungi Kami',
          body: 'Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait Kebijakan Privasi ini atau praktik data kami, silakan hubungi kami di support@farisium.com. Kami berkomitmen untuk merespons dan menyelesaikan masalah privasi Anda tepat waktu.',
        },
      ],
    },
    en: {
      lastUpdated: 'June 29, 2026',
      sections: [
        {
          title: 'Introduction',
          body: 'Farisium ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use the Farisium platform. By using our services, you consent to the collection and use of information in accordance with this policy. This policy applies to all services within the Farisium ecosystem.',
        },
        {
          title: 'Information We Collect',
          body: 'We collect the following information: (a) Account Information: name, email address, and profile photo when you register via Google Authentication; (b) Usage Information: interaction data with AI services, generation history, preferences, and settings; (c) Technical Data: IP address, browser type, operating system, device information, and cookies; (d) Reward & FRSC Information: FRSC balance, transaction history, and reward claims. We do not directly collect payment information — all transactions are processed by trusted third-party providers.',
        },
        {
          title: 'How We Use Your Information',
          body: 'We use your information to: (a) provide, maintain, and improve Farisium services; (b) process AI generations and deliver results to you; (c) manage accounts, rewards, and FRSC balances; (d) send service updates, notifications, and important platform information; (e) analyze usage to improve service quality and security; (f) comply with applicable legal obligations. We do not sell your personal information to third parties.',
        },
        {
          title: 'Data Sharing & Disclosure',
          body: 'We may share your information in the following situations: (a) with third-party service providers who help our operations (hosting, analytics, authentication) — they are contractually bound to maintain data confidentiality; (b) with third-party advertising partners (such as Google AdSense) when advertising services are enabled — they use cookies and similar technologies to serve ads, without receiving your personally identifiable information directly from us; (c) if required by applicable law, regulation, or legal process; (d) to protect the rights, safety, and property of Farisium or other users; (e) in connection with a merger, acquisition, or asset sale — with notice to you. We do not share your AI generation data with third parties for marketing purposes.',
        },
        {
          title: 'Data Retention',
          body: 'We retain your information for as long as necessary to provide services or as required by legal obligations. Account data is retained while your account is active. AI generation data may be stored for a limited period to improve services. If you delete your account, your personal information will be deleted or anonymized within a reasonable timeframe, unless legally required to retain it longer. Images generated through Anime Generator are temporary and may be deleted after the session ends.',
        },
        {
          title: 'Your Rights & Choices',
          body: 'You have the right to: (a) access personal information we hold about you; (b) correct inaccurate data; (c) delete your account and associated data; (d) restrict or object to certain data processing; (e) withdraw consent at any time without affecting the lawfulness of prior processing; (f) export your data in a portable format. To exercise these rights, please contact us at support@farisium.com. We will respond to your request within a reasonable timeframe in accordance with applicable regulations.',
        },
        {
          title: 'Cookies & Tracking',
          body: 'We use cookies and similar technologies to: (a) maintain your login session; (b) store language preferences and settings; (c) analyze platform usage for service improvement; (d) support platform security. You can control cookies through your browser settings or through the cookie consent banner we provide. Disabling certain cookies may affect platform functionality. Further details are available in our Cookie Policy.',
        },
        {
          title: 'Advertising & Third-Party Ad Partners',
          body: 'When advertising services such as Google AdSense are enabled on our platform, ads may be displayed based on page content or your preferences. In such cases: (a) Google and our third-party advertising partners may use cookies and similar technologies to serve relevant ads; (b) information such as IP addresses, device types, and usage data may be processed for advertising purposes; (c) you can manage your advertising preferences through Google ad settings at google.com/settings/ads or through our cookie consent banner. We do not sell your personal information to advertisers. When advertising services have not been enabled, no advertising cookies are placed on your device.',
        },
        {
          title: 'Security',
          body: 'We implement reasonable technical and organizational security measures to protect your information, including data encryption in transit (TLS/SSL) and secure data storage. However, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security. We will notify you and relevant authorities in the event of a data breach affecting your personal information as required by law.',
        },
        {
          title: 'Children\'s Privacy',
          body: 'Farisium services are not intended for children under the age of 13 (or the minimum age set by applicable law in your jurisdiction). We do not knowingly collect personal information from children. If we learn that we have collected information from a child below the minimum age, we will promptly delete that data. If you believe a child has provided us with personal information, please contact us.',
        },
        {
          title: 'Changes to This Policy',
          body: 'We may update this Privacy Policy from time to time. Changes will be announced through the platform or via email for material changes. We encourage you to review this policy periodically. Your continued use after changes constitutes acceptance of the updated policy.',
        },
        {
          title: 'Contact Us',
          body: 'If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at support@farisium.com. We are committed to responding to and resolving your privacy concerns in a timely manner.',
        },
      ],
    },
  },
}

export function getLegalContent(
  type: 'terms' | 'privacy',
  lang: Lang,
): LegalDocument {
  return legalContent[type][lang]
}
