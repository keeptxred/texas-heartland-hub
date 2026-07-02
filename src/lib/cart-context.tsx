import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product, ProductVariant } from "@/lib/products.functions";

export const ETSY_CHECKOUT_STORAGE_KEY = "keeptxred:etsy-checkout-items:v1";
export const CART_STORAGE_KEY = "keeptxred:cart-items:v1";

export type CartItem = {
  key: string; // productId::color::size
  productId: string;
  title: string;
  image: string;
  price: number;
  currency: string;
  color: string | null;
  size: string | null;
  qty: number;
  url: string;
  variantId?: number | null;
  variantTitle?: string | null;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (input: Omit<CartItem, "key" | "qty"> & { qty?: number }) => void;
  updateQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  checkout: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hasLoadedStoredCart, setHasLoadedStoredCart] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setItems(parsed);
    } catch {
      // Ignore blocked/corrupt storage; the in-memory cart still works.
    } finally {
      setHasLoadedStoredCart(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredCart) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore blocked storage.
    }
  }, [items, hasLoadedStoredCart]);

  const addItem: CartContextValue["addItem"] = (input) => {
    const key = `${input.productId}::${input.variantId ?? "_"}::${input.color ?? "_"}::${input.size ?? "_"}`;
    const qty = input.qty ?? 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...input, key, qty }];
    });
    setOpen(true);
  };

  const updateQty: CartContextValue["updateQty"] = (key, qty) =>
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    );

  const remove: CartContextValue["remove"] = (key) =>
    setItems((prev) => prev.filter((i) => i.key !== key));

  const checkout = () => {
    // Persist the bag so the checkout route can rehydrate on navigation,
    // then hand off to our Stripe-powered secure checkout page.
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore blocked storage; in-memory cart still flows through.
    }
    setOpen(false);
    window.location.assign("/shop/checkout");
  };

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    return {
      items,
      count,
      subtotal,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      addItem,
      updateQty,
      remove,
      checkout,
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

// Helper: derive size from a variant title like "Red / XL" or "Black / M"
export function parseVariantSize(title: string | undefined): string | null {
  if (!title) return null;
  const parts = title.split("/").map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  return parts[parts.length - 1];
}

export function buildAddPayload(
  product: Product,
  opts: {
    color: string | null;
    size: string | null;
    image: string;
    price: number;
    qty: number;
    variant?: ProductVariant | null;
  },
) {
  return {
    productId: product.id,
    title: product.title,
    image: opts.image,
    price: opts.price,
    currency: product.currency,
    color: opts.color,
    size: opts.size,
    qty: opts.qty,
    url: product.url,
    variantId: opts.variant?.id ?? null,
    variantTitle: opts.variant?.title ?? null,
  };
}