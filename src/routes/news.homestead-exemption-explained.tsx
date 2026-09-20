import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/homestead-exemption-explained")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/do/homestead-exemption${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
