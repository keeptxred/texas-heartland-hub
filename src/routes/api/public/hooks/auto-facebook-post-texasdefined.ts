import { createFileRoute } from "@tanstack/react-router";
import {
  facebookPostMatchesArticle,
  fetchRecentFacebookPagePosts,
  type FacebookPagePost,
} from "@/lib/facebook-page-history";
import { centralClock, formatCentralMinute } from "@/lib/facebook-posting-schedule";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";

const OIDC_AUDIENCE = "keeptxred-facebook";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/auto-facebook-posts.yml";
const SITE_URL = "https://texasdefined.com";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const SOCIAL_PLATFORM = "facebook_texasdefined";
const GRAPH_VERSION = "v21.0";
const MAX_DAILY_POSTS = 2;
const MIN_GAP_MINUTES = 180;
const MAX_METADATA_ATTEMPTS = 18;

const TARGET_WINDOWS: ReadonlyArray<readonly [number, number]> = [
  [10 * 60, 12 * 60 + 30],
  [17 * 60 + 30, 20 * 60 + 30],
];

const FEATURED_STATIC_PATHS = new Set([
  "/best-places-to-go-camping-in-texas",
  "/moving-to-texas",
  "/texas-state-fair",
  "/texas-history",
  "/texas-flag",
  "/texas-fishing-license",
  "/texas-two-step",
  "/texas-vs-every-state",
]);

type SitemapCandidate = {
  url: string;
  path: string;
  lastmod: string | null;
};

type PageMetadata = {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
};

type QueueRow = {
  content_package_id: string;
  published_time: string | null;
};

type PackageRow = {
  id: string;
  source_url: string | null;
};

type SocialConnectionRow = {
  account_id: string | null;
  access_token: string | null;
  connection_status: string | null;
};

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function hash32(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function centralDateKey(value: string): string | null {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return null;
  return centralClock(new Date(timestamp)).dateKey;
}

function texasDefinedTargets(dateKey: string, seed: string): number[] {
  return TARGET_WINDOWS.map(([start, end], index) => {
    const span = Math.max(1, end - start + 1);
    return start + (hash32(`${seed}:texasdefined:${dateKey}:${index}`) % span);
  });
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, digits: string) => String.fromCodePoint(Number(digits)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .trim();
}

function tagAttributes(tag: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gis)) {
    attributes[match[1].toLowerCase()] = decodeEntities(match[3]);
  }
  return attributes;
}

function metaContent(html: string, key: string): string | null {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attrs = tagAttributes(tag);
    if ((attrs.property ?? attrs.name)?.toLowerCase() === key.toLowerCase() && attrs.content) {
      return attrs.content.trim();
    }
  }
  return null;
}

function canonicalHref(html: string): string | null {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const attrs = tagAttributes(tag);
    if ((attrs.rel ?? "").toLowerCase().split(/\s+/).includes("canonical") && attrs.href) {
      return attrs.href.trim();
    }
  }
  return null;
}

function titleTag(html: string): string | null {
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1] ? decodeEntities(match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")) : null;
}

function normalizeTexasDefinedUrl(raw: string, base = SITE_URL): string | null {
  try {
    const url = new URL(raw, base);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    if (host !== "texasdefined.com" && host !== "www.texasdefined.com") return null;
    url.hostname = "texasdefined.com";
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function eligiblePath(path: string): boolean {
  return path.startsWith("/article/") || path.startsWith("/news/") || FEATURED_STATIC_PATHS.has(path);
}

function parseSitemap(xml: string): SitemapCandidate[] {
  const rows: SitemapCandidate[] = [];
  for (const match of xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)) {
    const block = match[1];
    const loc = block.match(/<loc>([\s\S]*?)<\/loc>/i)?.[1];
    if (!loc) continue;
    const normalized = normalizeTexasDefinedUrl(decodeEntities(loc));
    if (!normalized) continue;
    const url = new URL(normalized);
    if (!eligiblePath(url.pathname)) continue;
    const lastmodRaw = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/i)?.[1];
    rows.push({
      url: normalized,
      path: url.pathname,
      lastmod: lastmodRaw ? decodeEntities(lastmodRaw) : null,
    });
  }
  return [...new Map(rows.map((row) => [row.url, row])).values()];
}

