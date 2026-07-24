import { createFileRoute } from "@tanstack/react-router";
import TexasMortgagePayoffPage from "@/pages/mortgage/TexasMortgagePayoffPage";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Mortgage Payoff Calculator";
const description = "See how extra monthly or one-time mortgage payments may shorten a Texas home loan, reduce interest, and change the projected payoff date.";

export const Route = createFileRoute("/texas-mortgage-payoff-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-mortgage-payoff-calculator" }),
  component: TexasMortgagePayoffPage,
});
