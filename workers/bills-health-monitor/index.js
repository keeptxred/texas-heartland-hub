// Standalone scheduled Worker. Requires HEALTH_STATE KV and ALERT_WEBHOOK_URL secret.
const endpoints = [
  ["bills", "https://keeptxred.com/texas-bills"],
  ["api", "https://ftkznprjljkhymknvhye.supabase.co/rest/v1/bills?select=id&limit=1"]
];
export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(Promise.all(endpoints.map(async ([name, url]) => {
      const headers = name === "api" ? { apikey: env.SUPABASE_PUBLISHABLE_KEY, Authorization: "Bearer " + env.SUPABASE_PUBLISHABLE_KEY } : {};
      let status = 0;
      let healthy = false;
      try {
        const response = await fetch(url, { headers, signal: AbortSignal.timeout(10000) });
        status = response.status;
        healthy = response.ok && (await response.text()).length > 2;
      } catch (error) {
        console.error(name, String(error));
      }
      const key = "health:" + name;
      const previous = await env.HEALTH_STATE.get(key);
      const next = healthy ? "healthy" : "failing";
      console.log(JSON.stringify({ name, status, next, at: new Date().toISOString() }));
      if (previous !== next) {
        if (env.ALERT_WEBHOOK_URL && (!healthy || previous === "failing")) {
          const alert = await fetch(env.ALERT_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: "KeepTXRed " + name + " " + next + " (HTTP " + status + ")" })
          });
          if (!alert.ok) throw new Error("Webhook failed: " + alert.status);
        }
        await env.HEALTH_STATE.put(key, next);
      }
    })));
  }
};
