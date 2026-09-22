import fs from 'node:fs';

const errors = [];

const retiredFiles = [
  'src/routes/-toolsRoutes.tsx',
  'src/routes/-calculatorRoutes.tsx',
  'src/pages/tools/ToolsIndex.tsx',
  'src/pages/tools/MortgageCalculator.tsx',
  'src/pages/tools/PropertyTaxCalculator.tsx',
  'src/pages/tools/HomeInsuranceCalculator.tsx',
  'src/pages/tools/HomeAffordabilityCalculator.tsx',
  'src/pages/tools/ClosingCostCalculator.tsx',
  'src/pages/tools/TexasUtilitiesCalculator.tsx',
  'src/components/calculators/AdditionalCalculator.tsx',
  'src/components/calculators/CalculatorAuthorityContent.tsx',
  'src/components/moving-checklist.tsx',
  'src/lib/moving-checklist.ts',
  'src/components/vehicle-registration-guide.tsx',
  'src/lib/vehicle-registration.ts',
  'src/lib/__tests__/moving-resources.test.ts',
  'src/components/tax-calculator.tsx',
  'src/components/homestead-exemption-guide.tsx',
  'src/lib/city-seo.ts',
  'src/data/texas-cities.ts',
  'src/components/city-page.tsx',
  'src/lib/static-article-body-upgrades.ts',
  'src/lib/static-article-body-upgrades.test.ts',
  'src/components/sports-coverage-placeholder.tsx',
  'src/lib/sports.functions.ts',
  'src/lib/sports-lifecycle.ts',
  'src/routes/api/public/hooks/generate-sports.ts',
  'src/routes/sitemap-dmv[.]xml.ts',
  'src/data/dmv-evergreen-sitemap-paths.ts',
  'src/pages/home/TexasHomeOwnershipCostPage.tsx',
  'src/components/home/TexasHomeOwnershipCostDashboard.tsx',
  'src/pages/homeAffordability/TexasHomeAffordabilityPage.tsx',
  'src/components/homeAffordability/TexasHomeAffordabilityCalculator.tsx',
  'src/pages/mortgage/TexasMortgageCalculatorPage.tsx',
  'src/components/mortgage/TexasMortgageCalculator.tsx',
  'src/data/seo/homeOwnershipCostSEO.ts',
  'src/data/sitemap/homeOwnershipCostSitemap.ts',
  'src/data/seo/homeAffordabilitySEO.ts',
  'src/data/sitemap/homeAffordabilitySitemap.ts',
  'src/lib/home/texasHomeOwnershipCostEngine.ts',
  'src/lib/home/texasHomeOwnershipCostHelpers.ts',
  'src/types/home/TexasHomeOwnershipCost.ts',
  'src/data/home/texasHomeOwnershipCostDefaults.ts',
  'src/lib/analytics/homeOwnershipCostAnalytics.ts',
  'src/lib/homeAffordability/texasHomeAffordabilityEngine.ts',
  'src/lib/homeAffordability/texasHomeAffordabilityHelpers.ts',
  'src/types/homeAffordability/TexasHomeAffordability.ts',
  'src/data/homeAffordability/texasHomeAffordabilityDefaults.ts',
  'src/lib/mortgage/texasMortgageEngine.ts',
  'src/lib/mortgage/texasMortgageHelpers.ts',
  'src/types/mortgage/TexasMortgageCalculator.ts',
  'src/data/mortgage/texasMortgageDefaults.ts',
  'src/pages/downPayment/TexasDownPaymentPage.tsx',
  'src/components/downPayment/TexasDownPaymentCalculator.tsx',
  'src/lib/downPayment/texasDownPaymentEngine.ts',
  'src/lib/downPayment/texasDownPaymentHelpers.ts',
  'src/types/downPayment/TexasDownPayment.ts',
  'src/data/downPayment/texasDownPaymentDefaults.ts',
  'src/data/seo/downPaymentSEO.ts',
  'src/data/sitemap/downPaymentSitemap.ts',
  'src/lib/analytics/downPaymentAnalytics.ts',
  'src/pages/mortgage/TexasRefinancePage.tsx',
  'src/components/mortgage/TexasRefinanceDashboard.tsx',
  'src/lib/mortgage/texasRefinanceEngine.ts',
  'src/lib/mortgage/texasRefinanceHelpers.ts',
  'src/types/mortgage/TexasRefinance.ts',
  'src/data/seo/refinanceSEO.ts',
  'src/data/sitemap/refinanceSitemap.ts',
  'src/lib/analytics/refinanceAnalytics.ts',
  'src/pages/mortgage/TexasMortgagePayoffPage.tsx',
  'src/components/mortgage/TexasMortgagePayoffDashboard.tsx',
  'src/lib/mortgage/texasMortgagePayoffEngine.ts',
  'src/lib/mortgage/texasMortgagePayoffHelpers.ts',
  'src/types/mortgage/TexasMortgagePayoff.ts',
  'src/data/seo/mortgagePayoffSEO.ts',
  'src/data/sitemap/mortgagePayoffSitemap.ts',
  'src/lib/analytics/mortgagePayoffAnalytics.ts',
  'src/pages/home/TexasRentVsBuyPage.tsx',
  'src/components/home/TexasRentVsBuyDashboard.tsx',
  'src/lib/home/texasRentVsBuyEngine.ts',
  'src/lib/home/texasRentVsBuyHelpers.ts',
  'src/types/home/TexasRentVsBuy.ts',
  'src/data/seo/rentVsBuySEO.ts',
  'src/data/sitemap/rentVsBuySitemap.ts',
  'src/lib/analytics/rentVsBuyAnalytics.ts',
  'src/pages/closingCosts/TexasClosingCostCalculatorPage.tsx',
  'src/components/closingCosts/TexasClosingCostCalculator.tsx',
  'src/lib/closingCosts/texasClosingCostEngine.ts',
  'src/lib/closingCosts/texasClosingCostHelpers.ts',
  'src/types/closingCosts/TexasClosingCostCalculator.ts',
  'src/data/closingCosts/texasClosingCostDefaults.ts',
  'src/data/seo/closingCostSEO.ts',
  'src/data/sitemap/closingCostSitemap.ts',
  'src/lib/analytics/closingCostAnalytics.ts',
  'src/pages/home/TexasHomeEquityPage.tsx',
  'src/components/home/TexasHomeEquityDashboard.tsx',
  'src/lib/home/texasHomeEquityEngine.ts',
  'src/lib/home/texasHomeEquityHelpers.ts',
  'src/types/home/TexasHomeEquity.ts',
  'src/data/home/texasHomeEquityDefaults.ts',
  'src/data/seo/homeEquitySEO.ts',
  'src/data/sitemap/homeEquitySitemap.ts',
  'src/lib/analytics/homeEquityAnalytics.ts',
  'src/lib/calculators/additionalCalculatorSuite.ts',
  'src/lib/calculators/__tests__/financialEngines.test.ts',
  'src/pages/budget/TexasBudgetPlannerPage.tsx',
  'src/components/budget/TexasBudgetDashboard.tsx',
  'src/lib/budget/texasBudgetEngine.ts',
  'src/lib/budget/texasBudgetHelpers.ts',
  'src/types/budget/TexasBudgetPlanner.ts',
  'src/data/budget/texasBudgetDefaults.ts',
  'src/data/seo/budgetSEO.ts',
  'src/data/sitemap/budgetSitemap.ts',
  'src/lib/analytics/budgetAnalytics.ts',
  'src/pages/cost/TexasCostOfLivingPage.tsx',
  'src/components/cost/TexasCostOfLivingDashboard.tsx',
  'src/lib/cost/texasCostOfLivingEngine.ts',
  'src/lib/cost/texasCostOfLivingHelpers.ts',
  'src/types/cost/TexasCostOfLiving.ts',
  'src/data/cost/texasCostOfLivingDefaults.ts',
  'src/data/seo/costOfLivingSEO.ts',
  'src/data/sitemap/costOfLivingSitemap.ts',
  'src/pages/income/TexasSalaryPage.tsx',
  'src/components/income/TexasSalaryDashboard.tsx',
  'src/lib/income/texasSalaryEngine.ts',
  'src/lib/income/texasSalaryHelpers.ts',
  'src/types/income/TexasSalaryCalculator.ts',
  'src/data/income/texasSalaryDefaults.ts',
  'src/data/seo/salarySEO.ts',
  'src/data/sitemap/salarySitemap.ts',
  'src/lib/analytics/salaryAnalytics.ts',
  'src/pages/equity/TexasEquityGrowthPage.tsx',
  'src/components/equity/TexasEquityGrowthDashboard.tsx',
  'src/lib/equity/texasEquityGrowthEngine.ts',
  'src/lib/equity/texasEquityGrowthHelpers.ts',
  'src/types/equity/TexasEquityGrowth.ts',
  'src/data/equity/texasEquityGrowthDefaults.ts',
  'src/data/seo/equityGrowthSEO.ts',
  'src/data/sitemap/equityGrowthSitemap.ts',
  'src/lib/analytics/equityGrowthAnalytics.ts',
  'docs/qa/budgetQA.md',
  'docs/qa/calculator-browser-accessibility-checklist.md',
  'docs/qa/closingCostQA.md',
  'docs/qa/costOfLivingQA.md',
  'docs/qa/downPaymentQA.md',
  'docs/qa/equityGrowthQA.md',
  'docs/qa/homeAffordabilityQA.md',
  'docs/qa/homeEquityQA.md',
  'docs/qa/homeOwnershipCostQA.md',
  'docs/qa/mortgageCalculatorQA.md',
  'docs/qa/mortgagePayoffQA.md',
  'docs/qa/refinanceQA.md',
  'docs/qa/rentVsBuyQA.md',
  'docs/qa/salaryQA.md',
  'src/components/calculators/CalculatorPageTemplate.tsx',
  'src/components/calculators/CalculatorFAQ.tsx',
  'src/components/calculators/RelatedTools.tsx',
  'src/components/calculators/CalculatorHero.tsx',
  'src/components/calculators/CalculatorDisclaimer.tsx',
  'src/components/calculators/CalculatorShareCard.tsx',
  'src/components/calculators/FinancialTrustPanel.tsx',
  'src/data/calculators.ts',
  'src/lib/calculators/calculatorTypes.ts',
  'src/data/home/texasRentVsBuyDefaults.ts',
  'src/data/mortgage/texasMortgagePayoffDefaults.ts',
  'src/data/mortgage/texasRefinanceDefaults.ts',
  'src/lib/analytics/calculatorAnalytics.ts',
  'src/lib/analytics/costOfLivingAnalytics.ts',
  'src/lib/analytics/homeAffordabilityAnalytics.ts',
  'src/lib/calculator-route-seo.ts',
  'src/lib/seo/calculatorSEO.ts',
  'src/types/calculators/additionalCalculator.ts',
  'tsconfig.calculators.json',
  'src/lib/property-address-lookup.ts',
  'src/routes/api/public/property-address-lookup.ts',
  'src/routes/texas.index.tsx',
  'src/routes/texas.$slug.tsx',
  'src/components/pillar-article.tsx',
  'src/data/texas-pillars.ts',
  'src/data/texas-issue-authority.ts',
  'src/data/texas-data-center.ts',
  'src/data/seo/mortgageCalculatorSEO.ts',
  'src/data/sitemap/mortgageCalculatorSitemap.ts',
  'src/lib/analytics/mortgageCalculatorAnalytics.ts',
];

