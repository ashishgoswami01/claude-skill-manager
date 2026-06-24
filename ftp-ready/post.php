<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Post — My Blog</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/css/style.css" />
</head>
<body>

<nav class="nav">
  <div class="nav-in">
    <a href="index.html" class="nav-logo">✍️ <span>My Blog</span></a>
    <div class="nav-links">
      <a href="index.html">← All Posts</a>
      <a href="admin/" class="nav-btn">Admin ↗</a>
    </div>
  </div>
</nav>

<div class="post-page" id="postPage">
  <div class="loading"><div class="spinner"></div></div>
</div>

<footer class="footer">
  <p><a href="index.html">← Back to all posts</a></p>
</footer>

<script>
(function(){
  const API = 'api.php';
  const id  = new URLSearchParams(location.search).get('id');
  const el  = document.getElementById('postPage');

  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function fmt(iso){ try{return new Date(iso).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'})}catch{return ''} }

  if (!id) { location.href='index.html'; return; }

  fetch(API + '?action=post&id=' + encodeURIComponent(id))
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(post => {
      document.title = post.title + ' — My Blog';
      const tags = (post.tags||[]).map(t=>`<span class="post-tag">${esc(t)}</span>`).join('');
      const cover = post.coverImage ? `<img class="pp-cover" src="${esc(post.coverImage)}" alt="${esc(post.title)}">` : '';
      el.innerHTML = `
        <a href="index.html" class="back-link">← Back to all posts</a>
        ${tags?`<div class="pp-tags">${tags}</div>`:''}
        <h1 class="pp-title">${esc(post.title)}</h1>
        <div class="pp-meta">
          <span>📅 ${fmt(post.createdAt)}</span>
          ${post.updatedAt&&post.updatedAt!==post.createdAt?`<span>Updated ${fmt(post.updatedAt)}</span>`:''}
        </div>
        ${cover}
        <div class="post-content">${post.content||''}</div>`;
    })
    .catch(() => {
      el.innerHTML = '<div class="empty"><div class="empty-ico">😕</div><h3>Post not found</h3><p><a href="index.html">← Back to blog</a></p></div>';
    });
})();
</script>
</body>
</html>
