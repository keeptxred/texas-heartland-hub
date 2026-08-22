import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import {
  TEAMS,
  TEAM_BY_SLUG,
  teamsForLeague,
  detectTeams,
  type LeagueSlug,
  type TeamMeta,
} from "@/lib/texas-teams";
import { enrichArticleRow } from "@/lib/content-quality";
import { generateFeaturedImageForSlugDirect } from "@/lib/featured-image.functions";
import { articleMainWordCount, requiredMainWordCountForKind } from "@/lib/article-length";

const INTERNAL_CHAT = "https://ai.internal.keeptxred.local/v1/chat/completions";

// Per-team weekly topic packs. The handler can generate one team, one league,
// or every Texas team currently in season. Publishing safeguards and minimum
// article-length gates are applied before any row is written.
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
    "Texas Longhorns offense and SEC outlook",
    "Darrell K Royal Stadium and Longhorns home-field culture",
  ],
  "texas-am": [
    "Texas A&M Aggies weekly football outlook",
    "Texas A&M Aggies offense and SEC outlook",
    "Kyle Field, the 12th Man, and Aggies home-field culture",
  ],
  tcu: [
    "TCU Horned Frogs weekly football outlook",
    "TCU Horned Frogs offense and Big 12 outlook",
    "Amon G. Carter Stadium and TCU home-field culture",
  ],
  baylor: [
    "Baylor Bears weekly football outlook",
    "Baylor Bears offense and Big 12 outlook",
    "McLane Stadium and Baylor Bears home-field culture",
  ],
  "texas-tech": [
    "Texas Tech Red Raiders weekly football outlook",
    "Texas Tech Red Raiders offense and Big 12 outlook",
    "Jones AT&T Stadium and Red Raiders home-field culture",
  ],
};

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
};

function articleBodyText(body: {
  intro?: string[];
  sections?: { heading?: string; paragraphs?: string[]; bullets?: string[] }[];
  faq?: { q?: string; a?: string }[];
}): string {
  const parts: string[] = [];
  (body.intro ?? []).forEach((paragraph) => parts.push(paragraph));
  (body.sections ?? []).forEach((section) => {
    if (section.heading) parts.push(section.heading);
    (section.paragraphs ?? []).forEach((paragraph) => parts.push(paragraph));
    (section.bullets ?? []).forEach((bullet) => parts.push(bullet));
  });
  (body.faq ?? []).forEach((entry) => {
    if (entry.q) parts.push(entry.q);
    if (entry.a) parts.push(entry.a);
  });
  return parts.join(" ");
}

