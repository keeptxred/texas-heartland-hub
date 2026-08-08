import { supabase } from '@/integrations/supabase/client';
import { canonicalBillPath, type Bill } from '@/lib/bills';
import { absUrl, toIsoDate, type UrlEntry } from '@/lib/sitemap-shared';

const db = supabase as any;
const SITEMAP_PAGE_SIZE = 1000;

type SitemapBill = Bill & {
  updated_at?: string | null;
  summary?: string | null;
  description?: string | null;
  plain_language_summary?: string | null;
};

type PageResult<T> = {
  data: T[] | null;
  error: unknown;
};

async function fetchAllPages<T>(
  loadPage: (from: number, to: number) => PromiseLike<PageResult<T>>,
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += SITEMAP_PAGE_SIZE) {
    const { data, error } = await loadPage(from, from + SITEMAP_PAGE_SIZE - 1);
    if (error) throw error;
    const page = data ?? [];
    rows.push(...page);
    if (page.length < SITEMAP_PAGE_SIZE) return rows;
  }
}

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

function hierarchyEntries(bills: SitemapBill[]): UrlEntry[] {
  const legislatureDates = new Map<number, Array<string | null | undefined>>();
  const typeDates = new Map<string, Array<string | null | undefined>>();

  for (const bill of bills) {
    const billType = String(bill.bill_type ?? '').trim().toLowerCase();
    if (!bill.legislature_number || !billType) continue;
    const date = bill.last_action_date || bill.updated_at;
    const legislatureValues = legislatureDates.get(bill.legislature_number) ?? [];
    legislatureValues.push(date);
    legislatureDates.set(bill.legislature_number, legislatureValues);

    const typeKey = `${bill.legislature_number}:${billType}`;
    const typeValues = typeDates.get(typeKey) ?? [];
    typeValues.push(date);
    typeDates.set(typeKey, typeValues);
  }

  const legislatureEntries = [...legislatureDates.entries()]
    .sort(([a], [b]) => b - a)
    .map(([legislature, dates]) => ({
      loc: absUrl(`/bills/texas/${legislature}`),
      lastmod: newestDate(dates),
    }));

  const typeEntries = [...typeDates.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, dates]) => {
      const [legislature, billType] = key.split(':');
      return {
        loc: absUrl(`/bills/texas/${legislature}/${billType}`),
        lastmod: newestDate(dates),
      };
    });

  return [...legislatureEntries, ...typeEntries];
}

export async function billSitemapEntries(): Promise<UrlEntry[]> {
  // PostgREST installations commonly cap a single response at 1,000 rows even
  // when a larger .limit() is requested. Page every evidence source explicitly
  // so sitemap eligibility cannot silently depend on an API row cap.
  const [
    billRows,
    subjectRows,
    actionRows,
    sponsorRows,
    documentRows,
    subjectRelationshipRows,
    articleRows,
    enrichmentRows,
  ] = await Promise.all([
    fetchAllPages<SitemapBill>((from, to) => db.from('bills')
      .select('id,legislature_number,bill_type,bill_number,last_action_date,updated_at,summary,description,plain_language_summary,became_law,bill_text_url,analysis_url,fiscal_note_url')
      .eq('is_active', true)
      .order('legislature_number', { ascending: false })
      .order('id')
      .range(from, to)),
    fetchAllPages<{ id: string; slug: string; updated_at?: string | null }>((from, to) => db.from('bill_subjects')
      .select('id,slug,updated_at')
      .order('slug')
      .order('id')
      .range(from, to)),
    fetchAllPages<{ bill_id: string }>((from, to) => db.from('bill_actions')
      .select('bill_id')
      .order('bill_id')
      .range(from, to)),
    fetchAllPages<{ bill_id: string }>((from, to) => db.from('bill_sponsors')
      .select('bill_id')
      .order('bill_id')
      .range(from, to)),
    fetchAllPages<{ bill_id: string }>((from, to) => db.from('bill_documents')
      .select('bill_id')
      .order('bill_id')
      .range(from, to)),
    fetchAllPages<{ bill_id: string; subject_id: string }>((from, to) => db.from('bill_subject_relationships')
      .select('bill_id,subject_id')
      .eq('review_status', 'approved')
      .order('bill_id')
      .range(from, to)),
    fetchAllPages<{ bill_id: string }>((from, to) => db.from('bill_article_relationships')
      .select('bill_id')
      .eq('review_status', 'approved')
      .order('bill_id')
      .range(from, to)),
    fetchAllPages<{ bill_id: string }>((from, to) => db.from('bill_editorial_enrichments')
      .select('bill_id')
      .eq('review_status', 'approved')
      .order('bill_id')
      .range(from, to)),
  ]);

  const linkedSubjectIds = new Set(
    subjectRelationshipRows.map((row) => String(row.subject_id ?? '')).filter(Boolean),
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
    ...hierarchyEntries(billRows),
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

  // The shared Legislature hub, current-session page, and sessions index live in
  // sitemap-pages.xml. Keep this child sitemap focused on session detail pages so
  // canonical URLs are never duplicated across the sitemap set.
  return rows.map((item) => ({
    loc: absUrl(`/texas-legislature/sessions/${item.legislature_number}${String(item.session_code).toLowerCase()}`),
    lastmod: toIsoDate(item.updated_at) || undefined,
  }));
}
