import fs from "node:fs";
import path from "node:path";

const calculators = [
  ["mortgage","mortgageCalculator","mortgage","texasMortgageData","mortgage","Mortgage"],
  ["propertyTax","propertyTaxCalculator","propertyTax","texasPropertyTaxData","propertyTax","PropertyTax"],
  ["homeInsurance","homeInsuranceCalculator","homeInsurance","texasHomeInsuranceData","homeInsurance","HomeInsurance"],
  ["homeAffordability","homeAffordabilityCalculator","homeAffordability","texasHomeAffordabilityData","homeAffordability","HomeAffordability"],
  ["closingCost","closingCostCalculator","closingCost","texasClosingCostData","closingCost","ClosingCost"],
  ["utilityCost","utilityCostCalculator","utilityCost","texasUtilityCostData","utilityCost","UtilityCost"],
  ["costOfLiving","costOfLivingCalculator","costOfLiving","texasCostOfLivingData","costOfLiving","CostOfLiving"],
  ["salaryComparison","salaryComparisonCalculator","salaryComparison","texasSalaryComparisonData","salaryComparison","SalaryComparison"],
  ["movingCost","movingCostCalculator","movingCost","texasMovingCostData","movingCost","MovingCost"],
  ["propertyTaxImpact","propertyTaxImpactCalculator","propertyTaxImpact","texasPropertyTaxImpactData","propertyTaxImpact","PropertyTaxImpact"],
  ["texasMortgagePayment","texasMortgagePaymentCalculator","texasMortgagePayment","texasMortgagePaymentData","texasMortgagePayment","TexasMortgagePayment"],
  ["texasRentVsBuy","texasRentVsBuyCalculator","texasRentVsBuy","texasRentVsBuyData","texasRentVsBuy","TexasRentVsBuy"],
  ["texasDownPaymentAssistance","texasDownPaymentAssistanceCalculator","texasDownPaymentAssistance","texasDownPaymentAssistanceData","texasDownPaymentAssistance","TexasDownPaymentAssistance"],
  ["texasClosingCost","texasClosingCostCalculator","texasClosingCost","texasClosingCostData","texasClosingCost","TexasClosingCost"],
  ["texasPropertyTaxCounty","texasPropertyTaxCountyCalculator","texasPropertyTaxCounty","texasPropertyTaxCountyData","texasPropertyTaxCounty","TexasPropertyTaxCounty"],
];

const write = (file, content) => { fs.mkdirSync(path.dirname(file), { recursive:true }); if (!fs.existsSync(file)) fs.writeFileSync(file, content); };
for (const [key, engine, typeName, dataName, folder, component] of calculators) {
  write(`src/lib/calculators/${engine}.ts`, `import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";\nexport const calculate${component} = (inputs: Record<string, number>) => getPhaseCalculatorDefinition("${key}").calculate(inputs);\nexport const validate${component}Inputs = (inputs: Record<string, number>) => Object.values(inputs).every(Number.isFinite);\n`);
  write(`src/types/calculators/${typeName}.ts`, `import type { PhaseCalculatorField, PhaseCalculatorResult } from "@/types/calculators/phaseCalculator";\nexport type ${component}Inputs = Record<string, number>;\nexport type ${component}Result = PhaseCalculatorResult;\nexport type ${component}Field = PhaseCalculatorField;\n`);
  write(`src/data/calculators/${dataName}.ts`, `import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";\nexport const ${dataName} = getPhaseCalculatorDefinition("${key}");\nexport default ${dataName};\n`);
  write(`src/components/calculators/${folder}/${component}BreakdownTable.tsx`, `import React from "react";\nimport type { PhaseCalculatorResult } from "@/types/calculators/phaseCalculator";\nexport default function ${component}BreakdownTable({ results }: { results: PhaseCalculatorResult[] }) { return <div className="overflow-hidden rounded-xl border"><table className="w-full text-sm"><tbody>{results.map(row => <tr className="border-b last:border-0" key={row.label}><th className="px-4 py-3 text-left">{row.label}</th><td className="px-4 py-3 text-right">{row.value.toLocaleString("en-US", { style: row.type === "percent" ? "decimal" : "currency", currency:"USD", maximumFractionDigits:2 })}{row.type === "percent" ? "%" : ""}</td></tr>)}</tbody></table></div>; }\n`);
  write(`src/pages/calculators/Texas${component.replace(/^Texas/,"")}Calculator.tsx`, `import React from "react";\nimport PhaseCalculator from "@/components/calculators/PhaseCalculator";\nexport default function Texas${component.replace(/^Texas/,"")}Calculator() { return <PhaseCalculator calculatorKey="${key}" />; }\n`);
  write(`src/lib/schema/${engine}Schema.ts`, `import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";\nconst definition = getPhaseCalculatorDefinition("${key}");\nexport const ${engine}Schema = { "@context":"https://schema.org", "@type":"WebApplication", name:definition.title, description:definition.description, applicationCategory:"FinanceApplication", operatingSystem:"Any", url:\`https://www.keeptxred.com\${definition.slug}\` };\nexport const ${engine}FAQSchema = { "@context":"https://schema.org", "@type":"FAQPage", mainEntity:definition.faq.map(item => ({ "@type":"Question", name:item.question, acceptedAnswer:{ "@type":"Answer", text:item.answer } })) };\n`);
  write(`src/components/calculators/${folder}/${component}SEO.tsx`, `import React from "react";\nimport { Helmet } from "react-helmet-async";\nimport { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";\nexport default function ${component}SEO() { const d=getPhaseCalculatorDefinition("${key}"); return <Helmet><title>{d.title} | Keep TX Red</title><meta name="description" content={d.description}/><link rel="canonical" href={\`https://www.keeptxred.com\${d.slug}\`}/></Helmet>; }\n`);
  write(`src/components/calculators/${folder}/${component}CalculatorPage.tsx`, `import React from "react";\nimport ${component}SEO from "./${component}SEO";\nimport Calculator from "@/pages/calculators/Texas${component.replace(/^Texas/,"")}Calculator";\nexport default function ${component}CalculatorPage() { return <><${component}SEO/><Calculator/></>; }\n`);
}
