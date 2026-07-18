'use strict';
const API = 'api.php';
const PER_PAGE = 6;
let allPosts = [], allTags = [], activeTags = [], page = 1, searchQ = '';

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function fmt(iso) {
  try { return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return ''; }
}
function starsHtml(n) {
  const v = parseFloat(n) || 5;
  const full = Math.floor(v);
  const half = (v % 1) >= 0.5;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
}
function setText(id, val) { const el = document.getElementById(id); if (el && val != null) el.textContent = val; }
function setHtml(id, val) { const el = document.getElementById(id); if (el && val != null) el.innerHTML = val; }

// ── Settings ──────────────────────────────────────────────────────────────────
async function loadSettings() {
  try {
    const r = await fetch(API + '?action=settings');
    if (!r.ok) return;
    applySettings(await r.json());
  } catch { /* use HTML defaults */ }
}

function applySettings(s) {
  if (s.siteName) {
    document.title = s.siteName;
    const nl = document.getElementById('navLogo');
    if (nl) {
      const words = s.siteName.trim().split(' ');
      const last = words.pop();
      nl.innerHTML = (words.length ? words.join(' ') + ' ' : '') + '<span>' + esc(last) + '</span>';
    }
  }

  setText('heroLabel', s.heroLabel);
  const hh = document.getElementById('heroHeading');
  if (hh) hh.innerHTML = esc(s.heroTitle || '') + '<br><span id="heroAccent">' + esc(s.heroTitleAccent || '') + '</span>';
  setText('heroSubtext', s.heroSubtext);

  const b1 = document.getElementById('ctaBtn1');
  if (b1 && s.ctaBtn1Text) { b1.textContent = s.ctaBtn1Text; b1.href = s.ctaBtn1Link || '#posts'; }
  const b2 = document.getElementById('ctaBtn2');
  if (b2 && s.ctaBtn2Text) { b2.textContent = s.ctaBtn2Text; b2.href = s.ctaBtn2Link || '#contact'; }

  const rat = document.getElementById('heroRating');
  if (rat) {
    if (s.showRating === false) { rat.style.display = 'none'; }
    else {
      setText('heroStars', starsHtml(parseFloat(s.ratingValue) || 4.9));
      setText('heroRatingText', (s.ratingValue || '4.9') + ' · ' + (s.ratingCount || '48') + ' ' + (s.ratingText || 'Google reviews'));
    }
  }

  setText('servicesLabel', s.servicesLabel);
  setText('servicesTitle', s.servicesTitle);
  setText('servicesTitleAccent', s.servicesTitleAccent);
  setText('servicesDesc', s.servicesDesc);
  if (Array.isArray(s.services) && s.services.length) {
    setHtml('servicesGrid', s.services.map(sv =>
      '<div class="cat-card">' +
        '<div class="cat-ico">' + esc(sv.icon) + '</div>' +
        '<div class="cat-title">' + esc(sv.title) + '</div>' +
        '<div class="cat-desc">' + esc(sv.desc) + '</div>' +
      '</div>'
    ).join(''));
  }

  setText('statsLabel', s.statsLabel);
  setText('statsTitle', s.statsTitle);
  setText('statsTitleAccent', s.statsTitleAccent);
  if (Array.isArray(s.stats) && s.stats.length) {
    setHtml('statsRow', s.stats.map(st =>
      '<div class="st-card">' +
        '<div class="st-num">' + esc(st.number) + '</div>' +
        '<div class="st-title">' + esc(st.title) + '</div>' +
        '<div class="st-desc">' + esc(st.desc) + '</div>' +
      '</div>'
    ).join(''));
  }

  const pSec = document.getElementById('products');
  if (pSec) pSec.style.display = (s.showProducts === false) ? 'none' : '';
  setText('productsLabel', s.productsLabel);
  setText('productsTitle', s.productsTitle);
  setText('productsTitleAccent', s.productsTitleAccent);

  const rSec = document.getElementById('reviews');
  if (rSec) rSec.style.display = (s.showReviews === false) ? 'none' : '';
  setText('reviewsLabel', s.reviewsLabel);
  setText('reviewsTitle', s.reviewsTitle);
  setText('reviewsTitleAccent', s.reviewsTitleAccent);

  setText('aboutLabel', s.aboutLabel);
  setText('aboutTitle', s.aboutTitle);
  setText('aboutTitleAccent', s.aboutTitleAccent);
  setText('aboutText', s.aboutText);
  if (Array.isArray(s.aboutFeatures) && s.aboutFeatures.length) {
    setHtml('aboutFeatures', s.aboutFeatures.map(f =>
      '<div class="feat-item">' +
        '<div class="feat-ico">' + esc(f.icon) + '</div>' +
        '<div><div class="feat-t">' + esc(f.title) + '</div><div class="feat-d">' + esc(f.desc) + '</div></div>' +
      '</div>'
    ).join(''));
  }

  setText('contactLabel', s.contactLabel);
  setText('contactTitle', s.contactTitle);
  setText('contactTitleAccent', s.contactTitleAccent);
  setText('contactDesc', s.contactDesc);

  if (s.email) { const el = document.getElementById('contactEmail'); if (el) { el.textContent = s.email; el.href = 'mailto:' + s.email; } }
  if (s.phone) { const el = document.getElementById('contactPhone'); if (el) { el.textContent = s.phone; el.href = 'tel:+' + s.phone.replace(/\D/g, ''); } }
  if (s.whatsapp) { const el = document.getElementById('contactWhatsapp'); if (el) el.href = 'https://wa.me/' + s.whatsapp; }
  setText('contactHours', s.hours);
  setText('contactAddress', s.address);
  if (s.mapUrl) { const m = document.getElementById('contactMap'); if (m) m.src = s.mapUrl; }

  if (s.footerText) {
    const ft = document.getElementById('footerText');
    if (ft) ft.innerHTML = esc(s.footerText) + ' &nbsp;&middot;&nbsp; <a href="#home">Back to top &uarr;</a> &nbsp;&middot;&nbsp; <a href="admin/">Admin Panel</a>';
  }
}

