# Skill Registry — repo-dashboard

Generated: 2026-04-17
Project: repo-dashboard (Next.js monorepo — greenfield)

This registry is consumed by the SDD orchestrator. It caches all user/project skills + project conventions so sub-agent prompts can inject compact rules without re-scanning.

---

## User Skills (triggers)

| Skill | Path | Trigger |
|-------|------|---------|
| v0-ux | ~/.claude/skills/v0-ux/SKILL.md | UI work in Next.js/Tailwind/shadcn: "design a screen", "build a component", "mockup", "UI for...", "make a page", convert sketch/wireframe to TSX |
| branch-pr | ~/.claude/skills/branch-pr/SKILL.md | Creating a pull request, opening a PR, preparing changes for review |
| issue-creation | ~/.claude/skills/issue-creation/SKILL.md | Creating a GitHub issue, reporting a bug, requesting a feature |
| judgment-day | ~/.claude/skills/judgment-day/SKILL.md | "judgment day", "review adversarial", "dual review", "juzgar", "que lo juzguen" |
| skill-creator | ~/.claude/skills/skill-creator/SKILL.md | Create a new skill, add agent instructions, document patterns for AI |
| skill-registry | ~/.claude/skills/skill-registry/SKILL.md | "update skills", "skill registry", "actualizar skills", after installing/removing skills |
| go-testing | ~/.claude/skills/go-testing/SKILL.md | Go tests, teatest, Bubbletea TUI testing *(not applicable to this project)* |
| spring-boot-test-coverage | ~/.claude/skills/spring-boot-test-coverage/SKILL.md | Spring Boot test coverage *(not applicable)* |

SDD phase skills (sdd-init, sdd-explore, sdd-propose, sdd-spec, sdd-design, sdd-tasks, sdd-apply, sdd-verify, sdd-archive, sdd-onboard) are orchestrator-launched — not user-invoked directly.

---

## Project Conventions

No project-level convention files found yet (`CLAUDE.md`, `agents.md`, `AGENTS.md`, `.cursorrules`, `GEMINI.md`, `copilot-instructions.md` — none present).

User-level CLAUDE.md (global) applies:
- Path: `~/.claude/CLAUDE.md`
- Contents: Agent Teams Lite orchestrator rules, Engram protocol, language/tone rules, MANDATORY no-Explore-agent-when-tokensave rule, tools preferences (bat/rg/fd/sd/eza), conventional commits with no AI attribution, never build after changes.

---

## Compact Rules (for sub-agent injection)

### Universal (inject on ALL sub-agents)

```
## Project Standards (auto-resolved)

### Workflow conventions
- Conventional commits only. NEVER add "Co-Authored-By" or AI attribution.
- Never build after changes (user runs builds, not you).
- Prefer bat/rg/fd/sd/eza over cat/grep/find/sed/ls.
- When you make a decision, fix a bug, or learn something non-obvious: call `mem_save` with project: "repo-dashboard".
- Language: Spanish input → Rioplatense voseo (dale, bien, se entiende, buenísimo, loco). English → same warm/direct tone.
```

### Next.js / UI work (inject when sub-agent touches *.tsx, *.jsx, /app, /components, /pages, tailwind.config.*)

```
## UI Project Standards

- Stack: Next.js monorepo (to be bootstrapped). Assume App Router unless the proposal says otherwise.
- Design source of truth: `repodashboard/project/Tech Lead Dashboard Wireframes.html` — READ IT IN FULL before building screens.
- Re-create wireframes pixel-perfect in React/Tailwind. Do NOT copy prototype's internal structure verbatim; match the visual output.
- Theme palette: Kanagawa Wave (dark) + Kanagawa Lotus (light). Colors are already defined as CSS vars in the wireframe.
- Typography: Space Grotesk (hand), JetBrains Mono (mono), Orbitron (display).
- When generating UI → use v0-ux skill (v0 API) instead of writing TSX from scratch. Claude is the integrator, v0 is the generator.
- Do NOT render HTML prototypes in a browser or screenshot them. Read HTML/CSS directly.
```

### PR creation (inject on branch-pr or when creating PRs)

```
## PR Standards
- Follow ~/.claude/skills/branch-pr/SKILL.md workflow (issue-first).
- Conventional commit titles. No AI attribution in commit or PR body.
```

### Issue creation (inject when creating GitHub issues)

```
## Issue Standards
- Follow ~/.claude/skills/issue-creation/SKILL.md workflow.
```

### Review (inject on judgment-day / code review)

```
## Review Standards
- Use judgment-day protocol for adversarial review when stakes are high.
- Two blind judges, synthesize, fix, re-judge. Max 2 iterations before escalation.
```

---

## Notes

- Registry is **mode-independent** — regenerate whenever user adds/removes skills or after `sdd-init` re-run.
- Also persisted to engram under topic_key `skill-registry` (project `repo-dashboard`).
