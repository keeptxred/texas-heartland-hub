import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const FEEDS = new Set([
  "google-airports-travel",
  "google-dps-wanted",
  "google-higher-education",
  "google-police-fire",
  "google-primary-workforce",
  "google-primary-governor",
  "google-workforce-grants",
]);

const RELAY_BASE = "https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay";
const TRANSIENT = new Set([408, 425, 429, 500, 502, 503, 504]);

Deno.serve(async (req: Request) => {
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405, headers: { Allow: "GET" } });
  const key = new URL(req.url).searchParams.get("feed") ?? "";
  if (!FEEDS.has(key)) return new Response("Unknown feed", { status: 404 });

  let lastError = "upstream fetch failed";
  for (let attempt = 1; attempt <= 2; attempt++) {
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
      if (upstream.ok || attempt === 2 || !TRANSIENT.has(upstream.status)) {
        const body = await upstream.arrayBuffer();
        return new Response(body, {
          status: upstream.status,
          headers: {
            "Content-Type": upstream.headers.get("content-type") || "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=120, s-maxage=120",
            "X-KTR-RSS-Priority-Source": key,
            "X-KTR-RSS-Priority-Attempts": String(attempt),
            "X-Content-Type-Options": "nosniff",
          },
        });
      }
      lastError = `HTTP ${upstream.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : "upstream fetch failed";
      if (attempt === 2) break;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  return Response.json({ ok: false, error: lastError }, { status: 502, headers: { "Cache-Control": "no-store" } });
});
