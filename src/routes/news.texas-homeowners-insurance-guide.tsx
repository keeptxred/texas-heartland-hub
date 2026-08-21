import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/texas-homeowners-insurance-guide")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/article/texas-homeowners-insurance-guide${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
