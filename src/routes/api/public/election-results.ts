import { createFileRoute } from "@tanstack/react-router";
import {
  parseOfficialTexasResults,
  sosSourceAgeMinutes,
  TEXAS_SOS_RESULTS_URL,
  type OfficialResultsFeed,
} from "@/lib/elections/official-results.server";

const FRESH_MS = 25_000;
const STALE_FALLBACK_MS = 3 * 60_000;
let recent: { checkedAt: number; feed: OfficialResultsFeed } | null = null;
let ongoing: Promise<OfficialResultsFeed> | null = null;

async function retrieve(): Promise<OfficialResultsFeed> {
  const upstream = await fetch(TEXAS_SOS_RESULTS_URL, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "KeepTXRed-Election-Results/1.0 (+https://keeptxred.com/elections/results)",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(12_000),
  });
  if (!upstream.ok) throw new Error("Texas SOS results provider returned HTTP " + upstream.status);
  const html = await upstream.text();
  if (html.length < 500 || html.length > 9_000_000) {
    throw new Error("Unexpected Texas SOS results response size");
  }
  return parseOfficialTexasResults(html);
}

function responseFeed(feed: OfficialResultsFeed, stale: boolean, providerError?: string) {
  const sourceAgeMinutes = sosSourceAgeMinutes(feed.sourceUpdatedLabel);
  return {
    ...feed,
    stale,
    ...(providerError ? { providerError } : {}),
    sourceAgeMinutes,
    sourceLagging: feed.reportingNow && sourceAgeMinutes !== null && sourceAgeMinutes >= 20,
  };
}

async function handler() {
  const now = Date.now();
  if (recent && now - recent.checkedAt < FRESH_MS) {
    return Response.json(responseFeed(recent.feed, false), {
      headers: { "Cache-Control": "public, max-age=15, s-maxage=25", "X-Content-Type-Options": "nosniff" },
    });
  }

  try {
    ongoing ??= retrieve();
    const feed = await ongoing;
    recent = { feed, checkedAt: Date.now() };
    return Response.json(responseFeed(feed, false), {
      headers: { "Cache-Control": "public, max-age=15, s-maxage=25", "X-Content-Type-Options": "nosniff" },
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown provider failure";
    console.error("[official-election-results] source unavailable:", reason);
    if (recent && now - recent.checkedAt < STALE_FALLBACK_MS) {
      return Response.json(responseFeed(recent.feed, true, reason), {
        headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
      });
    }
    return Response.json({
      ok: false,
      stale: true,
      source: "Texas Secretary of State",
      sourceUrl: TEXAS_SOS_RESULTS_URL,
      error: "The official election results feed is temporarily unavailable or could not be validated.",
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  } finally {
    ongoing = null;
  }
}

export const Route = createFileRoute("/api/public/election-results")({
  server: { handlers: { GET: handler } },
});
