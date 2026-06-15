import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { AntigravityConnectorClient } from "../connector-client.js";

/**
 * Tools backed by the companion "Antigravity Connector" WordPress plugin.
 * Only registered when WP_ANTIGRAVITY_API_KEY is configured.
 */
export function registerConnectorTools(server: McpServer, connector: AntigravityConnectorClient) {
  server.tool(
    "wp_ag_status",
    "Get site status from the Antigravity Connector plugin: WordPress/PHP versions, active theme, and which optional capabilities (database queries, theme file writes) are enabled.",
    {},
    async () => {
      const data = await connector.get("/status");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "wp_ag_db_query",
    "Run a single read-only SQL SELECT query against the WordPress database via the Antigravity Connector plugin. Must be enabled in the plugin's settings. Writes, DDL, and multi-statement queries are always rejected. A LIMIT is added automatically if missing (default 100, max 1000).",
    {
      sql: z.string().describe("A single SELECT statement, e.g. \"SELECT ID, post_title, post_status FROM wp_posts WHERE post_type='post'\"."),
      limit: z
        .number()
        .int()
        .min(1)
        .max(1000)
        .optional()
        .describe("Maximum number of rows to return if the query has no LIMIT clause (default 100, max 1000)."),
    },
    async (args) => {
      const data = await connector.post("/db/query", { sql: args.sql, limit: args.limit });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "wp_ag_list_theme_files",
    "List every file in the active (or a specified) theme's directory, with file sizes in bytes.",
    {
      theme: z.string().optional().describe("Theme slug (stylesheet directory name). Defaults to the currently active theme."),
    },
    async (args) => {
      const data = await connector.get("/theme/files", { theme: args.theme });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "wp_ag_read_theme_file",
    "Read the full contents of a file inside the active (or a specified) theme's directory.",
    {
      path: z.string().describe("File path relative to the theme directory, e.g. \"style.css\" or \"templates/page.php\"."),
      theme: z.string().optional().describe("Theme slug. Defaults to the currently active theme."),
    },
    async (args) => {
      const data = await connector.get("/theme/file", { theme: args.theme, path: args.path });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "wp_ag_write_theme_file",
    "Create or overwrite a file inside the active (or a specified) theme's directory. Must be enabled in the Antigravity Connector plugin settings. This edits live theme code — review changes carefully before writing.",
    {
      path: z.string().describe("File path relative to the theme directory, e.g. \"functions.php\" or \"templates/page.php\"."),
      content: z.string().describe("The full new contents of the file (overwrites any existing content)."),
      theme: z.string().optional().describe("Theme slug. Defaults to the currently active theme."),
    },
    async (args) => {
      const data = await connector.post("/theme/file", {
        theme: args.theme,
        path: args.path,
        content: args.content,
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "wp_ag_list_plugins",
    "List all installed plugins with their version and active/inactive status, via the Antigravity Connector plugin.",
    {},
    async () => {
      const data = await connector.get("/plugins");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );
}
