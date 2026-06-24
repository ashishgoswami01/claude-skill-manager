╔══════════════════════════════════════════════════════════╗
║              BLOG CMS — LOCAL PREVIEW                    ║
╚══════════════════════════════════════════════════════════╝

HOW TO OPEN
───────────
1. Open index.html in your browser to see the public blog
2. Open admin/index.html to manage your blog content

No server needed. Everything runs in your browser using localStorage.

DEFAULT PASSWORD
────────────────
  admin123

(Change it in Admin Panel → Settings → Change Password)

FILE STRUCTURE
──────────────
local-preview/
├── index.html          ← Public blog homepage
├── post.html           ← Single post view
├── admin/
│   └── index.html      ← Admin panel (login required)
└── assets/
    ├── css/style.css   ← Blog styles
    └── js/blog.js      ← Blog JavaScript

ADMIN FEATURES
──────────────
✅ Dashboard with post/media stats
✅ Create posts with rich text editor (Quill)
✅ Edit and delete posts
✅ Drag-and-drop image upload
✅ Media library with gallery
✅ Set cover images on posts
✅ Tags and status (draft/published)
✅ Search and filter posts
✅ Export/import all data as JSON
✅ Change admin password
✅ Settings (blog name, author, etc.)

DEPLOY TO NETLIFY
─────────────────
The main project (one folder up) has the Netlify version with:
- Real backend via Netlify Functions
- Persistent storage via Netlify Blobs
- Set ADMIN_PASSWORD and SECRET_KEY in Netlify env vars

NOTE
────
This local version stores all data in browser localStorage (~5 MB limit).
For production, deploy the Netlify version for unlimited storage.
