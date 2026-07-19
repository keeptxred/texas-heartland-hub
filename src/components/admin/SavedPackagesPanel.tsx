import { Fragment, useCallback, useEffect, useState } from "react";
import {
  listContentPackages,
  deleteContentPackage,
  updateContentPackageAsset,
  setContentPackageWorkflow,
  type SavedPackage,
} from "@/services/contentPackages";
import { MediaPackageBuilder } from "./media-package/MediaPackageBuilder";
import { addQueueEntry } from "@/services/publishingQueue";
import { publishToFacebook, publishToInstagram } from "@/services/metaPublisher";

export function SavedPackagesPanel() {
  const [rows, setRows] = useState<SavedPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      setRows(await listContentPackages());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(id: string) {
    if (!confirm("Delete this saved package?")) return;
    try {
      await deleteContentPackage(id);
      setRows((r) => r.filter((x) => x.id !== id));
      if (openId === id) setOpenId(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-xl">Saved Packages</h2>
        <button type="button" onClick={load} className="text-[11px] underline text-muted-foreground">
          Refresh
        </button>
      </div>
      {err ? <div className="text-xs text-destructive mb-2">{err}</div> : null}
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-muted-foreground">No saved packages yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="py-2 pr-2">Title</th>
                <th className="py-2 pr-2">Category</th>
                <th className="py-2 pr-2">Created</th>
                <th className="py-2 pr-2">Workflow</th>
                <th className="py-2 pr-2">Asset</th>
                <th className="py-2 pr-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const open = openId === r.id;
                return (
                  <Fragment key={r.id}>
                    <tr className="border-b border-border/50 align-top">
                      <td className="py-2 pr-2 max-w-[24rem]">
                        <div className="font-medium leading-snug truncate">{r.source_title}</div>
                      </td>
                      <td className="py-2 pr-2 text-[11px] text-muted-foreground">{r.category ?? "—"}</td>
                      <td className="py-2 pr-2 text-[11px] text-muted-foreground whitespace-nowrap">
                        {new Date(r.created_at).toLocaleString("en-US", { timeZone: "America/Chicago" })}
                      </td>
                      <td className="py-2 pr-2"><WorkflowBadge status={r.workflow_status} /></td>
                      <td className="py-2 pr-2 text-[11px] text-muted-foreground">
                        {r.asset_type ? `${r.asset_type}` : "—"}
                      </td>
                      <td className="py-2 pr-2 whitespace-nowrap">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setOpenId(open ? null : r.id)}
                            className="text-[11px] underline text-primary"
                          >
                            {open ? "Close" : "Open"}
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(r.id)}
                            className="text-[11px] underline text-destructive"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    {open ? (
                      <tr>
                        <td colSpan={6} className="pb-4">
                          <PackageDetail row={r} onChanged={load} />
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function WorkflowBadge({ status }: { status: SavedPackage["workflow_status"] }) {
  const map: Record<string, string> = {
    DRAFT: "bg-neutral-200 text-neutral-800",
    ASSET_READY: "bg-amber-100 text-amber-800",
    READY_TO_POST: "bg-emerald-100 text-emerald-800",
    PUBLISHED: "bg-primary/10 text-primary",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${map[status] ?? map.DRAFT}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function PackageDetail({ row, onChanged }: { row: SavedPackage; onChanged: () => void }) {
  return (
    <div className="border border-border bg-white p-4 space-y-3 text-sm">
      <WorkflowActions row={row} onChanged={onChanged} />
      <AssetAttachForm row={row} onChanged={onChanged} />
      <AddToQueue packageId={row.id} />
      <MediaPackageBuilder row={row} />
      <Section title="Facebook">
        <Line label="Hook" value={row.facebook_hook} />
        <Line label="Body" value={row.facebook_body} multiline />
        <Line label="CTA" value={row.facebook_cta} />
        <Line label="Hashtags" value={row.facebook_hashtags} />
      </Section>
      <Section title="Instagram">
        <Line label="Hook" value={row.instagram_hook} />
        <Line label="Script" value={row.instagram_script} multiline />
        <Line label="Caption" value={row.instagram_caption} multiline />
        <Line label="Hashtags" value={row.instagram_hashtags} />
      </Section>
      <Section title="SEO">
        <Line label="Title" value={row.seo_title} />
        <Line label="Meta Description" value={row.seo_description} multiline />
        <Line label="Keywords" value={row.seo_keywords} />
      </Section>
    </div>
  );
}

function WorkflowActions({ row, onChanged }: { row: SavedPackage; onChanged: () => void }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function approve() {
    setBusy(true); setMsg("");
    try {
      await setContentPackageWorkflow(row.id, "READY_TO_POST");
      setMsg("Approved — ready to post");
      onChanged();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally { setBusy(false); }
  }

  async function publish(platform: "facebook" | "instagram") {
    setBusy(true); setMsg("");
    try {
      const fn = platform === "facebook" ? publishToFacebook : publishToInstagram;
      const res = await fn({ package_id: row.id });
      if (res.ok) {
        await setContentPackageWorkflow(row.id, "PUBLISHED");
        setMsg(`Posted to ${platform}`);
        onChanged();
      } else {
        setMsg(res.error);
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally { setBusy(false); }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border border-dashed border-border p-3 text-[11px]">
      <span className="font-bold uppercase tracking-widest text-muted-foreground">Workflow:</span>
      <WorkflowBadge status={row.workflow_status} />
      {row.workflow_status !== "READY_TO_POST" && row.workflow_status !== "PUBLISHED" ? (
        <button type="button" onClick={approve} disabled={busy} className="underline text-emerald-700 disabled:opacity-50">
          Approve (Ready to Post)
        </button>
      ) : null}
      {row.workflow_status !== "DRAFT" ? (
        <button
          type="button"
          onClick={async () => { setBusy(true); await setContentPackageWorkflow(row.id, "DRAFT").catch(() => {}); onChanged(); setBusy(false); }}
          disabled={busy}
          className="underline text-muted-foreground disabled:opacity-50"
        >
          Return to Draft
        </button>
      ) : null}
      <button type="button" onClick={() => publish("facebook")} disabled={busy} className="underline text-primary disabled:opacity-50">
        Post to Facebook
      </button>
      <button type="button" onClick={() => publish("instagram")} disabled={busy} className="underline text-primary disabled:opacity-50">
        Post to Instagram
      </button>
      {msg ? <span className="text-muted-foreground">{msg}</span> : null}
    </div>
  );
}

function AssetAttachForm({ row, onChanged }: { row: SavedPackage; onChanged: () => void }) {
  const [type, setType] = useState<"IMAGE" | "REEL">(row.asset_type ?? "IMAGE");
  const [url, setUrl] = useState(row.asset_url ?? "");
  const [account, setAccount] = useState(row.asset_source_account ?? "");
  const [notes, setNotes] = useState(row.asset_notes ?? "");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("saving"); setErr("");
    try {
      await updateContentPackageAsset({
        id: row.id,
        asset_type: type,
        asset_url: url.trim() || null,
        asset_source_account: account.trim() || null,
        asset_notes: notes.trim() || null,
      });
      setState("saved");
      onChanged();
      setTimeout(() => setState("idle"), 1500);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
      setState("error");
    }
  }

  return (
    <form onSubmit={submit} className="border border-dashed border-border p-3 space-y-2">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Attach Social Asset</div>
      <div className="flex flex-wrap gap-2 items-end">
        <label>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Type</div>
          <select value={type} onChange={(e) => setType(e.target.value as "IMAGE" | "REEL")} className="border border-border bg-white px-2 py-1.5 text-sm">
            <option value="IMAGE">Image</option>
            <option value="REEL">Reel</option>
          </select>
        </label>
        <label className="flex-1 min-w-[16rem]">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{type === "IMAGE" ? "Image URL" : "Reel URL"}</div>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className="w-full border border-border bg-white px-2 py-1.5 text-sm" />
        </label>
        {type === "REEL" ? (
          <label className="min-w-[10rem]">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Source Account</div>
            <input type="text" value={account} onChange={(e) => setAccount(e.target.value)} placeholder="@handle" className="w-full border border-border bg-white px-2 py-1.5 text-sm" />
          </label>
        ) : null}
        <label className="flex-1 min-w-[14rem]">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Notes</div>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="w-full border border-border bg-white px-2 py-1.5 text-sm" />
        </label>
        <button type="submit" disabled={state === "saving"} className="text-[11px] uppercase tracking-widest px-3 py-2 bg-primary text-primary-foreground border-2 border-primary disabled:opacity-50">
          {state === "saving" ? "Saving…" : state === "saved" ? "Saved ✓" : "Attach Asset"}
        </button>
        {err ? <span className="text-xs text-destructive">{err}</span> : null}
      </div>
      {row.asset_url && row.asset_type === "IMAGE" ? (
        <img src={row.asset_url} alt="attached asset preview" className="mt-2 max-h-40 border border-border" />
      ) : row.asset_url && row.asset_type === "REEL" ? (
        <a href={row.asset_url} target="_blank" rel="noreferrer" className="text-[11px] underline text-primary block mt-1">Open reel ↗</a>
      ) : null}
    </form>
  );
}

const QUEUE_PLATFORMS = ["Facebook", "Instagram", "X", "TikTok", "Other"];

function AddToQueue({ packageId }: { packageId: string }) {
  const [platform, setPlatform] = useState(QUEUE_PLATFORMS[0]);
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    setErr("");
    try {
      await addQueueEntry({ content_package_id: packageId, platform, notes: notes.trim() || null });
      setState("saved");
      setNotes("");
      window.dispatchEvent(new CustomEvent("ktr-publishing-queue-updated"));
      setTimeout(() => setState("idle"), 1500);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to queue");
      setState("error");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2 border border-dashed border-border p-3">
      <label>
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Platform</div>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="border border-border bg-white px-2 py-1.5 text-sm"
        >
          {QUEUE_PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </label>
      <label className="flex-1 min-w-[16rem]">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Notes</div>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional publishing note"
          className="w-full border border-border bg-white px-2 py-1.5 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={state === "saving"}
        className="text-[11px] uppercase tracking-widest px-3 py-2 bg-primary text-primary-foreground border-2 border-primary disabled:opacity-50"
      >
        {state === "saving" ? "Queuing…" : state === "saved" ? "Queued ✓" : "Add to Publishing Queue"}
      </button>
      {err ? <span className="text-xs text-destructive">{err}</span> : null}
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border p-3 space-y-2">
      <h3 className="font-display text-sm uppercase tracking-widest">{title}</h3>
      {children}
    </div>
  );
}

function Line({ label, value, multiline = false }: { label: string; value: string | null; multiline?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      {multiline ? (
        <pre className="text-sm whitespace-pre-wrap font-sans mt-0.5">{value ?? ""}</pre>
      ) : (
        <div className="text-sm mt-0.5">{value ?? ""}</div>
      )}
    </div>
  );
}