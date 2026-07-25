import { createFileRoute } from "@tanstack/react-router";
import TexasSalaryPage from "@/pages/income/TexasSalaryPage";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Salary Calculator";
const description = "Estimate Texas take-home pay and household affordability using salary, federal taxes, payroll deductions, benefits, and recurring living expenses.";

export const Route = createFileRoute("/texas-salary-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-salary-calculator" }),
  component: TexasSalaryPage,
});