async function generate(topic: string, subject: string): Promise<GeneratedBody> {
  const minWords = requiredMainWordCountForKind("sports-nfl");
  const system = `You are a Texas sports writer for Keep TX Red. Write a weekly evergreen-style overview about ${subject} in a clear, fan-friendly tone. Stay factual and timeless — describe ongoing storylines, team identity, recent seasons, and what fans should watch for. Do NOT invent specific scores, dates, injuries, trades, or quotes. Reference only publicly known team facts and rosters.

REQUIREMENTS:
- Title: keyword-rich, under 75 characters, must include a Texas team or city name.
- dek: 140-220 characters, fan-oriented summary.
- Body length: minimum ${minWords} words of main story prose across intro + sections only. Do NOT count FAQ, sources, key takeaways, title, or dek toward the minimum. There is no upper word limit. Expand with team context, roster identity, coaching philosophy, season stakes, fan impact, schedule context, venue context, and practical reader questions until the main story prose meets the minimum.
- 6-9 H2 sections with 2-4 substantial paragraphs each.
- 5-8 FAQ entries common Texas sports fans ask, with substantive answers.
- 3-5 official source links (team .com pages, ESPN, league .com).
- 8-14 keywords.

Return ONLY valid JSON:
{"title":"...","dek":"...","keywords":["..."],"intro":["..."],"sections":[{"heading":"...","paragraphs":["..."],"bullets":["..."]}],"faq":[{"q":"...","a":"..."}],"sources":[{"label":"...","url":"https://..."}]}`;

  const response = await fetch(INTERNAL_CHAT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "cloudflare/default-text",
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Subject: ${subject}\nTopic: ${topic}\n\nWrite the full article now.` },
      ],
      response_format: { type: "json_object" },
      max_tokens: 9000,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI provider ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  return JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as GeneratedBody;
}

// Deliberately loose type: the service-role client is server-only and the
// generated Database types can lag migrations used by publication workflows.
type AnySupabase = ReturnType<typeof createClient<any, any, any>>;

async function generateForTeam(
  team: TeamMeta,
  supabase: AnySupabase,
): Promise<{ slug?: string; error?: string }> {
  const pool = TEAM_TOPIC_POOL[team.slug] ?? [`Weekly outlook for the ${team.name}`];
  const { data: recent } = await supabase
    .from("daily_articles")
    .select("title,image_url")
    .contains("teams", [team.slug])
    .order("published_at", { ascending: false })
    .limit(6);

  const recentRows = (recent ?? []) as Array<{ title: string | null; image_url: string | null }>;
  const recentTitles = new Set(recentRows.map((row) => (row.title ?? "").toLowerCase()));
  const available = pool.filter(
    (topic) => !Array.from(recentTitles).some((title) => title.includes(topic.slice(0, 25).toLowerCase())),
  );
  const topicPool = available.length > 0 ? available : pool;
  const topic = topicPool[Math.floor(Math.random() * topicPool.length)];

  const generated = await generate(topic, team.name);
  if (!generated?.title || !generated?.dek || !Array.isArray(generated.sections) || generated.sections.length < 3) {
    return { error: "Bad AI output" };
  }

  const detected = detectTeams(`${generated.title} ${generated.dek} ${(generated.intro ?? []).join(" ")}`);
  const teams = Array.from(new Set<string>([team.slug, ...detected]));
  const now = new Date();
  const { dedupeArticleBody } = await import("@/lib/article-dedupe");
  const kind = team.league === "cfb" ? "sports-cfb" : `sports-${team.league}`;
  const categoryLabel = team.league === "cfb" ? "College Football" : team.league.toUpperCase();
  const slug = `${now.toISOString().slice(0, 10)}-${team.slug}-${slugify(generated.title)}`;
  const cleanBody = dedupeArticleBody({
    updated: now.toISOString().slice(0, 10),
    intro: generated.intro ?? [generated.dek],
    sections: generated.sections,
    faq: generated.faq ?? [],
    sources: generated.sources ?? [],
  });

  const minMainWords = requiredMainWordCountForKind(kind);
  const mainWordCount = articleMainWordCount(cleanBody);
  if (mainWordCount < minMainWords) {
    return { error: `Article below ${minMainWords}-word main-body minimum (${mainWordCount})` };
  }

  const row = {
    slug,
    internal_url: `/news/${slug}`,
    is_ingested: true,
    kind,
    category: categoryLabel,
    title: generated.title.slice(0, 200),
    dek: generated.dek.slice(0, 400),
    author: "Keep TX Red Sports Desk",
    source_name: null as string | null,
    source_url: null as string | null,
    image_url: null as string | null,
    published_at: now.toISOString(),
    keywords: (generated.keywords ?? []).slice(0, 20),
    body_json: cleanBody,
    body: articleBodyText(cleanBody),
    teams,
  };

  enrichArticleRow(row);
  const { error } = await supabase.from("daily_articles").upsert(row, { onConflict: "slug" });
  if (error) return { error: error.message };
  await generateFeaturedImageForSlugDirect(slug, true);
  return { slug };
}

function isLeagueSlug(value: string): value is LeagueSlug {
  return TEAMS.some((team) => team.league === value);
}

export const Route = createFileRoute("/api/public/hooks/generate-sports")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const aiReady = Boolean(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN);
        if (!supabaseUrl || !serviceKey || !aiReady) {
          return Response.json({ error: "Required server environment is not configured" }, { status: 500 });
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
          // Empty body is valid; default scheduling selects in-season teams.
        }

        const supabase = createClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const normalizedLeague = leagueParam?.toLowerCase();
        let teamTargets: TeamMeta[];
        if (teamParam && TEAM_BY_SLUG[teamParam]) {
          teamTargets = [TEAM_BY_SLUG[teamParam]];
        } else if (normalizedLeague && isLeagueSlug(normalizedLeague)) {
          teamTargets = teamsForLeague(normalizedLeague);
        } else if (leagueParam) {
          return Response.json({ error: `Unknown sports league: ${leagueParam}` }, { status: 400 });
        } else {
          const inSeason = currentInSeasonLeagues();
          teamTargets = TEAMS.filter((team) => inSeason.includes(team.league));
        }

        const perTeam = countParam ?? 1;
        const results: { team: string; slug?: string; error?: string }[] = [];
        for (const team of teamTargets) {
          for (let index = 0; index < perTeam; index += 1) {
            try {
              const result = await generateForTeam(team, supabase);
              results.push({ team: team.slug, ...result });
            } catch (error) {
              results.push({ team: team.slug, error: String(error) });
            }
          }
        }

        return Response.json({ ok: true, results });
      },
    },
  },
});

function currentInSeasonLeagues(): LeagueSlug[] {
  const month = new Date().getUTCMonth() + 1;
  const out: LeagueSlug[] = [];
  if (month >= 8 || month <= 2) out.push("nfl");
  if (month >= 8 || month <= 1) out.push("cfb");
  if (month >= 4 && month <= 10) out.push("mlb");
  if (month >= 10 || month <= 6) out.push("nba");
  if (month >= 10 || month <= 6) out.push("nhl");
  if (month >= 2 && month <= 12) out.push("mls");
  if (month >= 3 && month <= 11) out.push("nwsl");
  if (month >= 5 && month <= 10) out.push("wnba");
  return out;
}
