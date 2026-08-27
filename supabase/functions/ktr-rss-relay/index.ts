import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const FEEDS: Record<string, string> = {
  "khou-local": "https://www.khou.com/feeds/syndication/rss/news/local",
  "khou-sports": "https://www.khou.com/feeds/syndication/rss/sports/",
  "wfaa-local": "https://www.wfaa.com/feeds/syndication/rss/news/local",
  "kvue-local": "https://www.kvue.com/feeds/syndication/rss/news/local",
  "kens-local": "https://www.kens5.com/feeds/syndication/rss/news/local",
  "google-executive-actions": "https://news.google.com/rss/search?q=%28site%3Agov.texas.gov+OR+%22Governor+Abbott%22+appointment+OR+%22Governor+Abbott%22+directs+OR+%22Governor+Abbott%22+grant%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen",
  "google-attorney-general": "https://news.google.com/rss/search?q=%28%22Texas+Attorney+General%22+OR+site%3Atexasattorneygeneral.gov%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen",
  "google-dps-wanted": "https://news.google.com/rss/search?q=%28site%3Adps.texas.gov+OR+%22Texas+10+Most+Wanted%22+OR+%22Texas+DPS%22+reward+OR+%22Texas+DPS%22+arrest%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen",
  "google-city-county-decisions": "https://news.google.com/rss/search?q=%28%22city+council%22+Texas+settlement+OR+%22city+council%22+Texas+approves+OR+%22commissioners+court%22+Texas+approves+OR+%22county+clerk%22+Texas+OR+%22county+judge%22+Texas%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen",
  "google-police-fire": "https://news.google.com/rss/search?q=%28%22police+department%22+Texas+arrest+OR+%22sheriff%27s+office%22+Texas+arrest+OR+%22fire+department%22+Texas+evacuation+OR+%22fire+marshal%22+Texas+OR+daycare+Texas+arrest%29+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen",
  "google-courts-appointments": "https://news.google.com/rss/search?q=%28Texas+federal+judge+blocks+OR+Texas+judge+rules+OR+Texas+court+unseal+OR+Texas+district+court+appointment+OR+Texas+judicial+appointment%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen",
  "google-higher-education": "https://news.google.com/rss/search?q=%28%22Texas+Higher+Education+Coordinating+Board%22+OR+Texas+university+grant+OR+Texas+university+appointment+OR+Texas+college+program+OR+Texas+campus+expansion%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen",
  "google-corporate-expansions": "https://news.google.com/rss/search?q=%28Texas+%22exclusive+partner%22+OR+Texas+%22corporate+headquarters%22+OR+Texas+%22new+plant%22+OR+Texas+%22manufacturing+facility%22+OR+Texas+%22jobs+by+2030%22+OR+Texas+company+expansion%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen",
  "google-workforce-grants": "https://news.google.com/rss/search?q=%28site%3Atwc.texas.gov+OR+Texas+workforce+grant+OR+Texas+training+grant+OR+Texas+economic+development+grant+OR+Texas+skills+grant%29+when%3A4d&hl=en-US&gl=US&ceid=US%3Aen",
  "google-property-alerts": "https://news.google.com/rss/search?q=%28Texas+property+fraud+alert+OR+Texas+deed+fraud+OR+Texas+county+clerk+property+alert+OR+Texas+property+records+alert%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen",
  "google-wildlife": "https://news.google.com/rss/search?q=%28Texas+zoo+OR+Texas+wildlife+OR+Texas+conservation%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen",
  "google-libraries-museums": "https://news.google.com/rss/search?q=%28Texas+library+%22million%22+grant+OR+Texas+library+donation+OR+Texas+museum+grant+OR+Texas+community+foundation+gift+OR+Texas+cultural+grant%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen",
  "google-awards-recognition": "https://news.google.com/rss/search?q=%28Texas+%22named+best%22+OR+Texas+%22wins+contest%22+OR+Texas+%22fan-voted%22+OR+Texas+%22cutest%22+OR+Texas+award+winner%29+when%3A5d&hl=en-US&gl=US&ceid=US%3Aen",
  "google-sports-recruiting": "https://news.google.com/rss/search?q=%28%22Texas+Tech%22+OR+%22Texas+Longhorns%22+OR+%22Texas+A%26M%22+OR+Baylor+OR+SMU+OR+TCU%29+%28commitment+OR+recruiting+OR+partnership+OR+sponsor%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen",
  "google-sports-records": "https://news.google.com/rss/search?q=%28Texas+team+clinches+OR+Texas+athlete+record+OR+Texas+school+tradition+award+OR+Texas+NCAA+penalty+OR+Texas+sports+milestone%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen",
  "google-airports-travel": "https://news.google.com/rss/search?q=%28Texas+airport+TSA+OR+DFW+TSA+OR+Houston+airport+TSA+OR+Texas+airport+award+OR+Texas+airport+new+route%29+when%3A5d&hl=en-US&gl=US&ceid=US%3Aen",
  "google-local-oddities": "https://news.google.com/rss/search?q=%28Texas+robot+sidewalk+OR+Texas+unusual+city+project+OR+Texas+local+oddity+OR+Texas+community+milestone+OR+Texas+unique+tradition%29+when%3A5d&hl=en-US&gl=US&ceid=US%3Aen",
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
