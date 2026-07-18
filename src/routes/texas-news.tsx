import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-news")({
  validateSearch: (search: Record<string, unknown>) => ({
    topic: typeof search.topic === "string" ? search.topic : "",
  }),
  component: () => <Outlet />,
});