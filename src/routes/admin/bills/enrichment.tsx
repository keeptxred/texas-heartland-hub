import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  listBillEditorialCandidates,
  listBillEditorialEnrichments,
  saveBillEditorialEnrichment,
} from '@/services/billEditorialEnrichment.functions';

export const Route = createFileRoute('/admin/bills/enrichment')({
  head: () => ({
    meta: [
      { title: 'Bill Editorial Enrichment — Keep TX Red' },
      { name: 'robots', content: 'noindex,follow' },
    ],
  }),
  component: Page,
});

const PASSCODE = (import.meta.env.VITE_ADMIN_PASSCODE as string | undefined)?.trim() ?? '';
const STORAGE_KEY = 'ktr-admin-ok';

function Page() {
  const [ok, setOk] = useState(false);
  const [pass, setPass] = useState('');

  useEffect(() => {
    if (PASSCODE && sessionStorage.getItem(STORAGE_KEY) === '1') setOk(true);
  }, []);

  if (!ok) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <form
          className="w-full max-w-sm space-y-4 border p-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (PASSCODE && pass === PASSCODE) {
              sessionStorage.setItem(STORAGE_KEY, '1');
              sessionStorage.setItem('ktr-admin-passcode', pass);
              setOk(true);
            }
          }}
        >
          <h1 className="text-2xl font-bold">Bill Editorial Enrichment</h1>
          {!PASSCODE && (
            <p className="text-sm text-destructive">
              Admin access is unavailable because the required passcode is not configured.
            </p>
          )}
          <Input
            type="password"
            value={pass}
            onChange={(event) => setPass(event.target.value)}
            placeholder="Passcode"
            disabled={!PASSCODE}
          />
          <Button className="w-full" disabled={!PASSCODE}>Unlock</Button>
        </form>
      </div>
    );
  }

  return <Dashboard />;
}

function Dashboard() {
  const token = sessionStorage.getItem('ktr-admin-passcode') || '';
  const [mode, setMode] = useState<
    'candidates' | 'draft' | 'pending' | 'approved' | 'rejected'
  >('candidates');
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setMessage('');
    const result =
      mode === 'candidates'
        ? await listBillEditorialCandidates({ data: { token, limit: 50 } })
        : await listBillEditorialEnrichments({
            data: { token, status: mode, limit: 50 },
          });
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    setItems(result.items);
  }, [mode, token]);

  useEffect(() => {
    void load();
  }, [load]);

  function edit(item: any) {
    const bill = item.bills || item;
    setSelected({ ...item, bill });
    setForm({
      plainLanguageSummary: item.plain_language_summary || '',
      whatChanges: item.what_changes || '',
      whoIsAffected: item.who_is_affected || '',
      effectiveDateExplanation: item.effective_date_explanation || '',
      limitations: item.limitations || '',
      sourceNotes: item.source_notes || '',
      sourceDocumentIds: item.source_document_ids || [],
      sourceUrls: item.source_urls || [],
      confidence: item.confidence ?? 0.8,
    });
  }

  async function save(
    status: 'draft' | 'pending' | 'approved' | 'rejected',
  ) {
    const bill = selected.bill;
    const result = await saveBillEditorialEnrichment({
      data: {
        token,
        billId: bill.id,
        ...form,
        sourceDocumentIds: form.sourceDocumentIds || [],
        sourceUrls: form.sourceUrls || [],
        generationMethod: 'manual',
        reviewStatus: status,
      },
    });
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    setMessage(`Saved as ${status}.`);
    setSelected(null);
    await load();
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-4 border-primary bg-secondary text-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <a href="/admin" className="text-sm hover:underline">
            ← Editorial Dashboard
          </a>
          <h1 className="mt-3 text-4xl font-bold">
            Bill Editorial Enrichment
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Draft and approve sourced explanations. Official facts remain
            separate from KeepTXRed editorial text.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap gap-2">
          {(
            [
              'candidates',
              'draft',
              'pending',
              'approved',
              'rejected',
            ] as const
          ).map((value) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={`rounded-full border px-4 py-2 text-sm capitalize ${mode === value ? 'bg-primary text-white' : ''}`}
            >
              {value}
            </button>
          ))}
        </div>

        {message && <p className="mt-4 border p-3 text-sm">{message}</p>}

        <div className="mt-6 grid gap-4">
          {items.map((item: any) => {
            const bill = item.bills || item;
            return (
              <article key={bill.id} className="rounded-xl border p-5">
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      {bill.bill_identifier}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {bill.caption}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {(bill.bill_documents || []).length} official documents
                      available
                    </p>
                  </div>
                  <Button onClick={() => edit(item)}>Open</Button>
                </div>
              </article>
            );
          })}
        </div>

        {selected && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
            <div className="mx-auto max-w-3xl space-y-4 bg-white p-6">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selected.bill.bill_identifier}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selected.bill.caption}
                  </p>
                </div>
                <button onClick={() => setSelected(null)}>Close</button>
              </div>

              {[
                ['plainLanguageSummary', 'Plain-language summary'],
                ['whatChanges', 'What changes'],
                ['whoIsAffected', 'Who is affected'],
                ['effectiveDateExplanation', 'Effective-date explanation'],
                ['limitations', 'Limitations / uncertainty'],
                ['sourceNotes', 'Source notes'],
              ].map(([key, label]) => (
                <label key={key} className="block">
                  <span className="mb-1 block font-semibold">{label}</span>
                  <textarea
                    className="min-h-28 w-full rounded-md border p-3"
                    value={form[key] || ''}
                    onChange={(event) =>
                      setForm({ ...form, [key]: event.target.value })
                    }
                  />
                </label>
              ))}

              <div>
                <p className="font-semibold">Official source documents</p>
                <div className="mt-2 space-y-2">
                  {(selected.bill.bill_documents || []).map((document: any) => (
                    <label key={document.id} className="flex gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={(form.sourceDocumentIds || []).includes(
                          document.id,
                        )}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            sourceDocumentIds: event.target.checked
                              ? [...(form.sourceDocumentIds || []), document.id]
                              : (form.sourceDocumentIds || []).filter(
                                  (id: string) => id !== document.id,
                                ),
                          })
                        }
                      />
                      <a
                        href={document.document_url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {document.document_title}
                      </a>
                    </label>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="mb-1 block font-semibold">
                  Official source URLs
                </span>
                <span className="mb-2 block text-sm text-muted-foreground">
                  Enter one official government or legislative source URL per
                  line.
                </span>
                <textarea
                  className="min-h-28 w-full rounded-md border p-3"
                  value={(form.sourceUrls || []).join('\n')}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      sourceUrls: event.target.value
                        .split(/\r?\n/)
                        .map((url: string) => url.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="https://capitol.texas.gov/…"
                />
              </label>

              <p className="text-sm text-muted-foreground">
                Approval requires at least one selected official document or
                valid official source URL.
              </p>

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => save('draft')} variant="outline">
                  Save draft
                </Button>
                <Button onClick={() => save('pending')} variant="outline">
                  Send to review
                </Button>
                <Button onClick={() => save('approved')}>Approve</Button>
                <Button
                  onClick={() => save('rejected')}
                  variant="destructive"
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
