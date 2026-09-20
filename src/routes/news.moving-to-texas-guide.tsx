import { createFileRoute, redirect } from "@tanstack/react-router";

const TARGET_URL =
  "https://texasdefined.com/article/moving-to-texas-what-nobody-tells-you";

export const Route = createFileRoute("/news/moving-to-texas-guide")({
  beforeLoad: () => {
    throw redirect({
      href: TARGET_URL,
      statusCode: 301,
      reloadDocument: true,
    });
  },
  component: () => null,
});
