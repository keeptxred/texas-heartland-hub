import { createFileRoute } from "@tanstack/react-router";
import TexasDownPaymentPage from "@/pages/downPayment/TexasDownPaymentPage";

export const Route = createFileRoute("/texas-down-payment-calculator")({ component: TexasDownPaymentPage });
