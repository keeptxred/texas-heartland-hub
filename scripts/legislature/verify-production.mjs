#!/usr/bin/env node

const baseUrl = (process.env.SITE_URL || process.argv[2] || 'https://keeptxred.com').replace(/\/$/, '');
const failures = [];

async function fetchCheck(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, { redirect: options.redirect || 'follow' });
  const text = options.body === false ? '' : await response.text();
  if (options.status && response.status !== options.status) {
    failures.push(`${path}: expected HTTP ${options.status}, got ${response.status}`);
  } else if (!options.status && !response.ok) {
    failures.push(`${path}: HTTP ${response.status}`);
  }
  for (const token of options.includes || []) {
    if (!text.includes(token)) failures.push(`${path}: missing ${JSON.stringify(token)}`);
  }
  for (const token of options.excludes || []) {
    if (text.includes(token)) failures.push(`${path}: unexpectedly contains ${JSON.stringify(token)}`);
  }
  return { response, text };
}

await fetchCheck('/bills', {
  includes: ['Texas Bills', 'legislature', 'status'],
});

const sitemap = await fetchCheck('/sitemap-bills.xml', {
  includes: ['<urlset', '/bills/texas/'],
});

const match = sitemap.text.match(/<loc>(https?:\/\/[^<]+\/bills\/texas\/[^<]+)<\/loc>/i);
if (!match) {
  failures.push('/sitemap-bills.xml: no bill URL found for detail-page verification');
} else {
  const billUrl = new URL(match[1]);
  const billPath = `${billUrl.pathname}${billUrl.search}`;
  const bill = await fetchCheck(billPath, {
    includes: ['Bill overview', 'Current status', 'Legislative timeline', 'Documents'],
    excludes: ['PGRST', 'Internal Server Error'],
  });
  const canonical = bill.text.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1]
    || bill.text.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1];
  if (!canonical) failures.push(`${billPath}: canonical link missing`);
  else if (canonical !== `${baseUrl}${billPath}`) failures.push(`${billPath}: canonical mismatch (${canonical})`);
}

await fetchCheck('/sitemap-committees.xml', { includes: ['<urlset'] });
await fetchCheck('/sitemap-legislature.xml', { includes: ['<urlset'] });
await fetchCheck('/sitemap.xml', {
  includes: ['sitemap-bills.xml', 'sitemap-committees.xml', 'sitemap-legislature.xml'],
});

const legacy = await fetch(`${baseUrl}/article/production-verification-placeholder`, { redirect: 'manual' });
if (![301, 302, 307, 308].includes(legacy.status)) {
  failures.push(`/article/:slug compatibility route: expected redirect, got HTTP ${legacy.status}`);
} else {
  const location = legacy.headers.get('location') || '';
  if (!location.includes('/news/production-verification-placeholder')) {
    failures.push(`/article/:slug compatibility route: unexpected location ${location}`);
  }
}

for (const path of ['/admin/bills/relationships', '/admin/bills/enrichment', '/admin/bills/opportunities']) {
  await fetchCheck(path, {
    includes: ['Restricted'],
    excludes: ['PGRST', 'Internal Server Error'],
  });
}

if (failures.length) {
  console.error('Production legislative verification failed:\n' + failures.map((item) => `- ${item}`).join('\n'));
  process.exit(1);
}

console.log(`Production legislative verification passed for ${baseUrl}.`);
