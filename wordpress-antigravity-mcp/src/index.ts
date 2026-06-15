#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { clientFromEnv } from "./wordpress-client.js";
import { connectorFromEnv } from "./connector-client.js";
import { registerContentTools } from "./tools/content.js";
import { registerMediaTools } from "./tools/media.js";
import { registerCommentsUsersTools } from "./tools/comments-users.js";
import { registerPluginsThemesTools } from "./tools/plugins-themes.js";
import { registerConnectorTools } from "./tools/connector.js";

async function main() {
  const wp = clientFromEnv();

  const server = new McpServer({
    name: "wordpress-antigravity-mcp",
    version: "1.0.0",
  });

  registerContentTools(server, wp);
  registerMediaTools(server, wp);
  registerCommentsUsersTools(server, wp);
  registerPluginsThemesTools(server, wp);

  // Only register connector tools (db query, theme file read/write, etc.)
  // when the companion "Antigravity Connector" WordPress plugin is configured.
  const connector = connectorFromEnv();
  if (connector) {
    registerConnectorTools(server, connector);
  } else {
    console.error(
      "wordpress-antigravity-mcp: WP_ANTIGRAVITY_API_KEY not set - skipping wp_ag_* connector tools " +
        "(install the bundled 'Antigravity Connector' WordPress plugin to enable them)."
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error starting wordpress-antigravity-mcp:", err);
  process.exit(1);
});
