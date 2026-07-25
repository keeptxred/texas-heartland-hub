import { createFileRoute } from "@tanstack/react-router";
import TexasDownPaymentPage from "@/pages/downPayment/TexasDownPaymentPage";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Down Payment Calculator";
const description = "Compare Texas home down-payment percentages, loan amounts, estimated cash needs, and monthly payment effects before choosing a purchase target.";

export const Route = createFileRoute("/texas-down-payment-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-down-payment-calculator" }),
  component: TexasDownPaymentPage,
});
