import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { regenerateFeaturedImage } from "@/lib/featured-image.functions";
import { isPublicBreaking } from "@/lib/public-breaking";
import { ContentOpportunityPanel } from "@/components/admin/ContentOpportunityPanel";
import { ChatGptAutoArticlesPanel } from "@/components/admin/ChatGptAutoArticlesPanel";
import { SavedPackagesPanel } from "@/components/admin/SavedPackagesPanel";
import { BrandSettings } from "@/components/admin/BrandSettings";
import { ReelRadarPanel } from "@/components/admin/ReelRadarPanel";
import { ContentSourceManager } from "@/components/admin/ContentSourceManager";
import { PublishingQueuePanel } from "@/components/admin/PublishingQueuePanel";
import { MetaConnectionManager } from "@/components/admin/MetaConnectionManager";
import { ViralRadarPanel } from "@/components/admin/ViralRadarPanel";
import { ExploreDuplicatePanel } from "@/components/admin/ExploreDuplicatePanel";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Editorial Dashboard — Keep TX Red" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: AdminDashboardPage,
});

const STORAGE_KEY = "ktr-admin-ok";

type FeedRow = {
  id: number;
  title: string;
  source: string;
  internal_slug: string | null;
  pub_date: string;
};

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  dek: string | null;
  category: string;
  is_breaking: boolean | null;
  published_at: string;
  created_at?: string | null;
  source_name?: string | null;
  featured_image_url?: string | null;
  image_generation_status?: string | null;
};

