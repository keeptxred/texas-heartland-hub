import { supabase } from '@/integrations/supabase/client';

const db = supabase as any;
export const SITE_URL = 'https://keeptxred.com';

export type Bill = {
  id: string;
  legislature_number: number;
  session_code: string;
  bill_type: string;
  bill_number: number;
  bill_identifier: string;
  chamber: 'house' | 'senate' | 'joint';
  caption: string;
  short_title?: string | null;
  description?: string | null;
  summary?: string | null;
  plain_language_summary?: string | null;
  current_status_code: string;
  current_status_label: string;
  current_status_description?: string | null;
  current_chamber?: string | null;
  introduced_date?: string | null;
  last_action_date?: string | null;
  passed_house_date?: string | null;
  passed_senate_date?: string | null;
  sent_to_governor_date?: string | null;
  signed_date?: string | null;
  effective_date?: string | null;
  vetoed_date?: string | null;
  became_law: boolean;
  source_url?: string | null;
  bill_text_url?: string | null;
  fiscal_note_url?: string | null;
  analysis_url?: string | null;
  last_synced_at?: string | null;
};

export const canonicalBillPath = (bill: Pick<Bill, 'legislature_number' | 'bill_type' | 'bill_number'>) =>
  `/bills/texas/${bill.legislature_number}/${bill.bill_type.toLowerCase()}/${Number(bill.bill_number)}`;

export const normalizeBillType = (value: string) => value.trim().toLowerCase();
export const normalizeStatus = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export async function listBills({ search = '', status = '', limit = 24, offset = 0 } = {}) {
  let query = db
    .from('bills')
    .select('id,legislature_number,session_code,bill_type,bill_number,bill_identifier,chamber,caption,current_status_code,current_status_label,last_action_date,became_law', { count: 'exact' })
    .eq('is_active', true)
    .order('last_action_date', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);
  if (status) query = query.eq('current_status_code', status);
  if (search) {
    const safe = search.replace(/[,%()]/g, ' ').trim();
    query = query.or(`bill_identifier.ilike.%${safe}%,caption.ilike.%${safe}%`);
  }
  const { data, error, count } = await query;
  if (error) throw error;
  return { bills: (data ?? []) as Bill[], count: count ?? 0 };
}

export async function getBill(legislature: number, billType: string, billNumber: number) {
  const { data, error } = await db
    .from('bills')
    .select('*')
    .eq('legislature_number', legislature)
    .eq('bill_type', normalizeBillType(billType))
    .eq('bill_number', billNumber)
    .maybeSingle();
  if (error) throw error;
  return data as Bill | null;
}

export async function getBillRelations(billId: string) {
  const [sponsors, actions, committees, documents, subjects, articles] = await Promise.all([
    db.from('bill_sponsors').select('*').eq('bill_id', billId).order('sequence'),
    db.from('bill_actions').select('*,legislative_committees(committee_name,committee_slug,chamber)').eq('bill_id', billId).order('action_date', { ascending: false }).order('action_sequence', { ascending: false }),
    db.from('bill_committee_history').select('*,legislative_committees(committee_slug)').eq('bill_id', billId).order('sequence'),
    db.from('bill_documents').select('*').eq('bill_id', billId).order('document_date', { ascending: false }),
    db.from('bill_subject_relationships').select('bill_subjects(*)').eq('bill_id', billId),
    db.from('bill_article_relationships').select('relationship_type,confidence,is_manual,articles(id,title,slug,excerpt,published_at,image_url)').eq('bill_id', billId).order('is_manual', { ascending: false }).order('confidence', { ascending: false }).limit(8),
  ]);
  const firstError = [sponsors, actions, committees, documents, subjects, articles].find((result) => result.error)?.error;
  if (firstError) throw firstError;
  return {
    sponsors: sponsors.data ?? [],
    actions: actions.data ?? [],
    committees: committees.data ?? [],
    documents: documents.data ?? [],
    subjects: (subjects.data ?? []).map((row: any) => row.bill_subjects).filter(Boolean),
    articles: (articles.data ?? []).map((row: any) => ({ ...row.articles, relationship_type: row.relationship_type })).filter((row: any) => row.id),
  };
}

