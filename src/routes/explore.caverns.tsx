import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/caverns")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/caverns${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
