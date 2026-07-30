import { useEffect, useMemo, useState } from "react";
import {
  buildMovingTasks,
  DEFAULT_MOVING_PREFERENCES,
  type MovingPreferences,
} from "@/lib/moving-checklist";

const STORAGE_KEY = "keeptxred:moving-checklist:v1";

type SavedChecklist = {
  preferences: MovingPreferences;
  completed: string[];
};

const PHASES = ["Plan", "Before the move", "First 30 days", "First 90 days"] as const;

export function MovingChecklist() {
  const [preferences, setPreferences] = useState(DEFAULT_MOVING_PREFERENCES);
  const [completed, setCompleted] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const tasks = useMemo(() => buildMovingTasks(preferences), [preferences]);
  const activeCompleted = completed.filter((id) => tasks.some((task) => task.id === id));
  const completionPercent =
    tasks.length === 0 ? 0 : Math.round((activeCompleted.length / tasks.length) * 100);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<SavedChecklist>;
        if (saved.preferences) {
          setPreferences({ ...DEFAULT_MOVING_PREFERENCES, ...saved.preferences });
        }
        if (Array.isArray(saved.completed)) {
          setCompleted(
            saved.completed.filter((value): value is string => typeof value === "string"),
          );
        }
      }
    } catch {
      // A blocked or malformed browser store should never prevent the checklist from working.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const value: SavedChecklist = { preferences, completed };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // The checklist remains usable for the current visit if storage is unavailable.
    }
  }, [completed, hydrated, preferences]);

  function setPreference<K extends keyof MovingPreferences>(key: K, value: MovingPreferences[K]) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  function toggleTask(id: string) {
    setCompleted((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function resetChecklist() {
    setPreferences(DEFAULT_MOVING_PREFERENCES);
    setCompleted([]);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Personalized relocation planner
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Interactive moving-to-Texas checklist
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Add your move date and household needs. The checklist will calculate practical target
          dates, keep your progress on this device, and connect each Texas-specific task to the
          right guide or official resource.
        </p>
      </header>

      <section className="mt-8 rounded-xl border bg-card p-5 sm:p-6 print:hidden">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_2fr]">
          <label className="text-sm font-semibold">
            Expected move date
            <input
              type="date"
              value={preferences.moveDate}
              onChange={(event) => setPreference("moveDate", event.target.value)}
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 font-normal"
            />
          </label>
          <div>
            <p className="text-sm font-semibold">Include tasks for</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <PreferenceToggle
                label="Bringing a vehicle"
                checked={preferences.hasVehicle}
                onChange={(value) => setPreference("hasVehicle", value)}
              />
              <PreferenceToggle
                label="Buying a home"
                checked={preferences.buyingHome}
                onChange={(value) => setPreference("buyingHome", value)}
              />
              <PreferenceToggle
                label="School-age children"
                checked={preferences.hasChildren}
                onChange={(value) => setPreference("hasChildren", value)}
              />
              <PreferenceToggle
                label="Moving with pets"
                checked={preferences.hasPets}
                onChange={(value) => setPreference("hasPets", value)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl bg-foreground p-5 text-background print:border print:bg-white print:text-black">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Your progress</p>
            <p className="mt-1 text-2xl font-bold">
              {activeCompleted.length} of {tasks.length} tasks complete
            </p>
          </div>
          <p className="text-4xl font-bold">{completionPercent}%</p>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-background/20 print:border">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </section>

      <div className="mt-10 space-y-10">
        {PHASES.map((phase) => {
          const phaseTasks = tasks.filter((task) => task.phase === phase);
          if (phaseTasks.length === 0) return null;
          return (
            <section key={phase}>
              <h2 className="text-2xl font-bold">{phase}</h2>
              <div className="mt-4 grid gap-4">
                {phaseTasks.map((task) => {
                  const checked = completed.includes(task.id);
                  return (
                    <article
                      key={task.id}
                      className={`rounded-xl border p-5 transition ${
                        checked ? "bg-muted/50 opacity-75" : "bg-card"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleTask(task.id)}
                          aria-label={`Mark ${task.title} complete`}
                          className="mt-1 size-5 accent-primary"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h3 className={`text-lg font-bold ${checked ? "line-through" : ""}`}>
                              {task.title}
                            </h3>
                            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                              {task.dueLabel}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {task.description}
                          </p>
                          {task.href && task.linkLabel && (
                            <a
                              href={task.href}
                              target={task.href.startsWith("http") ? "_blank" : undefined}
                              rel={task.href.startsWith("http") ? "noopener noreferrer" : undefined}
                              className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
                            >
                              {task.linkLabel} →
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-10 flex flex-wrap gap-3 border-t pt-6 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Print checklist
        </button>
        <button
          type="button"
          onClick={resetChecklist}
          className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted"
        >
          Reset checklist
        </button>
      </section>

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        Your selections and checked tasks stay only in this browser&apos;s local storage; they are
        not sent to Keep TX Red. Dates are planning targets, not legal advice. Confirm official
        deadlines with the linked Texas agency.
      </p>
    </main>
  );
}

function PreferenceToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}
