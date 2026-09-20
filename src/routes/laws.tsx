import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/laws")({
  component: LawsLayout,
});

function LawsLayout() {
  return <Outlet />;
}
