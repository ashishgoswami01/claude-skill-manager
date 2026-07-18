<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Products — My Blog</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/css/style.css" />
</head>
<body>

<nav class="nav">
  <div class="nav-in">
    <a href="index.html" class="nav-logo" id="navLogo">My <span>Blog</span></a>
    <div class="nav-links">
      <a href="index.html#services">Topics</a>
      <a href="products.php" style="color:var(--pu);font-weight:600">Products</a>
      <a href="index.html#posts">Blog</a>
      <a href="index.html#contact">Contact</a>
      <a href="admin/" class="nav-btn">Admin &#8599;</a>
    </div>
    <button class="mobile-menu-btn" onclick="toggleMenu()" aria-label="Menu">&#9776;</button>
  </div>
  <div class="mobile-nav" id="mobileNav">
    <a href="index.html#services" onclick="toggleMenu()">Topics</a>
    <a href="products.php" onclick="toggleMenu()">Products</a>
    <a href="index.html#posts" onclick="toggleMenu()">Blog</a>
    <a href="index.html#contact" onclick="toggleMenu()">Contact</a>
    <a href="admin/" class="nav-btn" style="display:inline-block;margin-top:4px">Admin &#8599;</a>
  </div>
</nav>

<div class="page-hero">
  <div class="sec-label">OUR PRODUCTS</div>
  <h1>All <span>Products</span></h1>
  <p>Browse our complete collection of products.</p>
</div>

<div class="prod-page-sec">
  <div class="prod-filter-bar">
    <input type="text" id="searchIn" placeholder="Search products&#8230;" oninput="filterProds()" />
    <div id="catFilters" style="display:flex;gap:8px;flex-wrap:wrap"></div>
  </div>
  <div id="prodCount" style="font-size:13px;color:var(--mu);margin-bottom:20px"></div>
  <div class="products-grid" id="prodGrid">
    <div class="loading"><div class="spinner"></div></div>
  </div>
</div>

<footer class="footer">
  <p><a href="index.html">&#8592; Back to home</a> &nbsp;&middot;&nbsp; <a href="admin/">Admin Panel</a></p>
</footer>

<script>
'use strict';
const API = 'api.php';
let allProds = [], activeCategory = '';

function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function toggleMenu() {
  const mn = document.getElementById('mobileNav');
  if (mn) mn.classList.toggle('open');
}

async function init() {
  try {
    const r = await fetch(API + '?action=settings');
    if (r.ok) {
      const s = await r.json();
      if (s.siteName) {
        document.title = 'Products — ' + s.siteName;
        const nl = document.getElementById('navLogo');
        if (nl) { const w = s.siteName.trim().split(' '); const l = w.pop(); nl.innerHTML = (w.length ? w.join(' ') + ' ' : '') + '<span>' + esc(l) + '</span>'; }
      }
    }
  } catch {}

  try {
    const r = await fetch(API + '?action=products');
    allProds = await r.json();
    if (!Array.isArray(allProds)) allProds = [];
  } catch { allProds = []; }

  buildCatFilters();
  renderProds();
}

function buildCatFilters() {
  const cats = [...new Set(allProds.map(p => p.category).filter(Boolean))].sort();
  if (!cats.length) return;
  const bar = document.getElementById('catFilters');
  bar.innerHTML = '<span class="cat-filter active" onclick="setCategory(\'\')">All</span>' +
    cats.map(c => '<span class="cat-filter" onclick="setCategory(\'' + c.replace(/'/g, "\\'") + '\')">' + esc(c) + '</span>').join('');
}

function setCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.cat-filter').forEach(el =>
    el.classList.toggle('active', el.textContent === (cat || 'All'))
  );
  renderProds();
}

function filterProds() { renderProds(); }

function renderProds() {
  const q = (document.getElementById('searchIn').value || '').toLowerCase().trim();
  let prods = allProds;
  if (activeCategory) prods = prods.filter(p => p.category === activeCategory);
  if (q) prods = prods.filter(p =>
    (p.name || '').toLowerCase().includes(q) ||
    (p.shortDesc || '').toLowerCase().includes(q) ||
    (p.category || '').toLowerCase().includes(q)
  );

  const cnt = document.getElementById('prodCount');
  if (cnt) cnt.textContent = prods.length + ' product' + (prods.length !== 1 ? 's' : '');

  const grid = document.getElementById('prodGrid');
  if (!prods.length) {
    grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><div class="empty-ico">📦</div><h3>No products found</h3><p>Try a different search or category.</p></div>';
    return;
  }
  grid.innerHTML = prods.map(p => {
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
}

init();
</script>
</body>
</html>
