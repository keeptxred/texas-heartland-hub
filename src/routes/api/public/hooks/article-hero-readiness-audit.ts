import { createFileRoute } from "@tanstack/react-router";
import {
  buildExhaustedHeroRecoveryNote,
  buildHeroReadinessSubject,
  hasHeroVisualReadinessProvenance,
  isAuthoritativeOfficialGraphic,
  isGovernedExactEntityGraphic,
  isHeroReadinessQuarantined,
  resolveAuditableHeroUrl,
  type ArticleHeroReadinessRow,
} from "@/lib/article-hero-readiness";
import { generateFeaturedImageForSlugDirect } from "@/lib/featured-image.functions";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import { validateStoredHeroMatchesArticle } from "@/lib/stored-hero-vision";

const OIDC_AUDIENCE = "keeptxred-newsroom";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/article-hero-readiness-audit.yml";
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const COMMONS_AUDIT_WIDTH = 1600;
const FETCH_TIMEOUT_MS = 45_000;
const SOURCE_METADATA_TIMEOUT_MS = 15_000;
const IMAGE_FETCH_USER_AGENT = "KeepTXRed/1.0 (+https://keeptxred.com; editorial image readiness audit)";
const STORED_HERO_POLICY_VERSION = "v4";
const DATA_CENTER_STORY_RE = /\b(data center(?:s)?|data-center(?:s)?|server farm(?:s)?|hyperscale)\b/i;

type AuditRow = ArticleHeroReadinessRow & {
  published_at: string | null;
  updated_at: string | null;
  image_validation_history: unknown;
  quality_flags: string[] | null;
};

type CommonsAuditInfo = {
  sourceMetadata: string | null;
  auditImageUrl: string | null;
  originalByteSize: number | null;
  originalMime: string | null;
};

