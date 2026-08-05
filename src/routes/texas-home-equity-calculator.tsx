import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/texas-home-equity-calculator")({ beforeLoad: ({ location }) => { throw redirect({ href: `https://texasdefined.com${location.pathname}${location.searchStr || ""}`, statusCode: 301 }); } });
