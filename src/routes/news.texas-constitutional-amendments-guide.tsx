import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/texas-constitutional-amendments-guide")({
  beforeLoad: ({ location }) => {
    throw redirect({
      to: "/laws/constitutional-amendments",
      search: location.search,
      hash: location.hash,
      statusCode: 301,
    });
  },
});
