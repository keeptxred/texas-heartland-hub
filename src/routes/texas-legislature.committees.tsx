import { createFileRoute, Outlet } from '@tanstack/react-router';
export const Route = createFileRoute('/texas-legislature/committees')({
  component: () => <Outlet />,
});
