import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { quickPublishToFacebook } from "@/services/quickPublish";
import { regenerateFeaturedImage } from "@/lib/featured-image.functions";
import { ignoreChatGptArticle } from "@/lib/chatgpt-admin.functions";
import { isLegacyGeneratedNewsAsset } from "@/lib/facebook-image-readiness";
import { EyeOff, Facebook, Image as ImageIcon } from "lucide-react";

const IGNORE_FLAG = "chatgpt-admin-ignored";
const NEWSROOM_AUTHOR = "Keep TX Red Newsroom";

type ChatGptArticle = {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string | null;
  source_name: string | null;
  source_url: string | null;
  published_at: string;
  featured_image_url: string | null;
  image_generation_status: string | null;
  quality_flags: string[] | null;
};

type PostState =
  | { status: "idle" }
  | { status: "posting" }
  | { status: "posted"; postUrl: string | null }
  | { status: "error"; message: string };

export function ChatGptAutoArticlesPanel() {
  const [articles, setArticles] = useState<ChatGptArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postState, setPostState] = useState<Record<string, PostState>>({});
  const [regenerating, setRegenerating] = useState<Record<string, boolean>>({});
  const [ignoring, setIgnoring] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("daily_articles")
        .select(
          "id,slug,title,category,author,source_name,source_url,published_at,featured_image_url,image_generation_status,quality_flags",
        )
        // New generated newsroom rows are stamped with NEWSROOM_AUTHOR. Keep
        // the NULL-author path only for legacy generated-news rows created
        // before that metadata contract was added.
        .or("author.eq.Keep TX Red Newsroom,author.is.null")
        .eq("is_ingested", false)
        .eq("kind", "news")
        .order("published_at", { ascending: false })
        .limit(100);

      if (!active) return;

      if (queryError) {
        setError(queryError.message);
        setArticles([]);
      } else {
        const visibleArticles = ((data ?? []) as ChatGptArticle[]).filter(
          (article) => !(article.quality_flags ?? []).includes(IGNORE_FLAG),
        );
        setArticles(visibleArticles);
      }
      setLoading(false);
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  const legacyMetadataCount = articles.filter((article) => !article.author).length;
  const stampedMetadataCount = articles.filter((article) => article.author === NEWSROOM_AUTHOR).length;

  function adminToken(): string {
    return (
      sessionStorage.getItem("ktr-admin-passcode") ||
      (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
      "keeptxred"
    );
  }

  async function ignoreArticle(article: ChatGptArticle) {
    setIgnoring((current) => ({ ...current, [article.id]: true }));
    setPostState((current) => ({ ...current, [article.id]: { status: "idle" } }));

    try {
      const result = await ignoreChatGptArticle({
        data: { id: article.id, token: adminToken() },
      });
      if (!result.ok) throw new Error(result.error);

      setArticles((current) => current.filter((item) => item.id !== article.id));
    } catch (err) {
      setPostState((current) => ({
        ...current,
        [article.id]: {
          status: "error",
          message: err instanceof Error ? err.message : "Could not ignore article",
        },
      }));
    } finally {
      setIgnoring((current) => ({ ...current, [article.id]: false }));
    }
  }

  async function postToFacebook(article: ChatGptArticle) {
    if (isLegacyGeneratedNewsAsset(article.featured_image_url)) {
      setPostState((current) => ({
        ...current,
        [article.id]: {
          status: "error",
          message:
            "Regenerate a real editorial image before posting this legacy placeholder to Facebook.",
        },
      }));
      return;
    }
    setPostState((current) => ({ ...current, [article.id]: { status: "posting" } }));

    try {
      const result = await quickPublishToFacebook({
        headline: article.title,
        source: article.source_name ?? "Keep TX Red",
        source_url: `https://keeptxred.com/news/${article.slug}`,
        caption: article.title,
        asset_url: article.featured_image_url,
        slug: article.slug,
      });

      if (!result.ok) {
        setPostState((current) => ({
          ...current,
          [article.id]: { status: "error", message: result.error },
        }));
        return;
      }

      setPostState((current) => ({
        ...current,
        [article.id]: { status: "posted", postUrl: result.post_url },
      }));
    } catch (err) {
      setPostState((current) => ({
        ...current,
        [article.id]: {
          status: "error",
          message: err instanceof Error ? err.message : "Facebook post failed",
        },
      }));
    }
  }

  async function regenerateImage(article: ChatGptArticle) {
    setRegenerating((current) => ({ ...current, [article.id]: true }));
    setPostState((current) => ({ ...current, [article.id]: { status: "idle" } }));
    try {
      const result = await regenerateFeaturedImage({
        data: { slug: article.slug, token: adminToken() },
      });
      if (!result.ok) throw new Error(result.error);
      setArticles((current) =>
        current.map((item) =>
          item.id === article.id
            ? { ...item, featured_image_url: result.url, image_generation_status: "ready" }
            : item,
        ),
      );
    } catch (err) {
      setPostState((current) => ({
        ...current,
        [article.id]: {
          status: "error",
          message: err instanceof Error ? err.message : "Image regeneration failed",
        },
      }));
    } finally {
      setRegenerating((current) => ({ ...current, [article.id]: false }));
    }
  }

  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
            Social publishing
          </div>
          <h2 className="font-display text-2xl">ChatGPT Auto Articles</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Articles created by the ChatGPT automated newsroom, ready to review and share to
            Facebook. Ignored articles stay hidden permanently.
          </p>
        </div>
        <div className="text-right text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <div>{articles.length} loaded</div>
          {!loading && !error ? (
            <div className="mt-1 normal-case tracking-normal">
              <span className="text-emerald-700">{stampedMetadataCount} stamped</span>
              {legacyMetadataCount > 0 ? (
                <span className="ml-2 text-amber-700">{legacyMetadataCount} legacy metadata</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {loading ? <div className="text-sm text-muted-foreground">Loading…</div> : null}
      {error ? (
        <div
          role="alert"
          className="border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          Could not load ChatGPT auto articles: {error}
        </div>
      ) : null}
      {!loading && !error && articles.length === 0 ? (
        <div className="text-sm text-muted-foreground">No ChatGPT auto articles found.</div>
      ) : null}

      {!loading && !error && articles.length > 0 ? (
        <ul className="divide-y divide-border">
          {articles.map((article) => {
            const state = postState[article.id] ?? { status: "idle" as const };
            const isPosting = state.status === "posting";
            const isLegacyPlaceholder = isLegacyGeneratedNewsAsset(article.featured_image_url);
            const isLegacyMetadata = !article.author;
            const isRegenerating = regenerating[article.id] ?? false;
            const isIgnoring = ignoring[article.id] ?? false;

            return (
              <li key={article.id} className="py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        {article.category}
                      </span>
                      {isLegacyMetadata ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                          Legacy Metadata
                        </span>
                      ) : null}
                      {isLegacyPlaceholder ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-destructive">
                          Legacy Placeholder
                        </span>
                      ) : article.featured_image_url ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                          <ImageIcon size={12} /> AI Image
                        </span>
                      ) : article.image_generation_status === "failed" ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-destructive">
                          Img Failed
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          No Img
                        </span>
                      )}
                    </div>

                    <a
                      href={`/news/${article.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block text-sm font-semibold leading-snug hover:underline"
                    >
                      {article.title}
                    </a>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {article.source_name || "Keep TX Red"} ·{" "}
                      {new Date(article.published_at).toLocaleString("en-US", {
                        timeZone: "America/Chicago",
                      })}
                    </div>

                    {state.status === "error" ? (
                      <div className="mt-2 text-xs text-destructive">{state.message}</div>
                    ) : null}
                    {state.status === "posted" ? (
                      <div className="mt-2 text-xs font-medium text-emerald-700">
                        Posted to Facebook
                        {state.postUrl ? (
                          <>
                            {" · "}
                            <a
                              href={state.postUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              View post
                            </a>
                          </>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 flex-col gap-2">
                    {isLegacyPlaceholder ? (
                      <button
                        type="button"
                        onClick={() => void regenerateImage(article)}
                        disabled={isRegenerating || isIgnoring}
                        className="border-2 border-primary px-3 py-2 text-xs font-bold text-primary disabled:opacity-50"
                      >
                        {isRegenerating ? "Regenerating…" : "Regenerate Real Image"}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void postToFacebook(article)}
                      disabled={isPosting || isRegenerating || isIgnoring || isLegacyPlaceholder}
                      className="inline-flex items-center justify-center gap-2 border-2 border-[#1877F2] px-3 py-2 text-xs font-bold text-[#1877F2] transition-colors hover:bg-[#1877F2] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Facebook size={15} />
                      {isPosting
                        ? "Posting…"
                        : state.status === "posted"
                          ? "Republish to Facebook"
                          : "Post to Facebook"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void ignoreArticle(article)}
                      disabled={isIgnoring || isPosting || isRegenerating}
                      className="inline-flex items-center justify-center gap-2 border-2 border-foreground/20 px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <EyeOff size={15} />
                      {isIgnoring ? "Ignoring…" : "Ignore"}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
