import { describe, expect, it } from "vitest";
import {
  categoryForPillar,
  newsroomRewriteSystemPrompt,
  newsroomRewriteUserPrompt,
  normalizeNewsroomDraft,
  newsroomSourceBackedDek,
  slugifyNewsroomTitle,
  validateNewsroomDraft,
  type NewsroomDraft,
} from "./newsroom-rewrite-adapter";
import type { ResearchPacket } from "./newsroom-research-packet";

const packet: ResearchPacket = {
  packetVersion: 1,
  clusterId: "cluster-1",
  subject: "governor announces texas appointments",
  pillar: "texas-politics-government",
  recommendedFormat: "MERGE",
  editorialScore: 80,
  rules: {
    useOnlyProvidedSources: true,
    doNotInventFacts: true,
    doNotInventQuotes: true,
    preserveAttribution: true,
    preferPrimarySources: true,
  },
  sources: [
    {
      feedItemId: 1,
      title: "Governor announces appointments",
      source: "Office of the Governor",
      url: "https://gov.texas.gov/news/post/example",
      publishedAt: "2026-08-15T12:00:00Z",
      description: "The governor announced appointments to a Texas board.",
      extractedBody: "The Office of the Governor announced appointments to a Texas board on Friday.",
      isPrimarySource: true,
      sourceReputationScore: 95,
    },
  ],
};

describe("newsroom rewrite adapter", () => {
  it("tells MERGE generations to reconcile sources without inventing facts", () => {
    const prompt = newsroomRewriteSystemPrompt(packet);
    expect(prompt).toContain("MERGE package");
    expect(prompt).toContain("Use only facts");
    expect(prompt).toContain("Never invent quotes");
  });

  it("passes the source-grounded packet without adding outside research", () => {
    const payload = JSON.parse(newsroomRewriteUserPrompt(packet));
    expect(payload.clusterId).toBe("cluster-1");
    expect(payload.sources).toHaveLength(1);
    expect(payload.sources[0].source).toBe("Office of the Governor");
  });

  it("keeps newsroom pillar mapping compatible with existing article categories", () => {
    expect(categoryForPillar("sports-nfl")).toBe("Sports");
    expect(categoryForPillar("texas-politics-government")).toBe("Legislature");
    expect(categoryForPillar("texas-border-immigration")).toBe("Border");
  });

  it("builds stable dated news slugs", () => {
    expect(slugifyNewsroomTitle("Texas Board Approves New Rule", "2026-08-15")).toBe("2026-08-15-texas-board-approves-new-rule");
  });

  it("normalizes a reversed FAQ question and answer without another AI call", () => {
    const normalized = normalizeNewsroomDraft({
      brief: { hasClearNewsEvent: true },
      faq: [{ q: "Appointments were announced Friday.", a: "What happened?" }],
    }) as { faq: Array<{ q: string; a: string }> };
    expect(normalized.faq).toEqual([{ q: "What happened?", a: "Appointments were announced Friday." }]);
  });

  it("repairs a headline-copy dek from existing verified summary prose without another model call", () => {
    const title = "House Republicans Pull $3 Million Reserved for Ads Against Henry Cuellar";
    const terse = "House Republicans pull $3 million reserved for ads against Henry Cuellar";
    const summary = "House Republicans are withdrawing $3 million in reserved advertising from the contest for Texas's 28th Congressional District. The move shifts spending toward other South Texas races as the party weighs its options against Democratic Rep. Henry Cuellar.";
    const revised = newsroomSourceBackedDek(title, terse, summary);
    expect(revised.length).toBeGreaterThanOrEqual(80);
    expect(revised).toContain("28th Congressional District");
    expect(revised).not.toBe(terse);
    const normalized = normalizeNewsroomDraft({
      title, dek: terse, summary,
      faq: [{ q: "What happened?", a: "Advertising reservations were withdrawn." }],
    }) as { dek: string };
    expect(normalized.dek).toBe(revised);
  });

  it("preserves an already substantive dek and never fabricates one without a usable summary", () => {
    const good = "Texas officials released an independently verified order setting out who is affected and when the rule takes effect.";
    expect(newsroomSourceBackedDek("Texas Order", good, "Short note.")).toBe(good);
    expect(newsroomSourceBackedDek("Texas Order", "Texas Order", "Short note.")).toBe("Texas Order");
  });

  it("rejects thin generated prose before publication", () => {
    const draft: NewsroomDraft = {
      brief: { hasClearNewsEvent: true, primarySubject: "Texas board", primaryEvent: "appointments announced" },
      title: "Texas board appointments announced Friday",
      dek: "Texas officials announced board appointments Friday.",
      summary: "Texas officials announced new board appointments Friday, according to the Office of the Governor. The announcement identified the appointments and the state board involved, giving Texans a direct update on the latest personnel action from the governor's office and the public body affected by the decision.",
      relevance: "The appointments affect a Texas public board and its state responsibilities.",
      sections: Array.from({ length: 6 }, (_, index) => ({ heading: `Specific section ${index + 1}`, paragraphs: ["Short factual paragraph.", "Another short factual paragraph.", "A third short factual paragraph."] })),
      keyTakeaways: ["One", "Two", "Three"],
      faq: [{ q: "What happened?", a: "Appointments were announced." }],
    };
    const result = validateNewsroomDraft(draft, packet);
    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("below_news_word_floor");
    expect(result.reasons).toContain("weak_newsroom_dek");
  });
});
