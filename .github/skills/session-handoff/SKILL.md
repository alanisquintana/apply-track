---
name: session-handoff
description: Use this skill whenever the user asks to write a handoff, summarize where a work session left off, prepare notes for continuing work later or in a new conversation, wrap up a project session, or brief a teammate (or their future self) on current progress. Trigger on phrases like "write a handoff", "summarize where we are", "prep notes for next time", "hand this off", "catch me up on this later", or when a long working session is clearly wrapping up. Produces a structured markdown document capturing current state, decisions made, and next steps — not a full transcript.
---

# Session Handoff

A skill for turning a working session (coding, planning, research, writing) into a concise handoff document — something a person, a teammate, or a future Claude conversation can read cold and immediately know where things stand.

## Purpose

A handoff is not a transcript and not a status report to management. Its only job is to answer, for someone starting fresh:
**"What's true right now, why, and what should happen next?"**

Optimize for someone picking this up with zero memory of the session — be concrete, skip the play-by-play.

## Step 1 — Gather the material

Before writing, scan the session (or ask the user) for:

- What was the original goal or request?
- What was actually built, decided, or produced? (files created/changed, decisions locked in, options rejected and why)
- What's still unresolved, in progress, or explicitly deferred?
- Are there blockers, open questions, or things the user needs to decide before work continues?
- What's the very next concrete action?

If context is thin (e.g. the user just says "write a handoff" with little else), ask only for what's missing rather than guessing — but don't ask more than one or two questions if the session itself already answers most of this.

## Step 2 — Structure the document

Use this template as a default, adapting sections to fit the type of work (code project vs. writing vs. research vs. planning). Omit sections that don't apply rather than leaving them empty.

```markdown
# Handoff: [Project/Task Name]
_[Date] — [one-line current status, e.g. "Login screen done, backend not started"]_

## Goal
What this work is for, in 1-2 sentences.

## Current state
What exists right now. Be concrete: files, features, decisions — not narrative.

## Key decisions
- Decision — why it was made (and what alternative was rejected, if relevant)
- ...

## Open questions
- Anything unresolved that blocks or shapes next steps.

## Next steps
1. The immediate next action, specific enough to start on without re-reading everything else.
2. ...

## Resume instructions
How to pick this back up: what to read first, what commands to run, what to check.
```

## Step 3 — Writing rules

- **Concrete over narrative.** "Login screen built with MUI, theme in `src/theme.ts`" beats "We worked on the login screen and made good progress."
- **Decisions need a reason.** Don't just log what was decided — one clause on *why*, so it isn't re-litigated later.
- **Next steps are actions, not topics.** "Build the `auth-service` NestJS module with a `/login` endpoint" beats "Backend."
- **Cut anything that doesn't change what the reader does next.** If a detail doesn't affect a decision or an action, leave it out.
- **No apology, no meta-commentary about the session itself** ("we spent a while figuring out..."). State the outcome, not the process of getting there.

## Step 4 — Deliver

Default to a markdown file the user can save alongside the project (e.g. `HANDOFF.md` or `handoff-YYYY-MM-DD.md`). If the handoff is for pasting into a new chat rather than saving as a file, keep it in-conversation instead and skip file creation.

## Example

**Input context:** a session where a login screen was built in React + MUI, theme decisions were made, and NestJS backend work hasn't started.

**Good output excerpt:**

```markdown
## Current state
Login screen complete (`src/pages/Login.tsx`), using a custom MUI theme
(`src/theme.ts`) — ink navy + brass gold palette, Fraunces/Inter fonts.
Split-panel layout, no routing yet (App.tsx renders Login directly).

## Next steps
1. Add React Router; Login becomes a route instead of the default render.
2. Scaffold `auth-service` in NestJS with a `/login` endpoint.
3. Wire the login form's onSubmit to call `auth-service`.
```

Notice: no mention of how many messages it took, no restating the user's original request verbatim, no vague "made progress" language.