import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-news")({
  validateSearch: (search: Record<string, unknown>): { topic?: string } =>
    typeof search.topic === "string" && search.topic ? { topic: search.topic } : {},
  component: () => <Outlet />,
});
