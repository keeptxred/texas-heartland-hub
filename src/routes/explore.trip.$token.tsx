import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSharedExploreTrip } from "@/services/explore/public.functions";
import { buildSeo } from "@/lib/seo";
import type { SavedTrip } from "@/types/explore/public";

export const Route = createFileRoute("/explore/trip/$token")({
  loader: async ({ params }) => {
    const trip = await getSharedExploreTrip({ data: { token: params.token } });
    if (!trip) throw notFound();
    return trip;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const seo = buildSeo({
      title: `${loaderData.title} | Texas Itinerary`,
      description: `A shared ${loaderData.trip.preferences.days}-day Explore Texas itinerary with published destinations and source-verification reminders.`,
      path: `/explore/trip/${loaderData.shareToken}`,
      type: "article",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: SharedTrip,
});

function SharedTrip() {
  const saved = Route.useLoaderData() as SavedTrip;
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 trip-print">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Shared Explore Texas itinerary
          </p>
          <h1 className="mt-2 font-display text-5xl">{saved.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Updated {new Date(saved.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" onClick={() => window.print()} className="print:hidden">
          <Printer />
          Print
        </Button>
      </div>
      <p className="mt-6 rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
        {saved.trip.verificationReminder}
      </p>
      <div className="mt-8 space-y-10">
        {saved.trip.days.map((day) => (
          <section key={day.day} className="break-inside-avoid">
            <h2 className="border-b pb-2 font-display text-3xl">
              Day {day.day}
              {day.date ? ` · ${new Date(`${day.date}T12:00:00`).toLocaleDateString()}` : ""}
            </h2>
            <ol className="mt-5 space-y-4">
              {day.stops.map((stop) => (
                <li key={`${stop.period}-${stop.entity.id}`} className="rounded-lg border p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    {stop.period} · {stop.durationMinutes} minutes
                  </p>
                  <h3 className="mt-1 font-display text-2xl">
                    <Link to="/explore/$slug" params={{ slug: stop.entity.slug }}>
                      {stop.entity.name}
                    </Link>
                  </h3>
                  <ul className="mt-3 list-disc pl-5 text-sm">
                    {[...stop.reasons, ...stop.notes].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </main>
  );
}
