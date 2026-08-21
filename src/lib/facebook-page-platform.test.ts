import { describe, expect, it } from "vitest";
import {
  FACEBOOK_PLATFORM_KEEP_TX_RED,
  FACEBOOK_PLATFORM_TEXASDEFINED,
  KEEP_TX_RED_FACEBOOK_PAGE_ID,
  facebookPlatformForPage,
  facebookPlatformForTarget,
  facebookTargetForPlatform,
} from "./facebook-page-platform";

describe("facebookPlatformForPage", () => {
  it("maps the Keep TX Red page by stable page id", () => {
    expect(
      facebookPlatformForPage({
        id: KEEP_TX_RED_FACEBOOK_PAGE_ID,
        name: "A renamed Keep TX Red page",
      }),
    ).toBe(FACEBOOK_PLATFORM_KEEP_TX_RED);
  });

  it("maps TexasDefined by normalized page name", () => {
    expect(facebookPlatformForPage({ id: "td-1", name: "TexasDefined" })).toBe(
      FACEBOOK_PLATFORM_TEXASDEFINED,
    );
    expect(facebookPlatformForPage({ id: "td-2", name: "Texas Defined" })).toBe(
      FACEBOOK_PLATFORM_TEXASDEFINED,
    );
  });

  it("ignores unrelated Facebook pages", () => {
    expect(facebookPlatformForPage({ id: "other", name: "Other Page" })).toBeNull();
  });
});

describe("Facebook OAuth target mapping", () => {
  it("maps each OAuth target to its own stored platform", () => {
    expect(facebookPlatformForTarget("keeptxred")).toBe(FACEBOOK_PLATFORM_KEEP_TX_RED);
    expect(facebookPlatformForTarget("texasdefined")).toBe(FACEBOOK_PLATFORM_TEXASDEFINED);
  });

  it("maps stored Facebook platforms back to the correct OAuth target", () => {
    expect(facebookTargetForPlatform(FACEBOOK_PLATFORM_KEEP_TX_RED)).toBe("keeptxred");
    expect(facebookTargetForPlatform(FACEBOOK_PLATFORM_TEXASDEFINED)).toBe("texasdefined");
  });
});
