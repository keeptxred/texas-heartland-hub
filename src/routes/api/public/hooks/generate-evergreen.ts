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
};

async function generate(topic: string, category: string, lovableApiKey: string): Promise<GeneratedBody> {
  const system = `You are the senior editor of Keep TX Red, a Texas conservative news and explainer site. Write a long-form evergreen explainer in a principled, plain-spoken, fact-driven voice (pro-Second Amendment, pro-border-security, pro-energy, pro-property-rights, skeptical of federal overreach). Stay factual. Never invent statistics, names, or quotes. Cite only well-known public sources (Texas Comptroller, Texas Secretary of State, Texas Legislature Online, ERCOT, U.S. Census, official agency sites).

SEO REQUIREMENTS:
- Title: keyword-rich, under 75 characters, must include "Texas" (or a Texas city/region/institution).
- dek: 140-220 characters, naturally include 1-2 Texas keywords, summarize the actual content.
- Total body length: 1200-1800 words.
- 5-7 sections with H2-style headings.
- 4-6 FAQ entries (real questions Texans ask).
- 3-5 official .gov / well-known source links.
- 8-14 keywords.

Return ONLY valid JSON, no markdown:
{"title":"...","dek":"...","keywords":["..."],"intro":["paragraph 1","paragraph 2"],"sections":[{"heading":"...","paragraphs":["..."],"bullets":["..."]}],"faq":[{"q":"...","a":"..."}],"sources":[{"label":"Texas Comptroller","url":"https://comptroller.texas.gov/"}]}

The "bullets" field is optional per section. Use either paragraphs, bullets, or both.`;

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
          kind: "evergreen",
          category: pick.category,
          title: gen.title.slice(0, 200),
          dek: gen.dek.slice(0, 400),
          author: "Keep TX Red Editorial Team",
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