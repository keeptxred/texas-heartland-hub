import { supabase } from '@/integrations/supabase/client';
import {
  TEXAS_HOUSE_MEMBERS,
  TEXAS_SENATE_MEMBERS,
  representativeSlug,
} from '@/data/representatives';
import { publicBillPath } from '@/lib/bill-public-path';

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

export type BillListFilters = {
  search?: string;
  status?: string;
  legislature?: number;
  chamber?: string;
  billType?: string;
  limit?: number;
  offset?: number;
};

const STATUS_GROUPS: Record<string, string[]> = {
  filed: ['filed', 'introduced', 'received-by-secretary-of-senate'],
  'in-committee': ['in-committee', 'referred-to-committee', 'scheduled-for-hearing', 'reported-from-committee'],
  passed: ['passed-house', 'passed-senate', 'passed-both-chambers', 'enrolled'],
  'sent-to-governor': ['sent-to-governor', 'presented-to-governor'],
  signed: ['signed', 'became-law', 'effective'],
  vetoed: ['vetoed'],
};

const STATE_LEGISLATORS = [...TEXAS_HOUSE_MEMBERS, ...TEXAS_SENATE_MEMBERS];
const BILL_DIRECTORY_PAGE_SIZE = 1000;

const normalizePersonToken = (value = '') =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');

const districtNumber = (value?: string | null) => value?.match(/\d+/)?.[0] ?? null;

function lastNameMatches(fullName: string, storedName: string) {
  const full = normalizePersonToken(fullName);
  const stored = normalizePersonToken(storedName);
  return Boolean(stored) && (full.endsWith(stored) || representativeSlug(fullName).endsWith(`-${representativeSlug(storedName)}`));
}

function resolveSponsorIdentity(sponsor: any) {
  if (!sponsor?.sponsor_name) return sponsor;

  const storedSlug = sponsor.sponsor_slug || representativeSlug(sponsor.sponsor_name);
  const exact = STATE_LEGISLATORS.find((member) => representativeSlug(member.name) === storedSlug);
  if (exact) {
    return {
      ...sponsor,
      sponsor_name: exact.name,
      sponsor_slug: representativeSlug(exact.name),
      party: sponsor.party || exact.party,
      district: sponsor.district || exact.district,
    };
  }

  const allMatches = STATE_LEGISLATORS.filter((member) => lastNameMatches(member.name, sponsor.sponsor_name));
  const storedDistrict = districtNumber(sponsor.district);
  let match: (typeof STATE_LEGISLATORS)[number] | undefined;

  if (storedDistrict) {
    const districtMatches = allMatches.filter((member) => districtNumber(member.district) === storedDistrict);
    if (districtMatches.length === 1) match = districtMatches[0];
  }

  if (!match && sponsor.chamber) {
    const chamberMatches = allMatches.filter((member) =>
      sponsor.chamber === 'senate'
        ? member.office === 'Texas Senate'
        : sponsor.chamber === 'house'
          ? member.office === 'Texas House'
          : true,
    );
    if (chamberMatches.length === 1) match = chamberMatches[0];
  }

  if (!match && allMatches.length === 1) match = allMatches[0];
  if (!match) return sponsor;

  return {
    ...sponsor,
    sponsor_name: match.name,
    sponsor_slug: representativeSlug(match.name),
    party: sponsor.party || match.party,
    district: sponsor.district || match.district,
  };
}

export const canonicalBillPath = (
  bill: Pick<Bill, 'legislature_number' | 'bill_type' | 'bill_number'> & Partial<Pick<Bill, 'session_code'>>,
) => publicBillPath(bill);

