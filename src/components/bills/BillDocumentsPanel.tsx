import { ExternalLink, FileText } from 'lucide-react';
import {
  groupLegislativeDocuments,
  isLegislativeAmendmentPrinting,
  legislativeDocumentHref,
  legislativeDocumentLabel,
  type LegislativeDocument,
} from '@/lib/bill-documents';
import { getLatestBillAnalysisSummary } from '@/lib/bill-analysis-summary';
import { getLatestBillFiscalImpact } from '@/lib/bill-fiscal-impact';
import { getLatestBillWitnessSummary } from '@/lib/bill-witness-summary';

type BillDocumentsPanelProps = {
  documents: LegislativeDocument[];
  fallbackLinks?: Array<{ href: string; label: string }>;
};

export function BillDocumentsPanel({ documents, fallbackLinks = [] }: BillDocumentsPanelProps) {
  const groups = groupLegislativeDocuments(documents);
  const analysisSummary = getLatestBillAnalysisSummary(documents);
  const fiscalImpact = getLatestBillFiscalImpact(documents);
  const witnessSummary = getLatestBillWitnessSummary(documents);
  const hasDocuments = groups.length > 0 || fallbackLinks.length > 0;

  return (
    <section id="documents" className="scroll-mt-24 rounded-xl border bg-card p-5">
      <h2 className="font-bold">Official documents</h2>
      {analysisSummary ? (
        <div className="mt-4 rounded-lg border bg-muted/30 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Committee analysis at a glance</p>
          <p className="mt-1 text-xs text-muted-foreground">{analysisSummary.label}</p>
          {analysisSummary.backgroundAndPurpose ? <p className="mt-3 text-sm leading-relaxed">{analysisSummary.backgroundAndPurpose}</p> : null}
          {analysisSummary.rulemakingAuthority ? (
            <p className="mt-3 text-sm leading-relaxed"><strong>Rulemaking authority:</strong> {analysisSummary.rulemakingAuthority}</p>
          ) : null}
          {analysisSummary.criminalJusticeImpact ? (
            <p className="mt-3 text-sm leading-relaxed"><strong>Criminal justice impact:</strong> {analysisSummary.criminalJusticeImpact}</p>
          ) : null}
          {analysisSummary.committeeAmendments ? (
            <details className="mt-3 border-t pt-3">
              <summary className="cursor-pointer text-sm font-medium text-primary">Committee amendments or substitute comparison</summary>
              <p className="mt-2 text-sm leading-relaxed">{analysisSummary.committeeAmendments}</p>
            </details>
          ) : null}
          <p className="mt-3 text-xs text-muted-foreground">This summary is extracted from the official committee analysis and does not replace the complete document.</p>
        </div>
      ) : null}
      {fiscalImpact ? (
        <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Fiscal impact at a glance</p>
          <p className="mt-1 text-xs text-muted-foreground">{fiscalImpact.label}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            {fiscalImpact.noStateFiscalImplication ? <span className="rounded-full border bg-background px-2.5 py-1">No state fiscal implication anticipated</span> : null}
            {fiscalImpact.noLocalFiscalImplication ? <span className="rounded-full border bg-background px-2.5 py-1">No local fiscal implication anticipated</span> : null}
          </div>
          {fiscalImpact.summary ? <p className="mt-3 text-sm leading-relaxed">{fiscalImpact.summary}</p> : null}
          {fiscalImpact.localGovernmentImpact && fiscalImpact.localGovernmentImpact !== fiscalImpact.summary ? (
            <p className="mt-3 text-sm leading-relaxed"><strong>Local government:</strong> {fiscalImpact.localGovernmentImpact}</p>
          ) : null}
          {fiscalImpact.monetaryAmounts.length ? (
            <p className="mt-3 text-sm"><strong>Amounts cited:</strong> {fiscalImpact.monetaryAmounts.join(', ')}</p>
          ) : null}
          {fiscalImpact.sourceAgencies ? (
            <p className="mt-3 text-xs text-muted-foreground"><strong>Source agencies:</strong> {fiscalImpact.sourceAgencies}</p>
          ) : null}
          <p className="mt-3 text-xs text-muted-foreground">This summary is extracted from the official fiscal note and does not replace the complete document.</p>
        </div>
      ) : null}
      {witnessSummary ? (
        <div className="mt-4 rounded-lg border bg-background p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Committee witness record</p>
          <p className="mt-1 text-xs text-muted-foreground">{[witnessSummary.committee, witnessSummary.hearingDate].filter(Boolean).join(' · ') || witnessSummary.label}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full border px-2.5 py-1">{witnessSummary.total} recorded</span>
            {witnessSummary.forCount ? <span className="rounded-full border px-2.5 py-1">{witnessSummary.forCount} for</span> : null}
            {witnessSummary.againstCount ? <span className="rounded-full border px-2.5 py-1">{witnessSummary.againstCount} against</span> : null}
            {witnessSummary.onCount ? <span className="rounded-full border px-2.5 py-1">{witnessSummary.onCount} on</span> : null}
            {witnessSummary.testifyingCount ? <span className="rounded-full border px-2.5 py-1">{witnessSummary.testifyingCount} testifying</span> : null}
            {witnessSummary.registeringCount ? <span className="rounded-full border px-2.5 py-1">{witnessSummary.registeringCount} registering only</span> : null}
          </div>
          {witnessSummary.witnesses.length ? (
            <details className="mt-3 border-t pt-3">
              <summary className="cursor-pointer text-sm font-medium text-primary">View official witness roster</summary>
              <ul className="mt-3 space-y-2 text-sm">
                {witnessSummary.witnesses.slice(0, 50).map((witness, index) => (
                  <li key={`${witness.name}:${index}`} className="rounded-md border p-2">
                    <strong>{witness.name}</strong>
                    {witness.organization ? <span className="text-muted-foreground"> · {witness.organization}</span> : null}
                    <span className="mt-1 block text-xs uppercase tracking-wide text-muted-foreground">{witness.position}{witness.testimonyType ? ` · ${witness.testimonyType}` : ''}</span>
                  </li>
                ))}
              </ul>
              {witnessSummary.witnesses.length > 50 ? <p className="mt-3 text-xs text-muted-foreground">Showing the first 50 records. Open the official witness list below for the complete roster.</p> : null}
            </details>
          ) : null}
          <p className="mt-3 text-xs text-muted-foreground">Positions and testimony types are reproduced from the official witness list. Registration does not establish the committee vote or final outcome.</p>
        </div>
      ) : null}
      {!hasDocuments ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No public bill documents are attached to this record yet. The official source link below may contain newer material while synchronization catches up.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {groups.map((group) => {
            const latestHref = legislativeDocumentHref(group.latest);
            if (!latestHref) return null;
            const earlierVersions = group.versions.slice(1);
            const amendmentCount = earlierVersions.filter(isLegislativeAmendmentPrinting).length;
            return (
              <div key={group.type} className="rounded-lg border bg-background p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{group.label}</p>
                <a href={latestHref} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center justify-between gap-3 text-sm font-semibold hover:text-primary">
                  <span className="flex min-w-0 items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{legislativeDocumentLabel(group.latest)}</span>
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
                {earlierVersions.length > 0 && (
                  <details className="mt-3 border-t pt-3">
                    <summary className="cursor-pointer text-sm font-medium text-primary">
                      Earlier versions and amendment printings ({earlierVersions.length}{amendmentCount ? ` · ${amendmentCount} amendment ${amendmentCount === 1 ? 'printing' : 'printings'}` : ''})
                    </summary>
                    <div className="mt-2 space-y-2">
                      {earlierVersions.map((document) => {
                        const href = legislativeDocumentHref(document);
                        if (!href) return null;
                        return (
                          <a key={document.id} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-md border p-2 text-sm hover:border-primary">
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
            <a key={`${link.label}:${link.href}`} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-md border bg-background p-3 text-sm font-medium hover:border-primary">
              <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />{link.label}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
