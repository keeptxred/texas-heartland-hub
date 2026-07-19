import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Image as ImageIcon, Flame } from "lucide-react";
import {
  VIRAL_AUTO_REWRITE_MIN_SCORE,
  VIRAL_AUTO_REWRITE_MIN_CONFIDENCE,
} from "@/lib/viral-score";
import { quickPublishToFacebook } from "@/services/quickPublish";

type Row = {
  id: number;
  title: string;
  source: string;
  pub_date: string;
  internal_slug: string | null;
  viral_score: number | null;
  classification_confidence: number | null;
  viral_signals: { reasons?: string[]; category?: string } | null;
  trend_source: string | null;
};

type ArticleMeta = { slug: string; featured_image_url: string | null };

export function ViralRadarPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [articles, setArticles] = useState<Record<string, ArticleMeta>>({});
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [publishing, setPublishing] = useState<Record<number, boolean>>({});
  const [publishMsg, setPublishMsg] = useState<Record<number, { ok: boolean; text: string }>>({});

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("texas_news_feed")
      .select("id,title,source,pub_date,internal_slug,viral_score,classification_confidence,viral_signals,trend_source")
      .order("viral_score", { ascending: false })
      .order("pub_date", { ascending: false })
      .limit(30);
    const feed = (data ?? []) as Row[];
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

  async function post(r: Row) {
    setPublishing((s) => ({ ...s, [r.id]: true }));
    try {
      const res = await quickPublishToFacebook({
        headline: r.title,
        source: r.source,
        feed_item_id: r.id,
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

  const total = useMemo(() => rows.length, [rows]);

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
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground mb-3">
        Auto-rewrite threshold: score ≥ {VIRAL_AUTO_REWRITE_MIN_SCORE}, confidence ≥{" "}
        {VIRAL_AUTO_REWRITE_MIN_CONFIDENCE}. Publishing always requires a human click.
      </p>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : total === 0 ? (
        <div className="text-sm text-muted-foreground">No scored feed items yet — click Rescore Now.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="py-2 pr-2">Headline</th>
                <th className="py-2 pr-2">Category</th>
                <th className="py-2 pr-2 text-right">Score</th>
                <th className="py-2 pr-2 text-right">Conf</th>
                <th className="py-2 pr-2">Signals</th>
                <th className="py-2 pr-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const art = r.internal_slug ? articles[r.internal_slug] : undefined;
                const rewritten = !!art;
                const hasImage = !!art?.featured_image_url;
                const cat = r.viral_signals?.category ?? "—";
                const conf = r.classification_confidence ?? 0;
                const score = r.viral_score ?? 0;
                const qualifies =
                  score >= VIRAL_AUTO_REWRITE_MIN_SCORE &&
                  conf >= VIRAL_AUTO_REWRITE_MIN_CONFIDENCE;
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
                      </div>
                      <div className="text-[11px] text-muted-foreground">{r.source}</div>
                    </td>
                    <td className="py-2 pr-2 text-[11px] text-muted-foreground">{cat}</td>
                    <td className={`py-2 pr-2 text-right tabular-nums ${score >= VIRAL_AUTO_REWRITE_MIN_SCORE ? "text-primary font-bold" : ""}`}>
                      {score}
                    </td>
                    <td className={`py-2 pr-2 text-right tabular-nums ${conf >= VIRAL_AUTO_REWRITE_MIN_CONFIDENCE ? "text-emerald-600" : "text-amber-600"}`}>
                      {conf.toFixed(2)}
                    </td>
                    <td className="py-2 pr-2 text-[11px] text-muted-foreground max-w-[20rem]">
                      {(r.viral_signals?.reasons ?? []).slice(0, 3).join(" · ")}
                    </td>
                    <td className="py-2 pr-2 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1">
                        <button
                          type="button"
                          disabled={!!publishing[r.id]}
                          onClick={() => void post(r)}
                          className="px-3 py-1 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest disabled:opacity-60"
                        >
                          {publishing[r.id] ? "Posting…" : "Post to Facebook"}
                        </button>
                        {!qualifies ? (
                          <span className="text-[10px] text-muted-foreground">Below auto-rewrite gate</span>
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