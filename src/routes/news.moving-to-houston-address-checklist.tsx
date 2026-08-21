import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/moving-to-houston-address-checklist")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/article/moving-to-houston-address-checklist${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
