import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/texas-government")({
  component: TexasGovernmentLayout,
});

function TexasGovernmentLayout() {
  return <Outlet />;
}
