import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { enrichArticleRow } from "@/lib/content-quality";
import { EVERGREEN_MIN_MAIN_WORDS, articleMainWordCount } from "@/lib/article-length";
import { EDITORIAL_SYSTEM_ADDENDUM, validateArticle } from "@/lib/editorial-pipeline";

const TOPICS: { category: string; topic: string }[] = [
  { category: "Tax & Spending", topic: "How Texas property-tax policy is set and what the Legislature can change" },
  { category: "Tax & Spending", topic: "Why Texas has no state income tax and how state government is funded" },
  { category: "Tax & Spending", topic: "How the Texas budget process works from revenue estimate to appropriations" },
  { category: "Tax & Spending", topic: "How local taxing entities and the Texas Legislature divide property-tax authority" },
  { category: "Energy", topic: "How the Permian Basin shapes Texas energy policy and state revenue" },
  { category: "Energy", topic: "ERCOT explained: governance, reliability rules, and legislative oversight" },
  { category: "Energy", topic: "What the Public Utility Commission of Texas regulates" },
  { category: "Energy", topic: "What the Texas Railroad Commission regulates and why its elections matter" },
  { category: "Energy", topic: "Winter Storm Uri reforms and the continuing Texas grid policy debate" },
  { category: "Border", topic: "Operation Lone Star explained: state authority, spending, and federal limits" },
  { category: "Border", topic: "How Texas border policy moves through courts, agencies, and the Legislature" },
  { category: "Border", topic: "Texas DPS and National Guard roles at the border" },
  { category: "Border", topic: "How federal asylum and immigration enforcement decisions affect Texas government" },
  { category: "Legislature", topic: "How a bill becomes law in the Texas Legislature" },
  { category: "Legislature", topic: "The powers of the Texas lieutenant governor explained" },
  { category: "Legislature", topic: "How Texas legislative committees control the fate of bills" },
  { category: "Legislature", topic: "Texas constitutional amendments: how lawmakers and voters approve them" },
  { category: "Legislature", topic: "How special sessions of the Texas Legislature work" },
  { category: "Elections", topic: "Texas primary elections explained: open primaries, runoffs, and party rules" },
  { category: "Elections", topic: "How early voting and Election Day administration work in Texas" },
  { category: "Elections", topic: "Texas voter ID, mail-ballot, and ballot-security rules explained" },
  { category: "Elections", topic: "How precinct chairs and county party conventions work in Texas" },
  { category: "Elections", topic: "How Texas election audits, recounts, and contests work" },
  { category: "Education", topic: "School choice in Texas: legislation, oversight, and public accountability" },
  { category: "Education", topic: "How Texas funds public schools and how lawmakers set the formula" },
  { category: "Education", topic: "What Texas school boards control and how voters hold them accountable" },
  { category: "Government Accountability", topic: "How Texans can track state agency rules, meetings, and public records" },
  { category: "Government Accountability", topic: "How the Texas Public Information Act works and where disputes arise" },
  { category: "Government Accountability", topic: "How state appointments, confirmations, and oversight work in Texas" },
  { category: "Business Policy", topic: "How Texas regulation, taxes, and legislation affect employers and workers" },
  { category: "Business Policy", topic: "How state economic-development incentives are approved and monitored in Texas" },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
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

async function generate(topic: string, category: string, lovableApiKey: string): Promise<GeneratedBody> {
  const system = `You are the senior editor of Keep TX Red, a Texas political news, elections, legislation, and government-accountability publication.

Write a long-form evergreen explainer about the assigned Texas government or public-policy topic. KeepTXRed does not publish travel, food, culture, relocation, household-planning, real-estate-planning, mortgage, insurance, utility, moving, or cost-of-living guides. Do not drift into those subjects. When a topic touches taxes, education, energy, business, or the border, frame it through legislation, elections, regulation, government spending, official authority, or public accountability.

Stay factual. Never invent statistics, quotes, interviews, filings, or internal analysis. Cite official and primary sources whenever possible, including Texas Legislature Online, Texas Secretary of State, Texas Comptroller, Texas courts, Texas agencies, ERCOT, county election offices, and federal government sources.

SEO AND EDITORIAL REQUIREMENTS:
- Title under 75 characters and specific to Texas government, elections, legislation, or policy.
- Dek between 140 and 220 characters.
- At least ${EVERGREEN_MIN_MAIN_WORDS} words across intro and article sections. FAQ, sources, and takeaways do not count.
- 8 to 14 keywords.
- 3 to 6 official source links.
- 4 to 6 useful FAQ entries.
- No breaking-news language such as “breaking,” “today,” “this week,” or “just announced.”
- No partisan persuasion presented as fact.
- Explain who has legal authority, what process applies, what records voters can verify, and what remains disputed or uncertain.

REQUIRED SECTION ORDER:
1. Overview
2. Why This Matters to Texas Voters
3. Who Has Authority
4. How the Process Works
5. Current Policy Debate
6. Historical Context
7. Accountability and Public Records
8. What Texans Should Watch Next
9. Reader Questions

Add additional substantive sections as needed to meet the minimum length without filler.

INTERNAL LINKS:
Include 3 to 5 natural markdown links using only relevant KeepTXRed-owned destinations:
- /bills
- /texas-legislature
- /committees
- /representatives
- /elections
- /texas-politics
- /texas-economy
- /texas-business
- /laws
- /news
- /glossary
- /keep-texas-red

Never link to /tax-calculator, /texas-financial-tools, /moving-to-texas, /texas-living, /texas-data, /texas-resources, /explore, or any /texas/* lifestyle guide.

Return only valid JSON with this shape:
{"title":"...","dek":"...","keywords":["..."],"intro":["paragraph 1","paragraph 2"],"sections":[{"heading":"Overview","paragraphs":["..."]}],"keyTakeaways":["..."],"faq":[{"q":"...","a":"..."}],"sources":[{"label":"Texas Legislature Online","url":"https://capitol.texas.gov/"}]}

Markdown links inside paragraph strings are allowed.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": lovableApiKey },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system + EDITORIAL_SYSTEM_ADDENDUM },
        { role: "user", content: `Topic: ${topic}\nCategory: ${category}\n\nWrite the complete evergreen explainer.` },
      ],
      response_format: { type: "json_object" },
      max_tokens: 16000,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI gateway ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }

  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as GeneratedBody & {
    brief?: import("@/lib/editorial-pipeline").StoryBrief;
  };

  const validation = validateArticle(
    {
      title: parsed.title,
      dek: parsed.dek,
      summary: parsed.intro?.[0],
      sections: parsed.sections,
      faq: parsed.faq,
      keyTakeaways: parsed.keyTakeaways,
    },
    parsed.brief,
  );

  if (!validation.ok) {
    const fatal = validation.reasons.filter(
      (reason) =>
        !reason.startsWith("brief_no_clear_news_event") &&
        !reason.startsWith("headline_does_not_match_body"),
    );
    if (fatal.length > 0) throw new Error(`Editorial validation failed: ${fatal.join(", ")}`);
  }

  delete (parsed as { brief?: unknown }).brief;
  return parsed;
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

        const { data: recent } = await supabase
          .from("daily_articles")
          .select("title")
          .eq("kind", "evergreen")
          .order("published_at", { ascending: false })
          .limit(20);

        const recentTitles = new Set((recent ?? []).map((row) => (row.title ?? "").toLowerCase()));
        const available = TOPICS.filter(
          (candidate) =>
            !Array.from(recentTitles).some((title) =>
              title.includes(candidate.topic.slice(0, 25).toLowerCase()),
            ),
        );
        const pool = available.length > 0 ? available : TOPICS;
        const pick = pool[Math.floor(Math.random() * pool.length)];

        let generated: GeneratedBody;
        try {
          generated = await generate(pick.topic, pick.category, lovableApiKey);
        } catch (error) {
          console.error("evergreen AI failed", error);
          return Response.json({ error: "AI failed", details: String(error) }, { status: 500 });
        }

        if (!generated?.title || !generated?.dek || !Array.isArray(generated.sections) || generated.sections.length < 3) {
          return Response.json({ error: "Bad AI output", generated }, { status: 500 });
        }

        const now = new Date();
        const { dedupeArticleBody, hasDuplicateContent } = await import("@/lib/article-dedupe");
        const slug = `${now.toISOString().slice(0, 10)}-${slugify(generated.title)}`;
        const cleanBody = dedupeArticleBody({
          updated: now.toISOString().slice(0, 10),
          intro: generated.intro ?? [generated.dek],
          sections: generated.sections,
          faq: generated.faq ?? [],
          sources: generated.sources ?? [],
          keyTakeaways: (generated.keyTakeaways ?? []).slice(0, 6),
        });

        if (hasDuplicateContent(cleanBody)) {
          return Response.json({ error: "Duplicate content detected; not published", slug }, { status: 422 });
        }

        const mainWordCount = articleMainWordCount(cleanBody);
        if (mainWordCount < EVERGREEN_MIN_MAIN_WORDS) {
          return Response.json(
            { error: "Evergreen article below main-body minimum; not published", slug, mainWordCount },
            { status: 422 },
          );
        }

        const titleKey = generated.title.toLowerCase().slice(0, 40);
        const { data: titleDupes } = await supabase
          .from("daily_articles")
          .select("slug,title")
          .eq("kind", "evergreen")
          .ilike("title", `${titleKey}%`)
          .limit(1);
        if (titleDupes && titleDupes.length > 0) {
          return Response.json(
            { error: "Duplicate title angle; not published", slug, existing: titleDupes[0].slug },
            { status: 422 },
          );
        }

        const combinedText = `${generated.title} ${generated.dek} ${JSON.stringify(cleanBody)}`;
        if (!/texas|houston|dallas|austin|san antonio|fort worth|lone star/i.test(combinedText)) {
          return Response.json({ error: "Missing Texas context", slug }, { status: 422 });
        }
        if (/\b(breaking|just announced|today|this week|developing)\b/i.test(`${generated.title} ${generated.dek}`)) {
          return Response.json({ error: "Breaking-news framing not allowed in evergreen", slug }, { status: 422 });
        }
        if (/\b(travel|vacation|restaurant|barbecue|tex-mex|moving guide|cost of living|mortgage calculator|home affordability|utility calculator|insurance calculator)\b/i.test(combinedText)) {
          return Response.json({ error: "TexasDefined-owned lifestyle subject detected", slug }, { status: 422 });
        }

        const row = {
          slug,
          internal_url: `/news/${slug}`,
          is_ingested: true,
          kind: "evergreen",
          category: pick.category,
          title: generated.title.slice(0, 200),
          dek: generated.dek.slice(0, 400),
          author: "Keep TX Red Editorial Staff",
          source_name: null as string | null,
          source_url: null as string | null,
          published_at: now.toISOString(),
          keywords: (generated.keywords ?? []).slice(0, 20),
          body_json: cleanBody,
        };

        enrichArticleRow(row);

        const { error } = await supabase.from("daily_articles").upsert(row, { onConflict: "slug" });
        if (error) {
          console.error("evergreen insert failed", error);
          return Response.json({ error: error.message }, { status: 500 });
        }

        return Response.json({ ok: true, slug, category: pick.category });
      },
    },
  },
});
