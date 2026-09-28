import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Guards against Indonesian copy leaking into the `en:` locale block.
 *
 * This has bitten the site twice: a tool card in the homepage Agentic section
 * shipped with `name: 'Foto ke Invoice'` inside the English block, because the
 * Indonesian block above it looked correct and nothing type-checks strings.
 *
 * Only pure-copy modules are scanned. `lib/blog.ts` and the Footer
 * `linkLabels` map are deliberately excluded: the former keys English articles
 * by their Indonesian post id, the latter maps Indonesian labels to English
 * ones, so Indonesian text is the intended content there.
 */
/**
 * Only pure-copy modules that carry a single `en: { ... }` block are scanned.
 * `AgenticAIDropdown.tsx` is excluded on purpose: it declares `{ id, en }` per
 * key, so a wrong locale is structurally impossible there.
 */
const PURE_COPY_FILES = [
  'components/home/AgenticSection.tsx',
  'components/expense/content.ts',
  'app/ai/page.tsx',
  'app/ai/receipt-to-excel/page.tsx',
  'app/ai/image-to-invoice/page.tsx',
  'app/dashboard/page.tsx',
] as const

/** Words that cannot legitimately appear in this site's English UI copy. */
const INDONESIAN_WORDS = [
  'kamu',
  'yang',
  'dan',
  'dengan',
  'untuk',
  'dari',
  'adalah',
  'sudah',
  'belum',
  'hanya',
  'juga',
  'akan',
  'bisa',
  'tidak',
  'lebih',
  'kalau',
  'tapi',
  'gratis',
  'Foto ke',
  'Foto invoice',
  'Ubah foto',
  'Agen AI',
  'Jelajahi',
  'Coba Sekarang',
  'Garis AI',
  'keputusanmu',
  'di-pitch',
  'invoice atau tagihan',
] as const

const WORD_PATTERN = new RegExp(
  `(?<![A-Za-z])(${INDONESIAN_WORDS.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![A-Za-z])`,
  'gi',
)

/** Return the source of the `en: { ... }` block, brace-matched. */
function englishBlock(source: string): string {
  const match = /^\s*en:\s*\{/m.exec(source)
  if (!match) return ''
  let depth = 1
  let i = match.index + match[0].length
  const start = i
  while (i < source.length && depth > 0) {
    if (source[i] === '{') depth++
    else if (source[i] === '}') depth--
    i++
  }
  return source.slice(start, i)
}

test('no Indonesian copy inside en: locale blocks', () => {
  const problems: string[] = []

  for (const relative of PURE_COPY_FILES) {
    const path = join(process.cwd(), relative)
    const source = readFileSync(path, 'utf8')
    const block = englishBlock(source)
    if (!block) {
      problems.push(`${relative}: no \`en: {\` block found — the file shape changed`)
      continue
    }
    const blockStartLine = source.slice(0, source.indexOf(block)).split('\n').length
    for (const found of block.matchAll(WORD_PATTERN)) {
      const line = blockStartLine + block.slice(0, found.index).split('\n').length
      problems.push(`${relative}:${line}  "${found[0]}"`)
    }
  }

  assert.deepEqual(problems, [], `Indonesian text in English blocks:\n  ${problems.join('\n  ')}`)
})
