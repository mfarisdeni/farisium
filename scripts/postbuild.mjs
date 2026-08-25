import { readFileSync, existsSync, symlinkSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

let hash = null
const chunksDir = resolve(root, '.next', 'server', 'chunks')
const files = ['[root-of-the-server]__075snhw._.js', '[root-of-the-server]__0e~oae7._.js',
  '[root-of-the-server]__0g-mpl_._.js', '[root-of-the-server]__0wx5qcu._.js']

for (const file of files) {
  const fp = resolve(chunksDir, file)
  if (!existsSync(fp)) continue
  const content = readFileSync(fp, 'utf-8')
  const m = content.match(/firebase-admin-([a-f0-9]+)\/app/)
  if (m) { hash = m[1]; break }
}

if (!hash) {
  console.log('No hashed firebase-admin module found — skipping symlink')
  process.exit(0)
}

const hashed = `firebase-admin-${hash}`
const targetDir = 'firebase-admin'

function linkDir(parent) {
  const src = resolve(parent, targetDir)
  const dest = resolve(parent, hashed)
  if (!existsSync(src)) return false
  if (existsSync(dest)) { console.log(`Already exists: ${dest}`); return true }
  mkdirSync(dirname(dest), { recursive: true })
  symlinkSync(src, dest, 'junction')
  console.log(`Created symlink: ${dest} -> ${src}`)
  return true
}

// Create in root node_modules (for development / custom server)
linkDir(resolve(root, 'node_modules'))

// Create in standalone node_modules (for production deployment)
linkDir(resolve(root, '.next', 'standalone', 'node_modules'))

console.log(`Postbuild done — linked ${hashed} -> ${targetDir}`)
