'use strict';

// ── Data ────────────────────────────────────────────────────────────────────

const DEFAULT_SKILLS = [
  {
    id: 'skill-manager',
    name: 'skill-manager',
    icon: '🧠',
    category: 'core',
    alwaysOn: true,
    description: 'Super Manager meta-skill that automatically finds, fetches, creates, and improves Claude skills on demand. Runs the DISCOVER → DEPLOY → EVOLVE loop on every task.',
    source: 'built-here',
    triggers: ['add a skill', 'install a skill', 'find a skill for X', 'teach yourself'],
    score: 9.0,
    version: '1.0',
    createdAt: '2026-05-01T00:00:00Z',
  },
  {
    id: 'managing-director',
    name: 'managing-director',
    icon: '🏢',
    category: 'core',
    alwaysOn: true,
    description: 'MD Orchestrator — spins up 10 specialist agents (Product, Tech, Finance, Marketing, Sales, UX, Ops, Legal…) for any business task.',
    source: 'built-here',
    triggers: ['I need a SaaS model', 'business plan', 'launch strategy'],
    score: 8.8,
    version: '1.0',
    createdAt: '2026-05-01T00:00:00Z',
  },
  {
    id: 'token-saver',
    name: 'token-saver',
    icon: '🪨',
    category: 'core',
    alwaysOn: true,
    description: 'Caveman mode — cuts 60–75% output tokens. Compresses responses to essential information only. Always active in background.',
    source: 'built-here',
    triggers: ['always active', 'token compression'],
    score: 8.5,
    version: '1.0',
    createdAt: '2026-05-01T00:00:00Z',
  },
  {
    id: 'quantum-physics',
    name: 'quantum-physics',
    icon: '⚛️',
    category: 'core',
    alwaysOn: false,
    description: 'Quantum reasoning engine — superposition, entanglement, quantum gates, Bell states, Heisenberg uncertainty. For quantum computing and physics tasks.',
    source: 'built-here',
    triggers: ['quantum', 'superposition', 'entanglement', 'qubit'],
    score: 8.25,
    version: '1.0',
    createdAt: '2026-05-25T00:00:00Z',
  },
  {
    id: 'systematic-debugging',
    name: 'systematic-debugging',
    icon: '🐛',
    category: 'community',
    alwaysOn: false,
    description: '4-phase root-cause framework for debugging. Triggers on any bug, error, or unexpected behavior. Prevents jumping to solutions too fast.',
    source: 'mrgoonie/claudekit-skills',
    triggers: ['bug', 'error', 'unexpected behavior', 'not working'],
    score: 8.7,
    version: '1.0',
    createdAt: '2026-05-10T00:00:00Z',
  },
  {
    id: 'sequential-thinking',
    name: 'sequential-thinking',
    icon: '🔢',
    category: 'community',
    alwaysOn: false,
    description: 'Step-by-step reasoning for complex multi-stage problems. Prevents jumping ahead. Ensures each step is verified before moving to the next.',
    source: 'mrgoonie/claudekit-skills',
    triggers: ['multi-stage', 'complex problem', 'step by step', 'planning'],
    score: 8.4,
    version: '1.0',
    createdAt: '2026-05-10T00:00:00Z',
  },
  {
    id: 'context-engineering',
    name: 'context-engineering',
    icon: '🧩',
    category: 'community',
    alwaysOn: false,
    description: 'Master token/context optimization. Agent architecture design, context window management, and multi-agent coordination strategies.',
    source: 'mrgoonie/claudekit-skills',
    triggers: ['agent architecture', 'context design', 'token optimization'],
    score: 8.6,
    version: '1.0',
    createdAt: '2026-05-10T00:00:00Z',
  },
  {
    id: 'when-stuck',
    name: 'when-stuck',
    icon: '🧭',
    category: 'community',
    alwaysOn: false,
    description: "Routes to the right problem-solving technique when blocked. Identifies WHY you're stuck and selects the best unblocking strategy.",
    source: 'mrgoonie/claudekit-skills',
    triggers: ["I'm stuck", 'blocked', 'not sure how to proceed'],
    score: 8.2,
    version: '1.0',
    createdAt: '2026-05-10T00:00:00Z',
  },
  {
    id: 'mermaidjs',
    name: 'mermaidjs',
    icon: '📊',
    category: 'community',
    alwaysOn: false,
    description: '24+ diagram types from natural language. Flowcharts, sequence diagrams, ER diagrams, Gantt charts, architecture diagrams.',
    source: 'mrgoonie/claudekit-skills',
    triggers: ['diagram', 'flowchart', 'architecture diagram', 'sequence diagram'],
    score: 8.9,
    version: '1.0',
    createdAt: '2026-05-10T00:00:00Z',
  },
  {
    id: 'code-review',
    name: 'code-review',
    icon: '👁',
    category: 'community',
    alwaysOn: false,
    description: 'Review before claiming success. Three practices: receiving feedback with technical rigor, requesting reviews, and verification gates requiring evidence.',
    source: 'mrgoonie/claudekit-skills',
    triggers: ['code review', 'review my code', 'before proceeding', 'task complete'],
    score: 9.1,
    version: '1.0',
    createdAt: '2026-05-10T00:00:00Z',
  },
  {
    id: 'inversion-thinking',
    name: 'inversion-thinking',
    icon: '🔄',
    category: 'community',
    alwaysOn: false,
    description: 'Flip assumptions to find hidden solutions. "What if the opposite were true?" Reveals blind spots and unconventional paths.',
    source: 'mrgoonie/claudekit-skills',
    triggers: ['what if opposite', 'flip assumption', 'inversion', 'challenge assumption'],
    score: 8.3,
    version: '1.0',
    createdAt: '2026-05-10T00:00:00Z',
  },
  {
    id: 'docs-seeker',
    name: 'docs-seeker',
    icon: '📚',
    category: 'community',
    alwaysOn: false,
    description: 'Intelligent documentation discovery. Finds official docs, API references, and guides for any technology. Avoids outdated sources.',
    source: 'mrgoonie/claudekit-skills',
    triggers: ['find docs', 'API reference', 'documentation for', 'how does X work'],
    score: 8.0,
    version: '1.0',
    createdAt: '2026-05-10T00:00:00Z',
  },
];

