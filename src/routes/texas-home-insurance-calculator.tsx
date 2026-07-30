import { createFileRoute } from "@tanstack/react-router";
import AdditionalCalculator from "@/components/calculators/AdditionalCalculator";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Home Insurance Calculator";
const description =
  "Estimate Texas homeowners insurance costs using replacement value, regional wind and hail risk, roof age, construction, claims history, deductible savings, and optional flood coverage.";

export const Route = createFileRoute("/texas-home-insurance-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-home-insurance-calculator", category: "InsuranceApplication" }),
  component: () => <AdditionalCalculator calculatorKey="homeInsurance" />,
});
