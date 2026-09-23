import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-resources/type/$type")({
  beforeLoad: ({ params, location }) => {
    throw redirect({
      href: `https://texasdefined.com/texas-resources?q=${encodeURIComponent(params.type)}${location.searchStr ? `&${location.searchStr.replace(/^\?/, "")}` : ""}`,
      statusCode: 301,
    });
  },
});
