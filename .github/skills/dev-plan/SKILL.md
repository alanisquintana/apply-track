---
name: dev-plan
description: Use this skill whenever the user asks to plan, break down, organize, structure, or create a development plan — whether for a single feature ("quebrar essa feature em tarefas", "criar tasks para isso", "como implementar X") or an entire project ("planejar o projeto", "organizar o desenvolvimento", "criar um plano", "definir milestones"). Also triggers when the user starts a new feature without explicit planning and says things like "vamos começar X", "precisamos implementar Y", or "por onde começo". Produces a structured task breakdown with dependencies, order of implementation, and deliverables — not estimates, timelines, or architecture docs.
---
# Development Planning

A skill for breaking down development work — a feature, a milestone, or an entire project — into concrete, ordered tasks. The output is always a dependency-aware task list that answers "what do I build next, and in what order?"

## Purpose

This skill exists to prevent two common failure modes:
1. Starting work without a clear breakdown, leading to context-switching and rework
2. Over-planning with estimates, timelines, or speculative architecture that will change anyway

The output is a **task graph** (serialized as ordered lists): what depends on what, what can be parallelized, and what the natural build order is. No story points, no dates.

## Step 1 — Scope the request

Before writing anything, determine the **level of planning** needed:

| If the user says... | It's a... | Plan scope |
|---|---|---|
| "quebrar essa feature", "tasks para X", "como implementar Y" | **Feature breakdown** | Single feature → atomic tasks |
| "planejar o projeto", "por onde começo", "organizar" | **Project plan** | Multiple milestones → deliverables → tasks |

Ask clarifying questions only if the scope genuinely isn't clear from what they said. Don't ask questions that the user already answered.

If it's a **project plan**, first identify the **natural milestones** (usually: foundation/backend, core UI, integration, polish). If it's a **feature breakdown**, skip milestones and go straight to tasks.

## Step 2 — Map dependencies

For a **project plan**:
1. List the major deliverables/milestones
2. For each milestone, identify the high-level steps
3. Identify which milestones depend on others (the output is an ordered list)

For a **feature breakdown**:
1. List the atomic tasks needed to complete the feature
2. For each task, note if it blocks or is blocked by another task
3. Group tasks that can be done in parallel

Dependency rules:
- **Foundation first**: database schemas → API endpoints → UI components
- **Data flows define order**: if component B consumes data that component A produces, A comes first
- **Parallel branches**: independent features or UI sections can be listed as parallel tracks

## Step 3 — Write the plan

### Format (chat output)

Always start with a header showing the scope:

```
## Plan: [Feature/Project Name]

**Scope:** [Feature breakdown | Project plan]
**Tasks:** [N]
```

Then list the tasks ordered by dependency, grouped into phases or parallel tracks where appropriate:

```
### Phase 1 — [Name]
_Prerequisite for everything below._

1. [ ] Task name — what it involves, key decisions to make
2. [ ] Task name — ...

### Phase 2 — [Name]
_Can start after Phase 1 is done._
_Done in parallel with Phase 3._

3. [ ] Task name — ...
4. [ ] Task name — ...
```

If the plan has parallel tracks, note them clearly:

```
### Track A — [Name]
_Runs in parallel with Track B._

### Track B — [Name]
_Runs in parallel with Track A._

### Merge — [Name]
_Requires both Track A and Track B to be done first._
```

### Format (file output)

If the user wants a file, save as `PLAN.md` in the project root. The file should have the same structure as the chat output, plus:

- A **Prerequisites** section at the top (tools, config, env vars needed before starting)
- A **Verify** item at the end of each phase: "Verify: [check command or test to run]"

### Task writing rules

- **One concern per task.** If a task says "create the form and validate it and style it", split it.
- **Include the "why" for non-obvious dependencies.** If task 5 depends on task 3 even though they seem independent, say why.
- **Frontend tasks should name the component file.** "Create `src/pages/ApplicationsList.tsx`" beats "Create the applications list page".
- **Backend tasks should name the module/endpoint.** "Add `POST /applications` endpoint" beats "Create the create application endpoint".
- **Database tasks should name the table/column.** "Add `applications` table with `company`, `status`, `applied_at` columns" beats "Create the database schema".

## Step 4 — Review

Before delivering, check:

- [ ] Does every task have a clear completion criterion? (Would you know it's done without asking?)
- [ ] Are dependencies explicit where they aren't obvious?
- [ ] Could any task be reasonably split further? (If it takes more than one sitting, split it.)
- [ ] Is there anything in the plan that's actually architecture or design — and should be a separate step, not a task?
- [ ] If a file was created, does it follow the same structure as the chat output?

## Common mistakes to avoid

- **Don't include estimates** (story points, hours, days) — this skill explicitly does not do that
- **Don't prescribe specific libraries or tools** unless the project already uses them — name the concern, not the solution
- **Don't plan UI polish in Phase 1** — visual refinement is always a later phase
- **Don't create tasks for boilerplate** (project init, config files) unless the user asked for setup planning
- **Don't invent milestones that don't map to real deliverables** — every milestone should produce something demonstrable
- **Don't repeat the user's feature description verbatim** — reframe it as tasks, not restate it

## Example

**Input:** "quebrar a feature de adicionar candidatura em tarefas"

**Output:**

```
## Plan: Add Application Feature

**Scope:** Feature breakdown
**Tasks:** 5

### Phase 1 — Database & API
_Foundation: storage first, then endpoint._

1. [ ] Add `applications` migration — columns: `id` (uuid), `company` (text), `role` (text), `status` (enum), `applied_at` (date), `created_at` (timestamptz)
2. [ ] Add `POST /applications` endpoint — accepts `{ company, role, status, applied_at }`, returns created application

### Phase 2 — UI
_Requires the POST endpoint to exist._

3. [ ] Create `ApplicationForm` component — fields for company, role, status dropdown, date picker
4. [ ] Wire form submit to `POST /applications` via the API service (`src/services/applications.ts`)
5. [ ] Show success/error feedback after submission (toast or inline message)
```