for (const file of retiredFiles) {
  if (fs.existsSync(file)) errors.push(`Retired lifestyle implementation returned: ${file}`);
}

const retiredDirectories = [
  'src/components/calculators',
  'src/lib/calculators',
];

for (const directory of retiredDirectories) {
  if (fs.existsSync(directory)) errors.push(`Retired lifestyle implementation directory returned: ${directory}`);
}

const staticArticleUpgradeRouterPath = 'src/lib/static-article-body-upgrade-router.ts';
if (!fs.existsSync(staticArticleUpgradeRouterPath)) {
  errors.push(`Missing ${staticArticleUpgradeRouterPath}`);
} else {
  const source = fs.readFileSync(staticArticleUpgradeRouterPath, 'utf8');
  for (const token of [
    'applyStaticArticleBodyUpgrade',
    'ORIGINAL_HOMESTEAD_EDITOR_FINGERPRINT',
    'ORIGINAL_HOMESTEAD_INTRO_FINGERPRINT',
    'isCurrentLegacyHomesteadExplainer',
  ]) {
    if (source.includes(token)) {
      errors.push(`${staticArticleUpgradeRouterPath} restored retired homeowner homestead upgrade logic: ${token}`);
    }
  }
  for (const token of [
    'applyNoIncomeTaxArticleUpgrade',
    'applyVotingGuide2026Upgrade',
    'applyGunLawsCurrentUpgrade',
  ]) {
    if (!source.includes(token)) {
      errors.push(`${staticArticleUpgradeRouterPath} lost active KTR-owned reviewed upgrade: ${token}`);
    }
  }
}

