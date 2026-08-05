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
  'src/lib/property-address-lookup.ts',
  'src/routes/api/public/property-address-lookup.ts',
  'src/data/texas-data-center.ts',
  'src/data/seo/mortgageCalculatorSEO.ts',
  'src/data/sitemap/mortgageCalculatorSitemap.ts',
  'src/lib/analytics/mortgageCalculatorAnalytics.ts',
];

for (const file of retiredFiles) {
  if (fs.existsSync(file)) errors.push(`Retired lifestyle implementation returned: ${file}`);
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
