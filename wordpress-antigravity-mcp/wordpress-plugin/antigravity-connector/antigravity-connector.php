<?php
/**
 * Plugin Name: Antigravity Connector
 * Description: Secure bridge that lets the wordpress-antigravity-mcp server (used by Antigravity / Claude) manage this site's database and theme files alongside the standard WordPress REST API.
 * Version: 1.0.0
 * Author: wordpress-antigravity-mcp
 * License: MIT
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ANTIGRAVITY_CONNECTOR_VERSION', '1.0.0');
define('ANTIGRAVITY_CONNECTOR_OPTION', 'antigravity_connector_settings');

class Antigravity_Connector {

    public function __construct() {
        add_action('admin_menu', [$this, 'add_settings_page']);
        add_action('admin_init', [$this, 'handle_admin_actions']);
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    /* ---------------------------------------------------------------
     * Settings
     * ------------------------------------------------------------- */

    public static function get_settings() {
        $defaults = [
            'api_key_hash'      => '',
            'api_key_prefix'    => '',
            'enable_db_query'   => false,
            'enable_file_write' => false,
            'allowed_ips'       => '',
        ];
        $stored = get_option(ANTIGRAVITY_CONNECTOR_OPTION, []);
        if (!is_array($stored)) {
            $stored = [];
        }
        return wp_parse_args($stored, $defaults);
    }

    public static function update_settings($settings) {
        update_option(ANTIGRAVITY_CONNECTOR_OPTION, $settings);
    }

    public function add_settings_page() {
        add_options_page(
            'Antigravity Connector',
            'Antigravity Connector',
            'manage_options',
            'antigravity-connector',
            [$this, 'render_settings_page']
        );
    }

    public function handle_admin_actions() {
        if (!is_admin() || !current_user_can('manage_options')) {
            return;
        }

        if (!isset($_POST['antigravity_action'])) {
            return;
        }

        check_admin_referer('antigravity_connector_settings');

        $settings = self::get_settings();
        $action = sanitize_text_field(wp_unslash($_POST['antigravity_action']));

        if ($action === 'generate_key') {
            $new_key = wp_generate_password(40, false, false);
            $settings['api_key_hash'] = wp_hash_password($new_key);
            $settings['api_key_prefix'] = substr($new_key, 0, 6);
            self::update_settings($settings);
            set_transient('antigravity_new_key_' . get_current_user_id(), $new_key, 60);
        } elseif ($action === 'revoke_key') {
            $settings['api_key_hash'] = '';
            $settings['api_key_prefix'] = '';
            self::update_settings($settings);
        } elseif ($action === 'save_options') {
            $settings['enable_db_query'] = isset($_POST['enable_db_query']);
            $settings['enable_file_write'] = isset($_POST['enable_file_write']);
            $settings['allowed_ips'] = sanitize_textarea_field(wp_unslash($_POST['allowed_ips'] ?? ''));
            self::update_settings($settings);
        }

        wp_safe_redirect(admin_url('options-general.php?page=antigravity-connector&updated=1'));
        exit;
    }

    public function render_settings_page() {
        if (!current_user_can('manage_options')) {
            return;
        }

        $settings = self::get_settings();
        $new_key = get_transient('antigravity_new_key_' . get_current_user_id());
        delete_transient('antigravity_new_key_' . get_current_user_id());
        ?>
        <div class="wrap">
            <h1>Antigravity Connector</h1>
            <p>Connects this site to the <code>wordpress-antigravity-mcp</code> server used by Antigravity / Claude.</p>

            <?php if ($new_key) : ?>
                <div class="notice notice-success">
                    <p><strong>New API key generated.</strong> Copy it now &mdash; it will not be shown again:</p>
                    <p><code style="font-size:14px;"><?php echo esc_html($new_key); ?></code></p>
                </div>
            <?php endif; ?>

            <h2>API Key</h2>
            <p>
                Status:
                <?php if (!empty($settings['api_key_hash'])) : ?>
                    <strong style="color:#1a7d1a;">Active</strong>
                    (starts with <code><?php echo esc_html($settings['api_key_prefix']); ?>&hellip;</code>)
                <?php else : ?>
                    <strong style="color:#a00;">Not set</strong>
                <?php endif; ?>
            </p>
            <form method="post">
                <?php wp_nonce_field('antigravity_connector_settings'); ?>
                <input type="hidden" name="antigravity_action" value="generate_key" />
                <button type="submit" class="button button-primary"
                    onclick="return confirm('Generate a new key? Any existing key will stop working immediately.');">
                    <?php echo empty($settings['api_key_hash']) ? 'Generate API Key' : 'Regenerate API Key'; ?>
                </button>
            </form>
            <?php if (!empty($settings['api_key_hash'])) : ?>
                <form method="post" style="margin-top:8px;">
                    <?php wp_nonce_field('antigravity_connector_settings'); ?>
                    <input type="hidden" name="antigravity_action" value="revoke_key" />
                    <button type="submit" class="button"
                        onclick="return confirm('Revoke the API key? The MCP server will lose access until a new key is generated.');">
                        Revoke Key
                    </button>
                </form>
            <?php endif; ?>

            <h2 style="margin-top:30px;">Capabilities</h2>
            <form method="post">
                <?php wp_nonce_field('antigravity_connector_settings'); ?>
                <input type="hidden" name="antigravity_action" value="save_options" />
                <table class="form-table">
                    <tr>
                        <th scope="row">Database queries</th>
                        <td>
                            <label>
                                <input type="checkbox" name="enable_db_query" <?php checked($settings['enable_db_query']); ?> />
                                Allow read-only SQL <code>SELECT</code> queries via <code>/wp-json/antigravity/v1/db/query</code>
                            </label>
                            <p class="description">
                                Only single <code>SELECT</code> statements are allowed. Writes, DDL, and multiple
                                statements are always blocked, regardless of this setting.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Theme file editing</th>
                        <td>
                            <label>
                                <input type="checkbox" name="enable_file_write" <?php checked($settings['enable_file_write']); ?> />
                                Allow writing theme files via <code>/wp-json/antigravity/v1/theme/file</code>
                            </label>
                            <p class="description">
                                Reading theme files is always allowed once a valid API key is configured. Writing is opt-in.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">IP allowlist</th>
                        <td>
                            <textarea name="allowed_ips" rows="3" cols="40" class="large-text code"><?php echo esc_textarea($settings['allowed_ips']); ?></textarea>
                            <p class="description">
                                Optional. One IP address per line. If set, requests from other IPs are rejected even
                                with a valid key. Leave empty to allow any IP (the API key is still required).
                            </p>
                        </td>
                    </tr>
                </table>
                <?php submit_button('Save Settings'); ?>
            </form>

            <h2 style="margin-top:30px;">Connection info</h2>
            <table class="form-table">
                <tr>
                    <th scope="row">Site URL</th>
                    <td><code><?php echo esc_html(get_site_url()); ?></code></td>
                </tr>
                <tr>
                    <th scope="row">Connector endpoint</th>
                    <td><code><?php echo esc_html(get_rest_url(null, 'antigravity/v1')); ?></code></td>
                </tr>
            </table>
            <p>
                Put the site URL and API key into the MCP server's <code>.env</code> file as
                <code>WP_SITE_URL</code> and <code>WP_ANTIGRAVITY_API_KEY</code>.
            </p>
        </div>
        <?php
    }

    /* ---------------------------------------------------------------
     * REST routes
     * ------------------------------------------------------------- */

    public function register_routes() {
        $auth = [$this, 'check_auth'];

        register_rest_route('antigravity/v1', '/status', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_status'],
            'permission_callback' => $auth,
        ]);

        register_rest_route('antigravity/v1', '/db/query', [
            'methods'             => 'POST',
            'callback'            => [$this, 'db_query'],
            'permission_callback' => $auth,
            'args'                => [
                'sql'   => ['required' => true, 'type' => 'string'],
                'limit' => ['required' => false, 'type' => 'integer'],
            ],
        ]);

        register_rest_route('antigravity/v1', '/theme/files', [
            'methods'             => 'GET',
            'callback'            => [$this, 'list_theme_files'],
            'permission_callback' => $auth,
        ]);

        register_rest_route('antigravity/v1', '/theme/file', [
            'methods'             => ['GET', 'POST'],
            'callback'            => [$this, 'theme_file'],
            'permission_callback' => $auth,
        ]);

        register_rest_route('antigravity/v1', '/plugins', [
            'methods'             => 'GET',
            'callback'            => [$this, 'list_plugins'],
            'permission_callback' => $auth,
        ]);
    }

    /**
     * Auth: requires header X-Antigravity-Key matching the stored hash,
     * plus an optional IP allowlist.
     */
    public function check_auth(WP_REST_Request $request) {
        $settings = self::get_settings();

        if (empty($settings['api_key_hash'])) {
            return new WP_Error(
                'antigravity_no_key',
                'No Antigravity API key configured for this site. Generate one under Settings → Antigravity Connector.',
                ['status' => 403]
            );
        }

        $allowed_ips = array_filter(array_map('trim', explode("\n", (string) $settings['allowed_ips'])));
        if (!empty($allowed_ips)) {
            $remote_ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field($_SERVER['REMOTE_ADDR']) : '';
            if (!in_array($remote_ip, $allowed_ips, true)) {
                return new WP_Error('antigravity_ip_denied', 'Your IP address is not allowed to use this API.', ['status' => 403]);
            }
        }

        $provided = $request->get_header('x-antigravity-key');
        if (empty($provided)) {
            return new WP_Error('antigravity_missing_key', 'Missing X-Antigravity-Key header.', ['status' => 401]);
        }

        if (!wp_check_password($provided, $settings['api_key_hash'])) {
            return new WP_Error('antigravity_bad_key', 'Invalid Antigravity API key.', ['status' => 403]);
        }

        return true;
    }

    public function get_status(WP_REST_Request $request) {
        $settings = self::get_settings();
        $theme = wp_get_theme();

        return [
            'site_url'     => get_site_url(),
            'name'         => get_bloginfo('name'),
            'wp_version'   => get_bloginfo('version'),
            'php_version'  => PHP_VERSION,
            'active_theme' => [
                'name'       => $theme->get('Name'),
                'stylesheet' => $theme->get_stylesheet(),
                'version'    => $theme->get('Version'),
            ],
            'capabilities' => [
                'db_query'   => (bool) $settings['enable_db_query'],
                'file_write' => (bool) $settings['enable_file_write'],
            ],
            'connector_version' => ANTIGRAVITY_CONNECTOR_VERSION,
        ];
    }

    /* ---------------------------------------------------------------
     * Database (read-only)
     * ------------------------------------------------------------- */

    public function db_query(WP_REST_Request $request) {
        $settings = self::get_settings();
        if (empty($settings['enable_db_query'])) {
            return new WP_Error(
                'antigravity_db_disabled',
                'Database queries are disabled. Enable them under Settings → Antigravity Connector.',
                ['status' => 403]
            );
        }

        global $wpdb;
        $sql = trim((string) $request->get_param('sql'));

        if ($sql === '') {
            return new WP_Error('antigravity_empty_sql', 'No SQL provided.', ['status' => 400]);
        }

        $trimmed = rtrim($sql, "; \t\n\r");

        // Only a single SELECT statement is allowed.
        if (!preg_match('/^\s*select\s/i', $trimmed)) {
            return new WP_Error('antigravity_sql_not_select', 'Only single SELECT statements are allowed.', ['status' => 400]);
        }

        if (strpos($trimmed, ';') !== false) {
            return new WP_Error('antigravity_multi_statement', 'Multiple SQL statements are not allowed.', ['status' => 400]);
        }

        $forbidden = '/\b(insert|update|delete|drop|alter|create|truncate|replace|grant|revoke|call|exec|into\s+outfile|load_file)\b/i';
        if (preg_match($forbidden, $trimmed)) {
            return new WP_Error('antigravity_sql_forbidden', 'Query contains a forbidden keyword.', ['status' => 400]);
        }

        $limit = (int) $request->get_param('limit');
        if ($limit <= 0 || $limit > 1000) {
            $limit = 100;
        }

        $final_sql = $trimmed;
        if (!preg_match('/\blimit\s+\d+(\s*,\s*\d+)?\s*$/i', $final_sql)) {
            $final_sql .= ' LIMIT ' . $limit;
        }

        $results = $wpdb->get_results($final_sql, ARRAY_A);

        if ($wpdb->last_error) {
            return new WP_Error('antigravity_sql_error', $wpdb->last_error, ['status' => 400]);
        }

        return [
            'rows'  => $results,
            'count' => is_array($results) ? count($results) : 0,
            'sql'   => $final_sql,
        ];
    }

    /* ---------------------------------------------------------------
     * Theme files
     * ------------------------------------------------------------- */

    private function get_theme_root_path($theme_slug) {
        $themes_dir = get_theme_root();
        $theme = $theme_slug ? wp_get_theme($theme_slug) : wp_get_theme();
        if (!$theme->exists()) {
            return new WP_Error('antigravity_theme_not_found', 'Theme not found.', ['status' => 404]);
        }
        return trailingslashit($themes_dir) . $theme->get_stylesheet();
    }

    private function resolve_theme_path($theme_root, $relative_path) {
        $relative_path = str_replace('\\', '/', (string) $relative_path);
        if ($relative_path === '' || strpos($relative_path, '..') !== false || $relative_path[0] === '/') {
            return new WP_Error('antigravity_invalid_path', 'Invalid or unsafe path.', ['status' => 400]);
        }

        $root_real = realpath($theme_root);
        if ($root_real === false) {
            return new WP_Error('antigravity_theme_not_found', 'Theme directory not found.', ['status' => 404]);
        }

        $candidate = $theme_root . '/' . $relative_path;
        $target_real = realpath($candidate);

        if ($target_real !== false) {
            // Existing file: confirm it's inside the theme directory.
            if (strpos($target_real, $root_real) !== 0) {
                return new WP_Error('antigravity_invalid_path', 'Path is outside the theme directory.', ['status' => 400]);
            }
            return $target_real;
        }

        // New file: confirm its parent directory is inside the theme directory.
        $parent_real = realpath(dirname($candidate));
        if ($parent_real === false || strpos($parent_real, $root_real) !== 0) {
            return new WP_Error('antigravity_invalid_path', 'Path is outside the theme directory.', ['status' => 400]);
        }

        return $candidate;
    }

    public function list_theme_files(WP_REST_Request $request) {
        $theme_slug = $request->get_param('theme');
        $theme_root = $this->get_theme_root_path($theme_slug);
        if (is_wp_error($theme_root)) {
            return $theme_root;
        }

        $files = [];
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($theme_root, FilesystemIterator::SKIP_DOTS)
        );
        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $rel = ltrim(str_replace($theme_root, '', $file->getPathname()), '/\\');
                $files[] = [
                    'path' => str_replace('\\', '/', $rel),
                    'size' => $file->getSize(),
                ];
            }
        }

        return [
            'theme' => basename($theme_root),
            'files' => $files,
        ];
    }

    public function theme_file(WP_REST_Request $request) {
        $theme_slug = $request->get_param('theme');
        $relative_path = $request->get_param('path');

        if (empty($relative_path)) {
            return new WP_Error('antigravity_missing_path', 'The "path" parameter is required.', ['status' => 400]);
        }

        $theme_root = $this->get_theme_root_path($theme_slug);
        if (is_wp_error($theme_root)) {
            return $theme_root;
        }

        $full_path = $this->resolve_theme_path($theme_root, $relative_path);
        if (is_wp_error($full_path)) {
            return $full_path;
        }

        if ($request->get_method() === 'GET') {
            if (!file_exists($full_path) || !is_file($full_path)) {
                return new WP_Error('antigravity_file_not_found', 'File not found.', ['status' => 404]);
            }
            return [
                'path'    => $relative_path,
                'content' => file_get_contents($full_path),
                'size'    => filesize($full_path),
            ];
        }

        // POST = write
        $settings = self::get_settings();
        if (empty($settings['enable_file_write'])) {
            return new WP_Error(
                'antigravity_write_disabled',
                'Theme file writing is disabled. Enable it under Settings → Antigravity Connector.',
                ['status' => 403]
            );
        }

        $content = $request->get_param('content');
        if ($content === null) {
            return new WP_Error('antigravity_missing_content', 'The "content" parameter is required.', ['status' => 400]);
        }

        $dir = dirname($full_path);
        if (!is_dir($dir)) {
            wp_mkdir_p($dir);
        }

        $result = file_put_contents($full_path, $content);
        if ($result === false) {
            return new WP_Error('antigravity_write_failed', 'Failed to write file. Check filesystem permissions.', ['status' => 500]);
        }

        return [
            'path'          => $relative_path,
            'bytes_written' => $result,
            'status'        => 'ok',
        ];
    }

    /* ---------------------------------------------------------------
     * Plugins
     * ------------------------------------------------------------- */

    public function list_plugins(WP_REST_Request $request) {
        if (!function_exists('get_plugins')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }

        $all = get_plugins();
        $active = (array) get_option('active_plugins', []);

        $result = [];
        foreach ($all as $file => $data) {
            $result[] = [
                'file'    => $file,
                'name'    => $data['Name'],
                'version' => $data['Version'],
                'active'  => in_array($file, $active, true),
            ];
        }

        return ['plugins' => $result];
    }
}

new Antigravity_Connector();
