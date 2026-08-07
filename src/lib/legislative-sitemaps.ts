import { supabase } from '@/integrations/supabase/client';
import { canonicalBillPath, type Bill } from '@/lib/bills';
import { absUrl, toIsoDate, type UrlEntry } from '@/lib/sitemap-shared';

const db = supabase as any;

function newestDate(values: Array<string | null | undefined>): string | undefined {
  const newest = values
    .map((value) => toIsoDate(value))
    .filter(Boolean)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
  return newest || undefined;
}

export async function billSitemapEntries(): Promise<UrlEntry[]> {
  const [{ data: bills, error: billsError }, { data: subjects, error: subjectsError }] = await Promise.all([
    db.from('bills')
      .select('legislature_number,bill_type,bill_number,last_action_date,updated_at')
      .eq('is_active', true).order('legislature_number', { ascending: false }).limit(50000),
    db.from('bill_subjects')
      .select('slug,updated_at').order('slug').limit(5000),
  ]);
  if (billsError) throw billsError;
  if (subjectsError) throw subjectsError;

  const billRows = (bills ?? []) as Array<Bill & { updated_at?: string | null }>;
  const subjectRows = (subjects ?? []) as Array<{ slug: string; updated_at?: string | null }>;
  const billsLastmod = newestDate([
    ...billRows.map((bill) => bill.last_action_date || bill.updated_at),
    ...subjectRows.map((subject) => subject.updated_at),
  ]);

  return [
    { loc: absUrl('/bills'), lastmod: billsLastmod },
    ...billRows.map((bill) => ({
      loc: absUrl(canonicalBillPath(bill)),
      lastmod: toIsoDate(bill.last_action_date || bill.updated_at) || undefined,
    })),
    ...subjectRows.map((subject) => ({
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
