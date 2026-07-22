import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
const definition = getPhaseCalculatorDefinition("mortgage");
export const mortgageCalculatorSchema = { "@context":"https://schema.org", "@type":"WebApplication", name:definition.title, description:definition.description, applicationCategory:"FinanceApplication", operatingSystem:"Any", url:`https://www.keeptxred.com${definition.slug}` };
export const mortgageCalculatorFAQSchema = { "@context":"https://schema.org", "@type":"FAQPage", mainEntity:definition.faq.map(item => ({ "@type":"Question", name:item.question, acceptedAnswer:{ "@type":"Answer", text:item.answer } })) };
