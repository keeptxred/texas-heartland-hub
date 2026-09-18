import type { ReactNode } from "react";
import {
  getKtrAffiliatePlacement,
  type KtrAffiliateMarket,
} from "@/lib/affiliate-placements";

const REALLY_GOOD_STUFF_URL = "https://www.anrdoezrs.net/click-101876465-17106455";
const DISCOUNT_SCHOOL_SUPPLY_URL =
  "https://email.cj.com/c/eJxEzLFuhSAUgOGngU2CBw7iwNCkcWjapK-AHqgkKkbwen37pkvv9i__R85G8poH13bWWitRaj47LVEijL0Nqg8jxWgpBmilwhF66JEn16qutbpFEIC678T_D6CN-PAP_-XTIrY8ZrqZlmtYx3A0fk-NIRMtGm2wwWIu4ouba92ZemMwMBiu6xKUypTPrZZpznkp574vt5jyymD4PjKdU33VZypV-LI_mRomX8NPPm6m3sEgP5ynNW1MyxqevlCIaQv0B_GHg98AAAD__z-eTo4";

const CITYPASS_AFFILIATE_URLS: Readonly<Record<KtrAffiliateMarket, string>> = {
  Dallas: "https://citypass.7eer.net/c/7236213/305537/3331",
  Houston: "https://citypass.7eer.net/c/7236213/305542/3331",
  "San Antonio": "https://citypass.7eer.net/c/7236213/305547/3331",
};

const CITY_GUIDE_URLS: Readonly<Record<KtrAffiliateMarket, string>> = {
  Dallas: "https://texasdefined.com/city/dallas?utm_source=keeptxred&utm_medium=referral&utm_campaign=ktr-sports-travel",
  Houston: "https://texasdefined.com/city/houston?utm_source=keeptxred&utm_medium=referral&utm_campaign=ktr-sports-travel",
  "San Antonio": "https://texasdefined.com/city/san-antonio?utm_source=keeptxred&utm_medium=referral&utm_campaign=ktr-sports-travel",
};

const CJ_PUBLISHER_ID = "101876465";
const HOTELS_DESTINATION = "https://www.hotels.com/";
const HOTELS_AFFILIATE_URL =
  `https://www.anrdoezrs.net/links/${CJ_PUBLISHER_ID}/type/dlg/${encodeURI(HOTELS_DESTINATION)}`;
const BOOKING_CAR_RENTAL_DESTINATION = "https://www.booking.com/cars/country/us.html";
const BOOKING_CAR_RENTAL_URL =
  `https://www.anrdoezrs.net/links/${CJ_PUBLISHER_ID}/type/dlg/${encodeURI(BOOKING_CAR_RENTAL_DESTINATION)}`;

const HOMEOWNER_RESOURCES = [
  {
    href: "https://texasdefined.com/property-tax-calculators?utm_source=keeptxred&utm_medium=referral&utm_campaign=ktr-homeowner-resources",
    label: "Texas property-tax calculators",
    description: "Estimate local property-tax scenarios and compare the inputs that change the bill.",
  },
  {
    href: "https://texasdefined.com/texas-homeownership-cost-calculator?utm_source=keeptxred&utm_medium=referral&utm_campaign=ktr-homeowner-resources",
    label: "Texas homeownership cost calculator",
    description: "Combine mortgage, taxes, insurance, utilities, maintenance and fees into one planning view.",
  },
  {
    href: "https://texasdefined.com/texas-home-insurance-calculator?utm_source=keeptxred&utm_medium=referral&utm_campaign=ktr-homeowner-resources",
    label: "Texas home-insurance calculator",
    description: "Build a planning range before comparing real coverage, deductibles and quotes.",
  },
] as const;

const ENERGY_RESOURCES = [
  {
    href: "https://texasdefined.com/texas-utility-cost-calculator?utm_source=keeptxred&utm_medium=referral&utm_campaign=ktr-energy-resources",
    label: "Texas utility cost calculator",
    description: "Model electricity, water, gas and other household utility costs in one monthly estimate.",
  },
  {
    href: "https://texasdefined.com/texas-cost-of-living-calculator?utm_source=keeptxred&utm_medium=referral&utm_campaign=ktr-energy-resources",
    label: "Texas cost-of-living calculator",
    description: "Put utility changes next to housing and everyday household costs.",
  },
  {
    href: "https://texasdefined.com/texas-homeownership-cost-calculator?utm_source=keeptxred&utm_medium=referral&utm_campaign=ktr-energy-resources",
    label: "Full homeownership cost",
    description: "See how electricity and utilities fit into the larger monthly cost of owning a Texas home.",
  },
] as const;

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
};

