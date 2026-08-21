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
const WATER_DATA_BASE = "https://waterdatafortexas.org/reservoirs/individual";
const LAKE_LEVEL_MAX_AGE_DAYS = 3;

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
type TextPostKind = Exclude<PostKind, "article"> | "lake_level";

type TextPost = {
  kind: TextPostKind;
  message: string;
  title: string;
};

type ReservoirCandidate = {
  name: string;
  waterDataSlug: string;
};

type ReservoirSnapshot = {
  name: string;
  sourceUrl: string;
  date: string;
  percentFull: number;
  weekAgoPercent: number | null;
  monthAgoPercent: number | null;
};

type ReservoirCsvRow = {
  date: string;
  timestamp: number;
  percentFull: number;
};

const RESERVOIR_CANDIDATES: readonly ReservoirCandidate[] = [
  { name: "Lake Corpus Christi", waterDataSlug: "corpus-christi" },
  { name: "Lake Conroe", waterDataSlug: "conroe" },
  { name: "Lake Fork", waterDataSlug: "fork" },
  { name: "Sam Rayburn Reservoir", waterDataSlug: "sam-rayburn" },
  { name: "Toledo Bend Reservoir", waterDataSlug: "toledo-bend" },
  { name: "Possum Kingdom Lake", waterDataSlug: "possum-kingdom" },
  { name: "Canyon Lake", waterDataSlug: "canyon" },
  { name: "Choke Canyon Reservoir", waterDataSlug: "choke-canyon" },
  { name: "Amistad Reservoir", waterDataSlug: "amistad" },
  { name: "Lake Travis", waterDataSlug: "travis" },
  { name: "Lake Buchanan", waterDataSlug: "buchanan" },
  { name: "Lake Livingston", waterDataSlug: "livingston" },
  { name: "Lake Whitney", waterDataSlug: "whitney" },
  { name: "Lake Texoma", waterDataSlug: "texoma" },
] as const;

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
  "We never get tired of seeing a Texas lake at sunset. Which lake has your favorite view?",
  "One of our favorite things about Texas state parks is how different they can look from one season to the next. Which park has surprised you most?",
  "There is something about a quiet Texas back road that makes you want to keep driving. What road-trip route do you always recommend?",
  "We love the little places that make a Texas town feel like home — the diner, courthouse square, old theater or local shop. What place defines your town?",
  "Some Texas destinations are worth revisiting just to see how much they change through the year. Where do you like going back to?",
  "We could look at Hill Country views all day. What part of Texas scenery never gets old to you?",
  "There is nothing fancy about a good Texas day trip — sometimes it is just a pretty drive, a small town and somewhere good to eat. What is your perfect route?",
  "We love hearing about the places Texans actually return to, not just the famous stops. What is your under-the-radar favorite?",
] as const;

const FACT_POSTS = [
  "Texas has 254 counties — more than any other state. Which county should every Texan visit at least once?",
  "The bluebonnet is the state flower of Texas. Where is your favorite place to see bluebonnets in spring?",
  "Guadalupe Peak is the highest natural point in Texas. What is your favorite Texas mountain or overlook?",
  "The pecan is the state tree of Texas. What Texas-grown food deserves more attention?",
  "The northern mockingbird is the state bird of Texas. What Texas bird do you notice most where you live?",
  "Texas was an independent republic from 1836 to 1845. Which chapter of Texas history fascinates you most?",
  "We love how one Texas road trip can take you from pine forests to desert mountains to the Gulf. Which Texas landscape feels most like home to you?",
  "One thing we love about Texas is how much history is hiding in plain sight. What historic place near you deserves more attention?",
] as const;

function seasonalPosts(month: number): readonly string[] {
  if (month === 12 || month <= 2) {
    return [
      "Texas winter can mean 75 degrees one day and a freeze the next. What is your favorite Texas winter getaway?",
      "When a real cold front hits Texas, what is the first thing you cook?",
      "What Texas place is better to visit in winter than in summer?",
      "We love those crisp Texas winter mornings when even a familiar park feels completely different. Where do you like to get outside when it finally cools off?",
    ];
  }
  if (month >= 3 && month <= 5) {
    return [
      "Spring road-trip season is here. What Texas destination belongs on everyone's spring list?",
      "Bluebonnets, wildflowers and patio weather: what is your favorite part of spring in Texas?",
      "What is the best Texas day trip to take before summer heat arrives?",
      "We love watching Texas turn green again in spring. What place do you look forward to seeing every year when the wildflowers come back?",
    ];
  }
  if (month >= 6 && month <= 8) {
    return [
      "Texas summer is in full force. What is your go-to place to escape the heat?",
      "What is the best Texas river, lake or swimming hole for a summer day?",
      "What is one Texas summer tradition you never skip?",
      "We love seeing families make the most of Texas lakes and state parks in summer. Where is your favorite place to spend a long, slow evening by the water?",
    ];
  }
  return [
    "Fall is one of the best road-trip seasons in Texas. Where are you headed when the weather finally cools down?",
    "State Fair, football, small-town festivals or camping — what says fall in Texas to you?",
    "Where is the best place in Texas to spend a cool fall weekend?",
    "We wait all summer for those first cooler Texas evenings. What is the first place you want to visit when patio and camping weather comes back?",
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
  return new Set(posts.map((post) => normalizeFacebookHeadline(post.message ?? "")).filter(Boolean));
}

function chooseFromPool(pool: readonly string[], seed: string, key: string, recent: Set<string>): string {
  const start = hash32(`${seed}:${key}`) % pool.length;
  for (let offset = 0; offset < pool.length; offset += 1) {
    const candidate = pool[(start + offset) % pool.length];
    if (!recent.has(normalizeFacebookHeadline(candidate))) return candidate;
  }
  return pool[start];
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }
    if (char === "," && !quoted) {
      values.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current.trim());
  return values;
}

