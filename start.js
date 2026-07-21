const { execSync, spawn } = require('child_process')
const { existsSync, mkdirSync } = require('fs')
const { resolve } = require('path')

const root = __dirname

const backendDir = resolve(root, 'backend')
const frontendDir = resolve(root, 'frontend')

if (!existsSync(resolve(backendDir, 'node_modules'))) {
  console.log('Installing backend dependencies...')
  execSync('npm ci', { cwd: backendDir, stdio: 'inherit' })
}

if (!existsSync(resolve(frontendDir, 'node_modules'))) {
  console.log('Installing frontend dependencies...')
  execSync('npm ci', { cwd: frontendDir, stdio: 'inherit' })
}

const dataDir = resolve(backendDir, 'data')
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

console.log('Building backend...')
execSync('npx nest build', { cwd: backendDir, stdio: 'inherit' })

const backend = spawn('node', ['dist/main.js'], { cwd: backendDir, stdio: 'inherit' })
const frontend = spawn('node', [resolve(frontendDir, 'node_modules/vite/bin/vite.js'), '--port', '3000'], { cwd: frontendDir, stdio: 'inherit' })

console.log('\nBackend:  http://localhost:3001')
console.log('Frontend: http://localhost:3000\n')

process.on('SIGINT', () => {
  backend.kill()
  frontend.kill()
  process.exit()
})

process.on('SIGTERM', () => {
  backend.kill()
  frontend.kill()
  process.exit()
})
