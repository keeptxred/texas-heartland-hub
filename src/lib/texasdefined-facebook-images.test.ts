import { describe, expect, it } from "vitest";
import {
  parseTexasDefinedMerchantProducts,
  scoreTexasDefinedImageText,
  texasDefinedImageTopicTerms,
} from "./texasdefined-facebook-images";

describe("TexasDefined Facebook image topic matching", () => {
  it("expands scenic-drive engagement posts into useful image topics", () => {
    const terms = texasDefinedImageTopicTerms("What is the prettiest drive in Texas?", "engagement");

    expect(terms).toContain("road trip");
    expect(terms).toContain("scenic drive");
    expect(terms).toContain("hill country");
    expect(scoreTexasDefinedImageText("The best Hill Country scenic road trips", terms)).toBeGreaterThan(
      scoreTexasDefinedImageText("Texas property tax deadlines", terms),
    );
  });

  it("adds water and reservoir topics for lake-level posts", () => {
    const terms = texasDefinedImageTopicTerms("Lake Travis is 48.2% full right now", "lake_level");

    expect(terms).toContain("lake");
    expect(terms).toContain("reservoir");
    expect(terms).toContain("water");
  });
});

describe("TexasDefined Merchant feed image parsing", () => {
  it("uses HTTPS product images and preserves the product page as the source", () => {
    const products = parseTexasDefinedMerchantProducts(`
      <rss xmlns:g="http://base.google.com/ns/1.0">
        <channel>
          <item>
            <title><![CDATA[Texas Bluebonnet Shirt &amp; Mug]]></title>
            <link>https://texasdefined.com/shop/bluebonnet-shirt</link>
            <g:image_link>https://images.example.com/bluebonnet-shirt.jpg</g:image_link>
          </item>
        </channel>
      </rss>
    `);

    expect(products).toEqual([
      {
        title: "Texas Bluebonnet Shirt & Mug",
        link: "https://texasdefined.com/shop/bluebonnet-shirt",
        imageUrl: "https://images.example.com/bluebonnet-shirt.jpg",
      },
    ]);
  });

  it("rejects SVG product images so Facebook is never given an unsupported fallback", () => {
    const products = parseTexasDefinedMerchantProducts(`
      <item>
        <title>Texas Logo</title>
        <link>https://texasdefined.com/shop/logo</link>
        <g:image_link>https://texasdefined.com/logo.svg</g:image_link>
      </item>
    `);

    expect(products).toEqual([]);
  });
});
