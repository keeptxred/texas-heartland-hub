import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/national-wildlife-refuges")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/explore/national-wildlife-refuges${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
