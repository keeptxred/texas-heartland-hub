import { createFileRoute, Outlet } from "@tanstack/react-router";

function hasMeaningfulSearchState(search: Record<string, unknown> | undefined): boolean {
  return Object.values(search ?? {}).some((value) =>
    value !== undefined && value !== null && value !== "" && value !== false,
  );
}

export const Route = createFileRoute("/elections")({
  head: ({ match }) =>
    hasMeaningfulSearchState(match.search as Record<string, unknown> | undefined)
      ? { meta: [{ name: "robots", content: "noindex,follow,max-image-preview:large" }] }
      : {},
  component: () => <Outlet />,
});