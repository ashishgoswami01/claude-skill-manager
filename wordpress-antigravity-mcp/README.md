# wordpress-antigravity-mcp

An [MCP](https://modelcontextprotocol.io) server that gives an AI agent (Antigravity, Claude Desktop, Claude Code, or any MCP-compatible client) direct, tool-based access to a WordPress site via the built-in WordPress REST API.

It exposes tools to:

- **Content**: list/create/update/delete posts and pages, publish drafts, manage categories and tags
- **Media**: upload files (from a URL or base64), list/update/delete media library items
- **Comments & users**: list/moderate/reply to comments, manage user accounts and roles
- **Plugins & themes**: list, install, activate/deactivate plugins, list and activate themes
- **Database & theme files** (optional, via the bundled `wordpress-plugin/antigravity-connector` plugin): read-only SQL queries and theme file read/write

This repo has two parts:

1. **`src/`** — the MCP server (this README's main subject).
2. **`wordpress-plugin/antigravity-connector/`** — a small companion WordPress plugin. It's optional, but unlocks database queries and theme file editing, which the core WordPress REST API doesn't expose. It uses its own dedicated API key, kept separate from your Application Password, so this extra access can be granted or revoked independently.

## 1. Requirements

- Node.js 18+
- A WordPress site (5.6+) with the REST API enabled (default)
- An **Application Password** for a WordPress user with sufficient permissions for the actions you want to allow

## 2. Get a WordPress Application Password

1. Log in to your WordPress admin dashboard.
2. Go to **Users → Profile** (or **Users → Your Profile**).
3. Scroll to **Application Passwords**.
4. Enter a name (e.g. `antigravity-mcp`) and click **Add New Application Password**.
5. Copy the generated password — you won't be able to see it again.

> If you don't see this section, your host may have it disabled, or your site may need `https://` (Application Passwords require HTTPS, except on `localhost`).

## 3. (Optional) Install the Antigravity Connector plugin

Install this if you want the agent to run read-only SQL queries or read/write theme files — capabilities the core REST API doesn't provide.

1. Zip the `wordpress-plugin/antigravity-connector` folder, or copy it directly, into your site's `wp-content/plugins/` directory so the path is `wp-content/plugins/antigravity-connector/antigravity-connector.php`.
2. In WP Admin, go to **Plugins** and activate **Antigravity Connector**.
3. Go to **Settings → Antigravity Connector**:
   - Click **Generate API Key** and copy the key shown (it's only displayed once).
   - Optionally enable **Database queries** (read-only `SELECT` only) and/or **Theme file editing**.
   - Optionally restrict access to specific IP addresses.
4. Save the key as `WP_ANTIGRAVITY_API_KEY` in your `.env` (see step 4).

Both capabilities default to **off**. Leaving them off (or not installing the plugin at all) means the `wp_ag_*` tools are simply unavailable — everything else in this server works the same either way.

## 4. Install & build

```bash
cd wordpress-antigravity-mcp
npm install
npm run build
```

## 5. Configure credentials

Copy `.env.example` to `.env` and fill in your details:

```bash
cp .env.example .env
```

```env
WP_SITE_URL=https://yourdomain.com
WP_USERNAME=your-wp-username
WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx

# Optional - only if you installed the Antigravity Connector plugin (step 3)
WP_ANTIGRAVITY_API_KEY=
```

**Never commit `.env`** — it's already in `.gitignore`.

## 6. Connect it to Antigravity

Antigravity (and similar MCP-capable IDEs) let you register custom MCP servers, usually via **Settings → MCP Servers** (or an `mcp_config.json` / `mcp.json` file). Add an entry like:

```json
{
  "mcpServers": {
    "wordpress": {
      "command": "node",
      "args": ["/absolute/path/to/wordpress-antigravity-mcp/dist/index.js"],
      "env": {
        "WP_SITE_URL": "https://yourdomain.com",
        "WP_USERNAME": "your-wp-username",
        "WP_APP_PASSWORD": "xxxx xxxx xxxx xxxx xxxx xxxx",
        "WP_ANTIGRAVITY_API_KEY": "optional-connector-plugin-key"
      }
  