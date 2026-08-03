import { ExternalLink, FileText } from 'lucide-react';
import {
  groupLegislativeDocuments,
  legislativeDocumentHref,
  legislativeDocumentLabel,
  type LegislativeDocument,
} from '@/lib/bill-documents';

type BillDocumentsPanelProps = {
  documents: LegislativeDocument[];
  fallbackLinks?: Array<{ href: string; label: string }>;
};

export function BillDocumentsPanel({ documents, fallbackLinks = [] }: BillDocumentsPanelProps) {
  const groups = groupLegislativeDocuments(documents);
  const hasDocuments = groups.length > 0 || fallbackLinks.length > 0;

  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="font-bold">Official documents</h2>
      {!hasDocuments ? (
        <p className="mt-4 text-sm text-muted-foreground">No documents have been synchronized.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {groups.map((group) => {
            const latestHref = legislativeDocumentHref(group.latest);
            if (!latestHref) return null;
            return (
              <div key={group.type} className="rounded-lg border bg-background p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{group.label}</p>
                <a
                  href={latestHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-between gap-3 text-sm font-semibold hover:text-primary"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{legislativeDocumentLabel(group.latest)}</span>
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
                {group.versions.length > 1 && (
                  <details className="mt-3 border-t pt-3">
                    <summary className="cursor-pointer text-sm font-medium text-primary">
                      View {group.versions.length - 1} earlier {group.versions.length === 2 ? 'version' : 'versions'}
                    </summary>
                    <div className="mt-2 space-y-2">
                      {group.versions.slice(1).map((document) => {
                        const href = legislativeDocumentHref(document);
                        if (!href) return null;
                        return (
                          <a
                            key={document.id}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-3 rounded-md border p-2 text-sm hover:border-primary"
                          >
                            <span>{legislativeDocumentLabel(document)}</span>
                            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                          </a>
                        );
                      })}
                    </div>
                  </details>
                )}
              </div>
            );
          })}
          {groups.length === 0 && fallbackLinks.map((link) => (
            <a
              key={`${link.label}:${link.href}`}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-md border bg-background p-3 text-sm font-medium hover:border-primary"
            >
              <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />{link.label}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
