import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteQueueEntry,
  listQueueEntries,
  setQueueStatus,
  type QueueEntry,
  type QueueStatus,
} from "@/services/publishingQueue";
import { listContentPackages, type SavedPackage } from "@/services/contentPackages";
import { publishToFacebook, publishToInstagram, type PublishResult } from "@/services/metaPublisher";

type TabKey = QueueStatus | "READY_TO_POST";
const TABS: TabKey[] = ["DRAFT", "READY", "READY_TO_POST", "PUBLISHED", "ARCHIVED"];
const TAB_LABEL: Record<TabKey, string> = {
  DRAFT: "DRAFT",
  READY: "READY",
  READY_TO_POST: "READY TO POST",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
};

function buildFacebookCaption(p: SavedPackage): string {
  return [p.facebook_hook, p.facebook_body, p.facebook_cta, p.facebook_hashtags]
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

function buildInstagramCaption(p: SavedPackage): string {
  return [p.instagram_hook, p.instagram_caption, p.instagram_hashtags]
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

async function copyText(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text);
    alert(`${label} copied.`);
  } catch {
    alert("Copy failed. Select and copy manually.");
  }
}

export function PublishingQueuePanel({
  onOpenPackage,
}: {
  onOpenPackage?: (packageId: string) => void;
}) {
  const [rows, setRows] = useState<QueueEntry[]>([]);
  const [packages, setPackages] = useState<Record<string, SavedPackage>>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<TabKey>("DRAFT");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const [entries, pkgs] = await Promise.all([listQueueEntries(), listContentPackages()]);
      setRows(entries);
      const map: Record<string, SavedPackage> = {};
      for (const p of pkgs) map[p.id] = p;
      setPackages(map);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const listener = () => void load();
    window.addEventListener("ktr-publishing-queue-updated", listener);
    void load();
    return () => window.removeEventListener("ktr-publishing-queue-updated", listener);
  }, [load]);

  async function change(id: string, status: QueueStatus) {
    setBusyId(id);
    try {
      await setQueueStatus(id, status);
      setRows((r) =>
        r.map((x) =>
          x.id === id
            ? {
                ...x,
                status,
                published_time:
                  status === "PUBLISHED" ? new Date().toISOString() : x.published_time,
              }
            : x,
        ),
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this queue entry?")) return;
    setBusyId(id);
    try {
      await deleteQueueEntry(id);
      setRows((r) => r.filter((x) => x.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  const filtered = useMemo(
    () => rows.filter((r) => (tab === "READY_TO_POST" ? r.status === "READY" : r.status === tab)),
    [rows, tab],
  );
  const counts = useMemo(() => {
    const c: Record<TabKey, number> = {
      DRAFT: 0,
      READY: 0,
      READY_TO_POST: 0,
      PUBLISHED: 0,
      ARCHIVED: 0,
    };
    for (const r of rows) {
      c[r.status] += 1;
      if (r.status === "READY") c.READY_TO_POST += 1;
    }
    return c;
  }, [rows]);

  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-display text-xl">Publishing Queue</h2>
          <p className="text-xs text-muted-foreground">
            Approved content packages staged for publishing. No external calls yet.
          </p>
        </div>
        <button type="button" onClick={load} className="text-[11px] underline text-muted-foreground">
          Refresh
        </button>
      </div>

      <div className="flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`text-[11px] uppercase tracking-widest px-3 py-2 border-b-2 ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {TAB_LABEL[t]} ({counts[t]})
          </button>
        ))}
      </div>

      {err ? <div className="text-xs text-destructive mt-3">{err}</div> : null}
      {loading ? (
        <div className="text-sm text-muted-foreground mt-3">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground mt-3">
          Nothing in {TAB_LABEL[tab].toLowerCase()}.
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {filtered.map((r) => {
            const pkg = packages[r.content_package_id];
            const isReady = r.status === "READY";
            const platform = r.platform.toLowerCase();
            const isFacebook = platform.includes("facebook");
            const isInstagram = platform.includes("instagram");
            const fbCaption = pkg ? buildFacebookCaption(pkg) : "";
            const igCaption = pkg ? buildInstagramCaption(pkg) : "";
            const hashtags = isInstagram ? pkg?.instagram_hashtags : pkg?.facebook_hashtags;
            const previewCaption = isInstagram ? igCaption : isFacebook ? fbCaption : fbCaption || igCaption;
            return (
            <li key={r.id} className="py-3 flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {r.platform}
                  {r.category ? <span className="text-muted-foreground"> · {r.category}</span> : null}
                </div>
                <div className="text-sm font-medium leading-snug break-words">
                  {r.source_title ?? "(untitled package)"}
                </div>
                {r.notes ? (
                  <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">{r.notes}</div>
                ) : null}
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Created{" "}
                  {new Date(r.created_at).toLocaleString("en-US", { timeZone: "America/Chicago" })}
                  {r.published_time ? (
                    <>
                      {" · Published "}
                      {new Date(r.published_time).toLocaleString("en-US", { timeZone: "America/Chicago" })}
                    </>
                  ) : null}
                </div>

                {isReady ? (
                  <div className="mt-3 border border-border/70 bg-muted/30 p-3 text-[12px] space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Content Preview
                    </div>
                    {previewCaption ? (
                      <div className="whitespace-pre-wrap leading-snug">{previewCaption}</div>
                    ) : (
                      <div className="text-muted-foreground italic">No caption on this package.</div>
                    )}
                    {hashtags ? (
                      <div className="text-[11px] text-primary break-words">{hashtags}</div>
                    ) : null}
                    <div className="text-[11px] text-muted-foreground">
                      Assets: no image or reel attached to this package.
                    </div>
                    {pkg?.asset_url ? (
                      <div className="mt-2 border border-border/60 bg-white p-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                          Attached {pkg.asset_type}
                        </div>
                        {pkg.asset_type === "IMAGE" ? (
                          <img src={pkg.asset_url} alt="asset preview" className="max-h-40 border border-border" />
                        ) : (
                          <a href={pkg.asset_url} target="_blank" rel="noreferrer" className="text-[11px] underline text-primary">
                            {pkg.asset_url}
                          </a>
                        )}
                        {pkg.asset_source_account ? (
                          <div className="text-[11px] text-muted-foreground mt-1">Source: {pkg.asset_source_account}</div>
                        ) : null}
                      </div>
                    ) : null}
                    <div className="flex flex-wrap gap-3 pt-1 text-[11px]">
                      {isFacebook || !isInstagram ? (
                        <>
                          <button
                            type="button"
                            onClick={() => copyText(fbCaption, "Facebook caption")}
                            disabled={!fbCaption}
                            className="underline text-primary disabled:opacity-40"
                          >
                            Copy Facebook Caption
                          </button>
                          <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-primary"
                          >
                            Open Facebook
                          </a>
                          <PublishButton
                            label="Post to Facebook"
                            onPublish={async () => {
                              const res = await publishToFacebook({ package_id: r.content_package_id, queue_id: r.id });
                              if (res.ok) await change(r.id, "PUBLISHED");
                              return res;
                            }}
                          />
                        </>
                      ) : null}
                      {isInstagram || !isFacebook ? (
                        <>
                          <button
                            type="button"
                            onClick={() => copyText(igCaption, "Instagram caption")}
                            disabled={!igCaption}
                            className="underline text-primary disabled:opacity-40"
                          >
                            Copy Instagram Caption
                          </button>
                          <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-primary"
                          >
                            Open Instagram
                          </a>
                          <PublishButton
                            label="Post to Instagram"
                            onPublish={async () => {
                              const res = await publishToInstagram({ package_id: r.content_package_id, queue_id: r.id });
                              if (res.ok) await change(r.id, "PUBLISHED");
                              return res;
                            }}
                          />
                        </>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => alert("No image attached to this package yet.")}
                        className="underline text-muted-foreground"
                      >
                        Download Available Image
                      </button>
                      <button
                        type="button"
                        onClick={() => alert("No reel assets attached to this package yet.")}
                        className="underline text-muted-foreground"
                      >
                        Download Available Reel Assets
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3 justify-end text-[11px] shrink-0">
                {onOpenPackage ? (
                  <button
                    type="button"
                    onClick={() => onOpenPackage(r.content_package_id)}
                    className="underline text-primary"
                  >
                    Open Package
                  </button>
                ) : null}
                {r.status !== "READY" && r.status !== "PUBLISHED" ? (
                  <button
                    type="button"
                    onClick={() => change(r.id, "READY")}
                    disabled={busyId === r.id}
                    className="underline text-emerald-700 disabled:opacity-50"
                  >
                    Move to Ready
                  </button>
                ) : null}
                {isReady ? (
                  <button
                    type="button"
                    onClick={() => change(r.id, "DRAFT")}
                    disabled={busyId === r.id}
                    className="underline text-muted-foreground disabled:opacity-50"
                  >
                    Return to Draft
                  </button>
                ) : null}
                {r.status !== "PUBLISHED" ? (
                  <button
                    type="button"
                    onClick={() => change(r.id, "PUBLISHED")}
                    disabled={busyId === r.id}
                    className="underline text-primary disabled:opacity-50"
                  >
                    Mark Published
                  </button>
                ) : null}
                {r.status !== "ARCHIVED" ? (
                  <button
                    type="button"
                    onClick={() => change(r.id, "ARCHIVED")}
                    disabled={busyId === r.id}
                    className="underline text-muted-foreground disabled:opacity-50"
                  >
                    Archive
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => change(r.id, "DRAFT")}
                    disabled={busyId === r.id}
                    className="underline text-muted-foreground disabled:opacity-50"
                  >
                    Restore
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(r.id)}
                  disabled={busyId === r.id}
                  className="underline text-destructive disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function PublishButton({
  label,
  onPublish,
}: {
  label: string;
  onPublish: () => Promise<PublishResult>;
}) {
  const [state, setState] = useState<"idle" | "working" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");
  async function run() {
    setState("working");
    setMsg("");
    try {
      const res = await onPublish();
      if (res.ok) { setState("ok"); setMsg("Posted"); }
      else { setState("err"); setMsg(res.error); }
    } catch (e) {
      setState("err");
      setMsg(e instanceof Error ? e.message : "Failed");
    }
  }
  return (
    <span className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={run}
        disabled={state === "working"}
        className="underline text-primary font-bold disabled:opacity-50"
      >
        {state === "working" ? "Posting…" : label}
      </button>
      {msg ? (
        <span className={state === "err" ? "text-destructive" : "text-emerald-700"}>{msg}</span>
      ) : null}
    </span>
  );
}