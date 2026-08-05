import type { LegislativeDocument } from '@/lib/bill-documents';

type FiscalStructured = {
  summary?: string | null;
  general_description?: string | null;
  local_government_impact?: string | null;
  source_agencies?: string | null;
  monetary_amounts?: string[] | null;
  no_state_fiscal_implication?: boolean | null;
  no_local_fiscal_implication?: boolean | null;
};

export type BillFiscalImpact = {
  documentId: string;
  label: string;
  summary: string | null;
  localGovernmentImpact: string | null;
  sourceAgencies: string | null;
  monetaryAmounts: string[];
  noStateFiscalImplication: boolean;
  noLocalFiscalImplication: boolean;
};

function fiscalStructured(document: LegislativeDocument): FiscalStructured | null {
  if (document.document_type !== 'fiscal_note') return null;
  const metadata = document.metadata as { structured?: FiscalStructured } | null;
  return metadata?.structured ?? null;
}

export function getLatestBillFiscalImpact(documents: LegislativeDocument[]): BillFiscalImpact | null {
  const fiscalNotes = documents
    .filter((document) => document.document_type === 'fiscal_note' && fiscalStructured(document))
    .sort((a, b) => {
      const latest = Number(Boolean(b.is_latest)) - Number(Boolean(a.is_latest));
      if (latest) return latest;
      const sequence = (b.version_sequence ?? -1) - (a.version_sequence ?? -1);
      if (sequence) return sequence;
      return Date.parse(b.document_date || '') - Date.parse(a.document_date || '');
    });

  const document = fiscalNotes[0];
  if (!document) return null;
  const structured = fiscalStructured(document)!;
  const summary = structured.summary || structured.general_description || null;

  return {
    documentId: document.id,
    label: document.version_label || document.document_title || 'Latest fiscal note',
    summary,
    localGovernmentImpact: structured.local_government_impact || null,
    sourceAgencies: structured.source_agencies || null,
    monetaryAmounts: [...new Set(structured.monetary_amounts || [])].slice(0, 8),
    noStateFiscalImplication: Boolean(structured.no_state_fiscal_implication),
    noLocalFiscalImplication: Boolean(structured.no_local_fiscal_implication),
  };
}