const registryPath = 'src/shared/texas-platform/registry.ts';
if (!fs.existsSync(registryPath)) {
  errors.push(`Missing ${registryPath}`);
} else {
  const registry = fs.readFileSync(registryPath, 'utf8');
  const texasDefinedResources = [
    'property-tax-calculator',
    'moving-guide',
    'financial-tools',
    'cost-of-living',
    'mortgage-calculator',
    'budget-planner',
    'explore-texas',
    'texas-comparisons',
  ];
  const keepTxRedResources = [
    'find-representative',
    'texas-laws',
    'texas-bills',
    'texas-elections',
  ];

  for (const id of texasDefinedResources) {
    const record = registry.match(new RegExp(`\\{ id: '${id}'[^\\n]+`))?.[0] ?? '';
    if (!record) errors.push(`Missing registry resource ${id}.`);
    else {
      if (!record.includes('sites: TD')) errors.push(`${id} must be TexasDefined-only.`);
      if (record.includes('sites: KTR')) errors.push(`${id} must not be visible to KeepTXRed.`);
    }
  }

  for (const id of keepTxRedResources) {
    const record = registry.match(new RegExp(`\\{ id: '${id}'[^\\n]+`))?.[0] ?? '';
    if (!record) errors.push(`Missing registry resource ${id}.`);
    else {
      if (!record.includes('sites: KTR')) errors.push(`${id} must be KeepTXRed-only.`);
      if (record.includes('sites: TD')) errors.push(`${id} must not be visible to TexasDefined.`);
    }
  }

  for (const forbidden of [
    "sites: ['keeptxred', 'texasdefined']",
    "sites: ['texasdefined', 'keeptxred']",
  ]) {
    if (registry.includes(forbidden)) errors.push(`Registry restored shared production ownership: ${forbidden}`);
  }
}

