import fs from 'node:fs';

const calculatorSlugs=['texas-mortgage-calculator','texas-home-affordability-calculator','texas-rent-vs-buy-calculator','texas-cost-of-living-calculator','texas-salary-calculator','texas-moving-cost-calculator','texas-utility-cost-calculator','texas-home-insurance-calculator','texas-down-payment-calculator','texas-closing-cost-calculator','texas-home-equity-calculator','texas-home-equity-growth-calculator','texas-mortgage-payoff-calculator','texas-refinance-savings-calculator','texas-homeownership-cost-calculator','texas-budget-planner','texas-down-payment-assistance-calculator','texas-salary-comparison-by-city'];
const lifestyleSlugs=['texas-first-time-homebuyer-programs','texas-sales-tax-explained','find-my-dmv','find-my-school-district','texas-living'];
const redirects=new Map([
  ['src/routes/explore.tsx','https://texasdefined.com${location.pathname}'],
  ['src/routes/tax-calculator.tsx','https://texasdefined.com/decide/property-taxes'],
  ['src/routes/texas-property-tax-increase-calculator.tsx','https://texasdefined.com/decide/property-taxes'],
  ['src/routes/texas-property-tax-protest-guide.tsx','https://texasdefined.com/do/property-tax-protest'],
  ['src/routes/moving-to-texas-checklist.tsx','https://texasdefined.com${location.pathname}'],
  ['src/routes/moving-to-texas.tsx','https://texasdefined.com/moving-to-texas'],
  ['src/routes/texas-financial-tools.tsx','https://texasdefined.com/decide/financial-tools'],
  ['src/routes/texas-resources.tsx','https://texasdefined.com/texas-resources'],
  ['src/routes/texas-data.tsx','https://texasdefined.com/texas-data'],
  ['src/routes/news.non-political.tsx','https://texasdefined.com/texas-living'],
  ...calculatorSlugs.map((slug)=>[`src/routes/${slug}.tsx`,`https://texasdefined.com/${slug}`]),
  ...lifestyleSlugs.map((slug)=>[`src/routes/${slug}.tsx`,`https://texasdefined.com/${slug}`]),
]);
const dynamic=[
  ['src/routes/texas-resources.topic.$topicId.tsx','https://texasdefined.com/texas-resources?q='],
  ['src/routes/texas-resources.journey.$journeyId.tsx','https://texasdefined.com/texas-resources?q='],
  ['src/routes/texas-resources.type.$type.tsx','https://texasdefined.com/texas-resources?q='],
  ['src/routes/texas-data.$datasetSlug.tsx','https://texasdefined.com/texas-data/'],
];
const errors=[];
for(const [file,target] of [...redirects,...dynamic]){
  if(!fs.existsSync(file)){errors.push(`Missing separation redirect: ${file}`);continue}
  const source=fs.readFileSync(file,'utf8');
  if(!source.includes('status: 301')&&!source.includes('statusCode: 301'))errors.push(`${file} must remain a permanent redirect.`);
  if(!source.includes(target))errors.push(`${file} must redirect to ${target}.`);
  for(const forbidden of ['component:','canonicalLink(','buildMeta(','SharedEntityCard','SharedResourceSearch','TEXAS_DATASETS','getTexasDataset','getDailyArticles(','NonPoliticalPage'])if(source.includes(forbidden))errors.push(`${file} contains retired platform implementation token ${forbidden}.`);
}
const texasNamespace='src/routes/texas.tsx';
if(!fs.existsSync(texasNamespace))errors.push(`Missing ${texasNamespace}`);else{
  const source=fs.readFileSync(texasNamespace,'utf8');
  for(const token of ['statusCode: 301','https://texasdefined.com','/texas-living','replace(/^\\/texas/'])if(!source.includes(token))errors.push(`${texasNamespace} missing permanent namespace redirect token ${token}.`);
  if(source.includes('Outlet'))errors.push(`${texasNamespace} must not restore the KeepTXRed lifestyle namespace.`);
}
const sitemapPath='src/routes/sitemap-pages[.]xml.ts';
if(!fs.existsSync(sitemapPath))errors.push(`Missing ${sitemapPath}`);else{
  const sitemap=fs.readFileSync(sitemapPath,'utf8');
  for(const path of ['/news/non-political','/texas','/texas-resources','/texas-data','/texas/property-taxes-2026','/texas/moving-to-texas-2026',...calculatorSlugs.map((s)=>`/${s}`),...lifestyleSlugs.map((s)=>`/${s}`)])if(sitemap.includes(`\"${path}\"`))errors.push(`Migrated lifestyle URL remains in sitemap: ${path}`);
  for(const token of ['topicsForSite(','journeysForSite(','TEXAS_DATASETS','RESOURCE_TYPES'])if(sitemap.includes(token))errors.push(`Sitemap still generates retired lifestyle platform URLs: ${token}`);
}
const navigationFiles=['src/components/site-header.tsx','src/components/site-footer.tsx'];
for(const file of navigationFiles){
  if(!fs.existsSync(file)){errors.push(`Missing navigation file: ${file}`);continue}
  const source=fs.readFileSync(file,'utf8');
  for(const token of ['/texas-living','/texas-financial-tools','/tax-calculator','Texas Living','Texas Tools'])if(source.includes(token))errors.push(`${file} still advertises migrated lifestyle destination ${token}.`);
}
const aboutPath='src/routes/about-keep-texas-red.tsx';
if(!fs.existsSync(aboutPath))errors.push(`Missing ${aboutPath}`);else{
  const source=fs.readFileSync(aboutPath,'utf8');
  for(const token of ['/find-my-dmv','/find-my-school-district','/tax-calculator','relocation tools','people moving to Texas'])if(source.includes(token))errors.push(`${aboutPath} still presents KeepTXRed as the lifestyle platform: ${token}.`);
  for(const required of ['/bills','/texas-legislature','/representatives','NewsMediaOrganization'])if(!source.includes(required))errors.push(`${aboutPath} missing KeepTXRed mission token ${required}.`);
}
const normalizedIngest='src/lib/ingest-and-normalize.functions.ts';
if(!fs.existsSync(normalizedIngest))errors.push(`Missing ${normalizedIngest}`);else{
  const source=fs.readFileSync(normalizedIngest,'utf8');
  if(!source.includes('inferKeepTxRedDomain(category, haystack)'))errors.push(`${normalizedIngest} must classify ownership from full story context.`);
  if(source.includes('inferKeepTxRedDomain(category),'))errors.push(`${normalizedIngest} must not classify ownership from the category label alone.`);
}
const platformDir='src/shared/texas-platform';
if(fs.existsSync(platformDir)){
  const retired=fs.readdirSync(platformDir).filter((name)=>name.startsWith('texas-life-'));
  if(retired.length)errors.push(`Retired Texas-life modules remain: ${retired.join(', ')}`);
  const barrel=fs.readFileSync(`${platformDir}/index.ts`,'utf8');
  if(barrel.includes('texas-life-'))errors.push('Texas platform barrel must not export retired Texas-life modules.');
}
if(fs.existsSync('src/platform/governance-persistence.ts'))errors.push('Cross-site governance database adapter must not return.');
if(errors.length){console.error(`KeepTXRed backend-separation validation failed (${errors.length}):`);for(const error of errors)console.error(`- ${error}`);process.exit(1)}
console.log(`KeepTXRed ${redirects.size+dynamic.length+1} lifestyle, platform, namespace, navigation, and ingestion boundaries are protected.`);
