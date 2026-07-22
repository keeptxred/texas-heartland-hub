// Shared Facebook image readiness helper. Deterministic checks (no network)
// are exposed via `assessImageUrl` so both the client dashboard and server
// publish path agree on what "an image URL is even usable" means. The server
// additionally calls `verifyImageIsReachable` at posting time to confirm the
// URL returns real image bytes.

const SITE_URL = "https://www.keeptxred.com";

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
  return {
    ready: true,
    imageUrl: url,
    source,
    reason: "READY",
    message: "Image ready",
  };
}

// Server-only. Verifies the URL resolves to real image bytes at posting time.
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
    let probe = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (!probe.ok || !probe.headers.get("content-type")) {
      probe = await fetch(url, { method: "GET", headers: { Range: "bytes=0-0" }, redirect: "follow" });
    }
    status = probe.status;
    contentType = probe.headers.get("content-type");
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
  if (!contentType || !contentType.toLowerCase().startsWith("image/")) {
    return {
      ...base,
      ready: false,
      reason: "NOT_IMAGE",
      message: "Facebook post blocked: the image URL returned non-image content (likely an HTML page).",
    };
  }
  return {
    ...base,
    ready: true,
    reason: "READY",
    message: "Image verified",
  };
}