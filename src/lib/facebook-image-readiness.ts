// Shared Facebook image readiness helper. Deterministic checks (no network)
// are exposed via `assessImageUrl` so both the client dashboard and server
// publish path agree on what "an image URL is even usable" means. The server
// additionally calls `verifyImageIsReachable` at posting time to confirm the
// URL returns real raster image bytes.

const SITE_URL = "https://keeptxred.com";

export const FACEBOOK_IMAGE_FETCH_HEADERS = {
  Accept: "image/avif,image/webp,image/apng,image/png,image/jpeg,image/*,*/*;q=0.8",
  "User-Agent": "KeepTXRed/1.0 (+https://keeptxred.com)",
} as const;

export type FacebookImageReadinessSource =
  | "generated_featured_image"
  | "stored_featured_image"
  | "verified_source_image"
  | "none";

export type FacebookImageReadinessReason =
  | "READY"
  | "MISSING_IMAGE"
  | "INVALID_URL"
  | "NOT_PUBLIC"
  | "NOT_IMAGE"
  | "IMAGE_TOO_SMALL"
  | "FETCH_FAILED";

export type FacebookImageReadiness = {
  ready: boolean;
  imageUrl: string | null;
  source: FacebookImageReadinessSource;
  reason: FacebookImageReadinessReason;
  message: string;
};

export function normalizeImageUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^(blob:|data:)/i.test(trimmed)) return null;
  let candidate = trimmed;
  if (candidate.startsWith("//")) candidate = `https:${candidate}`;
  else if (candidate.startsWith("/")) candidate = `${SITE_URL}${candidate}`;
  try {
    const u = new URL(candidate);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    const host = u.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") return null;
    if (/^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) {
      return null;
    }
    return u.toString();
  } catch {
    return null;
  }
}

// Wikimedia Special:Redirect URLs serve the original upload, which can be
// tens of megabytes. Request a bounded Commons thumbnail for Facebook while
// preserving the full-resolution URL used by the article itself.
export function normalizeFacebookUploadImageUrl(raw: unknown): string | null {
  const normalized = normalizeImageUrl(raw);
  if (!normalized) return null;
  const url = new URL(normalized);
  if (
    url.hostname.toLowerCase() === "commons.wikimedia.org" &&
    /^\/wiki\/Special:(?:Redirect\/file|FilePath)\//i.test(url.pathname)
  ) {
    url.pathname = url.pathname.replace(
      /^\/wiki\/Special:(?:Redirect\/file|FilePath)\//i,
      "/wiki/Special:FilePath/",
    );
    url.searchParams.set("width", "1200");
  }
  return url.toString();
}

function isSvgUrl(url: string): boolean {
  try {
    return /\.svg$/i.test(new URL(url).pathname);
  } catch {
    return false;
  }
}

export function isLegacyGeneratedNewsAsset(raw: unknown): boolean {
  const url = normalizeImageUrl(raw);
  if (!url) return false;
  try {
    return new URL(url).pathname.includes("/images/news/generated/");
  } catch {
    return false;
  }
}

export function assessImageUrl(
  raw: unknown,
  source: FacebookImageReadinessSource = "stored_featured_image",
): FacebookImageReadiness {
  if (raw == null || (typeof raw === "string" && !raw.trim())) {
    return {
      ready: false,
      imageUrl: null,
      source: "none",
      reason: "MISSING_IMAGE",
      message: "Facebook post blocked: no featured image is attached to this article.",
    };
  }
  const url = normalizeImageUrl(raw);
  if (!url) {
    return {
      ready: false,
      imageUrl: null,
      source,
      reason: "INVALID_URL",
      message: "Facebook post blocked: the featured image URL is not a valid public https URL.",
    };
  }
  if (isSvgUrl(url)) {
    return {
      ready: false,
      imageUrl: url,
      source,
      reason: "NOT_IMAGE",
      message:
        "Facebook post blocked: SVG hero images are not supported. Use a PNG, JPG, or WebP image.",
    };
  }
  if (isLegacyGeneratedNewsAsset(url)) {
    return {
      ready: false,
      imageUrl: url,
      source,
      reason: "NOT_IMAGE",
      message:
        "Facebook post blocked: this article still uses a legacy generated placeholder. Regenerate a real editorial image first.",
    };
  }
  return {
    ready: true,
    imageUrl: url,
    source,
    reason: "READY",
    message: "Image ready",
  };
}

// Server-only. Verifies the URL resolves to real raster image bytes at posting time.
// Caller should have already run `assessImageUrl` and only invoke this once
// per publish request.
export async function verifyImageIsReachable(url: string): Promise<FacebookImageReadiness> {
  const base: Omit<FacebookImageReadiness, "reason" | "message" | "ready"> = {
    imageUrl: url,
    source: "stored_featured_image",
  };
  let contentType: string | null = null;
  let status = 0;
  try {
    let probe = await fetch(url, {
      method: "HEAD",
      headers: FACEBOOK_IMAGE_FETCH_HEADERS,
      redirect: "follow",
    });

    // Some CDNs/static hosts reject HEAD and byte-range probes even though a
    // normal public GET succeeds. Facebook ultimately performs a regular GET,
    // so use that as the authoritative fallback instead of a Range request.
    if (!probe.ok || !probe.headers.get("content-type")) {
      probe = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers: FACEBOOK_IMAGE_FETCH_HEADERS,
      });
    }
    status = probe.status;
    contentType = probe.headers.get("content-type");

    // We only need headers/type for validation. Cancel an unread response body
    // where the runtime supports it instead of buffering the full image.
    try {
      await probe.body?.cancel();
    } catch {
      // Ignore cancellation failures; reachability has already been determined.
    }
  } catch {
    return {
      ...base,
      ready: false,
      reason: "FETCH_FAILED",
      message: "Facebook post blocked: the featured image URL could not be reached publicly.",
    };
  }
  if (status >= 400) {
    return {
      ...base,
      ready: false,
      reason: "NOT_PUBLIC",
      message: `Facebook post blocked: featured image returned HTTP ${status}.`,
    };
  }
  const normalizedType = contentType?.toLowerCase() ?? "";
  if (!normalizedType.startsWith("image/") || normalizedType.startsWith("image/svg+xml")) {
    return {
      ...base,
      ready: false,
      reason: "NOT_IMAGE",
      message: normalizedType.startsWith("image/svg+xml")
        ? "Facebook post blocked: the featured image resolved to SVG. Use a PNG, JPG, or WebP image."
        : "Facebook post blocked: the image URL returned non-image content (likely an HTML page).",
    };
  }
  return {
    ...base,
    ready: true,
    reason: "READY",
    message: "Image verified",
  };
}
