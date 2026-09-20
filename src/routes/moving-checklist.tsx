import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/moving-checklist")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `https://texasdefined.com/moving-to-texas${location.searchStr || ""}`, statusCode: 301 });
  },
});
