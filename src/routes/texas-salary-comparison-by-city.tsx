import { createFileRoute } from "@tanstack/react-router";
import AdditionalCalculator from "@/components/calculators/AdditionalCalculator";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Salary Comparison by City";
const description =
  "Compare cost-adjusted salary and purchasing power when moving from another city to Houston, Dallas, Austin, San Antonio, Fort Worth, or another Texas community.";

export const Route = createFileRoute("/texas-salary-comparison-by-city")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-salary-comparison-by-city" }),
  component: () => (
    <AdditionalCalculator
      calculatorKey="salaryComparison"
      title={title}
      description={description}
      slug="/texas-salary-comparison-by-city"
    />
  ),
});