const publicOwnershipFiles = [
  {
    path: 'src/components/texas-news-view.tsx',
    forbidden: [
      'cost-of-living updates',
      'Housing',
      'Growth & Migration',
      'Culture & Identity',
      '/texas/property-taxes-2026',
      '/texas/moving-to-texas-2026',
      '/tax-calculator',
    ],
    required: ['Texas News, Government & Public Policy', 'Statewide reporting', '/bills', '/representatives'],
  },
  {
    path: 'src/components/texas-business-view.tsx',
    forbidden: ['/tax-calculator', 'Related Tools', 'Relocations', 'Real Estate'],
    required: ['Texas Business, Regulation & Economic Policy', '/bills', '/texas-legislature', '/committees'],
  },
  {
    path: 'src/routes/keep-texas-red.tsx',
    forbidden: ['/tax-calculator', 'Property tax calculator by county', 'moving to Texas'],
    required: ['/elections', '/bills', '/texas-legislature', 'government accountability'],
  },
  {
    path: 'src/lib/static-no-income-tax-upgrade.ts',
    forbidden: [
      '/texas/property-taxes-2026',
      '/news/texas-property-tax-guide',
      '/news/homestead-exemption-explained',
      '/news/appraisal-protest-playbook',
      '/news/county-appraisal-districts-explained',
      '/tax-calculator',
    ],
    required: [
      'https://texasdefined.com/learn/property-taxes',
      '/news/texas-property-tax-laws-explained',
    ],
  },
];

for (const entry of publicOwnershipFiles) {
  if (!fs.existsSync(entry.path)) {
    errors.push(`Missing public ownership file: ${entry.path}`);
    continue;
  }
  const source = fs.readFileSync(entry.path, 'utf8');
  for (const token of entry.forbidden) {
    if (source.toLowerCase().includes(token.toLowerCase())) {
      errors.push(`${entry.path} restored TexasDefined-owned content: ${token}`);
    }
  }
  for (const token of entry.required) {
    if (!source.toLowerCase().includes(token.toLowerCase())) {
      errors.push(`${entry.path} missing KeepTXRed ownership token: ${token}`);
    }
  }
}

const retiredSportsRoutes = [
  ['src/routes/texas-sports.tsx', '/texas-sports'],
  ['src/routes/texas-sports.index.tsx', '/texas-sports/'],
  ['src/routes/texas-sports.$league.tsx', '/texas-sports/$league'],
  ['src/routes/texas-sports.team.$team.tsx', '/texas-sports/team/$team'],
  ['src/routes/texas-sports.topic.$topic.tsx', '/texas-sports/topic/$topic'],
];

for (const [routeFile, routePath] of retiredSportsRoutes) {
  if (!fs.existsSync(routeFile)) {
    errors.push(`Missing retired sports redirect route: ${routeFile}`);
    continue;
  }
  const source = fs.readFileSync(routeFile, 'utf8');
  for (const token of [
    `createFileRoute("${routePath}")`,
    'https://texasdefined.com/sports',
    'statusCode: 301',
    'location.searchStr',
  ]) {
    if (!source.includes(token)) {
      errors.push(`${routeFile} missing retired sports handoff token: ${token}`);
    }
  }
  for (const token of [
    'Keep TX Red Sports',
    'listSportsLatest',
    'listSportsTrending',
    'listSportsByLeague',
    'listSportsByTeam',
    'listSportsByTopic',
    'component:',
    'rel: "canonical"',
  ]) {
    if (source.includes(token)) {
      errors.push(`${routeFile} restored retired KeepTXRed sports product logic: ${token}`);
    }
  }
}

