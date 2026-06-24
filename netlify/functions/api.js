const { getStore } = require('@netlify/blobs');
const crypto = require('crypto');

// ── helpers ──────────────────────────────────────────────────────────────────

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

const json = (body, status = 200) => ({
  statusCode: status,
  headers: { ...CORS, 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const err = (msg, status = 400) => json({ error: msg }, status);

function makeToken(password) {
  const secret = process.env.SECRET_KEY || 'skill-manager-secret-2026';
  return crypto.createHmac('sha256', secret).update(password).digest('hex');
}

function checkAuth(event) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false; // no password set → open (dev mode)
  const auth = event.headers['authorization'] || event.headers['Authorization'] || '';
  const token = auth.replace('Bearer ', '').trim();
  return token === makeToken(password);
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── handlers ─────────────────────────────────────────────────────────────────

async function handleLogin(event) {
  const body = JSON.parse(event.body || '{}');
  const password = process.env.ADMIN_PASSWORD;

  if (!password) return json({ token: 'dev-mode', message: 'No password set — running in dev mode' });

  if (!body.password) return err('Password required');
  if (body.password !== password) return err('Incorrect password', 401);

  return json({ token: makeToken(password) });
}

// ── Posts ──

async function handlePosts(event, action, id) {
  const store = getStore('blog-posts');
  const method = event.httpMethod;

  // GET all posts (public)
  if (method === 'GET' && !id) {
    try {
      const raw = await store.get('index');
      const index = raw ? JSON.parse(raw) : [];
      // For public, only return published posts unless admin
      const isAdmin = checkAuth(event);
      const posts = isAdmin ? index : index.filter(p => p.status === 'published');
      return json(posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch {
      return json([]);
    }
  }

  // GET single post (public)
  if (method === 'GET' && id) {
    try {
      const raw = await store.get(`post-${id}`);
      if (!raw) return err('Post not found', 404);
      return json(JSON.parse(raw));
    } catch {
      return err('Post not found', 404);
    }
  }

  // Auth required for all mutations
  if (!checkAuth(event)) return err('Unauthorized', 401);

  // POST create
  if (method === 'POST') {
    const body = JSON.parse(event.body || '{}');
    if (!body.title) return err('Title is required');

    const post = {
      id: uid(),
      title: body.title,
      slug: body.slug || slugify(body.title),
      content: body.content || '',
      excerpt: body.excerpt || '',
      coverImage: body.coverImage || '',
      status: body.status || 'draft',
      tags: body.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await store.set(`post-${post.id}`, JSON.stringify(post));

    // update index
    const raw = await store.get('index');
    const index = raw ? JSON.parse(raw) : [];
    index.push({ id: post.id, title: post.title, slug: post.slug, status: post.status, excerpt: post.excerpt, coverImage: post.coverImage, tags: post.tags, createdAt: post.createdAt, updatedAt: post.updatedAt });
    await store.set('index', JSON.stringify(index));

    return json(post, 201);
  }

  // PUT update
  if (method === 'PUT' && id) {
    const raw = await store.get(`post-${id}`);
    if (!raw) return err('Post not found', 404);

    const existing = JSON.parse(raw);
    const body = JSON.parse(event.body || '{}');

    const updated = {
      ...existing,
      ...body,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    await store.set(`post-${id}`, JSON.stringify(updated));

    // update index entry
    const indexRaw = await store.get('index');
    const index = indexRaw ? JSON.parse(indexRaw) : [];
    const idx = index.findIndex(p => p.id === id);
    if (idx !== -1) {
      index[idx] = { id: updated.id, title: updated.title, slug: updated.slug, status: updated.status, excerpt: updated.excerpt, coverImage: updated.coverImage, tags: updated.tags, createdAt: updated.createdAt, updatedAt: updated.updatedAt };
    }
    await store.set('index', JSON.stringify(index));

    return json(updated);
  }

  // DELETE
  if (method === 'DELETE' && id) {
    await store.delete(`post-${id}`);
    const indexRaw = await store.get('index');
    const index = indexRaw ? JSON.parse(indexRaw) : [];
    await store.set('index', JSON.stringify(index.filter(p => p.id !== id)));
    return json({ success: true });
  }

  return err('Method not allowed', 405);
}

// ── Media ──

async function handleMedia(event, action, id) {
  if (!checkAuth(event)) return err('Unauthorized', 401);

  const store = getStore('blog-media');
  const method = event.httpMethod;

  // GET list
  if (method === 'GET' && !id) {
    const raw = await store.get('index');
    return json(raw ? JSON.parse(raw) : []);
  }

  // GET single file (serve binary)
  if (method === 'GET' && id) {
    const raw = await store.get(`media-${id}`);
    if (!raw) return err('Media not found', 404);
    const media = JSON.parse(raw);
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': media.type, 'Cache-Control': 'public, max-age=31536000' },
      body: media.data,
      isBase64Encoded: true,
    };
  }

  // POST upload
  if (method === 'POST') {
    const body = JSON.parse(event.body || '{}');
    if (!body.data || !body.name || !body.type) return err('name, type, and data (base64) required');

    // Strip data URL prefix if present
    const base64 = body.data.includes(',') ? body.data.split(',')[1] : body.data;
    const sizeBytes = Math.round((base64.length * 3) / 4);

    if (sizeBytes > 8 * 1024 * 1024) return err('File too large (max 8 MB)');

    const media = {
      id: uid(),
      name: body.name,
      type: body.type,
      size: sizeBytes,
      uploadedAt: new Date().toISOString(),
    };

    // Store binary separately
    await store.set(`media-${media.id}`, JSON.stringify({ ...media, data: base64 }));

    // Update index (without data to keep it small)
    const indexRaw = await store.get('index');
    const index = indexRaw ? JSON.parse(indexRaw) : [];
    const url = `/.netlify/functions/api?action=file&id=${media.id}`;
    index.push({ ...media, url });
    await store.set('index', JSON.stringify(index));

    return json({ ...media, url }, 201);
  }

  // DELETE
  if (method === 'DELETE' && id) {
    await store.delete(`media-${id}`);
    const indexRaw = await store.get('index');
    const index = indexRaw ? JSON.parse(indexRaw) : [];
    await store.set('index', JSON.stringify(index.filter(m => m.id !== id)));
    return json({ success: true });
  }

  return err('Method not allowed', 405);
}

// ── Main handler ──────────────────────────────────────────────────────────────

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  const params = event.queryStringParameters || {};
  const { action, id } = params;

  try {
    switch (action) {
      case 'login':  return handleLogin(event);
      case 'posts':  return handlePosts(event, action, id);
      case 'post':   return handlePosts(event, action, id);
      case 'media':  return handleMedia(event, action, id);
      case 'file':   return handleMedia(event, 'file', id);
      default:       return err('Unknown action', 404);
    }
  } catch (e) {
    console.error(e);
    return err('Internal server error: ' + e.message, 500);
  }
};
