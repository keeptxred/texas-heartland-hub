type Props = {
  placement: "top" | "in-content" | "footer" | "banner";
  label?: string;
};

const LABELS: Record<Props["placement"], string> = {
  top: "Ad Placeholder — Top Banner",
  "in-content": "Ad Placeholder — In-Content",
  footer: "Ad Placeholder — Footer",
  banner: "Ad Placeholder — Banner",
};

/**
 * Monetization-ready ad slot. Renders a neutral placeholder today
 * and is structured to drop in Google AdSense / Ezoic / Mediavine
 * tags later without touching call sites.
 */
export function AdSlot({ placement, label }: Props) {
  return (
    <aside
      className="ad-slot my-6 w-full border border-dashed border-border bg-muted/40 text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground py-6 px-4"
      aria-label="Advertisement"
      data-placement={placement}
    >
      {label ?? LABELS[placement]}
    </aside>
  );
}