import { remainingTexasTools } from "@/data/remainingTexasTools";

export interface CalculatorDirectoryItem { id:string; title:string; slug:string; description:string; category:"Housing"|"Taxes"|"Insurance"|"Utilities"|"Relocation"|"Financial"; icon?:string; keywords:string[]; featured?:boolean; }

const coreCalculators: CalculatorDirectoryItem[] = [
  { id:"mortgage-calculator", title:"Texas Mortgage Calculator", slug:"/tools/mortgage-calculator", description:"Estimate your Texas mortgage payment including principal, interest, property taxes, insurance, PMI, and HOA costs.", category:"Housing", icon:"Home", keywords:["texas mortgage calculator","home payment calculator","monthly mortgage payment texas","buying a house in texas"], featured:true },
  { id:"property-tax-calculator", title:"Texas Property Tax Calculator", slug:"/tools/property-tax-calculator", description:"Estimate Texas property taxes using home value, tax rates, and homestead exemptions.", category:"Taxes", icon:"Landmark", keywords:["texas property tax calculator","texas property taxes","homestead exemption texas","property tax estimate"], featured:true },
  { id:"home-insurance-calculator", title:"Texas Home Insurance Calculator", slug:"/tools/home-insurance-calculator", description:"Estimate homeowners insurance costs based on home value, coverage, deductibles, and Texas risk factors.", category:"Insurance", icon:"Shield", keywords:["texas homeowners insurance calculator","home insurance cost texas","texas insurance rates"], featured:true },
  { id:"home-affordability-calculator", title:"Texas Home Affordability Calculator", slug:"/tools/home-affordability-calculator", description:"Find out how much home you can afford in Texas based on income, debts, mortgage rates, taxes, and insurance.", category:"Housing", icon:"Calculator", keywords:["how much house can i afford texas","texas affordability calculator","home buying calculator"], featured:true },
  { id:"closing-cost-calculator", title:"Texas Closing Cost Calculator", slug:"/tools/closing-cost-calculator", description:"Estimate buyer closing costs in Texas including lender fees, title costs, prepaid taxes, and insurance.", category:"Housing", icon:"FileText", keywords:["texas closing costs","home buying costs texas","cash needed to buy house"] },
  { id:"utilities-calculator", title:"Texas Utilities Cost Calculator", slug:"/tools/texas-utilities-calculator", description:"Estimate monthly Texas utility costs including electricity, water, gas, internet, trash, and pool expenses.", category:"Utilities", icon:"Zap", keywords:["texas utility costs","cost of living texas","moving to texas expenses"] },
  { id:"texas-relocation-budget-planner", title:"Texas Relocation Budget Planner", slug:"/tools/texas-relocation-budget-planner", description:"Estimate moving costs, deposits, vehicle and license fees, travel, contingency funds, and emergency savings.", category:"Relocation", icon:"MapPinned", keywords:["texas relocation budget planner","cost to move to texas","texas moving cost calculator"], featured:true },
  { id:"texas-monthly-living-cost-calculator", title:"Texas Monthly Living Cost Calculator", slug:"/tools/texas-monthly-living-cost-calculator", description:"Build a complete monthly Texas household budget.", category:"Relocation", icon:"Wallet", keywords:["texas monthly living cost calculator","texas household budget","cost to live in texas"], featured:true },
  { id:"texas-commute-cost-calculator", title:"Texas Commute Cost Calculator", slug:"/tools/texas-commute-cost-calculator", description:"Estimate fuel, tolls, parking, vehicle wear, and time costs for a Texas commute.", category:"Financial", icon:"Car", keywords:["texas commute cost calculator","texas toll cost","commuting cost calculator"] },
  { id:"texas-vehicle-fees-estimator", title:"Texas Vehicle Registration & Fees Estimator", slug:"/tools/texas-vehicle-fees-estimator", description:"Estimate Texas vehicle registration, title-transfer, county, processing, and new-resident fees.", category:"Relocation", icon:"BadgeDollarSign", keywords:["texas vehicle registration fees","texas title transfer cost","new resident vehicle fees texas"] },
  { id:"texas-relocation-checklist-generator", title:"Texas Relocation Checklist Generator", slug:"/tools/texas-relocation-checklist-generator", description:"Generate a personalized moving-to-Texas checklist.", category:"Relocation", icon:"ListChecks", keywords:["texas relocation checklist","moving to texas checklist","texas new resident checklist"] },
  { id:"best-texas-city-finder", title:"Best Texas City Finder", slug:"/tools/best-texas-city-finder", description:"Rank major Texas metros based on your affordability, career, family, lifestyle, and commute priorities.", category:"Relocation", icon:"Map", keywords:["best texas city to live","where should i move in texas","texas city finder"], featured:true },
  { id:"texas-salary-relocation-calculator", title:"Texas Salary Relocation Calculator", slug:"/tools/texas-salary-relocation-calculator", description:"Estimate the Texas salary needed to preserve your current purchasing power.", category:"Financial", icon:"CircleDollarSign", keywords:["texas salary calculator","salary needed to move to texas","salary cost of living comparison"] },
  { id:"texas-cost-of-living-comparison", title:"Texas Cost of Living Comparison", slug:"/tools/texas-cost-of-living-comparison", description:"Compare current monthly spending with an estimated Texas equivalent.", category:"Relocation", icon:"Scale", keywords:["texas cost of living comparison","cost of living calculator texas","moving to texas savings"] },
  { id:"texas-electricity-plan-savings-calculator", title:"Texas Electricity Plan Savings Calculator", slug:"/tools/texas-electricity-plan-savings-calculator", description:"Compare Texas electricity plans using monthly usage, rates, and recurring fees.", category:"Utilities", icon:"Bolt", keywords:["texas electricity plan calculator","compare texas electricity rates","electric bill savings texas"] },
];

export const calculators: CalculatorDirectoryItem[] = [
  ...coreCalculators,
  ...remainingTexasTools.map((tool) => ({
    id: tool.id,
    title: tool.title,
    slug: tool.slug,
    description: tool.description,
    category: tool.category,
    icon: tool.mode === "planner" ? "ClipboardList" : tool.mode === "comparison" ? "Scale" : "Calculator",
    keywords: [tool.title.toLowerCase(), tool.id.replaceAll("-", " "), "texas calculator"],
  })),
];

export function getFeaturedCalculators(){return calculators.filter((calculator)=>calculator.featured)}
export function getCalculatorsByCategory(category:CalculatorDirectoryItem["category"]){return calculators.filter((calculator)=>calculator.category===category)}
export function getCalculatorBySlug(slug:string){return calculators.find((calculator)=>calculator.slug===slug)}
