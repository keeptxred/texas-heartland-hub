import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { TEAMS, TEAM_BY_SLUG, teamsForLeague, detectTeams, type TeamMeta } from "@/lib/texas-teams";
import { enrichArticleRow } from "@/lib/content-quality";

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

// Per-team weekly topic packs. Cron requests `?team=<slug>` and the handler
// picks a topic from that team's pool, generates the article, and tags the
// row with `teams: [<slug>]`. Cross-posting happens automatically at
// read-time: an article whose title/dek also mentions another team appears
// on that team's page too (see listSportsByTeam).
const TEAM_TOPIC_POOL: Record<string, string[]> = {
  texans: [
    "Houston Texans weekly outlook: what fans should watch for",
    "Houston Texans offense: scheme, playmakers, and identity",
    "Houston Texans defense: front seven, secondary, and coaching",
    "Houston Texans quarterback situation and Texas fan expectations",
    "NRG Stadium home-field advantage and the Houston Texans",
    "Houston Texans draft tradition: building through the AFC South",
    "Special teams and situational football for the Houston Texans",
  ],
  cowboys: [
    "Dallas Cowboys weekly outlook: what fans should watch for",
    "Dallas Cowboys offense: scheme, playmakers, and identity",
    "Dallas Cowboys defense: front seven, secondary, and coaching",
    "Dallas Cowboys quarterback storyline and America's Team expectations",
    "AT&T Stadium and how home-field shapes the Dallas Cowboys",
    "Dallas Cowboys draft history: building the NFC East contender",
    "The Dallas Cowboys coaching staff and its philosophy for Texas fans",
  ],
  astros: [
    "Houston Astros weekly outlook: rotation, lineup, and bullpen",
    "Houston Astros starting rotation: identity and Texas fan expectations",
    "Houston Astros lineup construction and the AL West race",
    "Minute Maid Park and how it shapes Houston Astros baseball",
    "Houston Astros farm system: prospects Texas fans should know",
  ],
  rangers: [
    "Texas Rangers weekly outlook: rotation, lineup, and bullpen",
    "Texas Rangers starting rotation and postseason outlook",
    "Texas Rangers lineup and the fight for the AL West",
    "Globe Life Field and how it shapes Texas Rangers baseball",
    "Texas Rangers farm system: prospects to watch this season",
  ],
  spurs: [
    "San Antonio Spurs weekly outlook: what fans should watch for",
    "San Antonio Spurs young core: development and expectations",
    "Frost Bank Center and the Spurs home-court identity",
    "Southwest Division outlook from a Spurs perspective",
  ],
  rockets: [
    "Houston Rockets weekly outlook: what fans should watch for",
    "Houston Rockets rebuild: how Houston is building its next contender",
    "Toyota Center and Houston Rockets home-court identity",
    "Southwest Division outlook from a Rockets perspective",
  ],
  mavericks: [
    "Dallas Mavericks weekly outlook: what fans should watch for",
    "Dallas Mavericks roster identity: stars, role players, and hoops culture",
    "American Airlines Center and Mavs home-court identity",
    "Southwest Division outlook from a Mavericks perspective",
  ],
  longhorns: [
    "Texas Longhorns weekly football outlook",
    "Texas Longhorns offense and Big 12/SEC outlook",
    "Darrell K Royal Stadium and Longhorns home-field culture",
  ],
  aggies: [
    "Texas A&M Aggies weekly football outlook",
    "Texas A&M Aggies offense and SEC outlook",
    "Kyle Field, the 12th Man, and Aggies home-field culture",
  ],
  "horned-frogs": [
    "TCU Horned Frogs weekly football outlook",
    "TCU Horned Frogs offense and Big 12 outlook",
    "Amon G. Carter Stadium and TCU home-field culture",
  ],
  bears: [
    "Baylor Bears weekly football outlook",
    "Baylor Bears offense and Big 12 outlook",
    "McLane Stadium and Baylor Bears home-field culture",
  ],
  "red-raiders": [
    "Texas Tech Red Raiders weekly football outlook",
    "Texas Tech Red Raiders offense and Big 12 outlook",
    "Jones AT&T Stadium and Red Raiders home-field culture",
  ],
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

async function generate(topic: string, subject: string, lovableApiKey: string): Promise<GeneratedBody> {
  const system = `You are a Texas sports writer for Keep TX Red. Write a weekly evergreen-style overview about ${subject} in a clear, fan-friendly tone. Stay factual and timeless — describe ongoing storylines, team identity, recent seasons, and what fans should watch for. Do NOT invent specific scores, dates, injuries, trades, or quotes. Reference only publicly known team facts and rosters.

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
        { role: "user", content: `Subject: ${subject}\nTopic: ${topic}\n\nWrite the full article now.` },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!r.ok) throw new Error(`AI gateway ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
  return JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as GeneratedBody;
}

const LEAGUE_IMAGE_FALLBACK: Record<string, string[]> = {
  nfl: LEAGUE_IMAGES.nfl,
  mlb: LEAGUE_IMAGES.mlb,
  nba: LEAGUE_IMAGES.nba,
  cfb: LEAGUE_IMAGES.nfl, // reuse until dedicated CFB imagery is added
};

// Deliberately loose type: we pass the app's service-role client through and
// don't want strict per-call Database generics interfering here.
type AnySupabase = ReturnType<typeof createClient<any, any, any>>;

async function generateForTeam(
  team: TeamMeta,
  supabase: AnySupabase,
  lovableApiKey: string,
): Promise<{ slug?: string; error?: string }> {
  const pool = TEAM_TOPIC_POOL[team.slug] ?? [`Weekly outlook for the ${team.name}`];
  const { data: recent } = await supabase
    .from("daily_articles")
    .select("title,image_url")
    .contains("teams", [team.slug])
    .order("published_at", { ascending: false })
    .limit(6);
  const recentRows = (recent ?? []) as Array<{ title: string | null; image_url: string | null }>;
  const recentTitles = new Set(recentRows.map((r) => (r.title ?? "").toLowerCase()));
  const available = pool.filter(
    (t) => !Array.from(recentTitles).some((rt) => rt.includes(t.slice(0, 25).toLowerCase())),
  );
  const topicPool = available.length > 0 ? available : pool;
  const topic = topicPool[Math.floor(Math.random() * topicPool.length)];

  const recentImages = new Set(recentRows.slice(0, 3).map((r) => r.image_url ?? ""));
  const imagePool = LEAGUE_IMAGE_FALLBACK[team.league] ?? LEAGUE_IMAGES.nfl;
  const freshImages = imagePool.filter((u) => !recentImages.has(u));
  const imageChoices = freshImages.length > 0 ? freshImages : imagePool;
  const image_url = imageChoices[Math.floor(Math.random() * imageChoices.length)];

  const gen = await generate(topic, team.name, lovableApiKey);
  if (!gen?.title || !gen?.dek || !Array.isArray(gen.sections) || gen.sections.length < 3) {
    return { error: "Bad AI output" };
  }

  // Cross-posting: an article about the Texans that also mentions the
  // Cowboys is tagged with both, so it shows up on both team pages.
  const detected = detectTeams(`${gen.title} ${gen.dek} ${(gen.intro ?? []).join(" ")}`);
  const teams = Array.from(new Set<string>([team.slug, ...detected]));

  const now = new Date();
  const { dedupeArticleBody } = await import("@/lib/article-dedupe");
  const kind = team.league === "cfb" ? "sports-cfb" : `sports-${team.league}`;
  const categoryLabel = team.league === "cfb" ? "College Football" : team.league.toUpperCase();
  const slug = `${now.toISOString().slice(0, 10)}-${team.slug}-${slugify(gen.title)}`;
  const cleanBody = dedupeArticleBody({
    updated: now.toISOString().slice(0, 10),
    intro: gen.intro ?? [gen.dek],
    sections: gen.sections,
    faq: gen.faq ?? [],
    sources: gen.sources ?? [],
  });
  const row = {
    slug,
    internal_url: `/news/${slug}`,
    is_ingested: true,
    kind,
    category: categoryLabel,
    title: gen.title.slice(0, 200),
    dek: gen.dek.slice(0, 400),
    author: "Keep TX Red Sports Desk",
    source_name: null as string | null,
    source_url: null as string | null,
    image_url,
    published_at: now.toISOString(),
    keywords: (gen.keywords ?? []).slice(0, 20),
    body_json: cleanBody,
    teams,
  };
  enrichArticleRow(row);
  const { error } = await supabase.from("daily_articles").upsert(row, { onConflict: "slug" });
  if (error) return { error: error.message };
  return { slug };
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
        let teamParam: string | undefined;
        let countParam: number | undefined;
        try {
          const body = (await request.json()) as { league?: string; team?: string; count?: number } | null;
          leagueParam = body?.league;
          teamParam = body?.team;
          countParam = typeof body?.count === "number" ? Math.max(1, Math.min(5, body.count)) : undefined;
        } catch {
          // empty body is fine — we'll fall through to auto-scheduling below
        }

        const supabase = createClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        // Resolve the set of teams to generate for.
        // - `team: "cowboys"` → single team
        // - `league: "nfl"` → every Texas team in that league
        // - no body → in-season teams (currently NFL, per weekly cadence)
        let teamTargets: TeamMeta[];
        if (teamParam && TEAM_BY_SLUG[teamParam]) {
          teamTargets = [TEAM_BY_SLUG[teamParam]];
        } else if (leagueParam) {
          const lg = leagueParam as "nfl" | "mlb" | "nba" | "cfb";
          teamTargets = teamsForLeague(lg);
        } else {
          // Default cron behavior: cover the currently in-season pro leagues.
          const inSeason = currentInSeasonLeagues();
          teamTargets = TEAMS.filter((t) => inSeason.includes(t.league));
        }

        const perTeam = countParam ?? 1;
        const results: { team: string; slug?: string; error?: string }[] = [];
        for (const team of teamTargets) {
          for (let i = 0; i < perTeam; i++) {
            try {
              const r = await generateForTeam(team, supabase, lovableApiKey);
              results.push({ team: team.slug, ...r });
            } catch (err) {
              results.push({ team: team.slug, error: String(err) });
            }
          }
        }

        return Response.json({ ok: true, results });
      },
    },
  },
});

// Approximate US sports seasons. Used by the default (no-body) cron path so
// we only generate for leagues that are actually playing.
function currentInSeasonLeagues(): ("nfl" | "mlb" | "nba" | "cfb")[] {
  const month = new Date().getUTCMonth() + 1; // 1-12
  const out: ("nfl" | "mlb" | "nba" | "cfb")[] = [];
  if (month >= 9 || month <= 2) out.push("nfl");
  if (month >= 8 || month <= 1) out.push("cfb");
  if (month >= 4 && month <= 10) out.push("mlb");
  if (month >= 10 || month <= 6) out.push("nba");
  return out;
}