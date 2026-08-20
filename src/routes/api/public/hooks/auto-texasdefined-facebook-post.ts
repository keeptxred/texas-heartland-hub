import { createFileRoute } from "@tanstack/react-router";
import { facebookPostMatchesArticle, fetchRecentFacebookPagePosts } from "@/lib/facebook-page-history";
import { facebookPostingDecision, formatCentralMinute } from "@/lib/facebook-posting-schedule";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";

const OIDC_AUDIENCE = "keeptxred-facebook";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/auto-facebook-posts.yml";
const SITE_URL = "https://texasdefined.com";
const PAGE_ID = "61592643126518";
const PLATFORM = "facebook_texasdefined";
const GRAPH_VERSION = "v21.0";
const MAX_METADATA_FETCHES = 36;
const MAX_SITEMAP_URLS = 6000;

type SocialConnectionRow = {
  account_id: string | null;
  account_name: string | null;
  access_token: string | null;
  connection_status: string | null;
};

type RecentQueueRow = {
  content_package_id: string;
  published_time: string | null;
};

type PackageRow = {
  id: string;
  source_title: string;
  source_url: string | null;
};

type Candidate = {
  url: string;
  title: string;
  description: string;
  image: string;
};

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function xmlValues(xml: string, tag: string): string[] {
  const out: string[] = [];
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  for (const match of xml.matchAll(re)) {
    const value = decodeHtml(match[1].trim());
    if (value) out.push(value);
  }
  return out;
}

async function loadSitemapUrls(url = `${SITE_URL}/sitemap.xml`, depth = 0): Promise<string[]> {
  const response = await fetch(url, { headers: { "user-agent": "TexasDefined-FacebookBot/1.0" } });
  if (!response.ok) throw new Error(`Sitemap fetch failed: HTTP ${response.status}`);
  const xml = await response.text();
  const locs = xmlValues(xml, "loc");
  if (/\<sitemapindex\b/i.test(xml) && depth < 2) {
    const childLists = await Promise.all(locs.slice(0, 40).map((loc) => loadSitemapUrls(loc, depth + 1)));
    return [...new Set(childLists.flat())].slice(0, MAX_SITEMAP_URLS);
  }
  return [...new Set(locs)].slice(0, MAX_SITEMAP_URLS);
}

function isEligibleTexasDefinedUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (url.hostname !== "texasdefined.com" && url.hostname !== "www.texasdefined.com") return false;
    const path = url.pathname.toLowerCase();
    if (path === "/" || path.endsWith(".xml") || path.includes("/shop") || path.includes("/search")) return false;
    if (/\/(politics|elections?|candidates?|races?)(\/|$)/.test(path)) return false;
    return (
      path.startsWith("/article/") ||
      path.startsWith("/county/") ||
      path.startsWith("/destination/") ||
      path.startsWith("/learn/") ||
      path.startsWith("/sports-venue/") ||
      path.startsWith("/property-tax/county/") ||
      path.includes("calculator") ||
      path.startsWith("/explore/")
    );
  } catch {
    return false;
  }
}

function hash32(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function extractMeta(html: string, key: string): string | null {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtml(match[1].trim());
  }
  return null;
}

function isPoliticalText(value: string): boolean {
  return /\b(election|republican|democrat|campaign|ballot|congressional race|senate race|political party|primary runoff)\b/i.test(value);
}

