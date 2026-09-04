import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/policy")({
  component: PolicyLayout,
});

function PolicyLayout() {
  return <Outlet />;
}
