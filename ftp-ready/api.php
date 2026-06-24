<?php
require_once __DIR__ . '/config.php';

// ── Dirs ──────────────────────────────────────────────────────────────────────
define('DATA_DIR',   __DIR__ . '/data/');
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('POSTS_FILE', DATA_DIR . 'posts.json');
define('MEDIA_FILE', DATA_DIR . 'media.json');

foreach ([DATA_DIR, UPLOAD_DIR] as $d) {
    if (!is_dir($d)) mkdir($d, 0755, true);
}

// ── Headers ───────────────────────────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); exit;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeToken() {
    return hash_hmac('sha256', ADMIN_PASSWORD, SECRET_KEY);
}

function checkAuth() {
    $auth = $_SERVER['HTTP_AUTHORIZATION']
         ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
         ?? getallheaders()['Authorization']
         ?? '';
    $token = trim(str_replace('Bearer', '', $auth));
    return $token === makeToken();
}

function readJson($file) {
    if (!file_exists($file)) return [];
    $data = json_decode(file_get_contents($file), true);
    return is_array($data) ? $data : [];
}

function writeJson($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

function uid() {
    return base_convert(time(), 10, 36) . substr(bin2hex(random_bytes(4)), 0, 6);
}

function makeSlug($str) {
    $str = strtolower(trim($str));
    $str = preg_replace('/[^a-z0-9\s-]/', '', $str);
    $str = preg_replace('/[\s-]+/', '-', $str);
    return trim($str, '-');
}

function resp($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function err($msg, $status = 400) {
    resp(['error' => $msg], $status);
}

function requireAuth() {
    if (!checkAuth()) err('Unauthorized', 401);
}

// ── Router ────────────────────────────────────────────────────────────────────
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id     = preg_replace('/[^a-z0-9_-]/i', '', $_GET['id'] ?? '');
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($action) {
    case 'login':  handleLogin($body);           break;
    case 'posts':  handlePosts($method, $id, $body); break;
    case 'post':   handlePosts($method, $id, $body); break;
    case 'media':  handleMedia($method, $id);    break;
    case 'upload': handleUpload();               break;
    case 'file':   serveFile($id);               break;
    default:       err('Unknown action', 404);
}

// ── Login ─────────────────────────────────────────────────────────────────────
function handleLogin($body) {
    $user = $body['username'] ?? '';
    $pw   = $body['password'] ?? '';
    if (!$user || !$pw) err('Username and password required');
    if ($user !== ADMIN_USERNAME || $pw !== ADMIN_PASSWORD) err('Incorrect username or password', 401);
    resp(['token' => makeToken()]);
}

// ── Posts ─────────────────────────────────────────────────────────────────────
function handlePosts($method, $id, $body) {
    $isAdmin = checkAuth();

    // GET list
    if ($method === 'GET' && !$id) {
        $posts = readJson(POSTS_FILE);
        usort($posts, fn($a,$b) => strcmp($b['createdAt'], $a['createdAt']));
        if (!$isAdmin) {
            $posts = array_values(array_filter($posts, fn($p) => ($p['status'] ?? '') === 'published'));
        }
        resp($posts);
    }

    // GET single
    if ($method === 'GET' && $id) {
        $posts = readJson(POSTS_FILE);
        foreach ($posts as $p) {
            if ($p['id'] === $id) resp($p);
        }
        err('Post not found', 404);
    }

    requireAuth();

    // POST create
    if ($method === 'POST') {
        $title = trim($body['title'] ?? '');
        if (!$title) err('Title is required');
        $now = date('c');
        $post = [
            'id'         => uid(),
            'title'      => $title,
            'slug'       => $body['slug'] ?: makeSlug($title),
            'content'    => $body['content'] ?? '',
            'excerpt'    => $body['excerpt'] ?? '',
            'coverImage' => $body['coverImage'] ?? '',
            'status'     => $body['status'] ?? 'draft',
            'tags'       => $body['tags'] ?? [],
            'createdAt'  => $now,
            'updatedAt'  => $now,
        ];
        $posts = readJson(POSTS_FILE);
        $posts[] = $post;
        writeJson(POSTS_FILE, $posts);
        resp($post, 201);
    }

    // PUT update
    if ($method === 'PUT' && $id) {
        $posts = readJson(POSTS_FILE);
        foreach ($posts as &$p) {
            if ($p['id'] === $id) {
                $title = trim($body['title'] ?? $p['title']);
                $p['title']      = $title;
                $p['slug']       = $body['slug'] ?? ($body['slug'] ?: makeSlug($title));
                $p['content']    = $body['content']    ?? $p['content'];
                $p['excerpt']    = $body['excerpt']    ?? $p['excerpt'];
                $p['coverImage'] = $body['coverImage'] ?? $p['coverImage'];
                $p['status']     = $body['status']     ?? $p['status'];
                $p['tags']       = $body['tags']       ?? $p['tags'];
                $p['updatedAt']  = date('c');
                writeJson(POSTS_FILE, $posts);
                resp($p);
            }
        }
        err('Post not found', 404);
    }

    // DELETE
    if ($method === 'DELETE' && $id) {
        $posts = readJson(POSTS_FILE);
        $posts = array_values(array_filter($posts, fn($p) => $p['id'] !== $id));
        writeJson(POSTS_FILE, $posts);
        resp(['success' => true]);
    }

    err('Method not allowed', 405);
}

// ── Media list / delete ───────────────────────────────────────────────────────
function handleMedia($method, $id) {
    requireAuth();

    if ($method === 'GET') {
        resp(readJson(MEDIA_FILE));
    }

    if ($method === 'DELETE' && $id) {
        $media = readJson(MEDIA_FILE);
        $found = null;
        foreach ($media as $m) {
            if ($m['id'] === $id) { $found = $m; break; }
        }
        if ($found && !empty($found['filename'])) {
            $path = UPLOAD_DIR . basename($found['filename']);
            if (file_exists($path)) unlink($path);
        }
        $media = array_values(array_filter($media, fn($m) => $m['id'] !== $id));
        writeJson(MEDIA_FILE, $media);
        resp(['success' => true]);
    }

    err('Method not allowed', 405);
}

// ── File upload ───────────────────────────────────────────────────────────────
function handleUpload() {
    requireAuth();
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') err('POST required', 405);

    if (empty($_FILES['file'])) err('No file uploaded');
    $file = $_FILES['file'];
    if ($file['error'] !== UPLOAD_ERR_OK) err('Upload error: ' . $file['error']);

    $maxBytes = MAX_UPLOAD_MB * 1024 * 1024;
    if ($file['size'] > $maxBytes) err('File too large (max ' . MAX_UPLOAD_MB . ' MB)');

    $allowed = ['image/jpeg','image/png','image/gif','image/webp','image/svg+xml'];
    $finfo   = new finfo(FILEINFO_MIME_TYPE);
    $mime    = $finfo->file($file['tmp_name']);
    if (!in_array($mime, $allowed)) err('File type not allowed. Use JPEG, PNG, GIF, WebP or SVG.');

    $ext  = pathinfo($file['name'], PATHINFO_EXTENSION);
    $safe = substr(preg_replace('/[^a-z0-9]/i', '', pathinfo($file['name'], PATHINFO_FILENAME)), 0, 40);
    $fname = $safe . '_' . uid() . '.' . strtolower($ext);
    $dest  = UPLOAD_DIR . $fname;

    if (!move_uploaded_file($file['tmp_name'], $dest)) err('Failed to save file');
    chmod($dest, 0644);

    $media = readJson(MEDIA_FILE);
    $entry = [
        'id'         => uid(),
        'name'       => $file['name'],
        'filename'   => $fname,
        'type'       => $mime,
        'size'       => $file['size'],
        'url'        => 'uploads/' . $fname,
        'uploadedAt' => date('c'),
    ];
    $media[] = $entry;
    writeJson(MEDIA_FILE, $media);

    header('Content-Type: application/json');
    resp($entry, 201);
}

// ── Serve file (fallback) ─────────────────────────────────────────────────────
function serveFile($id) {
    $media = readJson(MEDIA_FILE);
    foreach ($media as $m) {
        if ($m['id'] === $id) {
            $path = UPLOAD_DIR . basename($m['filename']);
            if (!file_exists($path)) err('File not found', 404);
            header('Content-Type: ' . $m['type']);
            header('Cache-Control: public, max-age=31536000');
            header('Content-Length: ' . filesize($path));
            readfile($path);
            exit;
        }
    }
    err('File not found', 404);
}
