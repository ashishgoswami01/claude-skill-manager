'use strict';
// Detect API path — works whether site is in root or a subfolder
const API = (function(){
  const s = document.currentScript && document.currentScript.src;
  const base = s ? s.replace(/assets\/js\/blog\.js.*/, '') : '/';
  return base + 'api.php';
})();

const PER_PAGE = 9;
let allPosts = [], filtered = [], page = 1;

// ── Fetch posts ───────────────────────────────────────────────────────────────
async function fetchPosts() {
  try {
    const r = await fetch(API + '?action=posts');
    allPosts = await r.json();
    if (!Array.isArray(allPosts)) allPosts = [];
    filtered = [...allPosts];
    buildTagBar();
    renderGrid();
  } catch(e) {
    allPosts = []; filtered = [];
    renderGrid();
  }
}

// ── Tag bar ───────────────────────────────────────────────────────────────────
function buildTagBar() {
  const bar = document.getElementById('tagBar');
  if (!bar) return;
  const tags = [...new Set(allPosts.flatMap(p => p.tags || []))].slice(0, 12);
  if (!tags.length) { bar.style.display = 'none'; return; }
  bar.innerHTML = `<span class="tag-pill active" data-tag="">All</span>` +
    tags.map(t => `<span class="tag-pill" data-tag="${esc(t)}">${esc(t)}</span>`).join('');
  bar.querySelectorAll('.tag-pill').forEach(el => {
    el.addEventListener('click', () => {
      bar.querySelectorAll('.tag-pill').forEach(p => p.classList.remove('active'));
      el.classList.add('active');
      const tag = el.dataset.tag;
      filtered = tag ? allPosts.filter(p => (p.tags||[]).includes(tag)) : [...allPosts];
      page = 1; renderGrid();
    });
  });
}

// ── Render grid ───────────────────────────────────────────────────────────────
function renderGrid() {
  const grid = document.getElementById('postsGrid');
  const cnt  = document.getElementById('postsCount');
  if (!grid) return;
  if (cnt) cnt.textContent = `${filtered.length} post${filtered.length!==1?'s':''}`;
  const start = (page-1) * PER_PAGE;
  const slice = filtered.slice(start, start+PER_PAGE);
  if (!slice.length) {
    grid.innerHTML = `<div class="empty"><div class="empty-ico">📭</div><h3>No posts yet</h3><p>Visit the <a href="admin/">admin panel</a> to publish your first post.</p></div>`;
    if (document.getElementById('pagination')) document.getElementById('pagination').innerHTML = '';
    return;
  }
  grid.innerHTML = slice.map(p => {
    const img = p.coverImage
      ? `<img class="post-img" src="${esc(p.coverImage)}" alt="${esc(p.title)}" loading="lazy" onerror="this.style.display='none'">`
      : `<div class="post-img-ph">✍️</div>`;
    const tags = (p.tags||[]).map(t=>`<span class="post-tag">${esc(t)}</span>`).join('');
    return `<article class="post-card" onclick="location.href='post.php?id=${esc(p.id)}'" tabindex="0">
      ${img}
      <div class="post-body">
        ${tags?`<div class="post-tags">${tags}</div>`:''}
        <div class="post-title">${esc(p.title)}</div>
        <div class="post-excerpt">${esc(p.excerpt||'')}</div>
        <div class="post-foot"><span class="post-date">📅 ${fmtDate(p.createdAt)}</span><span class="post-read">Read →</span></div>
      </div>
    </article>`;
  }).join('');
  renderPagination(filtered.length);
}

function renderPagination(total) {
  const el = document.getElementById('pagination');
  if (!el) return;
  const pages = Math.ceil(total/PER_PAGE);
  if (pages<=1) { el.innerHTML=''; return; }
  let h='';
  if (page>1) h+=`<button class="pg-btn" onclick="goPage(${page-1})">← Prev</button>`;
  for (let i=1;i<=pages;i++) h+=`<button class="pg-btn ${i===page?'active':''}" onclick="goPage(${i})">${i}</button>`;
  if (page<pages) h+=`<button class="pg-btn" onclick="goPage(${page+1})">Next →</button>`;
  el.innerHTML=h;
}
function goPage(p){ page=p; renderGrid(); window.scrollTo({top:0,behavior:'smooth'}); }

// ── Search ────────────────────────────────────────────────────────────────────
const si = document.getElementById('searchInput');
if (si) si.addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  filtered = q ? allPosts.filter(p =>
    p.title.toLowerCase().includes(q)||
    (p.excerpt||'').toLowerCase().includes(q)||
    (p.tags||[]).some(t=>t.toLowerCase().includes(q))
  ) : [...allPosts];
  page=1; renderGrid();
});

// ── Utils ─────────────────────────────────────────────────────────────────────
function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtDate(iso){ try{return new Date(iso).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'})}catch{return ''} }

// ── Init ──────────────────────────────────────────────────────────────────────
if (document.getElementById('postsGrid')) fetchPosts();
