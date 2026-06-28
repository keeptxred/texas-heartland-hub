import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { classifyFeedItem, ONE_DAY_MS, type FeedRow, type FeedSection } from "@/lib/feed-routing";

function timeAgo(iso: string) {
  const t = Date.parse(iso);
  if (!t) return "";
  const diff = Date.now() - t;
  const d = Math.floor(diff / 86_400_000);
  if (d < 1) return "today";
  if (d === 1) return "1 day ago";
  return `${d} days ago`;
}

type Props = {
  section: FeedSection;
  title?: string;
  blurb?: string;
  limit?: number;
};

export function AgedFeedSection({ section, title = "From the Live Feed", blurb, limit = 12 }: Props) {
  const [items, setItems] = useState<FeedRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const cutoffIso = new Date(Date.now() - ONE_DAY_MS).toISOString();
      const { data } = await supabase
        .from("texas_news_feed")
        .select("id,title,source,link,description,pub_date")
        .lt("pub_date", cutoffIso)
        .order("pub_date", { ascending: false })
        .limit(200);
      if (!active) return;
      const rows = ((data as FeedRow[]) ?? []).filter((r) => classifyFeedItem(r) === section).slice(0, limit);
      setItems(rows);
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, [section, limit]);

  if (!loaded || items.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 border-t-2 border-foreground/10">
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ {title}</span>
      <h2 className="font-display text-3xl tracking-tight mt-2">Official Texas Updates</h2>
      {blurb ? <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{blurb}</p> : null}
      <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <li key={it.id} className="border-2 border-foreground/10 bg-card p-4 hover:border-primary transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{it.source}</span>
              <time className="text-[10px] text-muted-foreground" dateTime={it.pub_date}>{timeAgo(it.pub_date)}</time>
            </div>
            <h3 className="font-serif text-sm font-bold leading-snug">
              <a href={it.link} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">{it.title}</a>
            </h3>
            {it.description ? <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{it.description}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}