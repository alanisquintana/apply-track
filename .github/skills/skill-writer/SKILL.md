---
name: skill-writer
description: Use this skill whenever the user wants to create a new skill, write a SKILL.md file, turn a workflow or set of instructions into a reusable skill, or improve/edit an existing skill (its instructions, structure, or trigger description). Trigger on phrases like "make this a skill", "turn this into a skill", "write a SKILL.md", "package this workflow", or "I want Claude to always do X this way" — even if the word "skill" is never said explicitly. Also use this to review or fix a skill that isn't triggering reliably or is producing inconsistent output.
---

# Skill Writer

A skill for authoring new skills: distilling a workflow, preference, or set of instructions into a well-structured `SKILL.md` that Claude can reliably find and follow later.

## What a skill actually is

A skill is not a script that runs automatically. It's a **reference document** that Claude reads into context when it decides the current task matches. Two things make that decision work:

1. **The description** (in the YAML frontmatter) — this is the only thing Claude sees before deciding to open the skill. If it doesn't match the phrasing and intent of real requests, the skill never triggers, no matter how good the body is.
2. **The body** — the actual instructions, read only after triggering.

Everything in this skill exists to get both of those right.

## Step 1 — Capture intent

Before writing anything, get clear on:

1. **What should this skill enable Claude to do?** (the task, end to end)
2. **When should it trigger?** (what phrases, contexts, or intents should activate it — and just as important, what should NOT trigger it)
3. **What does good output look like?** (format, structure, tone, length)
4. **Are there edge cases, exceptions, or "don't do this" rules** the user has learned the hard way?

If the user is asking to turn an existing conversation or workflow into a skill, mine that conversation first: what steps were taken, in what order, what corrections did the user make, what did the final good output look like? Confirm your extraction with the user before drafting — don't guess silently.

## Step 2 — Write the description first

The description is the highest-leverage part of the whole skill. Write it to be a little "pushy" — err toward over-triggering rather than under-triggering, since the default failure mode is Claude not consulting a skill that would have helped.

- State **both** what the skill does and **when** to use it.
- Include concrete trigger phrases and near-synonyms a real user might type, not just the formal task name.
- Mention edge-case triggers explicitly ("even if the user doesn't say the word X").
- Keep it to roughly 2-4 sentences — it stays in context for every message, so don't bloat it.

Weak: `"Helps format spreadsheets."`
Better: `"Use this skill whenever the user wants to clean up, format, or restructure spreadsheet/Excel/CSV data, including requests to 'make this readable,' fix messy columns, or prep a file for sharing — even if they don't say 'format' explicitly."`

## Step 3 — Structure the body

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description)
│   └── Markdown instructions
└── Bundled resources (optional, only if needed)
    ├── scripts/    — deterministic code the skill can run
    ├── references/ — supporting docs, loaded only when needed
    └── assets/     — templates, files used directly in output
```

Guidelines:
- Keep `SKILL.md` itself under ~500 lines. If it's growing past that, split detail into `references/` and point to it clearly ("see references/foo.md for X").
- Write instructions as a **process**, not a description of the topic — numbered steps, decision points, checklists. Claude following the skill should never have to guess what to do next.
- Include a short example of good input → good output where possible. Concrete examples correct more failure modes than abstract rules do.
- Explicitly call out common mistakes or things to avoid, if the user has specific pet peeves about past outputs.
- Don't restate "when to use this" content in the body — that belongs entirely in the description.

## Step 4 — Review checklist

Before finalizing, check the draft against:

- [ ] Does the description alone (no body) make it obvious when to trigger?
- [ ] Would someone unfamiliar with the task be able to follow the body step by step?
- [ ] Is anything in the body actually a "when to use" statement that should move to the description?
- [ ] Are edge cases and "don't do this" rules explicit, not implied?
- [ ] Is it under 500 lines, with detail pushed to references/ if not?

## Step 5 — Test and iterate

If the user wants rigor: draft 3-5 realistic prompts (including a couple of near-miss prompts that should NOT trigger the skill) and walk through how Claude would handle each one with the skill available. Adjust the description or body based on where it breaks down.

If the user just wants to move fast: skip straight to a working draft, ship it, and refine after it's used a few times in practice.

## Output

Deliver the finished skill as a `SKILL.md` file (plus any bundled resources), ready to save into the user's skills.