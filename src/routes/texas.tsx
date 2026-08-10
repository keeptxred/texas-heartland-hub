import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas")({
  beforeLoad: ({ location }) => {
    const suffix = location.pathname === "/texas" ? "/texas-living" : location.pathname.replace(/^\/texas/, "");
    throw redirect({ href: `https://texasdefined.com${suffix}${location.searchStr || ""}`, statusCode: 301 });
  },
});
