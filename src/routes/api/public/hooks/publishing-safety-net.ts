import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { RESERVE_ARTICLES } from "@/data/reserve-articles";
import { articleMainText, articleMainWordCount, INGESTED_MIN_MAIN_WORDS } from "@/lib/article-length";
import { enrichArticleRow } from "@/lib/content-quality";
import { prepareFeaturedImageForUnpublishedNewsroomArticle } from "@/lib/featured-image.functions";
import { canTrySecondVerifiedReserveImage } from "@/lib/reserve-image-recovery";
import { assertKeepTxRedPublication, inferKeepTxRedDomain } from "@/lib/content-publication-guard";

const STALL_MS = 24 * 60 * 60 * 1000;
const RESERVE_SOURCE = "Keep TX Red Reserve Desk";

type LatestRow = {
  slug: string;
  published_at: string;
  source_name: string | null;
  author: string | null;
  kind: string | null;
  image_generation_status: string | null;
  featured_image_url: string | null;
  quality_flags: string[] | null;
};
// Historical unillustrated backfills never satisfy a publishing stall. The
// text-first marker is created ONLY after the normal newsroom's complete
// source, draft, duplicate and quality preflight, not by an image backfill.
function qualifiedWebsitePublication(row: LatestRow): boolean {
  return (row.image_generation_status === "ready" && Boolean(row.featured_image_url?.trim()))
    || (row.kind === "news" && row.author === "Keep TX Red Newsroom"
      && (row.quality_flags ?? []).includes("newsroom_text_first_verified"));
}
type OpenAlert = { id: string; incident_key: string; opened_at: string; resolved_at: string | null };

function isOlderThan24Hours(iso: string | null): boolean {
  if (!iso) return true;
  const timestamp = Date.parse(iso);
  return !Number.isFinite(timestamp) || Date.now() - timestamp >= STALL_MS;
}

async function sendOptionalWebhook(payload: Record<string, unknown>): Promise<boolean> {
  const webhook = process.env.PUBLISHING_ALERT_WEBHOOK_URL;
  if (!webhook) return false;
  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok;
  } catch (error) {
    console.error("[publishing-safety-net] alert webhook failed", error);
    return false;
  }
}

