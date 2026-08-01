import { useMemo, useState } from "react";
import { ExternalLink, FileText, LoaderCircle } from "lucide-react";
import {
  introducedBillTextUrl,
  isAllowedOfficialBillTextUrl,
  type OfficialBillDocument,
} from "@/lib/official-bill-text";

type Props = {
  billIdentifier: string;
  sessionCode: string;
  billType: string;
  billNumber: number;
  currentTextUrl?: string | null;
  documents: Array<{
    document_type?: string;
    document_title?: string;
    document_url?: string;
    version_label?: string;
  }>;
};

export function OfficialBillTextViewer(props: Props) {
  const options = useMemo(() => {
    const candidates: OfficialBillDocument[] = [];
    const add = (label: string, url?: string | null) => {
      if (url && isAllowedOfficialBillTextUrl(url) && !candidates.some((item) => item.url === url))
        candidates.push({ label, url });
    };
    add("Current official text", props.currentTextUrl);
    for (const document of props.documents)
      if (
        /bill\s*text|introduced|engrossed|enrolled|substitute/i.test(
          `${document.document_type} ${document.document_title} ${document.version_label}`,
        )
      )
        add(
          document.version_label || document.document_title || "Official bill text",
          document.document_url,
        );
    add(
      "Introduced version",
      introducedBillTextUrl(props.sessionCode, props.billType, props.billNumber),
    );
    return candidates;
  }, [props.billNumber, props.billType, props.currentTextUrl, props.documents, props.sessionCode]);
  const [selectedUrl, setSelectedUrl] = useState(options[0]?.url ?? "");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const load = async () => {
    if (!selectedUrl) return;
    setLoading(true);
    setError("");
    setText("");
    try {
      const response = await fetch(
        `/api/public/official-bill-text?url=${encodeURIComponent(selectedUrl)}`,
      );
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to load the official bill text.");
      setText(payload.text);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load the official bill text.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="rounded-xl border bg-card p-6" id="bill-text">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Official bill text</h2>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Read the unmodified text published by the Texas Legislature. It is fetched only when
        requested and is not rewritten by AI.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="bill-text-version">
          Bill text version
        </label>
        <select
          id="bill-text-version"
          value={selectedUrl}
          onChange={(event) => {
            setSelectedUrl(event.target.value);
            setText("");
            setError("");
          }}
          className="min-h-11 flex-1 rounded-md border bg-background px-3 py-2"
        >
          {options.map((option) => (
            <option key={option.url} value={option.url}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={load}
          disabled={loading || !selectedUrl}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-2 font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          {loading ? "Loading official text…" : "Read official text"}
        </button>
      </div>
      {error && (
        <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm">{error}</p>
          <a
            href={selectedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Open on the Texas Legislature website <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}
      {text && (
        <div className="mt-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold">{props.billIdentifier} — official source text</p>
            <a
              href={selectedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View original <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-lg border bg-background p-4 font-serif text-sm leading-7 md:p-6">
            {text}
          </pre>
        </div>
      )}
    </section>
  );
}
