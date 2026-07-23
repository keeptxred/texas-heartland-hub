import { createFileRoute } from "@tanstack/react-router";
import TexasSalaryPage from "@/pages/income/TexasSalaryPage";

export const Route = createFileRoute("/texas-salary-calculator")({ component: TexasSalaryPage });
