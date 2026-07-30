import { createFileRoute } from "@tanstack/react-router";
import AdditionalCalculator from "@/components/calculators/AdditionalCalculator";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Property Tax Increase Calculator";
const description =
  "Estimate how appraisal growth, homestead caps, exemptions, and combined tax-rate changes may increase or decrease a Texas property-tax bill.";

export const Route = createFileRoute("/texas-property-tax-increase-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-property-tax-increase-calculator" }),
  component: () => (
    <AdditionalCalculator
      calculatorKey="propertyTaxImpact"
      title={title}
      description={description}
      slug="/texas-property-tax-increase-calculator"
    />
  ),
});
