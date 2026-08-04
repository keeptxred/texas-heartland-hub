import fs from 'node:fs';
import {
  CONTENT_OWNERSHIP_RULES,
  decideCrossSiteContent,
  validateContentOwnershipRules,
} from '../../src/shared/platform-core/content-intelligence.ts';
import { PLATFORM_CORE_CONTRACT } from '../../src/shared/platform-core/contract.ts';
import upstream from '../../src/shared/platform-core/upstream.json' with { type: 'json' };
import consumer from '../../src/shared/platform-core/consumer.json' with { type: 'json' };

const errors: string[] = [];
if (upstream.version !== '0.3.0' || upstream.apiVersion !== '1.1') errors.push('KeepTXRed is not pinned to Phase 5 core 0.3.0/API 1.1.');
if (upstream.version !== PLATFORM_CORE_CONTRACT.packageVersion || upstream.apiVersion !== PLATFORM_CORE_CONTRACT.apiVersion) errors.push('Upstream and contract versions differ.');
if (consumer.coreCommit !== upstream.commit || consumer.packageVersion !== upstream.version || consumer.apiVersion !== upstream.apiVersion) errors.push('Consumer and upstream release pins differ.');
for (const capability of ['content-ownership', 'duplicate-content-prevention', 'cross-site-disposition']) {
  if (!consumer.capabilities.includes(capability)) errors.push(`KeepTXRed consumer capability missing: ${capability}`);
}
const ruleValidation = validateContentOwnershipRules();
errors.push(...ruleValidation.errors);
if (CONTENT_OWNERSHIP_RULES.some((rule) => rule.fullRepublicationAllowed)) errors.push('Full cross-site republication must remain disabled.');

const political = decideCrossSiteContent({
  id: 'political-original', title: 'Texas election update', domain: 'elections',
  sourceSite: 'KeepTXRed', targetSite: 'KeepTXRed', sourceCanonicalUrl: 'https://keeptxred.com/elections/example',
});
if (political.disposition !== 'publish-original' || political.canonicalOwner !== 'KeepTXRed') errors.push('KeepTXRed political ownership decision regressed.');
const lifestyle = decideCrossSiteContent({
  id: 'travel-copy', title: 'Texas state park guide', domain: 'travel',
  sourceSite: 'TexasDefined', targetSite: 'KeepTXRed', sourceCanonicalUrl: 'https://texasdefined.com/explore/example',
});
if (lifestyle.disposition !== 'cross-link-only' || lifestyle.canonicalOwner !== 'TexasDefined') errors.push('Lifestyle content is not routed back to TexasDefined.');
const duplicate = decideCrossSiteContent({
  id: 'duplicate', title: 'Duplicate article', domain: 'breaking-news',
  sourceSite: 'KeepTXRed', targetSite: 'TexasDefined', sourceCanonicalUrl: 'https://keeptxred.com/news/example',
  sourceFingerprint: 'fnv1a-12345678', contentFingerprint: 'fnv1a-12345678', derivativePurpose: 'news-update',
});
if (duplicate.disposition !== 'reject-duplicate') errors.push('Exact duplicate content is not rejected.');

const routePath = 'src/routes/api.content-disposition.ts';
if (!fs.existsSync(routePath)) errors.push('Missing KeepTXRed content disposition API.');
else {
  const route = fs.readFileSync(routePath, 'utf8');
  for (const symbol of ["createFileRoute('/api/content-disposition')", "targetSite: 'KeepTXRed'", 'preview-only', 'decideCrossSiteContent', 'validateContentOwnershipRules', '100_000', 'no-store', 'noindex, nofollow']) {
    if (!route.includes(symbol)) errors.push(`KeepTXRed content disposition API missing: ${symbol}`);
  }
  if (route.includes('writeFile') || route.includes('publish: true')) errors.push('Content disposition API must remain preview-only.');
}

if (errors.length) {
  console.error(`KeepTXRed content ownership validation failed (${errors.length}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log(`KeepTXRed content ownership validation passed (${CONTENT_OWNERSHIP_RULES.length} governed domains, core ${upstream.version}/${upstream.apiVersion}).`);
