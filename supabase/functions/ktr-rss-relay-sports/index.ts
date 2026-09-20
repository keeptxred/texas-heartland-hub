import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const FEEDS: Record<string, string> = {
  "basketball-expansion": "https://news.google.com/rss/search?q=%28%22Houston+Rockets%22+OR+%22Dallas+Wings%22%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen",
  "soccer-women": "https://news.google.com/rss/search?q=%28%22Austin+FC%22+OR+%22FC+Dallas%22+OR+%22Houston+Dynamo+FC%22+OR+%22Houston+Dash%22%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen",
};

const UPSTREAM_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; KeepTXRedBot/1.2; +https://keeptxred.com)",
  Accept: "application/rss+xml,application/atom+xml,application/xml,text/xml,*/*",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
};

Deno.serve(async (req: Request) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET" } });
  }

  const key = new URL(req.url).searchParams.get("feed") ?? "";
  const upstreamUrl = FEEDS[key];
  if (!upstreamUrl) return new Response("Unknown feed", { status: 404 });

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: UPSTREAM_HEADERS,
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
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
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
});
