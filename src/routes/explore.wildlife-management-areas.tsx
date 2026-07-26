import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/wildlife-management-areas")({
  beforeLoad: () => {
    throw redirect({
      to: "/explore/search",
      search: { page: 1, pageSize: 24, sort: "relevance", q: "wildlife management area" },
      statusCode: 301,
    });
  },
});
