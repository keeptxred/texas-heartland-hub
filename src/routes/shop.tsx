import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SITE_URL } from "@/lib/seo";

type Product = {
  id: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  url: string;
  description: string;
};

// Mock data — replace with Etsy findAllShopListingsActive response once the
// API key + Shop ID are added to project secrets.
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Keep Texas Red — Heavyweight Tee",
    price: 28,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    url: "https://www.etsy.com/listing/000000001",
    description: "Classic-fit cotton tee with a bold Lone Star wordmark. Printed in Texas on heavyweight 6 oz cotton.",
  },
  {
    id: "2",
    title: "Lone Star Enamel Pin",
    price: 9,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=800&q=80",
    url: "https://www.etsy.com/listing/000000002",
    description: "Hard-enamel lapel pin with a brushed-gold finish. Rubber backing included.",
  },
  {
    id: "3",
    title: "Don't Mess With Texas — Sticker Pack",
    price: 6,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1622445275576-721325763afe?auto=format&fit=crop&w=800&q=80",
    url: "https://www.etsy.com/listing/000000003",
    description: "Set of 4 weatherproof vinyl stickers. Dishwasher safe, perfect for laptops, tumblers, and trucks.",
  },
  {
    id: "4",
    title: "Texas Flag Trucker Hat",
    price: 24,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    url: "https://www.etsy.com/listing/000000004",
    description: "Structured 5-panel trucker with breathable mesh back and embroidered flag patch.",
  },
  {
    id: "5",
    title: "Republic of Texas — Letterpress Print",
    price: 32,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80",
    url: "https://www.etsy.com/listing/000000005",
    description: "11x14 letterpress poster on cotton paper. Hand-pressed in Austin, limited run of 100.",
  },
  {
    id: "6",
    title: "Lone Star Coffee Mug",
    price: 18,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",
    url: "https://www.etsy.com/listing/000000006",
    description: "12 oz ceramic mug with wraparound star print. Microwave and dishwasher safe.",
  },
  {
    id: "7",
    title: "Texas Constitution Pocket Booklet",
    price: 12,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
    url: "https://www.etsy.com/listing/000000007",
    description: "Pocket-sized reprint of the Texas Constitution with annotated margins. 144 pages.",
  },
  {
    id: "8",
    title: "Star of Texas Canvas Tote",
    price: 22,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    url: "https://www.etsy.com/listing/000000008",
    description: "Heavyweight 12 oz natural canvas tote with reinforced straps. Holds up to 30 lbs.",
  },
];

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Keep Texas Red" },
      { name: "description", content: "Texas-made apparel, prints, and accessories from the Keep Texas Red shop. Ships from our Etsy storefront." },
      { property: "og:title", content: "Shop — Keep Texas Red" },
      { property: "og:description", content: "Texas-made apparel, prints, and accessories from the Keep Texas Red shop." },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/shop` }],
  }),
  component: ShopPage,
});

function formatPrice(p: Product) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: p.currency }).format(p.price);
}

function ShopPage() {
  const [active, setActive] = useState<Product | null>(null);

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-[1200px] px-6 py-14">
          <div className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">Keep TX Red — Official Shop</div>
          <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight max-w-3xl">
            Texas-made goods. Shipped from our Etsy storefront.
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Every order helps keep our newsroom independent. Click any item for details and check out securely on Etsy.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MOCK_PRODUCTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p)}
              className="group text-left bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-display text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-semibold">{formatPrice(p)}</span>
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">View</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <div
            className="bg-card rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl grid md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-square md:aspect-auto bg-muted">
              <img src={active.image} alt={active.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-6 md:p-8 flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-2xl leading-tight">{active.title}</h2>
                <button
                  onClick={() => setActive(null)}
                  aria-label="Close"
                  className="text-muted-foreground hover:text-foreground text-2xl leading-none -mt-1"
                >
                  ×
                </button>
              </div>
              <div className="mt-2 text-2xl font-semibold text-primary">{formatPrice(active)}</div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{active.description}</p>
              <a
                href={active.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Buy on Etsy →
              </a>
              <p className="mt-3 text-[11px] text-muted-foreground text-center">
                You'll be taken to Etsy.com to complete your purchase securely.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}