function normalizeCsvHeader(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function parseReservoirCsvRows(csv: string): ReservoirCsvRow[] {
  const lines = csv.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim().length > 0);
  const headerIndex = lines.findIndex((line) => {
    const headers = parseCsvLine(line).map(normalizeCsvHeader);
    return headers.includes("date") && headers.includes("percent_full");
  });
  if (headerIndex < 0) return [];

  const headers = parseCsvLine(lines[headerIndex]).map(normalizeCsvHeader);
  const dateIndex = headers.indexOf("date");
  const percentIndex = headers.indexOf("percent_full");
  const rows: ReservoirCsvRow[] = [];

  for (const line of lines.slice(headerIndex + 1)) {
    const values = parseCsvLine(line);
    const date = values[dateIndex]?.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? null;
    const percentFull = Number(values[percentIndex]?.replace(/,/g, ""));
    if (!date || !Number.isFinite(percentFull) || percentFull < 0 || percentFull > 150) continue;
    const timestamp = Date.parse(`${date}T12:00:00Z`);
    if (!Number.isFinite(timestamp)) continue;
    rows.push({ date, timestamp, percentFull });
  }

  return rows.sort((a, b) => b.timestamp - a.timestamp);
}

function nearestPercent(rows: ReservoirCsvRow[], target: number, toleranceDays = 3): number | null {
  let best: { delta: number; percentFull: number } | null = null;
  for (const row of rows) {
    const delta = Math.abs(row.timestamp - target);
    if (delta > toleranceDays * 86_400_000) continue;
    if (!best || delta < best.delta) best = { delta, percentFull: row.percentFull };
  }
  return best?.percentFull ?? null;
}

function parseReservoirCsvSnapshot(candidate: ReservoirCandidate, csv: string): ReservoirSnapshot | null {
  const rows = parseReservoirCsvRows(csv);
  const latest = rows[0];
  if (!latest) return null;
  const latestDate = new Date(latest.timestamp);
  const weekTarget = latest.timestamp - 7 * 86_400_000;
  const monthDate = new Date(latestDate);
  monthDate.setUTCMonth(monthDate.getUTCMonth() - 1);
  return {
    name: candidate.name,
    sourceUrl: `${WATER_DATA_BASE}/${candidate.waterDataSlug}`,
    date: latest.date,
    percentFull: latest.percentFull,
    weekAgoPercent: nearestPercent(rows, weekTarget, 2),
    monthAgoPercent: nearestPercent(rows, monthDate.getTime(), 3),
  };
}

