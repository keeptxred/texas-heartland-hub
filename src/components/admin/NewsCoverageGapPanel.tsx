import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type CoverageGap = {
  id: number;
  title: string;
  source: string;
  pub_date: string;
  link: string | null;
  viral_score: number | null;
  texas_relevance_score: number | null;
  source_reputation_score: number | null;
  classification_confidence: number | null;
  routing_type: string | null;
  gap_reason: string;
  coverage_priority: number;
};

const reasonLabels: Record<string, string> = {
  low_texas_relevance: "Texas relevance too low",
  low_source_reputation: "Source reputation too low",
  low_classification_confidence: "Classification confidence too low",
  below_article_score: "Article score too low",
  routing_gate: "Routing gate blocked it",
  article_generation_or_publish_gap: "Generation or publishing failed",
};

export function NewsCoverageGapPanel() {
  const [rows, setRows] = useState<CoverageGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error: queryError } = await supabase
        .from("news_coverage_gaps" as never)
        .select("id,title,source,pub_date,link,viral_score,texas_relevance_score,source_reputation_score,classification_confidence,routing_type,gap_reason,coverage_priority")
        .order("coverage_priority", { ascending: false })
        .order("pub_date", { ascending: false })
        .limit(30);

      if (!active) return;
      if (queryError) {
        setError(queryError.message);
        setRows([]);
      } else {
        setRows((data ?? []) as unknown as CoverageGap[]);
      }
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="border-2 border-foreground/10 bg-white">
      <div className="border-b border-border px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Coverage Watch</div>
          <h2 className="font-display text-2xl">Important stories without articles</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Recent Texas feed items that entered the newsroom but never received a native article.
          </p>
        </div>
        <div className="shrink-0 border border-border px-3 py-2 text-center">
          <div className="text-2xl font-bold leading-none">{rows.length}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Open gaps</div>
        </div>
      </div>

      {loading ? (
        <div className="p-5 text-sm text-muted-foreground">Checking recent coverage…</div>
      ) : error ? (
        <div className="m-4 border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
          Coverage-gap reporting is not active yet. Apply the latest database migrations to create the
          <code className="mx-1">news_coverage_gaps</code> view.
          <div className="mt-1 text-xs opacity-75">{error}</div>
        </div>
      ) : rows.length === 0 ? (
        <div className="p-5 text-sm text-emerald-800 bg-emerald-50">
          No high-priority coverage gaps were found in the current reporting window.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((row) => (
            <li key={row.id} className="p-4">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                <span className="text-primary">Priority {row.coverage_priority}</span>
                <span className="text-muted-foreground">{row.source}</span>
                <span className="border border-amber-300 bg-amber-50 px-2 py-0.5 text-amber-900">
                  {reasonLabels[row.gap_reason] ?? row.gap_reason}
                </span>
              </div>
              <div className="mt-1 text-sm font-semibold leading-snug">{row.title}</div>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span>{new Date(row.pub_date).toLocaleString("en-US", { timeZone: "America/Chicago" })}</span>
                <span>Score {row.viral_score ?? "—"}</span>
                <span>Texas {row.texas_relevance_score ?? "—"}</span>
                <span>Source {row.source_reputation_score ?? "—"}</span>
                <span>Route {row.routing_type ?? "—"}</span>
              </div>
              {row.link ? (
                <a href={row.link} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold text-primary hover:underline">
                  Review source →
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
