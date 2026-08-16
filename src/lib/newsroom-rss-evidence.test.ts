import { describe, expect, it } from "vitest";
import { extractRssEvidence } from "./newsroom-rss-evidence.server";

describe("newsroom RSS evidence enrichment", () => {
  it("prefers full content:encoded body over the short RSS description", () => {
    const xml = `<?xml version="1.0"?><rss><channel><item>
      <title>Texas agency announces major update</title>
      <link>https://example.com/texas-update</link>
      <description><![CDATA[Short summary only.]]></description>
      <content:encoded><![CDATA[
        <article><p>${"Substantive Texas source evidence. ".repeat(30)}</p></article>
      ]]></content:encoded>
    </item></channel></rss>`;
    const evidence = extractRssEvidence(xml);
    const body = evidence.get("https://example.com/texas-update") ?? "";
    expect(body.length).toBeGreaterThan(400);
    expect(body).toContain("Substantive Texas source evidence.");
    expect(body).not.toContain("<article>");
  });

  it("ignores short summaries that cannot materially support a newsroom draft", () => {
    const xml = `<rss><channel><item><title>Brief</title><link>https://example.com/brief</link><description>Too short.</description></item></channel></rss>`;
    expect(extractRssEvidence(xml).has("https://example.com/brief")).toBe(false);
  });

  it("supports Atom content elements as evidence", () => {
    const xml = `<feed><entry><title>Texas entry</title><link href="https://example.com/atom"/><content type="html"><![CDATA[<p>${"Atom evidence sentence. ".repeat(30)}</p>]]></content></entry></feed>`;
    const body = extractRssEvidence(xml).get("https://example.com/atom") ?? "";
    expect(body.length).toBeGreaterThan(400);
  });
});
