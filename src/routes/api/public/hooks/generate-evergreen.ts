import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { enrichArticleRow } from "@/lib/content-quality";

const TOPICS: { category: string; topic: string }[] = [
  { category: "Tax & Spending", topic: "How Texas keeps property taxes high and what homeowners can do about it" },
  { category: "Tax & Spending", topic: "Why Texas has no state income tax and how the state actually funds itself" },
  { category: "Energy", topic: "How the Permian Basin powers Texas and the United States" },
  { category: "Energy", topic: "ERCOT explained: how the Texas power grid works and where it fails" },
  { category: "Border", topic: "Texas border policy explained: Operation Lone Star, federal limits, and what changed" },
  { category: "Legislature", topic: "How a bill becomes law in the Texas Legislature" },
  { category: "Legislature", topic: "The powers of the Texas Lieutenant Governor explained" },
  { category: "Elections", topic: "How to verify your Texas voter registration and what ID you need at the polls" },
  { category: "Elections", topic: "Texas primary elections explained: open primaries, runoffs, and party rules" },
  { category: "Education", topic: "School choice in Texas: ESAs, vouchers, and the 2025 legislation explained" },
  { category: "Education", topic: "How Texas funds public schools and why property taxes matter" },
  { category: "Tax & Spending", topic: "Texas homestead exemption explained: who qualifies and how to file" },
  { category: "Legislature", topic: "Texas constitutional amendments: how they pass and why they matter" },
  { category: "Border", topic: "The geography of the Texas border with Mexico, county by county" },
  { category: "Energy", topic: "Texas wind and solar: how renewables fit alongside oil and gas" },
  // Border policy depth
  { category: "Border", topic: "Title 42 and Title 8 explained: how federal border authorities affect Texas" },
  { category: "Border", topic: "Texas border wall construction: funding, mileage, and what landowners should know" },
  { category: "Border", topic: "Texas DPS at the border: how state troopers enforce Operation Lone Star" },
  { category: "Border", topic: "Asylum process at the Texas border: how claims are filed and processed" },
  // Energy regulation explainers
  { category: "Energy", topic: "The Public Utility Commission of Texas explained: what the PUC regulates" },
  { category: "Energy", topic: "Texas Railroad Commission explained: what it actually regulates" },
  { category: "Energy", topic: "How Texas electricity bills are calculated and what the charges mean" },
  { category: "Energy", topic: "Winter Storm Uri and ERCOT reforms: what changed in Texas after 2021" },
  // Election process guides
  { category: "Elections", topic: "How early voting works in Texas: dates, locations, and what to bring" },
  { category: "Elections", topic: "Mail-in ballots in Texas: who qualifies and how to apply" },
  { category: "Elections", topic: "Texas voter ID requirements: accepted IDs and what to do without one" },
  { category: "Elections", topic: "How precinct chairs and county party conventions work in Texas" },
  { category: "Elections", topic: "Texas election audits and ballot security explained" },

  // ── Texas News (culture / economy / lifestyle) — evergreen, NOT breaking ──
  { category: "Economy", topic: "Why Texas is growing so fast in 2026" },
  { category: "Economy", topic: "What is driving jobs in Texas in 2026" },
  { category: "Economy", topic: "The real cost of living in Texas right now" },
  { category: "Economy", topic: "Texas business climate 2026: why companies keep relocating" },
  { category: "Housing", topic: "Texas housing market trends explained" },
  { category: "Housing", topic: "Texas suburbs expansion: how the metros keep spreading" },
  { category: "Housing", topic: "Renting vs buying in Texas in 2026: what actually pencils out" },
  { category: "Growth & Migration", topic: "Why more people are moving to Texas" },
  { category: "Growth & Migration", topic: "Where Texas newcomers are actually settling in 2026" },
  { category: "Growth & Migration", topic: "The Texas triangle: how DFW, Houston, Austin, and San Antonio anchor growth" },
  { category: "Culture & Identity", topic: "What Texas identity actually means in 2026" },
  { category: "Culture & Identity", topic: "Small-town Texas: how rural communities are changing" },
  { category: "Culture & Identity", topic: "Texas food culture: BBQ, Tex-Mex, and what defines the state's table" },
  { category: "Education Trends", topic: "Texas school performance trends: what the numbers actually show" },
  { category: "Education Trends", topic: "How Texas universities became a magnet for out-of-state students" },
  { category: "Sports Culture", topic: "Why Friday night football still defines Texas towns" },
  { category: "Sports Culture", topic: "College football culture in Texas: what makes it different" },
];

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);
}

