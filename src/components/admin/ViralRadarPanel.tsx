import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isLowValueTitle } from "@/lib/low-value-titles";
import { FileText, Image as ImageIcon, Flame, Video, Sparkles } from "lucide-react";
import {
  VIRAL_AUTO_REWRITE_MIN_SCORE,
  VIRAL_AUTO_REWRITE_MIN_CONFIDENCE,
} from "@/lib/viral-score";
import { quickPublishToFacebook } from "@/services/quickPublish";
import { publishFeedItem } from "@/services/publishArticle";
import {
  assessRewritePreflight,
  preflightStatusLabel,
  type RewritePreflightReason,
  type RewritePreflightResult,
} from "@/lib/rewrite-preflight";
import { regenerateFeaturedImage } from "@/lib/featured-image.functions";

type PersistedPreflight = {
  status?: RewritePreflightReason;
  reason?: RewritePreflightReason;
  message?: string;
  sourceWordCount?: number;
  factualSignalCount?: number;
  checkedAt?: string;
  failureStage?: "extraction" | "preflight" | "none";
};

type Row = {
  id: number;
  title: string;
  source: string;
  pub_date: string;
  created_at: string | null;
  internal_slug: string | null;
  link: string | null;
  description: string | null;
  extracted_body: string | null;
  preflight_json: PersistedPreflight | null;
  viral_score: number | null;
  classification_confidence: number | null;
  viral_signals: {
    reasons?: string[];
    category?: string;
    has_video?: boolean;
    source_reputation_reason?: string;
  } | null;
  trend_source: string | null;
  texas_relevance_score: number | null;
  source_reputation_score: number | null;
  routing_type: string | null;
  trend_velocity: number | null;
  source_count: number | null;
  ready_for_rewrite: boolean | null;
};

type ArticleMeta = {
  slug: string;
  title: string | null;
  featured_image_url: string | null;
};

type FilterKey = "all" | "score" | "texas" | "video" | "reel" | "fb" | "seo" | "ready";

const IGNORE_STORAGE_KEY = "ktr.viral.ignored.v1";
const RECENT_DAYS = 14;
const FETCH_LIMIT = 150;

function loadIgnored(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(IGNORE_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? new Set(parsed.filter((value): value is number => typeof value === "number"))
      : new Set();
  } catch {
    return new Set();
  }
}

function saveIgnored(ids: Set<number>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(IGNORE_STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Ignore storage quota failures.
  }
}

function resultFromSnapshot(snapshot: PersistedPreflight): RewritePreflightResult | null {
  const reason = snapshot.reason ?? snapshot.status;
  if (!reason) return null;
  return {
    rewriteable: reason === "READY",
    reason,
    message: snapshot.message ?? "Source preflight completed",
    sourceWordCount: snapshot.sourceWordCount ?? 0,
    factualSignalCount: snapshot.factualSignalCount ?? 0,
    hasClearNewsEvent: null,
  };
}

function effectivePreflight(row: Row): RewritePreflightResult {
  const persisted = row.preflight_json ? resultFromSnapshot(row.preflight_json) : null;
  if (persisted) return persisted;

  const extracted = row.extracted_body?.trim() ?? "";
  if (extracted) {
    return assessRewritePreflight({
      title: row.title,
      description: extracted,
      link: row.link,
    });
  }

  return assessRewritePreflight({
    title: row.title,
    description: "",
    link: row.link,
  });
}

function readinessLabel(result: RewritePreflightResult): string {
  if (result.reason === "PENDING_EXTRACTION") {
    return "Needs source extraction · click Publish to check";
  }
  return preflightStatusLabel(result);
}

function canAttemptPublish(result: RewritePreflightResult, alreadyPublished: boolean): boolean {
  return alreadyPublished || result.rewriteable || result.reason === "PENDING_EXTRACTION";
}