export const normalizeBillType = (value: string) => value.trim().toLowerCase();
export const normalizeStatus = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export async function listBills({ search = '', status = '', legislature, chamber = '', billType = '', limit = 24, offset = 0 }: BillListFilters = {}) {
  let query = db
    .from('bills')
    .select('id,legislature_number,session_code,bill_type,bill_number,bill_identifier,chamber,caption,current_status_code,current_status_label,last_action_date,became_law', { count: 'exact' })
    .eq('is_active', true)
    .order('last_action_date', { ascending: false, nullsFirst: false })
    .order('id', { ascending: true })
    .range(offset, offset + limit - 1);
  if (status) {
    const codes = STATUS_GROUPS[status];
    query = codes?.length ? query.in('current_status_code', codes) : query.eq('current_status_code', status);
  }
  if (legislature) query = query.eq('legislature_number', legislature);
  if (chamber) query = query.eq('chamber', chamber);
  if (billType) query = query.eq('bill_type', normalizeBillType(billType));
  if (search) {
    const safe = search.replace(/[,%()]/g, ' ').trim();
    query = query.or(`bill_identifier.ilike.%${safe}%,caption.ilike.%${safe}%`);
  }
  const { data, error, count } = await query;
  if (error) throw error;
  return { bills: (data ?? []) as Bill[], count: count ?? 0 };
}

export async function getBillFilterOptions() {
  const rows: any[] = [];
  for (let from = 0; ; from += BILL_DIRECTORY_PAGE_SIZE) {
    const { data, error } = await db
      .from('bills')
      .select('legislature_number,session_code,bill_type,chamber')
      .eq('is_active', true)
      .order('legislature_number', { ascending: false })
      .order('session_code', { ascending: true })
      .order('bill_type', { ascending: true })
      .order('chamber', { ascending: true })
      .range(from, from + BILL_DIRECTORY_PAGE_SIZE - 1);
    if (error) throw error;
    const page = data ?? [];
    rows.push(...page);
    if (page.length < BILL_DIRECTORY_PAGE_SIZE) break;
  }
  const legislatures = [...new Map(rows.map((row: any) => [row.legislature_number, { value: row.legislature_number, label: `${row.legislature_number}th Legislature${row.session_code ? ` · ${row.session_code}` : ''}` }])).values()];
  const billTypes = [...new Set(rows.map((row: any) => row.bill_type).filter(Boolean))].sort();
  const chambers = [...new Set(rows.map((row: any) => row.chamber).filter(Boolean))].sort();
  return { legislatures, billTypes, chambers };
}

export async function getBill(legislature: number, billType: string, billNumber: number) {
  const { data, error } = await db
    .from('bills')
    .select('*')
    .eq('legislature_number', legislature)
    .eq('session_code', 'R')
    .eq('bill_type', normalizeBillType(billType))
    .eq('bill_number', billNumber)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  return (data as Bill | null) ?? null;
}

export type BillEditorialEnrichment = {
  plain_language_summary?: string | null;
  what_changes?: string | null;
  who_is_affected?: string | null;
  effective_date_explanation?: string | null;
  limitations?: string | null;
  source_urls?: string[] | null;
  source_notes?: string | null;
  reviewed_at?: string | null;
};

export async function getBillEditorialEnrichment(billId: string) {
  const { data, error } = await db
    .from('bill_editorial_enrichments')
    .select('plain_language_summary,what_changes,who_is_affected,effective_date_explanation,limitations,source_urls,source_notes,reviewed_at')
    .eq('bill_id', billId)
    .eq('review_status', 'approved')
    .maybeSingle();
  if (error) {
    console.error(`getBillEditorialEnrichment failed for bill ${billId}:`, error.message ?? error);
    return null;
  }
  return (data as BillEditorialEnrichment | null) ?? null;
}

