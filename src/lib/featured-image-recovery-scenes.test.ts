import { describe, expect, it } from "vitest";
import { repeatedFailureRecoveryScene } from "./featured-image.functions";

const BACKLOG_SLUGS = [
  "2026-09-18-top-texas-republicans-knew-bo-french-s-history-of-racist-comments-they-supported",
  "2026-09-17-more-young-people-are-getting-involved-with-south-texas-civil-rights-group-amid-",
  "2026-09-14-paxton-talarico-affordability-plans-compared",
  "2026-09-10-texas-stock-exchange-first-primary-listings",
  "2026-08-09-sarah-acosta-ksat-farewell",
  "2026-08-09-san-antonio-frida-fest-record",
  "2026-08-08-texas-reserve-officer-mexico-homicides",
  "2026-08-08-tamu-texarkana-athletics-complex",
  "2026-08-08-the-hop-webster-closes-preslees",
  "2026-08-08-daniella-guzman-kprc-return-ticket-review",
] as const;

describe("repeatedFailureRecoveryScene", () => {
  it("provides exact-activity recovery scenes for every current strict-validator backlog item", () => {
    for (const slug of BACKLOG_SLUGS) {
      const scene = repeatedFailureRecoveryScene(slug);
      expect(scene, slug).not.toBeNull();
      expect(scene?.concreteSubject.length, slug).toBeGreaterThan(180);
      expect(scene?.title.length, slug).toBeGreaterThan(12);
    }
  });

  it("keeps named-person recoveries representative instead of fabricating a likeness", () => {
    const boFrench = repeatedFailureRecoveryScene(BACKLOG_SLUGS[0]);
    const sarahAcosta = repeatedFailureRecoveryScene(BACKLOG_SLUGS[4]);
    const custody = repeatedFailureRecoveryScene(BACKLOG_SLUGS[6]);
    const daniella = repeatedFailureRecoveryScene(BACKLOG_SLUGS[9]);

    expect(boFrench?.concreteSubject).toContain("No identifiable public figure");
    expect(sarahAcosta?.concreteSubject).toContain("no fabricated likeness of Sarah Acosta");
    expect(custody?.concreteSubject).toContain("no recognizable likeness of Chad Eberle");
    expect(daniella?.concreteSubject).toContain("no fabricated likeness of Daniella Guzman");
  });

  it("requires the defining physical activity rather than same-domain scenery", () => {
    expect(repeatedFailureRecoveryScene(BACKLOG_SLUGS[1])?.concreteSubject).toContain("actively organizing around immigration issues");
    expect(repeatedFailureRecoveryScene(BACKLOG_SLUGS[2])?.concreteSubject).toContain("concrete policy targets");
    expect(repeatedFailureRecoveryScene(BACKLOG_SLUGS[3])?.concreteSubject).toContain("primary-listing launch");
    expect(repeatedFailureRecoveryScene(BACKLOG_SLUGS[5])?.concreteSubject).toContain("group-count photograph");
    expect(repeatedFailureRecoveryScene(BACKLOG_SLUGS[7])?.concreteSubject).toContain("athletics complex being built");
    expect(repeatedFailureRecoveryScene(BACKLOG_SLUGS[8])?.concreteSubject).toContain("closure and restaurant conversion");
  });

  it("does not override the already-remediated Texas A&M football result", () => {
    expect(repeatedFailureRecoveryScene("2026-09-06-texas-a-m-dominates-missouri-state-in-season-opener")).toBeNull();
  });
});
