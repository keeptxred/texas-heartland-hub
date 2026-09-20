import { createFileRoute } from "@tanstack/react-router";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";

const OIDC_AUDIENCE = "keeptxred-facebook";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/texasdefined-facebook-comment-signals.yml";
const SOCIAL_PLATFORM = "facebook_texasdefined";
const GRAPH_VERSION = "v21.0";
const LOOKBACK_DAYS = 14;
const MIN_SIGNAL_COMMENTS = 3;

type SocialConnectionRow = {
  account_id: string | null;
  access_token: string | null;
  connection_status: string | null;
};

type FacebookComment = {
  message?: string;
  created_time?: string;
};

type FacebookPost = {
  id?: string;
  message?: string;
  created_time?: string;
  permalink_url?: string;
  comments?: { data?: FacebookComment[] };
};

type ThemeDefinition = {
  id: string;
  label: string;
  patterns: readonly RegExp[];
  contentIdea: string;
};

type ThemeSignal = {
  id: string;
  label: string;
  commentCount: number;
  postCount: number;
  score: number;
  contentIdea: string;
  sourcePostUrls: string[];
};

const THEMES: readonly ThemeDefinition[] = [
  {
    id: "lakes-rivers-swimming",
    label: "Lakes, rivers and swimming holes",
    patterns: [/\b(lake|river|swim|swimming|swimming hole|spring|springs|waterfall|reservoir)\b/i],
    contentIdea: "Build or expand practical Texas lake, river and swimming-hole guides around the places readers repeatedly recommend.",
  },
  {
    id: "state-parks-outdoors",
    label: "State parks, hiking and camping",
    patterns: [/\b(state park|park|hike|hiking|trail|camp|camping|campsite|outdoors)\b/i],
    contentIdea: "Prioritize state-park and outdoor guides that answer the recurring recommendations and trip-planning questions in comments.",
  },
  {
    id: "small-towns",
    label: "Small towns and downtowns",
    patterns: [/\b(small town|town square|downtown|main street|courthouse square|historic district)\b/i],
    contentIdea: "Turn repeated small-town recommendations into destination profiles, weekend itineraries and downtown guides.",
  },
  {
    id: "texas-food",
    label: "Texas food and BBQ",
    patterns: [/\b(bbq|barbecue|brisket|taco|tacos|kolache|kolaches|restaurant|diner|steak|tex-mex|food)\b/i],
    contentIdea: "Use repeated restaurant, BBQ and Texas-food recommendations to identify food guides worth researching editorially.",
  },
  {
    id: "road-trips",
    label: "Road trips and scenic drives",
    patterns: [/\b(road trip|drive|scenic|highway|route|back road|day trip|weekend trip)\b/i],
    contentIdea: "Create or expand Texas road-trip routes around drives and stops readers repeatedly recommend.",
  },
  {
    id: "gulf-coast",
    label: "Gulf Coast and beaches",
    patterns: [/\b(gulf|coast|beach|island|surf|bay|shore|port aransas|south padre|galveston)\b/i],
    contentIdea: "Prioritize Gulf Coast destination, beach-condition and trip-planning guides around recurring audience interest.",
  },
  {
    id: "texas-history",
    label: "Texas history and historic places",
    patterns: [/\b(history|historic|museum|mission|battlefield|fort|heritage|alamo|republic of texas)\b/i],
    contentIdea: "Research recurring historic-place mentions for authority pages, explainers and visit-planning guides.",
  },
  {
    id: "wildflowers",
    label: "Wildflowers and seasonal scenery",
    patterns: [/\b(bluebonnet|bluebonnets|wildflower|wildflowers|fall color|foliage|spring bloom|flowers)\b/i],
    contentIdea: "Use seasonal comment demand to prioritize timely wildflower, fall-color and scenic-condition updates.",
  },
  {
    id: "fishing-boating",
    label: "Fishing and boating",
    patterns: [/\b(fish|fishing|bass|crappie|catfish|boat|boating|marina|ramp|kayak|kayaking)\b/i],
    contentIdea: "Expand fishing and boating coverage where readers repeatedly discuss access, conditions and favorite lakes.",
  },
  {
    id: "hometown-local-pride",
    label: "Hometowns and local Texas pride",
    patterns: [/\b(hometown|my town|my county|our town|local|grew up|born and raised|home town)\b/i],
    contentIdea: "Use concentrated hometown and county interest to identify underserved local guides and county-level pages.",
  },
] as const;

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  return value.match(/^Bearer\s+(.+)$/i)?.[1]?.trim() || null;
}

