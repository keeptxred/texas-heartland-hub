import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type PillarMetric = {
  pillar_slug: string;
  title: string;
  target_articles: number;
  article_count: number;
  articles_30d: number;
  latest_published_at: string | null;
  gsc_impressions: number;
  gsc_clicks: number;
  gsc_ctr: number | null;
  avg_search_position: number | null;
  depth_score: number;
  authority_status: "critical" | "thin" | "building" | "established";
};

const statusLabel: Record<PillarMetric["authority_status"], string> = {
  critical: "Critical gap",
  thin: "Thin",
  building: "Building",
  established: "Established",
};

export function PillarAuthorityPanel() {
  const [rows, setRows] = useState<PillarMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data, error: queryError } = await supabase
        .from("pillar_authority_metrics" as never)
        .select("pillar_slug,title,target_articles,article_count,articles_30d,latest_published_at,gsc_impressions,gsc_clicks,gsc_ctr,avg_search_position,depth_score,authority_status")
        .order("depth_score", { ascending: true });
      if (!active) return;
      if (queryError) {
        setError(queryError.message);
        setRows([]);
      } else {
        setRows((data ?? []) as unknown as PillarMetric[]);
      }
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const totals = useMemo(() => rows.reduce(
    (acc, row) => ({ articles: acc.articles + Number(row.article_count), impressions: acc.impressions + Number(row.gsc_impressions) }),
    { articles: 0, impressions: 0 },
  ), [rows]);

  if (loading) return <div className="border bg-white p-5 text-sm text-muted-foreground">Measuring pillar authority…</div>;
  if (error) return (
    <div className="border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
      Pillar authority reporting is not active yet. Apply the latest database migration and run the article pillar classifier.
      <div className="mt-1 text-xs opacity-70">{error}</div>
    </div>
  );

  return (
    <section className="border-2 border-foreground/10 bg-white">
      <div className="border-b border-border px-4 py-4 md:flex md:items-end md:justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Authority Map</div>
          <h2 className="font-display text-2xl">Nine-pillar depth &amp; search performance</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">Existing articles are classified deterministically. Weakest pillars appear first so the next editorial investment is obvious.</p>
        </div>
        <div className="mt-3 flex gap-2 md:mt-0">
          <div className="border px-3 py-2 text-center"><div className="text-xl font-bold">{totals.articles}</div><div className="text-[9px] uppercase tracking-wider text-muted-foreground">Classified articles</div></div>
          <div className="border px-3 py-2 text-center"><div className="text-xl font-bold">{totals.impressions.toLocaleString()}</div><div className="text-[9px] uppercase tracking-wider text-muted-foreground">GSC impressions</div></div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b bg-muted/30 text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Pillar</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Depth</th><th className="px-3 py-3">30d</th><th className="px-3 py-3">Impressions</th><th className="px-3 py-3">Clicks</th><th className="px-3 py-3">CTR</th><th className="px-3 py-3">Avg pos.</th><th className="px-3 py-3">Latest</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.pillar_slug}>
                <td className="px-4 py-3"><div className="font-semibold">{row.title}</div><div className="text-xs text-muted-foreground">{row.article_count}/{row.target_articles} target articles</div></td>
                <td className="px-3 py-3"><span className="border px-2 py-1 text-xs font-semibold">{statusLabel[row.authority_status]}</span></td>
                <td className="px-3 py-3 font-bold">{row.depth_score}%</td>
                <td className="px-3 py-3">{row.articles_30d}</td>
                <td className="px-3 py-3">{Number(row.gsc_impressions).toLocaleString()}</td>
                <td className="px-3 py-3">{Number(row.gsc_clicks).toLocaleString()}</td>
                <td className="px-3 py-3">{row.gsc_ctr == null ? "—" : `${(Number(row.gsc_ctr) * 100).toFixed(1)}%`}</td>
                <td className="px-3 py-3">{row.avg_search_position == null ? "—" : Number(row.avg_search_position).toFixed(1)}</td>
                <td className="px-3 py-3 text-xs text-muted-foreground">{row.latest_published_at ? new Date(row.latest_published_at).toLocaleDateString("en-US", { timeZone: "America/Chicago" }) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}