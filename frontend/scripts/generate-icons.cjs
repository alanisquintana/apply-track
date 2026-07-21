const sharp = require('sharp')
const { resolve } = require('path')

const iconsDir = resolve(__dirname, '..', 'src-tauri', 'icons')
const svgPath = resolve(iconsDir, 'track-changes.svg')
const pngPath = resolve(iconsDir, 'icon-1024.png')

sharp(svgPath)
  .resize(1024, 1024)
  .png()
  .toFile(pngPath)
  .then(() => console.log('Master icon generated:', pngPath))
  .catch(err => { console.error(err); process.exit(1) })
