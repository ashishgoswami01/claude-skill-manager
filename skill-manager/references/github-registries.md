# GitHub Skill Registries & Search Patterns

## Primary Registries

| Registry | URL | How to search |
|----------|-----|---------------|
| GitHub Topics | https://github.com/topics/claude-skills | Browse or `web_search "site:github.com topics/claude-skills [keyword]"` |
| Skills LLM | https://skillsllm.com | `web_search "skillsllm.com [keyword] skill"` |
| ExplainX | https://explainx.ai/skills/ | `web_search "explainx.ai skills [keyword]"` |
| npm skills CLI | `npx skills add [author/repo]` | `web_search "npx skills add claude [keyword]"` |

## Raw SKILL.md URL Patterns

Given a GitHub repo `https://github.com/AUTHOR/REPO`:

```
# Try these paths in order:
https://raw.githubusercontent.com/AUTHOR/REPO/main/SKILL.md
https://raw.githubusercontent.com/AUTHOR/REPO/main/skills/SKILL.md
https://raw.githubusercontent.com/AUTHOR/REPO/master/SKILL.md
https://raw.githubusercontent.com/AUTHOR/REPO/main/skill/SKILL.md
https://raw.githubusercontent.com/AUTHOR/REPO/main/.claude/skills/SKILL.md
```

## Search Query Templates

Replace `[TASK]` with the skill domain:

```
# GitHub direct
"github.com claude skill [TASK] SKILL.md"
site:github.com "SKILL.md" claude "[TASK]"

# Registry search
"npx skills add [TASK] claude code"
"skillsllm [TASK] agent skill"

# Broader
"[TASK] claude code skill agent 2025"
"[TASK] SKILL.md anthropic agent"
```

## Known High-Quality Skill Authors (as of May 2026)

- `JuliusBrussee` — caveman (token compression), cavekit (build system), caveman-review
- `ruvnet` — ruflo (39 skills: swarm orchestration, AgentDB memory, SPARC methodology, GitHub automation, multi-agent AI): `https://github.com/ruvnet/ruflo` → skills in `.claude/skills/`
- Community skills: search GitHub topics for latest

## Evaluation Criteria for Fetched Skills

Before installing, check:
1. **Stars** — >100 stars = community validated
2. **Last commit** — within 6 months = actively maintained  
3. **Description quality** — clear trigger phrases in frontmatter
4. **Compatibility** — mentions Claude.ai or Claude Code explicitly
5. **Size** — SKILL.md under 500 lines (progressive disclosure principle)
