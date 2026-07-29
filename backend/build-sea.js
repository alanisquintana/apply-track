const { execSync } = require('child_process')
const { copyFileSync, cpSync, existsSync, mkdirSync, rmSync } = require('fs')
const { resolve, join } = require('path')

const root = resolve(__dirname, '..')
const backendDir = __dirname
const srcTauriBin = resolve(root, 'frontend', 'src-tauri', 'binaries')

const TARGET = process.env.CARGO_BUILD_TARGET || 'x86_64-pc-windows-msvc'

if (!existsSync(srcTauriBin)) {
  mkdirSync(srcTauriBin, { recursive: true })
}

// 1. Build NestJS
console.log('Building NestJS backend...')
execSync('npx nest build', { cwd: backendDir, stdio: 'inherit' })

// 2. Bundle with esbuild
console.log('Bundling with esbuild...')
execSync(
  'npx esbuild dist/main.js --bundle --platform=node --outfile=dist/bundle.js ' +
  '--external:better-sqlite3 --external:@nestjs/websockets --external:@nestjs/microservices --external:class-transformer/storage',
  { cwd: backendDir, stdio: 'inherit' }
)

// 3. Create SEA config
console.log('Creating SEA blob...')
const seaConfig = {
  main: 'dist/bundle.js',
  output: 'dist/sea-prep.blob',
  disableExperimentalSEAWarning: true,
  useSnapshot: false,
  useCodeCache: false,
}
require('fs').writeFileSync(
  resolve(backendDir, 'dist', 'sea-config.json'),
  JSON.stringify(seaConfig)
)

execSync('node --experimental-sea-config dist/sea-config.json', { cwd: backendDir, stdio: 'inherit' })

// 4. Create executable
console.log('Creating backend executable...')
const nodeBin = process.execPath
const outName = `backend-${TARGET}${process.platform === 'win32' ? '.exe' : ''}`
const outPath = resolve(srcTauriBin, outName)

copyFileSync(nodeBin, outPath)

try {
  execSync(
    `npx postject "${outPath}" NODE_SEA_BLOB dist/sea-prep.blob ` +
    '--sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2',
    { cwd: backendDir, stdio: 'inherit' }
  )
} catch {
  // postject might not be installed, try without npx
  execSync(
    `node -e "require('postject')" "${outPath}" NODE_SEA_BLOB dist/sea-prep.blob ` +
    '--sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2',
    { cwd: backendDir, stdio: 'inherit' }
  )
}

// 5. Copy native modules for better-sqlite3
// The SEA binary bundles JS but native .node files must be available at runtime
console.log('Copying native modules...')
const targetNodeModules = resolve(srcTauriBin, 'node_modules')
rmSync(targetNodeModules, { recursive: true, force: true })
mkdirSync(targetNodeModules, { recursive: true })

function copyModule(name) {
  const src = resolve(backendDir, 'node_modules', name)
  const dest = resolve(targetNodeModules, name)
  if (existsSync(src)) {
    cpSync(src, dest, { recursive: true, force: true })
    console.log(`  ✓ ${name}`)
  } else {
    console.warn(`  ⚠ ${name} not found`)
  }
}

copyModule('better-sqlite3')
copyModule('bindings')
copyModule('file-uri-to-path')

console.log(`\nBackend executable created at: ${outPath}`)
