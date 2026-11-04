import { readFile } from 'node:fs/promises';

/** Regression gate for the one-document Texas bills search policy. */
const source = (path) => readFile(path, 'utf8');
const files = await Promise.all([
  'src/routes/bills/index.tsx',
  'src/start.ts',
  'src/lib/bill-public-path.ts',
  'src/lib/bills.ts',
  'src/lib/legislative-sitemaps.ts',
  'src/routes/api/public/bill-detail.ts',
  'src/components/bills/BillDetailPanel.tsx',
  'src/lib/retired-bill-documents.ts',
  'src/lib/public-bill-relations.ts',
  'src/routes/robots[.]txt.ts',
].map(source));
const [index, start, paths, bills, sitemap, api, panel, guard, relations, robots] = files;
const errors = [];
function requireText(value, tokens, name) {
  for (const token of tokens) if (!value.includes(token)) errors.push(`${name} missing ${token}`);
}
requireText(index, [
  "middlewares: [stripSearchParams(DEFAULT_SEARCH)]",
  "const canonical = `${SITE_URL}/bills`;",
  "content: filtered || search.page > 1",
  "const maxPage = Math.max(1, Math.ceil(results.count / 24));",
  "BillDetailPanel",
  "billSearchKey",
  "setSelectedBill",
  "to=\"/bills\"",
], 'Search hub');
if (index.includes('to="/bills/texas/$legislature"')) errors.push('Hub still promotes retired bill directories');
if (index.includes('href={canonicalBillPath(bill)}')) errors.push('Hub still links to standalone bill pages');
requireText(start, ["isRetiredBillDocumentPath(url.pathname)", "status: 410", '"x-robots-tag": "noindex, follow"'], 'HTTP retirement');
requireText(guard, ["normalized.startsWith('/bills/')"], 'Retired document matcher');
requireText(paths, ["billSearchKey", "billSearchPath", "parseBillSearchKey"], 'Bill identity');
requireText(bills, ["billSearchPath(bill)", "rpc('list_active_bill_filter_options')", ".order('id', { ascending: true })"], 'Bill server query');
requireText(sitemap, ["return [{ loc: absUrl('/bills') }]"], 'Bill sitemap');
if (sitemap.includes('hierarchyEntries(') || sitemap.includes('sitemapBills.map(')) errors.push('Bill sitemap creates retired URLs');
requireText(api, ["parseBillSearchKey", "getPublicBillRelations(bill.id)", ".eq('session_code', identity.session_code)", "'X-Robots-Tag': 'noindex, follow'"], 'Detail data API');
requireText(panel, ["BillEditorialExplanation", "BillDocumentsPanel", "OfficialBillTextViewer", "Sponsors and authors", "Committee history", "Legislative actions"], 'Detail viewer');
requireText(relations, ["review_status', 'approved'", "findRepresentativeBySlug"], 'Public relations');
if (robots.includes('Disallow: /*?page=')) errors.push('robots.txt may not block legacy page states');
if (robots.includes('Disallow: /bills')) errors.push('robots.txt may not block 410 retirement observation');

if (errors.length) {
  console.error(errors.map((item) => '- ' + item).join('\n'));
  process.exit(1);
}
console.log('Bills consolidation and crawler-retirement contract passed.');
