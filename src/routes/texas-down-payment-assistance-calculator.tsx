import { createFileRoute } from "@tanstack/react-router";
import AdditionalCalculator from "@/components/calculators/AdditionalCalculator";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Down Payment Assistance Calculator";
const description =
  "Estimate illustrative Texas down-payment assistance, buyer cash needs, remaining down payment, and closing funds before speaking with an approved program lender.";

export const Route = createFileRoute("/texas-down-payment-assistance-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-down-payment-assistance-calculator" }),
  component: () => <AdditionalCalculator calculatorKey="downPaymentAssistance" />,
});
