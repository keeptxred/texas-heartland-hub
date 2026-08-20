import { createFileRoute, redirect } from "@tanstack/react-router";

const TARGET_URL = "https://texasdefined.com/things-unique-to-texas";

export const Route = createFileRoute(
  "/news/2026-07-04-the-real-reason-behind-the-resilience-of-texas-identity-in-2026-explained-simply",
)({
  beforeLoad: () => {
    throw redirect({
      href: TARGET_URL,
      statusCode: 301,
      reloadDocument: true,
    });
  },
  component: () => null,
});
