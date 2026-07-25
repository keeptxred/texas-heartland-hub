import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Printer,
  RefreshCw,
  Save,
  Share2,
  Trash2,
} from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { generateExploreTrip } from "@/services/explore/public.functions";
import type { GeneratedTrip, TripPreferences } from "@/types/explore/public";
import type { SavedTrip } from "@/types/explore/public";
import { createClientOnlyFn } from "@tanstack/react-start";
import { buildSeo } from "@/lib/seo";
import { orderStopsForRoute } from "@/lib/explore/geography";

const STORAGE_KEY = "keeptxred.explore.trip.v1";
const saveTrip = createClientOnlyFn(async (trip: GeneratedTrip, existingId?: string) => {
  const { saveExploreTrip } = await import("@/services/explore/trip.client");
  return saveExploreTrip(trip, existingId);
});
const shareTrip = createClientOnlyFn(async (id: string, enabled: boolean) => {
  const { setExploreTripSharing } = await import("@/services/explore/trip.client");
  return setExploreTripSharing(id, enabled);
});
const interests = [
  "fishing",
  "boating",
  "hiking",
  "camping",
  "swimming",
  "birding",
  "wildlife",
  "history",
  "scenic",
  "family",
];

export const Route = createFileRoute("/explore/trip-planner")({
  validateSearch: (value) => z.object({ destination: z.string().max(240).optional() }).parse(value),
  head: () => {
    const seo = buildSeo({
      title: "Texas Trip Planner | Explore Texas",
      description:
        "Build an explainable Texas itinerary around your dates, region, interests, children, pets, RV travel, accessibility needs, and driving tolerance.",
      path: "/explore/trip-planner",
      type: "website",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: TripPlanner,
});

function TripPlanner() {
  const { destination } = Route.useSearch();
  const [trip, setTrip] = useState<GeneratedTrip | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [savedTrip, setSavedTrip] = useState<SavedTrip | null>(null);
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      setTrip(JSON.parse(stored) as GeneratedTrip);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);
  useEffect(() => {
    if (trip) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
  }, [trip]);

  async function submit(formData: FormData) {
    const selectedInterests = formData.getAll("interests").map(String);
    const preferences: TripPreferences = {
      title: String(formData.get("title") || "My Texas trip"),
      startLocation: String(formData.get("startLocation") || "") || undefined,
      region: String(formData.get("region") || "") || undefined,
      startDate: String(formData.get("startDate") || "") || undefined,
      days: Number(formData.get("days")),
      adults: Number(formData.get("adults")),
      children: Number(formData.get("children")),
      pets: formData.get("pets") === "on",
      rv: formData.get("rv") === "on",
      accessible: formData.get("accessible") === "on",
      interests: selectedInterests,
      maxDrivingKm: Number(formData.get("maxDrivingKm")),
    };
    setPending(true);
    setError("");
    try {
      setTrip(await generateExploreTrip({ data: preferences }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The trip could not be generated.");
    } finally {
      setPending(false);
    }
  }

  function move(dayIndex: number, stopIndex: number, offset: -1 | 1) {
    setTrip((current) => {
      if (!current) return current;
      const days = current.days.map((day) => ({ ...day, stops: [...day.stops] }));
      const destinationIndex = stopIndex + offset;
      if (destinationIndex < 0 || destinationIndex >= days[dayIndex].stops.length) return current;
      [days[dayIndex].stops[stopIndex], days[dayIndex].stops[destinationIndex]] = [
        days[dayIndex].stops[destinationIndex],
        days[dayIndex].stops[stopIndex],
      ];
      return { ...current, days };
    });
  }

  function moveDay(dayIndex: number, stopIndex: number, offset: -1 | 1) {
    setTrip((current) => {
      if (!current) return current;
      const targetDay = dayIndex + offset;
      if (targetDay < 0 || targetDay >= current.days.length) return current;
      const days = current.days.map((day) => ({ ...day, stops: [...day.stops] }));
      const [stop] = days[dayIndex].stops.splice(stopIndex, 1);
      days[targetDay].stops.push(stop);
      return { ...current, days };
    });
  }

  function updateStop(
    dayIndex: number,
    stopIndex: number,
    values: { durationMinutes?: number; note?: string },
  ) {
    setTrip((current) => {
      if (!current) return current;
      return {
        ...current,
        days: current.days.map((day, currentDay) =>
          currentDay !== dayIndex
            ? day
            : {
                ...day,
                stops: day.stops.map((stop, currentStop) =>
                  currentStop !== stopIndex
                    ? stop
                    : {
                        ...stop,
                        durationMinutes: values.durationMinutes ?? stop.durationMinutes,
                        notes:
                          values.note != null
                            ? [values.note, ...stop.notes.slice(1)].filter(Boolean)
                            : stop.notes,
                      },
                ),
              },
        ),
      };
    });
  }

  async function persist() {
    if (!trip) return;
    setPending(true);
    setError("");
    try {
      setSavedTrip(await saveTrip(trip, savedTrip?.id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The trip could not be saved.");
    } finally {
      setPending(false);
    }
  }

  async function share() {
    if (!trip) return;
    setPending(true);
    setError("");
    try {
      const saved = savedTrip ?? (await saveTrip(trip));
      const shared = await shareTrip(saved.id, !saved.shareToken);
      setSavedTrip(shared);
      if (shared.shareToken) {
        const url = `${window.location.origin}/explore/trip/${shared.shareToken}`;
        await navigator.clipboard.writeText(url);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The sharing link could not be created.");
    } finally {
      setPending(false);
    }
  }

  async function replaceStop(dayIndex: number, stopIndex: number) {
    if (!trip) return;
    setPending(true);
    setError("");
    try {
      const alternatives = await generateExploreTrip({ data: trip.preferences });
      const used = new Set(trip.days.flatMap((day) => day.stops.map((stop) => stop.entity.id)));
      const replacement = alternatives.days
        .flatMap((day) => day.stops)
        .find((stop) => !used.has(stop.entity.id));
      if (!replacement)
        throw new Error("No unused published alternative matches these preferences.");
      setTrip((current) =>
        current
          ? {
              ...current,
              days: current.days.map((day, currentDay) =>
                currentDay === dayIndex
                  ? {
                      ...day,
                      stops: day.stops.map((stop, currentStop) =>
                        currentStop === stopIndex ? replacement : stop,
                      ),
                    }
                  : day,
              ),
            }
          : current,
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No replacement could be found.");
    } finally {
      setPending(false);
    }
  }

  function recalculateRoute() {
    setTrip((current) =>
      current
        ? {
            ...current,
            days: current.days.map((day) => {
              const entities = orderStopsForRoute(day.stops.map((stop) => stop.entity));
              const byId = new Map(day.stops.map((stop) => [stop.entity.id, stop]));
              return {
                ...day,
                stops: entities.map((entity) => byId.get(entity.id)!).filter(Boolean),
              };
            }),
          }
        : current,
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Explore Texas</p>
      <h1 className="mt-2 font-display text-5xl md:text-7xl">Build a Texas trip</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        Recommendations come from published destination fields and explain why each stop fits.
        Time-sensitive details remain linked to official sources for verification.
      </p>
      {destination && (
        <p className="mt-4 rounded-md border bg-muted/40 p-3 text-sm">
          Starting from destination: <strong>{destination.replaceAll("-", " ")}</strong>
        </p>
      )}
      <div className="mt-10 grid gap-10 lg:grid-cols-[360px_1fr]">
        <form action={submit} className="space-y-5 rounded-lg border p-5 print:hidden">
          <Field label="Trip title" name="title" defaultValue="My Texas trip" required />
          <Field label="Starting location" name="startLocation" placeholder="City or address" />
          <Field label="Destination region" name="region" placeholder="Hill Country" />
          <Field label="Start date" name="startDate" type="date" />
          <div className="grid grid-cols-3 gap-3">
            <Field
              label="Days"
              name="days"
              type="number"
              defaultValue="2"
              min="1"
              max="14"
              required
            />
            <Field
              label="Adults"
              name="adults"
              type="number"
              defaultValue="2"
              min="1"
              max="20"
              required
            />
            <Field
              label="Children"
              name="children"
              type="number"
              defaultValue="0"
              min="0"
              max="20"
              required
            />
          </div>
          <Field
            label="Max driving per day (km)"
            name="maxDrivingKm"
            type="number"
            defaultValue="200"
            min="10"
            max="800"
            required
          />
          <fieldset>
            <legend className="font-semibold">Interests</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {interests.map((interest) => (
                <label key={interest} className="flex items-center gap-2 text-sm capitalize">
                  <input
                    type="checkbox"
                    name="interests"
                    value={interest}
                    defaultChecked={interest === "hiking"}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="space-y-2">
            {[
              ["pets", "Traveling with pets"],
              ["rv", "RV travel"],
              ["accessible", "Accessibility needed"],
            ].map(([name, label]) => (
              <label key={name} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name={name} />
                {label}
              </label>
            ))}
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Building itinerary…" : "Generate itinerary"}
          </Button>
        </form>
        <section aria-live="polite">
          {!trip && (
            <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
              Choose meaningful preferences to generate a real-data itinerary.
            </div>
          )}
          {trip && (
            <div className="trip-print">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <h2 className="font-display text-4xl">{trip.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {trip.preferences.days} days · {trip.preferences.adults} adults
                    {trip.preferences.children ? ` · ${trip.preferences.children} children` : ""}
                  </p>
                </div>
                <div className="flex gap-2 print:hidden">
                  <Button variant="outline" onClick={persist} disabled={pending}>
                    <Save />
                    {savedTrip ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" onClick={share} disabled={pending}>
                    <Share2 />
                    {savedTrip?.shareToken ? "Disable sharing" : "Share"}
                  </Button>
                  <Button variant="outline" onClick={recalculateRoute}>
                    <RefreshCw />
                    Reorder route
                  </Button>
                  <Button variant="outline" onClick={() => window.print()}>
                    <Printer />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTrip(null);
                      window.localStorage.removeItem(STORAGE_KEY);
                    }}
                  >
                    <Trash2 />
                    Clear
                  </Button>
                </div>
              </div>
              <p className="mt-5 rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
                {trip.verificationReminder}
              </p>
              <div className="mt-8 space-y-10">
                {trip.days.map((day, dayIndex) => (
                  <section key={day.day} className="break-inside-avoid">
                    <h3 className="border-b pb-2 font-display text-3xl">
                      Day {day.day}
                      {day.date
                        ? ` · ${new Date(`${day.date}T12:00:00`).toLocaleDateString()}`
                        : ""}
                    </h3>
                    {day.stops.length === 0 ? (
                      <p className="mt-4 text-muted-foreground">
                        No matching published destinations were available for this day.
                      </p>
                    ) : (
                      <ol className="mt-5 space-y-4">
                        {day.stops.map((stop, stopIndex) => (
                          <li key={stop.entity.id} className="rounded-lg border p-5">
                            <div className="flex justify-between gap-4">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                                  {stop.period} · {stop.durationMinutes / 60} hours
                                </p>
                                <h4 className="mt-1 font-display text-2xl">
                                  <Link
                                    to="/explore/$slug"
                                    params={{ slug: stop.entity.slug }}
                                    className="hover:text-primary"
                                  >
                                    {stop.entity.name}
                                  </Link>
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {[stop.entity.city, stop.entity.region]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </p>
                              </div>
                              <div className="flex gap-1 print:hidden">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  aria-label={`Move ${stop.entity.name} to previous day`}
                                  disabled={dayIndex === 0}
                                  onClick={() => moveDay(dayIndex, stopIndex, -1)}
                                >
                                  <ArrowLeft />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  aria-label={`Move ${stop.entity.name} to next day`}
                                  disabled={dayIndex === trip.days.length - 1}
                                  onClick={() => moveDay(dayIndex, stopIndex, 1)}
                                >
                                  <ArrowRight />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  aria-label={`Move ${stop.entity.name} earlier`}
                                  onClick={() => move(dayIndex, stopIndex, -1)}
                                >
                                  <ArrowUp />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  aria-label={`Move ${stop.entity.name} later`}
                                  onClick={() => move(dayIndex, stopIndex, 1)}
                                >
                                  <ArrowDown />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  aria-label={`Remove ${stop.entity.name}`}
                                  onClick={() =>
                                    setTrip((current) =>
                                      current
                                        ? {
                                            ...current,
                                            days: current.days.map((item, index) =>
                                              index === dayIndex
                                                ? {
                                                    ...item,
                                                    stops: item.stops.filter(
                                                      (_, index) => index !== stopIndex,
                                                    ),
                                                  }
                                                : item,
                                            ),
                                          }
                                        : current,
                                    )
                                  }
                                >
                                  <Trash2 />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  aria-label={`Replace ${stop.entity.name} with another recommendation`}
                                  disabled={pending}
                                  onClick={() => void replaceStop(dayIndex, stopIndex)}
                                >
                                  <RefreshCw />
                                </Button>
                              </div>
                            </div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-[180px_1fr] print:hidden">
                              <label className="text-sm font-medium">
                                Visit duration
                                <select
                                  value={stop.durationMinutes}
                                  onChange={(event) =>
                                    updateStop(dayIndex, stopIndex, {
                                      durationMinutes: Number(event.target.value),
                                    })
                                  }
                                  className="mt-1 h-9 w-full rounded-md border bg-background px-2"
                                >
                                  {[60, 90, 120, 180, 240, 360].map((minutes) => (
                                    <option key={minutes} value={minutes}>
                                      {minutes < 120
                                        ? `${minutes} minutes`
                                        : `${minutes / 60} hours`}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <label className="text-sm font-medium">
                                Personal note
                                <input
                                  value={stop.notes[0] ?? ""}
                                  maxLength={500}
                                  onChange={(event) =>
                                    updateStop(dayIndex, stopIndex, { note: event.target.value })
                                  }
                                  className="mt-1 h-9 w-full rounded-md border px-3 font-normal"
                                  placeholder="Add a private planning note"
                                />
                              </label>
                            </div>
                            <ul className="mt-3 list-disc pl-5 text-sm">
                              {stop.reasons.map((reason) => (
                                <li key={reason}>{reason}</li>
                              ))}
                              {stop.notes.map((note) => (
                                <li key={note}>{note}</li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ol>
                    )}
                  </section>
                ))}
              </div>
              <footer className="mt-10 hidden border-t pt-4 text-xs print:block">
                KeepTXRed.com · Explore Texas · Verify changing conditions with official sources.
              </footer>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  ...props
}: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        name={name}
        className="mt-1 h-10 w-full rounded-md border px-3 font-normal"
        {...props}
      />
    </label>
  );
}