// ── Products showcase ─────────────────────────────────────────────────────────
async function loadProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  try {
    const r = await fetch(API + '?action=products');
    const products = await r.json();
    if (!Array.isArray(products) || !products.length) {
      grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><div class="empty-ico">📦</div><h3>No products yet</h3><p>Products added in admin will appear here.</p></div>';
      return;
    }
    grid.innerHTML = products.slice(0, 4).map(p => {
      const img = p.image
        ? '<img class="prod-img" src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" />'
        : '<div class="prod-img-ph">📦</div>';
      return '<a class="prod-card" href="product-detail.php?id=' + encodeURIComponent(p.id) + '">' +
        img + '<div class="prod-body">' +
        (p.category ? '<div class="prod-cat">' + esc(p.category) + '</div>' : '') +
        '<div class="prod-name">' + esc(p.name) + '</div>' +
        (p.shortDesc ? '<div class="prod-desc">' + esc(p.shortDesc) + '</div>' : '') +
        (p.price ? '<div class="prod-price">' + esc(p.price) + '</div>' : '') +
        '</div></a>';
    }).join('');
  } catch { grid.innerHTML = ''; }
}

// ── Reviews ───────────────────────────────────────────────────────────────────
async function loadReviews() {
  const grid = document.getElementById('reviewsGrid');
  if (!grid) return;
  try {
    const r = await fetch(API + '?action=reviews');
    const reviews = await r.json();
    if (!Array.isArray(reviews) || !reviews.length) {
      grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><div class="empty-ico">💬</div><h3>No reviews yet</h3><p>Reviews added in admin will appear here.</p></div>';
      return;
    }
    grid.innerHTML = reviews.slice(0, 3).map(rv =>
      '<div class="review-card">' +
        '<div class="review-stars">' + '★'.repeat(Math.min(5, Math.max(1, rv.rating || 5))) + '</div>' +
        '<p class="review-text">"' + esc(rv.text) + '"</p>' +
        '<div class="review-author">' +
          '<div class="review-avatar">' + esc((rv.name || 'A')[0].toUpperCase()) + '</div>' +
          '<div>' +
            '<div class="review-name">' + esc(rv.name) + '</div>' +
            (rv.location ? '<div class="review-loc">' + esc(rv.location) + '</div>' : '') +
          '</div>' +
        '</div>' +
      '</div>'
    ).join('');
  } catch { grid.innerHTML = ''; }
}

