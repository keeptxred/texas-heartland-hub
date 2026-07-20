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

type Row = {
  id: number;
  title: string;
  source: string;
  pub_date: string;
  created_at: string | null;
  internal_slug: string | null;
  viral_score: number | null;
  classification_confidence: number | null;
  viral_signals: { reasons?: string[]; category?: string; has_video?: boolean; source_reputation_reason?: string } | null;
  trend_source: string | null;
  texas_relevance_score: number | null;
  source_reputation_score: number | null;
  routing_type: string | null;
  trend_velocity: number | null;
  source_count: number | null;
  ready_for_rewrite: boolean | null;
};

type ArticleMeta = { slug: string; featured_image_url: string | null };

type FilterKey = "all" | "score" | "texas" | "video" | "reel" | "fb" | "seo" | "ready";

export function ViralRadarPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [articles, setArticles] = useState<Record<string, ArticleMeta>>({});
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [backfilling, setBackfilling] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [publishing, setPublishing] = useState<Record<number, boolean>>({});
  const [publishMsg, setPublishMsg] = useState<Record<number, { ok: boolean; text: string }>>({});
  const [articleWorking, setArticleWorking] = useState<Record<number, boolean>>({});
  const [articleMsg, setArticleMsg] = useState<Record<number, { ok: boolean; text: string }>>({});
  const [filter, setFilter] = useState<FilterKey>("all");

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("texas_news_feed")
      .select("id,title,source,pub_date,created_at,internal_slug,viral_score,classification_confidence,viral_signals,trend_source,texas_relevance_score,source_reputation_score,routing_type,trend_velocity,source_count,ready_for_rewrite")
      .order("viral_score", { ascending: false })
      .order("pub_date", { ascending: false })
      .limit(60);
    const feed = ((data ?? []) as Row[]).filter((r) => !isLowValueTitle(r.title));
    setRows(feed);
    const slugs = feed.map((r) => r.internal_slug).filter(Boolean) as string[];
    if (slugs.length > 0) {
      const { data: arts } = await supabase
        .from("daily_articles")
        .select("slug,featured_image_url")
        .in("slug", slugs);
      const map: Record<string, ArticleMeta> = {};
      (arts ?? []).forEach((a) => { map[a.slug] = a as ArticleMeta; });
      setArticles(map);
    }
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function rescoreNow() {
    setScoring(true);
    setMsg("");
    try {
      const res = await fetch("/api/public/hooks/score-viral", { method: "POST" });
      const body = await res.json();
      setMsg(body.ok ? `Scored ${body.updated}/${body.scanned}` : `Error: ${body.error}`);
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Rescore failed");
    } finally {
      setScoring(false);
    }
  }

  async function scoreUnscored() {
    setBackfilling(true);
    setMsg("");
    try {
      const res = await fetch("/api/public/hooks/score-viral-backfill", { method: "POST" });
      const body = await res.json();
      setMsg(
        body.ok
          ? `Backfilled ${body.updated}/${body.scanned} (${body.remaining} unscored remaining)`
          : `Error: ${body.error}`
      );
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Backfill failed");
    } finally {
      setBackfilling(false);
    }
  }

  async function post(r: Row) {
    setPublishing((s) => ({ ...s, [r.id]: true }));
    try {
      const res = await quickPublishToFacebook({
        headline: r.title,
        source: r.source,
        feed_item_id: r.id,
        slug: r.internal_slug ?? null,
      });
      setPublishMsg((s) => ({
        ...s,
        [r.id]: { ok: res.ok, text: res.ok ? "Published" : res.error },
      }));
    } catch (e) {
      setPublishMsg((s) => ({
        ...s,
        [r.id]: { ok: false, text: e instanceof Error ? e.message : "Failed" },
      }));
    } finally {
      setPublishing((s) => ({ ...s, [r.id]: false }));
    }
  }

  async function publishToKtr(r: Row) {
    setArticleWorking((s) => ({ ...s, [r.id]: true }));
    setArticleMsg((s) => ({ ...s, [r.id]: { ok: false, text: "" } }));
    try {
      const res = await publishFeedItem(r.id);
      if (res.ok) {
        setArticleMsg((s) => ({
          ...s,
          [r.id]: {
            ok: true,
            text: res.alreadyPublished ? "Already published" : "Published to Keep TX Red",
          },
        }));
        // Refresh so the newly created daily_articles row lights up FB button.
        await load();
      } else {
        setArticleMsg((s) => ({ ...s, [r.id]: { ok: false, text: res.error } }));
      }
    } catch (e) {
      setArticleMsg((s) => ({
        ...s,
        [r.id]: { ok: false, text: e instanceof Error ? e.message : "Publish failed" },
      }));
    } finally {
      setArticleWorking((s) => ({ ...s, [r.id]: false }));
    }
  }

  const RECENT_DAYS = 14;

  const recentRows = useMemo(() => {
    const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
    return rows.filter((r) => {
      const dateIso = r.pub_date || r.created_at;
      if (!dateIso) return true;
      const dateMs = new Date(dateIso).getTime();
      return !Number.isNaN(dateMs) && dateMs >= cutoff;
    });
  }, [rows]);

  const total = useMemo(() => recentRows.length, [recentRows]);

  const filtered = useMemo(() => {
    const arr = [...recentRows];
    switch (filter) {
      case "score":
        return arr.sort((a, b) => (b.viral_score ?? 0) - (a.viral_score ?? 0));
      case "texas":
        return arr.sort((a, b) => (b.texas_relevance_score ?? 0) - (a.texas_relevance_score ?? 0));
      case "video":
        return arr.filter((r) => r.viral_signals?.has_video);
      case "reel":
        return arr.filter((r) => r.routing_type === "REEL_CANDIDATE" || r.routing_type === "BOTH");
      case "fb":
        return arr.filter((r) => r.routing_type === "FACEBOOK_ONLY" || r.routing_type === "BOTH");
      case "seo":
        return arr.filter((r) => r.routing_type === "SEO_ARTICLE" || r.routing_type === "BOTH");
      case "ready":
        return arr.filter((r) => r.ready_for_rewrite);
      default:
        return arr;
    }
  }, [rows, filter]);

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
        Auto-rewrite threshold: score ≥ {VIRAL_AUTO_REWRITE_MIN_SCORE}, confidence ≥{" "}
        {VIRAL_AUTO_REWRITE_MIN_CONFIDENCE}. Publishing always requires a human click.
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
        ] as [FilterKey, string][]).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${
              filter === k ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground">No scored feed items yet — click Rescore Now.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="py-2 pr-2">Headline</th>
                <th className="py-2 pr-2">Category</th>
                <th className="py-2 pr-2">Route</th>
                <th className="py-2 pr-2 text-right">Score</th>
                <th className="py-2 pr-2 text-right">TX</th>
                <th className="py-2 pr-2 text-right">Rep</th>
                <th className="py-2 pr-2 text-right">Conf</th>
                <th className="py-2 pr-2">Signals</th>
                <th className="py-2 pr-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const art = r.internal_slug ? articles[r.internal_slug] : undefined;
                const rewritten = !!art;
                const hasImage = !!art?.featured_image_url;
                const cat = r.viral_signals?.category ?? "—";
                const conf = r.classification_confidence ?? 0;
                const score = r.viral_score ?? 0;
                const tx = r.texas_relevance_score ?? 0;
                const rep = r.source_reputation_score ?? 0;
                const route = r.routing_type ?? "—";
                const hasVideo = !!r.viral_signals?.has_video;
                const ready = !!r.ready_for_rewrite;
                const qualifies =
                  score >= VIRAL_AUTO_REWRITE_MIN_SCORE &&
                  conf >= VIRAL_AUTO_REWRITE_MIN_CONFIDENCE;
                const canPostToFacebook = !!r.internal_slug && rewritten;
                const displayDateIso = r.pub_date || r.created_at || null;
                const displayDateLabel = displayDateIso
                  ? new Date(displayDateIso).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "America/Chicago",
                    })
                  : null;
                const displayDatePrefix = r.pub_date ? "Published" : "Discovered";
                return (
                  <tr key={r.id} className="border-b border-border/50 align-top">
                    <td className="py-2 pr-2 max-w-[24rem]">
                      <div className="flex items-center gap-2">
                        <div className="font-medium leading-snug truncate">{r.title}</div>
                        {rewritten ? (
                          <span title="Rewritten" className="text-emerald-600 shrink-0">
                            <FileText size={14} />
                          </span>
                        ) : null}
                        {hasImage ? (
                          <span title="Image Ready" className="text-blue-600 shrink-0">
                            <ImageIcon size={14} />
                          </span>
                        ) : null}
                        {hasVideo ? (
                          <span title="Video Available" className="text-purple-600 shrink-0">
                            <Video size={14} />
                          </span>
                        ) : null}
                        {ready ? (
                          <span title="Ready for Rewrite" className="text-primary shrink-0">
                            <Sparkles size={14} />
                          </span>
                        ) : null}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {r.source}
                        {(r.source_count ?? 1) > 1 ? ` · ${r.source_count} sources` : ""}
                        {r.trend_velocity ? ` · v${r.trend_velocity.toFixed(0)}` : ""}
                      </div>
                      {displayDateLabel ? (
                        <div className="text-[11px] text-muted-foreground">
                          {displayDatePrefix}: {displayDateLabel}
                        </div>
                      ) : null}
                    </td>
                    <td className="py-2 pr-2 text-[11px] text-muted-foreground">{cat}</td>
                    <td className="py-2 pr-2 text-[10px] font-bold uppercase tracking-widest">{route}</td>
                    <td className={`py-2 pr-2 text-right tabular-nums ${score >= VIRAL_AUTO_REWRITE_MIN_SCORE ? "text-primary font-bold" : ""}`}>
                      {score}
                    </td>
                    <td className={`py-2 pr-2 text-right tabular-nums ${tx >= 85 ? "text-emerald-600" : tx < 40 ? "text-red-600" : ""}`}>
                      {tx}
                    </td>
                    <td className={`py-2 pr-2 text-right tabular-nums ${rep >= 85 ? "text-emerald-600" : rep < 55 ? "text-red-600" : ""}`}>
                      {rep}
                    </td>
                    <td className={`py-2 pr-2 text-right tabular-nums ${conf >= VIRAL_AUTO_REWRITE_MIN_CONFIDENCE ? "text-emerald-600" : "text-amber-600"}`}>
                      {conf.toFixed(2)}
                    </td>
                    <td className="py-2 pr-2 text-[11px] text-muted-foreground max-w-[20rem]">
                      {tx < 40 ? <span className="text-red-600 font-bold">Not Texas focused</span> : (r.viral_signals?.reasons ?? []).slice(0, 3).join(" · ")}
                    </td>
                    <td className="py-2 pr-2 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={!!articleWorking[r.id]}
                            onClick={() => void publishToKtr(r)}
                            className="px-3 py-1 bg-secondary text-secondary-foreground text-[11px] font-bold uppercase tracking-widest disabled:opacity-60"
                          >
                            {articleWorking[r.id]
                              ? "Publishing…"
                              : rewritten
                              ? "Republish"
                              : "Publish to Keep Texas Red"}
                          </button>
                          <button
                            type="button"
                            disabled={!!publishing[r.id] || !canPostToFacebook}
                            onClick={() => void post(r)}
                            title={
                              canPostToFacebook
                                ? undefined
                                : "Publish to Keep Texas Red first — Facebook posts require a KeepTXRed article URL."
                            }
                            className="px-3 py-1 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {publishing[r.id] ? "Posting…" : "Post to Facebook"}
                          </button>
                        </div>
                        {!qualifies ? (
                          <span className="text-[10px] text-muted-foreground">Below auto-rewrite gate</span>
                        ) : null}
                        {articleMsg[r.id]?.text ? (
                          <span className={`text-[10px] ${articleMsg[r.id].ok ? "text-emerald-600" : "text-red-600"}`}>
                            {articleMsg[r.id].text}
                          </span>
                        ) : null}
                        {publishMsg[r.id]?.text ? (
                          <span className={`text-[10px] ${publishMsg[r.id].ok ? "text-emerald-600" : "text-red-600"}`}>
                            {publishMsg[r.id].text}
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