export async function runPublishingSafetyNet() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey =
    process.env.KEEP_TX_RED_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return { ok: false as const, status: 500, error: "Missing required environment variables" };
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const [latestArticlesResult, openAlertResult, publishedReserveResult] =
    await Promise.all([
      supabase
        .from("daily_articles")
        .select("slug,published_at,source_name,author,kind,image_generation_status,featured_image_url,quality_flags")
        // Bounded current-publication window. An old pending-image import has
        // no text-first verification marker and cannot mask a live outage.
        .order("published_at", { ascending: false })
        .limit(150),
      supabase
        .from("publishing_alerts")
        .select("id,incident_key,opened_at,resolved_at")
        .eq("status", "open")
        .like("incident_key", "publishing-stall-%")
        .order("opened_at", { ascending: false })
        .limit(1)
        .maybeSingle<OpenAlert>(),
      supabase.from("reserve_article_publications").select("reserve_key"),
    ]);

  const readError =
    latestArticlesResult.error ||
    openAlertResult.error ||
    publishedReserveResult.error;
  if (readError) {
    console.error("[publishing-safety-net] state read failed", readError);
    return { ok: false as const, status: 500, error: readError.message };
  }

  const qualified = ((latestArticlesResult.data ?? []) as LatestRow[]).filter(qualifiedWebsitePublication);
  const latestAny = qualified[0] ?? null;
  const latestAutomation = qualified.find((article) => article.source_name !== RESERVE_SOURCE) ?? null;
  const automationStalled = isOlderThan24Hours(latestAutomation?.published_at ?? null);
  const publicationGap = isOlderThan24Hours(latestAny?.published_at ?? null);
  let openAlert = openAlertResult.data;
  let alertOpened = false;
  let webhookSent = false;

  // An existing incident may have been reopened by a previous upsert that
  // preserved its old resolution timestamp. Keep status and resolved_at in
  // agreement without clearing or notifying unrelated editorial alerts.
  if (automationStalled && openAlert?.resolved_at) {
    const { error: reopenError } = await supabase
      .from("publishing_alerts")
      .update({ resolved_at: null, updated_at: new Date().toISOString() })
      .eq("id", openAlert.id)
      .eq("status", "open")
      .like("incident_key", "publishing-stall-%");
    if (reopenError) {
      console.error("[publishing-safety-net] failed to reconcile reopened incident", reopenError);
      return { ok: false as const, status: 500, error: reopenError.message };
    }
    openAlert = { ...openAlert, resolved_at: null };
  }

  if (automationStalled && !openAlert) {
    const incidentKey = `publishing-stall-${latestAutomation?.published_at ?? "no-publication"}`;
    const message = latestAutomation
      ? `No normal newsroom article has published for 24 hours. Latest publication: ${latestAutomation.published_at}.`
      : "No normal newsroom article has been found. The publishing safety net is active.";
    const { data: inserted, error } = await supabase
      .from("publishing_alerts")
      .upsert(
        {
          incident_key: incidentKey,
          status: "open",
          resolved_at: null,
          latest_published_at: latestAutomation?.published_at ?? null,
          message,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "incident_key" },
      )
      .select("id,incident_key,opened_at,resolved_at")
      .single<OpenAlert>();
    if (error) {
      console.error("[publishing-safety-net] failed to open alert", error);
    } else {
      openAlert = inserted;
      alertOpened = true;
      webhookSent = await sendOptionalWebhook({
        event: "publishing_stalled",
        severity: "warning",
        site: "keeptxred.com",
        message,
        latest_published_at: latestAutomation?.published_at ?? null,
      });
      if (webhookSent) {
        await supabase
          .from("publishing_alerts")
          .update({ notification_sent_at: new Date().toISOString(), updated_at: new Date().toISOString() })
          .eq("id", inserted.id);
      }
    }
  }

  if (!automationStalled && openAlert) {
    await supabase
      .from("publishing_alerts")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", openAlert.id)
      // Defensive isolation: never resolve another subsystem's alert.
      .like("incident_key", "publishing-stall-%");
    await sendOptionalWebhook({
      event: "publishing_recovered",
      severity: "info",
      site: "keeptxred.com",
      message: "Normal article publishing has resumed.",
      latest_published_at: latestAutomation?.published_at ?? null,
    });
  }

  let reservePublished: string | null = null;
  if (automationStalled && publicationGap) {
    const publishedKeys = new Set(
      (publishedReserveResult.data ?? []).map((row: { reserve_key: string }) => row.reserve_key),
    );
    // Avoid a six-day stall because one perfectly sourced reserve guide keeps
    // failing the image's story-match visual test. Try at most ONE other vetted
    // guide, only on a substantive image mismatch. Never skip a vision gate.
    const reserveChoices = RESERVE_ARTICLES.filter((article) => !publishedKeys.has(article.key)).slice(0, 2);
    const imageFailures: string[] = [];
    for (const reserve of reserveChoices) {
      const now = new Date();
      const date = now.toISOString().slice(0, 10);
      const slug = `${date}-${reserve.slugStem}`;
      const bodyJson = {
        ...reserve.body,
        updated: date,
      };
      const mainWordCount = articleMainWordCount(bodyJson);
      if (mainWordCount < INGESTED_MIN_MAIN_WORDS) {
        throw new Error(
          `Reserve article ${reserve.key} is below the ${INGESTED_MIN_MAIN_WORDS}-word visibility floor (${mainWordCount}).`,
        );
      }

      assertKeepTxRedPublication({
        id: `reserve:${reserve.key}`,
        title: reserve.title,
        domain: inferKeepTxRedDomain(reserve.category),
        sourceSite: "KeepTXRed",
        sourceCanonicalUrl: `https://keeptxred.com/news/${slug}`,
        proposedUrl: `https://keeptxred.com/news/${slug}`,
      });

      const row = {
        slug,
        internal_url: `/news/${slug}`,
        is_ingested: true,
        kind: "ingested",
        category: reserve.category,
        title: reserve.title,
        dek: reserve.dek,
        body: articleMainText(bodyJson),
        body_json: bodyJson,
        author: "Keep TX Red Editorial Staff",
        source_name: RESERVE_SOURCE,
        source_url: null,
        published_at: now.toISOString(),
        is_breaking: false,
        score: 0,
      };
      enrichArticleRow(row);

      const preparedImage = await prepareFeaturedImageForUnpublishedNewsroomArticle({
        slug: row.slug, title: row.title, dek: row.dek,
        category: row.category, body_json: row.body_json,
      });
      if (!preparedImage.ok || !preparedImage.url || !preparedImage.imageValidationNote) {
        const failure = preparedImage.ok ? "missing_image_provenance" : preparedImage.error;
        imageFailures.push(`${reserve.key}: ${failure}`);
        if (reserveChoices.length > 1 && imageFailures.length === 1 && canTrySecondVerifiedReserveImage(failure)) {
          console.warn("[publishing-safety-net] reserve image mismatched; trying one other verified article", {
            reserveKey: reserve.key,
          });
          continue;
        }
        return {
          ok: false as const, status: 503,
          error: `reserve_newsroom_image_publication_hold: ${imageFailures.join(" | ").slice(0, 900)}`,
        };
      }
      const { error: articleError } = await supabase
        .from("daily_articles")
        .insert({
          ...row,
          featured_image_url: preparedImage.url,
          image_url: preparedImage.url,
          image_alt_text: preparedImage.alt,
          image_generation_status: "ready",
          image_validation_note: preparedImage.imageValidationNote,
          image_prompt: preparedImage.imagePrompt ?? null,
        });
      if (articleError) {
        console.error("[publishing-safety-net] reserve publish failed", articleError);
        return { ok: false as const, status: 500, error: articleError.message };
      }

      const { error: trackingError } = await supabase
        .from("reserve_article_publications")
        .insert({ reserve_key: reserve.key, slug, published_at: now.toISOString() });
      if (trackingError) {
        console.error("[publishing-safety-net] reserve tracking failed", trackingError);
      }
      reservePublished = slug;

      if (openAlert) {
        await supabase
          .from("publishing_alerts")
          .update({ reserve_slug: slug, updated_at: now.toISOString() })
          .eq("id", openAlert.id);
      }
      // Never publish more than one reserve article per stalled run.
      break;
    }
  }

  return {
    ok: true as const,
    status: 200,
    automation_stalled: automationStalled,
    publication_gap: publicationGap,
    latest_published_at: latestAny?.published_at ?? null,
    latest_automation_published_at: latestAutomation?.published_at ?? null,
    alert_opened: alertOpened,
    webhook_sent: webhookSent,
    reserve_published: reservePublished,
    reserve_remaining:
      RESERVE_ARTICLES.length - (publishedReserveResult.data?.length ?? 0) - (reservePublished ? 1 : 0),
  };
}

export const Route = createFileRoute("/api/public/hooks/publishing-safety-net")({
  server: {
    handlers: {
      GET: async () => {
        const result = await runPublishingSafetyNet();
        return Response.json(result, { status: result.status });
      },
      POST: async () => {
        const result = await runPublishingSafetyNet();
        return Response.json(result, { status: result.status });
      },
    },
  },
});
