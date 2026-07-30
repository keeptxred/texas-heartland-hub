import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/historic-sites")({
  beforeLoad: () => {
    throw redirect({
      to: "/explore/search",
      search: { page: 1, pageSize: 24, sort: "relevance", types: ["historic_site"] },
      statusCode: 301,
    });
  },
});
