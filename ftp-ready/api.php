<?php
require_once __DIR__ . '/config.php';

define('DATA_DIR',      __DIR__ . '/data/');
define('UPLOAD_DIR',    __DIR__ . '/uploads/');
define('POSTS_FILE',    DATA_DIR . 'posts.json');
define('MEDIA_FILE',    DATA_DIR . 'media.json');
define('SETTINGS_FILE', DATA_DIR . 'settings.json');
define('PRODUCTS_FILE', DATA_DIR . 'products.json');
define('REVIEWS_FILE',  DATA_DIR . 'reviews.json');

foreach ([DATA_DIR, UPLOAD_DIR] as $d) {
    if (!is_dir($d)) mkdir($d, 0755, true);
}

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

function defaultSettings() {
    return [
        'siteName'            => 'My Blog',
        'heroLabel'           => 'Latest Stories',
        'heroTitle'           => 'Ideas Worth',
        'heroTitleAccent'     => 'Sharing.',
        'heroSubtext'         => 'Explore articles, tutorials, and thoughts on design, technology, and everything in between.',
        'ctaBtn1Text'         => 'Explore Posts',
        'ctaBtn1Link'         => '#posts',
        'ctaBtn2Text'         => 'Contact Us',
        'ctaBtn2Link'         => '#contact',
        'showRating'          => true,
        'ratingValue'         => '4.9',
        'ratingCount'         => '48',
        'ratingText'          => 'Google reviews',
        'servicesLabel'       => 'WHAT WE COVER',
        'servicesTitle'       => 'Everything you need',
        'servicesTitleAccent' => 'to stay informed.',
        'servicesDesc'        => "From technical deep-dives to creative insights \xe2\x80\x94 there\xe2\x80\x99s something for every curious mind.",
        'services' => [
            ['id'=>'s1','icon'=>'💻','title'=>'Technology',  'desc'=>'Deep dives into the tools, platforms, and innovations shaping our digital world today.'],
            ['id'=>'s2','icon'=>'🎨','title'=>'Design',      'desc'=>'Aesthetics, UX principles, and the art of creating beautiful, functional experiences.'],
            ['id'=>'s3','icon'=>'🚀','title'=>'Business',    'desc'=>'Startups, strategy, growth hacking, and hard-won lessons from the entrepreneurial trenches.'],
            ['id'=>'s4','icon'=>'📱','title'=>'Development', 'desc'=>'Code tutorials, best practices, architecture patterns, and everything software engineering.'],
            ['id'=>'s5','icon'=>'🌍','title'=>'Lifestyle',   'desc'=>'Productivity, mindfulness, travel, and practical tips for living with intention and clarity.'],
            ['id'=>'s6','icon'=>'🔬','title'=>'Science',     'desc'=>'Breaking research, emerging technologies, and the endlessly curious wonders of our universe.'],
        ],
        'statsLabel'          => 'WHY READ US',
        'statsTitle'          => 'Numbers that',
        'statsTitleAccent'    => 'speak for us.',
        'stats' => [
            ['id'=>'t1','number'=>'100+',   'title'=>'Articles Published','desc'=>'A growing library of in-depth, well-researched articles across all topics.'],
            ['id'=>'t2','number'=>'20+',    'title'=>'Topics Covered',    'desc'=>'From tech and design to science and lifestyle — diverse and always expanding.'],
            ['id'=>'t3','number'=>'Weekly', 'title'=>'New Posts',         'desc'=>'Fresh content every week — no fillers, no clickbait, just real value.'],
            ['id'=>'t4','number'=>'Free',   'title'=>'Always Free',       'desc'=>'Every article is completely free to read. No paywalls, no subscriptions needed.'],
        ],
        'showProducts'        => true,
        'productsLabel'       => 'OUR PRODUCTS',
        'productsTitle'       => 'Top Picks',
        'productsTitleAccent' => 'for you.',
        'showReviews'         => true,
        'reviewsLabel'        => 'TESTIMONIALS',
        'reviewsTitle'        => 'What our readers',
        'reviewsTitleAccent'  => 'say.',
        'aboutLabel'          => 'ABOUT THIS BLOG',
        'aboutTitle'          => 'Written with',
        'aboutTitleAccent'    => 'passion.',
        'aboutText'           => "This blog exists to share ideas that challenge, inspire, and educate. Every post is written with care, backed by research, and designed to give you something real to take away. No noise \xe2\x80\x94 just signal.",
        'aboutFeatures' => [
            ['icon'=>'📖','title'=>'In-Depth Articles',  'desc'=>'Long-form content that actually explains things properly — not just surface-level summaries.'],
            ['icon'=>'🎯','title'=>'Actionable Insights','desc'=>'Every post ends with something you can apply today. Ideas you can act on immediately.'],
            ['icon'=>'🔄','title'=>'Regular Updates',    'desc'=>'New content published consistently every week — bookmark it and come back often.'],
            ['icon'=>'💬','title'=>'Community Focused',  'desc'=>'Written for real people with real questions. Your feedback shapes what we write next.'],
        ],
        'contactLabel'        => 'GET IN TOUCH',
        'contactTitle'        => "Let\xe2\x80\x99s",
        'contactTitleAccent'  => 'connect.',
        'contactDesc'         => "Have a story idea, want to collaborate, or just want to say hello? We\xe2\x80\x99d love to hear from you.",
        'email'               => 'hello@myblog.com',
        'phone'               => '098882 79429',
        'whatsapp'            => '919888279429',
        'address'             => 'Amritsar, Punjab, India',
        'hours'               => 'Mon \xe2\x80\x93 Sat, 9:00 AM \xe2\x80\x93 6:00 PM',
        'mapUrl'              => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109501.413965848!2d74.77448695!3d31.63400655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391963b6c23d3f79%3A0xf9f66b3d8aa5e982!2sAmritsar%2C%20Punjab!5e0!3m2!1sen!2sin!4v1719000000000!5m2!1sen!2sin',
        'footerText'          => "\xc2\xa9 2026 My Blog",
    ];
}

