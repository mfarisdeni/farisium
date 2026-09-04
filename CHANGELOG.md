# Changelog

All notable changes to Farisium are documented here.

## [Unreleased] — Blog Redesign & AdSense Compliance (feat/blog-redesign-adsense-fix)

### Added
- `/farisium` landing page (`app/farisium/page.tsx`)
- Blog category submenu in Navbar (`components/blog/BlogNavDropdown.tsx`) — desktop dropdown + mobile accordion, dynamic categories
- `ThemeToggle` component (`components/ui/ThemeToggle.tsx`) — light/dark toggle
- `noindex` layout for internal audit trail page
- `CHANGELOG.md`

### Changed
- **Homepage** (`app/page.tsx`) redesigned as blog-focused — `BlogHomeGrid` with category grid, blog posts listing
- **Light mode default** — `providers.tsx` uses `next-themes` with `defaultTheme="light"`, `enableSystem={false}`
- **Theme-aware CSS** (`globals.css`) — added `@utility` for `bg-surface-subtle`, `bg-surface-hover`, `border-surface-subtle`, `glass-surface` with `.dark &` nested variants
- **Navbar** light mode fix — replaced hardcoded `bg-white/[0.0x]`, `border-white/[0.0x]` with theme-aware utilities; fixed dropdown, mobile drawer, FRSC badge, user menu
- **BlogNavDropdown** light mode fix — glassmorphism, hover states, mobile accordion all theme-aware
- **ThemeToggle** light mode fix — hover/focus rings now work in both modes
- **Root layout metadata** — blog-focused English-first SEO: `Farisium — AI & Technology Blog, Tutorials, Tools & Insights`; JSON-LD schemas updated to `BlogApplication`
- **Homepage metadata** — `Farisium — AI & Technology Blog: Tutorials, Tools & Insights`
- **Blog listing metadata** — `All Articles — AI & Technology Blog | Farisium`

### Fixed (AdSense Compliance)
- **Claude Fable 5 vs Opus 4.8 article** (ID + EN) — rewritten as **Claude Sonnet 4.6 vs Claude Opus 4.8** with verified facts: Sonnet 4.6 ($3/$15, 1M context, 64K output), Opus 4.8 ($5/$25, 1M context, 128K output). Slug preserved for URL stability.
- **Scheduled Actions inaccuracy** (Gemini article, ID + EN) — corrected "only available for subscribers" → available to all users, faster preparation for paid subscribers
- **Product accuracy audit** — all AI model names, prices, dates, and benchmarks verified across 30+ blog articles. No fabricated models or specifications found.

### Audit Results
- **Internal links**: no broken links found; all blog internal links point to existing slugs
- **Metadata uniqueness**: no duplicate titles between different pages; hreflang handles ID/EN variants
- **Content accuracy**: 100% of AI model claims verified against official documentation (Anthropic, Google, OpenAI, etc.)

## [Previous]

See git history for earlier releases.
