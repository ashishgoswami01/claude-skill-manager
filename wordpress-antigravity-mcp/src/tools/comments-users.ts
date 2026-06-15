import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { WordPressClient } from "../wordpress-client.js";

/**
 * Registers tools for managing comments and users.
 */
export function registerCommentsUsersTools(server: McpServer, wp: WordPressClient) {
  // ---- Comments ------------------------------------------------------------

  server.tool(
    "wp_list_comments",
    "List comments, optionally filtered by post or status.",
    {
      post: z.number().optional().describe("Filter to comments on a specific post ID"),
      status: z
        .enum(["hold", "approve", "spam", "trash", "all"])
        .optional()
        .describe("Filter by comment status"),
      search: z.string().optional(),
      per_page: z.number().min(1).max(100).default(20),
      page: z.number().min(1).default(1),
    },
    async ({ post, status, search, per_page, page }) => {
      const comments = await wp.get("/wp/v2/comments", { post, status, search, per_page, page });
      return { content: [{ type: "text", text: JSON.stringify(comments, null, 2) }] };
    }
  );

  server.tool(
    "wp_get_comment",
    "Get a single comment by ID.",
    { id: z.number() },
    async ({ id }) => {
      const comment = await wp.get(`/wp/v2/comments/${id}`);
      return { content: [{ type: "text", text: JSON.stringify(comment, null, 2) }] };
    }
  );

  server.tool(
    "wp_create_comment",
    "Create a new comment on a post (useful for replying to existing comments as the site admin).",
    {
      post: z.number().describe("Post ID to comment on"),
      content: z.string().describe("Comment body"),
      parent: z.number().optional().describe("Parent comment ID, to create a threaded reply"),
    },
    async (params) => {
      const comment = await wp.post("/wp/v2/comments", params);
      return { content: [{ type: "text", text: JSON.stringify(comment, null, 2) }] };
    }
  );

  server.tool(
    "wp_moderate_comment",
    "Moderate a comment: approve, hold (unapprove), mark as spam, trash, or update its text.",
    {
      id: z.number(),
      status: z.enum(["approve", "hold", "spam", "trash"]).optional(),
      content: z.string().optional().describe("Replace the comment's content"),
    },
    async ({ id, status, content }) => {
      const fields: Record<string, unknown> = {};
      if (status) fields.status = status;
      if (content !== undefined) fields.content = content;
      const comment = await wp.post(`/wp/v2/comments/${id}`, fields);
      return { content: [{ type: "text", text: JSON.stringify(comment, null, 2) }] };
    }
  );

  server.tool(
    "wp_delete_comment",
    "Permanently delete a comment (or trash it if force=false).",
    { id: z.number(), force: z.boolean().default(false) },
    async ({ id, force }) => {
      const result = await wp.delete(`/wp/v2/comments/${id}`, { force });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ---- Users ----------------------------------------------------------------

  server.tool(
    "wp_list_users",
    "List WordPress users.",
    {
      search: z.string().optional(),
      roles: z.array(z.string()).optional().describe("Filter by role slugs, e.g. ['administrator','editor']"),
      per_page: z.number().min(1).max(100).default(20),
      page: z.number().min(1).default(1),
    },
    async ({ search, roles, per_page, page }) => {
      const users = await wp.get("/wp/v2/users", { search, roles, per_page, page, context: "edit" });
      return { content: [{ type: "text", text: JSON.stringify(users, null, 2) }] };
    }
  );

  server.tool(
    "wp_get_user",
    "Get a single user by ID ('me' is not supported here; use a numeric ID).",
    { id: z.number() },
    async ({ id }) => {
      const user = await wp.get(`/wp/v2/users/${id}`, { context: "edit" });
      return { content: [{ type: "text", text: JSON.stringify(user, null, 2) }] };
    }
  );

  server.tool(
    "wp_create_user",
    "Create a new WordPress user account.",
    {
      username: z.string(),
      email: z.string().email(),
      password: z.string().describe("Initial password for the account"),
      roles: z.array(z.string()).optional().describe("Role slugs, e.g. ['subscriber']"),
      name: z.string().optional().describe("Display name"),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
    },
    async (params) => {
      const user = await wp.post("/wp/v2/users", params);
      return { content: [{ type: "text", text: JSON.stringify(user, null, 2) }] };
    }
  );

  server.tool(
    "wp_update_user",
    "Update an existing user's profile or role.",
    {
      id: z.number(),
      email: z.string().email().optional(),
      roles: z.array(z.string()).optional(),
      name: z.string().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      password: z.string().optional(),
    },
    async ({ id, ...fields }) => {
      const user = await wp.post(`/wp/v2/users/${id}`, fields);
      return { content: [{ type: "text", text: JSON.stringify(user, null, 2) }] };
    }
  );

  server.tool(
    "wp_delete_user",
    "Delete a user. WordPress requires reassigning that user's content to another user.",
    {
      id: z.number(),
      reassign: z.number().describe("User ID to reassign this user's content to"),
    },
    async ({ id, reassign }) => {
      const result = await wp.delete(`/wp/v2/users/${id}`, { reassign, force: true });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
