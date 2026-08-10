import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/texas-salary-calculator")({ beforeLoad: ({ location }) => { throw redirect({ href: `https://texasdefined.com/texas-salary-calculator${location.searchStr || ""}`, statusCode: 301 }); } });
