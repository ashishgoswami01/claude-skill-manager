---
name: skill-manager
description: |
  Super Manager meta-skill that automatically finds, fetches, creates, and improves Claude skills on demand.
  
  ALWAYS use this skill when:
  - User asks to "add a skill", "install a skill", "find a skill for X", or "teach yourself to do X"
  - A task would benefit from a skill that isn't currently loaded
  - User says "learn how to do X" or "get better at X"
  - A skill execution fails or produces poor output and needs improvement
  - User says "search GitHub for a skill", "fetch skill from GitHub", or pastes a GitHub skill URL
  - Any request where Claude says "I don't have a skill for that"
  
  Works in BOTH Claude.ai (/mnt/skills/) AND Claude Code (~/.claude/skills/).
  Auto-detects environment and installs to correct path.
  Searches GitHub skill registries, fetches SKILL.md files, creates new skills via web research,
  and automatically improves existing skills after execution via feedback loop.
  
  This is the self-growing brain of Claude's skill system. Use aggressively.
---

# Skill Manager — Super Manager

You are the orchestrator of Claude's skill system. Your job: make sure the right skill exists for every task, and that all skills keep getting better.

## Environment Detection

First, always detect which environment you're in:

```
Claude.ai  → skills live at /mnt/skills/user/   (writeable)
Claude Code → skills live at ~/.claude/skills/   (writeable)
Both?       → install to both paths
```

```bash
# Detect environment
if [ -d "/mnt/skills" ]; then CLAUDEAI=true; SKILLS_PATH="/mnt/skills/user"; fi
if [ -d "$HOME/.claude/skills" ]; then CLAUDECODE=true; SKILLS_PATH="$HOME/.claude/skills"; fi
```

---

## The 3-Layer Loop

Every skill request flows through 3 layers. Work through them in order.

```
┌─────────────────────────────────────────┐
│  LAYER 1: DISCOVER                      │
│  Check local → Search GitHub → Web      │
├─────────────────────────────────────────┤
│  LAYER 2: DEPLOY                        │
│  Fetch → Validate → Install → Activate  │
├─────────────────────────────────────────┤
│  LAYER 3: EVOLVE                        │
│  Execute → Rate → Patch → Log           │
└─────────────────────────────────────────┘
```

---

## LAYER 1: DISCOVER

### Step 1A — Check Local First

```bash
# Claude.ai
ls /mnt/skills/user/
ls /mnt/skills/public/

# Claude Code
ls ~/.claude/skills/
```

Read `SKILL.md` descriptions to check if any existing skill covers the request.  
**If found → skip to LAYER 2 (just activate it).**

### Step 1B — Search GitHub

If not found locally, search GitHub for community skills.

Use `web_search` with these queries in order:

```
1. "github.com claude skill [task-keyword] SKILL.md"
2. "npx skills add [task-keyword] claude code"  
3. "site:github.com claude-code skill [task-keyword]"
4. "[task-keyword] agent skill anthropic SKILL.md"
```

**Known registries to check:**
- `https://github.com/topics/claude-skills`
- `https://skillsllm.com/skill/[name]`
- `https://explainx.ai/skills/`
- `npx skills add [author/repo]` pattern

For each promising result, fetch the raw SKILL.md:
```
https://raw.githubusercontent.com/[author]/[repo]/main/SKILL.md
```
or
```
https://raw.githubusercontent.com/[author]/[repo]/main/skills/[name]/SKILL.md
```

**Evaluate fetched skill:**
- Does `description` match the task? 
- Is it for Claude Code / Claude.ai compatible?
- Last updated recently? (check repo stars/activity)

**If good match found → proceed to LAYER 2.**

### Step 1C — Create New Skill (Web Research Mode)

If no suitable skill found anywhere, CREATE one. Read `/mnt/skills/examples/skill-creator/SKILL.md` for full guidance, then:

1. Use `web_search` to research:
   - Best practices for the task domain
   - Tools / libraries / APIs involved
   - Edge cases and failure modes
   - Example workflows (GitHub, docs, blogs)

2. Research queries pattern:
```
"best way to [task] with Claude AI"
"[task] workflow step by step guide 2025"
"[task] common mistakes how to avoid"
```

3. Draft SKILL.md using the Skill Writing Guide (see `references/writing-guide.md`)

4. Save to skill path (see LAYER 2 for paths)

---

## LAYER 2: DEPLOY

