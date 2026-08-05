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
  'src/components/moving-checklist.tsx',
  'src/lib/moving-checklist.ts',
  'src/components/vehicle-registration-guide.tsx',
  'src/lib/vehicle-registration.ts',
  'src/lib/__tests__/moving-resources.test.ts',
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

if (errors.length) {
  console.error(`Retired lifestyle-code validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Retired lifestyle implementations remain absent and registry ownership is site-specific.`);
