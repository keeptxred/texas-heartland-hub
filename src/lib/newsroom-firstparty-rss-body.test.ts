import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { extractFirstPartyRssArticleBody } from "./newsroom-firstparty-rss-body";

const report = [
  "The city administration published an official record with the date and the subject specified.",
  "The source identifies the administrative action, its stated reasoning, and the affected public process.",
  "A separate published record provides a schedule and a description of the governing procedure.",
  "The report explains where people can obtain the original documents and confirm the agency announcement.",
  "It distinguishes what the public record says from the allegations still under independent review.",
].join(" ");
const body = Array.from({ length: 5 }, () => "<p>" + report + "</p>").join("");
const rss = '<item><title>State filing explains Texas administrative process</title><link>https://texastribune.org/story</link><description>Short abstract</description><content:encoded><![CDATA[<article>' + body + '</article>]]></content:encoded></item>';

describe("genuine original-publisher RSS source evidence", () => {
  it("extracts substantive same-publisher content:encoded article, not the short description", () => {
    const extracted = extractFirstPartyRssArticleBody(rss, "Texas Tribune", "https://www.texastribune.org/story");
    expect(extracted).not.toBeNull();
    expect(extracted!.length).toBeGreaterThan(1000);
    expect(extracted).toContain("official record");
    expect(extracted).not.toContain("Short abstract");
    expect(extracted).not.toContain("<p>");
  });

  it("does not promote Google News discovery wrappers or relays into verified reporting", () => {
    expect(extractFirstPartyRssArticleBody(rss, "Texas Politics — Google News", "https://www.texastribune.org/story")).toBeNull();
    expect(extractFirstPartyRssArticleBody(rss, "Texas Tribune", "https://news.google.com/rss/articles/CBMi")).toBeNull();
    expect(extractFirstPartyRssArticleBody(rss, "Texas Tribune", "https://project.supabase.co/functions/v1/ktr-rss-relay")).toBeNull();
  });

  it("rejects thin descriptions, fake packets, malformed links, and scripts", () => {
    expect(extractFirstPartyRssArticleBody("<item><description>short description</description></item>", "Texas Tribune", "https://texastribune.org/story")).toBeNull();
    expect(extractFirstPartyRssArticleBody(rss, "Texas Tribune", "javascript:alert(1)")).toBeNull();
    const synthetic = rss.replace(body, "<p>MULTI-SOURCE STORY PACKET. " + report.repeat(8) + "</p>");
    expect(extractFirstPartyRssArticleBody(synthetic, "Texas Tribune", "https://texastribune.org/story")).toBeNull();
    const scripted = rss.replace(body, '<script>window.sneaky = "x";</script>' + body);
    expect(extractFirstPartyRssArticleBody(scripted, "Texas Tribune", "https://texastribune.org/story")).not.toContain("window.sneaky");
  });

  it("caps usable source bytes and accepts explicit Atom HTML body", () => {
    const oversized = rss.replace(body, body.repeat(40));
    expect(extractFirstPartyRssArticleBody(oversized, "Texas Tribune", "https://texastribune.org/story")?.length).toBe(8000);
    const atom = '<entry><title>Official record</title><content type="html"><![CDATA[' + body + ']]></content></entry>';
    expect(extractFirstPartyRssArticleBody(atom, "Texas Tribune", "https://texastribune.org/story")?.length).toBeGreaterThan(1000);
  });

  it("keeps ingestion single-source and existing-publisher publication gates", () => {
    const ingestion = readFileSync("src/routes/api/public/hooks/ingest-feeds.ts", "utf8");
    expect(ingestion).toContain("extractFirstPartyRssArticleBody(block, fallbackSource, link)");
    expect(ingestion).toContain("...(embeddedArticle ? { extracted_body: embeddedArticle } : {})");
    expect(ingestion).toContain("ignoreDuplicates: true");
    const preflight = readFileSync("src/lib/newsroom-publication-preflight.ts", "utf8");
    expect(preflight).toContain("newsroomHasPublisherDiversity");
    const publisher = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");
    expect(publisher).toContain("newsroomHasPublisherDiversity(sources)");
    expect(publisher).toContain("await prepareFeaturedImageForUnpublishedNewsroomArticle");
  });
});
