import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/texas-rent-vs-buy-calculator")({ beforeLoad: ({ location }) => { throw redirect({ href: `https://texasdefined.com/texas-rent-vs-buy-calculator${location.searchStr || ""}`, statusCode: 301 }); } });