const DEFAULT_LOGS = [
  {
    id: 1,
    timestamp: '2026-05-25T00:00:00Z',
    skill: 'quantum-physics',
    task: 'test quantum physics logic - superposition, entanglement, Heisenberg',
    source: 'created',
    score: 8.25,
    patched: false,
    notes: 'Created fresh via skill-manager web research. Covered superposition, Bell states, Heisenberg uncertainty. No GitHub match found.',
  },
];

const AVAILABLE_SKILLS = [
  { name: 'data-analysis', icon: '📈', source: 'community', desc: 'Statistical analysis, pandas, matplotlib workflows for data science tasks.', installed: false },
  { name: 'sql-expert', icon: '🗄️', source: 'community', desc: 'Complex SQL queries, optimization, schema design across PostgreSQL, MySQL, SQLite.', installed: false },
  { name: 'api-design', icon: '🔌', source: 'community', desc: 'REST and GraphQL API design patterns, OpenAPI spec generation, versioning strategies.', installed: false },
  { name: 'test-writer', icon: '🧪', source: 'community', desc: 'Unit, integration, and E2E test generation for any codebase. TDD/BDD frameworks.', installed: false },
  { name: 'refactoring', icon: '♻️', source: 'community', desc: 'Code smell detection and systematic refactoring using established patterns.', installed: false },
];

// ── State ────────────────────────────────────────────────────────────────────

