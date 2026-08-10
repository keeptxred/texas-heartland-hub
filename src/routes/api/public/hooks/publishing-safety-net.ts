import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { RESERVE_ARTICLES } from "@/data/reserve-articles";
import { articleMainText, articleMainWordCount, INGESTED_MIN_MAIN_WORDS } from "@/lib/article-length";
import { enrichArticleRow } from "@/lib/content-quality";
import { assertKeepTxRedPublication, inferKeepTxRedDomain } from "@/lib/content-publication-guard";

const STALL_MS = 24 * 60 * 60 * 1000;
const RESERVE_SOURCE = "Keep TX Red Reserve Desk";

type LatestRow = { slug: string; published_at: string; source_name: string | null };
type OpenAlert = { id: string; incident_key: string; opened_at: string };

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
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return { ok: false as const, status: 500, error: "Missing required environment variables" };
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const [latestAnyResult, latestAutomationResult, openAlertResult, publishedReserveResult] =
    await Promise.all([
      supabase
        .from("daily_articles")
        .select("slug,published_at,source_name")
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle<LatestRow>(),
      supabase
        .from("daily_articles")
        .select("slug,published_at,source_name")
        .or(`source_name.neq.${RESERVE_SOURCE},source_name.is.null`)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle<LatestRow>(),
      supabase
        .from("publishing_alerts")
        .select("id,incident_key,opened_at")
        .eq("status", "open")
        .order("opened_at", { ascending: false })
        .limit(1)
        .maybeSingle<OpenAlert>(),
      supabase.from("reserve_article_publications").select("reserve_key"),
    ]);

  const readError =
    latestAnyResult.error ||
    latestAutomationResult.error ||
    openAlertResult.error ||
    publishedReserveResult.error;
  if (readError) {
    console.error("[publishing-safety-net] state read failed", readError);
    return { ok: false as const, status: 500, error: readError.message };
  }

  const latestAny = latestAnyResult.data;
  const latestAutomation = latestAutomationResult.data;
  const automationStalled = isOlderThan24Hours(latestAutomation?.published_at ?? null);
  const publicationGap = isOlderThan24Hours(latestAny?.published_at ?? null);
  let openAlert = openAlertResult.data;
  let alertOpened = false;
  let webhookSent = false;

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
          latest_published_at: latestAutomation?.published_at ?? null,
          message,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "incident_key" },
      )
      .select("id,incident_key,opened_at")
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
      .eq("id", openAlert.id);
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
    const reserve = RESERVE_ARTICLES.find((article) => !publishedKeys.has(article.key));
    if (reserve) {
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

      const { error: articleError } = await supabase
        .from("daily_articles")
        .insert(row);
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