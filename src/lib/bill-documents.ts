export type LegislativeDocument = {
  id: string;
  bill_id?: string | null;
  document_type?: string | null;
  document_title?: string | null;
  document_url?: string | null;
  source_html_url?: string | null;
  source_pdf_url?: string | null;
  version_code?: string | null;
  version_label?: string | null;
  version_sequence?: number | null;
  document_date?: string | null;
  is_latest?: boolean | null;
  file_format?: string | null;
  metadata?: Record<string, unknown> | null;
};

export type LegislativeDocumentGroup = {
  type: string;
  label: string;
  latest: LegislativeDocument;
  versions: LegislativeDocument[];
};

const TYPE_LABELS: Record<string, string> = {
  bill_text: 'Bill text',
  analysis: 'Committee analysis',
  fiscal_note: 'Fiscal note',
  witness_list: 'Witness list',
  history: 'Bill history',
};

const TYPE_ORDER = ['bill_text', 'analysis', 'fiscal_note', 'witness_list', 'history'];

const safeTime = (value?: string | null) => {
  if (!value) return 0;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
};

export function legislativeDocumentHref(document: LegislativeDocument) {
  return document.source_html_url || document.source_pdf_url || document.document_url || null;
}

export function legislativeDocumentLabel(document: LegislativeDocument) {
  const type = TYPE_LABELS[document.document_type || ''] || document.document_title || 'Official document';
  const version = document.version_label || document.version_code;
  return version ? `${type} — ${version}` : type;
}

export function compareLegislativeDocuments(a: LegislativeDocument, b: LegislativeDocument) {
  const latestDifference = Number(Boolean(b.is_latest)) - Number(Boolean(a.is_latest));
  if (latestDifference) return latestDifference;
  const sequenceDifference = (b.version_sequence ?? -1) - (a.version_sequence ?? -1);
  if (sequenceDifference) return sequenceDifference;
  const dateDifference = safeTime(b.document_date) - safeTime(a.document_date);
  if (dateDifference) return dateDifference;
  return String(b.id).localeCompare(String(a.id));
}

export function groupLegislativeDocuments(documents: LegislativeDocument[]): LegislativeDocumentGroup[] {
  const grouped = new Map<string, LegislativeDocument[]>();
  for (const document of documents) {
    if (!legislativeDocumentHref(document)) continue;
    const type = document.document_type || 'other';
    const group = grouped.get(type) || [];
    group.push(document);
    grouped.set(type, group);
  }

  return [...grouped.entries()]
    .map(([type, versions]) => {
      const ordered = [...versions].sort(compareLegislativeDocuments);
      return {
        type,
        label: TYPE_LABELS[type] || ordered[0]?.document_title || 'Official documents',
        latest: ordered[0],
        versions: ordered,
      };
    })
    .sort((a, b) => {
      const aIndex = TYPE_ORDER.indexOf(a.type);
      const bIndex = TYPE_ORDER.indexOf(b.type);
      if (aIndex === -1 && bIndex === -1) return a.label.localeCompare(b.label);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
}