// ── Router ────────────────────────────────────────────────────────────────────
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id     = preg_replace('/[^a-z0-9_-]/i', '', $_GET['id'] ?? '');
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($action) {
    case 'login':    handleLogin($body);                  break;
    case 'posts':    handlePosts($method, $id, $body);    break;
    case 'post':     handlePosts($method, $id, $body);    break;
    case 'media':    handleMedia($method, $id);           break;
    case 'upload':   handleUpload();                      break;
    case 'file':     serveFile($id);                      break;
    case 'settings': handleSettings($method, $body);      break;
    case 'products': handleProducts($method, $id, $body); break;
    case 'reviews':  handleReviews($method, $id, $body);  break;
    default:         err('Unknown action', 404);
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

    if ($method === 'GET' && !$id) {
        $posts = readJson(POSTS_FILE);
        usort($posts, fn($a,$b) => strcmp($b['createdAt'], $a['createdAt']));
        if (!$isAdmin) {
            $posts = array_values(array_filter($posts, fn($p) => ($p['status'] ?? '') === 'published'));
        }
        resp($posts);
    }

    if ($method === 'GET' && $id) {
        $posts = readJson(POSTS_FILE);
        foreach ($posts as $p) {
            if ($p['id'] === $id) resp($p);
        }
        err('Post not found', 404);
    }

    requireAuth();

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

    if ($method === 'PUT' && $id) {
        $posts = readJson(POSTS_FILE);
        foreach ($posts as &$p) {
            if ($p['id'] === $id) {
                $title = trim($body['title'] ?? $p['title']);
                $p['title']      = $title;
                $p['slug']       = $body['slug'] ?? makeSlug($title);
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

    if ($method === 'DELETE' && $id) {
        $posts = readJson(POSTS_FILE);
        $posts = array_values(array_filter($posts, fn($p) => $p['id'] !== $id));
        writeJson(POSTS_FILE, $posts);
        resp(['success' => true]);
    }

    err('Method not allowed', 405);
}

// ── Settings ──────────────────────────────────────────────────────────────────
function handleSettings($method, $body) {
    if ($method === 'GET') {
        $saved    = readJson(SETTINGS_FILE);
        $defaults = defaultSettings();
        $settings = array_merge($defaults, $saved);
        foreach (['services','stats','aboutFeatures'] as $key) {
            if (isset($saved[$key]) && is_array($saved[$key]) && count($saved[$key])) {
                $settings[$key] = $saved[$key];
            }
        }
        resp($settings);
    }
    requireAuth();
    if ($method === 'POST') {
        $defaults = defaultSettings();
        $existing = readJson(SETTINGS_FILE);
        $merged   = array_merge($defaults, $existing, $body);
        writeJson(SETTINGS_FILE, $merged);
        resp($merged);
    }
    err('Method not allowed', 405);
}

// ── Products ──────────────────────────────────────────────────────────────────
function handleProducts($method, $id, $body) {
    $isAdmin = checkAuth();

    if ($method === 'GET' && !$id) {
        $products = readJson(PRODUCTS_FILE);
        usort($products, fn($a,$b) => strcmp($b['createdAt'] ?? '', $a['createdAt'] ?? ''));
        if (!$isAdmin) {
            $products = array_values(array_filter($products, fn($p) => ($p['status'] ?? '') === 'active'));
        }
        resp($products);
    }

    if ($method === 'GET' && $id) {
        $products = readJson(PRODUCTS_FILE);
        foreach ($products as $p) {
            if ($p['id'] === $id || ($p['slug'] ?? '') === $id) resp($p);
        }
        err('Product not found', 404);
    }

    requireAuth();

    if ($method === 'POST') {
        $name = trim($body['name'] ?? '');
        if (!$name) err('Name is required');
        $now = date('c');
        $product = [
            'id'          => uid(),
            'name'        => $name,
            'slug'        => $body['slug'] ?: makeSlug($name),
            'shortDesc'   => $body['shortDesc']   ?? '',
            'description' => $body['description'] ?? '',
            'price'       => $body['price']       ?? '',
            'category'    => $body['category']    ?? '',
            'brand'       => $body['brand']       ?? '',
            'image'       => $body['image']       ?? '',
            'features'    => $body['features']    ?? [],
            'status'      => $body['status']      ?? 'active',
            'createdAt'   => $now,
            'updatedAt'   => $now,
        ];
        $products   = readJson(PRODUCTS_FILE);
        $products[] = $product;
        writeJson(PRODUCTS_FILE, $products);
        resp($product, 201);
    }

    if ($method === 'PUT' && $id) {
        $products = readJson(PRODUCTS_FILE);
        foreach ($products as &$p) {
            if ($p['id'] === $id) {
                $name = trim($body['name'] ?? $p['name']);
                $p['name']        = $name;
                $p['slug']        = $body['slug']        ?? makeSlug($name);
                $p['shortDesc']   = $body['shortDesc']   ?? ($p['shortDesc'] ?? '');
                $p['description'] = $body['description'] ?? ($p['description'] ?? '');
                $p['price']       = $body['price']       ?? ($p['price'] ?? '');
                $p['category']    = $body['category']    ?? ($p['category'] ?? '');
                $p['brand']       = $body['brand']       ?? ($p['brand'] ?? '');
                $p['image']       = $body['image']       ?? ($p['image'] ?? '');
                $p['features']    = $body['features']    ?? ($p['features'] ?? []);
                $p['status']      = $body['status']      ?? ($p['status'] ?? 'active');
                $p['updatedAt']   = date('c');
                writeJson(PRODUCTS_FILE, $products);
                resp($p);
            }
        }
        err('Product not found', 404);
    }

    if ($method === 'DELETE' && $id) {
        $products = readJson(PRODUCTS_FILE);
        $products = array_values(array_filter($products, fn($p) => $p['id'] !== $id));
        writeJson(PRODUCTS_FILE, $products);
        resp(['success' => true]);
    }

    err('Method not allowed', 405);
}

// ── Reviews ───────────────────────────────────────────────────────────────────
function handleReviews($method, $id, $body) {
    $isAdmin = checkAuth();

    if ($method === 'GET' && !$id) {
        $reviews = readJson(REVIEWS_FILE);
        usort($reviews, fn($a,$b) => strcmp($b['createdAt'] ?? '', $a['createdAt'] ?? ''));
        if (!$isAdmin) {
            $reviews = array_values(array_filter($reviews, fn($r) => ($r['status'] ?? '') === 'published'));
        }
        resp($reviews);
    }

    if ($method === 'GET' && $id) {
        $reviews = readJson(REVIEWS_FILE);
        foreach ($reviews as $r) {
            if ($r['id'] === $id) resp($r);
        }
        err('Review not found', 404);
    }

    requireAuth();

    if ($method === 'POST') {
        $name = trim($body['name'] ?? '');
        if (!$name) err('Name is required');
        $now = date('c');
        $review = [
            'id'        => uid(),
            'name'      => $name,
            'location'  => $body['location'] ?? '',
            'rating'    => min(5, max(1, (int)($body['rating'] ?? 5))),
            'text'      => $body['text']   ?? '',
            'status'    => $body['status'] ?? 'published',
            'createdAt' => $now,
        ];
        $reviews   = readJson(REVIEWS_FILE);
        $reviews[] = $review;
        writeJson(REVIEWS_FILE, $reviews);
        resp($review, 201);
    }

    if ($method === 'PUT' && $id) {
        $reviews = readJson(REVIEWS_FILE);
        foreach ($reviews as &$r) {
            if ($r['id'] === $id) {
                $r['name']     = trim($body['name']   ?? $r['name']);
                $r['location'] = $body['location'] ?? ($r['location'] ?? '');
                $r['rating']   = min(5, max(1, (int)($body['rating'] ?? $r['rating'])));
                $r['text']     = $body['text']   ?? ($r['text'] ?? '');
                $r['status']   = $body['status'] ?? ($r['status'] ?? 'published');
                writeJson(REVIEWS_FILE, $reviews);
                resp($r);
            }
        }
        err('Review not found', 404);
    }

    if ($method === 'DELETE' && $id) {
        $reviews = readJson(REVIEWS_FILE);
        $reviews = array_values(array_filter($reviews, fn($r) => $r['id'] !== $id));
        writeJson(REVIEWS_FILE, $reviews);
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