function pushAnalytics(detail: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push(detail);
}

function sendGaEvent(eventName: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const gtag = (window as AnalyticsWindow).gtag;
  if (typeof gtag === "function") gtag("event", eventName, params);
}

function trackAffiliateClick(partner: string, placement: string, label: string, module: string) {
  if (typeof window === "undefined") return;

  const detail = {
    event: "affiliate_click",
    affiliate_partner: partner,
    affiliate_placement: placement,
    affiliate_label: label,
    affiliate_module: module,
    page_path: window.location.pathname,
  };

  pushAnalytics(detail);
  sendGaEvent("affiliate_click", {
    affiliate_partner: partner,
    affiliate_placement: placement,
    affiliate_label: label,
    affiliate_module: module,
    page_path: window.location.pathname,
  });
  window.dispatchEvent(new CustomEvent("ktr:affiliate-click", { detail }));
}

function trackResourceReferral(label: string, placement: string, destination: string) {
  if (typeof window === "undefined") return;

  const detail = {
    event: "resource_referral_click",
    resource_label: label,
    resource_placement: placement,
    resource_destination: destination,
    page_path: window.location.pathname,
  };

  pushAnalytics(detail);
  sendGaEvent("resource_referral_click", {
    resource_label: label,
    resource_placement: placement,
    resource_destination: destination,
    page_path: window.location.pathname,
  });
  window.dispatchEvent(new CustomEvent("ktr:resource-referral-click", { detail }));
}

function AffiliateDisclosure({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
      Affiliate disclosure: {children}
    </p>
  );
}

function CardShell({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <aside className="border-2 border-primary/40 bg-background p-6 shadow-sm sm:p-7">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
      {children}
    </aside>
  );
}

export function SchoolSupplyAffiliateCard({ placementId }: { placementId: string }) {
  return (
    <CardShell
      eyebrow="Optional resources"
      title="School & classroom supplies"
      body="For families, teachers and homeschool households already shopping for supplies. These offers are separate from our reporting and do not affect editorial coverage."
    >
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a
          href={REALLY_GOOD_STUFF_URL}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          data-affiliate-partner="really-good-stuff"
          data-affiliate-placement={placementId}
          onClick={() => trackAffiliateClick("really-good-stuff", placementId, "Really Good Stuff", "school-supplies")}
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
          onClick={() => trackAffiliateClick("discount-school-supply", placementId, "Discount School Supply", "school-supplies")}
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

      <AffiliateDisclosure>
        Keep TX Red may earn a commission from qualifying purchases, at no additional cost to you. Prices and availability can change.
      </AffiliateDisclosure>
    </CardShell>
  );
}

function SportsTravelAffiliateCard({
  placementId,
  market,
}: {
  placementId: string;
  market: KtrAffiliateMarket;
}) {
  const hotelPlacement = `${placementId}-hotels-com`;
  const cityPassPlacement = `${placementId}-citypass-${market.toLowerCase().replace(/\s+/g, "-")}`;
  const rentalPlacement = `${placementId}-booking-car-rental`;

  return (
    <CardShell
      eyebrow="Game day & event travel"
      title={`Making a ${market} trip out of it?`}
      body="If you are already traveling for the game or event, these are practical add-ons to compare after your plans are set. They are separate from Keep TX Red's editorial coverage."
    >
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href={HOTELS_AFFILIATE_URL}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          data-affiliate-partner="hotels.com"
          data-affiliate-placement={hotelPlacement}
          onClick={() => trackAffiliateClick("hotels.com", hotelPlacement, `Find hotels for a ${market} trip`, "sports-event-travel")}
          className="group border border-border bg-muted/30 p-4 no-underline transition-colors hover:border-primary/60"
        >
          <span className="block font-semibold text-foreground group-hover:text-primary">Hotels.com</span>
          <span className="mt-2 block text-sm leading-5 text-muted-foreground">
            Check hotel availability when the game or event turns into an overnight trip.
          </span>
          <span className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.12em] text-primary">
            Find hotels ↗
          </span>
        </a>

        <a
          href={CITYPASS_AFFILIATE_URLS[market]}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          data-affiliate-partner="citypass"
          data-affiliate-placement={cityPassPlacement}
          onClick={() => trackAffiliateClick("citypass", cityPassPlacement, `Check ${market} CityPASS options`, "sports-event-travel")}
          className="group border border-border bg-muted/30 p-4 no-underline transition-colors hover:border-primary/60"
        >
          <span className="block font-semibold text-foreground group-hover:text-primary">{market} CityPASS®</span>
          <span className="mt-2 block text-sm leading-5 text-muted-foreground">
            Compare a multi-attraction pass if several participating stops are already part of the trip.
          </span>
          <span className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.12em] text-primary">
            Check current options ↗
          </span>
        </a>

        <a
          href={BOOKING_CAR_RENTAL_URL}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          data-affiliate-partner="booking.com"
          data-affiliate-placement={rentalPlacement}
          onClick={() => trackAffiliateClick("booking.com", rentalPlacement, "Compare rental cars on Booking.com", "sports-event-travel")}
          className="group border border-border bg-muted/30 p-4 no-underline transition-colors hover:border-primary/60"
        >
          <span className="block font-semibold text-foreground group-hover:text-primary">Rental cars on Booking.com</span>
          <span className="mt-2 block text-sm leading-5 text-muted-foreground">
            Compare rental-car options when driving is part of the weekend plan.
          </span>
          <span className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.12em] text-primary">
            Compare rental cars ↗
          </span>
        </a>
      </div>

      <a
        href={CITY_GUIDE_URLS[market]}
        onClick={() => trackResourceReferral(`${market} city guide`, placementId, CITY_GUIDE_URLS[market])}
        className="mt-4 inline-block text-sm font-semibold text-primary underline underline-offset-4"
      >
        Plan the rest of the trip on TexasDefined →
      </a>

      <AffiliateDisclosure>
        Keep TX Red may earn a commission from qualifying Hotels.com activity, CityPASS® purchases or Booking.com car-rental bookings, at no additional cost to you. Prices, availability and terms can change.
      </AffiliateDisclosure>
    </CardShell>
  );
}

