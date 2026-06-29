import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const LEAGUES = ["nfl", "mlb", "nba"] as const;
type League = (typeof LEAGUES)[number];

const LEAGUE_IMAGES: Record<League, string[]> = {
  nfl: [
    "https://www.keeptxred.com/__l5e/assets-v1/cc97f0e5-5817-419b-80ed-27c7f73eddde/nfl-1.jpg",
    "https://www.keeptxred.com/__l5e/assets-v1/8224cbdd-d972-4bd3-a6fe-8a0dfb3d61b7/nfl-2.jpg",
    "https://www.keeptxred.com/__l5e/assets-v1/8440c8e2-93f0-435b-ac9d-a59b1c891fe8/nfl-3.jpg",
  ],
  mlb: [
    "https://www.keeptxred.com/__l5e/assets-v1/0d14382d-24e7-448d-9df6-3bb4acba04d4/mlb-1.jpg",
    "https://www.keeptxred.com/__l5e/assets-v1/99eda2bf-0020-4096-a84d-3b5e585d135a/mlb-2.jpg",
    "https://www.keeptxred.com/__l5e/assets-v1/c0ea7e8f-6aec-4de0-92d6-21373e70556e/mlb-3.jpg",
  ],
  nba: [
    "https://www.keeptxred.com/__l5e/assets-v1/2fb0d24d-c01c-4cca-bfca-16a522cb9eba/nba-1.jpg",
    "https://www.keeptxred.com/__l5e/assets-v1/08d4b935-12c9-43e6-bdf7-c9741d1f0fe0/nba-2.jpg",
    "https://www.keeptxred.com/__l5e/assets-v1/d9dcf452-1451-4ef7-b57a-93b7a5987dd1/nba-3.jpg",
  ],
};

const LEAGUE_PROMPT: Record<League, { category: string; teams: string; topics: string[] }> = {
  nfl: {
    category: "NFL",
    teams: "Houston Texans and Dallas Cowboys",
    topics: [
      "Weekly outlook for the Houston Texans",
      "Weekly outlook for the Dallas Cowboys",
      "What the latest Texans-Cowboys storyline means for Texas football fans",
      "Texas high school to NFL pipeline: players to watch",
      "Houston Texans offense: identity, scheme, and players to watch",
      "Dallas Cowboys defense: identity, scheme, and players to watch",
      "AT&T Stadium and NRG Stadium: how home-field shapes Texas NFL games",
      "Texans vs Cowboys: the in-state rivalry that defines Texas pro football",
      "Texas NFL draft tradition: how the Cowboys and Texans build through the draft",
      "Coaching philosophies of the Texans and Cowboys: what Texas fans should know",
      "Texas-born NFL quarterbacks: a legacy from Friday nights to Sundays",
      "Special teams in Texas: how kicking and return games swing Texans and Cowboys outcomes",
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
      "Astros starting rotation: identity, strengths, and Texas fan expectations",
      "Rangers lineup construction: power, contact, and the Texas approach",
      "Minute Maid Park vs Globe Life Field: how Texas ballparks shape strategy",
      "Texas MLB farm systems: prospects Astros and Rangers fans should know",
      "Bullpen battles in Texas: how relievers decide Astros and Rangers games",
      "Texas-born MLB stars: how the state produces big-league talent",
      "AL West outlook from a Texas perspective: Astros and Rangers in the division",
      "Postseason baseball in Texas: what October means for Astros and Rangers fans",
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
      "San Antonio Spurs young core: development and Texas fan expectations",
      "Houston Rockets rebuild: how Houston is building its next contender",
      "Dallas Mavericks roster identity: stars, role players, and Texas hoops culture",
      "Texas NBA arenas: Frost Bank Center, Toyota Center, and American Airlines Center",
      "Texas Triangle hoops: how Spurs, Rockets, and Mavericks games shape rivalries",
      "Texas NBA draft history: how the three franchises build through the draft",
      "Southwest Division outlook from a Texas perspective",
      "Texas-born NBA stars: a legacy of homegrown talent",
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
              .select("title,image_url")
              .eq("kind", `sports-${league}`)
              .order("published_at", { ascending: false })
              .limit(10);
            const recentTitles = new Set((recent ?? []).map((r) => (r.title ?? "").toLowerCase()));
            const available = meta.topics.filter(
              (t) => !Array.from(recentTitles).some((rt) => rt.includes(t.slice(0, 25).toLowerCase())),
            );
            const pool = available.length > 0 ? available : meta.topics;
            const topic = pool[Math.floor(Math.random() * pool.length)];

            // Pick a league image not used by the most recent articles to avoid duplicates.
            const recentImages = new Set((recent ?? []).slice(0, 3).map((r) => r.image_url ?? ""));
            const imagePool = LEAGUE_IMAGES[league];
            const freshImages = imagePool.filter((u) => !recentImages.has(u));
            const imageChoices = freshImages.length > 0 ? freshImages : imagePool;
            const image_url = imageChoices[Math.floor(Math.random() * imageChoices.length)];

            const gen = await generate(topic, league, lovableApiKey);
            if (!gen?.title || !gen?.dek || !Array.isArray(gen.sections) || gen.sections.length < 3) {
              results.push({ league, error: "Bad AI output" });
              continue;
            }

            const now = new Date();
            const slug = `${now.toISOString().slice(0, 10)}-${league}-${slugify(gen.title)}`;
            const row = {
              slug,
              internal_url: `/news/${slug}`,
              is_ingested: true,
              kind: `sports-${league}`,
              category: meta.category,
              title: gen.title.slice(0, 200),
              dek: gen.dek.slice(0, 400),
              author: "Keep TX Red Sports Desk",
              source_name: null as string | null,
              source_url: null as string | null,
              image_url,
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