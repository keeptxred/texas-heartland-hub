import { createFileRoute } from "@tanstack/react-router";
import {
  fetchRecentFacebookPagePosts,
  normalizeFacebookHeadline,
  type FacebookPagePost,
} from "@/lib/facebook-page-history";
import { centralClock, formatCentralMinute } from "@/lib/facebook-posting-schedule";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";

const OIDC_AUDIENCE = "keeptxred-facebook";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/auto-facebook-posts.yml";
const SOCIAL_PLATFORM = "facebook_texasdefined";
const GRAPH_VERSION = "v21.0";
const MAX_DAILY_POSTS = 2;
const MIN_GAP_MINUTES = 180;
const ARTICLE_ENDPOINT = "https://keeptxred.com/api/public/hooks/auto-facebook-post-texasdefined";
const SHOP_URL = "https://texasdefined.com/shop";

const TARGET_WINDOWS: ReadonlyArray<readonly [number, number]> = [
  [10 * 60, 12 * 60 + 30],
  [17 * 60 + 30, 20 * 60 + 30],
];

type QueueRow = {
  content_package_id: string;
  published_time: string | null;
};

type SocialConnectionRow = {
  account_id: string | null;
  access_token: string | null;
  connection_status: string | null;
};

type PostKind = "engagement" | "article" | "fact" | "seasonal" | "shop";

type TextPost = {
  kind: Exclude<PostKind, "article">;
  message: string;
  title: string;
};

const ENGAGEMENT_POSTS = [
  "You get a free three-day weekend anywhere in Texas. Where are you going?",
  "What Texas small town deserves way more attention?",
  "Name the best BBQ joint in Texas. You only get ONE answer.",
  "What is something every Texan should do at least once?",
  "What is the prettiest drive in Texas?",
  "Which Texas state park would you recommend to a first-time visitor?",
  "Hill Country, Gulf Coast, Big Bend or Piney Woods — where are you spending the weekend?",
  "What Texas restaurant, store or attraction do you wish would come back?",
  "What temperature officially counts as cold in Texas?",
  "Finish the sentence: You know you're in Texas when ______.",
  "What is the one thing nobody warned you about before moving to Texas?",
  "Without saying the name, describe your Texas hometown and let everyone guess it.",
  "Breakfast tacos or kolaches? Make your case.",
  "Which Texas city has the best food?",
  "Lake, river, pool or Gulf Coast — what is your favorite way to cool off in Texas?",
  "What piece of Texas history should every kid learn?",
  "What is the most Texas wildlife encounter you have ever had?",
  "What Texas county are you checking in from today?",
  "Someone has one day in Texas. Where are you sending them?",
  "What is the best roadside stop in Texas?",
  "What is the best swimming hole in Texas?",
  "Which Texas town has the best downtown square?",
  "What Texas food would you make a visitor try first?",
  "What is your favorite Texas tradition?",
  "What place in Texas surprised you the most the first time you visited?",
] as const;

const FACT_POSTS = [
  "Texas has 254 counties — more than any other state. Which county should every Texan visit at least once?",
  "The bluebonnet is the state flower of Texas. Where is your favorite place to see bluebonnets in spring?",
  "Guadalupe Peak is the highest natural point in Texas. What is your favorite Texas mountain or overlook?",
  "The pecan is the state tree of Texas. What Texas-grown food deserves more attention?",
  "The northern mockingbird is the state bird of Texas. What Texas bird do you notice most where you live?",
  "Texas was an independent republic from 1836 to 1845. Which chapter of Texas history fascinates you most?",
] as const;

