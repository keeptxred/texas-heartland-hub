import { describe, expect, it } from "vitest";
import {
  getArticleImageAttribution,
  getGeneratedArticleImageDisclosure,
  hasRequiredArticleImageAttribution,
  shouldContainArticleImage,
} from "./article-image-attribution";

const AM_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lone_Star_Showdown_2006_McGee_on_goal-line.jpg";

describe("article image attribution", () => {
  it("credits the exact Flock Safety ALPR archive photograph", () => {
    expect(
      getArticleImageAttribution(
        "https://commons.wikimedia.org/wiki/Special:Redirect/file/Flock_Safety_License_Plate_Reader_Camera_in_Colorado_(55307233186).jpg",
      ),
    ).toMatchObject({
      credit: "Tony Webster",
      licenseName: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    });
  });

  it("renders complete attribution metadata for the Texas A&M representative football image", () => {
    expect(getArticleImageAttribution(AM_IMAGE)).toEqual({
      credit: "Johntex",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Lone_Star_Showdown_2006_McGee_on_goal-line.jpg",
      licenseName: "CC BY 2.5",
      licenseUrl: "https://creativecommons.org/licenses/by/2.5/",
      caption:
        "Representative archive Texas A&M football photo from the 2006 Lone Star Showdown; not the 2026 Missouri State game.",
      usageNote: "Source image unmodified; page presentation may crop it responsively.",
    });
  });

  it("credits the reusable LUPE organization image", () => {
    expect(
      getArticleImageAttribution(
        "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lupe_logo_jpeg.jpg",
      ),
    ).toMatchObject({
      credit: "TE(HIST 316)",
      licenseName: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    });
  });

  it("credits the governed Texas Stock Exchange identity graphic", () => {
    expect(
      getArticleImageAttribution(
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/TXSE_logo_Sep_2024.svg/1280px-TXSE_logo_Sep_2024.svg.png",
      ),
    ).toMatchObject({
      credit: "TXSE Group Inc.",
      licenseName: "Public domain (PD-textlogo)",
    });
  });

  it("credits the representative Frida Kahlo impersonator photograph", () => {
    expect(
      getArticleImageAttribution(
        "https://commons.wikimedia.org/wiki/Special:Redirect/file/Folclor_mexicano_-_Frida_Kahlo.jpg",
      ),
    ).toMatchObject({
      credit: "Lemad.resaeva",
      licenseName: "CC BY-SA 4.0",
    });
  });

  it("credits licensed September primary-subject remediation photos", () => {
    expect(
      getArticleImageAttribution(
        "https://commons.wikimedia.org/wiki/Special:Redirect/file/Entrance_to_San_Antonio_Zoo_IMG_3110.JPG",
      ),
    ).toMatchObject({
      credit: "Billy Hathorn",
      licenseName: "CC BY-SA 3.0",
    });
    expect(
      getArticleImageAttribution(
        "https://commons.wikimedia.org/wiki/Special:Redirect/file/Texas_A%26M_University_Academic_Building.jpg",
      ),
    ).toMatchObject({
      credit: "Donnie Ray Jones",
      licenseName: "CC BY 2.0",
    });
  });


  it("credits every attribution-required remediated hero added by the final audit", () => {
    const expected = [
      ["https://commons.wikimedia.org/wiki/Special:Redirect/file/Charley_Crockett.jpg", "Bobby Cochran", "CC BY-SA 4.0"],
      ["https://commons.wikimedia.org/wiki/Special:Redirect/file/Pickle_Juice_Drinking_Competition.jpg", "BanjoZebra", "CC BY-SA 4.0"],
      ["https://commons.wikimedia.org/wiki/Special:Redirect/file/ERCOTOperator_2.jpg", "Dpysh w", "CC BY 3.0"],
      ["https://commons.wikimedia.org/wiki/Special:Redirect/file/USA_Big_Bend_Rio_Grande_TX.jpg", "Daniel Schwen", "CC BY-SA 2.5"],
      ["https://commons.wikimedia.org/wiki/Special:Redirect/file/1_Opening_the_box_(12001259465).jpg", "Bob Herndon, U.S. Fish and Wildlife Service", "CC BY 2.0"],
      ["https://commons.wikimedia.org/wiki/Special:Redirect/file/Tesla_Cybercab_-_San_Francisco_-_June_2026.jpg", "9yz", "CC BY 4.0"],
      ["https://commons.wikimedia.org/wiki/Special:Redirect/file/Lake_Livingston_Dam.jpg", "i_am_jim", "CC BY-SA 3.0"],
      ["https://commons.wikimedia.org/wiki/Special:Redirect/file/Fallopian_tube.jpg", "Scientific Animations", "CC BY-SA 4.0"],
      ["https://commons.wikimedia.org/wiki/Special:Redirect/file/0011Tarrant%20County%20Courthouse%20Full%20E%20Fort%20Worth%20Texas.jpg", "Mark Fisher", "CC BY-SA 3.0"],
      ["https://commons.wikimedia.org/wiki/Special:Redirect/file/Celina%20High%20School%2C%20Friday%20Night%20Football.jpg", "Heidi Knapp", "CC BY-SA 4.0"],
      ["https://commons.wikimedia.org/wiki/Special:Redirect/file/Federal_Courthouse,_Austin,_TX_IMG_6339.JPG", "Billy Hathorn", "CC BY-SA 3.0"],
      ["https://commons.wikimedia.org/wiki/Special:Redirect/file/HuntsvilleUnitHuntsvilleTX.jpg", "Nick DiFonzo", "CC BY 2.0"],
      ["https://commons.wikimedia.org/wiki/Special:Redirect/file/Stock_ponds_are_vital_for_livestock_to_survive_at_Stasney%27s_Cook_Ranch_in_Albany,_Texas._(25017182991).jpg", "USDA NRCS Texas", "Public domain (U.S. Department of Agriculture work)"],
      ["https://commons.wikimedia.org/wiki/Special:Redirect/file/Texas_Woman%27s_University_September_2015_04_(Old_Main_Building).jpg", "Michael Barera", "CC BY-SA 4.0"],
      ["https://upload.wikimedia.org/wikipedia/commons/3/33/Japanese_dinner%2C_kaiseki.jpg", "(WT-en) Jpatokal at English Wikivoyage", "CC BY-SA 3.0"],
    ] as const;

    for (const [url, credit, licenseName] of expected) {
      expect(getArticleImageAttribution(url)).toMatchObject({ credit, licenseName });
      expect(hasRequiredArticleImageAttribution(url)).toBe(true);
    }
  });

  it("contains wide governed identity graphics instead of cropping them", () => {
    expect(shouldContainArticleImage(
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lupe_logo_jpeg.jpg",
    )).toBe(true);
    expect(shouldContainArticleImage(
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/TXSE_logo_Sep_2024.svg/1280px-TXSE_logo_Sep_2024.svg.png",
    )).toBe(true);
    expect(shouldContainArticleImage(AM_IMAGE)).toBe(false);
  });

  it("fails closed for unregistered external images instead of inventing credit", () => {
    expect(getArticleImageAttribution("https://example.com/photo.jpg")).toBeNull();
    expect(hasRequiredArticleImageAttribution("https://example.com/photo.jpg")).toBe(false);
  });

  it("normalizes empty image URLs to no attribution", () => {
    expect(getArticleImageAttribution(null)).toBeNull();
    expect(getArticleImageAttribution("   ")).toBeNull();
  });

  it("visibly discloses generated hero imagery as illustrative", () => {
    expect(
      getGeneratedArticleImageDisclosure(
        "/images/news/generated/2026-08-09/puffy-taco-race.png",
      ),
    ).toContain("not a documentary photograph");
    expect(
      getGeneratedArticleImageDisclosure(
        "https://keeptxred.com/api/public/article-image/example.jpg",
      ),
    ).toContain("Illustrative image generated by Keep TX Red");
    expect(getGeneratedArticleImageDisclosure(AM_IMAGE)).toBeNull();
  });
});
