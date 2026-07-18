<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Product — My Blog</title>
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
      <a href="products.php">Products</a>
      <a href="index.html#posts">Blog</a>
      <a href="index.html#contact">Contact</a>
      <a href="admin/" class="nav-btn">Admin &#8599;</a>
    </div>
    <button class="mobile-menu-btn" onclick="document.getElementById('mobileNav').classList.toggle('open')" aria-label="Menu">&#9776;</button>
  </div>
  <div class="mobile-nav" id="mobileNav">
    <a href="index.html#services">Topics</a>
    <a href="products.php">Products</a>
    <a href="index.html#posts">Blog</a>
    <a href="index.html#contact">Contact</a>
    <a href="admin/" class="nav-btn" style="display:inline-block;margin-top:4px">Admin &#8599;</a>
  </div>
</nav>

<div id="pdWrap" style="max-width:100%">
  <div class="loading" style="padding:120px 0"><div class="spinner"></div></div>
</div>

<footer class="footer">
  <p><a href="products.php">&#8592; All Products</a> &nbsp;&middot;&nbsp; <a href="index.html">Home</a></p>
</footer>

<script>
'use strict';
const API = 'api.php';
const id = new URLSearchParams(location.search).get('id');

function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

if (!id) { location.href = 'products.php'; }

async function init() {
  // Load site name
  try {
    const r = await fetch(API + '?action=settings');
    if (r.ok) {
      const s = await r.json();
      if (s.siteName) {
        const nl = document.getElementById('navLogo');
        if (nl) { const w = s.siteName.trim().split(' '); const l = w.pop(); nl.innerHTML = (w.length ? w.join(' ') + ' ' : '') + '<span>' + esc(l) + '</span>'; }
      }
    }
  } catch {}

  try {
    const r = await fetch(API + '?action=products&id=' + encodeURIComponent(id));
    if (!r.ok) throw new Error('not found');
    const p = await r.json();
    render(p);
  } catch {
    document.getElementById('pdWrap').innerHTML =
      '<div class="empty" style="padding:120px 28px;text-align:center"><div class="empty-ico">😕</div><h3>Product not found</h3><p><a href="products.php">&#8592; Back to products</a></p></div>';
  }
}

function render(p) {
  document.title = (p.name || 'Product') + ' — My Blog';

  const img = p.image
    ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" style="width:100%;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,.1)" />'
    : '<div class="pd-img-ph">📦</div>';

  const feats = Array.isArray(p.features) && p.features.length
    ? '<div class="pd-feats"><h3>Key Features</h3><div class="pd-feat-list">' +
        p.features.map(f => '<div class="pd-feat">' + esc(f) + '</div>').join('') +
      '</div></div>'
    : '';

  const whatsapp = '919888279429'; // default; will be updated if settings loaded
  const actions = p.price
    ? '<div class="pd-actions">' +
        '<a class="btn-solid" href="index.html#contact">Enquire Now</a>' +
        '<a class="btn-outline" href="https://wa.me/' + whatsapp + '?text=' + encodeURIComponent('Hi, I am interested in: ' + (p.name || '')) + '" target="_blank" rel="noopener">WhatsApp</a>' +
      '</div>'
    : '<div class="pd-actions"><a class="btn-solid" href="index.html#contact">Enquire Now</a></div>';

  document.getElementById('pdWrap').innerHTML =
    '<a href="products.php" class="back-link" style="display:inline-flex;align-items:center;gap:6px;color:var(--mu);font-size:13.5px;padding:28px 28px 0;text-decoration:none">&#8592; All Products</a>' +
    '<div class="pd-wrap">' +
      '<div>' + img + '</div>' +
      '<div>' +
        (p.category ? '<div class="pd-cat">' + esc(p.category) + '</div>' : '') +
        '<div class="pd-name">' + esc(p.name) + '</div>' +
        (p.brand ? '<div class="pd-brand">Brand: <strong>' + esc(p.brand) + '</strong></div>' : '') +
        (p.price ? '<div class="pd-price">' + esc(p.price) + '</div>' : '') +
        (p.description ? '<div class="pd-desc">' + esc(p.description) + '</div>' : '') +
        feats +
        actions +
      '</div>' +
    '</div>';
}

init();
</script>
</body>
</html>