function seasonalPosts(month: number): readonly string[] {
  if (month === 12 || month <= 2) {
    return [
      "Texas winter can mean 75 degrees one day and a freeze the next. What is your favorite Texas winter getaway?",
      "When a real cold front hits Texas, what is the first thing you cook?",
      "What Texas place is better to visit in winter than in summer?",
    ];
  }
  if (month >= 3 && month <= 5) {
    return [
      "Spring road-trip season is here. What Texas destination belongs on everyone's spring list?",
      "Bluebonnets, wildflowers and patio weather: what is your favorite part of spring in Texas?",
      "What is the best Texas day trip to take before summer heat arrives?",
    ];
  }
  if (month >= 6 && month <= 8) {
    return [
      "Texas summer is in full force. What is your go-to place to escape the heat?",
      "What is the best Texas river, lake or swimming hole for a summer day?",
      "What is one Texas summer tradition you never skip?",
    ];
  }
  return [
    "Fall is one of the best road-trip seasons in Texas. Where are you headed when the weather finally cools down?",
    "State Fair, football, small-town festivals or camping — what says fall in Texas to you?",
    "Where is the best place in Texas to spend a cool fall weekend?",
  ];
}

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function hash32(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function centralDateKey(value: string): string | null {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return null;
  return centralClock(new Date(timestamp)).dateKey;
}

function texasDefinedTargets(dateKey: string, seed: string): number[] {
  return TARGET_WINDOWS.map(([start, end], index) => {
    const span = Math.max(1, end - start + 1);
    return start + (hash32(`${seed}:texasdefined:${dateKey}:${index}`) % span);
  });
}

function postingDecision(args: {
  now: Date;
  seed: string;
  recentRows: QueueRow[];
}): {
  shouldPost: boolean;
  reason: string;
  dateKey: string;
  postsToday: number;
  nextTargetMinute: number | null;
  targets: number[];
} {
  const clock = centralClock(args.now);
  const targets = texasDefinedTargets(clock.dateKey, args.seed);
  const todayRows = args.recentRows.filter(
    (row) => row.published_time && centralDateKey(row.published_time) === clock.dateKey,
  );
  const postsToday = todayRows.length;
  const elapsedSlots = targets.filter((target) => target <= clock.minutes).length;
  const nextTargetMinute = targets.find((target) => target > clock.minutes) ?? null;

  if (postsToday >= MAX_DAILY_POSTS) {
    return { shouldPost: false, reason: "TexasDefined daily Facebook post cap reached", dateKey: clock.dateKey, postsToday, nextTargetMinute, targets };
  }
  if (elapsedSlots <= postsToday) {
    return { shouldPost: false, reason: "Waiting for the next TexasDefined Facebook window", dateKey: clock.dateKey, postsToday, nextTargetMinute, targets };
  }

  const latest = todayRows
    .map((row) => row.published_time && Date.parse(row.published_time))
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value))
    .sort((a, b) => b - a)[0];
  if (latest) {
    const gapMinutes = (args.now.getTime() - latest) / 60_000;
    if (gapMinutes < MIN_GAP_MINUTES) {
      return { shouldPost: false, reason: `Last TexasDefined Facebook post was less than ${MIN_GAP_MINUTES} minutes ago`, dateKey: clock.dateKey, postsToday, nextTargetMinute, targets };
    }
  }

  return { shouldPost: true, reason: "TexasDefined randomized Facebook window is due", dateKey: clock.dateKey, postsToday, nextTargetMinute, targets };
}

function selectKind(seed: string, dateKey: string, slot: number): PostKind {
  const roll = hash32(`${seed}:texasdefined:content-mix:${dateKey}:${slot}`) % 100;
  if (roll < 40) return "engagement";
  if (roll < 70) return "article";
  if (roll < 85) return "fact";
  if (roll < 95) return "seasonal";
  return "shop";
}

function recentMessageSet(posts: FacebookPagePost[]): Set<string> {
  return new Set(
    posts
      .map((post) => normalizeFacebookHeadline(post.message ?? ""))
      .filter(Boolean),
  );
}

function chooseFromPool(pool: readonly string[], seed: string, key: string, recent: Set<string>): string {
  const start = hash32(`${seed}:${key}`) % pool.length;
  for (let offset = 0; offset < pool.length; offset += 1) {
    const candidate = pool[(start + offset) % pool.length];
    if (!recent.has(normalizeFacebookHeadline(candidate))) return candidate;
  }
  return pool[start];
}

