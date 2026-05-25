# SKILL.md Writing Guide

## Required Frontmatter

```yaml
---
name: skill-name           # kebab-case identifier
description: |             # CRITICAL — this is the trigger mechanism
  What this skill does.
  
  ALWAYS use when:         # Be pushy! List all trigger phrases
  - user says "..."
  - task involves "..."
  
  Works in: Claude.ai / Claude Code / Both
version: "1.0"             # increment on every patch
source: "github:author/repo | created | local"
created: "YYYY-MM-DD"
last_improved: "YYYY-MM-DD"
---
```

## Anatomy

```
skill-name/
├── SKILL.md              ← main file (required, <500 lines)
├── references/           ← deep docs, loaded on demand
│   ├── guide.md
│   └── test-cases.md     ← test cases (maintained by skill-manager)
└── scripts/              ← executable helpers
    └── helper.py
```

## Body Structure

1. **One-line purpose** — What this skill does in plain language
2. **Quick Start** — 3-5 steps to accomplish the most common task
3. **Full Workflow** — Step-by-step for all cases
4. **Edge Cases** — Explicitly documented failure modes
5. **Examples** — Input → Output pairs
6. **Error Handling** — What to do when things go wrong

## Description Writing Rules

The `description` field is how Claude decides to USE this skill.

✅ Good — specific, pushy, lists trigger phrases:
```
Use when building Excel/XLSX files. ALWAYS trigger for:
"create spreadsheet", "make excel file", "export to xlsx",
any request producing tabular data as a file.
```

❌ Bad — vague, passive:
```
Helps with spreadsheet tasks.
```

## Progressive Disclosure

- SKILL.md body: core workflow only (<500 lines)
- Heavy docs → `references/` (load with `view` when needed)  
- Executable logic → `scripts/` (run without loading into context)

## Version Tracking

Every time skill is patched by skill-manager:
1. Increment version: `1.0` → `1.1` → `2.0` (major rewrite)
2. Update `last_improved` date
3. Add a `## Changelog` section at bottom with one-line entry
