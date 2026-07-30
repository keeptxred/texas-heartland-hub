import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/national-parks")({
  beforeLoad: () => {
    throw redirect({
      to: "/explore/search",
      search: { page: 1, pageSize: 24, sort: "relevance", types: ["national_park"] },
      statusCode: 301,
    });
  },
});