const State = {
  skills: [],
  logs: [],
  settings: {},
  currentFilter: 'all',
  communityFilter: 'installed',

  load() {
    const savedSkills = localStorage.getItem('sm_skills');
    this.skills = savedSkills ? JSON.parse(savedSkills) : [...DEFAULT_SKILLS];
    const savedLogs = localStorage.getItem('sm_logs');
    this.logs = savedLogs ? JSON.parse(savedLogs) : [...DEFAULT_LOGS];
    const savedSettings = localStorage.getItem('sm_settings');
    this.settings = savedSettings ? JSON.parse(savedSettings) : {
      skillsPath: '~/.claude/skills/',
      autoImprove: true,
      reviewThreshold: 10,
      autoFetch: true,
    };
  },

  saveSkills() { localStorage.setItem('sm_skills', JSON.stringify(this.skills)); },
  saveLogs() { localStorage.setItem('sm_logs', JSON.stringify(this.logs)); },
  saveSettings() { localStorage.setItem('sm_settings', JSON.stringify(this.settings)); },

  addSkill(skill) {
    skill.id = skill.name.toLowerCase().replace(/\s+/g, '-');
    skill.createdAt = new Date().toISOString();
    this.skills.push(skill);
    this.saveSkills();
  },

  deleteSkill(id) {
    this.skills = this.skills.filter(s => s.id !== id);
    this.saveSkills();
  },

  addLog(entry) {
    entry.id = Date.now();
    entry.timestamp = new Date().toISOString();
    this.logs.unshift(entry);
    this.saveLogs();
  },

  deleteLog(id) {
    this.logs = this.logs.filter(l => l.id !== id);
    this.saveLogs();
  },
};

// ── App ──────────────────────────────────────────────────────────────────────

