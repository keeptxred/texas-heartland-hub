import { useCallback, useEffect, useState } from "react";
import {
  listContentPackages,
  deleteContentPackage,
  type SavedPackage,
} from "@/services/contentPackages";

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
                <th className="py-2 pr-2">Status</th>
                <th className="py-2 pr-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const open = openId === r.id;
                return (
                  <>
                    <tr key={r.id} className="border-b border-border/50 align-top">
                      <td className="py-2 pr-2 max-w-[24rem]">
                        <div className="font-medium leading-snug truncate">{r.source_title}</div>
                      </td>
                      <td className="py-2 pr-2 text-[11px] text-muted-foreground">{r.category ?? "—"}</td>
                      <td className="py-2 pr-2 text-[11px] text-muted-foreground whitespace-nowrap">
                        {new Date(r.created_at).toLocaleString("en-US", { timeZone: "America/Chicago" })}
                      </td>
                      <td className="py-2 pr-2 text-[11px] font-bold uppercase tracking-widest text-primary">
                        {r.status}
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
                      <tr key={`${r.id}-detail`}>
                        <td colSpan={5} className="pb-4">
                          <PackageDetail row={r} />
                        </td>
                      </tr>
                    ) : null}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PackageDetail({ row }: { row: SavedPackage }) {
  return (
    <div className="border border-border bg-white p-4 space-y-3 text-sm">
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