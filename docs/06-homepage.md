# Homepage

## Urutan Section

1. **Hero** — two-column layout: kiri (badge, headline gradient text, deskripsi, CTA, trust indicators), kanan (video demo dengan cursor-reactive ambient light, foreground layers, light streaks, corner accents)
2. **AI Tools** — 6 tool cards (grid 3-col), hover glow + translate-y -0.5 + radial gradient overlay
3. **AI Compute** — full-width card dengan orbit rings animated, 3 feature items, gradient icon containers
4. **Keunggulan (Why Farisium)** — 4 feature cards, subtle ambient background blur
5. **Blog** — 3 article cards, category badges (crimson), hover glow
6. **Partnership** — full-width CTA card, 3 benefit cards, gradient button
7. **FAQ** — accordion dengan chevron rotation, fade-in content
8. **Footer** — 5-column grid (Product, Resources, Company, Legal, Social), logo standalone

## Komponen Kunci

- Semua section: `max-w-7xl`, `px-4 lg:px-6`, `py-16 sm:py-24`
- Card pattern konsisten: `group/*`, `hover:-translate-y-0.5`, `hover:shadow-[0_0_30px_rgba(224,48,78,0.06)]`, `hover:border-frsc-crimson-500/20-30`, radial gradient hover glow overlay
- Hero: spring-based stagger (fadeUpItem), `animated-gradient-text` untuk headline, cursor-reactive `AmbientLight` untuk video container
- Loading: PageLoader dengan fase entering → visible → exiting → hidden, preferensi reduced-motion dihormati

## Animasi

- Hero items: stagger 0.08s, fadeUpItem (opacity 0→1, y 16→0, 500ms, easeEmphasized)
- Gradient text: 5s gradient-shift cycle
- Orbit rings: 10s–20s linear infinite rotation
- Floating purple accent: 10s ambient-float
- Light streaks: 4s shimmer (opacity pulse)
- Card hover: 300ms ease-out, translate -0.5, shadow glow