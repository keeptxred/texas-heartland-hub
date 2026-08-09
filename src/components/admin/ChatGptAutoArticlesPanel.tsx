import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { quickPublishToFacebook } from "@/services/quickPublish";
import { regenerateFeaturedImage } from "@/lib/featured-image.functions";
import { isLegacyGeneratedNewsAsset } from "@/lib/facebook-image-readiness";
import { Facebook, Image as ImageIcon } from "lucide-react";

type ChatGptArticle = {
  id: string;
  slug: string;
  title: string;
  category: string;
  source_name: string | null;
  source_url: string | null;
  published_at: string;
  featured_image_url: string | null;
  image_generation_status: string | null;
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

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("daily_articles")
        .select(
          "id,slug,title,category,source_name,source_url,published_at,featured_image_url,image_generation_status",
        )
        .eq("author", "Keep TX Red Newsroom")
        .eq("is_ingested", false)
        .order("published_at", { ascending: false })
        .limit(100);

      if (!active) return;

      if (queryError) {
        setError(queryError.message);
        setArticles([]);
      } else {
        setArticles((data ?? []) as ChatGptArticle[]);
      }
      setLoading(false);
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

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
        source_url: article.source_url,
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
      const token =
        sessionStorage.getItem("ktr-admin-passcode") ||
        (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
        "keeptxred";
      const result = await regenerateFeaturedImage({ data: { slug: article.slug, token } });
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
            Facebook.
          </p>
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {articles.length} loaded
        </span>
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
            const isRegenerating = regenerating[article.id] ?? false;

            return (
              <li key={article.id} className="py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        {article.category}
                      </span>
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
                        disabled={isRegenerating}
                        className="border-2 border-primary px-3 py-2 text-xs font-bold text-primary disabled:opacity-50"
                      >
                        {isRegenerating ? "Regenerating…" : "Regenerate Real Image"}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void postToFacebook(article)}
                      disabled={
                        isPosting ||
                        isRegenerating ||
                        isLegacyPlaceholder ||
                        state.status === "posted"
                      }
                      className="inline-flex items-center justify-center gap-2 border-2 border-[#1877F2] px-3 py-2 text-xs font-bold text-[#1877F2] transition-colors hover:bg-[#1877F2] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Facebook size={15} />
                      {isPosting
                        ? "Posting…"
                        : state.status === "posted"
                          ? "Posted"
                          : "Post to Facebook"}
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
