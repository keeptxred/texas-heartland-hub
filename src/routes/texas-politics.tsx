import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-politics")({
  component: TexasPoliticsLayout,
});

function TexasPoliticsLayout() {
  return <Outlet />;
}
