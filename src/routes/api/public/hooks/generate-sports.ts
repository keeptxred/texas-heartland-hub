import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const LEAGUES = ["nfl", "mlb", "nba"] as const;
type League = (typeof LEAGUES)[number];

const LEAGUE_PROMPT: Record<League, { category: string; teams: string; topics: string[] }> = {
  nfl: {
    category: "NFL",
    teams: "Houston Texans and Dallas Cowboys",
    topics: [
      "Weekly outlook for the Houston Texans",
      "Weekly outlook for the Dallas Cowboys",
      "What the latest Texans-Cowboys storyline means for Texas football fans",
      "Texas high school to NFL pipeline: players to watch",
    ],
  },
  mlb: {
    category: "MLB",
    teams: "Houston Astros and Texas Rangers",
    topics: [
      "Weekly outlook for the Houston Astros",
      "Weekly outlook for the Texas Rangers",
      "The Lone Star Series: how the Astros-Rangers rivalry shapes the Texas baseball season",
      "Texas MLB pitching, hitting and roster moves to watch this week",
    ],
  },
  nba: {
    category: "NBA",
    teams: "San Antonio Spurs, Houston Rockets, and Dallas Mavericks",
    topics: [
      "Weekly outlook for the San Antonio Spurs",
      "Weekly outlook for the Houston Rockets",
      "Weekly outlook for the Dallas Mavericks",
      "The state of basketball in Texas: Spurs, Rockets, and Mavericks compared",
    ],
  },
};

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

async function generate(topic: string, league: League, lovableApiKey: string): Promise<GeneratedBody> {
  const meta = LEAGUE_PROMPT[league];
  const system = `You are a Texas sports writer for Keep TX Red. Write a weekly evergreen-style overview about ${meta.teams} in a clear, fan-friendly tone. Stay factual and timeless — describe ongoing storylines, team identity, recent seasons, and what fans should watch for. Do NOT invent specific scores, dates, injuries, trades, or quotes. Reference only publicly known team facts and rosters.

REQUIREMENTS:
- Title: keyword-rich, under 75 characters, must include a Texas team or city name.
- dek: 140-220 characters, fan-oriented summary.
- Body length: 900-1400 words.
- 4-6 H2 sections.
- 4-6 FAQ entries common Texas sports fans ask.
- 3-5 official source links (team .com pages, ESPN, league .com).
- 8-14 keywords.

Return ONLY valid JSON:
{"title":"...","dek":"...","keywords":["..."],"intro":["..."],"sections":[{"heading":"...","paragraphs":["..."],"bullets":["..."]}],"faq":[{"q":"...","a":"..."}],"sources":[{"label":"...","url":"https://..."}]}`;

  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": lovableApiKey },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        { role: "user", content: `League: ${meta.category}\nTeams: ${meta.teams}\nTopic: ${topic}\n\nWrite the full article now.` },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!r.ok) throw new Error(`AI gateway ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
  return JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as GeneratedBody;
}

export const Route = createFileRoute("/api/public/hooks/generate-sports")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const lovableApiKey = process.env.LOVABLE_API_KEY;
        if (!supabaseUrl || !serviceKey || !lovableApiKey) {
          return Response.json({ error: "Missing env" }, { status: 500 });
        }

        let leagueParam: string | undefined;
        try {
          const body = (await request.json()) as { league?: string } | null;
          leagueParam = body?.league;
        } catch {
          // empty body is fine — we'll generate for all leagues
        }

        const targets: League[] = leagueParam && (LEAGUES as readonly string[]).includes(leagueParam)
          ? [leagueParam as League]
          : [...LEAGUES];

        const supabase = createClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const results: { league: League; slug?: string; error?: string }[] = [];

        for (const league of targets) {
          try {
            const meta = LEAGUE_PROMPT[league];
            const { data: recent } = await supabase
              .from("daily_articles")
              .select("title")
              .eq("kind", `sports-${league}`)
              .order("published_at", { ascending: false })
              .limit(10);
            const recentTitles = new Set((recent ?? []).map((r) => (r.title ?? "").toLowerCase()));
            const available = meta.topics.filter(
              (t) => !Array.from(recentTitles).some((rt) => rt.includes(t.slice(0, 25).toLowerCase())),
            );
            const pool = available.length > 0 ? available : meta.topics;
            const topic = pool[Math.floor(Math.random() * pool.length)];

            const gen = await generate(topic, league, lovableApiKey);
            if (!gen?.title || !gen?.dek || !Array.isArray(gen.sections) || gen.sections.length < 3) {
              results.push({ league, error: "Bad AI output" });
              continue;
            }

            const now = new Date();
            const slug = `${now.toISOString().slice(0, 10)}-${league}-${slugify(gen.title)}`;
            const row = {
              slug,
              kind: `sports-${league}`,
              category: meta.category,
              title: gen.title.slice(0, 200),
              dek: gen.dek.slice(0, 400),
              author: "Keep TX Red Sports Desk",
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
              results.push({ league, error: error.message });
            } else {
              results.push({ league, slug });
            }
          } catch (err) {
            results.push({ league, error: String(err) });
          }
        }

        return Response.json({ ok: true, results });
      },
    },
  },
});