async function loadMetadata(candidateUrl: string): Promise<PageMetadata | null> {
  const response = await fetch(candidateUrl, {
    headers: {
      accept: "text/html,application/xhtml+xml",
      "user-agent": "TexasDefined-Facebook-Publisher/1.0",
    },
  });
  if (!response.ok) return null;
  const html = await response.text();
  const title = metaContent(html, "og:title") ?? titleTag(html);
  const description = metaContent(html, "og:description") ?? metaContent(html, "description") ?? "";
  const imageRaw = metaContent(html, "og:image");
  const canonicalRaw = canonicalHref(html) ?? candidateUrl;
  if (!title || !imageRaw) return null;
  const canonical = normalizeTexasDefinedUrl(canonicalRaw, candidateUrl);
  if (!canonical) return null;
  let imageUrl: string;
  try {
    imageUrl = new URL(imageRaw, candidateUrl).toString();
  } catch {
    return null;
  }
  if (!/^https:\/\//i.test(imageUrl)) return null;
  return {
    url: canonical,
    title: title.trim(),
    description: description.trim(),
    imageUrl,
  };
}

async function loadRecentQueue(db: any): Promise<{ rows: QueueRow[]; postedUrls: Set<string> }> {
  const cutoff = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
  const { data: rawRows, error } = await db
    .from("publishing_queue")
    .select("content_package_id,published_time")
    .eq("platform", SOCIAL_PLATFORM)
    .eq("status", "PUBLISHED")
    .gte("published_time", cutoff)
    .order("published_time", { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  const rows = (rawRows ?? []) as QueueRow[];
  const ids = [...new Set(rows.map((row) => row.content_package_id).filter(Boolean))];
  if (ids.length === 0) return { rows, postedUrls: new Set() };
  const { data: packages, error: packageError } = await db
    .from("content_packages")
    .select("id,source_url")
    .in("id", ids);
  if (packageError) throw new Error(packageError.message);
  return {
    rows,
    postedUrls: new Set(
      ((packages ?? []) as PackageRow[])
        .map((row) => row.source_url && normalizeTexasDefinedUrl(row.source_url))
        .filter((url): url is string => Boolean(url)),
    ),
  };
}

function postingDecision(args: {
  now: Date;
  seed: string;
  recentRows: QueueRow[];
}): {
  shouldPost: boolean;
  reason: string;
  dateKey: string;
  postsToday: number;
  nextTargetMinute: number | null;
  targets: number[];
} {
  const clock = centralClock(args.now);
  const targets = texasDefinedTargets(clock.dateKey, args.seed);
  const todayRows = args.recentRows.filter(
    (row) => row.published_time && centralDateKey(row.published_time) === clock.dateKey,
  );
  const postsToday = todayRows.length;
  const elapsedSlots = targets.filter((target) => target <= clock.minutes).length;
  const nextTargetMinute = targets.find((target) => target > clock.minutes) ?? null;

  if (postsToday >= MAX_DAILY_POSTS) {
    return { shouldPost: false, reason: "TexasDefined daily Facebook post cap reached", dateKey: clock.dateKey, postsToday, nextTargetMinute, targets };
  }
  if (elapsedSlots <= postsToday) {
    return { shouldPost: false, reason: "Waiting for the next TexasDefined Facebook window", dateKey: clock.dateKey, postsToday, nextTargetMinute, targets };
  }

  const latest = todayRows
    .map((row) => row.published_time && Date.parse(row.published_time))
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value))
    .sort((a, b) => b - a)[0];
  if (latest) {
    const gapMinutes = (args.now.getTime() - latest) / 60_000;
    if (gapMinutes < MIN_GAP_MINUTES) {
      return { shouldPost: false, reason: `Last TexasDefined Facebook post was less than ${MIN_GAP_MINUTES} minutes ago`, dateKey: clock.dateKey, postsToday, nextTargetMinute, targets };
    }
  }

  return { shouldPost: true, reason: "TexasDefined randomized Facebook window is due", dateKey: clock.dateKey, postsToday, nextTargetMinute, targets };
}

async function recordPublishedPost(db: any, metadata: PageMetadata, externalId: string | null): Promise<string | null> {
  let packageId: string | null = null;
  const { data: existing } = await db
    .from("content_packages")
    .select("id")
    .eq("source_url", metadata.url)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  packageId = existing?.id ?? null;

  if (!packageId) {
    const { data: inserted, error } = await db
      .from("content_packages")
      .insert({
        source_title: metadata.title,
        source_url: metadata.url,
        category: "TexasDefined",
        facebook_hook: metadata.title,
        facebook_body: metadata.description || null,
        facebook_cta: "Read on Texas Defined",
        status: "PUBLISHED",
        asset_type: "IMAGE",
        asset_url: metadata.imageUrl,
        workflow_status: "PUBLISHED",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    packageId = inserted.id;
  }

  const { error: queueError } = await db.from("publishing_queue").insert({
    content_package_id: packageId,
    platform: SOCIAL_PLATFORM,
    status: "PUBLISHED",
    published_time: new Date().toISOString(),
    notes: externalId ? `Facebook post ${externalId}` : "TexasDefined Facebook post",
  });
  if (queueError) throw new Error(queueError.message);
  return packageId;
}

async function runAutoTexasDefinedFacebookPost(request: Request) {
  const token = bearerToken(request);
  if (!token) {
    return Response.json({ ok: false, error: "Missing GitHub Actions OIDC token" }, { status: 401 });
  }

  try {
    await verifyGitHubActionsOidc({
      token,
      audience: OIDC_AUDIENCE,
      repository: REPOSITORY,
      workflowPath: WORKFLOW_PATH,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: "GitHub Actions OIDC verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 403 },
    );
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const adminSeed = process.env.ADMIN_PASSCODE ?? "keeptxred";
  const mode = request.headers.get("x-ktr-facebook-mode")?.trim().toLowerCase() || "scheduled";

  let recentRows: QueueRow[] = [];
  let postedUrls = new Set<string>();
  try {
    const recent = await loadRecentQueue(db);
    recentRows = recent.rows;
    postedUrls = recent.postedUrls;
  } catch (error) {
    return Response.json(
      { ok: false, posted: false, error: "Failed to load TexasDefined Facebook history", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }

  const decision = postingDecision({ now: new Date(), seed: adminSeed, recentRows });
  if (mode !== "manual" && !decision.shouldPost) {
    return Response.json({
      ok: true,
      posted: false,
      scheduled_wait: true,
      reason: decision.reason,
      schedule_date: decision.dateKey,
      posts_today: decision.postsToday,
      next_target_local: formatCentralMinute(decision.nextTargetMinute),
      targets_local: decision.targets.map((target) => formatCentralMinute(target)),
    });
  }

  const { data: rawConnection, error: connectionError } = await db
    .from("social_connections")
    .select("account_id,access_token,connection_status")
    .eq("platform", SOCIAL_PLATFORM)
    .maybeSingle();
  if (connectionError) {
    return Response.json({ ok: false, posted: false, error: connectionError.message }, { status: 500 });
  }
  const connection = rawConnection as SocialConnectionRow | null;
  if (!connection || connection.connection_status !== "CONNECTED" || !connection.account_id || !connection.access_token) {
    return Response.json(
      { ok: false, posted: false, error: "TexasDefined Facebook Page is not connected", requires_connection: true },
      { status: 503 },
    );
  }

  let livePosts: FacebookPagePost[];
  try {
    livePosts = await fetchRecentFacebookPagePosts({
      pageId: String(connection.account_id),
      pageToken: String(connection.access_token),
      limit: 100,
    });
  } catch (error) {
    return Response.json(
      { ok: false, posted: false, error: "TexasDefined Facebook duplicate verification failed", detail: error instanceof Error ? error.message : String(error) },
      { status: 503 },
    );
  }

  let sitemapText: string;
  try {
    const sitemapResponse = await fetch(SITEMAP_URL, {
      headers: { accept: "application/xml,text/xml", "user-agent": "TexasDefined-Facebook-Publisher/1.0" },
    });
    if (!sitemapResponse.ok) throw new Error(`HTTP ${sitemapResponse.status}`);
    sitemapText = await sitemapResponse.text();
  } catch (error) {
    return Response.json(
      { ok: false, posted: false, error: "TexasDefined sitemap is unavailable", detail: error instanceof Error ? error.message : String(error) },
      { status: 503 },
    );
  }

  const dateKey = decision.dateKey;
  const candidates = parseSitemap(sitemapText)
    .filter((candidate) => !postedUrls.has(candidate.url))
    .sort((a, b) => {
      const aDate = a.lastmod ? Date.parse(a.lastmod) : 0;
      const bDate = b.lastmod ? Date.parse(b.lastmod) : 0;
      const dateDelta = (Number.isFinite(bDate) ? bDate : 0) - (Number.isFinite(aDate) ? aDate : 0);
      if (dateDelta !== 0) return dateDelta;
      return hash32(`${adminSeed}:${dateKey}:${a.url}`) - hash32(`${adminSeed}:${dateKey}:${b.url}`);
    });

  let selected: PageMetadata | null = null;
  let checked = 0;
  for (const candidate of candidates) {
    if (checked >= MAX_METADATA_ATTEMPTS) break;
    checked += 1;
    let metadata: PageMetadata | null = null;
    try {
      metadata = await loadMetadata(candidate.url);
    } catch {
      continue;
    }
    if (!metadata) continue;
    const duplicate = livePosts.some((post) =>
      facebookPostMatchesArticle(post, { title: metadata.title, url: metadata.url, alternateUrls: [candidate.url] }),
    );
    if (duplicate) continue;
    selected = metadata;
    break;
  }

  if (!selected) {
    return Response.json({
      ok: true,
      posted: false,
      no_items: true,
      reason: "No unposted TexasDefined article with a Facebook-ready image was found",
      candidates_checked: checked,
      posts_today: decision.postsToday,
    });
  }

  const caption = [selected.title, selected.description, selected.url].filter(Boolean).join("\n\n");
  const graphUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(String(connection.account_id))}/photos`;
  const graphResponse = await fetch(graphUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      url: selected.imageUrl,
      caption,
      access_token: String(connection.access_token),
    }),
  });
  const graphJson = (await graphResponse.json().catch(() => ({}))) as {
    id?: string;
    post_id?: string;
    error?: { message?: string };
  };
  if (!graphResponse.ok || (!graphJson.post_id && !graphJson.id)) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: graphJson.error?.message ?? `Facebook Graph API returned HTTP ${graphResponse.status}`,
        requires_connection: graphResponse.status === 401 || graphResponse.status === 403,
      },
      { status: 502 },
    );
  }

  const externalId = graphJson.post_id ?? graphJson.id ?? null;
  let packageId: string | null = null;
  let recordWarning: string | null = null;
  try {
    packageId = await recordPublishedPost(db, selected, externalId);
  } catch (error) {
    recordWarning = error instanceof Error ? error.message : String(error);
    console.error("[TexasDefined Facebook] post succeeded but history recording failed", recordWarning);
  }

  return Response.json({
    ok: true,
    posted: true,
    site: "TexasDefined",
    title: selected.title,
    article_url: selected.url,
    external_id: externalId,
    post_url: externalId ? `https://www.facebook.com/${externalId}` : null,
    package_id: packageId,
    record_warning: recordWarning,
    posted_at: new Date().toISOString(),
    mode,
    posts_today_before_post: decision.postsToday,
    candidates_checked: checked,
  });
}

export const Route = createFileRoute("/api/public/hooks/auto-facebook-post-texasdefined")({
  server: {
    handlers: {
      POST: async ({ request }) => runAutoTexasDefinedFacebookPost(request),
    },
  },
});
