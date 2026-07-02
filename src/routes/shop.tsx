import { createFileRoute, Outlet } from "@tanstack/react-router";
import { CartProvider } from "@/lib/cart-context";
import { CartButton, CartDrawer } from "@/components/cart-drawer";

export const Route = createFileRoute("/shop")({
  component: () => (
    <CartProvider>
      <Outlet />
      <CartButton />
      <CartDrawer />
    </CartProvider>
  ),
});