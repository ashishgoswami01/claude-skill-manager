# Contributing to Claude Skill Manager

Thank you for contributing! This project grows stronger with every new skill added.

## How to Add a New Skill

### 1. Create your skill folder
```
your-skill-name/
├── SKILL.md          ← required
└── references/       ← optional
    └── guide.md
```

### 2. SKILL.md format
```yaml
---
name: your-skill-name
description: |
  One line: what this skill does.
  
  ALWAYS use when:
  - [trigger phrase 1]
  - [trigger phrase 2]
  
  Works in: Claude.ai / Claude Code / Both
version: "1.0"
---

# Your Skill Name

[Instructions here...]
```

### 3. Submit a Pull Request
- Fork this repo
- Add your skill folder
- Update README.md skills table
- Submit PR with description of what your skill does

## Skill Quality Standards

- [ ] Clear trigger phrases in `description`
- [ ] SKILL.md under 500 lines
- [ ] At least 3 usage examples
- [ ] Edge cases documented
- [ ] Tested on at least one real task

## Skill Ideas Needed

- 🏥 Medical diagnosis logic
- ⚖️ Legal document analysis  
- 📈 Financial analysis (Indian markets)
- 🎓 Education content creation
- 🌐 Multi-language translation workflows
- 🤖 n8n automation workflow builder
- 📱 WhatsApp bot design patterns

## Questions?

Open an issue or start a discussion.