function AdminDashboardPage() {
  const [feed, setFeed] = useState<FeedRow[]>([]);
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        await fetch("/api/public/hooks/ingest-feeds", {
          method: "POST",
          headers: { Accept: "application/json" },
        });
      } catch {
        // Dashboard data still loads even when the on-open feed refresh fails.
      }

      const [{ data: f }, { data: a }] = await Promise.all([
        supabase
          .from("texas_news_feed")
          .select("id,title,source,internal_slug,pub_date")
          .order("pub_date", { ascending: false })
          .limit(50),
        supabase
          .from("daily_articles")
          .select("id,slug,title,dek,category,is_breaking,published_at,created_at,source_name,featured_image_url,image_generation_status")
          .order("created_at", { ascending: false })
          .limit(50),
      ]);
      if (!active) return;
      setFeed((f ?? []) as FeedRow[]);
      setArticles((a ?? []) as ArticleRow[]);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const missingSlug = feed.filter((r) => !r.internal_slug).length;
  const priorityFlags = articles.filter((article) => article.is_breaking).length;
  const publicBreaking = articles.filter((article) => isPublicBreaking(article)).length;
  const latestNormalArticle = articles.find(
    (article) => article.source_name !== "Keep TX Red Reserve Desk",
  );
  const latestNormalActivity = latestNormalArticle
    ? latestNormalArticle.created_at ?? latestNormalArticle.published_at
    : null;
  const publishingStalled =
    !latestNormalActivity ||
    Date.now() - Date.parse(latestNormalActivity) >= 24 * 60 * 60 * 1000;

  function signOut() {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem("ktr-admin-passcode");
    window.location.reload();
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-secondary text-secondary-foreground border-b-4 border-primary">
        <div className="mx-auto max-w-6xl px-4 py-10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent">★ Internal</span>
            <h1 className="font-display text-3xl md:text-5xl leading-[0.95] tracking-tight mt-2">
              Editorial <span className="text-primary">Dashboard</span>
            </h1>
            <p className="mt-2 text-sm text-white/90">Feed ingestion, article pipeline, and system health.</p>
          </div>
          <Button variant="outline" onClick={signOut}>Sign out</Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-8">
        <Link
          to="/admin/shop-products"
          className="block border-2 border-primary bg-primary/5 p-5 transition-colors hover:bg-primary/10"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Shop</div>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl">Store Catalog</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose which Printify products appear on KeepTXRed, TexasDefined, both stores, or neither.
              </p>
            </div>
            <span className="text-sm font-bold text-primary">Open catalog →</span>
          </div>
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Feed items (last 50)" value={feed.length} />
        <Stat label="Missing internal slug" value={missingSlug} tone={missingSlug > 0 ? "warn" : "ok"} />
        <Stat label="Articles (last 50)" value={articles.length} />
        <Stat label="Priority flags (last 50)" value={priorityFlags} />
        <Stat label="Public breaking now" value={publicBreaking} tone={publicBreaking > 0 ? "warn" : "ok"} />
      </section>

      {publishingStalled ? (
        <section className="mx-auto max-w-6xl px-4 pb-8">
          <div role="alert" className="border-2 border-amber-500 bg-amber-50 p-4 text-amber-950">
            <div className="text-xs font-bold uppercase tracking-widest">Publishing safety net active</div>
            <p className="mt-1 text-sm">
              No normal newsroom article has published for at least 24 hours.
              The reserve queue will release one prewritten article per 24-hour gap until normal publishing resumes.
            </p>
            {latestNormalActivity ? (
              <p className="mt-1 text-xs">
                Latest normal publication:{" "}
                {new Date(latestNormalActivity).toLocaleString("en-US", {
                  timeZone: "America/Chicago",
                })}
              </p>
            ) : null}
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-6xl px-4 pb-8">
          <div className="border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
            Publishing monitor healthy. Latest normal article:{" "}
            {new Date(latestNormalActivity!).toLocaleString("en-US", {
              timeZone: "America/Chicago",
            })}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-16 grid gap-8 lg:grid-cols-2">
        <Panel title="Latest RSS Ingest">
          {loading ? <Skel /> : (
            <ul className="divide-y divide-border">
              {feed.slice(0, 20).map((r) => (
                <li key={r.id} className="py-2 flex items-start gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary shrink-0 mt-1 w-20 truncate">{r.source}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium leading-snug truncate">{r.title}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {new Date(r.pub_date).toLocaleString("en-US", { timeZone: "America/Chicago" })}
                      {r.internal_slug ? "" : " · no slug"}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Latest Published Articles">
          {loading ? <Skel /> : (
            <ul className="divide-y divide-border">
              {articles.slice(0, 20).map((a) => {
                const publicBreakingNow = isPublicBreaking(a);
                return (
                  <li key={a.id} className="py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{a.category}</span>
                      {publicBreakingNow ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-destructive">Breaking</span>
                      ) : a.is_breaking ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Priority</span>
                      ) : null}
                      <ImageStatusBadge status={a.image_generation_status} hasImage={!!a.featured_image_url} />
                    </div>
                    <a href={`/news/${a.slug}`} className="text-sm font-medium leading-snug hover:underline">{a.title}</a>
                    <div className="text-[11px] text-muted-foreground">
                      {new Date(a.published_at).toLocaleString("en-US", { timeZone: "America/Chicago" })}
                    </div>
                    <RegenerateImageButton slug={a.slug} />
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <ChatGptAutoArticlesPanel />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        {loading ? <Skel /> : <ContentOpportunityPanel />}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <ViralRadarPanel />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <ExploreDuplicatePanel />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <ReelRadarPanel />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <ContentSourceManager />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <PublishingQueuePanel />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <MetaConnectionManager />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <SavedPackagesPanel />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <BrandSettings />
      </section>
    </div>
  );
}

function ImageStatusBadge({ status, hasImage }: { status?: string | null; hasImage: boolean }) {
  if (hasImage) {
    return <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">AI Image</span>;
  }
  if (status === "failed") {
    return <span className="text-[10px] font-bold uppercase tracking-widest text-destructive">Img Failed</span>;
  }
  if (status === "generating") {
    return <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Img Gen…</span>;
  }
  return <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">No Img</span>;
}

function RegenerateImageButton({ slug }: { slug: string }) {
  const [state, setState] = useState<"idle" | "working" | "done" | "err">("idle");
  const [msg, setMsg] = useState("");
  async function regen() {
    setState("working");
    setMsg("");
    try {
      const token =
        (typeof window !== "undefined" &&
          (sessionStorage.getItem("ktr-admin-passcode") ||
            (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
            "keeptxred")) ||
        "keeptxred";
      const res = await regenerateFeaturedImage({ data: { slug, token } });
      if (res.ok) {
        setState("done");
        setMsg("Regenerated");
      } else {
        setState("err");
        setMsg(res.error);
      }
    } catch (e) {
      setState("err");
      setMsg(e instanceof Error ? e.message : "Failed");
    }
  }
  return (
    <div className="mt-1 flex items-center gap-2">
      <button
        type="button"
        onClick={regen}
        disabled={state === "working"}
        className="text-[11px] underline text-primary disabled:opacity-50"
      >
        {state === "working" ? "Regenerating…" : "Regenerate Featured Image"}
      </button>
      {msg ? (
        <span
          className={`text-[11px] ${state === "err" ? "text-destructive" : "text-emerald-600"}`}
        >
          {msg}
        </span>
      ) : null}
    </div>
  );
}

function Stat({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "ok" | "warn" }) {
  const color = tone === "warn" ? "text-destructive" : tone === "ok" ? "text-emerald-600" : "text-foreground";
  return (
    <div className="border-2 border-foreground/10 p-4 bg-card">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`font-display text-3xl mt-1 ${color}`}>{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <h2 className="font-display text-xl mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Skel() {
  return <div className="text-sm text-muted-foreground">Loading…</div>;
}
