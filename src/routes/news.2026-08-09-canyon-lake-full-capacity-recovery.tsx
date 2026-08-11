import { createFileRoute, redirect } from "@tanstack/react-router";

const TEXASDEFINED_URL =
  "https://texasdefined.com/news/2026-08-10-canyon-lake-full-capacity-recovery";

export const Route = createFileRoute(
  "/news/2026-08-09-canyon-lake-full-capacity-recovery",
)({
  loader: () => {
    throw redirect({ href: TEXASDEFINED_URL, statusCode: 301 });
  },
});
