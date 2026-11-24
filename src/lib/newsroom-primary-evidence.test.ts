import { describe, expect, it } from "vitest";
import { isSubstantiveEventPrimary, findEventPrimaryFeedRecords, primaryRecordMatchesEvent } from "./newsroom-primary-evidence";
import { getNewsContextGraphLinks } from "./government-graph";
import type { ResearchPacketSource } from "./newsroom-research-packet";

const subject = "NVIDIA reinstates Jensen Huang as CEO";
const official: ResearchPacketSource = {
  feedItemId: 1, title: "NVIDIA Board Reinstates Jensen Huang as President, CEO and Board Director",
  source: "NVIDIA", url: "https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director",
  publishedAt: "2026-11-23T12:00:00Z", description: "",
  extractedBody: "NVIDIA's board reinstates Jensen Huang as president and CEO, and as a member of the board of directors. The company announced the leadership decision in an official release and described the board action.",
  isPrimarySource: true, sourceReputationScore: 100,
};
describe("event-specific first-party evidence", () => {
  it("recognizes the direct NVIDIA announcement", () => {
    expect(isSubstantiveEventPrimary(official, subject)).toBe(true);
    expect(isSubstantiveEventPrimary({...official, url:"https://example.com/nvidia"}, subject)).toBe(false);
    expect(isSubstantiveEventPrimary({...official, url:"https://nvidianews.nvidia.com.evil.example/news/x"}, subject)).toBe(false);
    expect(isSubstantiveEventPrimary({...official, extractedBody:"", description:""}, subject)).toBe(false);
  });
  it("matches a missing official feed row without inventing URLs", () => {
    const record = {id:1,title:official.title,source:official.source,link:official.url,pub_date:official.publishedAt,description:official.description,extracted_body:official.extractedBody,source_reputation_score:100};
    expect(findEventPrimaryFeedRecords(subject,[record],new Set()).map(s=>s.url)).toEqual([official.url]);
    expect(findEventPrimaryFeedRecords(subject,[record],new Set([1]))).toEqual([]);
    expect(primaryRecordMatchesEvent(subject,"NVIDIA launches new GPU","NVIDIA announces a graphics card")).toBe(false);
    expect(primaryRecordMatchesEvent("SB 49 introduced","Senate Bill 49 introduced","The legislature filed a bill")).toBe(true);
  });
  it("never suggests unrelated Texas statutes for a corporate leadership story", () => {
    expect(getNewsContextGraphLinks("NVIDIA reinstates Jensen Huang as CEO: what the decision means for Texas")).toEqual([]);
  });
});
