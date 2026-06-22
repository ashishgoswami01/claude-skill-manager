# 🧠 Claude Skill Manager — Self-Growing Agent Skills

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Skills](https://img.shields.io/badge/Skills-51_installed-blue)](#skills)
[![Claude.ai](https://img.shields.io/badge/Works_on-Claude.ai%20%2B%20Claude_Code-orange)](https://claude.ai)
[![Open Source](https://img.shields.io/badge/Open-Source-green)](https://github.com)

> **"Never say I don't have a skill for that. Find it. Fetch it. Build it. Improve it."**

A complete agent skill ecosystem for Claude. Auto-discovers, fetches, creates, and self-improves skills — plus 51 pre-installed best-in-class skills from the community and ruflo.

---

## 🚀 Quick Install

```bash
# Claude Code
git clone https://github.com/ashishgoswami01/claude-skill-manager
cp -r claude-skill-manager/community-skills/* ~/.claude/skills/
cp -r claude-skill-manager/ruflo-skills/* ~/.claude/skills/
cp -r claude-skill-manager/skill-manager ~/.claude/skills/
cp -r claude-skill-manager/managing-director ~/.claude/skills/
cp -r claude-skill-manager/token-saver ~/.claude/skills/
```

---

## 📦 Skills Included (51 Total)

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

### 🤖 Ruflo Skills (from [ruvnet/ruflo](https://github.com/ruvnet/ruflo))

#### Agent Memory & Database

| Skill | What it does |
|-------|-------------|
| [`agentdb-advanced`](./ruflo-skills/agentdb-advanced/) | QUIC sync, hybrid search, multi-database, distributed AgentDB |
| [`agentdb-learning`](./ruflo-skills/agentdb-learning/) | 9 RL algorithms (Decision Transformer, Q-Learning, Actor-Critic…) |
| [`agentdb-memory-patterns`](./ruflo-skills/agentdb-memory-patterns/) | Session, long-term & pattern memory for stateful agents |
| [`agentdb-optimization`](./ruflo-skills/agentdb-optimization/) | 150x–12,500x faster search via quantization & HNSW indexing |
| [`agentdb-vector-search`](./ruflo-skills/agentdb-vector-search/) | Semantic RAG search with HNSW, MMR, and embedding models |
| [`reasoningbank-agentdb`](./ruflo-skills/reasoningbank-agentdb/) | Migrate & integrate ReasoningBank with AgentDB |
| [`reasoningbank-intelligence`](./ruflo-skills/reasoningbank-intelligence/) | AI reasoning patterns and intelligence layer |

#### Swarm & Multi-Agent

| Skill | What it does |
|-------|-------------|
| [`agentic-jujutsu`](./ruflo-skills/agentic-jujutsu/) | Quantum-resistant self-learning version control for AI agents |
| [`hive-mind-advanced`](./ruflo-skills/hive-mind-advanced/) | Queen-led hierarchical agent swarms with consensus mechanisms |
| [`swarm-advanced`](./ruflo-skills/swarm-advanced/) | Advanced swarm topologies, load balancing, fault tolerance |
| [`swarm-orchestration`](./ruflo-skills/swarm-orchestration/) | Coordinate mesh, hierarchical & adaptive agent topologies |
| [`flow-nexus-neural`](./ruflo-skills/flow-nexus-neural/) | Neural pattern learning across agent networks |
| [`flow-nexus-platform`](./ruflo-skills/flow-nexus-platform/) | Full ruflo multi-agent platform integration |
| [`flow-nexus-swarm`](./ruflo-skills/flow-nexus-swarm/) | Flow Nexus swarm coordination layer |
| [`v3-swarm-coordination`](./ruflo-skills/v3-swarm-coordination/) | V3 swarm coordination architecture |
| [`worker-benchmarks`](./ruflo-skills/worker-benchmarks/) | Benchmark background worker performance |
| [`worker-integration`](./ruflo-skills/worker-integration/) | Integrate background intelligence workers |

#### Development Methodology

| Skill | What it does |
|-------|-------------|
| [`sparc-methodology`](./ruflo-skills/sparc-methodology/) | SPARC framework: 17 modes, 84.8% SWE-Bench, 32% token reduction |
| [`dual-mode`](./ruflo-skills/dual-mode/) | Switch between fast/deep reasoning modes |
| [`pair-programming`](./ruflo-skills/pair-programming/) | AI pair programming patterns and practices |
| [`stream-chain`](./ruflo-skills/stream-chain/) | Streaming pipeline chaining for agent workflows |
| [`skill-builder`](./ruflo-skills/skill-builder/) | Meta-skill for creating and publishing new skills |
| [`hooks-automation`](./ruflo-skills/hooks-automation/) | 27 integration hooks for automated task routing |
| [`browser`](./ruflo-skills/browser/) | Browser automation and web interaction |
| [`performance-analysis`](./ruflo-skills/performance-analysis/) | Analyze and optimize AI agent performance |
| [`verification-quality`](./ruflo-skills/verification-quality/) | Quality verification gates for agent outputs |

#### GitHub Automation

| Skill | What it does |
|-------|-------------|
| [`github-code-review`](./ruflo-skills/github-code-review/) | Automated code review with AI agents |
| [`github-multi-repo`](./ruflo-skills/github-multi-repo/) | Coordinate changes across multiple repositories |
| [`github-project-management`](./ruflo-skills/github-project-management/) | Manage GitHub projects, milestones, and issues |
| [`github-release-management`](./ruflo-skills/github-release-management/) | Automate releases, changelogs, and versioning |
| [`github-workflow-automation`](./ruflo-skills/github-workflow-automation/) | Automate GitHub Actions and CI/CD workflows |

#### Ruflo V3 Platform

| Skill | What it does |
|-------|-------------|
| [`v3-cli-modernization`](./ruflo-skills/v3-cli-modernization/) | V3 CLI architecture and modernization patterns |
| [`v3-core-implementation`](./ruflo-skills/v3-core-implementation/) | V3 core platform implementation guide |
| [`v3-ddd-architecture`](./ruflo-skills/v3-ddd-architecture/) | Domain-Driven Design architecture for V3 |
| [`v3-integration-deep`](./ruflo-skills/v3-integration-deep/) | Deep integration patterns for ruflo V3 |
| [`v3-mcp-optimization`](./ruflo-skills/v3-mcp-optimization/) | Optimize MCP server for V3 performance |
| [`v3-memory-unification`](./ruflo-skills/v3-memory-unification/) | Unified memory architecture across V3 agents |
| [`v3-performance-optimization`](./ruflo-skills/v3-performance-optimization/) | V3 performance tuning and optimization |
| [`v3-security-overhaul`](./ruflo-skills/v3-security-overhaul/) | V3 zero-trust security architecture |

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