function meaningfulComment(value: string): boolean {
  const text = value.replace(/https?:\/\/\S+/gi, " ").replace(/\s+/g, " ").trim();
  if (text.length < 12) return false;
  const words = text.match(/[A-Za-z0-9']+/g) ?? [];
  if (words.length < 3) return false;
  return !/^(love it|beautiful|awesome|nice|yes|no|agree|absolutely|amen|wow)[!. ]*$/i.test(text);
}

async function fetchCommentedPosts(pageId: string, pageToken: string): Promise<FacebookPost[]> {
  const endpoint = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(pageId)}/published_posts`);
  endpoint.searchParams.set(
    "fields",
    "id,message,created_time,permalink_url,comments.limit(100){message,created_time}",
  );
  endpoint.searchParams.set("limit", "40");

  const response = await fetch(endpoint.toString(), {
    cache: "no-store",
    headers: { Authorization: `Bearer ${pageToken}` },
    signal: AbortSignal.timeout(20_000),
  });
  const text = await response.text();
  let payload: { data?: FacebookPost[]; error?: { message?: string } } = {};
  try {
    payload = JSON.parse(text) as typeof payload;
  } catch {
    throw new Error(`Facebook comment feed returned invalid JSON (HTTP ${response.status})`);
  }
  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message ?? `Facebook comment feed failed (HTTP ${response.status})`);
  }
  return Array.isArray(payload.data) ? payload.data : [];
}

function buildSignals(posts: FacebookPost[], now = Date.now()): ThemeSignal[] {
  const cutoff = now - LOOKBACK_DAYS * 86_400_000;
  const accum = new Map<string, { comments: number; posts: Set<string>; urls: Set<string> }>();

  for (const post of posts) {
    const postCreated = Date.parse(post.created_time ?? "");
    if (!Number.isFinite(postCreated) || postCreated < cutoff) continue;
    const postKey = post.id ?? post.permalink_url ?? String(postCreated);
    for (const comment of post.comments?.data ?? []) {
      const created = Date.parse(comment.created_time ?? "");
      if (Number.isFinite(created) && created < cutoff) continue;
      const message = comment.message?.trim() ?? "";
      if (!meaningfulComment(message)) continue;
      for (const theme of THEMES) {
        if (!theme.patterns.some((pattern) => pattern.test(message))) continue;
        const current = accum.get(theme.id) ?? { comments: 0, posts: new Set<string>(), urls: new Set<string>() };
        current.comments += 1;
        current.posts.add(postKey);
        if (post.permalink_url) current.urls.add(post.permalink_url);
        accum.set(theme.id, current);
      }
    }
  }

  return THEMES.flatMap((theme) => {
    const current = accum.get(theme.id);
    if (!current || current.comments < MIN_SIGNAL_COMMENTS) return [];
    const postCount = current.posts.size;
    return [{
      id: theme.id,
      label: theme.label,
      commentCount: current.comments,
      postCount,
      score: current.comments + postCount * 2,
      contentIdea: theme.contentIdea,
      sourcePostUrls: [...current.urls].slice(0, 3),
    } satisfies ThemeSignal];
  })
    .sort((a, b) => b.score - a.score || b.commentCount - a.commentCount)
    .slice(0, 8);
}

async function run(request: Request) {
  const token = bearerToken(request);
  if (!token) return Response.json({ ok: false, error: "Missing GitHub Actions OIDC token" }, { status: 401 });

  try {
    await verifyGitHubActionsOidc({
      token,
      audience: OIDC_AUDIENCE,
      repository: REPOSITORY,
      workflowPath: WORKFLOW_PATH,
    });
  } catch (error) {
    return Response.json({
      ok: false,
      error: "GitHub Actions OIDC verification failed",
      detail: error instanceof Error ? error.message : String(error),
    }, { status: 403 });
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await (supabaseAdmin as any)
    .from("social_connections")
    .select("account_id,access_token,connection_status")
    .eq("platform", SOCIAL_PLATFORM)
    .maybeSingle();
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

  const connection = data as SocialConnectionRow | null;
  if (!connection || connection.connection_status !== "CONNECTED" || !connection.account_id || !connection.access_token) {
    return Response.json({ ok: false, error: "TexasDefined Facebook Page is not connected" }, { status: 503 });
  }

  const smokeOnly = new URL(request.url).searchParams.get("smoke_only") === "true";
  if (smokeOnly) {
    return Response.json({
      ok: true,
      site: "TexasDefined",
      smoke_only: true,
      lookback_days: LOOKBACK_DAYS,
      minimum_signal_comments: MIN_SIGNAL_COMMENTS,
      posts_scanned: 0,
      signals: [],
      privacy: "Read-only smoke verified Worker transport, GitHub OIDC, and the connected TexasDefined Facebook configuration without reading comments or writing planning data.",
      checked_at: new Date().toISOString(),
    });
  }

  try {
    const posts = await fetchCommentedPosts(String(connection.account_id), String(connection.access_token));
    const signals = buildSignals(posts);
    return Response.json({
      ok: true,
      site: "TexasDefined",
      lookback_days: LOOKBACK_DAYS,
      minimum_signal_comments: MIN_SIGNAL_COMMENTS,
      posts_scanned: posts.length,
      signals,
      privacy: "Signals contain aggregate counts and TexasDefined post URLs only; commenter identities and raw comment text are not returned.",
      checked_at: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({
      ok: false,
      error: "Failed to analyze TexasDefined Facebook comments",
      detail: error instanceof Error ? error.message : String(error),
    }, { status: 502 });
  }
}

export const Route = createFileRoute("/api/public/hooks/texasdefined-facebook-comment-signals")({
  server: { handlers: { POST: async ({ request }) => run(request) } },
});
