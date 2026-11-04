import { readFileSync, existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { billSearchKey, billSearchPath, parseBillSearchKey } from '@/lib/bill-public-path';
import { isRetiredBillDocumentPath } from '@/lib/retired-bill-documents';

const source = (path: string) => readFileSync(path, 'utf8');

describe('Texas bills single-indexable-page contract', () => {
  const called = { legislature_number: 89, session_code: '2', bill_type: 'hb', bill_number: 4 };
  it('preserves session identity and fragments without generating new HTML pages', () => {
    expect(billSearchKey(called)).toBe('89-2-hb-4');
    expect(billSearchPath(called)).toBe('/bills#bill=89-2-hb-4');
    expect(billSearchPath({ ...called, session_code: 'R' })).toBe('/bills#bill=89-r-hb-4');
    expect(parseBillSearchKey('89-2-hb-4')).toEqual(called);
    expect(parseBillSearchKey('89-2-hb-0')).toBeNull();
    expect(parseBillSearchKey('89-2-hb-4/other')).toBeNull();
  });

  it('retires all old bill documents while preserving the sole hub and admin', () => {
    expect(isRetiredBillDocumentPath('/bills')).toBe(false);
    expect(isRetiredBillDocumentPath('/bills/')).toBe(false);
    expect(isRetiredBillDocumentPath('/admin/bills/editorial')).toBe(false);
    for (const path of [
      '/bills/texas/89/hb/4',
      '/bills/texas/89/2/hb/4',
      '/bills/texas/89',
      '/bills/texas/89/hb',
      '/bills/subject/health',
      '/bills/texas/89/hb/4/reference.json',
    ]) expect(isRetiredBillDocumentPath(path)).toBe(true);
  });

  it('guarantees HTTP 410 + noindex before route rendering', () => {
    const start = source('src/start.ts');
    expect(start).toContain('isRetiredBillDocumentPath(url.pathname)');
    expect(start).toContain('status: 410');
    expect(start).toContain('"x-robots-tag": "noindex, follow"');
    expect(start).toContain('href="/bills"');
  });

  it('keeps one canonical /bills page, not a crawlable pagination or bill URL', () => {
    const index = source('src/routes/bills/index.tsx');
    expect(index).toContain('const canonical = `${SITE_URL}/bills`');
    expect(index).toContain('filtered || search.page > 1');
    expect(index).toContain('BillDetailPanel');
    expect(index).not.toContain('to="/bills/texas/$legislature"');
    const sitemap = source('src/lib/legislative-sitemaps.ts');
    expect(sitemap).toContain("return [{ loc: absUrl('/bills') }]");
    expect(sitemap).not.toContain('hierarchyEntries');
    expect(source('src/routes/sitemap-bills[.]xml.ts')).toContain('BASE_URL}/bills');
  });

  it('does not regenerate retired bill document and directory route files', () => {
    for (const path of [
      'src/routes/bills/subject/$subjectSlug.tsx',
      'src/routes/bills/texas/$legislature/index.tsx',
      'src/routes/bills/texas/$legislature/$billType/index.tsx',
      'src/routes/bills/texas/$legislature/$billType/$billNumber.tsx',
      'src/routes/bills/texas/$legislature/$session/$billType/$billNumber.tsx',
      'src/routes/bills.texas.$legislature.$billType.$billNumber.reference[.]json.ts',
      'src/routes/bills.texas.$legislature.$session.$billType.$billNumber.reference[.]json.ts',
    ]) expect(existsSync(path)).toBe(false);
  });

  it('only reads a session-specific record using a noindex data API', () => {
    const api = source('src/routes/api/public/bill-detail.ts');
    expect(api).toContain("getPublicBillRelations(bill.id)");
    expect(api).toContain('getBillEffectiveDateProvisions(bill.id)');
    expect(api).toContain('getRelatedBills(bill.id');
    const panel = source('src/components/bills/BillDetailPanel.tsx');
    expect(panel).toContain('<BillHearingsAndVotes activities={committees} />');
    expect(panel).toContain('<RelatedBillsSection bills={data?.relatedBills ?? []} />');
    expect(panel).toContain('initialEffectiveDates={data?.effectiveDates}');
    expect(api).toContain(".eq('session_code', identity.session_code)");
    expect(api).toContain("'X-Robots-Tag': 'noindex, follow'");
    expect(api).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
  });
});
