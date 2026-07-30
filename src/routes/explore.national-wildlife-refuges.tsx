import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/national-wildlife-refuges")({
  beforeLoad: () => {
    throw redirect({
      to: "/explore/search",
      search: { page: 1, pageSize: 24, sort: "relevance", q: "national wildlife refuge" },
      statusCode: 301,
    });
  },
});
