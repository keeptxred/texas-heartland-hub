import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    let active = true;
    async function load() {
      const [{ data: f }, { data: a }] = await Promise.all([
        supabase
          .from("texas_news_feed")
          .select("id,title,source,internal_slug,pub_date")
          .order("pub_date", { ascending: false })
          .limit(50),
        supabase
          .from("daily_articles")
          .select("id,slug,title,category,is_breaking,published_at")
          .order("published_at", { ascending: false })
          .limit(50),
      ]);
      if (!active) return;
      setFeed((f ?? []) as FeedRow[]);
      setArticles((a ?? []) as ArticleRow[]);
      setLoading(false);
    }
    load();
  }, []);

  const missingSlug = feed.filter((r) => !r.internal_slug).length;
  const breaking = articles.filter((a) => a.is_breaking).length;

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
            <p className="mt-2 text-sm text-white/70">Feed ingestion, article pipeline, and system health.</p>
          </div>
          <Button variant="outline" onClick={signOut}>Sign out</Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Feed items (last 50)" value={feed.length} />
        <Stat label="Missing internal slug" value={missingSlug} tone={missingSlug > 0 ? "warn" : "ok"} />
        <Stat label="Articles (last 50)" value={articles.length} />
        <Stat label="Currently breaking" value={breaking} />
      </section>

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
                  </div>
                  <a href={`/news/${a.slug}`} className="text-sm font-medium leading-snug hover:underline">{a.title}</a>
                  <div className="text-[11px] text-muted-foreground">
                    {new Date(a.published_at).toLocaleString("en-US", { timeZone: "America/Chicago" })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>
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