type GeneratedBody = {
  title: string;
  dek: string;
  keywords: string[];
  intro: string[];
  sections: { heading: string; paragraphs?: string[]; bullets?: string[] }[];
  faq: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  keyTakeaways: string[];
};

const TEXAS_NEWS_CATEGORIES = new Set([
  "Economy",
  "Housing",
  "Growth & Migration",
  "Culture & Identity",
  "Education Trends",
  "Sports Culture",
]);

async function generate(topic: string, category: string, lovableApiKey: string): Promise<GeneratedBody> {
  const isTexasNews = TEXAS_NEWS_CATEGORIES.has(category);

  const toneBlock = isTexasNews
    ? `TONE: Texas pride, neutral-to-proud, informational. This is an evergreen Texas News piece about culture, economy, housing, jobs, migration, or lifestyle — NOT breaking news, NOT emergency alerts, NOT government announcements, NOT legislative updates. Do not cover police scenes, urgent weather warnings, or partisan political figures. Keep the framing on long-term Texas identity, growth, and daily life. Length target: 800–1500 words.`
    : `TONE: neutral, factual, educational. Avoid opinionated or partisan language.`;

  const internalLinksBlock = isTexasNews
    ? `INTERNAL LINKS (REQUIRED): Include 3–5 internal links in body paragraphs using markdown syntax [anchor text](/path). MUST include at least ONE link to each of these pillar guides where natural:
- /texas/no-state-income-tax-2026
- /texas/property-taxes-2026
- /texas/moving-to-texas-2026
Also acceptable: /texas-news, /texas-business, /texas-economy, /houston, /glossary. Do not force links — weave them in naturally.`
    : `INTERNAL LINKS (REQUIRED): Include 3-5 internal links in body paragraphs using markdown syntax [anchor text](/path). Use natural anchor text. Pick from these real internal paths:
- Category pages: /texas-politics, /texas-news, /texas-laws, /elections, /texas-business, /texas-economy, /tax-calculator
- Glossary: /glossary (link the first mention of any specialized term, e.g. [homestead exemption](/glossary))
- Related evergreen guides: /news (newsroom index)
- Pillar: /keep-texas-red
Link at least one glossary term, at least one related category page, and at least one other internal page. Do not force links — weave them in naturally.`;

  const system = `You are the senior editor of Keep TX Red, a Texas-focused news and civic-education site. Write a long-form evergreen explainer. ${toneBlock} Stay factual — never invent statistics, names, or quotes. Cite only well-known public sources (Texas Comptroller, Texas Secretary of State, Texas Legislature Online, ERCOT, U.S. Census, official agency sites).

SEO REQUIREMENTS:
- Title: keyword-rich, under 75 characters, must include "Texas" (or a Texas city/region/institution).
- CTR BOOST: strongly prefer one of these framings in the title when natural: "What This Means for Texans", "The Real Reason Behind …", "… Explained Simply", "Most People Don't Realize …", or "What's Actually Changing in Texas in 2026". Use Texas-identity language. FORBIDDEN: generic informational titles ("A Guide to X", "Overview of Y"), repetitive/templated headlines, or stale news phrasing ("Breaking:", "Update:").
- dek: 140-220 characters, naturally include 1-2 Texas keywords, summarize the actual content.
- OPENING HOOK (REQUIRED): the FIRST sentence of intro[0] must be an emotional-curiosity hook using Texas-identity language. Good examples: "Texas is changing faster than most people realize.", "The reality in Texas is more complex than it looks.", "Here's what actually matters in Texas in 2026.". Do NOT start with "In this article" or a dry definition.
- Total body length: 900-1400 words across intro + sections. HARD MINIMUM 800 words — reject your own draft and add sections if shorter.
- 8-14 keywords.
- 3-5 official .gov / well-known source links.
- 4-6 FAQ entries (real questions Texans ask).

REQUIRED SECTIONS (in this order, use these exact headings):
1. An opening explainer section ("Overview" or similar).
2. "Why This Matters" — explain the significance for Texas voters, Texas politics, or Texas governance.
3. "Impact on Texans" — 2-3 concrete examples (use bullets where helpful).
4. "Historical Context" — relevant Texas/U.S. history; include only when applicable.
5. One topical-authority section chosen from: "How This Affects Texas Elections", "How This Fits Into Texas Political History", or "How This Impacts Texas Policy Debates".
6. Plus 1-2 additional explanatory sections relevant to the topic.
7. "The Texas Angle" — ONE original perspective block (100-150 words): Texas-specific analysis, contrarian viewpoint with evidence, a unique framework, or an on-the-ground reporting summary. Use phrases like "According to internal analysis…", "Our review of county-level filings shows…", or "Local interviews indicate…" where appropriate. This block is REQUIRED.
8. "Reader Questions" — 2-3 short answers (60-100 words each) covering mid-funnel and bottom-funnel concerns where relevant: implementation ("how do I file…"), cost/ROI ("what does this save Texans…"), or differentiators ("how Texas differs from other states"). Skip questions that do not fit the topic.

${internalLinksBlock}

PILLAR LINK WEIGHTING (REQUIRED): Every article MUST link to ALL THREE pillar guides at least once, using natural anchor text: /texas/no-state-income-tax-2026, /texas/property-taxes-2026, /texas/moving-to-texas-2026. Also include one link back to the Texas News hub (/texas-news). Avoid isolated pages — every article must feed the pillar/hub graph.

CONTENT ROTATION (REQUIRED — NO CANNIBALIZATION):
- Do NOT repeat the search intent of an existing pillar. If the topic overlaps a pillar (income tax, property tax, moving to Texas), take a DIFFERENT angle (e.g. a subtopic, a county-level cut, a comparison, an FAQ deep-dive) and link to the pillar instead of rewriting it.
- Do NOT frame this as breaking news. No "today", "this week", "just announced" language. Evergreen only.
- Each article must own a UNIQUE search intent (one primary question answered). State that intent implicitly in the title.

GOOGLE DISCOVER READINESS:
- Take a fresh angle on the evergreen topic (comparison, contrarian, "what most people miss", county-level, cost breakdown, etc.).
- Use emotional-curiosity phrasing in the title without clickbait.
- Weave Texas-identity language ("Lone Star", "Texans", specific city/county names) into the intro and at least two sections.

KEY TAKEAWAYS: Provide 4-6 concise bullet points summarizing the article.

Return ONLY valid JSON, no markdown:
{"title":"...","dek":"...","keywords":["..."],"intro":["paragraph 1","paragraph 2"],"sections":[{"heading":"Overview","paragraphs":["..."]},{"heading":"Why This Matters","paragraphs":["..."]},{"heading":"Impact on Texans","paragraphs":["..."],"bullets":["..."]},{"heading":"Historical Context","paragraphs":["..."]},{"heading":"How This Affects Texas Elections","paragraphs":["..."]}],"keyTakeaways":["...","..."],"faq":[{"q":"...","a":"..."}],"sources":[{"label":"Texas Comptroller","url":"https://comptroller.texas.gov/"}]}

The "bullets" field is optional per section. Use either paragraphs, bullets, or both. Markdown links inside paragraph strings are allowed and encouraged.`;

  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": lovableApiKey },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Topic: ${topic}\nCategory: ${category}\n\nWrite the full long-form evergreen article now.` },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!r.ok) throw new Error(`AI gateway ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
  return JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as GeneratedBody;
}

