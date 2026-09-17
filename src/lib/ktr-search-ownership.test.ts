import { describe, expect, it } from "vitest";
import { isKeepTxRedSearchOwnedStory } from "./ktr-search-ownership";

describe("KTR cross-site search ownership", () => {
  it("keeps TexasDefined lifestyle and routine sports stories out of KTR search surfaces", () => {
    const texasDefinedStories = [
      { title: "FC Dallas opens Leagues Cup play tonight", category: "Sports", kind: "ingested" },
      { title: "Dallas Cowboys weekly outlook", category: "NFL", kind: "sports-nfl" },
      { title: "Weekly pro football outlook", category: "NFL", kind: "sports-nfl" },
      { title: "Texas is a top moving destination for Gen Z", category: "Moving to Texas", kind: "ingested" },
      { title: "A Hill Country road trip for fall", category: "Travel", kind: "news" },
      { title: "New Texas barbecue restaurant opens this weekend", category: "Food", kind: "news" },
    ];

    for (const story of texasDefinedStories) {
      expect(isKeepTxRedSearchOwnedStory(story)).toBe(false);
    }
  });

  it("preserves KTR public-affairs coverage even when a lifestyle or sports entity is involved", () => {
    const keepTxRedStories = [
      {
        title: "Governor directs wildfire response resources",
        description: "The governor directed a state agency to activate emergency resources.",
        kind: "ingested",
      },
      {
        title: "Tarrant County considers voting site reductions",
        description: "Commissioners would reduce Election Day polling locations.",
        kind: "news",
      },
      {
        title: "Texas hospital faces state lawsuit over billing practices",
        description: "The attorney general filed a lawsuit seeking penalties.",
        category: "Health",
        kind: "ingested",
      },
      {
        title: "Attorney general sues Dallas sports venue over state-law dispute",
        description: "The lawsuit asks a Texas court to enforce state law.",
        category: "Sports",
        kind: "sports-general",
      },
      {
        title: "Texas statewide newsroom update",
        description: "A current Texas news development with no lifestyle ownership signal.",
        kind: "news",
      },
    ];

    for (const story of keepTxRedStories) {
      expect(isKeepTxRedSearchOwnedStory(story)).toBe(true);
    }
  });
});
