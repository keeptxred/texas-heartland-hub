import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EventOfferIntegrationPanel } from "@/components/texasdefined/event-offer-integration-panel";
import type { TexasDefinedEventOffer, TexasDefinedOfferDashboardSummary } from "@/lib/texasdefined-event-offers";

type OffersResponse = {
  ok: boolean;
  source?: "database" | "seed";
  generatedAt?: string;
  summary?: TexasDefinedOfferDashboardSummary;
  results?: TexasDefinedEventOffer[];
  error?: string;
};

export const Route = createFileRoute("/admin/texasdefined-event-offers")({
  head: () => ({
    meta: [
      { title: "TexasDefined Event & Offer Dashboard — Admin" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: TexasDefinedEventOfferDashboard,
});

const DEFAULT_CITIES = ["Houston", "Dallas", "Austin", "San Antonio", "Fredericksburg", "Galveston"];
const DEFAULT_CATEGORIES = ["", "concerts", "sports", "festivals", "family", "theater", "attractions", "tours", "hotels", "outdoors", "shopping"];

function countRows(counts: Record<string, number> | undefined): Array<[string, number]> {
  return Object.entries(counts ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 8);
}

function TexasDefinedEventOfferDashboard() {
  const [location, setLocation] = useState("Houston");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [discountsOnly, setDiscountsOnly] = useState(false);
  const [data, setData] = useState<OffersResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (category) params.set("category", category);
    if (startDate) params.set("start", startDate);
    if (endDate) params.set("end", endDate);
    if (discountsOnly) params.set("discountsOnly", "true");
    params.set("commissionSafeOnly", "false");
    params.set("limit", "60");
    return params.toString();
  }, [location, category, startDate, endDate, discountsOnly]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/texasdefined/event-offers?${query}`);
      const body = (await response.json()) as OffersResponse;
      setData(body);
    } catch (error) {
      setData({ ok: false, error: error instanceof Error ? error.message : "Offer request failed" });
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void load();
  }, [load]);

  const summary = data?.summary;
  const rows = data?.results ?? [];

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">★ TexasDefined monetization</div>
              <h1 className="mt-2 font-display text-3xl leading-none md:text-5xl">Event & Offer Dashboard</h1>
              <p className="mt-2 max-w-3xl text-sm text-white/80">
                Search cross-network event, attraction, hotel, and deal inventory by location, date, category, and commission status before placing it on Explore or event pages.
              </p>
            </div>
            <Link to="/admin" className="text-sm font-bold text-white underline underline-offset-4">← Admin</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 rounded-2xl border bg-card p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-5">
            <label className="space-y-1 text-sm font-semibold">
              <span>Location</span>
              <input
                list="td-offer-locations"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="City, region, venue"
              />
              <datalist id="td-offer-locations">
                {DEFAULT_CITIES.map((city) => <option key={city} value={city} />)}
              </datalist>
            </label>
            <label className="space-y-1 text-sm font-semibold">
              <span>Category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="">All categories</option>
                {DEFAULT_CATEGORIES.filter(Boolean).map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-sm font-semibold">
              <span>Start date</span>
              <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </label>
            <label className="space-y-1 text-sm font-semibold">
              <span>End date</span>
              <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </label>
            <div className="flex items-end gap-3">
              <label className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-semibold">
                <input type="checkbox" checked={discountsOnly} onChange={(event) => setDiscountsOnly(event.target.checked)} /> Deals only
              </label>
              <button type="button" onClick={() => void load()} className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground" disabled={loading}>
                {loading ? "Loading…" : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {data?.ok === false ? <div className="mb-6 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">{data.error}</div> : null}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total inventory" value={summary?.totalOffers ?? 0} />
          <MetricCard label="Commission safe" value={summary?.commissionSafeOffers ?? 0} />
          <MetricCard label="Discounts / deals" value={summary?.discountOffers ?? 0} />
          <MetricCard label="Needs review" value={summary?.needsReview ?? 0} tone={(summary?.needsReview ?? 0) > 0 ? "warning" : "normal"} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Matching inventory</h2>
                <p className="text-sm text-muted-foreground">Source: {data?.source ?? "loading"}. Publish only the rows where commission is preserved or deliberately approved.</p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-widest">{rows.length} rows</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b text-[11px] uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="py-2 pr-3">Offer</th>
                    <th className="py-2 pr-3">Where / when</th>
                    <th className="py-2 pr-3">Network</th>
                    <th className="py-2 pr-3">Commission</th>
                    <th className="py-2 pr-3">Placement</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((offer) => (
                    <tr key={offer.id} className="border-b last:border-0">
                      <td className="py-3 pr-3 align-top">
                        <div className="font-bold">{offer.title}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{offer.category} • {offer.advertiser}</div>
                      </td>
                      <td className="py-3 pr-3 align-top text-xs text-muted-foreground">
                        <div>{offer.city}{offer.venue ? ` • ${offer.venue}` : ""}</div>
                        <div>{offer.startDate ?? "Evergreen"}{offer.endDate && offer.endDate !== offer.startDate ? ` – ${offer.endDate}` : ""}</div>
                      </td>
                      <td className="py-3 pr-3 align-top text-xs font-bold uppercase tracking-widest">{offer.network}</td>
                      <td className="py-3 pr-3 align-top">
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${offer.commissionStatus === "preserved" ? "bg-green-100 text-green-700" : offer.commissionStatus === "zero" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {offer.commissionStatus}
                        </span>
                      </td>
                      <td className="py-3 pr-3 align-top text-xs text-muted-foreground">{offer.offerLabel ?? offer.priceLabel ?? "Standard link"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="space-y-6">
            <Breakdown title="By network" rows={countRows(summary?.byNetwork)} />
            <Breakdown title="By category" rows={countRows(summary?.byCategory)} />
            <Breakdown title="By city" rows={countRows(summary?.byCity)} />
          </aside>
        </div>

        <EventOfferIntegrationPanel
          title="Preview: Explore/event-page module"
          location={location}
          category={category || null}
          startDate={startDate || null}
          endDate={endDate || null}
          limit={6}
        />
      </section>
    </main>
  );
}

function MetricCard({ label, value, tone = "normal" }: { label: string; value: number; tone?: "normal" | "warning" }) {
  return (
    <div className={`rounded-2xl border bg-card p-5 shadow-sm ${tone === "warning" ? "border-yellow-300" : ""}`}>
      <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-black">{value.toLocaleString()}</div>
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: Array<[string, number]> }) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">{title}</h3>
      <div className="space-y-2">
        {rows.length ? rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3 text-sm">
            <span className="capitalize text-muted-foreground">{label}</span>
            <span className="font-bold">{value}</span>
          </div>
        )) : <p className="text-sm text-muted-foreground">No rows yet.</p>}
      </div>
    </section>
  );
}
