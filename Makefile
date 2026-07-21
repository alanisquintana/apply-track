.PHONY: up seed test

up:
	node start.js

seed:
	cd backend && npx ts-node src/seed.ts

test:
	cd backend && npm run test:e2e
