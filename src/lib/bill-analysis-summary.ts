import type { LegislativeDocument } from '@/lib/bill-documents';

type AnalysisSections = {
  background_and_purpose?: string | null;
  criminal_justice_impact?: string | null;
  rulemaking_authority?: string | null;
  analysis?: string | null;
  comparison_of_original_and_substitute?: string | null;
  committee_amendments?: string | null;
  statement_of_legislative_intent?: string | null;
};

type AnalysisStructured = {
  version?: string | null;
  sections?: AnalysisSections | null;
};

export type BillAnalysisSummary = {
  documentId: string;
  label: string;
  backgroundAndPurpose: string | null;
  rulemakingAuthority: string | null;
  criminalJusticeImpact: string | null;
  committeeAmendments: string | null;
};

function structured(document: LegislativeDocument): AnalysisStructured | null {
  if (document.document_type !== 'analysis') return null;
  const metadata = document.metadata as { structured?: AnalysisStructured } | null;
  return metadata?.structured ?? null;
}

export function getLatestBillAnalysisSummary(documents: LegislativeDocument[]): BillAnalysisSummary | null {
  const analyses = documents
    .filter((document) => document.document_type === 'analysis' && structured(document)?.sections)
    .sort((a, b) => {
      const latest = Number(Boolean(b.is_latest)) - Number(Boolean(a.is_latest));
      if (latest) return latest;
      const sequence = (b.version_sequence ?? -1) - (a.version_sequence ?? -1);
      if (sequence) return sequence;
      return Date.parse(b.document_date || '') - Date.parse(a.document_date || '');
    });

  const document = analyses[0];
  if (!document) return null;
  const parsed = structured(document)!;
  const sections = parsed.sections || {};

  const result: BillAnalysisSummary = {
    documentId: document.id,
    label: parsed.version || document.version_label || document.document_title || 'Latest committee analysis',
    backgroundAndPurpose: sections.background_and_purpose || sections.statement_of_legislative_intent || null,
    rulemakingAuthority: sections.rulemaking_authority || null,
    criminalJusticeImpact: sections.criminal_justice_impact || null,
    committeeAmendments: sections.committee_amendments || sections.comparison_of_original_and_substitute || null,
  };

  return Object.values(result).some(Boolean) ? result : null;
}
