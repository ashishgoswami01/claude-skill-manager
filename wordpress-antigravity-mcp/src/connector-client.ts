/**
 * Client for the companion "Antigravity Connector" WordPress plugin.
 *
 * The plugin exposes a small REST namespace (`/wp-json/antigravity/v1/...`)
 * authenticated with a dedicated API key (sent via the `X-Antigravity-Key`
 * header), separate from the WordPress Application Password used for the
 * core REST API. It adds capabilities the core REST API doesn't expose:
 * read-only SQL queries and theme file read/write.
 */

export interface AntigravityConnectorConfig {
  siteUrl: string;
  apiKey: string;
}

export class AntigravityConnectorError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "AntigravityConnectorError";
    this.status = status;
    this.body = body;
  }
}

export class AntigravityConnectorClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(config: AntigravityConnectorConfig) {
    if (!config.siteUrl || !config.apiKey) {
      throw new Error(
        "Missing Antigravity Connector configuration. Set WP_SITE_URL and WP_ANTIGRAVITY_API_KEY."
      );
    }
    this.baseUrl = config.siteUrl.replace(/\/+$/, "");
    this.apiKey = config.apiKey;
  }

  async request<T = unknown>(
    method: "GET" | "POST",
    path: string,
    options: { query?: Record<string, unknown>; body?: unknown } = {}
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}/wp-json/antigravity/v1${path}`);

    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value === undefined || value === null) continue;
        url.searchParams.set(key, String(value));
      }
    }

    const headers: Record<string, string> = {
      "X-Antigravity-Key": this.apiKey,
    };

    let body: BodyInit | undefined;
    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(options.body);
    }

    const response = await fetch(url.toString(), { method, headers, body });

    const text = await response.text();
    let parsed: unknown = undefined;
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
    }

    if (!response.ok) {
      const message =
        (parsed && typeof parsed === "object" && "message" in (parsed as any)
          ? (parsed as any).message
          : response.statusText) || "Antigravity Connector request failed";
      throw new AntigravityConnectorError(response.status, message, parsed);
    }

    return parsed as T;
  }

  get<T = unknown>(path: string, query?: Record<string, unknown>) {
    return this.request<T>("GET", path, { query });
  }

  post<T = unknown>(path: string, body?: unknown) {
    return this.request<T>("POST", path, { body });
  }
}

/**
 * Build an AntigravityConnectorClient from environment variables.
 * Returns `null` if WP_ANTIGRAVITY_API_KEY is not set, so callers can
 * skip registering connector-only tools when the plugin isn't configured.
 */
export function connectorFromEnv(): AntigravityConnectorClient | null {
  const siteUrl = process.env.WP_SITE_URL ?? "";
  const apiKey = process.env.WP_ANTIGRAVITY_API_KEY ?? "";
  if (!siteUrl || !apiKey) return null;
  return new AntigravityConnectorClient({ siteUrl, apiKey });
}
