import type { MediaTemplateId } from "./types";

export const MEDIA_TEMPLATES: {
  id: MediaTemplateId;
  label: string;
  accent: string;
  bg: string;
  tag: string;
}[] = [
  { id: "breaking", label: "Breaking Texas News", accent: "#DC2626", bg: "#0B0B0B", tag: "BREAKING" },
  { id: "politics", label: "Politics Update", accent: "#1D4ED8", bg: "#0F172A", tag: "POLITICS" },
  { id: "election", label: "Election Watch", accent: "#B91C1C", bg: "#111827", tag: "ELECTION WATCH" },
  { id: "economy", label: "Texas Economy", accent: "#047857", bg: "#0B1F1A", tag: "TEXAS ECONOMY" },
  { id: "tax", label: "Property Tax Alert", accent: "#B45309", bg: "#1C1207", tag: "PROPERTY TAX ALERT" },
];

export function TemplateSelector({
  value,
  onChange,
}: {
  value: MediaTemplateId;
  onChange: (id: MediaTemplateId) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {MEDIA_TEMPLATES.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`text-[11px] uppercase tracking-widest px-3 py-1.5 border-2 ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-foreground/20 bg-background text-foreground hover:border-foreground/40"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}