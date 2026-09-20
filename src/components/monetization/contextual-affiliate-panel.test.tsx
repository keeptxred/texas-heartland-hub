import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ContextualAffiliatePanel } from "./contextual-affiliate-panel";

describe("ContextualAffiliatePanel", () => {
  it("server-renders approved sports travel affiliates for event-intent stories", () => {
    const html = renderToStaticMarkup(
      <ContextualAffiliatePanel
        pathname="/news/cowboys-home-opener-arlington"
        title="Cowboys Home Opener Brings Weekend Crowds to Arlington"
        dek="AT&T Stadium hosts the game Saturday."
        category="Sports"
      />,
    );

    expect(html).toContain("Hotels.com");
    expect(html).toContain("Dallas CityPASS");
    expect(html).toContain("Rental cars on Booking.com");
    expect(html).toContain('data-affiliate-partner="hotels.com"');
    expect(html).toContain('data-affiliate-partner="citypass"');
    expect(html).toContain('data-affiliate-partner="booking.com"');
  });

  it("server-renders TexasDefined homeowner tools for high-intent property stories", () => {
    const html = renderToStaticMarkup(
      <ContextualAffiliatePanel
        pathname="/news/texas-property-tax-appraisal-changes"
        title="Texas Property Tax Appraisal Changes Hit Homeowners"
        dek="Homestead exemptions and appraisal values shape household costs."
        category="Tax & Spending"
      />,
    );

    expect(html).toContain("Texas homeowner tools");
    expect(html).toContain("Texas property-tax calculators");
    expect(html).toContain("texasdefined.com/property-tax-calculators");
  });

  it("server-renders TexasDefined household-cost tools for energy stories", () => {
    const html = renderToStaticMarkup(
      <ContextualAffiliatePanel
        pathname="/news/texas-electricity-rates-rise"
        title="Texas Electricity Rates Rise as Summer Demand Climbs"
        dek="Households are watching electric bills and ERCOT demand."
        category="Energy"
      />,
    );

    expect(html).toContain("Texas energy &amp; household costs");
    expect(html).toContain("Texas utility cost calculator");
    expect(html).toContain("texasdefined.com/texas-utility-cost-calculator");
  });

  it("renders nothing for ordinary non-event sports coverage", () => {
    const html = renderToStaticMarkup(
      <ContextualAffiliatePanel
        pathname="/news/astros-trade-deadline-move"
        title="Astros Complete Trade Ahead of Deadline"
        dek="Houston adds a veteran pitcher for the stretch run."
        category="Sports"
      />,
    );

    expect(html).toBe("");
  });
});