function stripHtml(value: string): string {
  return value
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function parseReservoirSnapshot(candidate: ReservoirCandidate, html: string): ReservoirSnapshot | null {
  const text = stripHtml(html);
  const headline = text.match(/([A-Za-z0-9 .&'()-]+):\s*([0-9]{1,3}(?:\.[0-9]+)?)%\s+full\s+as\s+of\s+(\d{4}-\d{2}-\d{2})/i);
  if (!headline) return null;
  const percentFull = Number(headline[2]);
  if (!Number.isFinite(percentFull) || percentFull < 0 || percentFull > 150) return null;

  const week = text.match(/1\s+week\s+ago\s+\d{4}-\d{2}-\d{2}\s+([0-9]{1,3}(?:\.[0-9]+)?)/i);
  const month = text.match(/1\s+month\s+ago\s+\d{4}-\d{2}-\d{2}\s+([0-9]{1,3}(?:\.[0-9]+)?)/i);
  const weekAgoPercent = week ? Number(week[1]) : null;
  const monthAgoPercent = month ? Number(month[1]) : null;

  return {
    name: candidate.name,
    sourceUrl: `${WATER_DATA_BASE}/${candidate.waterDataSlug}`,
    date: headline[3],
    percentFull,
    weekAgoPercent: Number.isFinite(weekAgoPercent) ? weekAgoPercent : null,
    monthAgoPercent: Number.isFinite(monthAgoPercent) ? monthAgoPercent : null,
  };
}

function reservoirSnapshotIsFresh(snapshot: ReservoirSnapshot, now = new Date()): boolean {
  const measured = Date.parse(`${snapshot.date}T23:59:59Z`);
  if (!Number.isFinite(measured)) return false;
  const ageDays = (now.getTime() - measured) / 86_400_000;
  return ageDays >= -1 && ageDays <= LAKE_LEVEL_MAX_AGE_DAYS;
}

function reservoirInterestScore(snapshot: ReservoirSnapshot): number {
  const weekChange = snapshot.weekAgoPercent == null ? 0 : snapshot.percentFull - snapshot.weekAgoPercent;
  const monthChange = snapshot.monthAgoPercent == null ? 0 : snapshot.percentFull - snapshot.monthAgoPercent;
  let score = Math.max(Math.abs(weekChange) * 4, Math.abs(monthChange) * 2);
  if (snapshot.percentFull >= 90) score += 12;
  if (snapshot.percentFull <= 50) score += 12;
  if (snapshot.percentFull >= 99) score += 8;
  return score;
}

function reservoirSnapshotIsPostworthy(snapshot: ReservoirSnapshot): boolean {
  if (!reservoirSnapshotIsFresh(snapshot)) return false;
  const weekChange = snapshot.weekAgoPercent == null ? 0 : Math.abs(snapshot.percentFull - snapshot.weekAgoPercent);
  const monthChange = snapshot.monthAgoPercent == null ? 0 : Math.abs(snapshot.percentFull - snapshot.monthAgoPercent);
  return snapshot.percentFull >= 90 || snapshot.percentFull <= 50 || weekChange >= 3 || monthChange >= 5;
}

async function loadReservoirSnapshot(candidate: ReservoirCandidate): Promise<ReservoirSnapshot | null> {
  const sourceUrl = `${WATER_DATA_BASE}/${candidate.waterDataSlug}`;
  try {
    const csvResponse = await fetch(`${sourceUrl}-1year.csv`, {
      cache: "no-store",
      headers: {
        accept: "text/csv,text/plain;q=0.9,*/*;q=0.1",
        "user-agent": "TexasDefined-Facebook-Publisher/1.1",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (csvResponse.ok) {
      const csvSnapshot = parseReservoirCsvSnapshot(candidate, await csvResponse.text());
      if (csvSnapshot) return csvSnapshot;
    }

    const htmlResponse = await fetch(sourceUrl, {
      cache: "no-store",
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "TexasDefined-Facebook-Publisher/1.1",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!htmlResponse.ok) return null;
    return parseReservoirSnapshot(candidate, await htmlResponse.text());
  } catch {
    return null;
  }
}

function lakeLevelPost(snapshot: ReservoirSnapshot): TextPost {
  const weekChange = snapshot.weekAgoPercent == null ? null : snapshot.percentFull - snapshot.weekAgoPercent;
  const monthChange = snapshot.monthAgoPercent == null ? null : snapshot.percentFull - snapshot.monthAgoPercent;
  let observation = `is ${snapshot.percentFull.toFixed(1)}% full`;

  if (weekChange != null && Math.abs(weekChange) >= 3) {
    observation += `, ${weekChange > 0 ? "up" : "down"} ${Math.abs(weekChange).toFixed(1)} points from a week earlier`;
  } else if (monthChange != null && Math.abs(monthChange) >= 5) {
    observation += `, ${monthChange > 0 ? "up" : "down"} ${Math.abs(monthChange).toFixed(1)} points from a month earlier`;
  }

  let opener = `We love keeping an eye on Texas lakes, and ${snapshot.name} ${observation}.`;
  if (snapshot.percentFull >= 90) opener = `It is great to see ${snapshot.name} sitting at ${snapshot.percentFull.toFixed(1)}% full.`;
  if (snapshot.percentFull <= 50) opener = `${snapshot.name} is sitting at just ${snapshot.percentFull.toFixed(1)}% full right now — a reminder of how much Texas water conditions can change.`;

  return {
    kind: "lake_level",
    title: `${snapshot.name} lake level`,
    message: `${opener}\n\nHave you been out there lately? What are conditions looking like from the shoreline?\n\nWater Data for Texas · ${snapshot.date}\n${snapshot.sourceUrl}`,
  };
}

async function chooseLakeLevelPost(args: {
  seed: string;
  dateKey: string;
  slot: number;
  recentPosts: FacebookPagePost[];
}): Promise<TextPost | null> {
  const recent = recentMessageSet(args.recentPosts);
  const start = hash32(`${args.seed}:${args.dateKey}:${args.slot}:lake-level`) % RESERVOIR_CANDIDATES.length;
  const ordered = Array.from({ length: RESERVOIR_CANDIDATES.length }, (_, offset) =>
    RESERVOIR_CANDIDATES[(start + offset) % RESERVOIR_CANDIDATES.length],
  );

  const snapshots: ReservoirSnapshot[] = [];
  for (const candidate of ordered.slice(0, 8)) {
    const snapshot = await loadReservoirSnapshot(candidate);
    if (snapshot && reservoirSnapshotIsPostworthy(snapshot)) snapshots.push(snapshot);
  }
  snapshots.sort((a, b) => reservoirInterestScore(b) - reservoirInterestScore(a));

  for (const snapshot of snapshots) {
    const post = lakeLevelPost(snapshot);
    const normalized = normalizeFacebookHeadline(post.message);
    if (!recent.has(normalized) && ![...recent].some((message) => message.includes(normalizeFacebookHeadline(snapshot.name)))) {
      return post;
    }
  }
  return null;
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
      source_url: post.kind === "lake_level" ? post.message.match(/https:\/\/\S+$/m)?.[0] ?? null : null,
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
  if (!token) return Response.json({ ok: false, error: "Missing GitHub Actions OIDC token" }, { status: 401 });

  try {
    await verifyGitHubActionsOidc({ token, audience: OIDC_AUDIENCE, repository: REPOSITORY, workflowPath: WORKFLOW_PATH });
  } catch (error) {
    return Response.json({ ok: false, error: "GitHub Actions OIDC verification failed", detail: error instanceof Error ? error.message : String(error) }, { status: 403 });
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const adminSeed = process.env.ADMIN_PASSCODE ?? "keeptxred";
  const mode = request.headers.get("x-ktr-facebook-mode")?.trim().toLowerCase() || "scheduled";

  let recentRows: QueueRow[];
  try {
    recentRows = await loadRecentQueue(db);
  } catch (error) {
    return Response.json({ ok: false, posted: false, error: "Failed to load TexasDefined Facebook history", detail: error instanceof Error ? error.message : String(error) }, { status: 500 });
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
  if (kind === "article") return forwardArticlePost(token);

  const { data: rawConnection, error: connectionError } = await db
    .from("social_connections")
    .select("account_id,access_token,connection_status")
    .eq("platform", SOCIAL_PLATFORM)
    .maybeSingle();
  if (connectionError) return Response.json({ ok: false, posted: false, error: connectionError.message }, { status: 500 });

  const connection = rawConnection as SocialConnectionRow | null;
  if (!connection || connection.connection_status !== "CONNECTED" || !connection.account_id || !connection.access_token) {
    return Response.json({ ok: false, posted: false, error: "TexasDefined Facebook Page is not connected", requires_connection: true }, { status: 503 });
  }

  let livePosts: FacebookPagePost[];
  try {
    livePosts = await fetchRecentFacebookPagePosts({ pageId: String(connection.account_id), pageToken: String(connection.access_token), limit: 100 });
  } catch (error) {
    return Response.json({ ok: false, posted: false, error: "TexasDefined Facebook duplicate verification failed", detail: error instanceof Error ? error.message : String(error) }, { status: 503 });
  }

  let post: TextPost | null = null;
  if (kind === "fact" || kind === "seasonal") {
    post = await chooseLakeLevelPost({ seed: adminSeed, dateKey: decision.dateKey, slot: decision.postsToday, recentPosts: livePosts });
  }
  if (!post) {
    post = chooseTextPost({ kind, seed: adminSeed, dateKey: decision.dateKey, slot: decision.postsToday, recentPosts: livePosts });
  }

  const graphUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(String(connection.account_id))}/feed`;
  const graphResponse = await fetch(graphUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message: post.message, access_token: String(connection.access_token) }),
  });
  const graphJson = (await graphResponse.json().catch(() => ({}))) as { id?: string; error?: { message?: string } };
  if (!graphResponse.ok || !graphJson.id) {
    return Response.json({
      ok: false,
      posted: false,
      error: graphJson.error?.message ?? `Facebook Graph API returned HTTP ${graphResponse.status}`,
      requires_connection: graphResponse.status === 401 || graphResponse.status === 403,
    }, { status: 502 });
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
    content_mix: { engagement: 40, article: 30, fact: 15, seasonal: 10, shop: 5 },
    lake_level_policy: {
      enabled: true,
      source: "Water Data for Texas",
      max_age_days: LAKE_LEVEL_MAX_AGE_DAYS,
      used_for_fact_or_seasonal_slots_when_postworthy: true,
    },
  });
}

export const Route = createFileRoute("/api/public/hooks/auto-facebook-post-texasdefined-smart")({
  server: { handlers: { POST: async ({ request }) => runSmartTexasDefinedFacebookPost(request) } },
});