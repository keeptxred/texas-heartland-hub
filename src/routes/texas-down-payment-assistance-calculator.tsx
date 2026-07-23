import { createFileRoute } from "@tanstack/react-router";
import AdditionalCalculator from "@/components/calculators/AdditionalCalculator";

export const Route = createFileRoute("/texas-down-payment-assistance-calculator")({
  component: () => <AdditionalCalculator calculatorKey="downPaymentAssistance" />,
});
