import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isLowValueTitle } from "@/lib/low-value-titles";
import { FileText, Image, Video } from "lucide-react";
import { quickPublishToFacebook } from "@/services/quickPublish";
import { publishFeedItem } from "@/services/publishArticle";

type FeedItem = {
  id: number;
  title: string;
  source: string;
  pub_date: string;
  internal_slug: string | null;
  link: string | null;
  // When set, this row is an already-published daily_articles piece surfaced
  // for Facebook distribution rather than an RSS feed item.
  article_slug?: string | null;
  article_asset_url?: string | null;
  article_url?: string | null;
};

type OpportunityStatus = {
  rewritten: boolean;
  imageReady: boolean;
  reelReady: boolean;
};

type Scored = FeedItem & {
  texasScore: number;
  breakingScore: number;
  socialScore: number;
  total: number;
};

const TEXAS_TOPICS = /\b(tax|taxes|election|elections|law|laws|border|economy|economic|public safety|police|crime)\b/i;
const OFFICIAL_SOURCES = /(governor|texas\.gov|office of the governor|attorney general|texas tribune official|state of texas)/i;
const BREAKING_WORDS = /\b(breaking|signs|declares|announces|emergency|ruling|election|law|veto|appoints)\b/i;
const SOCIAL_TOPICS = /\b(election|elections|tax|taxes|border|crime|governor|abbott|hurricane|storm|shooting|flood)\b/i;

function hoursSince(iso: string): number {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return Infinity;
  return (Date.now() - t) / 3_600_000;
}

function score(item: FeedItem): Scored {
  const title = item.title ?? "";
  const source = item.source ?? "";
  const hrs = hoursSince(item.pub_date);

  let texas = 0;
  if (/\btexas\b/i.test(title)) texas += 30;
  if (OFFICIAL_SOURCES.test(source)) texas += 20;
  if (TEXAS_TOPICS.test(title)) texas += 20;
  if (hrs <= 24) texas += 10;

  let breaking = 0;
  if (BREAKING_WORDS.test(title)) breaking += 30;
  if (hrs <= 12) breaking += 20;

  let social = 0;
  if (SOCIAL_TOPICS.test(title)) social += 30;
  if (breaking >= 30) social += 20;

  let freshness = 0;
  if (hrs <= 24) freshness = 50;
  else if (hrs <= 48) freshness = 25;

  return {
    ...item,
    texasScore: texas,
    breakingScore: breaking,
    socialScore: social,
    total: texas + breaking + social + freshness,
  };
}

function OpportunityStatusBadges({ status }: { status?: OpportunityStatus }) {
  if (!status) return null;
  return (
    <div className="flex items-center gap-1 shrink-0" aria-label="Media status">
      {status.rewritten ? (
        <span title="Rewritten" className="text-emerald-600">
          <FileText size={14} />
        </span>
      ) : null}
      {status.imageReady ? (
        <span title="Image Ready" className="text-blue-600">
          <Image size={14} />
        </span>
      ) : null}
      {status.reelReady ? (
        <span title="Reel Ready" className="text-purple-600">
          <Video size={14} />
        </span>
      ) : null}
    </div>
  );
}