function bearerToken(request: Request): string | null {
  const match = (request.headers.get("authorization") ?? "").match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

async function authorized(request: Request): Promise<boolean> {
  const token = bearerToken(request);
  if (!token) return false;
  try {
    await verifyGitHubActionsOidc({
      token,
      audience: OIDC_AUDIENCE,
      repository: REPOSITORY,
      workflowPath: WORKFLOW_PATH,
      allowedEventNames: ["push", "schedule", "workflow_dispatch", "workflow_run"],
    });
    return true;
  } catch {
    return false;
  }
}

function targetUrl(row: AuditRow): string {
  return row.image_candidate_url?.trim() || row.featured_image_url?.trim() || "";
}

function isEligible(row: AuditRow): boolean {
  if (!row.published_at || !targetUrl(row)) return false;
  if (isHeroReadinessQuarantined(row)) return false;
  if (row.image_candidate_url?.trim()) return true;

  // Historical rows can still carry a canonical hero even after an earlier
  // generation/validator attempt marked the row failed. Those images must not
  // escape the governed stored-hero audit merely because their status is failed.
  const status = (row.image_generation_status ?? "").trim().toLowerCase();
  return (status === "ready" || status === "failed")
    && !hasHeroVisualReadinessProvenance(row.image_validation_note, targetUrl(row), row.slug);
}

function isDataCenterStory(row: AuditRow): boolean {
  return DATA_CENTER_STORY_RE.test(`${row.title} ${row.dek ?? ""}`);
}

function riskPriority(row: AuditRow): number {
  // Keep data-center coverage at the front because the original production
  // defect was metadata-correct but visually unreadable facility photography.
  // Prior policy rejects are deliberately rechecked when a new policy version
  // fixes a demonstrated false-negative class.
  if (isDataCenterStory(row)) return 0;
  if (row.image_candidate_url?.trim()) return 1;
  const note = (row.image_validation_note ?? "").toLowerCase();
  if (note.includes("primary-subject remediation")) return 2;
  if (/^https?:\/\//i.test(targetUrl(row))) return 3;
  if (note.includes("reviewed")) return 4;
  return 5;
}

function cleanFlags(flags: string[] | null | undefined, add?: string): string[] {
  const values = new Set((flags ?? []).filter(Boolean));
  values.delete("image_requires_visual_validation");
  if (add) values.add(add);
  return [...values];
}

function appendHistory(row: AuditRow, event: string, url: string, note: string): unknown[] {
  const current = Array.isArray(row.image_validation_history) ? row.image_validation_history : [];
  return [
    ...current,
    {
      at: new Date().toISOString(),
      event,
      url,
      note: note.slice(0, 1000),
    },
  ];
}

function cleanMetadata(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function commonsFileTitle(value: string): string | null {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const path = decodeURIComponent(url.pathname);
    if (host === "commons.wikimedia.org") {
      const redirectPrefix = "/wiki/Special:Redirect/file/";
      if (path.startsWith(redirectPrefix)) {
        const name = path.slice(redirectPrefix.length).trim();
        return name ? `File:${name}` : null;
      }
      const filePrefix = "/wiki/File:";
      if (path.startsWith(filePrefix)) {
        const name = path.slice(filePrefix.length).trim();
        return name ? `File:${name}` : null;
      }
    }
    if (host === "upload.wikimedia.org") {
      const name = path.split("/").filter(Boolean).pop()?.trim();
      return name ? `File:${name}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchCommonsAuditInfo(value: string): Promise<CommonsAuditInfo> {
  const title = commonsFileTitle(value);
  if (!title) {
    return { sourceMetadata: null, auditImageUrl: null, originalByteSize: null, originalMime: null };
  }

  const endpoint = new URL("https://commons.wikimedia.org/w/api.php");
  endpoint.searchParams.set("action", "query");
  endpoint.searchParams.set("format", "json");
  endpoint.searchParams.set("formatversion", "2");
  endpoint.searchParams.set("prop", "imageinfo");
  endpoint.searchParams.set("iiprop", "extmetadata|url|size|mime");
  endpoint.searchParams.set("iiurlwidth", String(COMMONS_AUDIT_WIDTH));
  endpoint.searchParams.set("titles", title);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SOURCE_METADATA_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json", "User-Agent": IMAGE_FETCH_USER_AGENT },
      signal: controller.signal,
    });
    if (!response.ok) {
      return { sourceMetadata: null, auditImageUrl: null, originalByteSize: null, originalMime: null };
    }
    const payload = await response.json() as {
      query?: {
        pages?: Array<{
          title?: string;
          imageinfo?: Array<{
            extmetadata?: Record<string, { value?: string }>;
            thumburl?: string;
            size?: number;
            mime?: string;
          }>;
        }>;
      };
    };
    const page = payload.query?.pages?.[0];
    const imageInfo = page?.imageinfo?.[0];
    const metadata = imageInfo?.extmetadata ?? {};
    const parts = [
      page?.title ? `File: ${page.title.replace(/^File:/i, "").trim()}` : "",
      metadata.ObjectName?.value ? `Object: ${cleanMetadata(metadata.ObjectName.value)}` : "",
      metadata.ImageDescription?.value ? `Description: ${cleanMetadata(metadata.ImageDescription.value)}` : "",
      metadata.Categories?.value ? `Categories: ${cleanMetadata(metadata.Categories.value)}` : "",
    ].filter(Boolean);
    const combined = parts.join(" | ").replace(/\s+/g, " ").trim();
    return {
      sourceMetadata: combined ? combined.slice(0, 1400) : null,
      auditImageUrl: imageInfo?.thumburl?.trim() || null,
      originalByteSize: Number.isFinite(imageInfo?.size) ? Number(imageInfo?.size) : null,
      originalMime: imageInfo?.mime?.trim().toLowerCase() || null,
    };
  } catch {
    return { sourceMetadata: null, auditImageUrl: null, originalByteSize: null, originalMime: null };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchHeroBytes(value: string, requestUrl: string): Promise<{ bytes: Uint8Array; contentType: string; finalUrl: string }> {
  const resolved = resolveAuditableHeroUrl(value, requestUrl);
  if (!resolved) throw new Error("Hero URL is outside the guarded automatic-audit host policy");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(resolved, {
      redirect: "follow",
      headers: {
        Accept: "image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8",
        "User-Agent": IMAGE_FETCH_USER_AGENT,
      },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Hero fetch HTTP ${response.status}`);
    if (!resolveAuditableHeroUrl(response.url || resolved.toString(), requestUrl)) {
      throw new Error("Hero redirect left the guarded automatic-audit host policy");
    }

    const contentType = (response.headers.get("content-type") || "").split(";", 1)[0].trim().toLowerCase();
    if (!contentType.startsWith("image/") || contentType === "image/svg+xml") {
      throw new Error(`Hero fetch returned unsupported content type: ${contentType || "unknown"}`);
    }
    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (declaredLength > MAX_IMAGE_BYTES) throw new Error("Hero image exceeds automatic-audit size limit");

    const buffer = await response.arrayBuffer();
    if (!buffer.byteLength) throw new Error("Hero fetch returned an empty image body");
    if (buffer.byteLength > MAX_IMAGE_BYTES) throw new Error("Hero image exceeds automatic-audit size limit");
    return { bytes: new Uint8Array(buffer), contentType, finalUrl: response.url || resolved.toString() };
  } catch (error) {
    if ((error as Error)?.name === "AbortError") throw new Error(`Hero fetch timed out after ${FETCH_TIMEOUT_MS}ms`);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function loadQueue(db: any): Promise<AuditRow[]> {
  const columns = [
    "slug",
    "title",
    "dek",
    "category",
    "affected_regions",
    "seo_headline",
    "featured_image_url",
    "image_candidate_url",
    "image_candidate_alt_text",
    "image_alt_text",
    "image_generation_status",
    "image_validation_note",
    "image_validation_history",
    "quality_flags",
    "body_json",
    "published_at",
    "updated_at",
  ].join(",");
  const { data, error } = await db
    .from("daily_articles")
    .select(columns)
    .not("published_at", "is", null)
    .order("updated_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return (data ?? [])
    .filter((row: AuditRow) => isEligible(row))
    .sort((a: AuditRow, b: AuditRow) => {
      const risk = riskPriority(a) - riskPriority(b);
      if (risk) return risk;
      return Date.parse(b.published_at ?? "") - Date.parse(a.published_at ?? "");
    });
}

async function acceptAuthoritativeGraphic(db: any, row: AuditRow, candidate: string) {
  const note = "authoritative-image-exempt: official NOAA/NHC storm or hurricane outlook graphic recognized by the guarded government-source host/path policy; exact authoritative graphic may bypass photorealism validation.";
  const alt = row.image_candidate_alt_text?.trim() || row.image_alt_text?.trim() || `Official source graphic for ${row.title}`;
  const { error } = await db.from("daily_articles").update({
    featured_image_url: candidate,
    image_url: candidate,
    image_alt_text: alt,
    image_generation_status: "ready",
    image_validation_note: note,
    image_candidate_url: null,
    image_candidate_alt_text: null,
    quality_flags: cleanFlags(row.quality_flags),
  }).eq("slug", row.slug);
  if (error) throw new Error(error.message);
  return { accepted: true as const, exempt: true as const, note };
}

async function acceptGovernedExactEntityGraphic(db: any, row: AuditRow, candidate: string) {
  const note = "exact-entity-graphic-v1 ok: exact named-entity identity graphic matched by both article slug and allowlisted reusable source URL; used only when a truthful event photograph is unavailable and labeled as a graphic rather than documentary photography.";
  const alt = row.image_candidate_alt_text?.trim() || row.image_alt_text?.trim() || `Identity graphic for ${row.title}`;
  const { error } = await db.from("daily_articles").update({
    featured_image_url: candidate,
    image_url: candidate,
    image_alt_text: alt,
    image_generation_status: "ready",
    image_validation_note: note,
    image_candidate_url: null,
    image_candidate_alt_text: null,
    quality_flags: cleanFlags(row.quality_flags),
  }).eq("slug", row.slug);
  if (error) throw new Error(error.message);
  return { accepted: true as const, exempt: true as const, exactEntityGraphic: true as const, note };
}

async function acceptValidatedHero(db: any, row: AuditRow, candidate: string, reason: string) {
  const alt = row.image_candidate_alt_text?.trim() || row.image_alt_text?.trim() || `Editorial image for Keep TX Red article: ${row.title}`;
  const note = `stored-cloudflare-vision-${STORED_HERO_POLICY_VERSION} ok: ${reason}`.slice(0, 1000);
  const { error } = await db.from("daily_articles").update({
    featured_image_url: candidate,
    image_url: candidate,
    image_alt_text: alt,
    image_generation_status: "ready",
    image_validation_note: note,
    image_candidate_url: null,
    image_candidate_alt_text: null,
    quality_flags: cleanFlags(row.quality_flags),
  }).eq("slug", row.slug);
  if (error) throw new Error(error.message);
  return { accepted: true as const, exempt: false as const, note };
}

async function rejectHero(db: any, row: AuditRow, candidate: string, reason: string, repair: boolean) {
  const previousHeroIsTrusted = Boolean(row.featured_image_url?.trim())
    && Boolean(row.image_candidate_url?.trim())
    && hasHeroVisualReadinessProvenance(row.image_validation_note, row.featured_image_url, row.slug);
  const note = `stored-cloudflare-vision-${STORED_HERO_POLICY_VERSION} rejected: ${reason}`.slice(0, 1000);

  if (previousHeroIsTrusted) {
    const { error } = await db.from("daily_articles").update({
      image_candidate_url: null,
      image_candidate_alt_text: null,
      image_validation_history: appendHistory(row, "candidate_rejected", candidate, note),
      quality_flags: cleanFlags(row.quality_flags),
    }).eq("slug", row.slug);
    if (error) throw new Error(error.message);
    return { accepted: false as const, retainedPreviousHero: true as const, repaired: false as const, note };
  }

  const flags = cleanFlags(row.quality_flags, "image_requires_visual_validation");
  const { error } = await db.from("daily_articles").update({
    featured_image_url: null,
    image_url: row.featured_image_url === candidate ? null : undefined,
    image_alt_text: null,
    image_candidate_url: candidate,
    image_candidate_alt_text: row.image_candidate_alt_text?.trim() || row.image_alt_text?.trim() || null,
    image_generation_status: "failed",
    image_validation_note: note,
    quality_flags: flags,
  }).eq("slug", row.slug);
  if (error) throw new Error(error.message);

  if (!repair) return { accepted: false as const, retainedPreviousHero: false as const, repaired: false as const, note };
  const generated = await generateFeaturedImageForSlugDirect(row.slug, true);
  if (generated.ok) {
    return { accepted: false as const, retainedPreviousHero: false as const, repaired: true as const, replacementUrl: generated.url, note };
  }

  // The generator records its own failure note. Restore the stored-candidate
  // rejection prefix afterward so this exhausted candidate remains quarantined
  // instead of re-entering the hourly queue and consuming generation repeatedly.
  const exhaustedNote = buildExhaustedHeroRecoveryNote(STORED_HERO_POLICY_VERSION, reason, generated.error);
  const { error: quarantineError } = await db.from("daily_articles").update({
    image_candidate_url: candidate,
    image_candidate_alt_text: row.image_candidate_alt_text?.trim() || row.image_alt_text?.trim() || null,
    image_generation_status: "failed",
    image_validation_note: exhaustedNote,
    quality_flags: flags,
  }).eq("slug", row.slug);
  if (quarantineError) throw new Error(quarantineError.message);

  return {
    accepted: false as const,
    retainedPreviousHero: false as const,
    repaired: false as const,
    repairError: generated.error,
    note: exhaustedNote,
  };
}

async function post({ request }: { request: Request }) {
  if (!(await authorized(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const requestedSlug = (url.searchParams.get("slug") ?? "").trim();
  const dryRun = url.searchParams.get("dry") === "1";
  const repair = url.searchParams.get("repair") === "1";

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Generated database types intentionally lag the internal readiness-audit fields.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;

  let queue: AuditRow[];
  try {
    queue = await loadQueue(db);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }

  if (dryRun) {
    return Response.json({
      ok: true,
      dryRun: true,
      ready: queue.length,
      slugs: queue.map((row) => row.slug),
      primarySubjectRemediations: queue.filter((row) => (row.image_validation_note ?? "").toLowerCase().includes("primary-subject remediation")).length,
      candidates: queue.filter((row) => Boolean(row.image_candidate_url?.trim())).length,
      dataCenterStories: queue.filter(isDataCenterStory).length,
      storedHeroPolicy: STORED_HERO_POLICY_VERSION,
      scope: "all_published_hero_candidates_without_visual_readiness_provenance",
    });
  }

  if (!requestedSlug) return Response.json({ error: "Missing eligible slug" }, { status: 400 });
  const row = queue.find((item) => item.slug === requestedSlug);
  if (!row) return Response.json({ error: "Slug is not currently in the hero-readiness audit queue" }, { status: 409 });

  const candidate = targetUrl(row);
  try {
    if (isGovernedExactEntityGraphic(row.slug, candidate)) {
      const result = await acceptGovernedExactEntityGraphic(db, row, candidate);
      return Response.json({ ok: true, slug: row.slug, candidate, ...result });
    }

    if (isAuthoritativeOfficialGraphic(candidate)) {
      const result = await acceptAuthoritativeGraphic(db, row, candidate);
      return Response.json({ ok: true, slug: row.slug, candidate, ...result });
    }

    const commonsAudit = await fetchCommonsAuditInfo(candidate);
    const auditImageUrl = commonsAudit.auditImageUrl || candidate;
    const fetched = await fetchHeroBytes(auditImageUrl, request.url);
    const subject = buildHeroReadinessSubject(row);
    const verdict = await validateStoredHeroMatchesArticle(
      fetched.bytes,
      fetched.contentType,
      subject,
      {
        candidateUrl: candidate,
        candidateAltText: row.image_candidate_alt_text?.trim() || row.image_alt_text?.trim() || null,
        sourceMetadata: commonsAudit.sourceMetadata,
      },
    );
    const auditDerivativeUsed = auditImageUrl !== candidate;
    if (verdict.matches) {
      const result = await acceptValidatedHero(db, row, candidate, verdict.reason);
      return Response.json({
        ok: true,
        slug: row.slug,
        candidate,
        finalUrl: fetched.finalUrl,
        auditDerivativeUsed,
        sourceOriginalBytes: commonsAudit.originalByteSize,
        sourceOriginalMime: commonsAudit.originalMime,
        sourceMetadataUsed: Boolean(commonsAudit.sourceMetadata),
        validation: verdict.reason,
        ...result,
      });
    }

    const result = await rejectHero(db, row, candidate, verdict.reason, repair);
    return Response.json({
      ok: true,
      slug: row.slug,
      candidate,
      finalUrl: fetched.finalUrl,
      auditDerivativeUsed,
      sourceOriginalBytes: commonsAudit.originalByteSize,
      sourceOriginalMime: commonsAudit.originalMime,
      sourceMetadataUsed: Boolean(commonsAudit.sourceMetadata),
      validation: verdict.reason,
      ...result,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    try {
      const result = await rejectHero(db, row, candidate, reason, repair);
      return Response.json({ ok: true, slug: row.slug, candidate, validation: reason, fetchOrValidationError: true, ...result });
    } catch (repairError) {
      return Response.json({
        ok: false,
        slug: row.slug,
        candidate,
        error: reason,
        repairError: repairError instanceof Error ? repairError.message : String(repairError),
      }, { status: 500 });
    }
  }
}

export const Route = createFileRoute("/api/public/hooks/article-hero-readiness-audit")({
  server: { handlers: { POST: post } },
});
