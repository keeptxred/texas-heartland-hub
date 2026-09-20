import { createFileRoute, redirect } from "@tanstack/react-router";

const TARGET_URL =
  "https://texasdefined.com/article/moving-to-austin-guide";

export const Route = createFileRoute("/news/moving-to-austin-guide")({
  beforeLoad: () => {
    throw redirect({
      href: TARGET_URL,
      statusCode: 301,
      reloadDocument: true,
    });
  },
  component: () => null,
});
