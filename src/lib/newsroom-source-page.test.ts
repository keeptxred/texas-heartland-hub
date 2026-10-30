import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  extractNewsroomArticleJsonLd,
  extractReadableNewsroomHtml,
  extractNewsroomMarkedArticleBody,
  isNewsroomSourceFetchCoolingDown,
  newsroomHydrationPriority,
  NEWSROOM_SUBSTANTIVE_SOURCE_CHARS,
  looksSyntheticNewsroomText,
  shouldFetchNewsroomSourcePage,
  shouldReplaceNewsroomSourceBody,
} from "./newsroom-source-page.server";
import { trimTdemPressReleaseArchive } from "./tdem-press-release-body";

describe("newsroom source-page enrichment", () => {
  it("spends the fixed fetch budget on independent pending stories near the evidence floor first", () => {
    const priority = (pending: boolean, independentlySourced: boolean, evidenceChars: number, requiredEvidenceChars = 5_000) =>
      newsroomHydrationPriority({ pending, independentlySourced, evidenceChars, requiredEvidenceChars, editorialScore: 70 });
    expect(priority(true, true, 4_900)).toBeGreaterThan(priority(true, true, 700));
    expect(priority(true, true, 700)).toBeGreaterThan(priority(true, true, 5_100));
    expect(priority(true, true, 5_100)).toBeGreaterThan(priority(true, false, 4_900));
    expect(priority(true, false, 4_900)).toBeGreaterThan(priority(false, true, 4_900));
    expect(priority(true, true, 8_900, 9_000)).toBeGreaterThan(priority(true, true, 9_500, 9_000));
    const builder = readFileSync("src/routes/api/public/hooks/build-newsroom-research-packets.ts", "utf8");
    expect(builder).toContain("newsroomHydrationPriority({");
    expect(builder).toContain(".slice(0, SOURCE_PAGE_FETCH_LIMIT)");
    expect(builder).toContain("const SOURCE_PAGE_FETCH_LIMIT = 40");
  });

  it("replaces long synthetic cached packet strings with shorter genuine publisher text", () => {
    const legacyFake = "MULTI-SOURCE STORY PACKET. " + "synthetic source summary. ".repeat(550);
    const independentlyFetched = "The official filing includes dated records and verified procedural findings. ".repeat(38);
    expect(legacyFake.length).toBeGreaterThan(independentlyFetched.length);
    expect(shouldReplaceNewsroomSourceBody(legacyFake, independentlyFetched)).toBe(true);
    expect(shouldReplaceNewsroomSourceBody(independentlyFetched, legacyFake)).toBe(false);
    expect(shouldReplaceNewsroomSourceBody(independentlyFetched, "Short teaser")).toBe(false);
    expect(shouldReplaceNewsroomSourceBody("Real original publisher record. ".repeat(250), independentlyFetched)).toBe(false);
    const builder = readFileSync("src/routes/api/public/hooks/build-newsroom-research-packets.ts", "utf8");
    expect(builder).toContain("shouldReplaceNewsroomSourceBody(result.feed.extracted_body, result.body, result.feed.link)");
    expect(builder).not.toContain("result.body.length <= existing.length + 100");
  });

  it("replaces a previously cached TDEM archive with the shorter verified full release", () => {
    const officialUrl = "https://www.tdem.texas.gov/press-release/10-29-26";
    // Use varied substantive content: a real article has many unique seven-word
    // sequences; repeating one sentence 24 times is not an adequate continuity fixture.
    const article = Array.from({ length: 32 }, (_, index) =>
      `Official release paragraph ${index + 1} records the county response coordination unit ${index + 10}, documented hazard assessment, specific field assistance, evacuation guidance and dated emergency resource deployment.`
    ).join(" ");
    const navigation = "Related Pages " + "October 29, 2026 October 28, 2026 September 25, 2026 ".repeat(70) + "Privacy Policy";
    const polluted = article + navigation;
    expect(polluted.length).toBeGreaterThan(4_000);
    expect(trimTdemPressReleaseArchive(officialUrl, polluted)).toBe(article.trim());
    expect(shouldFetchNewsroomSourcePage({ url: officialUrl, extractedBody: polluted })).toBe(true);
    expect(shouldReplaceNewsroomSourceBody(polluted, article.trim(), officialUrl)).toBe(true);
    const challengeHtml = "Please verify you are a person before viewing this website. Security check and cookie challenge in progress. ".repeat(140);
    expect(challengeHtml.length).toBeGreaterThan(polluted.length);
    expect(shouldReplaceNewsroomSourceBody(polluted, challengeHtml, officialUrl)).toBe(false);
    // Neither a short RSS teaser nor a different publisher can trigger this replacement.
    expect(shouldReplaceNewsroomSourceBody(polluted, "short", officialUrl)).toBe(false);
    expect(shouldReplaceNewsroomSourceBody(polluted, article, "https://example.com/article")).toBe(false);
    expect(trimTdemPressReleaseArchive("https://example.com/article", polluted)).toBe(polluted);
    expect(trimTdemPressReleaseArchive("https://www.tdem.texas.gov/regions", polluted)).toBe(polluted);
    expect(trimTdemPressReleaseArchive(officialUrl, article)).toBe(article);
    const builder = readFileSync("src/routes/api/public/hooks/build-newsroom-research-packets.ts", "utf8");
    expect(builder).toContain("shouldReplaceNewsroomSourceBody(result.feed.extracted_body, result.body, result.feed.link)");
    expect(builder).toContain('enrichedById.get(result.feed.id) ?? result.feed.extracted_body');
  });

  it("targets thin publisher bodies and synthetic pollution", () => {
    expect(shouldFetchNewsroomSourcePage({
      url: "https://example.com/story",
      extractedBody: "short source text",
    })).toBe(true);
    expect(shouldFetchNewsroomSourcePage({
      url: "https://example.com/story",
      extractedBody: `MULTI-SOURCE STORY PACKET. ${"synthetic ".repeat(1000)}`,
    })).toBe(true);
  });

  it("does not refetch already-substantive clean source bodies", () => {
    expect(shouldFetchNewsroomSourcePage({
      url: "https://example.com/story",
      extractedBody: "Clean publisher evidence sentence. ".repeat(150),
    })).toBe(false);
  });

  it("skips Google News wrappers, legislative clipping indexes, and non-http links", () => {
    expect(shouldFetchNewsroomSourcePage({
      url: "https://news.google.com/rss/articles/abc",
      extractedBody: "",
    })).toBe(false);
    expect(shouldFetchNewsroomSourcePage({ url: "mailto:test@example.com", extractedBody: "" })).toBe(false);
    expect(shouldFetchNewsroomSourcePage({
      url: "http://www.lrl.state.tx.us/cl.cfm?id=454951",
      extractedBody: "",
    })).toBe(false);
    expect(shouldFetchNewsroomSourcePage({
      url: "https://lrl.texas.gov/currentissues/clips/2026/article",
      extractedBody: "",
    })).toBe(false);
    // Authentic government legislative documents are not newspaper clippings.
    expect(shouldFetchNewsroomSourcePage({
      url: "https://lrl.texas.gov/legis/89R/overview",
      extractedBody: "",
    })).toBe(true);
  });


  it("backs off unreadable publisher pages for 24h while keeping successful fetches at 6h", () => {
    const now = Date.parse("2026-10-15T12:00:00Z");
    const hour = 60 * 60 * 1000;
    const check = (hoursAgo: number, result: string) => isNewsroomSourceFetchCoolingDown(
      { last_attempt_at: new Date(now - hoursAgo * hour).toISOString(), last_result: result },
      now, 6 * hour, 24 * hour,
    );
    expect(check(12, "no_readable_body")).toBe(true);
    expect(check(25, "no_readable_body")).toBe(false);
    expect(check(4, "success")).toBe(true);
    expect(check(7, "success")).toBe(false);
    expect(NEWSROOM_SUBSTANTIVE_SOURCE_CHARS).toBe(4000);
    expect(check(4, "update_failed")).toBe(true);
    // A readable but still thin result is not useful to retry four times a day.
    expect(isNewsroomSourceFetchCoolingDown(
      { last_attempt_at: new Date(now - 12 * hour).toISOString(), last_result: "success", chars: 3999 },
      now, 6 * hour, 24 * hour,
    )).toBe(true);
    expect(isNewsroomSourceFetchCoolingDown(
      { last_attempt_at: new Date(now - 25 * hour).toISOString(), last_result: "success", chars: 3999 },
      now, 6 * hour, 24 * hour,
    )).toBe(false);
    expect(isNewsroomSourceFetchCoolingDown(
      { last_attempt_at: new Date(now - 7 * hour).toISOString(), last_result: "success", chars: 4000 },
      now, 6 * hour, 24 * hour,
    )).toBe(false);
    // Missing legacy length metadata preserves the existing six-hour success retry.
    expect(check(7, "success")).toBe(false);
    expect(isNewsroomSourceFetchCoolingDown(null, now, 6 * hour, 24 * hour)).toBe(false);
    expect(isNewsroomSourceFetchCoolingDown(
      { last_attempt_at: "invalid", last_result: "no_readable_body" }, now, 6 * hour, 24 * hour,
    )).toBe(false);
  });

  it("extracts readable article text without scripts or page chrome", () => {
    const html = `<html><body><header>Navigation</header><script>bad()</script><article><h1>Texas update</h1><p>${"Substantive verified publisher sentence. ".repeat(25)}</p></article><footer>Footer</footer></body></html>`;
    const text = extractReadableNewsroomHtml(html) ?? "";
    expect(text.length).toBeGreaterThan(500);
    expect(text).toContain("Texas update");
    expect(text).not.toContain("bad()");
    expect(text).not.toContain("Navigation");
  });

  it("selects the actual substantive article instead of the first teaser on a multi-article publisher page", () => {
    const html = `<html><body><header>Home / Latest</header>
      <article class="preview"><h2>Unrelated teaser</h2><p>${"Unrelated link. ".repeat(9)}</p></article>
      <main><article class="content">
        <h1>Texas public hearing and verified agency record</h1>
        <p>${"Direct publisher report describing the official date, agency record, filing and response. ".repeat(55)}</p>
      </article></main>
      <article class="related"><h2>Another item</h2><p>${"Small related item. ".repeat(20)}</p></article>
      <footer>Newsletter and promotions</footer></body></html>`;
    const text = extractReadableNewsroomHtml(html);
    expect(text?.length ?? 0).toBeGreaterThan(4_000);
    expect(text).toContain("Texas public hearing and verified agency record");
    expect(text).not.toContain("Unrelated teaser");
    expect(text).not.toContain("Another item");
    expect(text).not.toContain("Newsletter");
  });

  it("extracts the complete nested publisher story body instead of a short related-story article", () => {
    const paragraph = "Official state records and independently documented county testimony describe the agency action and its actual procedural requirements. ".repeat(48);
    const html = '<main>'
      + '<article class="related"><h2>Sidebar teaser</h2><p>' + "Unrelated teaser. ".repeat(24) + '</p></article>'
      + '<div class="article-body story__content"><div class="wrapper">'
      + '<h1>County election filing records reviewed</h1><p>' + paragraph + '</p>'
      + '<div><p>' + "A verified source describes the filing date and named agency correspondence. ".repeat(14) + '</p></div>'
      + '</div></div>'
      + '<footer>' + "Promotional subscription messaging. ".repeat(60) + '</footer></main>';
    const extracted = extractNewsroomMarkedArticleBody(html);
    expect(extracted?.length).toBeGreaterThan(5_000);
    expect(extractReadableNewsroomHtml(html)).toBe(extracted);
    expect(extracted).toContain("County election filing records reviewed");
    expect(extracted).not.toContain("Sidebar teaser");
    expect(extracted).not.toContain("Promotional subscription");
    const withScripts = '<div class="article-body"><script>privateFakeFactFromScript()</script>'
      + '<style>.fake-narrative { content: "unsupported"; }</style>'
      + '<p>' + paragraph + '</p></div>';
    const safe = extractNewsroomMarkedArticleBody(withScripts);
    expect(safe).toContain("Official state records");
    expect(safe).not.toContain("privateFakeFactFromScript");
    expect(safe).not.toContain("unsupported");
  });

  it("supports schema.org itemprop and explicit article-body data-component markers", () => {
    const paragraph = "The verified publisher article identifies official records, agency filings, response dates, and the statements directly attributable to each source. ".repeat(46);
    for (const attrs of ['itemprop="articleBody"', 'data-testid="article-body"', 'data-component="ArticleBody"']) {
      const html = '<section ' + attrs + '><div class="row"><p>' + paragraph + '</p></div></section>';
      expect(extractNewsroomMarkedArticleBody(html)?.length ?? 0, attrs).toBeGreaterThan(4_000);
    }
  });

  it("rejects generic main, synthetic packet text and unrelated short related cards as evidence", () => {
    const generic = '<main class="site-body">' + "<p>Other site news and navigation. </p>".repeat(230) + '</main>';
    expect(extractNewsroomMarkedArticleBody(generic)).toBeNull();
    const fake = '<div class="article-body"><p>MULTI-SOURCE STORY PACKET. '
      + "Fabricated composite packet data. ".repeat(250) + '</p></div>';
    expect(extractNewsroomMarkedArticleBody(fake)).toBeNull();
    const teaser = '<article class="related-article"><p>' + "Other news. ".repeat(15) + '</p></article>';
    expect(extractNewsroomMarkedArticleBody(teaser)).toBeNull();
  });

  it("does not join separate short teaser articles into fabricated 500-character evidence", () => {
    const html = `<main>${Array.from({ length: 12 }, (_, i) =>
      `<article><p>Teaser ${i}. ${"Unrelated short news story. ".repeat(4)}</p></article>`).join("")}</main>`;
    expect(extractReadableNewsroomHtml(html)).toBeNull();
  });

  it("keeps synthetic longest articles excluded instead of promoting fake evidence", () => {
    const html = `<article>MULTI-SOURCE STORY PACKET. ${"Bogus source ledger. ".repeat(1100)}</article>
      <article><h1>Genuine official record</h1><p>${"Verifiable full report. ".repeat(270)}</p></article>`;
    const text = extractReadableNewsroomHtml(html);
    expect(text).toContain("Genuine official record");
    expect(text).not.toContain("Bogus source ledger.");
  });

  it("rejects synthetic packet text even when it is long", () => {
    const html = `<article><p>MULTI-SOURCE STORY PACKET. ${"fake evidence sentence. ".repeat(100)}</p></article>`;
    expect(extractReadableNewsroomHtml(html)).toBeNull();
    expect(looksSyntheticNewsroomText("RAW SOURCE PACKET stuff")).toBe(true);
  });
  it("recovers full publisher NewsArticle JSON-LD when the rendered article shell is short", () => {
    const full = "Local Texas officials described what the public record confirmed and what is still unresolved. ".repeat(65);
    const structured = JSON.stringify({ "@context": "https://schema.org", "@type": "NewsArticle", articleBody: full });
    const html = `<html><body><article><h1>Recent Texas story</h1><p>${"Brief preview. ".repeat(55)}</p></article><script type="application/ld+json">${structured}</script></body></html>`;
    expect(full.length).toBeGreaterThan(5_000);
    const result = extractReadableNewsroomHtml(html);
    expect(result).toContain("Local Texas officials described");
    expect(result?.length).toBeGreaterThan(5_000);
    expect(result).not.toContain("Brief preview.");
  });

  it("handles nested schema.org graph without treating a website description as article evidence", () => {
    const report = "Texas state agency records describe the published action and its statutory filing procedures. ".repeat(60);
    const html = `<script data-id="publisher" type='application/ld+json'>${JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebSite", description: "This page is full of trustworthy facts. ".repeat(350) },
        { "@type": ["Article", "NewsArticle"], articleBody: report },
      ],
    })}</script>`;
    expect(extractNewsroomArticleJsonLd(html)).toContain("Texas state agency records");
    expect(extractReadableNewsroomHtml(html)).not.toContain("This page is full of trustworthy facts");
  });

  it("refuses to invent research evidence from site descriptions or malformed structured data", () => {
    const onlyDescription = `<script type="application/ld+json">${JSON.stringify({
      "@type": "WebPage", description: "Generic site boilerplate. ".repeat(400),
    })}</script>`;
    expect(extractNewsroomArticleJsonLd(onlyDescription)).toBeNull();
    expect(extractReadableNewsroomHtml(onlyDescription)).toBeNull();
    expect(extractNewsroomArticleJsonLd('<script type="application/ld+json">{broken</script>')).toBeNull();
    expect(extractNewsroomArticleJsonLd(`<script type="application/ld+json">${JSON.stringify({
      "@type": "NewsArticle", articleBody: "MULTI-SOURCE STORY PACKET. " + "fabricated evidence ".repeat(700),
    })}</script>`)).toBeNull();
  });

  it("keeps the existing main-word and independent publisher safety checks separate from extraction", () => {
    const packetBuilder = readFileSync("src/routes/api/public/hooks/build-newsroom-research-packets.ts", "utf8");
    const publisher = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");
    expect(packetBuilder).toContain("fetchReadableNewsroomSource(feed.link)");
    expect(publisher).toContain("newsroomHasPublisherDiversity(sources)");
    expect(publisher).toContain("researchPacketEvidenceChars(packetRow.packet_json)");
    expect(publisher).toContain("const imageReady = Boolean(preparedImage.ok");
    expect(publisher).toContain("newsroom_text_first_verified");
  });

});
