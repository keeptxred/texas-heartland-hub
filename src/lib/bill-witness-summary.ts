import { compareLegislativeDocuments, type LegislativeDocument } from '@/lib/bill-documents';

type WitnessRecord = {
  name?: string | null;
  organization?: string | null;
  position?: string | null;
  testimony_type?: string | null;
};

type WitnessMetadata = {
  committee?: string | null;
  hearing_date?: string | null;
  witnesses?: WitnessRecord[] | null;
};

export type BillWitnessSummary = {
  label: string;
  committee: string | null;
  hearingDate: string | null;
  total: number;
  forCount: number;
  againstCount: number;
  onCount: number;
  testifyingCount: number;
  registeringCount: number;
  witnesses: Array<{
    name: string;
    organization: string | null;
    position: 'for' | 'against' | 'on' | 'other';
    testimonyType: string | null;
  }>;
};

function structuredMetadata(document: LegislativeDocument): WitnessMetadata | null {
  const structured = (document.metadata as any)?.structured;
  return structured && typeof structured === 'object' ? structured : null;
}

export function getLatestBillWitnessSummary(documents: LegislativeDocument[]): BillWitnessSummary | null {
  const document = documents
    .filter((item) => item.document_type === 'witness_list')
    .sort(compareLegislativeDocuments)[0];
  if (!document) return null;

  const structured = structuredMetadata(document);
  const rows = Array.isArray(structured?.witnesses) ? structured.witnesses : [];
  const witnesses = rows
    .map((row) => {
      const name = String(row?.name ?? '').trim();
      if (!name) return null;
      const rawPosition = String(row?.position ?? '').trim().toLowerCase();
      const position = rawPosition === 'for' || rawPosition === 'against' || rawPosition === 'on'
        ? rawPosition
        : 'other';
      return {
        name,
        organization: String(row?.organization ?? '').trim() || null,
        position,
        testimonyType: String(row?.testimony_type ?? '').trim() || null,
      };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  if (!witnesses.length && !structured?.committee && !structured?.hearing_date) return null;

  const testimony = witnesses.map((row) => row.testimonyType?.toLowerCase() ?? '');
  return {
    label: document.version_label || document.document_title || 'Official witness list',
    committee: String(structured?.committee ?? '').trim() || null,
    hearingDate: String(structured?.hearing_date ?? '').trim() || null,
    total: witnesses.length,
    forCount: witnesses.filter((row) => row.position === 'for').length,
    againstCount: witnesses.filter((row) => row.position === 'against').length,
    onCount: witnesses.filter((row) => row.position === 'on').length,
    testifyingCount: testimony.filter((value) => value.includes('testifying') && !value.includes('not testifying')).length,
    registeringCount: testimony.filter((value) => value.includes('not testifying')).length,
    witnesses,
  };
}
