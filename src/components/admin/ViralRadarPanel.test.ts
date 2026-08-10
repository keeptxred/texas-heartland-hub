import { describe, expect, it } from "vitest";
import { isViralRadarCandidate } from "./ViralRadarPanel";

describe("Viral Radar candidate scope", () => {
  it("includes stories that meet the primary viral gate", () => {
    expect(isViralRadarCandidate({ viral_score: 70, classification_confidence: 0.8, trend_velocity: 0, source_count: 1, viral_signals: null })).toBe(true);
  });

  it("excludes ordinary editorial feed items", () => {
    expect(isViralRadarCandidate({ viral_score: 45, classification_confidence: 0.9, trend_velocity: 0, source_count: 1, viral_signals: null })).toBe(false);
  });

  it("includes a corroborated breakout slightly below the main gate", () => {
    expect(isViralRadarCandidate({ viral_score: 58, classification_confidence: 0.4, trend_velocity: 22, source_count: 1, viral_signals: null })).toBe(true);
  });
});
