import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-data/$datasetSlug")({
  beforeLoad: ({ params, location }) => {
    throw redirect({
      href: `https://texasdefined.com/texas-data/${encodeURIComponent(params.datasetSlug)}${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
