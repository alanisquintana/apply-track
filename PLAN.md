# Plan: ApplyTrack — Web Application

**Scope:** Project plan
**Milestones:** 5 (4 completed)
**Tasks:** 30 (24 completed)

A **web application** (React SPA + NestJS REST API + PostgreSQL) for tracking job applications. Accessed entirely through the browser at `http://localhost:3000`.

## Prerequisites

- Node.js 20+ (for local dev; Docker will also work)
- Docker + Docker Compose (for containerized run)
- npm or yarn
- PostgreSQL 16+ (if running outside Docker)

---

## Milestone 1 — Project Scaffolding ✅

_Foundation: Docker, Makefile, project init. Everything else depends on this._

1. [x] Create `docker-compose.yml` — define services for `postgres`, `backend`, `frontend` with ports (5432, 3001, 3000), volumes, and a shared network
2. [x] Create `.env.example` with all environment variables
3. [x] Create `Makefile` with targets: `up`, `down`, `restart`, `logs`, `migrate`, `seed`, `clean`, `test`
4. [x] Scaffold NestJS backend — `rtk npx @nestjs/cli new backend --package-manager npm`, deps installed (`@nestjs/typeorm`, `typeorm`, `pg`, `class-validator`, `class-transformer`), boilerplate stripped
5. [x] Scaffold React + TypeScript frontend — `rtk npm create vite@latest frontend -- --template react-ts`, boilerplate stripped, placeholder page set

**Verify:** `make up` starts all three containers without errors; `http://localhost:3000` and `http://localhost:3001` respond.

---

## Milestone 2 — Database & API ✅

_Backend: data layer, CRUD endpoints, validation._

6. [x] Configure TypeORM in NestJS — `DatabaseModule` with `forRootAsync` using `DATABASE_URL`, `synchronize: true` for dev
7. [x] Create `Application` entity — `id` (uuid PK), `company`, `role`, `status` (enum: applied/interviewing/offer/rejected), `appliedAt` (date), `createdAt`, `updatedAt` (timestamptz)
8. [x] Create `ApplicationsModule` with `ApplicationsService` (findAll, findOne, create, update, remove) and `ApplicationsController` (GET, POST, PATCH, DELETE)
9. [x] Add DTOs — `CreateApplicationDto` with validation decorators, `UpdateApplicationDto` extending PartialType
10. [x] Validation pipe já configurado em `main.ts`; controller usa `@HttpCode(HttpStatus.NO_CONTENT)` para DELETE (204), service lança `NotFoundException` (404)
11. [x] Rodar com Docker + PostgreSQL para testar — backend conecta e CRUD funcional via Docker (porta 5433 devido a PostgreSQL local concorrente)

**Verify:** `curl -X POST http://localhost:3001/api/applications ...` → 201 + record; GET list → 200 (requer PostgreSQL rodando).

---

## Milestone 3 — Core Frontend ✅

_UI: list, create, edit, delete applications._

12. [x] Set up project structure — `src/pages/`, `src/components/`, `src/services/`, `src/types/`; install `react-router-dom` and route setup (`/` for list)
13. [x] Create types in `src/types/application.ts` — `Application`, `CreateApplicationPayload`, `UpdateApplicationPayload`
14. [x] Create API service in `src/services/applications.ts` — `getAll`, `getById`, `create`, `update`, `remove` via `fetch`
15. [x] Create `ApplicationsList` page — fetches all on mount, table with company/role/status/date/actions, empty state, loading, error handling
16. [x] Create `ApplicationForm` component — controlled form (company, role, status select, date), reuses for create and edit
17. [x] Wire create flow — "Add Application" button opens form, calls `POST /api/applications`, refreshes list
18. [x] Wire edit flow — "Edit" button opens form pre-filled, calls `PATCH /api/applications/:id`, refreshes list
19. [x] Wire delete flow — "Delete" button confirms then calls `DELETE /api/applications/:id`

**Verify:** Full CRUD cycle works in the browser (requer PostgreSQL rodando). Frontend servido em `http://localhost:3000` com proxy `/api` → `localhost:3001`.

---

## Milestone 4 — Polish & UX ✅

_Error handling, empty states, loading states, visual refinement._

20. [x] Add loading spinner/skeleton while fetching the application list; disable form buttons while submitting
21. [x] Add empty state when no applications exist — "No applications yet. Add your first one!" with a CTA button
22. [x] Add error handling — toast for API failures (network error, validation error), wrap API calls in try/catch
23. [x] Style status badges with distinct colors — Applied (gray), Interviewing (blue), Offer (green), Rejected (red)
24. [x] Add confirmation dialog for delete action — custom modal with overlay, Escape to close, click-outside to close

---

## Milestone 5 — Docker & Dev Experience

_Containerization, tests, seed data, docs._

25. [ ] Create `backend/Dockerfile` — multi-stage build: `node:20-alpine`, install deps, build, run with `node dist/main`
26. [ ] Create `frontend/Dockerfile` — multi-stage build: `node:20-alpine`, build static files, serve with `nginx:alpine` (or use dev server for simplicity)
27. [ ] Wire `docker-compose.yml` to build from Dockerfiles; set `depends_on` so backend waits for postgres and frontend waits for backend
28. [ ] Add `make seed` script — a NestJS command or SQL script that inserts 3-5 sample applications
29. [ ] Run `make test` — add basic NestJS e2e test for `POST /applications` (create + validate response shape)
30. [ ] Update `README.md` — verify the existing README matches the final setup; update paths if needed

**Verify:** `make clean && make up` from scratch builds all images, runs migrations, and the app is fully functional at `localhost:3000`; `make test` passes; `make seed` populates sample data.