### Install to Correct Path

```bash
# Claude.ai install
SKILL_DIR="/mnt/skills/user/${SKILL_NAME}"
mkdir -p "$SKILL_DIR"
# write SKILL.md + any bundled assets

# Claude Code install  
SKILL_DIR="$HOME/.claude/skills/${SKILL_NAME}"
mkdir -p "$SKILL_DIR"
# write SKILL.md + any bundled assets

# Both environments — install to both paths
```

### Validate Before Activating

Before marking a skill as active, check:
- [ ] YAML frontmatter has `name` and `description`
- [ ] `description` is clear enough to trigger correctly
- [ ] No broken file references (scripts, assets)
- [ ] Compatible with current environment (bash vs python availability)

### Activation Confirmation

Tell the user:
```
✅ Skill installed: [skill-name]
📍 Path: [install-path]  
🔧 Source: [local | github: repo/name | created-fresh]
🎯 Triggers when: [copy description trigger phrases]
```

---

## LAYER 3: EVOLVE (Auto-Improve)

This is the self-learning layer. After EVERY skill execution, run the improve loop.

### Step 3A — Post-Execution Rating

After a skill produces output, silently evaluate:

| Criterion | Weight |
|-----------|--------|
| Task completed correctly | 40% |
| Output format matched expectation | 20% |
| No unnecessary steps taken | 20% |
| Edge cases handled | 20% |

Compute score 1–10.

- **Score ≥ 8** → Log success. No changes needed.
- **Score 5–7** → Minor patch. Fix the weak section only.
- **Score < 5** → Major patch. Research + rewrite failing sections.

### Step 3B — Patch the Skill

For minor patches:
```
1. Identify which section of SKILL.md caused the failure
2. Add a "⚠️ Known Edge Case" note to that section
3. Add corrective instruction inline
4. Increment skill version in frontmatter
```

For major patches:
```
1. Run web_search on what went wrong
2. Find better approach / missing step
3. Rewrite failing section(s)
4. Add test case to references/test-cases.md
5. Increment skill version
```

### Step 3C — Update Skill Log

Append to `/mnt/skills/user/skill-manager/skill-log.jsonl` (Claude.ai)  
or `~/.claude/skills/skill-manager/skill-log.jsonl` (Claude Code):

```json
{
  "timestamp": "ISO-8601",
  "skill": "skill-name",
  "task": "brief task description",
  "source": "local|github|created",
  "score": 8,
  "patched": false,
  "notes": "what worked / what didn't"
}
```

### Step 3D — Periodic Review (Every 10 Uses)

When a skill has 10+ log entries, run a full review:

```
1. Read all log entries for this skill
2. Identify patterns in low scores
3. web_search for any newer approaches released since skill was created
4. Compare current SKILL.md against new findings
5. Propose consolidated improvements to user
6. Ask: "Skill [X] has been used 10 times. I found improvements. Apply them? [yes/no]"
```

---

## Special Commands

Users can trigger specific actions:

| User says | Action |
|-----------|--------|
| "search skill for [X]" | Run Layer 1B only, show results |
| "install skill from [GitHub URL]" | Skip to Layer 2 directly |
| "improve skill [X]" | Run Layer 3 full review immediately |
| "show skill log" | Print skill-log.jsonl summary |
| "list my skills" | List all installed skills with descriptions |
| "delete skill [X]" | Remove skill + confirm first |
| "reset skill [X]" | Re-fetch from source / recreate |

---

## Error Handling

| Error | Action |
|-------|--------|
| GitHub fetch fails | Try alternate raw URL paths, then create fresh |
| Skill already exists | Ask: "Overwrite or keep both as v1/v2?" |
| Write permission denied | Switch to alternate path, inform user |
| Skill creates wrong output | Immediately drop to Layer 3 patch |
| Web search returns no results | Create skill from Claude's own knowledge + note "no external reference found" |

---

## Reference Files

- `references/writing-guide.md` — Full SKILL.md writing guide (format, anatomy, best practices)
- `references/github-registries.md` — Known skill registries and search patterns
- `references/test-cases.md` — Per-skill test case library (grows over time)
- `skill-log.jsonl` — Execution history for self-improvement loop

Read these files when you need deeper guidance on a specific step. Do not load all at once.

---

## Guiding Principle

> **Never say "I don't have a skill for that."**  
> Find it. Fetch it. Build it. Improve it. That is your only job.
