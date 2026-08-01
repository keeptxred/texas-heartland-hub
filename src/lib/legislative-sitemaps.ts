import { supabase } from '@/integrations/supabase/client';
import { canonicalBillPath, type Bill } from '@/lib/bills';
import { absUrl, toIsoDate, type UrlEntry } from '@/lib/sitemap-shared';

const db = supabase as any;

export async function billSitemapEntries(): Promise<UrlEntry[]> {
  const { data, error } = await db.from('bills')
    .select('legislature_number,bill_type,bill_number,last_action_date,updated_at')
    .eq('is_active', true).order('legislature_number', { ascending: false }).limit(50000);
  if (error) throw error;
  return [{ loc: absUrl('/bills'), lastmod: toIsoDate(new Date()) }, ...(data ?? []).map((bill: Bill & { updated_at?: string }) => ({
    loc: absUrl(canonicalBillPath(bill)), lastmod: toIsoDate(bill.last_action_date || bill.updated_at || new Date()),
  }))];
}

export async function committeeSitemapEntries(): Promise<UrlEntry[]> {
  const { data, error } = await db.from('legislative_committees').select('committee_slug,updated_at').order('committee_slug').limit(5000);
  if (error) throw error;
  return [{ loc: absUrl('/texas-legislature/committees'), lastmod: toIsoDate(new Date()) }, ...(data ?? []).map((item: any) => ({
    loc: absUrl(`/texas-legislature/committees/${item.committee_slug}`), lastmod: toIsoDate(item.updated_at || new Date()),
  }))];
}

export async function sessionSitemapEntries(): Promise<UrlEntry[]> {
  const { data, error } = await db.from('legislative_sessions').select('legislature_number,session_code,updated_at').order('legislature_number', { ascending: false }).limit(500);
  if (error) throw error;
  return [
    { loc: absUrl('/texas-legislature'), lastmod: toIsoDate(new Date()) },
    { loc: absUrl('/texas-legislature/current-session'), lastmod: toIsoDate(new Date()) },
    { loc: absUrl('/texas-legislature/sessions'), lastmod: toIsoDate(new Date()) },
    ...(data ?? []).map((item: any) => ({ loc: absUrl(`/texas-legislature/sessions/${item.legislature_number}${String(item.session_code).toLowerCase()}`), lastmod: toIsoDate(item.updated_at || new Date()) })),
  ];
}
