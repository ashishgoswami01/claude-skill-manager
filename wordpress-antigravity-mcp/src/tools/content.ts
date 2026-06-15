import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { WordPressClient } from "../wordpress-client.js";

const statusEnum = z.enum(["publish", "future", "draft", "pending", "private"]);

/**
 * Registers tools for managing posts, pages, categories and tags.
 */
export function registerContentTools(server: McpServer, wp: WordPressClient) {
  // ---- Posts -------------------------------------------------------------

  server.tool(
    "wp_list_posts",
    "List WordPress posts. Supports search, status filter, pagination, categories and tags.",
    {
      search: z.string().optional().describe("Search term to filter posts by title/content"),
      status: z
        .array(statusEnum)
        .optional()
        .describe("Filter by one or more statuses (requires authenticated access for non-public statuses)"),
      categories: z.array(z.number()).optional().describe("Filter by category IDs"),
      tags: z.array(z.number()).optional().describe("Filter by tag IDs"),
      per_page: z.number().min(1).max(100).default(10).describe("Results per page (max 100)"),
      page: z.number().min(1).default(1).describe("Page number"),
    },
    async ({ search, status, categories, tags, per_page, page }) => {
      const posts = await wp.get("/wp/v2/posts", {
        search,
        status: status?.join(","),
        categories,
        tags,
        per_page,
        page,
        context: "edit",
      });
      return { content: [{ type: "text", text: JSON.stringify(posts, null, 2) }] };
    }
  );

  server.tool(
    "wp_get_post",
    "Get a single WordPress post by ID.",
    { id: z.number().describe("Post ID") },
    async ({ id }) => {
      const post = await wp.get(`/wp/v2/posts/${id}`, { context: "edit" });
      return { content: [{ type: "text", text: JSON.stringify(post, null, 2) }] };
    }
  );

  server.tool(
    "wp_create_post",
    "Create a new WordPress post (defaults to draft status).",
    {
      title: z.string().describe("Post title"),
      content: z.string().describe("Post content (HTML or Gutenberg block markup)"),
      status: statusEnum.default("draft").describe("Publish status"),
      excerpt: z.string().optional().describe("Post excerpt/summary"),
      slug: z.string().optional().describe("URL slug"),
      categories: z.array(z.number()).optional().describe("Category IDs"),
      tags: z.array(z.number()).optional().describe("Tag IDs"),
      featured_media: z.number().optional().describe("Media ID to use as the featured image"),
      date: z.string().optional().describe("ISO 8601 date for scheduling (use with status=future)"),
    },
    async (params) => {
      const post = await wp.post("/wp/v2/posts", params);
      return { content: [{ type: "text", text: JSON.stringify(post, null, 2) }] };
    }
  );

  server.tool(
    "wp_update_post",
    "Update an existing WordPress post. Also used to publish a draft by setting status to 'publish'.",
    {
      id: z.number().describe("Post ID to update"),
      title: z.string().optional(),
      content: z.string().optional(),
      status: statusEnum.optional(),
      excerpt: z.string().optional(),
      slug: z.string().optional(),
      categories: z.array(z.number()).optional(),
      tags: z.array(z.number()).optional(),
      featured_media: z.number().optional(),
      date: z.string().optional(),
    },
    async ({ id, ...fields }) => {
      const post = await wp.post(`/wp/v2/posts/${id}`, fields);
      return { content: [{ type: "text", text: JSON.stringify(post, null, 2) }] };
    }
  );

  server.tool(
    "wp_delete_post",
    "Delete a WordPress post (moves to trash unless force=true).",
    {
      id: z.number().describe("Post ID"),
      force: z.boolean().default(false).describe("Permanently delete instead of trashing"),
    },
    async ({ id, force }) => {
      const result = await wp.delete(`/wp/v2/posts/${id}`, { force });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ---- Pages --------------------------------------------------------------

  server.tool(
    "wp_list_pages",
    "List WordPress pages. Supports search, status filter and pagination.",
    {
      search: z.string().optional(),
      status: z.array(statusEnum).optional(),
      per_page: z.number().min(1).max(100).default(10),
      page: z.number().min(1).default(1),
    },
    async ({ search, status, per_page, page }) => {
      const pages = await wp.get("/wp/v2/pages", {
        search,
        status: status?.join(","),
        per_page,
        page,
        context: "edit",
      });
      return { content: [{ type: "text", text: JSON.stringify(pages, null, 2) }] };
    }
  );

  server.tool(
    "wp_create_page",
    "Create a new WordPress page (defaults to draft status).",
    {
      title: z.string(),
      content: z.string(),
      status: statusEnum.default("draft"),
      slug: z.string().optional(),
      parent: z.number().optional().describe("Parent page ID for hierarchical pages"),
    },
    async (params) => {
      const page = await wp.post("/wp/v2/pages", params);
      return { content: [{ type: "text", text: JSON.stringify(page, null, 2) }] };
    }
  );

  server.tool(
    "wp_update_page",
    "Update an existing WordPress page. Also used to publish a draft by setting status to 'publish'.",
    {
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
      status: statusEnum.optional(),
      slug: z.string().optional(),
      parent: z.number().optional(),
    },
    async ({ id, ...fields }) => {
      const page = await wp.post(`/wp/v2/pages/${id}`, fields);
      return { content: [{ type: "text", text: JSON.stringify(page, null, 2) }] };
    }
  );

  server.tool(
    "wp_delete_page",
    "Delete a WordPress page (moves to trash unless force=true).",
    {
      id: z.number(),
      force: z.boolean().default(false),
    },
    async ({ id, force }) => {
      const result = await wp.delete(`/wp/v2/pages/${id}`, { force });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ---- Categories & tags ----------------------------------------------------

  server.tool(
    "wp_list_categories",
    "List post categories.",
    { search: z.string().optional(), per_page: z.number().min(1).max(100).default(50) },
    async ({ search, per_page }) => {
      const cats = await wp.get("/wp/v2/categories", { search, per_page });
      return { content: [{ type: "text", text: JSON.stringify(cats, null, 2) }] };
    }
  );

  server.tool(
    "wp_create_category",
    "Create a new post category.",
    {
      name: z.string(),
      slug: z.string().optional(),
      description: z.string().optional(),
      parent: z.number().optional(),
    },
    async (params) => {
      const cat = await wp.post("/wp/v2/categories", params);
      return { content: [{ type: "text", text: JSON.stringify(cat, null, 2) }] };
    }
  );

  server.tool(
    "wp_list_tags",
    "List post tags.",
    { search: z.string().optional(), per_page: z.number().min(1).max(100).default(50) },
    async ({ search, per_page }) => {
      const tags = await wp.get("/wp/v2/tags", { search, per_page });
      return { content: [{ type: "text", text: JSON.stringify(tags, null, 2) }] };
    }
  );

  server.tool(
    "wp_create_tag",
    "Create a new post tag.",
    { name: z.string(), slug: z.string().optional(), description: z.string().optional() },
    async (params) => {
      const tag = await wp.post("/wp/v2/tags", params);
      return { content: [{ type: "text", text: JSON.stringify(tag, null, 2) }] };
    }
  );
}