export const Route = createFileRoute("/api/public/hooks/generate-evergreen")({
  server: {
    handlers: {
      POST: async () => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const lovableApiKey = process.env.LOVABLE_API_KEY;
        if (!supabaseUrl || !serviceKey || !lovableApiKey) {
          return Response.json({ error: "Missing env" }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        // Avoid repeating recent topics — pull recent evergreen titles and skip overlap.
        const { data: recent } = await supabase
          .from("daily_articles")
          .select("title")
          .eq("kind", "evergreen")
          .order("published_at", { ascending: false })
          .limit(20);
        const recentTitles = new Set((recent ?? []).map((r) => (r.title ?? "").toLowerCase()));
        const available = TOPICS.filter((t) => !Array.from(recentTitles).some((rt) => rt.includes(t.topic.slice(0, 25).toLowerCase())));
        const pick = (available.length > 0 ? available : TOPICS)[Math.floor(Math.random() * (available.length > 0 ? available.length : TOPICS.length))];

        let gen: GeneratedBody;
        try {
          gen = await generate(pick.topic, pick.category, lovableApiKey);
        } catch (err) {
          console.error("evergreen AI failed", err);
          return Response.json({ error: "AI failed", details: String(err) }, { status: 500 });
        }
        if (!gen?.title || !gen?.dek || !Array.isArray(gen.sections) || gen.sections.length < 3) {
          return Response.json({ error: "Bad AI output", gen }, { status: 500 });
        }

        const now = new Date();
        const { dedupeArticleBody, hasDuplicateContent } = await import("@/lib/article-dedupe");
        const slug = `${now.toISOString().slice(0, 10)}-${slugify(gen.title)}`;
        const cleanBody = dedupeArticleBody({
          updated: now.toISOString().slice(0, 10),
          intro: gen.intro ?? [gen.dek],
          sections: gen.sections,
          faq: gen.faq ?? [],
          sources: gen.sources ?? [],
          keyTakeaways: (gen.keyTakeaways ?? []).slice(0, 6),
        });
        // Block publish if dedupe still detects repetition (it shouldn't, but
        // hasDuplicateContent re-runs to enforce the quality gate).
        if (hasDuplicateContent(cleanBody)) {
          return Response.json({ error: "Duplicate content detected; not published", slug }, { status: 422 });
        }

        // Quality filter: pre-publish gate.
        // 1) Unique title angle — reject if an existing evergreen already has a
        //    near-identical title (first 40 chars, case-insensitive).
        const titleKey = gen.title.toLowerCase().slice(0, 40);
        const { data: titleDupes } = await supabase
          .from("daily_articles")
          .select("slug,title")
          .eq("kind", "evergreen")
          .ilike("title", `${titleKey}%`)
          .limit(1);
        if (titleDupes && titleDupes.length > 0) {
          return Response.json({ error: "Duplicate title angle; not published", slug, existing: titleDupes[0].slug }, { status: 422 });
        }

        // 2) Texas context must be present in title or dek.
        const hasTexasContext = /texas|houston|dallas|austin|san antonio|fort worth|lone star/i.test(
          `${gen.title} ${gen.dek}`
        );
        if (!hasTexasContext) {
          return Response.json({ error: "Missing Texas context in title/dek", slug }, { status: 422 });
        }

        // 3) No breaking-news framing in evergreen.
        if (/\b(breaking|just announced|today|this week|developing)\b/i.test(`${gen.title} ${gen.dek}`)) {
          return Response.json({ error: "Breaking-news framing not allowed in evergreen", slug }, { status: 422 });
        }

        const row = {
          slug,
          internal_url: `/news/${slug}`,
          is_ingested: true,
          kind: "evergreen",
          category: pick.category,
          title: gen.title.slice(0, 200),
          dek: gen.dek.slice(0, 400),
          author: "Keep Texas Red Editorial Staff",
          source_name: null as string | null,
          source_url: null as string | null,
          published_at: now.toISOString(),
          keywords: (gen.keywords ?? []).slice(0, 20),
          body_json: cleanBody,
        };
        enrichArticleRow(row);

        const { error } = await supabase.from("daily_articles").upsert(row, { onConflict: "slug" });
        if (error) {
          console.error("evergreen insert failed", error);
          return Response.json({ error: error.message }, { status: 500 });
        }
        return Response.json({ ok: true, slug });
      },
    },
  },
});