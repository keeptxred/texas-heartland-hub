import { Link } from "@tanstack/react-router";

/** Shown on sports section pages that don't yet have enough real
 *  coverage. Replaces the old "Fresh X coverage is on the way" stub
 *  with useful outbound links so the page has value even when empty. */
export function SportsCoveragePlaceholder({ label }: { label?: string }) {
  return (
    <div className="border border-border rounded-md p-8 bg-card">
      <p className="text-base text-foreground font-medium">
        {label ? `${label} coverage is being built.` : "Texas sports coverage is being built."}{" "}
        Explore current Texas news below.
      </p>
      <ul className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
        <li><Link to="/texas-news" className="text-primary hover:underline">Texas News →</Link></li>
        <li><Link to="/texas-business" className="text-primary hover:underline">Texas Business →</Link></li>
        <li><Link to="/texas-politics" className="text-primary hover:underline">Texas Politics →</Link></li>
        <li><Link to="/elections" className="text-primary hover:underline">Texas Elections →</Link></li>
      </ul>
    </div>
  );
}
