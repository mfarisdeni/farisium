import type { Lang } from '@/lib/translations'

interface Props {
  lang?: Lang
}

export function DiscordSection({ lang = 'id' }: Props) {
  const labels = {
    id: {
      title: 'Komunitas Farisium',
      description: 'Bergabung dengan server Discord Farisium. Bagikan hasil karyamu, temukan prompt baru, dan terhubung dengan kreator lain.',
      cta: 'Gabung Discord',
    },
    en: {
      title: 'Farisium Community',
      description: 'Join the Farisium Discord server. Share your creations, discover new prompts, and connect with other creators.',
      cta: 'Join Discord',
    },
  }

  const label = labels[lang] ?? labels.id

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-4">
      <a
        href="https://discord.gg/SCDFEbRpjm"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-3xl border border-frsc-purple-400/20 bg-gradient-to-r from-frsc-purple-800/20 via-frsc-purple-600/10 to-frsc-purple-800/20 p-5 backdrop-blur-xl transition-all duration-300 hover:border-frsc-purple-400/40 hover:shadow-[0_0_40px_rgba(100,47,127,0.25)]"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5865F2] shadow-[0_0_30px_rgba(88,101,242,0.45)]">
            <svg
              className="h-7 w-7 text-white"
              viewBox="0 0 127.14 96.36"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,56.6,122.09,32.65,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
            </svg>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-frsc-white-bright">
              {label.title}
            </h3>
            <p className="text-sm text-frsc-text-200">
              {label.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-frsc-white-bright transition-all group-hover:bg-white/10">
          {label.cta} &rarr;
        </div>
      </a>
    </section>
  )
}