const startPath = 'src/start.ts';
if (!fs.existsSync(startPath)) {
  errors.push(`Missing ${startPath}`);
} else {
  const source = fs.readFileSync(startPath, 'utf8');
  const directAggiesHandoff = '["/texas-sports/team/aggies", "https://texasdefined.com/sports"]';
  const oldAggiesHop = '["/texas-sports/team/aggies", "/texas-sports/team/texas-am"]';
  if (!source.includes(directAggiesHandoff)) {
    errors.push(`${startPath} missing one-hop retired Aggies sports handoff`);
  }
  if (source.includes(oldAggiesHop)) {
    errors.push(`${startPath} restored two-hop retired Aggies sports redirect`);
  }
}

const sportsOwnershipMigrationPath = 'supabase/migrations/20260922133526_align_routine_sports_ownership_to_texasdefined.sql';
if (!fs.existsSync(sportsOwnershipMigrationPath)) {
  errors.push(`Missing ${sportsOwnershipMigrationPath}`);
} else {
  const source = fs.readFileSync(sportsOwnershipMigrationPath, 'utf8');
  for (const token of [
    'public.enforce_texasdefined_sports_ownership()',
    'zzzzzzzzzzzz_enforce_texasdefined_sports_ownership',
    "new.target_site := 'texasdefined'",
    "new.target_section := 'Sports'",
    'new.ready_for_rewrite := false',
    'new.internal_slug is not null or new.texasdefined_slug is not null',
    'internal_slug is null',
    'texasdefined_slug is null',
  ]) {
    if (!source.includes(token)) {
      errors.push(`${sportsOwnershipMigrationPath} missing current sports ownership token: ${token}`);
    }
  }
}

const retiredDmvRoutes = [
  ['src/routes/dmv.tsx', '/dmv', 'https://texasdefined.com/texas-dmv'],
  ['src/routes/dmv.cdl.tsx', '/dmv/cdl', 'https://texasdefined.com/texas-drivers-license'],
  ['src/routes/dmv.cdl-classes.tsx', '/dmv/cdl-classes', 'https://texasdefined.com/texas-drivers-license'],
  ['src/routes/dmv.real-id.tsx', '/dmv/real-id', 'https://texasdefined.com/texas-drivers-license'],
  ['src/routes/dmv.forms-downloads.tsx', '/dmv/forms-downloads', 'https://texasdefined.com/texas-dmv'],
  ['src/routes/dmv.cdl-endorsements.tsx', '/dmv/cdl-endorsements', 'https://texasdefined.com/texas-drivers-license'],
  ['src/routes/dmv.change-address.tsx', '/dmv/change-address', 'https://texasdefined.com/texas-drivers-license'],
  ['src/routes/dmv.license-status.tsx', '/dmv/license-status', 'https://texasdefined.com/texas-drivers-license'],
  ['src/routes/dmv.driver-license.tsx', '/dmv/driver-license', 'https://texasdefined.com/texas-drivers-license'],
  ['src/routes/dmv.dps-appointments.tsx', '/dmv/dps-appointments', 'https://texasdefined.com/texas-drivers-license'],
  ['src/routes/dmv.replace-lost-license.tsx', '/dmv/replace-lost-license', 'https://texasdefined.com/texas-drivers-license'],
  ['src/routes/dmv.texas-dmv-vs-dps.tsx', '/dmv/texas-dmv-vs-dps', 'https://texasdefined.com/texas-dmv'],
  ['src/routes/dmv.identification-card.tsx', '/dmv/identification-card', 'https://texasdefined.com/texas-drivers-license'],
  ['src/routes/dmv.driver-license-renewal.tsx', '/dmv/driver-license-renewal', 'https://texasdefined.com/texas-drivers-license'],
  ['src/routes/dmv.driver-license-documents.tsx', '/dmv/driver-license-documents', 'https://texasdefined.com/texas-drivers-license'],
];

