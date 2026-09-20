import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const FEEDS: Record<string, string> = {
  "dfw-cross-timbers": "https://news.google.com/rss/search?q=%28%22Fort+Worth%22+OR+Arlington+OR+Denton+OR+Weatherford%29+Texas+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen",
  "western-north-texas": "https://news.google.com/rss/search?q=%28%22Wichita+Falls%22+OR+%22Mineral+Wells%22+OR+Graham+OR+Jacksboro%29+Texas+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen",
};

const UPSTREAM_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; KeepTXRedBot/1.2; +https://keeptxred.com)",
  Accept: "application/rss+xml,application/atom+xml,application/xml,text/xml,*/*",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
};

Deno.serve(async (req: Request) => {
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405, headers: { Allow: "GET" } });
  const key = new URL(req.url).searchParams.get("feed") ?? "";
  const upstreamUrl = FEEDS[key];
  if (!upstreamUrl) return new Response("Unknown feed", { status: 404 });
  try {
    const upstream = await fetch(upstreamUrl, { headers: UPSTREAM_HEADERS, redirect: "follow", signal: AbortSignal.timeout(15000) });
    const body = await upstream.arrayBuffer();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=120, s-maxage=120",
        "X-KTR-RSS-Source": key,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "upstream fetch failed";
    return new Response(JSON.stringify({ ok: false, error: message }), { status: 502, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  }
});
