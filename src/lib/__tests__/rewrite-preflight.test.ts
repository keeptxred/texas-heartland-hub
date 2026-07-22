import { describe, expect, it, mock } from "bun:test";
import {
  assessRewritePreflight,
  assertRewriteableOrThrow,
  PreflightBlockedError,
} from "@/lib/rewrite-preflight";

const SHORT_RSS =
  "Gov. Greg Abbott signed a new bill today. Details below."; // ~10 words

// A realistic ~500-word extraction from a linked article.
const FULL_EXTRACTED = `AUSTIN, Texas — Governor Greg Abbott on Monday signed House Bill 42 into law,
overhauling how the state distributes disaster recovery funds after Hurricane Beryl exposed
major gaps in the previous system. Attorney General Ken Paxton and Lieutenant Governor Dan Patrick
joined the signing ceremony at the Texas Capitol on October 14, 2025.
The bill, sponsored by State Senator Charles Perry and State Representative Dustin Burrows,
passed the Texas Senate 28-3 and the Texas House 118-22 during the September special session.
Under the new law, the Texas Division of Emergency Management will distribute $1.4 billion in
direct assistance to counties within 45 days of a federal disaster declaration, a sharp reduction
from the 120-day timeline that drew criticism during the Hurricane Beryl response in July 2024.
"Texans deserve a government that shows up before the bureaucracy does," Abbott said at the
ceremony. Paxton announced he had filed a companion enforcement plan with the Texas Comptroller.
The law also authorizes emergency housing vouchers for families displaced by wildfires, floods,
and tornadoes, and creates a Texas Storm Reserve Fund seeded with $500 million from the state's
Economic Stabilization Fund. Harris County Judge Lina Hidalgo, Galveston Mayor Craig Brown, and
Beaumont Mayor Kyle Hayes announced they would seek the first allocations under the new formula.
Representative Burrows told reporters the bill was drafted after months of testimony from
county judges, sheriffs, and school district superintendents who described delayed federal
reimbursements that forced local governments to borrow at high interest rates. The Texas
Association of Counties endorsed the measure in August, and 172 of 254 Texas counties filed
resolutions of support with the legislature. Analysts at the Texas Public Policy Foundation
estimate the accelerated timeline will save participating counties approximately $87 million
annually in avoided borrowing costs, based on 2022 through 2024 disaster data.
The law takes effect January 1, 2026, and includes a sunset review provision requiring the
legislature to reauthorize the fund every six years. Governor Abbott indicated he would file
a supplemental appropriations request during the 2027 regular session to expand the reserve.
Statewide agencies were directed to publish implementation rules within 90 days, and the Texas
Sunset Advisory Commission will audit the program in 2028.`.repeat(1); // ~500+ words

describe("assessRewritePreflight — extracted body vs RSS blurb", () => {
  it("blocks when only a short RSS description is passed", () => {
    const r = assessRewritePreflight({
      title: "Texas passes new law",
      description: SHORT_RSS,
      link: "https://example.com/story",
    });
    expect(r.rewriteable).toBe(false);
    expect(r.reason).toBe("BODY_TOO_SHORT");
  });

  it("passes when the full extracted article body is supplied even though the RSS was short", () => {
    const r = assessRewritePreflight({
      title: "Governor signs Texas disaster recovery overhaul into law",
      description: FULL_EXTRACTED,
      link: "https://example.com/story",
    });
    expect(r.rewriteable).toBe(true);
    expect(r.reason).toBe("READY");
    expect(r.sourceWordCount).toBeGreaterThanOrEqual(300);
  });

  it("classifies paywalled/snippet extractions with the paywall reason (not READY)", () => {
    const paywall =
      "The governor spoke briefly on Monday. Subscribe to continue reading this article. Sign in to continue.";
    const r = assessRewritePreflight({
      title: "Governor speaks",
      description: paywall,
      link: "https://example.com/story",
    });
    expect(r.rewriteable).toBe(false);
    expect(r.reason).toBe("PAYWALL_OR_TRUNCATED");
  });

  it("passes short but fact-dense official releases via the factual-signal bypass", () => {
    const release = `Governor Greg Abbott announced on October 14, 2025 that Texas
will allocate $250 million in emergency funds. Attorney General Ken Paxton filed
the enforcement order today. Senator Charles Perry voted in support. Harris County
will receive 42% of the initial 500,000 dollar disbursement.`;
    const r = assessRewritePreflight({
      title: "Texas Announces $250M Emergency Fund",
      description: release,
      link: "https://gov.texas.gov/news/release",
    });
    expect(r.rewriteable).toBe(true);
    expect(r.reason).toBe("READY");
    expect(r.factualSignalCount).toBeGreaterThanOrEqual(6);
  });
});

describe("assertRewriteableOrThrow — hard guard before the paid AI call", () => {
  it("throws PreflightBlockedError when preflight is not rewriteable, and never calls the rewrite mock", () => {
    const rewriteMock = mock(() => Promise.resolve({ ok: true }));
    const blocked = assessRewritePreflight({
      title: "Short",
      description: SHORT_RSS,
      link: "https://example.com/story",
    });
    // The pipeline shape: assert → (only then) call rewrite.
    expect(() => {
      assertRewriteableOrThrow(blocked);
      // If the guard fails to throw, this line would spend AI credits.
      rewriteMock();
    }).toThrow(PreflightBlockedError);
    expect(rewriteMock).not.toHaveBeenCalled();
  });

  it("does not throw when preflight is rewriteable", () => {
    const ok = assessRewritePreflight({
      title: "Governor signs Texas disaster recovery overhaul into law",
      description: FULL_EXTRACTED,
      link: "https://example.com/story",
    });
    expect(() => assertRewriteableOrThrow(ok)).not.toThrow();
  });
});