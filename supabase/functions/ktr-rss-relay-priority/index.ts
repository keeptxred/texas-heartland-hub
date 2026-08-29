import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const FEEDS = new Set([
  "google-airports-travel",
  "google-dps-wanted",
  "google-higher-education",
  "google-police-fire",
  "google-primary-workforce",
]);

const RELAY_BASE = "https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay";

Deno.serve(async (req: Request) => {
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405, headers: { Allow: "GET" } });
  const key = new URL(req.url).searchParams.get("feed") ?? "";
  if (!FEEDS.has(key)) return new Response("Unknown feed", { status: 404 });

  try {
    const upstream = await fetch(`${RELAY_BASE}?feed=${encodeURIComponent(key)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KeepTXRedBot/1.2; +https://keeptxred.com)",
        Accept: "application/rss+xml,application/atom+xml,application/xml,text/xml,*/*",
        "Cache-Control": "no-cache",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });
    const body = await upstream.arrayBuffer();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=120, s-maxage=120",
        "X-KTR-RSS-Priority-Source": key,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "upstream fetch failed";
    return Response.json({ ok: false, error: message }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
});
