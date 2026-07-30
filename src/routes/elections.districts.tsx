import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/elections/districts")({
  component: DistrictsRouteLayout,
});

function DistrictsRouteLayout() {
  return <Outlet />;
}