function chooseTextPost(args: {
  kind: Exclude<PostKind, "article">;
  seed: string;
  dateKey: string;
  slot: number;
  recentPosts: FacebookPagePost[];
}): TextPost {
  const recent = recentMessageSet(args.recentPosts);
  const month = Number(args.dateKey.slice(5, 7));

  if (args.kind === "engagement") {
    const message = chooseFromPool(ENGAGEMENT_POSTS, args.seed, `${args.dateKey}:${args.slot}:engagement`, recent);
    return { kind: "engagement", message, title: "Texas conversation" };
  }

  if (args.kind === "fact") {
    const message = chooseFromPool(FACT_POSTS, args.seed, `${args.dateKey}:${args.slot}:fact`, recent);
    return { kind: "fact", message, title: "Texas fact and question" };
  }

  if (args.kind === "seasonal") {
    const message = chooseFromPool(seasonalPosts(month), args.seed, `${args.dateKey}:${args.slot}:seasonal`, recent);
    return { kind: "seasonal", message, title: "Texas seasonal conversation" };
  }

  const shopMessages = [
    `Texas pride looks different for everybody. What kind of Texas gear do you actually like to wear or keep around the house?\n\n${SHOP_URL}`,
    `If you could put one unmistakably Texas design on a shirt, hat or mug, what would it be?\n\n${SHOP_URL}`,
  ] as const;
  const message = chooseFromPool(shopMessages, args.seed, `${args.dateKey}:${args.slot}:shop`, recent);
  return { kind: "shop", message, title: "TexasDefined shop conversation" };
}

