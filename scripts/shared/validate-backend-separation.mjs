import fs from 'node:fs';

const redirects = new Map([
  ['src/routes/explore.tsx', 'https://texasdefined.com${location.pathname}'],
  ['src/routes/tax-calculator.tsx', 'https://texasdefined.com/decide/property-taxes'],
  ['src/routes/texas-property-tax-increase-calculator.tsx', 'https://texasdefined.com/decide/property-taxes'],
  ['src/routes/texas-property-tax-protest-guide.tsx', 'https://texasdefined.com/do/property-tax-protest'],
  ['src/routes/moving-to-texas-checklist.tsx', 'https://texasdefined.com${location.pathname}'],
  ['src/routes/moving-to-texas.tsx', 'https://texasdefined.com/moving-to-texas'],
  ['src/routes/texas-financial-tools.tsx', 'https://texasdefined.com/decide/financial-tools'],
]);
const errors = [];
for (const [file, target] of redirects) {
  if (!fs.existsSync(file)) { errors.push(`Missing separation redirect: ${file}`); continue; }
  const source = fs.readFileSync(file, 'utf8');
  if (!source.includes('statusCode: 301')) errors.push(`${file} must remain a permanent 301 redirect.`);
  if (!source.includes(target)) errors.push(`${file} must redirect to ${target}.`);
  for (const forbidden of ['component:', 'canonicalLink(', 'buildMeta(', 'TaxCalculator', 'MovingChecklist', 'TexasFinancialToolsPage', 'MovingToTexasPage']) {
    if (source.includes(forbidden)) errors.push(`${file} contains duplicate page implementation token ${forbidden}.`);
  }
}
const sitemapPath = 'src/routes/sitemap-pages[.]xml.ts';
if (!fs.existsSync(sitemapPath)) errors.push(`Missing ${sitemapPath}`);
else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  for (const path of ['/tax-calculator', '/texas-property-tax-protest-guide', '/texas-property-tax-increase-calculator', '/moving-to-texas-checklist', '/moving-to-texas', '/texas-financial-tools']) {
    if (sitemap.includes(`\"${path}\"`)) errors.push(`Redirected lifestyle URL remains in KeepTXRed sitemap: ${path}`);
  }
}
if (fs.existsSync('src/platform/governance-persistence.ts')) errors.push('KeepTXRed must not restore the cross-site governance database adapter.');
if (errors.length) {
  console.error(`KeepTXRed backend-separation validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('KeepTXRed lifestyle redirects, sitemap exclusions, and independent backend boundary are valid.');
