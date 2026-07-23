import { createFileRoute } from "@tanstack/react-router";
import TexasMortgagePayoffPage from "@/pages/mortgage/TexasMortgagePayoffPage";

export const Route = createFileRoute("/texas-mortgage-payoff-calculator")({ component: TexasMortgagePayoffPage });