// ── Blog Posts ────────────────────────────────────────────────────────────────
async function loadPosts() {
  try {
    const r = await fetch(API + '?action=posts');
    allPosts = await r.json();
    if (!Array.isArray(allPosts)) allPosts = [];
  } catch { allPosts = []; }
  buildTagBar();
  renderPosts();
}

function buildTagBar() {
  const tagSet = new Set();
  allPosts.forEach(p => (p.tags || []).forEach(t => tagSet.add(t)));
  allTags = [...tagSet].sort();
  const bar = document.getElementById('tagBar');
  if (!bar || !allTags.length) return;
  bar.innerHTML = allTags.map(t =>
    '<span class="tag-pill" onclick="toggleTag(\'' + t.replace(/'/g, "\\'") + '\')">' + esc(t) + '</span>'
  ).join('');
}

function toggleTag(t) {
  if (activeTags.includes(t)) activeTags = activeTags.filter(x => x !== t);
  else activeTags.push(t);
  document.querySelectorAll('.tag-pill').forEach(el =>
    el.classList.toggle('active', activeTags.includes(el.textContent))
  );
  page = 1; renderPosts();
}

function searchPosts() {
  searchQ = (document.getElementById('searchInput').value || '').toLowerCase().trim();
  page = 1; renderPosts();
}

function renderPosts() {
  let posts = allPosts;
  if (searchQ) posts = posts.filter(p =>
    (p.title || '').toLowerCase().includes(searchQ) ||
    (p.excerpt || '').toLowerCase().includes(searchQ)
  );
  if (activeTags.length) posts = posts.filter(p =>
    activeTags.every(t => (p.tags || []).includes(t))
  );

  const total = posts.length;
  const cnt = document.getElementById('postsCount');
  if (cnt) cnt.textContent = total + ' post' + (total !== 1 ? 's' : '');

  const pages = Math.ceil(total / PER_PAGE) || 1;
  if (page > pages) page = pages;
  const slice = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const grid = document.getElementById('postsGrid');
  if (!grid) return;

  if (!slice.length) {
    grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><div class="empty-ico">📭</div><h3>No posts found</h3><p>Try a different search or remove tag filters.</p></div>';
  } else {
    grid.innerHTML = slice.map(p => {
      const img = p.coverImage
        ? '<img class="post-img" src="' + esc(p.coverImage) + '" alt="' + esc(p.title) + '" loading="lazy" />'
        : '<div class="post-img-ph">📝</div>';
      const tags = (p.tags || []).map(t => '<span class="post-tag">' + esc(t) + '</span>').join('');
      return '<div class="post-card" onclick="location.href=\'post.php?id=' + encodeURIComponent(p.id) + '\'">' +
        img + '<div class="post-body">' +
        (tags ? '<div class="post-tags">' + tags + '</div>' : '') +
        '<div class="post-title">' + esc(p.title) + '</div>' +
        '<div class="post-excerpt">' + esc(p.excerpt || '') + '</div>' +
        '<div class="post-foot"><span class="post-date">' + fmt(p.createdAt) + '</span><span class="post-read">Read more &rarr;</span></div>' +
        '</div></div>';
    }).join('');
  }

  const pg = document.getElementById('pagination');
  if (!pg) return;
  if (pages <= 1) { pg.innerHTML = ''; return; }
  let btns = '';
  if (page > 1) btns += '<button class="pg-btn" onclick="goPage(' + (page - 1) + ')">&laquo; Prev</button>';
  for (let i = 1; i <= pages; i++)
    btns += '<button class="pg-btn' + (i === page ? ' active' : '') + '" onclick="goPage(' + i + ')">' + i + '</button>';
  if (page < pages) btns += '<button class="pg-btn" onclick="goPage(' + (page + 1) + ')">Next &raquo;</button>';
  pg.innerHTML = btns;
}

function goPage(n) {
  page = n; renderPosts();
  const el = document.getElementById('posts');
  if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
}

function toggleMenu() {
  const mn = document.getElementById('mobileNav');
  if (mn) mn.classList.toggle('open');
}

loadSettings();
loadProducts();
loadReviews();
loadPosts();
