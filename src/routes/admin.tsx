import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { regenerateFeaturedImage } from "@/lib/featured-image.functions";
import { ContentOpportunityPanel } from "@/components/admin/ContentOpportunityPanel";
import { SavedPackagesPanel } from "@/components/admin/SavedPackagesPanel";
import { BrandSettings } from "@/components/admin/BrandSettings";
import { ReelRadarPanel } from "@/components/admin/ReelRadarPanel";
import { ContentSourceManager } from "@/components/admin/ContentSourceManager";
import { PublishingQueuePanel } from "@/components/admin/PublishingQueuePanel";
import { MetaConnectionManager } from "@/components/admin/MetaConnectionManager";
import { ViralRadarPanel } from "@/components/admin/ViralRadarPanel";
import { ExploreDuplicatePanel } from "@/components/admin/ExploreDuplicatePanel";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Keep TX Red" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const STORAGE_KEY = "ktr-admin-ok";
const INGEST_VALIDATION_SOURCE_URL =
  "https://www.breitbart.com/politics/2026/07/29/report-james-talarico-drives-enterprise-rental-truck-real-texan-campaign-ad/";
const PASSCODE = (import.meta.env.VITE_ADMIN_PASSCODE as string) || "keeptxred";

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
  category: string;
  is_breaking: boolean | null;
  published_at: string;
  created_at?: string | null;
  source_name?: string | null;
  featured_image_url?: string | null;
  image_generation_status?: string | null;
};

function AdminPage() {
  const [ok, setOk] = useState(false);
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1") {
      setOk(true);
    }
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pass === PASSCODE) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      sessionStorage.setItem("ktr-admin-passcode", pass);
      setOk(true);
    } else {
      setErr("Incorrect passcode.");
    }
  }

  if (!ok) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-muted/30 px-4">
        <form onSubmit={submit} className="w-full max-w-sm border-2 border-foreground/10 bg-white p-6 space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">★ Restricted</div>
            <h1 className="font-display text-2xl mt-1">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter the admin passcode to continue.</p>
          </div>
          <Input
            type="password"
            value={pass}
            onChange={(e) => { setPass(e.target.value); setErr(""); }}
            placeholder="Passcode"
            autoFocus
          />
          {err ? <p className="text-xs text-destructive">{err}</p> : null}
          <Button type="submit" className="w-full">Unlock</Button>
        </form>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [feed, setFeed] = useState<FeedRow[]>([]);
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingestStatus, setIngestStatus] = useState<
    "running" | "verified" | "missing" | "failed"
  >("running");
  const [ingestDetail, setIngestDetail] = useState("Refreshing feeds…");

  useEffect(() => {
    let active = true;
    async function load() {
      let refreshOk = false;
      try {
        const response = await fetch("/api/public/hooks/ingest-feeds", {
          method: "POST",
          headers: { Accept: "application/json" },
        });
        const payload = (await response.json().catch(() => null)) as
          | { ok?: boolean; inserted?: number; error?: string }
          | null;
        refreshOk = response.ok && payload?.ok === true;
        if (!refreshOk) {
          setIngestStatus("failed");
          setIngestDetail(payload?.error || `Feed refresh failed (HTTP ${response.status})`);
        }
      } catch (error) {
        setIngestStatus("failed");
        setIngestDetail(error instanceof Error ? error.message : "Feed refresh failed");
      }

      const [{ data: f }, { data: a }, validationResult] = await Promise.all([
        supabase
          .from("texas_news_feed")
          .select("id,title,source,internal_slug,pub_date")
          .order("pub_date", { ascending: false })
          .limit(50),
        supabase
          .from("daily_articles")
          .select("id,slug,title,category,is_breaking,published_at,created_at,source_name,featured_image_url,image_generation_status")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("texas_news_feed")
          .select("id,title,source,pub_date")
          .eq("link", INGEST_VALIDATION_SOURCE_URL)
          .maybeSingle(),
      ]);
      if (!active) return;
      setFeed((f ?? []) as FeedRow[]);
      setArticles((a ?? []) as ArticleRow[]);
      if (validationResult.data) {
        setIngestStatus("verified");
        setIngestDetail(
          `Verified in Admin feed as item ${validationResult.data.id}: ${validationResult.data.title}`,
        );
      } else if (refreshOk) {
        setIngestStatus("missing");
        setIngestDetail(
          validationResult.error?.message ||
            "Feed refresh completed, but the requested Breitbart story is still missing.",
        );
      }
      setLoading(false);
    }
    load();
  }, []);

  const missingSlug = feed.filter((r) => !r.internal_slug).length;
  const breaking = articles.filter((a) => a.is_breaking).length;
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
        <div
          role="status"
          className={
            ingestStatus === "verified"
              ? "border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900"
              : ingestStatus === "running"
                ? "border border-blue-300 bg-blue-50 p-3 text-sm text-blue-900"
                : "border-2 border-red-400 bg-red-50 p-3 text-sm text-red-900"
          }
        >
          <strong>Native feed validation:</strong> {ingestDetail}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Feed items (last 50)" value={feed.length} />
        <Stat label="Missing internal slug" value={missingSlug} tone={missingSlug > 0 ? "warn" : "ok"} />
        <Stat label="Articles (last 50)" value={articles.length} />
        <Stat label="Currently breaking" value={breaking} />
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
              {articles.slice(0, 20).map((a) => (
                <li key={a.id} className="py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{a.category}</span>
                    {a.is_breaking ? <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Breaking</span> : null}
                    <ImageStatusBadge status={a.image_generation_status} hasImage={!!a.featured_image_url} />
                  </div>
                  <a href={`/news/${a.slug}`} className="text-sm font-medium leading-snug hover:underline">{a.title}</a>
                  <div className="text-[11px] text-muted-foreground">
                    {new Date(a.published_at).toLocaleString("en-US", { timeZone: "America/Chicago" })}
                  </div>
                  <RegenerateImageButton slug={a.slug} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
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
