import { useEffect, useMemo, useState } from "react";
import type { TexasDefinedEventOffer } from "@/lib/texasdefined-event-offers";

type OfferApiResponse = {
  ok: boolean;
  source?: "database" | "seed";
  results?: TexasDefinedEventOffer[];
  error?: string;
};

export type EventOfferIntegrationPanelProps = {
  title?: string;
  location?: string | null;
  category?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  limit?: number;
  showFiltersSummary?: boolean;
};

function buildQuery(props: EventOfferIntegrationPanelProps): string {
  const params = new URLSearchParams();
  if (props.location) params.set("location", props.location);
  if (props.category) params.set("category", props.category);
  if (props.startDate) params.set("start", props.startDate);
  if (props.endDate) params.set("end", props.endDate);
  params.set("commissionSafeOnly", "true");
  params.set("limit", String(props.limit ?? 6));
  return params.toString();
}

function formatDateRange(offer: TexasDefinedEventOffer): string | null {
  if (!offer.startDate && !offer.endDate) return null;
  if (offer.startDate === offer.endDate || !offer.endDate) return offer.startDate ?? null;
  return `${offer.startDate} – ${offer.endDate}`;
}

export function EventOfferIntegrationPanel(props: EventOfferIntegrationPanelProps) {
  const [data, setData] = useState<OfferApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const query = useMemo(() => buildQuery(props), [props.location, props.category, props.startDate, props.endDate, props.limit]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetch(`/api/texasdefined/event-offers?${query}`)
      .then((response) => response.json() as Promise<OfferApiResponse>)
      .then((body) => {
        if (!ignore) setData(body);
      })
      .catch((error) => {
        if (!ignore) setData({ ok: false, error: error instanceof Error ? error.message : "Offer lookup failed" });
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [query]);

  const results = data?.results ?? [];
  if (!loading && results.length === 0) return null;

  return (
    <section className="my-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">TexasDefined discovery</div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">{props.title ?? "Events and offers near this trip"}</h2>
          {props.showFiltersSummary !== false ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {props.location ? `Showing commission-safe partner inventory around ${props.location}` : "Showing commission-safe partner inventory"}
              {props.startDate ? ` for ${props.startDate}${props.endDate && props.endDate !== props.startDate ? ` through ${props.endDate}` : ""}` : ""}.
            </p>
          ) : null}
        </div>
        <a
          href={`/offers?${query}`}
          className="rounded-full border border-primary px-3 py-2 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
        >
          View all
        </a>
      </div>

      {loading ? <p className="text-sm text-muted-foreground">Finding matching Texas events and offers…</p> : null}
      {!loading && data?.ok === false ? <p className="text-sm text-destructive">{data.error ?? "Unable to load offers."}</p> : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {results.map((offer) => (
          <article key={offer.id} className="rounded-xl border border-border bg-background p-4">
            <div className="mb-2 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
              <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{offer.category}</span>
              <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground">{offer.network}</span>
              {offer.isDiscount ? <span className="rounded-full bg-green-100 px-2 py-1 text-green-700">Deal</span> : null}
            </div>
            <h3 className="text-base font-bold leading-snug">{offer.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{offer.city}{offer.venue ? ` • ${offer.venue}` : ""}</p>
            {formatDateRange(offer) ? <p className="mt-1 text-xs font-semibold text-foreground">{formatDateRange(offer)}</p> : null}
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{offer.description}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-xs font-semibold text-muted-foreground">{offer.offerLabel ?? offer.priceLabel ?? offer.advertiser}</div>
              <a
                href={offer.affiliateUrl}
                rel="sponsored nofollow noopener noreferrer"
                target="_blank"
                className="rounded-full bg-primary px-3 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground"
              >
                View
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
