/* blog.js — reads from localStorage (local preview mode) */
'use strict';

const PER_PAGE = 9;
let allPosts = [];
let filtered = [];
let page = 1;

// ── Data ─────────────────────────────────────────────────────────────────────

function getPosts() {
  try {
    const raw = localStorage.getItem('blog_posts');
    const posts = raw ? JSON.parse(raw) : [];
    return posts.filter(p => p.status === 'published')
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch { return []; }
}

function getPost(id) {
  try {
    const raw = localStorage.getItem('blog_posts');
    const posts = raw ? JSON.parse(raw) : [];
    return posts.find(p => p.id === id) || null;
  } catch { return null; }
}

function getMediaUrl(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem('blog_media');
    const media = raw ? JSON.parse(raw) : [];
    const m = media.find(x => x.id === id);
    return m ? m.data : null;
  } catch { return null; }
}

// ── Blog home ─────────────────────────────────────────────────────────────────

function initHome() {
  allPosts = getPosts();
  filtered = [...allPosts];
  buildTagBar();
  renderPosts();
  seedDemo();

  const si = document.getElementById('searchInput');
  if (si) si.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    filtered = q ? allPosts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.excerpt || '').toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    ) : [...allPosts];
    page = 1;
    renderPosts();
  });
}

function seedDemo() {
  // Only seed if no posts exist at all
  const raw = localStorage.getItem('blog_posts');
  const all = raw ? JSON.parse(raw) : [];
  if (all.length > 0) { allPosts = getPosts(); filtered = [...allPosts]; renderPosts(); return; }

  const demos = [
    {
      id: 'demo-1', title: 'Welcome to Your New Blog!', slug: 'welcome',
      status: 'published', excerpt: 'Your blog is set up and ready. Head to the admin panel to create real posts.',
      content: '<h2>Welcome!</h2><p>Your blog is live. Open <strong>admin/index.html</strong> to start creating posts. You can add rich text, images, tags, and more.</p><blockquote>This is a demo post. Delete it from the admin panel once you\'re ready.</blockquote>',
      tags: ['welcome', 'demo'], coverImage: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-2', title: 'How to Write Great Blog Posts', slug: 'how-to-write',
      status: 'published', excerpt: 'Tips and tricks for writing engaging content that your readers will love.',
      content: '<h2>Structure is everything</h2><p>Great blog posts have a clear beginning, middle, and end. Start with a hook, develop your ideas, and close with a strong conclusion.</p><h3>Use headings</h3><p>Break your content into sections. Readers scan before they read — make it easy for them.</p><ul><li>Keep paragraphs short</li><li>Use bullet lists for steps</li><li>Add images to break up text</li></ul>',
      tags: ['writing', 'tips'], coverImage: '', createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'demo-3', title: 'Getting Started with the Admin Panel', slug: 'admin-guide',
      status: 'published', excerpt: 'A quick guide to using the blog admin panel to manage your content.',
      content: '<h2>Admin Panel Guide</h2><p>Open <code>admin/index.html</code> to access the admin panel. Default password is <strong>admin123</strong> (change it in settings).</p><h3>Creating Posts</h3><p>Click <strong>New Post</strong> in the sidebar. Use the rich text editor to write your content, add a cover image from the media library, then publish.</p><h3>Media Library</h3><p>Upload images by dragging them onto the Media page. Select them when editing posts.</p>',
      tags: ['guide', 'admin'], coverImage: '', createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  localStorage.setItem('blog_posts', JSON.stringify(demos));
  allPosts = getPosts();
  filtered = [...allPosts];
  buildTagBar();
  renderPosts();
}

function buildTagBar() {
  const bar = document.getElementById('tagBar');
  if (!bar) return;
  const tags = [...new Set(allPosts.flatMap(p => p.tags || []))].slice(0, 12);
  if (!tags.length) { bar.innerHTML = ''; return; }
  bar.innerHTML = `<span class="tag-pill active" data-tag="">All</span>` +
    tags.map(t => `<span class="tag-pill" data-tag="${esc(t)}">${esc(t)}</span>`).join('');
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
  if (countEl) countEl.textContent = `${filtered.length} post${filtered.length !== 1 ? 's' : ''}`;

  const start = (page - 1) * PER_PAGE;
  const slice = filtered.slice(start, start + PER_PAGE);

  if (!slice.length) {
    grid.innerHTML = `<div class="empty"><div class="empty-ico">📭</div><h3>No posts yet</h3><p>Open <a href="admin/index.html">admin panel</a> to create your first post.</p></div>`;
    if (document.getElementById('pagination')) document.getElementById('pagination').innerHTML = '';
    return;
  }

  grid.innerHTML = slice.map(post => {
    const cover = post.coverImage ? getMediaUrl(post.coverImage) : null;
    const coverEl = cover
      ? `<img class="post-cover" src="${cover}" alt="${esc(post.title)}" loading="lazy">`
      : `<div class="post-cover-placeholder">✍️</div>`;
    const tags = (post.tags || []).map(t => `<span class="post-tag">${esc(t)}</span>`).join('');
    return `
      <article class="post-card" onclick="location.href='post.html?id=${post.id}'" role="link" tabindex="0">
        ${coverEl}
        <div class="post-body">
          ${tags ? `<div class="post-tags">${tags}</div>` : ''}
          <div class="post-title">${esc(post.title)}</div>
          <div class="post-excerpt">${esc(post.excerpt || '')}</div>
          <div class="post-foot">
            <span class="post-date">📅 ${fmtDate(post.createdAt)}</span>
            <span class="post-read">Read article →</span>
          </div>
        </div>
      </article>`;
  }).join('');

  renderPagination(filtered.length);
}

function renderPagination(total) {
  const el = document.getElementById('pagination');
  if (!el) return;
  const pages = Math.ceil(total / PER_PAGE);
  if (pages <= 1) { el.innerHTML = ''; return; }
  let html = '';
  if (page > 1) html += `<button class="pg-btn" onclick="goPage(${page - 1})">← Prev</button>`;
  for (let i = 1; i <= pages; i++) html += `<button class="pg-btn ${i === page ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  if (page < pages) html += `<button class="pg-btn" onclick="goPage(${page + 1})">Next →</button>`;
  el.innerHTML = html;
}

function goPage(p) { page = p; renderPosts(); window.scrollTo({ top: 0, behavior: 'smooth' }); }

// ── Single post ────────────────────────────────────────────────────────────────

function initPost() {
  const id = new URLSearchParams(location.search).get('id');
  const el = document.getElementById('postBody');
  if (!el || !id) { location.href = 'index.html'; return; }

  const post = getPost(id);
  if (!post) {
    el.innerHTML = `<div class="empty"><div class="empty-ico">😕</div><h3>Post not found</h3><p><a href="index.html">← Back to blog</a></p></div>`;
    return;
  }

  document.title = post.title + ' — Blog';
  const tags = (post.tags || []).map(t => `<span class="post-tag">${esc(t)}</span>`).join('');
  const cover = post.coverImage ? getMediaUrl(post.coverImage) : null;
  const coverEl = cover ? `<img class="post-page-cover" src="${cover}" alt="${esc(post.title)}">` : '';

  el.innerHTML = `
    <a href="index.html" class="back-link">← Back to all posts</a>
    ${tags ? `<div class="post-page-tags">${tags}</div>` : ''}
    <h1 class="post-page-title">${esc(post.title)}</h1>
    <div class="post-page-meta">
      <span>📅 ${fmtDate(post.createdAt)}</span>
      ${post.updatedAt && post.updatedAt !== post.createdAt ? `<span>Updated ${fmtDate(post.updatedAt)}</span>` : ''}
    </div>
    ${coverEl}
    <div class="post-content">${post.content || ''}</div>`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' }); }
  catch { return ''; }
}

// ── Init ──────────────────────────────────────────────────────────────────────
if (document.getElementById('postsGrid')) initHome();
if (document.getElementById('postBody')) initPost();
