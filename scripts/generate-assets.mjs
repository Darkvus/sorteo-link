import sharp from 'sharp'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pub = (f) => resolve(__dirname, '../public', f)

// Favicon PNG sizes from SVG
const faviconSvg = readFileSync(resolve(__dirname, '../public/favicon.svg'))
for (const size of [16, 32, 48, 96, 180, 192, 512]) {
  await sharp(faviconSvg).resize(size, size).png().toFile(pub(`favicon-${size}.png`))
  console.log(`✓ favicon-${size}.png`)
}

// apple-touch-icon
await sharp(faviconSvg).resize(180, 180).png().toFile(pub('apple-touch-icon.png'))
console.log('✓ apple-touch-icon.png')

// OG image
const ogSvg = readFileSync(resolve(__dirname, 'og-image.svg'))
await sharp(ogSvg).resize(1200, 630).png({ quality: 95 }).toFile(pub('og-image.png'))
console.log('✓ og-image.png (1200x630)')
