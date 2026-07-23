import { createFileRoute } from "@tanstack/react-router";
import AdditionalCalculator from "@/components/calculators/AdditionalCalculator";

export const Route = createFileRoute("/texas-salary-comparison-by-city")({
  component: () => (
    <AdditionalCalculator
      calculatorKey="salaryComparison"
      title="Texas Salary Comparison by City"
      description="Compare cost-adjusted salary and purchasing power when moving between a current location and a Texas city."
      slug="/texas-salary-comparison-by-city"
    />
  ),
});
