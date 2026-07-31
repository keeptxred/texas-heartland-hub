import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/bills')({
  component: BillsRouteLayout,
});

function BillsRouteLayout() {
  return <Outlet />;
}