const App = {
  currentTab: 'dashboard',

  init() {
    State.load();
    this.bindNav();
    this.bindSidebar();
    this.bindSearch();
    this.bindFilters();
    this.render();
    this.updateCounts();
    this.applySettings();
  },

  // ── Navigation ──

  bindNav() {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        this.goTo(el.dataset.tab);
      });
    });
  },

  goTo(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.tab === tab);
    });
    document.querySelectorAll('.tab-panel').forEach(el => {
      el.classList.toggle('active', el.id === `tab-${tab}`);
    });
    document.getElementById('breadcrumb').textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
    this.renderTab(tab);
  },

  renderTab(tab) {
    if (tab === 'dashboard') this.renderDashboard();
    else if (tab === 'skills') this.renderSkills();
    else if (tab === 'community') this.renderCommunity();
    else if (tab === 'logs') this.renderLogs();
  },

  render() {
    this.renderDashboard();
    this.renderSkills();
    this.renderCommunity();
    this.renderLogs();
  },

  // ── Sidebar ──

  bindSidebar() {
    const sidebar = document.getElementById('sidebar');
    document.getElementById('sidebarToggle').addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  },

  // ── Search ──

  bindSearch() {
    document.getElementById('globalSearch').addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      const skill = State.skills.find(s => s.name.includes(q) || s.description.toLowerCase().includes(q));
      if (skill && q.length > 1) {
        this.goTo('skills');
        document.getElementById('skillSearch').value = q;
        this.renderSkills(q);
      }
    });

    document.getElementById('skillSearch').addEventListener('input', e => {
      this.renderSkills(e.target.value);
    });

    document.getElementById('communitySearch').addEventListener('input', e => {
      this.renderCommunity(e.target.value);
    });
  },

  // ── Filters ──

  bindFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = btn.closest('.tab-panel');
        panel.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;

        if (panel.id === 'tab-skills') {
          State.currentFilter = f;
          this.renderSkills();
        } else if (panel.id === 'tab-community') {
          State.communityFilter = f;
          this.renderCommunity();
        } else if (panel.id === 'tab-logs') {
          this.renderLogs(f);
        }
      });
    });
  },

  updateCounts() {
    document.getElementById('skillsCount').textContent = State.skills.length;
    document.getElementById('totalSkills').textContent = State.skills.length;
    document.getElementById('activeSkills').textContent = State.skills.filter(s => s.category === 'core').length;
    document.getElementById('communitySkills').textContent = State.skills.filter(s => s.category === 'community').length;
    const avg = State.logs.length ? (State.logs.reduce((a, l) => a + l.score, 0) / State.logs.length).toFixed(2) : '—';
    document.getElementById('avgScore').textContent = avg;
  },

  // ── Dashboard ──

  renderDashboard() {
    this.updateCounts();
    this.renderActivity();
    this.renderHealth();
  },

  renderActivity() {
    const el = document.getElementById('activityList');
    if (!State.logs.length) {
      el.innerHTML = '<div style="padding:20px;color:var(--text-muted);font-size:13px;">No activity yet. Execute a skill to see logs here.</div>';
      return;
    }
    el.innerHTML = State.logs.slice(0, 5).map(log => {
      const score = log.score;
      const color = score >= 8 ? 'var(--green)' : score >= 5 ? 'var(--amber)' : 'var(--red)';
      return `
        <div class="activity-item">
          <div class="activity-dot" style="background:${color}"></div>
          <div class="activity-content">
            <div class="activity-title">${log.skill}</div>
            <div class="activity-meta">${log.task.slice(0, 60)}${log.task.length > 60 ? '…' : ''} · ${this.fmtDate(log.timestamp)}</div>
          </div>
          <div class="activity-score" style="color:${color}">${score}</div>
        </div>`;
    }).join('');
  },

  renderHealth() {
    const el = document.getElementById('healthList');
    const scored = State.skills.filter(s => s.score).sort((a, b) => b.score - a.score).slice(0, 6);
    el.innerHTML = scored.map(s => {
      const pct = (s.score / 10) * 100;
      const color = s.score >= 8 ? 'var(--green)' : s.score >= 5 ? 'var(--amber)' : 'var(--red)';
      return `
        <div class="health-item">
          <div class="health-row">
            <span class="health-name">${s.icon} ${s.name}</span>
            <span class="health-score" style="color:${color}">${s.score}</span>
          </div>
          <div class="health-bar-wrap">
            <div class="health-bar" style="width:${pct}%;background:${color}"></div>
          </div>
        </div>`;
    }).join('');
  },

  // ── Skills ──

  renderSkills(query = '') {
    const el = document.getElementById('skillsGrid');
    let skills = State.skills;
    if (State.currentFilter !== 'all') skills = skills.filter(s => s.category === State.currentFilter);
    if (query) {
      const q = query.toLowerCase();
      skills = skills.filter(s => s.name.includes(q) || s.description.toLowerCase().includes(q));
    }

    if (!skills.length) {
      el.innerHTML = `<div style="grid-column:1/-1;padding:40px;text-align:center;color:var(--text-muted);">No skills match your search.</div>`;
      return;
    }

    el.innerHTML = skills.map(s => this.skillCard(s)).join('');
    el.querySelectorAll('.skill-card').forEach(card => {
      card.addEventListener('click', () => this.openSkillModal(card.dataset.id));
    });
    el.querySelectorAll('.btn-icon.danger').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        this.deleteSkill(btn.dataset.id);
      });
    });
  },

  skillCard(s) {
    return `
      <div class="skill-card" data-id="${s.id}">
        <div class="skill-card-header">
          <div class="skill-card-name">${s.name}</div>
          <div class="skill-card-tags">
            <span class="tag tag-${s.category}">${s.category}</span>
            ${s.alwaysOn ? '<span class="tag tag-active">always on</span>' : ''}
          </div>
        </div>
        <div class="skill-card-desc">${s.description}</div>
        <div class="skill-card-footer">
          <div class="skill-card-icon">${s.icon}</div>
          <div class="skill-card-actions">
            <button class="btn-icon" title="Edit" onclick="event.stopPropagation();App.editSkill('${s.id}')">✏️</button>
            <button class="btn-icon danger" data-id="${s.id}" title="Delete">🗑</button>
          </div>
        </div>
      </div>`;
  },

  deleteSkill(id) {
    if (!confirm(`Delete skill "${id}"? This cannot be undone.`)) return;
    State.deleteSkill(id);
    this.renderSkills();
    this.updateCounts();
    this.toast('Skill deleted.', 'info');
  },

  editSkill(id) {
    const s = State.skills.find(sk => sk.id === id);
    if (!s) return;
    this.goTo('create');
    document.getElementById('skillName').value = s.name;
    document.getElementById('skillDescription').value = s.description;
    document.getElementById('skillCategory').value = s.category;
    document.getElementById('skillAlwaysOn').checked = s.alwaysOn;
    document.getElementById('skillTriggers').value = (s.triggers || []).join(', ');
    document.getElementById('skillContent').value = `---\nname: ${s.name}\ndescription: |\n  ${s.description}\n---\n\n# ${s.name}\n\n${s.description}`;
    this.previewSkill();
    this.toast('Editing ' + s.name, 'info');
  },

  // ── Community ──

  renderCommunity(query = '') {
    const el = document.getElementById('communityGrid');
    const installed = State.skills.filter(s => s.category === 'community');

    let items;
    if (State.communityFilter === 'installed') {
      items = installed.map(s => ({ ...s, isInstalled: true }));
    } else {
      items = AVAILABLE_SKILLS.filter(s => !installed.find(i => i.id === s.name));
    }

    if (query) {
      const q = query.toLowerCase();
      items = items.filter(s => s.name.includes(q) || s.description?.toLowerCase().includes(q) || s.desc?.toLowerCase().includes(q));
    }

    if (!items.length) {
      el.innerHTML = `<div style="grid-column:1/-1;padding:40px;text-align:center;color:var(--text-muted);">No community skills found.</div>`;
      return;
    }

    el.innerHTML = items.map(s => `
      <div class="community-card">
        <div class="community-header">
          <div class="community-icon">${s.icon || '📦'}</div>
          <div class="community-meta">
            <div class="community-name">${s.name}</div>
            <div class="community-source">${s.source || 'community'}</div>
          </div>
        </div>
        <div class="community-desc">${s.description || s.desc || ''}</div>
        <div class="community-footer">
          <div class="community-status">
            ${s.isInstalled
              ? '<span class="badge-success">Installed</span>'
              : '<span style="color:var(--text-muted);font-size:12px;">Not installed</span>'}
          </div>
          ${s.isInstalled
            ? `<button class="btn-ghost btn-sm" onclick="App.openSkillModal('${s.id}')">Details</button>`
            : `<button class="btn-primary btn-sm" onclick="App.installCommunitySkill('${s.name}')">+ Install</button>`}
        </div>
      </div>`).join('');
  },

  installCommunitySkill(name) {
    const avail = AVAILABLE_SKILLS.find(s => s.name === name);
    if (!avail) return;
    State.addSkill({
      name: avail.name,
      icon: avail.icon,
      category: 'community',
      alwaysOn: false,
      description: avail.desc,
      source: 'community',
      triggers: [],
      score: null,
      version: '1.0',
    });
    this.renderCommunity();
    this.renderSkills();
    this.updateCounts();
    this.toast(`Skill "${name}" installed!`, 'success');
  },

  // ── Logs ──

  renderLogs(filter = 'all') {
    const tbody = document.getElementById('logTableBody');
    let logs = [...State.logs];
    if (filter === 'high') logs = logs.filter(l => l.score >= 8);
    else if (filter === 'low') logs = logs.filter(l => l.score < 5);
    else if (filter === 'patched') logs = logs.filter(l => l.patched);

    if (!logs.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text-muted);">No log entries match the filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = logs.map(l => {
      const scoreClass = l.score >= 8 ? 'score-high' : l.score >= 5 ? 'score-mid' : 'score-low';
      return `
        <tr>
          <td style="font-family:var(--font-mono);font-size:12px;color:var(--text-secondary)">${this.fmtDate(l.timestamp)}</td>
          <td><strong>${l.skill}</strong></td>
          <td style="max-width:260px;color:var(--text-secondary)">${l.task.slice(0, 70)}${l.task.length > 70 ? '…' : ''}</td>
          <td><span class="source-badge">${l.source}</span></td>
          <td><span class="score-badge ${scoreClass}">${l.score}</span></td>
          <td class="${l.patched ? 'patched-yes' : 'patched-no'}">${l.patched ? '✓ Yes' : '—'}</td>
          <td>
            <div style="display:flex;gap:4px">
              <button class="btn-icon" title="View notes" onclick="App.viewLogNotes(${l.id})">👁</button>
              <button class="btn-icon danger" title="Delete" onclick="App.deleteLogEntry(${l.id})">🗑</button>
            </div>
          </td>
        </tr>`;
    }).join('');
  },

  viewLogNotes(id) {
    const log = State.logs.find(l => l.id === id);
    if (!log) return;
    document.getElementById('modalTitle').textContent = `Log: ${log.skill}`;
    document.getElementById('modalBody').innerHTML = `
      <div class="modal-skill-info">
        <div class="modal-row"><span class="modal-key">Skill</span><span class="modal-val">${log.skill}</span></div>
        <div class="modal-row"><span class="modal-key">Task</span><span class="modal-val">${log.task}</span></div>
        <div class="modal-row"><span class="modal-key">Source</span><span class="modal-val"><span class="source-badge">${log.source}</span></span></div>
        <div class="modal-row"><span class="modal-key">Score</span><span class="modal-val"><span class="score-badge ${log.score >= 8 ? 'score-high' : log.score >= 5 ? 'score-mid' : 'score-low'}">${log.score}</span></span></div>
        <div class="modal-row"><span class="modal-key">Patched</span><span class="modal-val">${log.patched ? '✓ Yes' : '—'}</span></div>
        <div class="modal-divider"></div>
        <div class="modal-row"><span class="modal-key">Notes</span><span class="modal-val" style="line-height:1.6">${log.notes}</span></div>
      </div>`;
    document.getElementById('modalAction').textContent = 'Close';
    document.getElementById('modalAction').onclick = () => this.closeModal();
    this.openModal();
  },

  deleteLogEntry(id) {
    if (!confirm('Delete this log entry?')) return;
    State.deleteLog(id);
    this.renderLogs();
    this.toast('Log entry deleted.', 'info');
  },

  addLogEntry() {
    const scoreInput = prompt('Score (1–10):');
    if (!scoreInput) return;
    const score = parseFloat(scoreInput);
    if (isNaN(score) || score < 1 || score > 10) { this.toast('Invalid score.', 'error'); return; }
    const skill = prompt('Skill name:');
    if (!skill) return;
    const task = prompt('Task description:');
    if (!task) return;
    const notes = prompt('Notes (optional):') || '';
    State.addLog({ skill, task, source: 'manual', score, patched: false, notes });
    this.renderLogs();
    this.updateCounts();
    this.toast('Log entry added.', 'success');
  },

  exportLogs() {
    const data = State.logs.map(l =>
      JSON.stringify({ timestamp: l.timestamp, skill: l.skill, task: l.task, source: l.source, score: l.score, patched: l.patched, notes: l.notes })
    ).join('\n');
    this.download('skill-log.jsonl', data, 'application/jsonl');
    this.toast('Logs exported.', 'success');
  },

  exportSkills() {
    this.download('skills.json', JSON.stringify(State.skills, null, 2), 'application/json');
    this.toast('Skills exported.', 'success');
  },

  // ── Create Skill ──

  createSkill(e) {
    e.preventDefault();
    const name = document.getElementById('skillName').value.trim().toLowerCase().replace(/\s+/g, '-');
    if (State.skills.find(s => s.id === name)) {
      this.toast('Skill already exists. Use a different name.', 'error');
      return;
    }
    State.addSkill({
      name,
      icon: '⚡',
      category: document.getElementById('skillCategory').value,
      alwaysOn: document.getElementById('skillAlwaysOn').checked,
      description: document.getElementById('skillDescription').value.trim(),
      source: 'created',
      triggers: document.getElementById('skillTriggers').value.split(',').map(t => t.trim()).filter(Boolean),
      score: null,
      version: '1.0',
    });
    document.getElementById('createSkillForm').reset();
    document.getElementById('skillPreview').innerHTML = `<div class="preview-empty"><span>📄</span><p>Fill in the form and click Preview to see your SKILL.md</p></div>`;
    this.renderSkills();
    this.updateCounts();
    this.toast(`Skill "${name}" created!`, 'success');
    this.goTo('skills');
  },

  previewSkill() {
    const name = document.getElementById('skillName').value || 'untitled';
    const desc = document.getElementById('skillDescription').value || '';
    const content = document.getElementById('skillContent').value || '';
    const yaml = `---\nname: ${name}\ndescription: |\n  ${desc.replace(/\n/g, '\n  ')}\n---`;
    document.getElementById('skillPreview').innerHTML = `<pre class="preview-content"><span class="yaml-block">${this.escHtml(yaml)}</span>\n\n${this.escHtml(content)}</pre>`;
    document.getElementById('previewBadge').textContent = 'Preview';
  },

  // ── Skill Modal ──

  openSkillModal(id) {
    const s = State.skills.find(sk => sk.id === id);
    if (!s) return;
    document.getElementById('modalTitle').textContent = `${s.icon} ${s.name}`;
    document.getElementById('modalBody').innerHTML = `
      <div class="modal-skill-info">
        <div class="modal-row"><span class="modal-key">Category</span><span class="modal-val"><span class="tag tag-${s.category}">${s.category}</span></span></div>
        <div class="modal-row"><span class="modal-key">Always On</span><span class="modal-val">${s.alwaysOn ? '✓ Yes' : '—'}</span></div>
        <div class="modal-row"><span class="modal-key">Source</span><span class="modal-val"><span class="source-badge">${s.source}</span></span></div>
        ${s.score ? `<div class="modal-row"><span class="modal-key">Score</span><span class="modal-val"><span class="score-badge ${s.score >= 8 ? 'score-high' : 'score-mid'}">${s.score}</span></span></div>` : ''}
        <div class="modal-row"><span class="modal-key">Version</span><span class="modal-val">v${s.version}</span></div>
        <div class="modal-row"><span class="modal-key">Created</span><span class="modal-val">${this.fmtDate(s.createdAt)}</span></div>
        <div class="modal-divider"></div>
        <div class="modal-row"><span class="modal-key">Description</span><span class="modal-val">${s.description}</span></div>
        ${s.triggers?.length ? `<div class="modal-row"><span class="modal-key">Triggers</span><span class="modal-val">${s.triggers.map(t => `<span class="source-badge" style="display:inline-block;margin:2px">${t}</span>`).join(' ')}</span></div>` : ''}
        <div class="modal-divider"></div>
        <div class="modal-row"><span class="modal-key">SKILL.md</span><span class="modal-val mono">---\nname: ${s.name}\ndescription: |\n  ${s.description.replace(/\n/g, '\n  ')}\n---</span></div>
      </div>`;
    document.getElementById('modalAction').textContent = 'Edit';
    document.getElementById('modalAction').onclick = () => { this.closeModal(); this.editSkill(s.id); };
    this.openModal();
  },

  openModal() {
    document.getElementById('modalBackdrop').classList.add('open');
    document.getElementById('skillModal').classList.add('open');
  },

  closeModal() {
    document.getElementById('modalBackdrop').classList.remove('open');
    document.getElementById('skillModal').classList.remove('open');
  },

  // ── Settings ──

  applySettings() {
    const s = State.settings;
    if (document.getElementById('skillsPath')) document.getElementById('skillsPath').textContent = s.skillsPath || '~/.claude/skills/';
    if (document.getElementById('autoImprove')) document.getElementById('autoImprove').checked = s.autoImprove !== false;
    if (document.getElementById('reviewThreshold')) document.getElementById('reviewThreshold').value = s.reviewThreshold || 10;
    if (document.getElementById('autoFetch')) document.getElementById('autoFetch').checked = s.autoFetch !== false;
  },

  saveSetting(key, value) {
    State.settings[key] = value;
    State.saveSettings();
    this.toast('Setting saved.', 'success');
  },

  editSetting(key) {
    const cur = State.settings[key] || '';
    const val = prompt(`Enter new value for ${key}:`, cur);
    if (val === null) return;
    State.settings[key] = val;
    State.saveSettings();
    if (key === 'skillsPath') document.getElementById('skillsPath').textContent = val;
    this.toast('Setting updated.', 'success');
  },

  updateWeight(id, val) {
    document.getElementById(`${id}-val`).textContent = `${val}%`;
  },

  resetDefaults() {
    if (!confirm('Reset all custom skills and settings to defaults? This cannot be undone.')) return;
    localStorage.removeItem('sm_skills');
    localStorage.removeItem('sm_logs');
    localStorage.removeItem('sm_settings');
    State.load();
    this.render();
    this.updateCounts();
    this.applySettings();
    this.toast('Reset to defaults.', 'info');
  },

  // ── Toast ──

  toast(msg, type = 'info') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = `toast ${type} show`;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
  },

  // ── Helpers ──

  fmtDate(iso) {
    try {
      return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return iso; }
  },

  escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  download(name, content, mime) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: mime }));
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
