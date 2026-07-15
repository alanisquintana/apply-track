.PHONY: up down restart logs migrate seed clean test

up:
	docker compose up -d

down:
	docker compose down

restart: down up

logs:
	docker compose logs -f

migrate:
	cd backend && npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts

seed:
	cd backend && npx ts-node src/seed.ts

clean:
	docker compose down -v

test:
	cd backend && npm test
