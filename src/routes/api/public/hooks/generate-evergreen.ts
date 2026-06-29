import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

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

async function generate(topic: string, category: string, lovableApiKey: string): Promise<GeneratedBody> {
  const system = `You are the senior editor of Keep TX Red, a Texas-focused news and civic-education site. Write a long-form evergreen explainer in a neutral, factual, educational tone. Avoid opinionated or partisan language. Stay factual — never invent statistics, names, or quotes. Cite only well-known public sources (Texas Comptroller, Texas Secretary of State, Texas Legislature Online, ERCOT, U.S. Census, official agency sites).

SEO REQUIREMENTS:
- Title: keyword-rich, under 75 characters, must include "Texas" (or a Texas city/region/institution).
- dek: 140-220 characters, naturally include 1-2 Texas keywords, summarize the actual content.
- Total body length: 900-1400 words across intro + sections.
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

INTERNAL LINKS (REQUIRED): Include 3-5 internal links in body paragraphs using markdown syntax [anchor text](/path). Use natural anchor text. Pick from these real internal paths:
- Category pages: /texas-politics, /texas-news, /texas-laws, /elections, /texas-business, /texas-economy, /tax-calculator
- Glossary: /glossary (link the first mention of any specialized term, e.g. [homestead exemption](/glossary))
- Related evergreen guides: /news (newsroom index)
- Pillar: /keep-texas-red
Link at least one glossary term, at least one related category page, and at least one other internal page. Do not force links — weave them in naturally.

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
        const slug = `${now.toISOString().slice(0, 10)}-${slugify(gen.title)}`;
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
          body_json: {
            updated: now.toISOString().slice(0, 10),
            intro: gen.intro ?? [gen.dek],
            sections: gen.sections,
            faq: gen.faq ?? [],
            sources: gen.sources ?? [],
            keyTakeaways: (gen.keyTakeaways ?? []).slice(0, 6),
          },
        };

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