import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/county-appraisal-districts-explained")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/learn/appraisal-districts${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
