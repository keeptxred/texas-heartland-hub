import { supabase } from '@/integrations/supabase/client';
import { canonicalBillPath, type Bill } from '@/lib/bills';
import { absUrl, toIsoDate, type UrlEntry } from '@/lib/sitemap-shared';

const db = supabase as any;

type SitemapBill = Bill & {
  updated_at?: string | null;
  summary?: string | null;
  description?: string | null;
  plain_language_summary?: string | null;
};

function newestDate(values: Array<string | null | undefined>): string | undefined {
  const newest = values
    .map((value) => toIsoDate(value))
    .filter(Boolean)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
  return newest || undefined;
}

function idSet(rows: any[] | null | undefined): Set<string> {
  return new Set((rows ?? []).map((row) => String(row.bill_id ?? '')).filter(Boolean));
}

function hasMeaningfulText(value: string | null | undefined, minimum = 80): boolean {
  return String(value ?? '').trim().length >= minimum;
}

/**
 * Sitemaps are crawl invitations, not a complete database export. Keep every valid
 * bill route available, but explicitly advertise bills that have at least two
 * independent substance signals. This reduces crawl pressure from very thin
 * records while allowing them to become sitemap-eligible automatically as the
 * legislative enrichment pipeline fills in actions, sponsors, documents, subjects,
 * related reporting, or editorial explanations.
 */
function isSitemapWorthyBill(
  bill: SitemapBill,
  evidence: {
    actions: Set<string>;
    sponsors: Set<string>;
    documents: Set<string>;
    subjects: Set<string>;
    articles: Set<string>;
    enrichments: Set<string>;
  },
): boolean {
  let score = 0;
  if (evidence.actions.has(bill.id)) score += 1;
  if (evidence.sponsors.has(bill.id)) score += 1;
  if (evidence.documents.has(bill.id)) score += 1;
  if (evidence.subjects.has(bill.id)) score += 1;
  if (evidence.articles.has(bill.id)) score += 2;
  if (evidence.enrichments.has(bill.id)) score += 2;
  if (bill.became_law) score += 2;
  if (
    hasMeaningfulText(bill.plain_language_summary)
    || hasMeaningfulText(bill.summary)
    || hasMeaningfulText(bill.description)
  ) score += 1;
  if (bill.bill_text_url || bill.analysis_url || bill.fiscal_note_url) score += 1;
  return score >= 2;
}

export async function billSitemapEntries(): Promise<UrlEntry[]> {
  const [
    { data: bills, error: billsError },
    { data: subjects, error: subjectsError },
    { data: actionRows, error: actionsError },
    { data: sponsorRows, error: sponsorsError },
    { data: documentRows, error: documentsError },
    { data: subjectRelationshipRows, error: subjectRelationshipsError },
    { data: articleRows, error: articlesError },
    { data: enrichmentRows, error: enrichmentsError },
  ] = await Promise.all([
    db.from('bills')
      .select('id,legislature_number,bill_type,bill_number,last_action_date,updated_at,summary,description,plain_language_summary,became_law,bill_text_url,analysis_url,fiscal_note_url')
      .eq('is_active', true).order('legislature_number', { ascending: false }).limit(50000),
    db.from('bill_subjects')
      .select('id,slug,updated_at').order('slug').limit(5000),
    db.from('bill_actions').select('bill_id').limit(50000),
    db.from('bill_sponsors').select('bill_id').limit(50000),
    db.from('bill_documents').select('bill_id').limit(50000),
    db.from('bill_subject_relationships').select('bill_id,subject_id').eq('review_status', 'approved').limit(50000),
    db.from('bill_article_relationships').select('bill_id').eq('review_status', 'approved').limit(50000),
    db.from('bill_editorial_enrichments').select('bill_id').eq('review_status', 'approved').limit(50000),
  ]);
  for (const error of [
    billsError,
    subjectsError,
    actionsError,
    sponsorsError,
    documentsError,
    subjectRelationshipsError,
    articlesError,
    enrichmentsError,
  ]) {
    if (error) throw error;
  }

  const billRows = (bills ?? []) as SitemapBill[];
  const subjectRows = (subjects ?? []) as Array<{ id: string; slug: string; updated_at?: string | null }>;
  const linkedSubjectIds = new Set(
    (subjectRelationshipRows ?? []).map((row: any) => String(row.subject_id ?? '')).filter(Boolean),
  );
  const sitemapSubjects = subjectRows.filter((subject) => linkedSubjectIds.has(subject.id));
  const evidence = {
    actions: idSet(actionRows),
    sponsors: idSet(sponsorRows),
    documents: idSet(documentRows),
    subjects: idSet(subjectRelationshipRows),
    articles: idSet(articleRows),
    enrichments: idSet(enrichmentRows),
  };
  const sitemapBills = billRows.filter((bill) => isSitemapWorthyBill(bill, evidence));
  const billsLastmod = newestDate([
    ...sitemapBills.map((bill) => bill.last_action_date || bill.updated_at),
    ...sitemapSubjects.map((subject) => subject.updated_at),
  ]);

  return [
    { loc: absUrl('/bills'), lastmod: billsLastmod },
    ...sitemapBills.map((bill) => ({
      loc: absUrl(canonicalBillPath(bill)),
      lastmod: toIsoDate(bill.last_action_date || bill.updated_at) || undefined,
    })),
    ...sitemapSubjects.map((subject) => ({
      loc: absUrl(`/bills/subject/${subject.slug}`),
      lastmod: toIsoDate(subject.updated_at) || undefined,
    })),
  ];
}

export async function committeeSitemapEntries(): Promise<UrlEntry[]> {
  const { data, error } = await db.from('legislative_committees').select('committee_slug,updated_at').order('committee_slug').limit(5000);
  if (error) throw error;
  const rows = (data ?? []) as Array<{ committee_slug: string; updated_at?: string | null }>;
  const lastmod = newestDate(rows.map((item) => item.updated_at));
  return [
    { loc: absUrl('/texas-legislature/committees'), lastmod },
    ...rows.map((item) => ({
      loc: absUrl(`/texas-legislature/committees/${item.committee_slug}`),
      lastmod: toIsoDate(item.updated_at) || undefined,
    })),
  ];
}

export async function sessionSitemapEntries(): Promise<UrlEntry[]> {
  const { data, error } = await db.from('legislative_sessions').select('legislature_number,session_code,updated_at').order('legislature_number', { ascending: false }).limit(500);
  if (error) throw error;
  const rows = (data ?? []) as Array<{ legislature_number: number; session_code: string; updated_at?: string | null }>;
  const lastmod = newestDate(rows.map((item) => item.updated_at));
  return [
    { loc: absUrl('/texas-legislature'), lastmod },
    { loc: absUrl('/texas-legislature/current-session'), lastmod },
    { loc: absUrl('/texas-legislature/sessions'), lastmod },
    ...rows.map((item) => ({
      loc: absUrl(`/texas-legislature/sessions/${item.legislature_number}${String(item.session_code).toLowerCase()}`),
      lastmod: toIsoDate(item.updated_at) || undefined,
    })),
  ];
}
