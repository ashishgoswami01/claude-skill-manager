/**
 * Minimal WordPress REST API client.
 *
 * Auth: WordPress "Application Passwords" (built into WP core since 5.6) via HTTP Basic Auth.
 * Docs: https://developer.wordpress.org/rest-api/
 */

export interface WordPressConfig {
  siteUrl: string;
  username: string;
  appPassword: string;
}

export class WordPressApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "WordPressApiError";
    this.status = status;
    this.body = body;
  }
}

export class WordPressClient {
  private baseUrl: string;
  private authHeader: string;

  constructor(config: WordPressConfig) {
    if (!config.siteUrl || !config.username || !config.appPassword) {
      throw new Error(
        "Missing WordPress configuration. Set WP_SITE_URL, WP_USERNAME and WP_APP_PASSWORD."
      );
    }

    this.baseUrl = config.siteUrl.replace(/\/+$/, "");
    const token = Buffer.from(`${config.username}:${config.appPassword}`).toString("base64");
    this.authHeader = `Basic ${token}`;
  }

  /**
   * Perform a request against the WordPress REST API.
   *
   * @param method   HTTP method
   * @param path     Path relative to the REST root, e.g. "/wp/v2/posts" or "/wp/v2/posts/123"
   * @param options  Optional query params and JSON body
   */
  async request<T = unknown>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    options: {
      query?: Record<string, unknown>;
      body?: unknown;
      rawBody?: BodyInit | Buffer;
      contentType?: string;
      extraHeaders?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}/wp-json${path}`);

    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value === undefined || value === null) continue;
        if (Array.isArray(value)) {
          url.searchParams.set(key, value.join(","));
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {
      Authorization: this.authHeader,
    };

    if (options.extraHeaders) {
      Object.assign(headers, options.extraHeaders);
    }

    let body: BodyInit | undefined;
    if (options.rawBody !== undefined) {
      body = options.rawBody as BodyInit;
      if (options.contentType) headers["Content-Type"] = options.contentType;
    } else if (options.body !== undefined) {
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
          : response.statusText) || "WordPress API request failed";
      throw new WordPressApiError(response.status, message, parsed);
    }

    return parsed as T;
  }

  get<T = unknown>(path: string, query?: Record<string, unknown>) {
    return this.request<T>("GET", path, { query });
  }

  post<T = unknown>(path: string, body?: unknown, query?: Record<string, unknown>) {
    return this.request<T>("POST", path, { body, query });
  }

  put<T = unknown>(path: string, body?: unknown, query?: Record<string, unknown>) {
    return this.request<T>("PUT", path, { body, query });
  }

  patch<T = unknown>(path: string, body?: unknown, query?: Record<string, unknown>) {
    return this.request<T>("PATCH", path, { body, query });
  }

  delete<T = unknown>(path: string, query?: Record<string, unknown>) {
    return this.request<T>("DELETE", path, { query });
  }
}

/** Build a WordPressClient from environment variables. */
export function clientFromEnv(): WordPressClient {
  return new WordPressClient({
    siteUrl: process.env.WP_SITE_URL ?? "",
    username: process.env.WP_USERNAME ?? "",
    appPassword: process.env.WP_APP_PASSWORD ?? "",
  });
}