function ResourceFunnelCard({
  eyebrow,
  title,
  body,
  placementId,
  resources,
}: {
  eyebrow: string;
  title: string;
  body: string;
  placementId: string;
  resources: ReadonlyArray<{ href: string; label: string; description: string }>;
}) {
  return (
    <CardShell eyebrow={eyebrow} title={title} body={body}>
      <div className="mt-5 grid gap-3">
        {resources.map((resource) => (
          <a
            key={resource.href}
            href={resource.href}
            onClick={() => trackResourceReferral(resource.label, placementId, resource.href)}
            className="group border border-border bg-muted/30 p-4 no-underline transition-colors hover:border-primary/60"
          >
            <span className="block font-semibold text-foreground group-hover:text-primary">{resource.label}</span>
            <span className="mt-2 block text-sm leading-5 text-muted-foreground">{resource.description}</span>
            <span className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.12em] text-primary">
              Open tool →
            </span>
          </a>
        ))}
      </div>

      <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
        These planning tools are on TexasDefined and are separate from Keep TX Red's reporting. TexasDefined may display clearly disclosed partner links on relevant planning pages.
      </p>
    </CardShell>
  );
}

export function ContextualAffiliatePanel({
  pathname,
  title,
  dek,
  category,
}: {
  pathname: string;
  title?: string | null;
  dek?: string | null;
  category?: string | null;
}) {
  const placement = getKtrAffiliatePlacement({ pathname, title, dek, category });
  if (!placement) return null;

  let content: ReactNode = null;

  switch (placement.kind) {
    case "school-supplies":
      content = <SchoolSupplyAffiliateCard placementId={`${placement.placementId}-inline`} />;
      break;
    case "sports-travel":
      content = (
        <SportsTravelAffiliateCard
          placementId={`${placement.placementId}-inline`}
          market={placement.market}
        />
      );
      break;
    case "homeowner-resources":
      content = (
        <ResourceFunnelCard
          eyebrow="Texas homeowner tools"
          title="Run the household numbers behind the story"
          body="Use the policy or market news as context, then model the practical household costs separately before making a financial decision."
          placementId={`${placement.placementId}-inline`}
          resources={HOMEOWNER_RESOURCES}
        />
      );
      break;
    case "energy-resources":
      content = (
        <ResourceFunnelCard
          eyebrow="Texas energy & household costs"
          title="See what the numbers mean for a household budget"
          body="Grid and electricity stories can move quickly. These tools help translate rates and utility costs into a separate household planning estimate."
          placementId={`${placement.placementId}-inline`}
          resources={ENERGY_RESOURCES}
        />
      );
      break;
  }

  return (
    <div className="not-prose my-10 md:my-12" data-ktr-contextual-affiliate-slot={placement.kind}>
      {content}
    </div>
  );
}
