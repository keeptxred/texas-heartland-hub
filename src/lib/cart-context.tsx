import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/products.functions";

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

  const addItem: CartContextValue["addItem"] = (input) => {
    const key = `${input.productId}::${input.color ?? "_"}::${input.size ?? "_"}`;
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
    // Open each product's fulfillment URL in a new tab (Printify listing).
    const seen = new Set<string>();
    items.forEach((i) => {
      if (i.url && !seen.has(i.url)) {
        seen.add(i.url);
        window.open(i.url, "_blank", "noopener,noreferrer");
      }
    });
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
  opts: { color: string | null; size: string | null; image: string; price: number; qty: number },
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
  };
}