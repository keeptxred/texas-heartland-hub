const ANALYTICS_API_PATH = "/api/shop-analytics";
const SITE_ORIGIN = "https://keeptxred.com";
const MAX_REQUEST_BYTES = 16_384;

const SHOP_EVENTS = new Set([
  "shop_page_view",
  "shop_navigation_click",
  "shop_product_click",
  "shop_outbound_click",
]);

type AnalyticsDataset = {
  writeDataPoint: (input: { blobs?: string[]; doubles?: number[]; indexes?: string[] }) => void;
};

type ShopAnalyticsEvent = {
  event: string;
  pagePath: string;
  sourcePath: string;
  destination: string;
  productId: string;
  pageType: string;
  linkText: string;
  occurredAt: string;
};

function analyticsDataset(env: unknown): AnalyticsDataset | null {
  if (typeof env !== "object" || env === null) return null;
  const value = Reflect.get(env, "KTR_SHOP_ANALYTICS");
  if (typeof value !== "object" || value === null) return null;
  return typeof Reflect.get(value, "writeDataPoint") === "function" ? value as AnalyticsDataset : null;
}

function response(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return Array.from(value, (character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127 ? " " : character;
  })
    .join("")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sameOriginRequest(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const originUrl = new URL(origin);
      return originUrl.protocol === requestUrl.protocol && originUrl.host === requestUrl.host;
    } catch {
      return false;
    }
  }

  if (request.headers.get("sec-fetch-site") !== "same-origin") return false;
  const referrer = request.headers.get("referer");
  if (!referrer) return false;
  try {
    const referrerUrl = new URL(referrer);
    return referrerUrl.protocol === requestUrl.protocol && referrerUrl.host === requestUrl.host;
  } catch {
    return false;
  }
}

function sanitizePath(value: unknown) {
  const raw = cleanString(value, 1_000);
  if (!raw) return "";
  try {
    const parsed = new URL(raw, SITE_ORIGIN);
    if (parsed.origin !== SITE_ORIGIN) return "";
    return parsed.pathname.slice(0, 500) || "/";
  } catch {
    return "";
  }
}

function sanitizeDestination(value: unknown) {
  const raw = cleanString(value, 2_000);
  if (!raw) return "";
  try {
    const parsed = new URL(raw, SITE_ORIGIN);
    if (parsed.origin === SITE_ORIGIN) return `${parsed.pathname}${parsed.search}`.slice(0, 1_200);
    if (parsed.protocol !== "https:") return "";
    parsed.username = "";
    parsed.password = "";
    parsed.hash = "";
    return parsed.toString().slice(0, 1_500);
  } catch {
    return "";
  }
}

function normalizeEvent(value: unknown): ShopAnalyticsEvent | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const event = cleanString(Reflect.get(value, "event"), 80);
  if (!SHOP_EVENTS.has(event)) return null;

  return {
    event,
    pagePath: sanitizePath(Reflect.get(value, "page_path")),
    sourcePath: sanitizePath(Reflect.get(value, "source_path")),
    destination: sanitizeDestination(
      Reflect.get(value, "destination_url") || Reflect.get(value, "destination_path"),
    ),
    productId: cleanString(Reflect.get(value, "product_id"), 240),
    pageType: cleanString(Reflect.get(value, "shop_page_type"), 80),
    linkText: cleanString(Reflect.get(value, "link_text"), 120),
    occurredAt: cleanString(Reflect.get(value, "occurred_at"), 64),
  };
}

function analyticsIndex(event: ShopAnalyticsEvent) {
  const suffix = event.productId || event.pagePath || "shop";
  return `${event.event}:${suffix}`
    .toLowerCase()
    .replace(/[^a-z0-9:._/-]+/g, "-")
    .slice(0, 90);
}

export async function shopAnalyticsResponse(request: Request, env: unknown): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== ANALYTICS_API_PATH) return null;
  if (request.method !== "POST") return response({ error: "Method not allowed." }, 405);
  if (!sameOriginRequest(request)) return response({ error: "Same-origin analytics requests only." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return response({ error: "Expected application/json." }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return response({ error: "Analytics payload is too large." }, 413);
  }

  let body = "";
  try {
    body = await request.text();
  } catch {
    return response({ error: "Unable to read analytics payload." }, 400);
  }
  if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_BYTES) {
    return response({ error: "Analytics payload is too large." }, 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return response({ error: "Invalid JSON." }, 400);
  }

  const event = normalizeEvent(parsed);
  if (!event) return response({ error: "Invalid shop analytics event." }, 400);

  const dataset = analyticsDataset(env);
  if (!dataset) return response({ error: "Analytics storage is unavailable." }, 503);

  try {
    dataset.writeDataPoint({
      blobs: [
        event.event,
        event.pagePath,
        event.sourcePath,
        event.destination,
        event.productId,
        event.pageType,
        event.linkText,
        event.occurredAt,
      ],
      doubles: [1],
      indexes: [analyticsIndex(event)],
    });
  } catch {
    return response({ error: "Analytics storage write failed." }, 503);
  }

  return response({ accepted: 1 }, 202);
}