async function metadataFor(url: string): Promise<Candidate | null> {
  try {
    const response = await fetch(url, {
      headers: { "user-agent": "TexasDefined-FacebookBot/1.0", accept: "text/html" },
      redirect: "follow",
    });
    if (!response.ok) return null;
    const html = await response.text();
    const title = extractMeta(html, "og:title") ?? extractMeta(html, "twitter:title") ?? "";
    const description = extractMeta(html, "og:description") ?? extractMeta(html, "description") ?? "";
    const rawImage = extractMeta(html, "og:image") ?? extractMeta(html, "twitter:image") ?? "";
    if (!title || !rawImage || isPoliticalText(`${title} ${description}`)) return null;
    const image = new URL(rawImage, url).toString();
    if (!/^https?:\/\//i.test(image)) return null;
    return { url, title: title.replace(/\s*[|—-]\s*TexasDefined.*$/i, "").trim(), description, image };
  } catch {
    return null;
  }
}

async function recentHistory(db: any) {
  const cutoff = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
  const { data: rawRows, error } = await db
    .from("publishing_queue")
    .select("content_package_id,published_time")
    .eq("platform", PLATFORM)
    .eq("status", "PUBLISHED")
    .gte("published_time", cutoff)
    .order("published_time", { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  const rows = (rawRows ?? []) as RecentQueueRow[];
  const ids = [...new Set(rows.map((row) => row.content_package_id).filter(Boolean))];
  if (ids.length === 0) return rows.map((row) => ({ title: "TexasDefined post", published_at: row.published_time }));
  const { data: packages, error: packageError } = await db
    .from("content_packages")
    .select("id,source_title")
    .in("id", ids);
  if (packageError) throw new Error(packageError.message);
  const titles = new Map((packages ?? []).map((row: { id: string; source_title: string }) => [row.id, row.source_title]));
  return rows.map((row) => ({ title: titles.get(row.content_package_id) ?? "TexasDefined post", published_at: row.published_time }));
}

async function previouslyPostedUrls(db: any): Promise<Set<string>> {
  const { data: queueRows, error } = await db
    .from("publishing_queue")
    .select("content_package_id")
    .eq("platform", PLATFORM)
    .eq("status", "PUBLISHED")
    .limit(5000);
  if (error) throw new Error(error.message);
  const ids = [...new Set((queueRows ?? []).map((row: { content_package_id: string }) => row.content_package_id).filter(Boolean))];
  if (ids.length === 0) return new Set();
  const { data: packages, error: packageError } = await db
    .from("content_packages")
    .select("id,source_url")
    .in("id", ids);
  if (packageError) throw new Error(packageError.message);
  return new Set(((packages ?? []) as PackageRow[]).map((row) => row.source_url).filter((url): url is string => Boolean(url)));
}

async function postCandidate(db: any, connection: SocialConnectionRow, candidate: Candidate) {
  const pageToken = String(connection.access_token);
  const livePosts = await fetchRecentFacebookPagePosts({ pageId: PAGE_ID, pageToken, limit: 100 });
  if (livePosts.some((post) => facebookPostMatchesArticle(post, { title: candidate.title, url: candidate.url, alternateUrls: [] }))) {
    return { ok: false as const, duplicate: true as const, error: "Already present on the live TexasDefined Facebook Page" };
  }

  const caption = candidate.description
    ? `${candidate.title}\n\n${candidate.description.slice(0, 360)}`
    : candidate.title;

  const { data: pkg, error: pkgError } = await db
    .from("content_packages")
    .insert({
      source_title: candidate.title,
      source_url: candidate.url,
      category: "TexasDefined",
      facebook_hook: candidate.title,
      facebook_body: caption,
      facebook_cta: "",
      facebook_hashtags: "",
      asset_type: "IMAGE",
      asset_url: candidate.image,
      status: "DRAFT",
      workflow_status: "READY_TO_POST",
    })
    .select("id")
    .single();
  if (pkgError || !pkg) return { ok: false as const, error: pkgError?.message ?? "Failed to create content package" };

  const body = new URLSearchParams();
  body.set("access_token", pageToken);
  body.set("message", caption);
  body.set("link", candidate.url);
  const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${PAGE_ID}/feed`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const result = (await response.json()) as { id?: string; error?: { message?: string } };
  if (!response.ok || !result.id) {
    return { ok: false as const, error: result.error?.message ?? `Facebook Graph API HTTP ${response.status}` };
  }

  const postedAt = new Date().toISOString();
  const postUrl = `https://www.facebook.com/${result.id}`;
  await db.from("content_packages").update({ workflow_status: "PUBLISHED", status: "PUBLISHED" }).eq("id", pkg.id);
  const { error: queueError } = await db.from("publishing_queue").insert({
    content_package_id: pkg.id,
    platform: PLATFORM,
    status: "PUBLISHED",
    published_time: postedAt,
    notes: postUrl,
  });
  if (queueError) {
    return { ok: false as const, error: `Facebook post succeeded but history recording failed: ${queueError.message}` };
  }
  return { ok: true as const, external_id: result.id, post_url: postUrl, posted_at: postedAt };
}

async function run(request: Request) {
  const token = bearerToken(request);
  if (!token) return Response.json({ ok: false, error: "Missing GitHub Actions OIDC token" }, { status: 401 });
  try {
    await verifyGitHubActionsOidc({ token, audience: OIDC_AUDIENCE, repository: REPOSITORY, workflowPath: WORKFLOW_PATH });
  } catch (error) {
    return Response.json({ ok: false, error: "GitHub Actions OIDC verification failed", detail: error instanceof Error ? error.message : String(error) }, { status: 403 });
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const { data: rawConnection, error: connectionError } = await db
    .from("social_connections")
    .select("account_id,account_name,access_token,connection_status")
    .eq("platform", PLATFORM)
    .maybeSingle();
  if (connectionError) return Response.json({ ok: false, error: connectionError.message }, { status: 500 });
  const connection = rawConnection as SocialConnectionRow | null;
  if (!connection || connection.connection_status !== "CONNECTED" || connection.account_id !== PAGE_ID || !connection.access_token) {
    return Response.json({ ok: true, posted: false, setup_required: true, reason: "TexasDefined Facebook Page is not connected yet. Reconnect Meta and grant the TexasDefined Page." });
  }

  const recentPosts = await recentHistory(db);
  const mode = request.headers.get("x-ktr-facebook-mode")?.trim().toLowerCase() || "scheduled";
  if (mode !== "manual") {
    const decision = facebookPostingDecision({
      now: new Date(),
      seed: `texasdefined:${process.env.ADMIN_PASSCODE ?? "keeptxred"}`,
      recentPosts,
      maxDailyPosts: 2,
      targetSlots: [1, 4],
    });
    if (!decision.shouldPost) {
      return Response.json({
        ok: true,
        posted: false,
        scheduled_wait: true,
        reason: decision.reason,
        posts_today: decision.postsToday,
        next_target_local: formatCentralMinute(decision.nextTargetMinute),
        targets_local: decision.targets.map((target) => formatCentralMinute(target)),
      });
    }
  }

  const postedUrls = await previouslyPostedUrls(db);
  const sitemapUrls = (await loadSitemapUrls()).filter(isEligibleTexasDefinedUrl).filter((url) => !postedUrls.has(url));
  if (sitemapUrls.length === 0) return Response.json({ ok: true, posted: false, no_items: true, reason: "No unposted TexasDefined sitemap URLs remain" });

  const daySeed = new Date().toISOString().slice(0, 10);
  const sample = sitemapUrls
    .sort((a, b) => hash32(`${daySeed}:${a}`) - hash32(`${daySeed}:${b}`))
    .slice(0, MAX_METADATA_FETCHES);
  const metadata = (await Promise.all(sample.map(metadataFor))).filter((row): row is Candidate => Boolean(row));
  if (metadata.length === 0) return Response.json({ ok: true, posted: false, no_items: true, reason: "No eligible TexasDefined pages with usable Open Graph metadata were found" });

  for (const candidate of metadata) {
    const result = await postCandidate(db, connection, candidate);
    if (result.ok) {
      return Response.json({ ok: true, posted: true, title: candidate.title, article_url: candidate.url, image_url: candidate.image, mode, ...result });
    }
    if (!result.duplicate) {
      console.error("[TexasDefined Facebook] candidate failed", { url: candidate.url, error: result.error });
    }
  }

  return Response.json({ ok: true, posted: false, no_items: true, reason: "All sampled TexasDefined candidates were duplicates or failed Facebook publishing checks" });
}

export const Route = createFileRoute("/api/public/hooks/auto-texasdefined-facebook-post")({
  server: { handlers: { POST: async ({ request }) => run(request) } },
});
