import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/state-parks")({
  beforeLoad: () => {
    throw redirect({
      to: "/explore/search",
      search: { page: 1, pageSize: 24, sort: "relevance", types: ["state_park"] },
      statusCode: 301,
    });
  },
});
