import { createFileRoute, redirect } from "@tanstack/react-router";

const TARGET_URL =
  "https://texasdefined.com/news/2026-08-10-canyon-lake-full-capacity-recovery";

export const Route = createFileRoute(
  "/news/canyon-lake-pushes-to-full-capacity-following-multiyear-drought-2025-d9be1db3",
)({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `${TARGET_URL}${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
