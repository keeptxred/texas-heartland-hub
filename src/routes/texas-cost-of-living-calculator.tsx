import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/texas-cost-of-living-calculator")({ beforeLoad: ({ location }) => { throw redirect({ href: `https://texasdefined.com/texas-cost-of-living-calculator${location.searchStr || ""}`, statusCode: 301 }); } });