export function ContentOpportunityPanel() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<Record<number, OpportunityStatus>>({});
  const [publishing, setPublishing] = useState<Record<number, boolean>>({});
  const [publishMsg, setPublishMsg] = useState<Record<number, { ok: boolean; text: string }>>({});
  const [articleWorking, setArticleWorking] = useState<Record<number, boolean>>({});
  const [articleMsg, setArticleMsg] = useState<Record<number, { ok: boolean; text: string }>>({});

  async function quickPost(r: Scored) {
    setPublishing((s) => ({ ...s, [r.id]: true }));
    setPublishMsg((s) => ({ ...s, [r.id]: { ok: false, text: "" } }));
    try {
      const res = await quickPublishToFacebook({
        headline: r.title,
        source: r.source,
        // Daily-articles rows use synthetic negative ids; feed rows keep their real id.
        feed_item_id: r.id > 0 ? r.id : null,
        slug: r.article_slug ?? null,
        source_url: r.article_url ?? null,
        asset_url: r.article_asset_url ?? null,
      });
      if (res.ok) {
        setPublishMsg((s) => ({ ...s, [r.id]: { ok: true, text: "Published to Facebook" } }));
      } else {
        setPublishMsg((s) => ({ ...s, [r.id]: { ok: false, text: res.error } }));
      }
    } catch (e) {
      setPublishMsg((s) => ({
        ...s,
        [r.id]: { ok: false, text: e instanceof Error ? e.message : "Publish failed" },
      }));
    } finally {
      setPublishing((s) => ({ ...s, [r.id]: false }));
    }
  }

  async function publishArticle(r: Scored) {
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
        setStatuses((s) => ({
          ...s,
          [r.id]: {
            rewritten: true,
            imageReady: s[r.id]?.imageReady ?? false,
            reelReady: s[r.id]?.reelReady ?? false,
          },
        }));
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

  useEffect(() => {
    let active = true;
    (async () => {
      const [feedRes, articleRes, pkgRes] = await Promise.all([
        supabase
          .from("texas_news_feed")
          .select("id,title,source,pub_date,internal_slug,link")
          .order("pub_date", { ascending: false })
          .limit(50),
        // Include original KeepTXRed articles (e.g. sports) that never entered
        // texas_news_feed so they can still be pushed to Facebook.
        supabase
          .from("daily_articles")
          .select("slug,title,category,source_name,published_at,featured_image_url")
          .in("kind", ["sports-nfl", "sports-mlb", "sports-nba", "evergreen"])
          .order("published_at", { ascending: false })
          .limit(25),
        supabase
          .from("content_packages")
          .select("source_url,source_title")
          .eq("workflow_status", "PUBLISHED"),
      ]);
      if (!active) return;
      const rawFeed = (feedRes.data ?? []) as FeedItem[];
      const rawArticles = (articleRes.data ?? []) as Array<{
        slug: string;
        title: string;
        category: string | null;
        source_name: string | null;
        published_at: string;
        featured_image_url: string | null;
      }>;

      // Dedupe: skip daily_articles items already sent to Facebook via a
      // published content_packages row (matched by internal URL slug or title).
      const publishedSlugs = new Set<string>();
      const publishedTitles = new Set<string>();
      ((pkgRes.data ?? []) as Array<{ source_url: string | null; source_title: string | null }>).forEach(
        (p) => {
          if (p.source_url) {
            const m = p.source_url.match(/\/news\/([^/?#]+)/);
            if (m) publishedSlugs.add(m[1].toLowerCase());
          }
          if (p.source_title) publishedTitles.add(p.source_title.toLowerCase().trim());
        },
      );

      const articleFeed: FeedItem[] = rawArticles
        .filter(
          (a) =>
            !publishedSlugs.has(a.slug.toLowerCase()) &&
            !publishedTitles.has(a.title.toLowerCase().trim()),
        )
        .map((a, i) => ({
          id: -(i + 1), // synthetic negative id to avoid colliding with feed ids
          title: a.title,
          source: a.source_name || a.category || "KeepTXRed",
          pub_date: a.published_at,
          internal_slug: a.slug,
          link: `https://www.keeptxred.com/news/${a.slug}`,
          article_slug: a.slug,
          article_asset_url: a.featured_image_url,
          article_url: `https://www.keeptxred.com/news/${a.slug}`,
        }));

      const feed = [...rawFeed, ...articleFeed].filter((f) => !isLowValueTitle(f.title));
      setItems(feed);

      const slugs = feed.map((f) => f.internal_slug).filter(Boolean) as string[];
      const links = feed.map((f) => f.link).filter(Boolean) as string[];
      const titles = feed.map((f) => f.title).filter(Boolean) as string[];

      const [articlesRes, reelsRes] = await Promise.all([
        slugs.length > 0
          ? supabase.from("daily_articles").select("slug,featured_image_url").in("slug", slugs)
          : Promise.resolve({ data: [] as { slug: string; featured_image_url: string | null }[] }),
        links.length > 0 || titles.length > 0
          ? supabase.from("reel_candidates").select("source_url,title")
          : Promise.resolve({ data: [] as { source_url: string | null; title: string | null }[] }),
      ]);

      const articleMap = new Map<string, { featured_image_url: string | null }>();
      (articlesRes.data ?? []).forEach((a) => articleMap.set(a.slug, a));

      const normalizedTitles = new Set(titles.map((t) => t.toLowerCase().trim()));
      const normalizedLinks = new Set(links.map((l) => l.toLowerCase().trim()));
      const reelSet = new Set<number>();
      (reelsRes.data ?? []).forEach((rc) => {
        if (rc.source_url && normalizedLinks.has(rc.source_url.toLowerCase().trim())) {
          feed.forEach((f) => {
            if (f.link && f.link.toLowerCase().trim() === rc.source_url!.toLowerCase().trim()) {
              reelSet.add(f.id);
            }
          });
        }
        if (rc.title && normalizedTitles.has(rc.title.toLowerCase().trim())) {
          feed.forEach((f) => {
            if (f.title.toLowerCase().trim() === rc.title!.toLowerCase().trim()) {
              reelSet.add(f.id);
            }
          });
        }
      });

      const statusMap: Record<number, OpportunityStatus> = {};
      feed.forEach((f) => {
        const article = f.internal_slug ? articleMap.get(f.internal_slug) : null;
        // Daily-articles rows are already published on-site; mark them as
        // rewritten + imageReady based on their own data so the badges reflect
        // reality even though they never went through the feed rewrite path.
        if (f.id < 0) {
          statusMap[f.id] = {
            rewritten: true,
            imageReady: !!f.article_asset_url,
            reelReady: reelSet.has(f.id),
          };
          return;
        }
        statusMap[f.id] = {
          rewritten: !!article,
          imageReady: !!article?.featured_image_url,
          reelReady: reelSet.has(f.id),
        };
      });
      setStatuses(statusMap);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const scored = useMemo(
    () => items.map(score).sort((a, b) => b.total - a.total),
    [items],
  );

  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-xl">Content Opportunities</h2>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          AI handles category, type, SEO, and image
        </span>
      </div>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : scored.length === 0 ? (
        <div className="text-sm text-muted-foreground">No recent feed items.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="py-2 pr-2">Headline</th>
                <th className="py-2 pr-2">Source</th>
                <th className="py-2 pr-2">Published</th>
                <th className="py-2 pr-2 text-right">TX</th>
                <th className="py-2 pr-2 text-right">Break</th>
                <th className="py-2 pr-2 text-right">Social</th>
                <th className="py-2 pr-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scored.slice(0, 25).map((r) => {
                const status = statuses[r.id];
                const alreadyPublished = !!status?.rewritten;
                const isDailyArticle = r.id < 0;
                return (
                  <tr key={r.id} className="border-b border-border/50 align-top">
                    <td className="py-2 pr-2 max-w-[24rem]">
                      <div className="flex items-center gap-2">
                        <div className="font-medium leading-snug truncate">{r.title}</div>
                        <OpportunityStatusBadges status={status} />
                      </div>
                    </td>
                    <td className="py-2 pr-2 text-[11px] text-muted-foreground">{r.source}</td>
                    <td className="py-2 pr-2 text-[11px] text-muted-foreground whitespace-nowrap">
                      {new Date(r.pub_date).toLocaleString("en-US", { timeZone: "America/Chicago" })}
                    </td>
                    <td className="py-2 pr-2 text-right tabular-nums">{r.texasScore}</td>
                    <td className="py-2 pr-2 text-right tabular-nums">{r.breakingScore}</td>
                    <td className="py-2 pr-2 text-right tabular-nums">{r.socialScore}</td>
                    <td className="py-2 pr-2 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex flex-wrap gap-2">
                          {isDailyArticle ? null : (
                            <button
                              type="button"
                              disabled={!!articleWorking[r.id]}
                              onClick={() => void publishArticle(r)}
                              className="px-3 py-1 bg-secondary text-secondary-foreground text-[11px] font-bold uppercase tracking-widest disabled:opacity-60"
                            >
                              {articleWorking[r.id]
                                ? "Publishing…"
                                : alreadyPublished
                                ? "Republish"
                                : "Publish to Keep Texas Red"}
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={!!publishing[r.id]}
                            onClick={() => void quickPost(r)}
                            className="px-3 py-1 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest disabled:opacity-60"
                          >
                            {publishing[r.id] ? "Posting…" : "Post to Facebook"}
                          </button>
                        </div>
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