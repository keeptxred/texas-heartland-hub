import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { getArticleSourceTransparency } from "@/lib/article-source-transparency.functions";
import type { ArticleSourceTransparency, PublicArticleSource } from "@/lib/article-source-transparency";

function sourceDate(value?: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/Chicago",
  });
}

function sourceRole(source: PublicArticleSource): string | null {
  if (source.primaryRecord) return "Official / primary record";
  if (source.relationshipType === "confirmation") return "Corroborating report";
  if (source.relationshipType === "background") return "Background source";
  if (source.relationshipType === "supporting") return "Supporting report";
  return null;
}

export function ArticleSourceTransparencyPanel() {
  const location = useLocation();
  const slug = location.pathname.match(/^\/news\/([^/]+)\/?$/)?.[1] ?? null;
  const [transparency, setTransparency] = useState<ArticleSourceTransparency | null>(null);

  useEffect(() => {
    let cancelled = false;
    setTransparency(null);
    if (!slug) return () => { cancelled = true; };
    void getArticleSourceTransparency({ data: { slug: decodeURIComponent(slug) } })
      .then((result) => {
        if (!cancelled && result.sources.length > 0) setTransparency(result);
      })
      .catch(() => {
        if (!cancelled) setTransparency(null);
      });
    return () => { cancelled = true; };
  }, [slug]);

  if (!slug || !transparency || transparency.sources.length === 0) return null;

  return (
    <aside className="mx-auto mb-12 mt-[-1rem] max-w-4xl px-4 sm:px-6" aria-labelledby="article-source-transparency-heading">
      <div className="border-2 border-foreground/10 bg-muted/30 p-5 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Reporting transparency</div>
            <h2 id="article-source-transparency-heading" className="mt-1 font-display text-xl md:text-2xl">How this story was sourced</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Keep TX Red combines independently reported details and gives official records priority when they directly verify a claim.
            </p>
          </div>
          <div className="shrink-0 text-xs text-muted-foreground sm:text-right">
            <div className="font-semibold text-foreground">{transparency.sourceCount} source{transparency.sourceCount === 1 ? "" : "s"}</div>
            <div>{transparency.independentSourceCount} independent</div>
            {transparency.primaryRecordCount > 0 ? <div>{transparency.primaryRecordCount} primary record{transparency.primaryRecordCount === 1 ? "" : "s"}</div> : null}
          </div>
        </div>

        {transparency.singleSource ? (
          <div role="note" className="mt-4 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <strong>Single-source reporting:</strong> this article currently has one independently sourced report. Treat developing details as provisional until more reporting or a primary record is available.
          </div>
        ) : null}

        <ol className="mt-5 space-y-3">
          {transparency.sources.map((source, index) => {
            const date = sourceDate(source.publishedAt);
            const role = sourceRole(source);
            return (
              <li key={`${source.url}-${index}`} className="border-l-2 border-primary/20 pl-4">
                <div className="flex flex-wrap items-center gap-2">
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-2 hover:no-underline">
                    {source.label} ↗
                  </a>
                  {source.primaryRecord ? <span className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">Primary record</span> : null}
                  {source.independent ? <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Independent</span> : null}
                </div>
                {source.headline ? <div className="mt-1 text-sm font-medium leading-5 text-foreground">{source.headline}</div> : null}
                {(role || date || source.sourceFamily) ? (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {[role, source.sourceFamily && source.sourceFamily !== source.label ? source.sourceFamily : null, date].filter(Boolean).join(" · ")}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
          Source counts reflect distinct reports retained for this event. Syndicated copies may be kept for provenance without being counted as independent confirmation.
        </p>
      </div>
    </aside>
  );
}