for (const [routeFile, routePath, target] of retiredDmvRoutes) {
  if (!fs.existsSync(routeFile)) {
    errors.push(`Missing retired DMV redirect route: ${routeFile}`);
    continue;
  }
  const source = fs.readFileSync(routeFile, 'utf8');
  for (const token of [
    `createFileRoute("${routePath}")`,
    target,
    'statusCode: 301',
    'location.searchStr',
  ]) {
    if (!source.includes(token)) {
      errors.push(`${routeFile} missing retired DMV handoff token: ${token}`);
    }
  }
  for (const token of [
    'buildSeo',
    'SITE_URL',
    'component:',
    'FAQPage',
    'Related Keep TX Red guides',
    'HubBreadcrumbs',
    'rel: "canonical"',
  ]) {
    if (source.includes(token)) {
      errors.push(`${routeFile} restored retired KeepTXRed DMV product logic: ${token}`);
    }
  }
}

const sitemapIndexPath = 'src/routes/sitemap[.]xml.ts';
if (!fs.existsSync(sitemapIndexPath)) {
  errors.push(`Missing ${sitemapIndexPath}`);
} else {
  const source = fs.readFileSync(sitemapIndexPath, 'utf8');
  if (source.includes('sitemap-dmv.xml')) {
    errors.push(`${sitemapIndexPath} restored retired empty DMV sitemap advertisement`);
  }
}

const indexabilityGuardPath = 'scripts/seo/validate-indexability.mjs';
if (!fs.existsSync(indexabilityGuardPath)) {
  errors.push(`Missing ${indexabilityGuardPath}`);
} else {
  const source = fs.readFileSync(indexabilityGuardPath, 'utf8');
  if (source.includes('/sitemap-dmv.xml')) {
    errors.push(`${indexabilityGuardPath} restored retired DMV sitemap checks`);
  }
  const priorityBlock = source.match(/const INDEXABLE_PRIORITY_PATHS = \[([\s\S]*?)\];/)?.[1] ?? '';
  if (priorityBlock.includes('"/dmv"')) {
    errors.push(`${indexabilityGuardPath} restored retired /dmv as an indexable KTR priority page`);
  }
  const redirectBlock = source.match(/const REDIRECT_ALIASES = \[([\s\S]*?)\];/)?.[1] ?? '';
  if (!redirectBlock.includes('"/dmv"')) {
    errors.push(`${indexabilityGuardPath} must keep /dmv in the redirect alias exclusion list`);
  }
}

const retiredVehicleGuideRoutes = [
  ['src/routes/vehicles.plates.tsx', '/vehicles/plates', '#license-plates'],
  ['src/routes/vehicles.buying-a-car.tsx', '/vehicles/buying-a-car', '#title-transfer'],
  ['src/routes/vehicles.buying-selling.tsx', '/vehicles/buying-selling', '#title-transfer'],
  ['src/routes/vehicles.selling-a-car.tsx', '/vehicles/selling-a-car', '#title-transfer'],
  ['src/routes/vehicles.inspections.tsx', '/vehicles/inspections', ''],
  ['src/routes/vehicles.duplicate-titles.tsx', '/vehicles/duplicate-titles', '#title-transfer'],
  ['src/routes/vehicles.personalized-plates.tsx', '/vehicles/personalized-plates', '#license-plates'],
  ['src/routes/vehicles.private-party-sales.tsx', '/vehicles/private-party-sales', '#title-transfer'],
  ['src/routes/vehicles.commercial-fleet-irp.tsx', '/vehicles/commercial-fleet-irp', ''],
  ['src/routes/vehicles.bonded-titles.tsx', '/vehicles/bonded-titles', '#title-transfer'],
  ['src/routes/vehicles.disabled-parking.tsx', '/vehicles/disabled-parking', '#license-plates'],
  ['src/routes/vehicles.title-transfer.tsx', '/vehicles/title-transfer', '#title-transfer'],
  ['src/routes/vehicles.temporary-tags.tsx', '/vehicles/temporary-tags', ''],
  ['src/routes/vehicles.financial-responsibility.tsx', '/vehicles/financial-responsibility', ''],
  ['src/routes/vehicles.farm-antique-specialty.tsx', '/vehicles/farm-antique-specialty', '#license-plates'],
  ['src/routes/vehicles.auto-insurance-requirements.tsx', '/vehicles/auto-insurance-requirements', ''],
  ['src/routes/vehicles.inspections-emissions.tsx', '/vehicles/inspections-emissions', ''],
  ['src/routes/vehicles.salvage-rebuilt-titles.tsx', '/vehicles/salvage-rebuilt-titles', '#title-transfer'],
  ['src/routes/vehicles.liens-duplicate-corrected-titles.tsx', '/vehicles/liens-duplicate-corrected-titles', '#title-transfer'],
];

