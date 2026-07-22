import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isLowValueTitle } from "@/lib/low-value-titles";
import { FileText, Image, Video } from "lucide-react";
import { quickPublishToFacebook } from "@/services/quickPublish";
import { publishFeedItem } from "@/services/publishArticle";
import {
  assessRewritePreflight,
  preflightStatusLabel,
  type RewritePreflightResult,
} from "@/lib/rewrite-preflight";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { regenerateFeaturedImage } from "@/lib/featured-image.functions";

type FeedItem = {
  id: number;
  title: string;
  source: string;
  pub_date: string;
  internal_slug: string | null;
  link: string | null;
  description: string | null;
  // When set, this row is an already-published daily_articles piece surfaced
  // for Facebook distribution rather than an RSS feed item.
  article_slug?: string | null;
  article_asset_url?: string | null;
  article_url?: string | null;
  article_title?: string | null;
};

type OpportunityStatus = {
  rewritten: boolean;
  imageReady: boolean;
  reelReady: boolean;
  generatedTitle: string | null;
};

type Scored = FeedItem & {
  texasScore: number;
  breakingScore: number;
  socialScore: number;
  total: number;
};

type FilterKey = "ready" | "pending" | "blocked" | "all";

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
        <span title="Open Keep Texas Red article" className="text-emerald-600">
          <FileText size={14} />
        </span>
      ) : null}
      {status.imageReady ? (
        <span title="View featured image" className="text-blue-600">
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

function categorizeForFilter(
  item: FeedItem,
  status: OpportunityStatus | undefined,
  preflight: RewritePreflightResult,
): FilterKey {
  // Published daily_articles rows are always "ready" for FB.
  if (item.id < 0 || status?.rewritten) return "ready";
  if (preflight.rewriteable) return "ready";
  if (preflight.reason === "PENDING_EXTRACTION") return "pending";
  return "blocked";
}

function readinessLabel(
  item: FeedItem,
  status: OpportunityStatus | undefined,
  preflight: RewritePreflightResult,
): { text: string; tone: "ok" | "warn" | "bad" | "muted" } {
  if (status?.rewritten) return { text: "Published to Keep Texas Red", tone: "ok" };
  if (item.id < 0) return { text: "Published to Keep Texas Red", tone: "ok" };
  if (preflight.rewriteable) {
    return { text: `Rewrite ready · ${preflight.sourceWordCount} source words`, tone: "ok" };
  }
  if (preflight.reason === "PENDING_EXTRACTION") return { text: "Checking source", tone: "muted" };
  return { text: preflightStatusLabel(preflight), tone: "bad" };
}

function toneClass(t: "ok" | "warn" | "bad" | "muted"): string {
  switch (t) {
    case "ok":
      return "text-emerald-600";
    case "warn":
      return "text-amber-600";
    case "bad":
      return "text-red-600";
    default:
      return "text-muted-foreground";
  }
}

export function ContentOpportunityPanel() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<Record<number, OpportunityStatus>>({});
  const [publishing, setPublishing] = useState<Record<number, boolean>>({});
  const [publishMsg, setPublishMsg] = useState<Record<number, { ok: boolean; text: string }>>({});
  const [articleWorking, setArticleWorking] = useState<Record<number, boolean>>({});
  const [articleMsg, setArticleMsg] = useState<Record<number, { ok: boolean; text: string }>>({});
  const [imageWorking, setImageWorking] = useState<Record<number, boolean>>({});
  const [filter, setFilter] = useState<FilterKey>("ready");
  const [previewId, setPreviewId] = useState<number | null>(null);

  const IGNORE_STORAGE_KEY = "ktr.opportunities.ignored.v1";
  const [ignored, setIgnored] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = window.localStorage.getItem(IGNORE_STORAGE_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw) as unknown;
      return new Set(Array.isArray(arr) ? arr.map(String) : []);
    } catch {
      return new Set();
    }
  });

  function ignoreKey(r: Pick<FeedItem, "id" | "internal_slug" | "article_slug" | "link">): string {
    if (r.id > 0) return `feed:${r.id}`;
    const slug = r.article_slug ?? r.internal_slug ?? r.link ?? String(r.id);
    return `article:${slug}`;
  }

  function ignoreOpportunity(r: FeedItem) {
    const key = ignoreKey(r);
    setIgnored((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      try {
        window.localStorage.setItem(IGNORE_STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // ignore quota errors
      }
      return next;
    });
  }

  async function quickPost(r: Scored) {
    setPublishing((s) => ({ ...s, [r.id]: true }));
    setPublishMsg((s) => ({ ...s, [r.id]: { ok: false, text: "" } }));
    try {
      const res = await quickPublishToFacebook({
        headline: r.title,
        source: r.source,
        feed_item_id: r.id > 0 ? r.id : null,
        slug: r.article_slug ?? r.internal_slug ?? null,
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

  async function generateImageAndPost(r: Scored) {
    const slug = r.article_slug ?? r.internal_slug ?? null;
    if (!slug) {
      setPublishMsg((s) => ({
        ...s,
        [r.id]: { ok: false, text: "Publish to Keep Texas Red first — image generation needs an article slug." },
      }));
      return;
    }
    setImageWorking((s) => ({ ...s, [r.id]: true }));
    setPublishMsg((s) => ({ ...s, [r.id]: { ok: false, text: "Generating image…" } }));
    try {
      const token =
        (typeof window !== "undefined" && sessionStorage.getItem("ktr-admin-passcode")) ||
        (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
        "keeptxred";
      const genRes = await regenerateFeaturedImage({ data: { slug, token } });
      if (!genRes.ok) {
        setPublishMsg((s) => ({ ...s, [r.id]: { ok: false, text: `Image generation failed: ${genRes.error}` } }));
        return;
      }
      // Refresh local asset URL then post.
      setStatuses((s) => ({
        ...s,
        [r.id]: {
          rewritten: s[r.id]?.rewritten ?? true,
          imageReady: true,
          reelReady: s[r.id]?.reelReady ?? false,
          generatedTitle: s[r.id]?.generatedTitle ?? null,
        },
      }));
      setPublishMsg((s) => ({ ...s, [r.id]: { ok: true, text: "Image ready. Posting…" } }));
      const postRes = await quickPublishToFacebook({
        headline: r.title,
        source: r.source,
        feed_item_id: r.id > 0 ? r.id : null,
        slug,
        source_url: r.article_url ?? null,
        asset_url: genRes.url,
      });
      if (postRes.ok) {
        setPublishMsg((s) => ({ ...s, [r.id]: { ok: true, text: "Published to Facebook" } }));
      } else {
        setPublishMsg((s) => ({ ...s, [r.id]: { ok: false, text: postRes.error } }));
      }
    } catch (e) {
      setPublishMsg((s) => ({
        ...s,
        [r.id]: { ok: false, text: e instanceof Error ? e.message : "Generate & post failed" },
      }));
    } finally {
      setImageWorking((s) => ({ ...s, [r.id]: false }));
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
            text: res.alreadyPublished ? "Already published" : "Published to Keep Texas Red",
          },
        }));
        setStatuses((s) => ({
          ...s,
          [r.id]: {
            rewritten: true,
            imageReady: s[r.id]?.imageReady ?? false,
            reelReady: s[r.id]?.reelReady ?? false,
            generatedTitle: s[r.id]?.generatedTitle ?? null,
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
          .select("id,title,source,pub_date,internal_slug,link,description")
          .order("pub_date", { ascending: false })
          .limit(150),
        supabase
          .from("daily_articles")
          .select("slug,title,category,source_name,published_at,featured_image_url")
          .in("kind", ["sports-nfl", "sports-mlb", "sports-nba", "evergreen"])
          .order("published_at", { ascending: false })
          .limit(50),
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
          id: -(i + 1),
          title: a.title,
          source: a.source_name || a.category || "KeepTXRed",
          pub_date: a.published_at,
          internal_slug: a.slug,
          link: `https://www.keeptxred.com/news/${a.slug}`,
          description: null,
          article_slug: a.slug,
          article_asset_url: a.featured_image_url,
          article_url: `https://www.keeptxred.com/news/${a.slug}`,
          article_title: a.title,
        }));

      const feed = [...rawFeed, ...articleFeed].filter((f) => !isLowValueTitle(f.title));
      setItems(feed);

      const slugs = feed.map((f) => f.internal_slug).filter(Boolean) as string[];
      const links = feed.map((f) => f.link).filter(Boolean) as string[];
      const titles = feed.map((f) => f.title).filter(Boolean) as string[];

      const [articlesRes, reelsRes] = await Promise.all([
        slugs.length > 0
          ? supabase
              .from("daily_articles")
              .select("slug,title,featured_image_url")
              .in("slug", slugs)
          : Promise.resolve({ data: [] as { slug: string; title: string; featured_image_url: string | null }[] }),
        links.length > 0 || titles.length > 0
          ? supabase.from("reel_candidates").select("source_url,title")
          : Promise.resolve({ data: [] as { source_url: string | null; title: string | null }[] }),
      ]);

      const articleMap = new Map<string, { title: string; featured_image_url: string | null }>();
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
        if (f.id < 0) {
          statusMap[f.id] = {
            rewritten: true,
            imageReady: !!f.article_asset_url,
            reelReady: reelSet.has(f.id),
            generatedTitle: f.article_title ?? null,
          };
          return;
        }
        statusMap[f.id] = {
          rewritten: !!article,
          imageReady: !!article?.featured_image_url,
          reelReady: reelSet.has(f.id),
          generatedTitle: article?.title ?? null,
        };
      });
      setStatuses(statusMap);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Compute preflight once per item — pure, no network.
  const preflightById = useMemo(() => {
    const m: Record<number, RewritePreflightResult> = {};
    items.forEach((it) => {
      m[it.id] =
        it.id < 0
          ? {
              rewriteable: true,
              reason: "READY",
              message: "Published article",
              sourceWordCount: 0,
              factualSignalCount: 0,
              hasClearNewsEvent: true,
            }
          : assessRewritePreflight({
              title: it.title,
              description: it.description,
              link: it.link,
            });
    });
    return m;
  }, [items]);

  const scored = useMemo(
    () =>
      items
        .filter((it) => !ignored.has(ignoreKey(it)))
        .map(score)
        .sort((a, b) => b.total - a.total),
    [items, ignored],
  );

  const filtered = useMemo(() => {
    if (filter === "all") return scored;
    return scored.filter((r) => {
      const cat = categorizeForFilter(r, statuses[r.id], preflightById[r.id] ?? {
        rewriteable: false,
        reason: "PENDING_EXTRACTION",
        message: "",
        sourceWordCount: 0,
        factualSignalCount: 0,
        hasClearNewsEvent: null,
      });
      if (filter === "ready") return cat === "ready" || cat === "pending";
      return cat === filter;
    });
  }, [scored, filter, statuses, preflightById]);

  const previewRow = useMemo(
    () => (previewId == null ? null : scored.find((r) => r.id === previewId) ?? null),
    [previewId, scored],
  );

  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <h2 className="font-display text-xl">Content Opportunities</h2>
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
          {(["ready", "pending", "blocked", "all"] as FilterKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={`px-2 py-1 border ${
                filter === k
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground">No items match this filter.</div>
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
              {filtered.slice(0, 75).map((r) => {
                const status = statuses[r.id];
                const alreadyPublished = !!status?.rewritten;
                const isDailyArticle = r.id < 0;
                const preflight = preflightById[r.id];
                const canPostToFacebook =
                  isDailyArticle || (!!r.internal_slug && !!status?.rewritten);
                const hasImage = !!status?.imageReady;
                const readiness = readinessLabel(r, status, preflight ?? {
                  rewriteable: false,
                  reason: "PENDING_EXTRACTION",
                  message: "",
                  sourceWordCount: 0,
                  factualSignalCount: 0,
                  hasClearNewsEvent: null,
                });
                return (
                  <tr key={r.id} className="border-b border-border/50 align-top">
                    <td className="py-2 pr-2 max-w-[24rem]">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title={r.title}
                          onClick={() => setPreviewId(r.id)}
                          className="font-medium leading-snug truncate text-left hover:underline focus:outline-none focus:ring-1 focus:ring-primary"
                          aria-label={`Preview: ${r.title}`}
                        >
                          {r.title}
                        </button>
                        <OpportunityStatusBadges status={status} />
                      </div>
                      <div className={`text-[10px] ${toneClass(readiness.tone)}`}>{readiness.text}</div>
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
                              disabled={!!articleWorking[r.id] || (!alreadyPublished && !preflight?.rewriteable)}
                              onClick={() => void publishArticle(r)}
                              title={
                                !alreadyPublished && !preflight?.rewriteable
                                  ? preflight?.message
                                  : undefined
                              }
                              className="px-3 py-1 bg-secondary text-secondary-foreground text-[11px] font-bold uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {articleWorking[r.id]
                                ? "Publishing…"
                                : alreadyPublished
                                ? "Republish"
                                : "Publish to Keep Texas Red"}
                            </button>
                          )}
                          {canPostToFacebook && hasImage ? (
                            <button
                              type="button"
                              disabled={!!publishing[r.id]}
                              onClick={() => void quickPost(r)}
                              className="px-3 py-1 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest disabled:opacity-60"
                            >
                              {publishing[r.id] ? "Posting…" : "Post to Facebook"}
                            </button>
                          ) : canPostToFacebook ? (
                            <button
                              type="button"
                              disabled={!!imageWorking[r.id] || !!publishing[r.id]}
                              onClick={() => void generateImageAndPost(r)}
                              className="px-3 py-1 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest disabled:opacity-60"
                            >
                              {imageWorking[r.id] ? "Generating…" : "Generate Image & Post"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled
                              title="Publish to Keep Texas Red first — Facebook posts require a KeepTXRed article URL."
                              className="px-3 py-1 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest opacity-60 cursor-not-allowed"
                            >
                              Post to Facebook
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => ignoreOpportunity(r)}
                            title="Hide this opportunity from the list (does not delete the source article)."
                            className="px-3 py-1 border border-border text-[11px] font-bold uppercase tracking-widest hover:bg-muted"
                          >
                            Ignore
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

      <Dialog open={previewRow != null} onOpenChange={(o) => !o && setPreviewId(null)}>
        <DialogContent className="max-w-2xl">
          {previewRow ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-base leading-snug">Content preview</DialogTitle>
                <DialogDescription>
                  Full headlines and rewrite / image readiness for this opportunity.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Source headline
                  </div>
                  <div className="font-medium">{previewRow.title}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Keep Texas Red headline
                  </div>
                  <div className="font-medium">
                    {statuses[previewRow.id]?.generatedTitle ?? (
                      <span className="text-muted-foreground italic">
                        Not generated yet — publishing will rewrite this headline.
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  <div>
                    <div className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
                      Source
                    </div>
                    <div>{previewRow.source}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
                      Published
                    </div>
                    <div>
                      {new Date(previewRow.pub_date).toLocaleString("en-US", {
                        timeZone: "America/Chicago",
                      })}
                    </div>
                  </div>
                </div>
                {previewRow.link ? (
                  <div>
                    <a
                      href={previewRow.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] underline text-primary break-all"
                    >
                      Open source article ↗
                    </a>
                  </div>
                ) : null}
                <div className="text-[11px]">
                  <div className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
                    Rewrite readiness
                  </div>
                  <div className={toneClass(readinessLabel(previewRow, statuses[previewRow.id], preflightById[previewRow.id]).tone)}>
                    {readinessLabel(previewRow, statuses[previewRow.id], preflightById[previewRow.id]).text}
                  </div>
                </div>
                <div className="text-[11px]">
                  <div className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
                    Facebook image
                  </div>
                  <div>
                    {statuses[previewRow.id]?.imageReady ? (
                      <span className="text-emerald-600">
                        Image stored · will be verified before Facebook posting
                      </span>
                    ) : (
                      <span className="text-amber-600">
                        No image stored · Facebook posting will require Generate Image &amp; Post
                      </span>
                    )}
                  </div>
                  {previewRow.article_asset_url && statuses[previewRow.id]?.imageReady ? (
                    <img
                      src={previewRow.article_asset_url}
                      alt=""
                      className="mt-2 max-h-40 rounded border border-border"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                {previewRow.description ? (
                  <div className="text-[11px]">
                    <div className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
                      Source summary
                    </div>
                    <div className="max-h-40 overflow-y-auto whitespace-pre-wrap text-muted-foreground">
                      {previewRow.description.slice(0, 1200)}
                    </div>
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2 pt-2">
                  {previewRow.id > 0 ? (
                    <button
                      type="button"
                      disabled={
                        !!articleWorking[previewRow.id] ||
                        (!statuses[previewRow.id]?.rewritten && !preflightById[previewRow.id]?.rewriteable)
                      }
                      onClick={() => void publishArticle(previewRow)}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-[11px] font-bold uppercase tracking-widest disabled:opacity-60"
                    >
                      {statuses[previewRow.id]?.rewritten ? "Republish" : "Publish to Keep Texas Red"}
                    </button>
                  ) : null}
                  {(previewRow.id < 0 || (!!previewRow.internal_slug && !!statuses[previewRow.id]?.rewritten)) ? (
                    statuses[previewRow.id]?.imageReady ? (
                      <button
                        type="button"
                        disabled={!!publishing[previewRow.id]}
                        onClick={() => void quickPost(previewRow)}
                        className="px-3 py-1 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest disabled:opacity-60"
                      >
                        Post to Facebook
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!!imageWorking[previewRow.id]}
                        onClick={() => void generateImageAndPost(previewRow)}
                        className="px-3 py-1 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest disabled:opacity-60"
                      >
                        Generate Image &amp; Post
                      </button>
                    )
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      ignoreOpportunity(previewRow);
                      setPreviewId(null);
                    }}
                    className="px-3 py-1 border border-border text-[11px] font-bold uppercase tracking-widest hover:bg-muted"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}