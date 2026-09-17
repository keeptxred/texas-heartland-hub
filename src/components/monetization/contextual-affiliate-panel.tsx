import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "@tanstack/react-router";
import { getKtrAffiliatePlacement } from "@/lib/affiliate-placements";

const REALLY_GOOD_STUFF_URL = "https://www.anrdoezrs.net/click-101876465-17106455";
const DISCOUNT_SCHOOL_SUPPLY_URL =
  "https://email.cj.com/c/eJxEzLFuhSAUgOGngU2CBw7iwNCkcWjapK-AHqgkKkbwen37pkvv9i__R85G8poH13bWWitRaj47LVEijL0Nqg8jxWgpBmilwhF66JEn16qutbpFEIC678T_D6CN-PAP_-XTIrY8ZrqZlmtYx3A0fk-NIRMtGm2wwWIu4ouba92ZemMwMBiu6xKUypTPrZZpznkp574vt5jyymD4PjKdU33VZypV-LI_mRomX8NPPm6m3sEgP5ynNW1MyxqevlCIaQv0B_GHg98AAAD__z-eTo4";

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

function trackAffiliateClick(partner: string, placement: string, label: string) {
  if (typeof window === "undefined") return;

  const detail = {
    event: "affiliate_click",
    affiliate_partner: partner,
    affiliate_placement: placement,
    affiliate_label: label,
    page_path: window.location.pathname,
  };

  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push(detail);
  window.dispatchEvent(new CustomEvent("ktr:affiliate-click", { detail }));
}

function SchoolSupplyAffiliateCard({ placementId }: { placementId: string }) {
  return (
    <aside
      aria-label="Optional school and classroom resources"
      className="border-2 border-primary/40 bg-background p-6 shadow-sm sm:p-7"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Optional resources</p>
      <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">School & classroom supplies</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        For families, teachers and homeschool households already shopping for supplies. These offers are separate from our reporting and do not affect editorial coverage.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a
          href={REALLY_GOOD_STUFF_URL}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          data-affiliate-partner="really-good-stuff"
          data-affiliate-placement={placementId}
          onClick={() => trackAffiliateClick("really-good-stuff", placementId, "Really Good Stuff")}
          className="group border border-border bg-muted/30 p-4 no-underline transition-colors hover:border-primary/60"
        >
          <span className="block font-semibold text-foreground group-hover:text-primary">Really Good Stuff</span>
          <span className="mt-2 block text-sm leading-5 text-muted-foreground">
            Classroom organization, learning materials and teacher-focused supplies.
          </span>
          <span className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.12em] text-primary">
            Shop supplies ↗
          </span>
        </a>

        <a
          href={DISCOUNT_SCHOOL_SUPPLY_URL}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          data-affiliate-partner="discount-school-supply"
          data-affiliate-placement={placementId}
          onClick={() => trackAffiliateClick("discount-school-supply", placementId, "Discount School Supply")}
          className="group border border-border bg-muted/30 p-4 no-underline transition-colors hover:border-primary/60"
        >
          <span className="block font-semibold text-foreground group-hover:text-primary">Discount School Supply</span>
          <span className="mt-2 block text-sm leading-5 text-muted-foreground">
            Classroom basics, curriculum materials, arts and crafts, and early-learning supplies.
          </span>
          <span className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.12em] text-primary">
            Browse supplies ↗
          </span>
        </a>
      </div>

      <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
        Affiliate disclosure: Keep TX Red may earn a commission from qualifying purchases, at no additional cost to you. Prices and availability can change.
      </p>
    </aside>
  );
}

export function ContextualAffiliatePanel() {
  const { pathname } = useLocation();
  const placement = getKtrAffiliatePlacement(pathname);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setTarget(null);
    if (!placement) return;

    const articleProse = document.querySelector<HTMLElement>("article .prose");
    if (!articleProse) return;

    let slot = articleProse.querySelector<HTMLElement>("[data-ktr-contextual-affiliate-slot]");
    const created = !slot;

    if (!slot) {
      slot = document.createElement("div");
      slot.setAttribute("data-ktr-contextual-affiliate-slot", "true");
      slot.className = "not-prose my-10 md:my-12";

      const firstSection = Array.from(articleProse.children).find(
        (child) => child instanceof HTMLElement && child.tagName === "SECTION",
      );

      if (firstSection) {
        articleProse.insertBefore(slot, firstSection);
      } else {
        articleProse.appendChild(slot);
      }
    }

    setTarget(slot);

    return () => {
      if (created) slot?.remove();
    };
  }, [pathname, placement?.placementId]);

  if (!placement || !target) return null;

  return createPortal(
    <SchoolSupplyAffiliateCard placementId={`${placement.placementId}-inline`} />,
    target,
  );
}
