/**
 * Ambient type declarations for @modelcontextprotocol/sdk subpath imports.
 *
 * Some published versions of the SDK ship `.d.ts.map` files without the
 * corresponding `.d.ts` declaration files for certain subpaths, which makes
 * TypeScript fall back to `any` and trips `noImplicitAny`. These minimal
 * shims restore type-checking for the small surface area this project uses.
 *
 * If a future SDK version includes proper declarations for these subpaths,
 * these shims are harmless (TS prefers the real types when both exist, and
 * duplicate-but-compatible ambient modules are fine).
 */

declare module "@modelcontextprotocol/sdk/server/mcp.js" {
  import type { ZodRawShape, z } from "zod";

  export interface McpServerInfo {
    name: string;
    version: string;
  }

  export interface ToolCallResult {
    content: Array<{ type: string; text?: string; [key: string]: unknown }>;
    isError?: boolean;
    [key: string]: unknown;
  }

  export class McpServer {
    constructor(info: McpServerInfo);

    tool<Args extends ZodRawShape>(
      name: string,
      description: string,
      paramsSchema: Args,
      callback: (
        args: z.objectOutputType<Args, z.ZodTypeAny>,
        extra?: unknown
      ) => ToolCallResult | Promise<ToolCallResult>
    ): void;

    connect(transport: unknown): Promise<void>;
  }
}

declare module "@modelcontextprotocol/sdk/server/stdio.js" {
  export class StdioServerTransport {
    constructor();
  }
}
