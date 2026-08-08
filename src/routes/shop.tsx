import { createFileRoute, Outlet } from "@tanstack/react-router";
import { CartProvider } from "@/lib/cart-context";
import { CartButton, CartDrawer } from "@/components/cart-drawer";

export const Route = createFileRoute("/shop")({
  head: ({ match }) => {
    const search = match.search as Record<string, unknown> | undefined;
    const hasCollectionFilter = typeof search?.collection === "string" && search.collection.trim().length > 0;
    return hasCollectionFilter
      ? { meta: [{ name: "robots", content: "noindex,follow,max-image-preview:large" }] }
      : {};
  },
  component: () => (
    <CartProvider>
      <Outlet />
      <CartButton />
      <CartDrawer />
    </CartProvider>
  ),
});