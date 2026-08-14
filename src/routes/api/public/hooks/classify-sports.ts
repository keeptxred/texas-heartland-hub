import { createFileRoute } from "@tanstack/react-router";
import { classifySportsText, sportsKindForText } from "@/lib/sports-taxonomy";
import { LEAGUE_META } from "@/lib/texas-teams";

function categoryFor(kind: string | null, leagues: string[]): string {
  if (kind === "sports-policy") return "Sports Business & Policy";
  if (kind === "sports-motorsports") return "Motorsports";
  if (leagues.length === 1 && leagues[0] in LEAGUE_META) return leagues[0] === "cfb" ? "College Sports" : LEAGUE_META[leagues[0] as keyof typeof LEAGUE_META].name;
  return "Sports";
}

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabaseAdmin
    .from("daily_articles")
    .select("slug,title,dek,body,category,kind,teams,keywords,seo_keywords,published_at")
    .gte("published_at", since)
    .order("published_at", { ascending: false })
    .limit(500);
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

  let classified = 0;
  let teamTagged = 0;
  const changes: Array<{ slug: string; kind: string; teams: string[] }> = [];
  for (const row of data ?? []) {
    const text = [row.title, row.dek, row.body, row.category, row.kind, ...(row.keywords ?? []), ...(row.seo_keywords ?? [])].filter(Boolean).join(" ");
    const classification = classifySportsText(text);
    const alreadySports = /^sports-/i.test(row.kind ?? "") || /sports|nfl|mlb|nba|nhl|mls|wnba|college football|motorsport/i.test(row.category ?? "");
    const strongTexasSports = classification.teams.length > 0 || classification.texasRelevanceScore >= 45 || (classification.topics.includes("motorsports") && /\btexas\b|cota|circuit of the americas|texas motor speedway/i.test(text));
    if (!alreadySports && !strongTexasSports) continue;

    const kind = sportsKindForText(text) ?? (row.kind?.startsWith("sports-") ? row.kind : "sports-general");
    const teams = Array.from(new Set([...(row.teams ?? []), ...classification.teams]));
    const topics = classification.topics.filter((topic) => topic !== "latest" && topic !== "trending");
    const keywords = Array.from(new Set([...(row.keywords ?? []), ...topics])).slice(0, 24);
    const update = {
      kind,
      category: categoryFor(kind, classification.leagues),
      discover_category: "Sports",
      teams,
      keywords,
    };
    const { error: updateError } = await supabaseAdmin.from("daily_articles").update(update).eq("slug", row.slug);
    if (updateError) continue;
    classified++;
    if (teams.length > (row.teams ?? []).length) teamTagged++;
    changes.push({ slug: row.slug, kind, teams });
  }

  return Response.json({ ok: true, scanned: data?.length ?? 0, classified, teamTagged, changes: changes.slice(0, 50) });
}

export const Route = createFileRoute("/api/public/hooks/classify-sports")({ server: { handlers: { GET: handler, POST: handler } } });
