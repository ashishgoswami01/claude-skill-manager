=== Antigravity Connector ===
Contributors: wordpress-antigravity-mcp
Tags: api, mcp, rest, automation, ai
Requires at least: 5.6
Tested up to: 6.6
Requires PHP: 7.4
Stable tag: 1.0.0
License: MIT

Secure REST bridge for the wordpress-antigravity-mcp server used by Antigravity / Claude.

== Description ==

This plugin adds a small, dedicated REST API namespace (`/wp-json/antigravity/v1/`)
that the `wordpress-antigravity-mcp` MCP server can use to:

* Check site status (versions, active theme, enabled capabilities)
* Run read-only `SELECT` SQL queries (opt-in, off by default)
* List, read, and write files in the active theme's directory (read is always
  available once a key is set; writing is opt-in, off by default)
* List installed plugins

Authentication uses a dedicated API key (sent as the `X-Antigravity-Key`
header), generated and revoked from **Settings -> Antigravity Connector**.
This is intentionally separate from WordPress Application Passwords, so you
can grant or revoke this extra access independently.

== Installation ==

1. Upload the `antigravity-connector` folder to `/wp-content/plugins/`.
2. Activate the plugin through the "Plugins" menu in WordPress.
3. Go to Settings -> Antigravity Connector to generate an API key and
   configure optional capabilities (database queries, theme file writes,
   IP allowlist).

== Security ==

* All endpoints require a valid `X-Antigravity-Key` header. Without a
  generated key, every endpoint returns 403.
* Database queries are limited to a single `SELECT` statement; writes, DDL,
  and multi-statement queries are rejected regardless of settings.
* Theme file access is sandboxed to the active (or specified) theme's
  directory; path traversal outside that directory is rejected.
* Both database queries and theme file writes default to disabled.
* An optional IP allowlist can further restrict access.

== Changelog ==

= 1.0.0 =
* Initial release: status, db/query, theme/files, theme/file, plugins endpoints.
