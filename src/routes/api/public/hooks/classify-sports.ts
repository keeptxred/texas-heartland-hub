import { createFileRoute } from "@tanstack/react-router";
import { classifySportsText, sportsKindForText, SPORTS_TOPIC_SLUGS } from "@/lib/sports-taxonomy";
import { LEAGUE_META } from "@/lib/texas-teams";

const GENERIC_OR_SPORTS_CATEGORIES = new Set([
  "",
  "non-political",
  "sports",
  "nfl",
  "mlb",
  "nba",
  "nhl",
  "mls",
  "nwsl",
  "wnba",
  "college sports",
  "motorsports",
  "sports business & policy",
]);
const SPORTS_TOPIC_KEYWORDS = new Set<string>(SPORTS_TOPIC_SLUGS);

function categoryFor(kind: string | null, leagues: string[]): string {
  if (kind === "sports-policy") return "Sports Business & Policy";
  if (kind === "sports-motorsports") return "Motorsports";
  if (leagues.length === 1 && leagues[0] in LEAGUE_META) return leagues[0] === "cfb" ? "College Sports" : LEAGUE_META[leagues[0] as keyof typeof LEAGUE_META].name;
  return "Sports";
}

function resolvedCategory(existing: string | null | undefined, kind: string, leagues: string[]): string {
  const normalized = (existing ?? "").trim().toLowerCase();
  if (normalized && !GENERIC_OR_SPORTS_CATEGORIES.has(normalized)) return existing!.trim();
  return categoryFor(kind, leagues);
}

function cleanedKeywords(keywords: string[] | null | undefined): string[] {
  return (keywords ?? []).filter((keyword) => !SPORTS_TOPIC_KEYWORDS.has(keyword.toLowerCase()));
}

function hasSportsMetadata(row: { kind?: string | null; category?: string | null; discover_category?: string | null }): boolean {
  return /^sports-/i.test(row.kind ?? "")
    || /^sports$/i.test(row.discover_category ?? "")
    || /^(sports|nfl|mlb|nba|nhl|mls|nwsl|wnba|college sports|motorsports|sports business & policy)$/i.test((row.category ?? "").trim());
}

function editorialIdentityText(row: {
  title?: string | null;
  dek?: string | null;
  seo_keywords?: string[] | null;
}): string {
  return [row.title, row.dek, ...(row.seo_keywords ?? [])].filter(Boolean).join(" ");
}

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabaseAdmin
    .from("daily_articles")
    .select("slug,title,dek,body,category,kind,discover_category,teams,keywords,seo_keywords,published_at,quality_flags")
    .gte("published_at", since)
    .order("published_at", { ascending: false })
    .limit(500);
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

  let classified = 0;
  let cleaned = 0;
  let teamTagged = 0;
  const changes: Array<{ slug: string; action: "classified" | "cleaned"; kind: string; teams: string[] }> = [];
  for (const row of data ?? []) {
    const flags = Array.isArray(row.quality_flags) ? row.quality_flags : [];
    const normalizedCategory = (row.category ?? "").trim().toLowerCase();
    const lockedNonSports = flags.includes("taxonomy_locked")
      && Boolean(normalizedCategory)
      && !GENERIC_OR_SPORTS_CATEGORIES.has(normalizedCategory);

    if (lockedNonSports) {
      if (!hasSportsMetadata(row)) continue;
      const restoredKind = flags.includes("evergreen_authority")
        ? "evergreen"
        : (/^sports-/i.test(row.kind ?? "") ? "news" : (row.kind ?? "news"));
      const update = {
        kind: restoredKind,
        category: row.category,
        discover_category: null,
        teams: [] as string[],
        keywords: cleanedKeywords(row.keywords),
      };
      const { error: updateError } = await supabaseAdmin.from("daily_articles").update(update).eq("slug", row.slug);
      if (updateError) continue;
      cleaned++;
      changes.push({ slug: row.slug, action: "cleaned", kind: restoredKind, teams: [] });
      continue;
    }

    const text = editorialIdentityText(row);
    const classification = classifySportsText(text);
    const texasNamed = /\btexas\b/i.test(text);
    const strongTexasSports = classification.teams.length > 0
      || (classification.isSports && (texasNamed || classification.cities.length > 0))
      || classification.texasRelevanceScore >= 45
      || (classification.topics.includes("motorsports") && /\bcota\b|circuit of the americas|texas motor speedway/i.test(text));

    if (!strongTexasSports) {
      if (!hasSportsMetadata(row)) continue;
      const currentCategory = (row.category ?? "").trim();
      const categoryWasSportsOnly = /^(sports|nfl|mlb|nba|nhl|mls|nwsl|wnba|college sports|motorsports|sports business & policy)$/i.test(currentCategory);
      const update = {
        kind: /^sports-/i.test(row.kind ?? "") ? "news" : (row.kind ?? "news"),
        category: categoryWasSportsOnly ? "Non-Political" : (row.category ?? "Non-Political"),
        discover_category: null,
        teams: [] as string[],
        keywords: cleanedKeywords(row.keywords),
      };
      const { error: updateError } = await supabaseAdmin.from("daily_articles").update(update).eq("slug", row.slug);
      if (updateError) continue;
      cleaned++;
      changes.push({ slug: row.slug, action: "cleaned", kind: update.kind, teams: [] });
      continue;
    }

    const kind = sportsKindForText(text) ?? "sports-general";
    const teams = classification.teams;
    const topics = classification.topics.filter((topic) => topic !== "latest" && topic !== "trending");
    const keywords = Array.from(new Set([...cleanedKeywords(row.keywords), ...topics])).slice(0, 24);
    const update = {
      kind,
      category: resolvedCategory(row.category, kind, classification.leagues),
      discover_category: "Sports",
      teams,
      keywords,
    };
    const { error: updateError } = await supabaseAdmin.from("daily_articles").update(update).eq("slug", row.slug);
    if (updateError) continue;
    classified++;
    if (teams.some((team) => !(row.teams ?? []).includes(team))) teamTagged++;
    changes.push({ slug: row.slug, action: "classified", kind, teams });
  }

  return Response.json({ ok: true, scanned: data?.length ?? 0, classified, cleaned, teamTagged, changes: changes.slice(0, 75) });
}

export const Route = createFileRoute("/api/public/hooks/classify-sports")({ server: { handlers: { GET: handler, POST: handler } } });
