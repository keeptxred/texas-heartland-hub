import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-school-board-powers")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/news/texas-school-board-powers${location.searchStr || ""}`, statusCode: 301 });
  },
});
