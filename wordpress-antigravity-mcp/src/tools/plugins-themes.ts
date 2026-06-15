import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { WordPressClient } from "../wordpress-client.js";

/**
 * Registers tools for managing plugins and themes.
 *
 * Note: the /wp/v2/plugins and /wp/v2/themes endpoints require an
 * authenticated user with `activate_plugins` / `switch_themes` capability
 * (typically an administrator), and the site must allow these endpoints
 * (some managed hosts disable plugin/theme file modification via REST).
 */
export function registerPluginsThemesTools(server: McpServer, wp: WordPressClient) {
  // ---- Plugins ----------------------------------------------------------

  server.tool(
    "wp_list_plugins",
    "List installed plugins and their status (active/inactive).",
    {
      search: z.string().optional(),
      status: z.enum(["active", "inactive"]).optional(),
    },
    async ({ search, status }) => {
      const plugins = await wp.get("/wp/v2/plugins", { search, status });
      return { content: [{ type: "text", text: JSON.stringify(plugins, null, 2) }] };
    }
  );

  server.tool(
    "wp_get_plugin",
    "Get details for a single plugin.",
    { plugin: z.string().describe("Plugin file path identifier, e.g. 'akismet/akismet'") },
    async ({ plugin }) => {
      const result = await wp.get(`/wp/v2/plugins/${encodeURIComponent(plugin)}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "wp_install_plugin",
    "Install a plugin from the WordPress.org plugin directory by slug, optionally activating it.",
    {
      slug: z.string().describe("Plugin slug from wordpress.org, e.g. 'akismet'"),
      status: z.enum(["active", "inactive"]).default("inactive"),
    },
    async ({ slug, status }) => {
      const result = await wp.post("/wp/v2/plugins", { slug, status });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "wp_set_plugin_status",
    "Activate or deactivate an installed plugin.",
    {
      plugin: z.string().describe("Plugin file path identifier, e.g. 'akismet/akismet'"),
      status: z.enum(["active", "inactive"]),
    },
    async ({ plugin, status }) => {
      const result = await wp.post(`/wp/v2/plugins/${encodeURIComponent(plugin)}`, { status });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "wp_delete_plugin",
    "Delete an installed plugin. The plugin must be inactive first.",
    { plugin: z.string().describe("Plugin file path identifier, e.g. 'akismet/akismet'") },
    async ({ plugin }) => {
      const result = await wp.delete(`/wp/v2/plugins/${encodeURIComponent(plugin)}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ---- Themes -------------------------------------------------------------

  server.tool(
    "wp_list_themes",
    "List installed themes and which one is currently active.",
    { status: z.enum(["active", "inactive"]).optional() },
    async ({ status }) => {
      const themes = await wp.get("/wp/v2/themes", { status });
      return { content: [{ type: "text", text: JSON.stringify(themes, null, 2) }] };
    }
  );

  server.tool(
    "wp_activate_theme",
    "Activate an installed theme by its stylesheet identifier.",
    { stylesheet: z.string().describe("Theme stylesheet/slug, e.g. 'twentytwentyfour'") },
    async ({ stylesheet }) => {
      const result = await wp.post(`/wp/v2/themes/${encodeURIComponent(stylesheet)}`, { status: "active" });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