for (const [routeFile, routePath, hash] of retiredVehicleGuideRoutes) {
  if (!fs.existsSync(routeFile)) {
    errors.push(`Missing retired vehicle redirect route: ${routeFile}`);
    continue;
  }
  const source = fs.readFileSync(routeFile, 'utf8');
  for (const token of [
    `createFileRoute("${routePath}")`,
    'const TEXASDEFINED_PATH = "/texas-vehicle-registration"',
    `const TEXASDEFINED_HASH = "${hash}"`,
    'statusCode: 301',
    'location.searchStr',
  ]) {
    if (!source.includes(token)) {
      errors.push(`${routeFile} missing retired vehicle handoff token: ${token}`);
    }
  }
  for (const token of [
    'buildSeo',
    'SITE_URL',
    'component:',
    'FAQPage',
    'HubBreadcrumbs',
    'rel: "canonical"',
  ]) {
    if (source.includes(token)) {
      errors.push(`${routeFile} restored retired KeepTXRed vehicle-guide logic: ${token}`);
    }
  }
}

const vehicleParentPath = 'src/routes/vehicles.tsx';
if (!fs.existsSync(vehicleParentPath)) {
  errors.push(`Missing ${vehicleParentPath}`);
} else {
  const source = fs.readFileSync(vehicleParentPath, 'utf8');
  for (const token of [
    'PLATE_GUIDE_PATHS',
    'TITLE_GUIDE_PATHS',
    '"/texas-vehicle-registration"',
    '"#license-plates"',
    '"#title-transfer"',
    'location.searchStr',
    'statusCode: 301',
  ]) {
    if (!source.includes(token)) {
      errors.push(`${vehicleParentPath} missing retired vehicle-tree ownership token: ${token}`);
    }
  }
}

const migratedPracticalGuideMapPath = 'src/lib/migrated-practical-guide-canonical.ts';
const migratedPracticalGuideRoutes = [
  ['src/routes/texas-first-time-homebuyer-programs.tsx', '/texas-first-time-homebuyer-programs', 'https://texasdefined.com/texas-first-time-homebuyer-programs'],
  ['src/routes/news.moving-to-texas-guide.tsx', '/news/moving-to-texas-guide', 'https://texasdefined.com/article/moving-to-texas-what-nobody-tells-you'],
  ['src/routes/news.renting-vs-buying-in-texas.tsx', '/news/renting-vs-buying-in-texas', 'https://texasdefined.com/article/renting-vs-buying-in-texas'],
  ['src/routes/news.texas-house-down-payment-guide.tsx', '/news/texas-house-down-payment-guide', 'https://texasdefined.com/article/texas-house-down-payment-guide'],
  ['src/routes/news.true-cost-of-owning-a-home-in-texas.tsx', '/news/true-cost-of-owning-a-home-in-texas', 'https://texasdefined.com/article/true-cost-of-owning-a-home-in-texas'],
  ['src/routes/news.should-you-refinance-texas-mortgage.tsx', '/news/should-you-refinance-texas-mortgage', 'https://texasdefined.com/article/should-you-refinance-texas-mortgage'],
  ['src/routes/news.texas-home-equity-heloc-guide.tsx', '/news/texas-home-equity-heloc-guide', 'https://texasdefined.com/article/texas-home-equity-heloc-guide'],
  ['src/routes/news.texas-mortgage-payment-guide.tsx', '/news/texas-mortgage-payment-guide', 'https://texasdefined.com/article/texas-mortgage-payment-guide'],
  ['src/routes/news.texas-closing-costs-guide.tsx', '/news/texas-closing-costs-guide', 'https://texasdefined.com/article/texas-closing-costs-guide'],
  ['src/routes/news.texas-utility-costs-guide.tsx', '/news/texas-utility-costs-guide', 'https://texasdefined.com/article/texas-utility-costs-guide'],
  ['src/routes/news.texas-homeowners-insurance-guide.tsx', '/news/texas-homeowners-insurance-guide', 'https://texasdefined.com/article/texas-homeowners-insurance-guide'],
  ['src/routes/news.salary-needed-to-buy-a-house-in-texas.tsx', '/news/salary-needed-to-buy-a-house-in-texas', 'https://texasdefined.com/article/salary-needed-to-buy-a-house-in-texas'],
  ['src/routes/news.moving-to-houston-address-checklist.tsx', '/news/moving-to-houston-address-checklist', 'https://texasdefined.com/article/moving-to-houston-address-checklist'],
  ['src/routes/news.moving-to-dallas-fort-worth-guide.tsx', '/news/moving-to-dallas-fort-worth-guide', 'https://texasdefined.com/article/moving-to-dallas-fort-worth-guide'],
  ['src/routes/news.moving-to-san-antonio-guide.tsx', '/news/moving-to-san-antonio-guide', 'https://texasdefined.com/article/moving-to-san-antonio-guide'],
  ['src/routes/news.moving-to-austin-guide.tsx', '/news/moving-to-austin-guide', 'https://texasdefined.com/article/moving-to-austin-guide'],
  ['src/routes/news.moving-to-el-paso-guide.tsx', '/news/moving-to-el-paso-guide', 'https://texasdefined.com/article/moving-to-el-paso-guide'],
];

