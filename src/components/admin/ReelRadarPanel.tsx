import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  addReelCandidate,
  deleteReelCandidate,
  listReelCandidates,
  setReelCandidateStatus,
  type ReelCandidate,
  type ReelStatus,
} from "@/services/reelCandidates";
import {
  ContentPackagePreview,
  buildPackage,
  type ContentPackage,
} from "@/components/admin/ContentPackagePreview";
import { generateContentPackage, type ContentAIResult } from "@/services/contentAI";

const TABS: ReelStatus[] = ["NEW", "APPROVED", "SKIPPED"];

const PLATFORMS = ["Instagram", "TikTok", "YouTube", "Facebook", "X", "Other"];

export function ReelRadarPanel() {
  const [rows, setRows] = useState<ReelCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<ReelStatus>("NEW");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      setRows(await listReelCandidates());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function changeStatus(id: string, status: ReelStatus) {
    setBusyId(id);
    try {
      await setReelCandidateStatus(id, status);
      setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this reel candidate?")) return;
    setBusyId(id);
    try {
      await deleteReelCandidate(id);
      setRows((r) => r.filter((x) => x.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  const filtered = useMemo(() => rows.filter((r) => r.status === tab), [rows, tab]);
  const counts = useMemo(() => {
    const c: Record<ReelStatus, number> = { NEW: 0, APPROVED: 0, SKIPPED: 0 };
    for (const r of rows) if (r.status in c) c[r.status as ReelStatus] += 1;
    return c;
  }, [rows]);

  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-display text-xl">Reel Radar</h2>
          <p className="text-xs text-muted-foreground">
            Manually curate social video opportunities. No scraping, no external calls.
          </p>
        </div>
        <button type="button" onClick={load} className="text-[11px] underline text-muted-foreground">
          Refresh
        </button>
      </div>

      <AddReelForm onAdded={(row) => setRows((r) => [row, ...r])} />

      <div className="mt-4 flex gap-1 border-b border-border">
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
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      {err ? <div className="text-xs text-destructive mt-3">{err}</div> : null}
      {loading ? (
        <div className="text-sm text-muted-foreground mt-3">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground mt-3">Nothing in {tab.toLowerCase()}.</div>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {filtered.map((r) => (
            <ReelRow
              key={r.id}
              row={r}
              busy={busyId === r.id}
              onApprove={() => changeStatus(r.id, "APPROVED")}
              onSkip={() => changeStatus(r.id, "SKIPPED")}
              onReopen={() => changeStatus(r.id, "NEW")}
              onDelete={() => remove(r.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function AddReelForm({ onAdded }: { onAdded: (row: ReelCandidate) => void }) {
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [account, setAccount] = useState("");
  const [url, setUrl] = useState("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      const row = await addReelCandidate({
        source_platform: platform,
        source_account: account.trim(),
        source_url: url.trim(),
        title: null,
        topic: topic.trim() || null,
        notes: notes.trim() || null,
      });
      onAdded(row);
      setAccount("");
      setUrl("");
      setTopic("");
      setNotes("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to add");
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
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Account</div>
        <input
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="@handle"
          required
          className="w-full border border-border bg-white px-2 py-1.5 text-sm"
        />
      </label>
      <label className="sm:col-span-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Reel URL</div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          required
          className="w-full border border-border bg-white px-2 py-1.5 text-sm"
        />
      </label>
      <label className="sm:col-span-2">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Topic</div>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Elections, Property Tax…"
          className="w-full border border-border bg-white px-2 py-1.5 text-sm"
        />
      </label>
      <label className="sm:col-span-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Notes</div>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Why this reel is worth adapting"
          className="w-full border border-border bg-white px-2 py-1.5 text-sm"
        />
      </label>
      <div className="sm:col-span-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="text-[11px] uppercase tracking-widest px-3 py-2 bg-primary text-primary-foreground border-2 border-primary disabled:opacity-50"
        >
          {saving ? "Adding…" : "Add Reel Candidate"}
        </button>
        {err ? <span className="text-xs text-destructive">{err}</span> : null}
      </div>
    </form>
  );
}

function ReelRow({
  row,
  busy,
  onApprove,
  onSkip,
  onReopen,
  onDelete,
}: {
  row: ReelCandidate;
  busy: boolean;
  onApprove: () => void;
  onSkip: () => void;
  onReopen: () => void;
  onDelete: () => void;
}) {
  const [pkg, setPkg] = useState<ContentPackage | null>(null);
  const [ai, setAi] = useState<ContentAIResult | undefined>();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const displayTitle = row.title || row.topic || `${row.source_account} reel`;

  async function runAI(sourceItem: {
    id: number;
    title: string;
    source: string;
    pub_date: string;
  }) {
    setAiLoading(true);
    setAiError("");
    try {
      const result = await generateContentPackage({
        headline: sourceItem.title,
        source: sourceItem.source,
        publishedAt: sourceItem.pub_date,
      });
      setAi(result);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "AI generation failed");
    } finally {
      setAiLoading(false);
    }
  }

  function startPackage() {
    const sourceItem = {
      id: numericId(row.id),
      title: displayTitle,
      source: `${row.source_platform} · ${row.source_account}`,
      pub_date: row.created_at,
    };
    setPkg(buildPackage(sourceItem));
    void runAI(sourceItem);
  }

  const sourceItem = {
    id: numericId(row.id),
    title: displayTitle,
    source: `${row.source_platform} · ${row.source_account}`,
    pub_date: row.created_at,
  };

  return (
    <Fragment>
      <li className="py-3 flex flex-col gap-1">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {row.source_platform} · {row.source_account}
              {row.topic ? <span className="text-muted-foreground"> · {row.topic}</span> : null}
            </div>
            <div className="text-sm font-medium leading-snug break-words">{displayTitle}</div>
            {row.notes ? (
              <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">{row.notes}</div>
            ) : null}
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Added {new Date(row.created_at).toLocaleString("en-US", { timeZone: "America/Chicago" })}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-end text-[11px] shrink-0">
            <a
              href={row.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary"
            >
              Open Link
            </a>
            {row.status === "NEW" ? (
              <>
                <button
                  type="button"
                  onClick={onApprove}
                  disabled={busy}
                  className="underline text-emerald-600 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={onSkip}
                  disabled={busy}
                  className="underline text-muted-foreground disabled:opacity-50"
                >
                  Skip
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onReopen}
                disabled={busy}
                className="underline text-muted-foreground disabled:opacity-50"
              >
                Move to NEW
              </button>
            )}
            {row.status === "APPROVED" ? (
              <button
                type="button"
                onClick={pkg ? () => setPkg(null) : startPackage}
                className="underline text-primary"
              >
                {pkg ? "Hide Package" : "Create Content Package"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
              className="underline text-destructive disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
        {pkg ? (
          <div className="mt-3">
            <ContentPackagePreview
              item={sourceItem}
              pkg={pkg}
              onClose={() => setPkg(null)}
              ai={ai}
              aiLoading={aiLoading}
              aiError={aiError}
              onRegenerate={() => runAI(sourceItem)}
              category={row.topic ?? "reel"}
            />
          </div>
        ) : null}
      </li>
    </Fragment>
  );
}

// Deterministic small integer derived from the UUID — SourceItem.id is number.
function numericId(uuid: string): number {
  let h = 0;
  for (let i = 0; i < uuid.length; i += 1) {
    h = (h * 31 + uuid.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}