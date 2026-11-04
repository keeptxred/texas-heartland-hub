import { supabase } from '@/integrations/supabase/client';
import { absUrl, toIsoDate, type UrlEntry } from '@/lib/sitemap-shared';
const db = supabase as any;

/** No per-bill or bill-subject URLs may ever enter a generated sitemap. */
export async function billSitemapEntries(): Promise<UrlEntry[]> {
  return [{ loc: absUrl('/bills') }];
}

function newestDate(values: Array<string | null | undefined>): string | undefined {
  return values.map((value) => toIsoDate(value)).filter(Boolean).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] || undefined;
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
  return rows.map((item) => ({
    loc: absUrl(`/texas-legislature/sessions/${item.legislature_number}${String(item.session_code).toLowerCase()}`),
    lastmod: toIsoDate(item.updated_at) || undefined,
  }));
}
