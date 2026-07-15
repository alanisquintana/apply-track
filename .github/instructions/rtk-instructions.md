---
description: 'RTK (Rust Token Killer) — terminal proxy that filters and compresses command output, saving tokens. Prefix terminal commands with `rtk` after installation is confirmed.'
applyTo: '**'
---

# RTK — Rust Token Killer

RTK is a terminal proxy that intercepts CLI command output and removes noise (progress bars, ANSI codes, verbose logs) before it reaches the model, reducing token consumption without losing relevant information.

This instruction is generic: it applies to any machine, operating system, and company project. No step should depend on the structure of a specific repository.

## Usage Rule

Once installation is confirmed (see Verification below), prefix every terminal command with `rtk`:

```bash
rtk git status
rtk npm install
rtk docker ps
```

Do not nest calls (`rtk rtk <cmd>`) and do not prefix RTK's own meta-commands (`rtk gain`, `rtk init --show`, `rtk --version`, `rtk discover`, `rtk proxy <cmd>`).

If installation has not yet been confirmed on this machine, run the installation flow below first before assuming `rtk` is available.

## Installation Flow (executed by the AI, no manual user steps)

The AI must perform all steps below on its own, including environment detection, verification, installation, and error diagnostics. The user only needs to answer the mode question (Step 2). No other manual action is expected from the person.

### Step 1 — Check if RTK is already installed

Before any installation, run:

```bash
rtk --version
```

- If it returns a valid version: RTK is already installed. Skip to Step 4 (configuration verification) to confirm the integration is active; do not reinstall.
- If the command is not recognized: proceed to Step 2.

### Step 2 — Ask for installation mode

Before installing, ask the user:

> RTK has two installation modes:
>
> - **Standard mode** *(recommended)*: filters and compresses command output, providing good token savings while maintaining readable responses.
> - **Ultra Compact mode**: more aggressive compression and tighter formatting, providing marginal additional gains at the cost of readability.
>
> Which mode would you like to install? Standard or Ultra Compact?

### Step 3 — Install according to the detected operating system

Automatically detect the OS before choosing the command (do not ask the user which OS they are using).

**Windows:**
```powershell
winget install rtk-ai.rtk
```

**macOS:**
```bash
brew install rtk-ai/tap/rtk
```

**Linux (Debian/Ubuntu):**
```bash
sudo apt-get install rtk-ai-rtk
```

After installation, reopen the terminal session (or reload the PATH) and confirm with `rtk --version`. If the binary is still not found, treat as an error and proceed to the Diagnostics section.

Then apply the global integration according to the mode chosen in Step 2:

```bash
# Standard
rtk init --global --auto-patch

# Ultra Compact
rtk init --global --ultra-compact --auto-patch
```

Do not run `rtk init` at the project scope (`.github/`, `AGENTS.md`, or any repository-specific file). The integration must be global, as this instruction serves any person and any project — per-project configuration is out of scope for this standard installation.

If OpenCode is installed on the machine, also install the RTK integration plugin:

```bash
rtk init -g --opencode
```

This registers the RTK plugin in OpenCode so that commands executed through OpenCode are also intercepted and filtered.

### Step 4 — Verify the configuration

```bash
rtk init --show
```

All entries should show as `[ok]`. Expected example:

```text
[ok] Hook: rtk hook (native binary command)
[ok] RTK.md: global integration
[ok] settings: hook configured
```

If any entry is not `[ok]`, proceed to Diagnostics and Correction before reporting success to the user.

### Automatic error diagnostics and correction

If any step above fails, the AI must investigate and fix it on its own before asking the user for any manual action:

- **`rtk` not found after installation**: check if the PATH was updated in the current session; if not, reopen/reload the shell and test again before concluding the installation failed.
- **Package manager installation command failed**: check if the package manager (winget/brew/apt) is available and up to date; report the actual error message without assuming the cause.
- **`rtk init --show` returns an item without `[ok]`**: try re-running `rtk init --global --auto-patch` (or the Ultra Compact variant, as chosen) before escalating to the user.
- Only ask for manual user intervention if automatic correction fails more than once, and in that case explain exactly what was attempted and which error persists.

### Step 5 — Register mandatory RTK usage in the current project's AGENTS.md

After confirming that the global installation is `[ok]` (Step 4), the AI must ensure that the project it is currently working on has the mandatory RTK usage rule registered in its `AGENTS.md`. This is necessary so that any AI working on this project — including in future sessions — knows it must use `rtk` before terminal commands, without relying on the user remembering to ask for it.

Rules for this step:

- Check if `AGENTS.md` already exists in the current repository. If it does not, create a new one with a workflow rules section.
- Check if the RTK rule is already present (search for "RTK" mentions in the file) before adding, to avoid duplication each session.
- Do not assume a fixed section structure: if the file already has a workflow rules or best practices section, insert there; otherwise, add a new section at the end of the file.
- After editing, report to the user, in summary form, what was added or changed in `AGENTS.md` (e.g., "Added section X to AGENTS.md with the mandatory RTK usage rule"). The edit should not remain invisible, as it affects the behavior of any AI working on this repository afterwards.

Template to insert (adapt section names according to the project's structure, but keep the content):

```markdown
### RTK (Rust Token Killer) — Mandatory Use
- RTK is mandatory for all terminal commands, without exception.
- Always prefix commands with `rtk`: `rtk npm install`, `rtk git status`, `rtk docker ps`, etc.
- Do not run native commands without the RTK prefix.
- RTK's own meta-commands (`rtk gain`, `rtk init --show`, `rtk --version`) are exempt and must be used directly, without a duplicated prefix.
- OpenCode must always be invoked with the RTK prefix instead of native commands: use `rtk opencode <command>`, never `opencode <command>` directly.
```

### Step 6 — Validate that the rule is being followed

In a new work session on this project, if the user asks to run a command without mentioning RTK (e.g., "run a build"), the AI should automatically execute it with the `rtk` prefix, having already read the rule in `AGENTS.md`. If this does not happen, it means the rule was not correctly registered in Step 5 and must be verified again.

## Check token savings

```bash
rtk gain
```

Expected output:

```text
RTK Token Savings (Global Scope)
Total commands:    5
Tokens saved:      2,056 (87.9%)
```

For detailed history per command:

```bash
rtk gain --history
```

## Uninstallation

```bash
rtk init --global --uninstall
```

## Scope of this instruction

This instruction covers the global installation of RTK and the registration of the mandatory usage rule in the `AGENTS.md` of the project the AI is currently working on. The `AGENTS.md` edit is automatically performed by the AI as part of the flow (Step 5), but is always reported to the user in summary form — never silently — as it changes the expected behavior of any AI working on this repository afterwards. This instruction does not assume a fixed section structure in `AGENTS.md`: the AI must adapt to whatever already exists in the project's file.