export async function getRepresentativeLegislation(sponsorSlug: string) {
  const { data, error } = await db
    .from('bill_sponsors')
    .select('id,sponsor_name,sponsor_slug,sponsor_role,chamber,party,district,bills(id,legislature_number,bill_type,bill_number,bill_identifier,caption,current_status_label,last_action_date,became_law)')
    .eq('sponsor_slug', sponsorSlug)
    .order('date_added', { ascending: false })
    .limit(100);
  if (error) throw error;
  const rows = data ?? [];
  const identity = rows[0] ?? null;
  const bills = [...new Map(
    rows
      .map((row: any) => row.bills)
      .filter(Boolean)
      .map((bill: any) => [bill.id, bill]),
  ).values()];
  return { identity, bills };
}

export function billJsonLd(bill: Bill, sponsors: any[], actions: any[]) {
  const url = `${SITE_URL}${canonicalBillPath(bill)}`;
  const people = sponsors.map((sponsor) => ({
    '@type': 'Person',
    '@id': sponsor.sponsor_slug ? `${SITE_URL}/representatives/${sponsor.sponsor_slug}#person` : undefined,
    name: sponsor.sponsor_name,
    url: sponsor.sponsor_slug ? `${SITE_URL}/representatives/${sponsor.sponsor_slug}` : undefined,
  }));
  const faq = [
    ['What is ' + bill.bill_identifier + '?', bill.plain_language_summary || bill.summary || bill.caption],
    ['What is the current status of ' + bill.bill_identifier + '?', bill.current_status_description || bill.current_status_label],
    sponsors.length ? ['Who sponsors ' + bill.bill_identifier + '?', sponsors.map((s) => `${s.sponsor_name} (${s.sponsor_role})`).join(', ')] : null,
  ].filter(Boolean) as string[][];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', '@id': `${url}#webpage`, url,
        name: `${bill.bill_identifier} Texas Legislature: Status, Sponsors and History`,
        description: bill.plain_language_summary || bill.summary || bill.caption,
        dateModified: bill.last_synced_at || bill.last_action_date || undefined,
        breadcrumb: { '@id': `${url}#breadcrumb` },
        mainEntity: { '@id': `${url}#legislation` },
      },
      {
        '@type': 'Legislation', '@id': `${url}#legislation`, name: bill.caption,
        alternateName: bill.bill_identifier, legislationIdentifier: bill.bill_identifier,
        legislationType: bill.bill_type.toUpperCase(), legislationJurisdiction: { '@type': 'AdministrativeArea', name: 'Texas' },
        description: bill.plain_language_summary || bill.summary || bill.caption,
        dateCreated: bill.introduced_date || undefined, dateModified: bill.last_action_date || undefined,
        legislationDate: bill.signed_date || bill.last_action_date || undefined,
        sponsor: people.length ? people : undefined, url, sameAs: bill.source_url || undefined,
        subjectOf: actions.length ? actions.slice(0, 10).map((action) => ({ '@type': 'Event', name: action.action_text, startDate: action.action_date })) : undefined,
      },
      {
        '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Bills', item: `${SITE_URL}/bills` },
          { '@type': 'ListItem', position: 3, name: `${bill.legislature_number}th Legislature`, item: `${SITE_URL}/bills?legislature=${bill.legislature_number}` },
          { '@type': 'ListItem', position: 4, name: bill.bill_identifier, item: url },
        ],
      },
      ...(faq.length ? [{ '@type': 'FAQPage', mainEntity: faq.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) }] : []),
      ...people,
    ].map((entry) => Object.fromEntries(Object.entries(entry).filter(([, value]) => value !== undefined))),
  };
}
