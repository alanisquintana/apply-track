.PHONY: up dev tauri-dev tauri-build seed test

up:
	node start.js

dev:
	node start.js

tauri-dev:
	cd frontend && npm run tauri:dev

tauri-build:
	cd frontend && npm run tauri:build

seed:
	cd backend && npx ts-node src/seed.ts

test:
	cd backend && npm run test:e2e
