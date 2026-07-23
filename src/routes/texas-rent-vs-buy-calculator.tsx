import { createFileRoute } from "@tanstack/react-router";
import TexasRentVsBuyPage from "@/pages/home/TexasRentVsBuyPage";

export const Route = createFileRoute("/texas-rent-vs-buy-calculator")({ component: TexasRentVsBuyPage });
