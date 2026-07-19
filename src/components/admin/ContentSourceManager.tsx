import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addContentSource,
  deleteContentSource,
  listContentSources,
  updateContentSource,
  type ContentSource,
  type ContentSourceInput,
} from "@/services/contentSources";
import { listReelCandidates, type ReelCandidate } from "@/services/reelCandidates";

const PLATFORMS = ["Instagram", "Facebook", "X", "TikTok", "Website", "Other"];

type Stats = { total: number; approved: number; skipped: number; new_: number };

function keyOf(platform: string, name: string): string {
  return `${platform.trim().toLowerCase()}|${name.trim().toLowerCase().replace(/^@+/, "")}`;
}

export function ContentSourceManager() {
  const [rows, setRows] = useState<ContentSource[]>([]);
  const [reels, setReels] = useState<ReelCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editing, setEditing] = useState<ContentSource | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const [s, r] = await Promise.all([listContentSources(), listReelCandidates()]);
      setRows(s);
      setReels(r);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const statsByKey = useMemo(() => {
    const map = new Map<string, Stats>();
    for (const r of reels) {
      const k = keyOf(r.source_platform, r.source_account);
      const cur = map.get(k) ?? { total: 0, approved: 0, skipped: 0, new_: 0 };
      cur.total += 1;
      if (r.status === "APPROVED") cur.approved += 1;
      else if (r.status === "SKIPPED") cur.skipped += 1;
      else cur.new_ += 1;
      map.set(k, cur);
    }
    return map;
  }, [reels]);

  async function handleSave(input: ContentSourceInput, id?: string) {
    if (id) {
      const updated = await updateContentSource(id, input);
      setRows((rs) => rs.map((r) => (r.id === id ? updated : r)));
      setEditing(null);
    } else {
      const created = await addContentSource(input);
      setRows((rs) => [created, ...rs]);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this source?")) return;
    try {
      await deleteContentSource(id);
      setRows((rs) => rs.filter((r) => r.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-display text-xl">Content Sources</h2>
          <p className="text-xs text-muted-foreground">
            Track trusted accounts and sites. Stats pulled from Reel Radar by matching platform + source name.
          </p>
        </div>
        <button type="button" onClick={load} className="text-[11px] underline text-muted-foreground">
          Refresh
        </button>
      </div>

      <SourceForm key="new" onSubmit={(v) => handleSave(v)} submitLabel="Add Source" />

      {err ? <div className="text-xs text-destructive mt-3">{err}</div> : null}

      {loading ? (
        <div className="text-sm text-muted-foreground mt-4">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-muted-foreground mt-4">No sources yet.</div>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {rows.map((r) => {
            const stats = statsByKey.get(keyOf(r.platform, r.source_name)) ?? {
              total: 0,
              approved: 0,
              skipped: 0,
              new_: 0,
            };
            const isEditing = editing?.id === r.id;
            return (
              <li key={r.id} className="py-3">
                {isEditing ? (
                  <SourceForm
                    key={r.id}
                    initial={r}
                    onSubmit={(v) => handleSave(v, r.id)}
                    onCancel={() => setEditing(null)}
                    submitLabel="Save Changes"
                  />
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        {r.platform}
                        {r.category ? (
                          <span className="text-muted-foreground"> · {r.category}</span>
                        ) : null}
                      </div>
                      <div className="text-sm font-medium leading-snug break-words">
                        {r.source_url ? (
                          <a
                            href={r.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {r.source_name}
                          </a>
                        ) : (
                          r.source_name
                        )}
                      </div>
                      {r.notes ? (
                        <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                          {r.notes}
                        </div>
                      ) : null}
                      <div className="text-[11px] text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                        <span>
                          Added{" "}
                          {new Date(r.created_at).toLocaleDateString("en-US", {
                            timeZone: "America/Chicago",
                          })}
                        </span>
                        <span>Reel candidates: {stats.total}</span>
                        <span className="text-emerald-700">Approved: {stats.approved}</span>
                        <span>Skipped: {stats.skipped}</span>
                      </div>
                    </div>
                    <div className="flex gap-3 text-[11px] shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditing(r)}
                        className="underline text-primary"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="underline text-destructive"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SourceForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial?: ContentSource;
  onSubmit: (v: ContentSourceInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [platform, setPlatform] = useState(initial?.platform ?? PLATFORMS[0]);
  const [sourceName, setSourceName] = useState(initial?.source_name ?? "");
  const [sourceUrl, setSourceUrl] = useState(initial?.source_url ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      await onSubmit({
        platform,
        source_name: sourceName.trim(),
        source_url: sourceUrl.trim() || null,
        category: category.trim() || null,
        notes: notes.trim() || null,
      });
      if (!initial) {
        setSourceName("");
        setSourceUrl("");
        setCategory("");
        setNotes("");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-2 sm:grid-cols-6 border border-dashed border-border p-3">
      <label className="sm:col-span-1">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Platform</div>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full border border-border bg-white px-2 py-1.5 text-sm"
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </label>
      <label className="sm:col-span-2">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Source Name</div>
        <input
          type="text"
          value={sourceName}
          onChange={(e) => setSourceName(e.target.value)}
          placeholder="@accountname"
          required
          className="w-full border border-border bg-white px-2 py-1.5 text-sm"
        />
      </label>
      <label className="sm:col-span-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Source URL</div>
        <input
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="https://…"
          className="w-full border border-border bg-white px-2 py-1.5 text-sm"
        />
      </label>
      <label className="sm:col-span-2">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Category</div>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Politics, Elections…"
          className="w-full border border-border bg-white px-2 py-1.5 text-sm"
        />
      </label>
      <label className="sm:col-span-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Notes</div>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Why this source is trusted"
          className="w-full border border-border bg-white px-2 py-1.5 text-sm"
        />
      </label>
      <div className="sm:col-span-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="text-[11px] uppercase tracking-widest px-3 py-2 bg-primary text-primary-foreground border-2 border-primary disabled:opacity-50"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="text-[11px] uppercase tracking-widest px-3 py-2 border-2 border-border"
          >
            Cancel
          </button>
        ) : null}
        {err ? <span className="text-xs text-destructive">{err}</span> : null}
      </div>
    </form>
  );
}