function shouldShowRow(row: Row, result: RewritePreflightResult): boolean {
  if (row.internal_slug) return true;
  if (result.rewriteable) return true;
  // Persisted preflight means extraction already ran. Any persisted
  // non-ready result is terminal and must leave the publish queue.
  if (row.preflight_json) return false;

  if (result.reason !== "PENDING_EXTRACTION") return false;

  // Keep Viral Radar useful as a manual-review queue. The stricter score and
  // confidence thresholds belong to the Ready for Rewrite filter, not to the
  // entire panel. Pending rows still must be Texas-focused and credible.
  return (
    (row.texas_relevance_score ?? 0) >= 40 &&
    (row.source_reputation_score ?? 0) >= 55
  );
}

export function ViralRadarPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [articles, setArticles] = useState<Record<string, ArticleMeta>>({});
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [backfilling, setBackfilling] = useState(false);
  const [msg, setMsg] = useState("");
  const [publishing, setPublishing] = useState<Record<number, boolean>>({});
  const [publishMsg, setPublishMsg] = useState<Record<number, { ok: boolean; text: string }>>({});
  const [articleWorking, setArticleWorking] = useState<Record<number, boolean>>({});
  const [articleMsg, setArticleMsg] = useState<Record<number, { ok: boolean; text: string }>>({});
  const [filter, setFilter] = useState<FilterKey>("all");
  const [ignored, setIgnored] = useState<Set<number>>(() => loadIgnored());
  const [imageWorking, setImageWorking] = useState<Record<number, boolean>>({});

  async function load() {
    setLoading(true);
    const cutoffIso = new Date(Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from("texas_news_feed")
      .select(
        "id,title,source,pub_date,created_at,internal_slug,link,description,extracted_body,preflight_json,viral_score,classification_confidence,viral_signals,trend_source,texas_relevance_score,source_reputation_score,routing_type,trend_velocity,source_count,ready_for_rewrite",
      )
      .gte("pub_date", cutoffIso)
      .order("pub_date", { ascending: false })
      .order("viral_score", { ascending: false })
      .limit(FETCH_LIMIT);

    const feed = ((data ?? []) as Row[]).filter((row) => !isLowValueTitle(row.title));
    setRows(feed);

    const slugs = feed.map((row) => row.internal_slug).filter(Boolean) as string[];
    if (slugs.length === 0) {
      setArticles({});
    } else {
      const { data: articleRows } = await supabase
        .from("daily_articles")
        .select("slug,title,featured_image_url")
        .in("slug", slugs);
      const next: Record<string, ArticleMeta> = {};
      (articleRows ?? []).forEach((article) => {
        next[article.slug] = article as ArticleMeta;
      });
      setArticles(next);
    }
    setLoading(false);
  }

  useEffect(() => {
    void load();
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  function ignoreRow(id: number) {
    setIgnored((current) => {
      const next = new Set(current);
      next.add(id);
      saveIgnored(next);
      return next;
    });
  }

  async function rescoreNow() {
    setScoring(true);
    setMsg("");
    try {
      const response = await fetch("/api/public/hooks/score-viral", { method: "POST" });
      const body = await response.json();
      setMsg(body.ok ? `Scored ${body.updated}/${body.scanned}` : `Error: ${body.error}`);
      await load();
    } catch (error) {
      setMsg(error instanceof Error ? error.message : "Rescore failed");
    } finally {
      setScoring(false);
    }
  }

  async function scoreUnscored() {
    setBackfilling(true);
    setMsg("");
    try {
      const response = await fetch("/api/public/hooks/score-viral-backfill", { method: "POST" });
      const body = await response.json();
      setMsg(
        body.ok
          ? `Backfilled ${body.updated}/${body.scanned} (${body.remaining} unscored remaining)`
          : `Error: ${body.error}`,
      );
      await load();
    } catch (error) {
      setMsg(error instanceof Error ? error.message : "Backfill failed");
    } finally {
      setBackfilling(false);
    }
  }

  async function publishToKtr(row: Row) {
    setArticleWorking((state) => ({ ...state, [row.id]: true }));
    setArticleMsg((state) => ({ ...state, [row.id]: { ok: false, text: "" } }));
    try {
      const result = await publishFeedItem(row.id);
      if (result.ok) {
        setArticleMsg((state) => ({
          ...state,
          [row.id]: {
            ok: true,
            text: result.alreadyPublished ? "Already published" : "Published to Keep TX Red",
          },
        }));
      } else {
        setArticleMsg((state) => ({ ...state, [row.id]: { ok: false, text: result.error } }));
      }
      await load();
    } catch (error) {
      setArticleMsg((state) => ({
        ...state,
        [row.id]: { ok: false, text: error instanceof Error ? error.message : "Publish failed" },
      }));
      await load();
    } finally {
      setArticleWorking((state) => ({ ...state, [row.id]: false }));
    }
  }

  async function post(row: Row) {
    setPublishing((state) => ({ ...state, [row.id]: true }));
    try {
      const result = await quickPublishToFacebook({
        headline: row.title,
        source: row.source,
        feed_item_id: row.id,
        slug: row.internal_slug ?? null,
      });
      setPublishMsg((state) => ({
        ...state,
        [row.id]: { ok: result.ok, text: result.ok ? "Published" : result.error },
      }));
    } catch (error) {
      setPublishMsg((state) => ({
        ...state,
        [row.id]: { ok: false, text: error instanceof Error ? error.message : "Failed" },
      }));
    } finally {
      setPublishing((state) => ({ ...state, [row.id]: false }));
    }
  }

  async function generateImageAndPost(row: Row) {
    if (!row.internal_slug) return;
    setImageWorking((state) => ({ ...state, [row.id]: true }));
    try {
      const token =
        (typeof window !== "undefined" && sessionStorage.getItem("ktr-admin-passcode")) ||
        (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
        "keeptxred";
      const image = await regenerateFeaturedImage({ data: { slug: row.internal_slug, token } });
      if (!image.ok) {
        setPublishMsg((state) => ({
          ...state,
          [row.id]: { ok: false, text: `Image generation failed: ${image.error}` },
        }));
        return;
      }
      const result = await quickPublishToFacebook({
        headline: row.title,
        source: row.source,
        feed_item_id: row.id,
        slug: row.internal_slug,
        asset_url: image.url,
      });
      setPublishMsg((state) => ({
        ...state,
        [row.id]: { ok: result.ok, text: result.ok ? "Published to Facebook" : result.error },
      }));
      if (result.ok) await load();
    } catch (error) {
      setPublishMsg((state) => ({
        ...state,
        [row.id]: {
          ok: false,
          text: error instanceof Error ? error.message : "Generate & post failed",
        },
      }));
    } finally {
      setImageWorking((state) => ({ ...state, [row.id]: false }));
    }
  }

  const recentRows = useMemo(() => {
    const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
    return rows.filter((row) => {
      if (ignored.has(row.id)) return false;
      const iso = row.pub_date || row.created_at;
      if (!iso) return true;
      const time = new Date(iso).getTime();
      return !Number.isNaN(time) && time >= cutoff;
    });
  }, [rows, ignored]);

  const preflightById = useMemo(() => {
    const map: Record<number, RewritePreflightResult> = {};
    recentRows.forEach((row) => {
      map[row.id] = effectivePreflight(row);
    });
    return map;
  }, [recentRows]);

  const publishableRows = useMemo(
    () => recentRows.filter((row) => shouldShowRow(row, preflightById[row.id])),
    [recentRows, preflightById],
  );

  const filtered = useMemo(() => {
    const items = [...publishableRows];
    switch (filter) {
      case "score":
        return items.sort((a, b) => (b.viral_score ?? 0) - (a.viral_score ?? 0));
      case "texas":
        return items.sort((a, b) => (b.texas_relevance_score ?? 0) - (a.texas_relevance_score ?? 0));
      case "video":
        return items.filter((row) => row.viral_signals?.has_video);
      case "reel":
        return items.filter((row) => row.routing_type === "REEL_CANDIDATE" || row.routing_type === "BOTH");
      case "fb":
        return items.filter((row) => row.routing_type === "FACEBOOK_ONLY" || row.routing_type === "BOTH");
      case "seo":
        return items.filter((row) => row.routing_type === "SEO_ARTICLE" || row.routing_type === "BOTH");
      case "ready":
        return items.filter((row) => preflightById[row.id]?.rewriteable);
      default:
        return items;
    }
  }, [publishableRows, filter, preflightById]);

  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-primary" />
          <h2 className="font-display text-xl">Viral Radar</h2>
        </div>
        <div className="flex items-center gap-3">
          {msg ? <span className="text-[11px] text-muted-foreground">{msg}</span> : null}
          <button
            type="button"
            onClick={() => void rescoreNow()}
            disabled={scoring}
            className="text-[11px] font-bold uppercase tracking-widest text-primary underline disabled:opacity-50"
          >
            {scoring ? "Scoring…" : "Rescore Now"}
          </button>
          <button
            type="button"
            onClick={() => void scoreUnscored()}
            disabled={backfilling}
            className="text-[11px] font-bold uppercase tracking-widest text-primary underline disabled:opacity-50"
          >
            {backfilling ? "Backfilling…" : "Score Unscored"}
          </button>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground mb-3">
        Articles disappear after source extraction confirms they cannot pass the rewrite gate.
      </p>

      <div className="flex flex-wrap gap-1 mb-3">
        {([
          ["all", "All"],
          ["score", "Top Score"],
          ["texas", "Top TX Relevance"],
          ["ready", "Ready for Rewrite"],
          ["video", "Video Available"],
          ["reel", "Reel Candidate"],
          ["fb", "Facebook Ready"],
          ["seo", "SEO Article"],
        ] as [FilterKey, string][]).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${
              filter === key
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground">No publishable feed items.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="py-2 pr-2">Headline</th>
                <th className="py-2 pr-2">Category</th>
                <th className="py-2 pr-2 text-right">Score</th>
                <th className="py-2 pr-2 text-right">TX</th>
                <th className="py-2 pr-2 text-right">Conf</th>
                <th className="py-2 pr-2">Signals</th>
                <th className="py-2 pr-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const article = row.internal_slug ? articles[row.internal_slug] : undefined;
                const rewritten = Boolean(article);
                const hasImage = Boolean(article?.featured_image_url);
                const preflight = preflightById[row.id];
                const pending = preflight.reason === "PENDING_EXTRACTION";
                const publishAllowed = canAttemptPublish(preflight, rewritten);
                const qualifies =
                  (row.viral_score ?? 0) >= VIRAL_AUTO_REWRITE_MIN_SCORE &&
                  (row.classification_confidence ?? 0) >= VIRAL_AUTO_REWRITE_MIN_CONFIDENCE;
                const displayDate = row.pub_date || row.created_at;

                return (
                  <tr key={row.id} className="border-b border-border/50 align-top">
                    <td className="py-2 pr-2 max-w-[28rem]">
                      <div className="flex items-center gap-2">
                        {row.link ? (
                          <a
                            href={row.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={row.title}
                            className="font-medium leading-snug hover:underline"
                          >
                            {row.title}
                          </a>
                        ) : (
                          <span className="font-medium leading-snug">{row.title}</span>
                        )}
                        {rewritten ? <FileText size={14} className="text-emerald-600 shrink-0" /> : null}
                        {hasImage ? <ImageIcon size={14} className="text-blue-600 shrink-0" /> : null}
                        {row.viral_signals?.has_video ? <Video size={14} className="text-purple-600 shrink-0" /> : null}
                        {preflight.rewriteable ? <Sparkles size={14} className="text-primary shrink-0" /> : null}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {row.source}
                        {(row.source_count ?? 1) > 1 ? ` · ${row.source_count} sources` : ""}
                      </div>
                      <div
                        className={`text-[10px] ${
                          rewritten || preflight.rewriteable
                            ? "text-emerald-600"
                            : pending
                              ? "text-amber-600"
                              : "text-red-600"
                        }`}
                      >
                        {rewritten ? "Published to Keep Texas Red" : readinessLabel(preflight)}
                      </div>
                      {displayDate ? (
                        <div className="text-[11px] text-muted-foreground">
                          Published: {new Date(displayDate).toLocaleDateString("en-US", { timeZone: "America/Chicago" })}
                        </div>
                      ) : null}
                    </td>
                    <td className="py-2 pr-2 text-[11px] text-muted-foreground">
                      {row.viral_signals?.category ?? "—"}
                    </td>
                    <td className="py-2 pr-2 text-right tabular-nums">{row.viral_score ?? 0}</td>
                    <td className="py-2 pr-2 text-right tabular-nums">{row.texas_relevance_score ?? 0}</td>
                    <td className="py-2 pr-2 text-right tabular-nums">
                      {(row.classification_confidence ?? 0).toFixed(2)}
                    </td>
                    <td className="py-2 pr-2 text-[11px] text-muted-foreground max-w-[20rem]">
                      {(row.texas_relevance_score ?? 0) < 40 ? (
                        <span className="text-red-600 font-bold">Not Texas focused</span>
                      ) : (
                        (row.viral_signals?.reasons ?? []).slice(0, 3).join(" · ")
                      )}
                    </td>
                    <td className="py-2 pr-2 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={Boolean(articleWorking[row.id]) || !publishAllowed}
                            onClick={() => void publishToKtr(row)}
                            title={!publishAllowed ? preflight.message : undefined}
                            className="px-3 py-1 bg-secondary text-secondary-foreground text-[11px] font-bold uppercase tracking-widest disabled:opacity-60"
                          >
                            {articleWorking[row.id]
                              ? pending
                                ? "Checking source…"
                                : "Publishing…"
                              : rewritten
                                ? "Republish"
                                : pending
                                  ? "Check Source & Publish"
                                  : "Publish to Keep Texas Red"}
                          </button>
                          {rewritten && row.internal_slug ? (
                            hasImage ? (
                              <button
                                type="button"
                                disabled={Boolean(publishing[row.id])}
                                onClick={() => void post(row)}
                                className="px-3 py-1 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest disabled:opacity-60"
                              >
                                {publishing[row.id] ? "Posting…" : "Post to Facebook"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={Boolean(imageWorking[row.id])}
                                onClick={() => void generateImageAndPost(row)}
                                className="px-3 py-1 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest disabled:opacity-60"
                              >
                                {imageWorking[row.id] ? "Generating…" : "Generate Image & Post"}
                              </button>
                            )
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="px-3 py-1 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest opacity-60"
                            >
                              Post to Facebook
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => ignoreRow(row.id)}
                            className="px-3 py-1 border border-border text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
                          >
                            Ignore
                          </button>
                        </div>
                        {!qualifies ? (
                          <span className="text-[10px] text-muted-foreground">Below auto-rewrite gate</span>
                        ) : null}
                        {articleMsg[row.id]?.text ? (
                          <span className={`text-[10px] ${articleMsg[row.id].ok ? "text-emerald-600" : "text-red-600"}`}>
                            {articleMsg[row.id].text}
                          </span>
                        ) : null}
                        {publishMsg[row.id]?.text ? (
                          <span className={`text-[10px] ${publishMsg[row.id].ok ? "text-emerald-600" : "text-red-600"}`}>
                            {publishMsg[row.id].text}
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
