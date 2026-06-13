import sharp from 'sharp'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const svg = readFileSync(join(__dirname, 'icon-source.svg'))
const outDir = join(__dirname, '..', 'public')

const sizes = [
  { file: 'pwa-192x192.png', size: 192 },
  { file: 'pwa-512x512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'maskable-icon-512x512.png', size: 512, padding: true },
]

for (const { file, size, padding } of sizes) {
  let image = sharp(svg).resize(size, size)

  if (padding) {
    const inner = Math.round(size * 0.8)
    image = sharp(svg)
      .resize(inner, inner)
      .extend({
        top: Math.round((size - inner) / 2),
        bottom: Math.round((size - inner) / 2),
        left: Math.round((size - inner) / 2),
        right: Math.round((size - inner) / 2),
        background: '#ea580c',
      })
  }

  await image.png().toFile(join(outDir, file))
  console.log(`Generated ${file}`)
}
