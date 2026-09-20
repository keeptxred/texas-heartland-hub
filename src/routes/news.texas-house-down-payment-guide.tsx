import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/texas-house-down-payment-guide")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/article/texas-house-down-payment-guide${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
