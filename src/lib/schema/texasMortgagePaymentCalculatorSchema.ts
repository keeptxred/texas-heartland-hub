import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
const definition = getPhaseCalculatorDefinition("texasMortgagePayment");
export const texasMortgagePaymentCalculatorSchema = { "@context":"https://schema.org", "@type":"WebApplication", name:definition.title, description:definition.description, applicationCategory:"FinanceApplication", operatingSystem:"Any", url:`https://www.keeptxred.com${definition.slug}` };
export const texasMortgagePaymentCalculatorFAQSchema = { "@context":"https://schema.org", "@type":"FAQPage", mainEntity:definition.faq.map(item => ({ "@type":"Question", name:item.question, acceptedAnswer:{ "@type":"Answer", text:item.answer } })) };
