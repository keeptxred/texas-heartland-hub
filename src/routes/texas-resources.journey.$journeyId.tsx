import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-resources/journey/$journeyId")({
  beforeLoad: ({ params, location }) => {
    throw redirect({
      href: `https://texasdefined.com/texas-resources?q=${encodeURIComponent(params.journeyId)}${location.searchStr ? `&${location.searchStr.replace(/^\?/, "")}` : ""}`,
      statusCode: 301,
    });
  },
});