export async function getBillRelations(billId: string) {
  const safe = async (label: string, build: () => any) => {
    try {
      const { data, error } = await build();
      if (error) { console.error(`getBillRelations(${label}) failed for bill ${billId}:`, error.message ?? error); return { data: [] }; }
      return { data: data ?? [] };
    } catch (error: any) {
      console.error(`getBillRelations(${label}) threw for bill ${billId}:`, error?.message ?? error);
      return { data: [] };
    }
  };
  const [sponsors, actions, committees, documents, subjects, articles] = await Promise.all([
    safe('sponsors', () => db.from('bill_sponsors').select('*').eq('bill_id', billId).order('sequence')),
    safe('actions', () => db.from('bill_actions').select('*,legislative_committees(committee_name,committee_slug,chamber)').eq('bill_id', billId).order('action_date', { ascending: false }).order('action_sequence', { ascending: false })),
    safe('committees', () => db.from('bill_committee_history').select('*,legislative_committees(committee_slug)').eq('bill_id', billId).order('sequence')),
    safe('documents', () => db.from('bill_documents').select('*').eq('bill_id', billId).order('document_date', { ascending: false })),
    safe('subjects', () => db.from('bill_subject_relationships').select('bill_subjects(*)').eq('bill_id', billId)),
    safe('articles', () => db.from('bill_article_relationships').select('relationship_type,confidence,is_manual,daily_articles(id,title,slug,dek,published_at,image_url)').eq('bill_id', billId).order('is_manual', { ascending: false }).order('confidence', { ascending: false }).limit(8)),
  ]);
  return {
    sponsors: (sponsors.data ?? []).map(resolveSponsorIdentity),
    actions: actions.data ?? [],
    committees: committees.data ?? [],
    documents: documents.data ?? [],
    subjects: (subjects.data ?? []).map((row: any) => row.bill_subjects).filter(Boolean),
    articles: (articles.data ?? [])
      .map((row: any) => (row.daily_articles ? { ...row.daily_articles, excerpt: row.daily_articles.dek, relationship_type: row.relationship_type } : null))
      .filter((row: any) => row?.id),
  };
}

export async function getRepresentativeLegislation(sponsorSlug: string) {
  const directoryRepresentative = STATE_LEGISLATORS.find((member) => representativeSlug(member.name) === sponsorSlug);
  const possibleSlugs = new Set([sponsorSlug]);
  if (directoryRepresentative) {
    const nameParts = directoryRepresentative.name.trim().split(/\s+/);
    possibleSlugs.add(representativeSlug(nameParts[nameParts.length - 1]));
  }

  const { data, error } = await db
    .from('bill_sponsors')
    .select('id,sponsor_name,sponsor_slug,sponsor_role,chamber,party,district,bills(id,legislature_number,session_code,bill_type,bill_number,bill_identifier,caption,current_status_label,last_action_date,became_law)')
    .in('sponsor_slug', [...possibleSlugs])
    .order('date_added', { ascending: false })
    .limit(100);
  if (error) throw error;
  const rows = (data ?? []).map(resolveSponsorIdentity);
  const identity = rows[0] ?? (directoryRepresentative ? resolveSponsorIdentity({
    sponsor_name: directoryRepresentative.name,
    sponsor_slug: representativeSlug(directoryRepresentative.name),
    chamber: directoryRepresentative.office === 'Texas Senate' ? 'senate' : 'house',
    party: directoryRepresentative.party,
    district: directoryRepresentative.district,
  }) : null);
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
  const billType = bill.bill_type.toLowerCase();
  const people = sponsors.map((sponsor) => ({
    '@type': 'Person',
    '@id': sponsor.sponsor_slug ? `${SITE_URL}/representatives/${sponsor.sponsor_slug}#person` : undefined,
    name: sponsor.sponsor_name,
    url: sponsor.sponsor_slug ? `${SITE_URL}/representatives/${sponsor.sponsor_slug}` : undefined,
  }));
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
          { '@type': 'ListItem', position: 3, name: `${bill.legislature_number}th Legislature`, item: `${SITE_URL}/bills/texas/${bill.legislature_number}` },
          { '@type': 'ListItem', position: 4, name: `${bill.bill_type.toUpperCase()} bills`, item: `${SITE_URL}/bills/texas/${bill.legislature_number}/${billType}` },
          { '@type': 'ListItem', position: 5, name: bill.bill_identifier, item: url },
        ],
      },
      ...people,
    ].map((entry) => Object.fromEntries(Object.entries(entry).filter(([, value]) => value !== undefined))),
  };
}
