# 🧠 Claude Skill Manager — Self-Growing Agent Skills

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Skills](https://img.shields.io/badge/Skills-12_installed-blue)](#skills)
[![Claude.ai](https://img.shields.io/badge/Works_on-Claude.ai%20%2B%20Claude_Code-orange)](https://claude.ai)
[![Open Source](https://img.shields.io/badge/Open-Source-green)](https://github.com)

> **"Never say I don't have a skill for that. Find it. Fetch it. Build it. Improve it."**

A complete agent skill ecosystem for Claude. Auto-discovers, fetches, creates, and self-improves skills — plus 12 pre-installed best-in-class skills from the community.

---

## 🚀 Quick Install

```bash
# Claude Code
git clone https://github.com/ashishgoswami01/claude-skill-manager
cp -r claude-skill-manager/community-skills/* ~/.claude/skills/
cp -r claude-skill-manager/skill-manager ~/.claude/skills/
cp -r claude-skill-manager/managing-director ~/.claude/skills/
cp -r claude-skill-manager/token-saver ~/.claude/skills/
```

---

## 📦 Skills Included (12 Total)

### 🏠 Core Skills (Built Here)

| Skill | What it does | Always On |
|-------|-------------|-----------|
| [`skill-manager`](./skill-manager/) | 🧠 Super Manager — finds/fetches/creates/improves skills automatically | ✅ |
| [`managing-director`](./managing-director/) | 🏢 MD Orchestrator — spins up 10 specialist agents for any business task | ✅ |
| [`token-saver`](./token-saver/) | 🪨 Caveman mode — cuts 60-75% output tokens, always active | ✅ |
| [`quantum-physics`](./quantum-physics/) | ⚛️ Quantum reasoning engine — superposition, entanglement, gates | — |

### 🌍 Community Skills (Fetched from GitHub)

| Skill | Source | What it does | Triggers when |
|-------|--------|-------------|---------------|
| [`systematic-debugging`](./community-skills/systematic-debugging/) | mrgoonie/claudekit-skills | 4-phase root-cause framework | Bug / error / unexpected behavior |
| [`sequential-thinking`](./community-skills/sequential-thinking/) | mrgoonie/claudekit-skills | Step-by-step reasoning for complex problems | Multi-stage analysis / planning |
| [`context-engineering`](./community-skills/context-engineering/) | mrgoonie/claudekit-skills | Master token/context optimization | Agent architecture / context design |
| [`when-stuck`](./community-skills/when-stuck/) | mrgoonie/claudekit-skills | Routes to right problem-solving technique | "I'm stuck" / blocked on a problem |
| [`mermaidjs`](./community-skills/mermaidjs/) | mrgoonie/claudekit-skills | 24+ diagram types from natural language | Flowcharts / architecture / diagrams |
| [`code-review`](./community-skills/code-review/) | mrgoonie/claudekit-skills | Review before claiming success | Code completion / PR / feature done |
| [`inversion-thinking`](./community-skills/inversion-thinking/) | mrgoonie/claudekit-skills | Flip assumptions to find hidden solutions | "What if opposite were true?" |
| [`docs-seeker`](./community-skills/docs-seeker/) | mrgoonie/claudekit-skills | Intelligent documentation discovery | Find docs / API reference / guides |

---

## 🔄 Self-Growing System

The `skill-manager` skill runs a 3-layer loop on every task:

```
DISCOVER → DEPLOY → EVOLVE
   ↓           ↓        ↓
Check local  Install  Rate 1-10
→ GitHub     to path  → auto-patch
→ Web        + log    → periodic review
→ Create new          → improves itself
```

---

## 🏢 Managing Director — Agent Roster

Say **"I need a SaaS model"** and the MD activates:

```
🎯 Product Agent  → features, roadmap, KPIs
💻 Tech Agent     → stack, architecture, timeline
💰 Finance Agent  → pricing, revenue model, break-even
📈 Marketing Agent→ ICP, channels, messaging
🤝 Sales Agent    → funnel, outreach, first 10 customers
🎨 UX Agent       → flows, screens, onboarding
⚙️ Ops Agent      → workflows, SOPs, automation
⚖️ Legal Agent    → risks, compliance, terms
📊 Data Agent     → metrics, dashboard, reporting
🎓 Training Agent → L&D, modules, assessment
```

---

## 📜 License

MIT — free to use, modify, distribute.

## 👤 Author

**Ashish Goswami** | Manager L&D, Star Health Insurance | Jodhpur Zone, Rajasthan 🇮🇳

⭐ Star this repo if it helped you!