if (!fs.existsSync(migratedPracticalGuideMapPath)) {
  errors.push(`Missing ${migratedPracticalGuideMapPath}`);
} else {
  const ownershipMap = fs.readFileSync(migratedPracticalGuideMapPath, 'utf8');
  for (const [routeFile, legacyPath, target] of migratedPracticalGuideRoutes) {
    const mapEntry = `"${legacyPath}": "${target}"`;
    if (!ownershipMap.includes(mapEntry)) {
      errors.push(`${migratedPracticalGuideMapPath} missing exact ownership mapping: ${mapEntry}`);
    }
    if (!fs.existsSync(routeFile)) {
      errors.push(`Missing migrated practical guide redirect route: ${routeFile}`);
      continue;
    }
    const source = fs.readFileSync(routeFile, 'utf8');
    if (!source.includes(`createFileRoute("${legacyPath}")`)) {
      errors.push(`${routeFile} missing legacy route contract ${legacyPath}`);
    }
    if (!source.includes(target)) {
      errors.push(`${routeFile} must redirect directly to ${target}`);
    }
    if (!source.includes('statusCode: 301')) {
      errors.push(`${routeFile} must remain a permanent 301 redirect`);
    }
    if (!source.includes('location.searchStr')) {
      errors.push(`${routeFile} must preserve the incoming query string`);
    }
  }
}

const canonicalInternalRedirectsPath = 'src/lib/canonical-internal-redirects.ts';
if (!fs.existsSync(canonicalInternalRedirectsPath)) {
  errors.push(`Missing ${canonicalInternalRedirectsPath}`);
} else {
  const canonicalInternalRedirects = fs.readFileSync(canonicalInternalRedirectsPath, 'utf8');
  for (const token of [
    'MIGRATED_TOOL_CANONICALS',
    '...MIGRATED_TOOL_CANONICALS',
    'MIGRATED_PRACTICAL_GUIDE_CANONICALS',
    '...MIGRATED_PRACTICAL_GUIDE_CANONICALS',
  ]) {
    if (!canonicalInternalRedirects.includes(token)) {
      errors.push(`${canonicalInternalRedirectsPath} missing migrated ownership canonicalization token: ${token}`);
    }
  }
}

const retiredStaticNewsPath = 'src/lib/retired-static-news.ts';
if (!fs.existsSync(retiredStaticNewsPath)) {
  errors.push(`Missing ${retiredStaticNewsPath}`);
} else {
  const retiredStaticNews = fs.readFileSync(retiredStaticNewsPath, 'utf8');
  const redirectAllowlist = retiredStaticNews.match(/const RETIRED_STATIC_REDIRECT_SLUGS = new Set\(\[([\s\S]*?)\]\);/)?.[1] ?? '';
  if (!redirectAllowlist.includes('"moving-to-texas-guide"')) {
    errors.push('moving-to-texas-guide must stay in the retired-static redirect allowlist so its TexasDefined 301 can execute');
  }
}

const generatorPath = 'src/routes/api/public/hooks/generate-evergreen.ts';
if (!fs.existsSync(generatorPath)) {
  errors.push(`Missing ${generatorPath}`);
} else {
  const source = fs.readFileSync(generatorPath, 'utf8');
  const forbidden = [
    'Growth & Migration',
    'Culture & Identity',
    'Sports Culture',
    'Texas food culture',
    'Why more people are moving to Texas',
    '/texas/property-taxes-2026',
    '/texas/moving-to-texas-2026',
    '- /tax-calculator',
    'This is an evergreen Texas News piece about culture',
  ];
  for (const token of forbidden) {
    if (source.includes(token)) errors.push(`${generatorPath} restored lifestyle generation token: ${token}`);
  }
  const required = [
    'Government Accountability',
    'Business Policy',
    '/bills',
    '/texas-legislature',
    '/committees',
    'TexasDefined-owned lifestyle subject detected',
  ];
  for (const token of required) {
    if (!source.includes(token)) errors.push(`${generatorPath} missing policy-only generation token: ${token}`);
  }
}

if (errors.length) {
  console.error(`Retired lifestyle-code validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Retired lifestyle implementations remain absent and public generation ownership is site-specific.`);
