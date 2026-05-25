# 🧠 Claude Skill Manager — Self-Growing Agent Skills

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Agent Skills](https://img.shields.io/badge/Agent_Skills-Claude_Code-blue)](https://code.claude.com/docs/en/skills)
[![Claude.ai](https://img.shields.io/badge/Works_on-Claude.ai-orange)](https://claude.ai)
[![Open Source](https://img.shields.io/badge/Open-Source-green)](https://github.com)

> **"Never say I don't have a skill for that. Find it. Fetch it. Build it. Improve it."**

A meta-skill system for Claude that **automatically discovers, fetches, creates, and self-improves agent skills** — from GitHub registries or fresh web research — in both Claude.ai and Claude Code environments.

---

## 🚀 What This Does

| Layer | Action |
|-------|--------|
| **1. DISCOVER** | Checks local skills → searches GitHub registries → researches web |
| **2. DEPLOY** | Auto-installs to correct path (Claude.ai or Claude Code) |
| **3. EVOLVE** | Rates every execution → auto-patches weak skills → logs history |

The system **learns over time**. Every skill execution is rated 1–10. Low scores trigger automatic research + improvement. After 10 uses, a full periodic review runs.

---

## 📦 Skills Included

### 1. `skill-manager` — The Super Manager
The core meta-skill. Orchestrates everything.

**Triggers automatically when you say:**
- "search skill for [X]"
- "install skill from [GitHub URL]"
- "learn how to do [X]"
- "improve skill [X]"
- "I don't have a skill for that"

**Features:**
- 🔍 Searches GitHub registries (skillsllm, explainx, awesome-claude-skills, VoltAgent)
- 📥 Fetches SKILL.md from any GitHub repo via raw URL
- 🛠️ Creates new skills from scratch using web research
- 🔁 Auto-improves skills after every use (feedback loop)
- 📊 Maintains `skill-log.jsonl` — full execution history
- 🌍 Works in **both** Claude.ai (`/mnt/skills/`) and Claude Code (`~/.claude/skills/`)

### 2. `quantum-physics` — Quantum Reasoning Engine
Deep quantum physics logic, created as a live demo of the skill-manager's auto-create capability.

**Handles:**
- Superposition, entanglement, wave function collapse
- Quantum gates (Hadamard, CNOT, Pauli X/Y/Z)
- Heisenberg uncertainty, quantum tunneling
- Bell states, quantum circuits, quantum error correction
- Common misconceptions — corrects them every time

---

## 🛠️ Installation

### Claude Code
```bash
# Option 1: Clone directly
git clone https://github.com/YOUR_USERNAME/claude-skill-manager.git
cp -r claude-skill-manager/skill-manager ~/.claude/skills/
cp -r claude-skill-manager/quantum-physics ~/.claude/skills/

# Option 2: Install skill-manager only, let it handle the rest
cp -r claude-skill-manager/skill-manager ~/.claude/skills/
# Then in Claude Code: "search skill for quantum physics"
```

### Claude.ai
1. Download this repo as ZIP
2. In Claude.ai → Settings → Skills → Upload `.skill` file
3. Or copy folder contents to `/mnt/skills/user/skill-manager/`

### npx (coming soon)
```bash
npx skills add ashishgoswami/claude-skill-manager
```

---

## 🔄 How the Self-Improvement Loop Works

```
User asks task
      ↓
skill-manager checks local skills
      ↓
Not found? → GitHub search → web research → CREATE
      ↓
Skill executes
      ↓
Auto-rate 1-10:
  ≥ 8 → Log success ✅
  5-7 → Minor patch (add edge case note) 🔧
  < 5 → Major patch (web research + rewrite) 🔨
      ↓
Every 10 uses → Full periodic review
      ↓
Skill improves with every cycle 📈
```

---

## 📁 Repository Structure

```
claude-skill-manager/
├── README.md                          ← You are here
├── LICENSE                            ← MIT
├── CONTRIBUTING.md                    ← How to add skills
│
├── skill-manager/                     ← 🧠 Core meta-skill
│   ├── SKILL.md                       ← Main instructions
│   └── references/
│       ├── github-registries.md       ← Known skill registries
│       └── writing-guide.md           ← SKILL.md format guide
│
├── quantum-physics/                   ← ⚛️ Demo skill (auto-created)
│   ├── SKILL.md                       ← Quantum logic engine
│   └── references/
│       └── test-cases.md              ← Grows with each use
│
└── skill-log.jsonl                    ← Execution history template
```

---

## 🤝 Contributing

Want to add a skill to this collection? See [CONTRIBUTING.md](CONTRIBUTING.md).

**Skill ideas welcome:**
- Domain-specific reasoning (medical, legal, financial)
- Language-specific coding patterns
- Industry workflows (insurance, education, healthcare)
- Data analysis pipelines

Every skill follows the same format:
```
your-skill-name/
├── SKILL.md    ← required (YAML frontmatter + instructions)
└── references/ ← optional (deep docs, examples)
```

---

## 📊 Skill Registry Compatibility

| Platform | Status |
|----------|--------|
| Claude.ai | ✅ Supported |
| Claude Code | ✅ Supported |
| Codex CLI | ✅ Compatible (Agent Skills standard) |
| Cursor | ✅ Compatible |
| Gemini CLI | ✅ Compatible |
| Antigravity | ✅ Compatible |

---

## 📜 License

MIT License — free to use, modify, and distribute.  
See [LICENSE](LICENSE) for details.

---

## 👤 Author

**Ashish Goswami**  
Manager, Training & Learning Development  
Star Health & Allied Insurance Co. Ltd.  
Jodhpur Zone, Rajasthan, India

> Built with Claude claude-sonnet-4-6 using the skill-creator framework.  
> Part of an ongoing project to make AI agents truly self-learning.

---

## ⭐ If this helped you, star the repo!

```
"The best skill is the one that makes itself obsolete
 by teaching the agent to build better ones."
```
