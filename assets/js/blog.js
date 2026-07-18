'use strict';

const API = '/.netlify/functions/api';
const PER_PAGE = 9;

let allPosts = [];
let filtered = [];
let page = 1;

async function fetchPosts() {
  showLoading();
  try {
    const res = await fetch(`${API}?action=posts`);
    allPosts = await res.json();
    allPosts = Array.isArray(allPosts) ? allPosts : [];
    filtered = [...allPosts];
    buildTagBar();
    renderPosts();
  } catch {
    allPosts = [];
    filtered = [];
    renderPosts();
  }
}

function buildTagBar() {
  const bar = document.getElementById('tagBar');
  if (!bar) return;
  const tags = [...new Set(allPosts.flatMap(p => p.tags || []))].slice(0, 10);
  bar.innerHTML = `<span class="tag-pill active" data-tag="">All</span>` +
    tags.map(t => `<span class="tag-pill" data-tag="${t}">${t}</span>`).join('');
  bar.querySelectorAll('.tag-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      bar.querySelectorAll('.tag-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const tag = pill.dataset.tag;
      filtered = tag ? allPosts.filter(p => (p.tags || []).includes(tag)) : [...allPosts];
      page = 1;
      renderPosts();
    });
  });
}

function renderPosts() {
  const grid = document.getElementById('postsGrid');
  const countEl = document.getElementById('postsCount');
  if (!grid) return;

  const start = (page - 1) * PER_PAGE;
  const slice = filtered.slice(start, start + PER_PAGE);

  if (countEl) countEl.textContent = `${filtered.length} post${filtered.length !== 1 ? 's' : ''}`;

  if (!slice.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="big">📭</div><p>No posts yet. Check back soon!</p></div>`;
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  grid.innerHTML = slice.map(post => {
    const imgEl = post.coverImage
      ? `<img class="post-card-img" src="${API}?action=file&id=${post.coverImage}" alt="${esc(post.title)}" loading="lazy" onerror="this.style.display='none'">`
      : `<div class="post-card-img placeholder">✍️</div>`;
    const tags = (post.tags || []).map(t => `<span class="post-tag">${esc(t)}</span>`).join('');
    return `
      <article class="post-card" onclick="location.href='post.html?id=${post.id}'">
        ${imgEl}
        <div class="post-card-body">
          ${tags ? `<div class="post-card-tags">${tags}</div>` : ''}
          <div class="post-card-title">${esc(post.title)}</div>
          <div class="post-card-excerpt">${esc(post.excerpt || '')}</div>
          <div class="post-card-footer">
            <span class="post-card-date">${fmtDate(post.createdAt)}</span>
            <span class="post-card-read">Read →</span>
          </div>
        </div>
      </article>`;
  }).join('');

  renderPagination(filtered.length);
}

function renderPagination(total) {
  const pag = document.getElementById('pagination');
  if (!pag) return;
  const pages = Math.ceil(total / PER_PAGE);
  if (pages <= 1) { pag.innerHTML = ''; return; }
  let html = '';
  if (page > 1) html += `<button class="page-btn" onclick="goPage(${page - 1})">← Prev</button>`;
  for (let i = 1; i <= pages; i++) html += `<button class="page-btn ${i === page ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  if (page < pages) html += `<button class="page-btn" onclick="goPage(${page + 1})">Next →</button>`;
  pag.innerHTML = html;
}

function goPage(p) {
  page = p;
  renderPosts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showLoading() {
  const grid = document.getElementById('postsGrid');
  if (grid) grid.innerHTML = `<div class="loading" style="grid-column:1/-1"><div class="spinner"></div></div>`;
}

// ── Search ──
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    filtered = q ? allPosts.filter(p => p.title.toLowerCase().includes(q) || (p.excerpt || '').toLowerCase().includes(q) || (p.tags || []).some(t => t.toLowerCase().includes(q))) : [...allPosts];
    page = 1;
    renderPosts();
  });
}

// ── Single post ──
async function loadPost() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) { location.href = 'index.html'; return; }
  const el = document.getElementById('postBody');
  if (!el) return;
  el.innerHTML = `<div class="loading"><div class="spinner"></div></div>`;
  try {
    const res = await fetch(`${API}?action=post&id=${id}`);
    if (!res.ok) throw new Error('not found');
    const post = await res.json();
    document.title = post.title + ' — Blog';
    const tags = (post.tags || []).map(t => `<span class="post-tag">${esc(t)}</span>`).join('');
    const cover = post.coverImage ? `<img class="post-page-cover" src="${API}?action=file&id=${post.coverImage}" alt="${esc(post.title)}">` : '';
    el.innerHTML = `
      <div class="post-page-header">
        ${tags ? `<div class="post-page-tags">${tags}</div>` : ''}
        <h1 class="post-page-title">${esc(post.title)}</h1>
        <div class="post-page-meta">
          <span>${fmtDate(post.createdAt)}</span>
          ${post.updatedAt !== post.createdAt ? `<span>Updated ${fmtDate(post.updatedAt)}</span>` : ''}
        </div>
      </div>
      ${cover}
      <div class="post-content">${post.content}</div>`;
  } catch {
    el.innerHTML = `<div class="empty-state"><div class="big">😕</div><p>Post not found.</p><a href="index.html">← Back to blog</a></div>`;
  }
}

// ── Utils ──
function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtDate(iso) { try { return new Date(iso).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' }); } catch { return ''; } }

// ── Init ──
if (document.getElementById('postsGrid')) fetchPosts();
if (document.getElementById('postBody')) loadPost();