async function loadRecentQueue(db: any): Promise<QueueRow[]> {
  const cutoff = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
  const { data, error } = await db
    .from("publishing_queue")
    .select("content_package_id,published_time")
    .eq("platform", SOCIAL_PLATFORM)
    .eq("status", "PUBLISHED")
    .gte("published_time", cutoff)
    .order("published_time", { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  return (data ?? []) as QueueRow[];
}

async function recordTextPost(db: any, post: TextPost, externalId: string | null): Promise<string | null> {
  const { data: inserted, error } = await db
    .from("content_packages")
    .insert({
      source_title: post.title,
      source_url: null,
      category: "TexasDefined",
      facebook_hook: post.message,
      facebook_body: null,
      facebook_cta: null,
      status: "PUBLISHED",
      asset_type: "TEXT",
      asset_url: null,
      workflow_status: "PUBLISHED",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const packageId = inserted.id as string;
  const { error: queueError } = await db.from("publishing_queue").insert({
    content_package_id: packageId,
    platform: SOCIAL_PLATFORM,
    status: "PUBLISHED",
    published_time: new Date().toISOString(),
    notes: externalId ? `Facebook post ${externalId}; kind=${post.kind}` : `TexasDefined Facebook post; kind=${post.kind}`,
  });
  if (queueError) throw new Error(queueError.message);
  return packageId;
}

async function forwardArticlePost(token: string): Promise<Response> {
  const response = await fetch(ARTICLE_ENDPOINT, {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
      "X-KTR-Facebook-Mode": "manual",
    },
  });
  const text = await response.text();
  return new Response(text, {
    status: response.status,
    headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
  });
}

async function runSmartTexasDefinedFacebookPost(request: Request) {
  const token = bearerToken(request);
  if (!token) {
    return Response.json({ ok: false, error: "Missing GitHub Actions OIDC token" }, { status: 401 });
  }

  try {
    await verifyGitHubActionsOidc({
      token,
      audience: OIDC_AUDIENCE,
      repository: REPOSITORY,
      workflowPath: WORKFLOW_PATH,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: "GitHub Actions OIDC verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 403 },
    );
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const adminSeed = process.env.ADMIN_PASSCODE ?? "keeptxred";
  const mode = request.headers.get("x-ktr-facebook-mode")?.trim().toLowerCase() || "scheduled";

  let recentRows: QueueRow[];
  try {
    recentRows = await loadRecentQueue(db);
  } catch (error) {
    return Response.json(
      { ok: false, posted: false, error: "Failed to load TexasDefined Facebook history", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }

  const decision = postingDecision({ now: new Date(), seed: adminSeed, recentRows });
  if (mode !== "manual" && !decision.shouldPost) {
    return Response.json({
      ok: true,
      posted: false,
      scheduled_wait: true,
      reason: decision.reason,
      schedule_date: decision.dateKey,
      posts_today: decision.postsToday,
      next_target_local: formatCentralMinute(decision.nextTargetMinute),
      targets_local: decision.targets.map((target) => formatCentralMinute(target)),
    });
  }

  const kind = selectKind(adminSeed, decision.dateKey, decision.postsToday);
  if (kind === "article") {
    return forwardArticlePost(token);
  }

  const { data: rawConnection, error: connectionError } = await db
    .from("social_connections")
    .select("account_id,access_token,connection_status")
    .eq("platform", SOCIAL_PLATFORM)
    .maybeSingle();
  if (connectionError) {
    return Response.json({ ok: false, posted: false, error: connectionError.message }, { status: 500 });
  }
  const connection = rawConnection as SocialConnectionRow | null;
  if (!connection || connection.connection_status !== "CONNECTED" || !connection.account_id || !connection.access_token) {
    return Response.json(
      { ok: false, posted: false, error: "TexasDefined Facebook Page is not connected", requires_connection: true },
      { status: 503 },
    );
  }

  let livePosts: FacebookPagePost[];
  try {
    livePosts = await fetchRecentFacebookPagePosts({
      pageId: String(connection.account_id),
      pageToken: String(connection.access_token),
      limit: 100,
    });
  } catch (error) {
    return Response.json(
      { ok: false, posted: false, error: "TexasDefined Facebook duplicate verification failed", detail: error instanceof Error ? error.message : String(error) },
      { status: 503 },
    );
  }

  const post = chooseTextPost({
    kind,
    seed: adminSeed,
    dateKey: decision.dateKey,
    slot: decision.postsToday,
    recentPosts: livePosts,
  });

  const graphUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(String(connection.account_id))}/feed`;
  const graphResponse = await fetch(graphUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      message: post.message,
      access_token: String(connection.access_token),
    }),
  });
  const graphJson = (await graphResponse.json().catch(() => ({}))) as {
    id?: string;
    error?: { message?: string };
  };
  if (!graphResponse.ok || !graphJson.id) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: graphJson.error?.message ?? `Facebook Graph API returned HTTP ${graphResponse.status}`,
        requires_connection: graphResponse.status === 401 || graphResponse.status === 403,
      },
      { status: 502 },
    );
  }

  const externalId = graphJson.id ?? null;
  let packageId: string | null = null;
  let recordWarning: string | null = null;
  try {
    packageId = await recordTextPost(db, post, externalId);
  } catch (error) {
    recordWarning = error instanceof Error ? error.message : String(error);
    console.error("[TexasDefined Facebook] text post succeeded but history recording failed", recordWarning);
  }

  return Response.json({
    ok: true,
    posted: true,
    site: "TexasDefined",
    kind: post.kind,
    title: post.title,
    article_url: null,
    external_id: externalId,
    post_url: externalId ? `https://www.facebook.com/${externalId}` : null,
    package_id: packageId,
    record_warning: recordWarning,
    posted_at: new Date().toISOString(),
    mode,
    posts_today_before_post: decision.postsToday,
    content_mix: {
      engagement: 40,
      article: 30,
      fact: 15,
      seasonal: 10,
      shop: 5,
    },
  });
}

export const Route = createFileRoute("/api/public/hooks/auto-facebook-post-texasdefined-smart")({
  server: {
    handlers: {
      POST: async ({ request }) => runSmartTexasDefinedFacebookPost(request),
    },
  },
});
