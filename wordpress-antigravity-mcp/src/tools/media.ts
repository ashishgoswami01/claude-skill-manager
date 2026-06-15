import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WordPressClient } from "../wordpress-client.js";

/**
 * Registers tools for managing the WordPress media library.
 */
export function registerMediaTools(server: McpServer, wp: WordPressClient) {
  server.tool(
    "wp_list_media",
    "List media library items.",
    {
      search: z.string().optional(),
      media_type: z
        .enum(["image", "video", "audio", "application"])
        .optional()
        .describe("Filter by media type"),
      per_page: z.number().min(1).max(100).default(10),
      page: z.number().min(1).default(1),
    },
    async ({ search, media_type, per_page, page }) => {
      const media = await wp.get("/wp/v2/media", { search, media_type, per_page, page });
      return { content: [{ type: "text", text: JSON.stringify(media, null, 2) }] };
    }
  );

  server.tool(
    "wp_get_media",
    "Get details for a single media item by ID.",
    { id: z.number() },
    async ({ id }) => {
      const item = await wp.get(`/wp/v2/media/${id}`);
      return { content: [{ type: "text", text: JSON.stringify(item, null, 2) }] };
    }
  );

  server.tool(
    "wp_upload_media",
    "Upload a new media item (image, document, etc.) to the WordPress media library. " +
      "Provide either a remote `source_url` to fetch the file from, or `base64_data` with the raw file contents.",
    {
      filename: z.string().describe("Filename to use, including extension, e.g. 'photo.jpg'"),
      source_url: z.string().url().optional().describe("Publicly accessible URL to fetch the file from"),
      base64_data: z.string().optional().describe("Base64-encoded file contents (alternative to source_url)"),
      content_type: z
        .string()
        .optional()
        .describe("MIME type, e.g. 'image/jpeg'. Inferred from source_url response if omitted."),
      title: z.string().optional().describe("Title to set for the media item"),
      alt_text: z.string().optional().describe("Alt text for images"),
      caption: z.string().optional(),
      post: z.number().optional().describe("Post ID to attach this media to"),
    },
    async ({ filename, source_url, base64_data, content_type, title, alt_text, caption, post }) => {
      if (!source_url && !base64_data) {
        throw new Error("Provide either source_url or base64_data.");
      }

      let buffer: Buffer;
      let mime = content_type;

      if (source_url) {
        const res = await fetch(source_url);
        if (!res.ok) {
          throw new Error(`Failed to fetch source_url (${res.status} ${res.statusText})`);
        }
        mime = mime ?? res.headers.get("content-type") ?? "application/octet-stream";
        buffer = Buffer.from(await res.arrayBuffer());
      } else {
        buffer = Buffer.from(base64_data as string, "base64");
        mime = mime ?? "application/octet-stream";
      }

      const uploaded = await wp.request("POST", "/wp/v2/media", {
        rawBody: buffer,
        contentType: mime,
        extraHeaders: {
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });

      // Optionally update metadata and/or attach to a post in a follow-up call.
      const meta: Record<string, unknown> = {};
      if (title !== undefined) meta.title = title;
      if (alt_text !== undefined) meta.alt_text = alt_text;
      if (caption !== undefined) meta.caption = caption;
      if (post !== undefined) meta.post = post;

      let result = uploaded as { id: number };
      if (Object.keys(meta).length > 0) {
        result = await wp.post(`/wp/v2/media/${result.id}`, meta);
      }

      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "wp_update_media",
    "Update metadata (title, alt text, caption, attached post) for an existing media item.",
    {
      id: z.number(),
      title: z.string().optional(),
      alt_text: z.string().optional(),
      caption: z.string().optional(),
      post: z.number().optional(),
    },
    async ({ id, ...fields }) => {
      const result = await wp.post(`/wp/v2/media/${id}`, fields);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "wp_delete_media",
    "Delete a media item. Media does not support trashing, so this is permanent by default.",
    { id: z.number(), force: z.boolean().default(true) },
    async ({ id, force }) => {
      const result = await wp.delete(`/wp/v2/media/${id}`, { force });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
