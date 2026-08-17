import {
  compareLegislativeDocuments,
  legislativeDocumentHref,
  type LegislativeDocument,
} from '@/lib/bill-documents';

const SITE_URL = 'https://keeptxred.com';

type BillReferenceRecord = {
  legislature_number: number;
  session_code?: string | null;
  bill_type: string;
  bill_number: number;
  bill_identifier: string;
  caption: string;
  current_status_code?: string | null;
  current_status_label?: string | null;
  last_action_date?: string | null;
  last_synced_at?: string | null;
  source_url?: string | null;
};

type BillActionRecord = {
  action_date?: string | null;
  action_text?: string | null;
  chamber?: string | null;
  normalized_status?: string | null;
  source_url?: string | null;
};

export type BillPrimarySourceReference = {
  schemaVersion: 1;
  site: 'Keep TX Red';
  jurisdiction: 'Texas';
  billIdentifier: string;
  legislature: number;
  session: string | null;
  title: string;
  status: string | null;
  canonicalUrl: string;
  officialBillUrl: string | null;
  lastActionDate: string | null;
  lastSyncedAt: string | null;
  documents: Array<{
    type: string;
    title: string;
    versionCode: string | null;
    versionLabel: string | null;
    documentDate: string | null;
    fileFormat: string | null;
    officialUrl: string;
  }>;
  actions: Array<{
    date: string | null;
    text: string;
    chamber: string | null;
    status: string | null;
    officialUrl: string | null;
  }>;
};

export function buildBillPrimarySourceReference(
  bill: BillReferenceRecord,
  actions: readonly BillActionRecord[],
  documents: readonly LegislativeDocument[],
): BillPrimarySourceReference {
  const billType = String(bill.bill_type).trim().toLowerCase();
  const billNumber = Number(bill.bill_number);
  const canonicalUrl = `${SITE_URL}/bills/texas/${bill.legislature_number}/${billType}/${billNumber}`;

  const publicDocuments = [...documents]
    .filter((document) => Boolean(legislativeDocumentHref(document)))
    .sort(compareLegislativeDocuments)
    .map((document) => ({
      type: document.document_type || 'other',
      title: document.document_title || 'Official legislative document',
      versionCode: document.version_code || null,
      versionLabel: document.version_label || null,
      documentDate: document.document_date || null,
      fileFormat: document.file_format || null,
      officialUrl: legislativeDocumentHref(document)!,
    }));

  const publicActions = actions
    .filter((action) => typeof action.action_text === 'string' && Boolean(action.action_text.trim()))
    .map((action) => ({
      date: action.action_date || null,
      text: action.action_text!.trim(),
      chamber: action.chamber || null,
      status: action.normalized_status || null,
      officialUrl: action.source_url || null,
    }));

  return {
    schemaVersion: 1,
    site: 'Keep TX Red',
    jurisdiction: 'Texas',
    billIdentifier: bill.bill_identifier,
    legislature: bill.legislature_number,
    session: bill.session_code || null,
    title: bill.caption,
    status: bill.current_status_label || bill.current_status_code || null,
    canonicalUrl,
    officialBillUrl: bill.source_url || null,
    lastActionDate: bill.last_action_date || null,
    lastSyncedAt: bill.last_synced_at || null,
    documents: publicDocuments,
    actions: publicActions,
  };
}
