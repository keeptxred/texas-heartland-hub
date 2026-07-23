import { createFileRoute } from "@tanstack/react-router";
import TexasMortgageCalculatorPage from "@/pages/mortgage/TexasMortgageCalculatorPage";

export const Route = createFileRoute("/texas-mortgage-calculator")({
  component: TexasMortgageCalculatorPage,
});
