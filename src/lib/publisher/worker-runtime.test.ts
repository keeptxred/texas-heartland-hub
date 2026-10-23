import { expect, it } from "vitest";
import { build } from "esbuild";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { CLIENT, RESOURCE, SCOPE } from "./auth.server";
import { fileURLToPath } from "node:url";

it("renders owner consent in Workerd with real request and storage response handling", async () => {
  const bundled = await build({
    stdin: {
      contents: `import {oauth} from './auth.server'; import {Store} from './store.server';
        export default {fetch(request,env){return oauth(request,new Store(env))}};`,
      resolveDir: fileURLToPath(new URL(".", import.meta.url)),
    },
    bundle: true,
    write: false,
    format: "esm",
    platform: "browser",
  });
  const runtime = new Miniflare(
    convertV4MiniflareOptions({
      modules: true,
      script: bundled.outputFiles[0].text,
      // The bundled local Workerd supports this date; production keeps its configured date.
      compatibilityDate: "2026-08-11",
      bindings: {
        PUBLISHER_LOGIN_SECRET: "test-publisher-owner-secret",
        SUPABASE_URL: "https://storage.example",
        SUPABASE_SERVICE_ROLE_KEY: "test-service-key",
      },
      outboundService: async (request) => {
        if (request.url === CLIENT)
          return Response.json({
            client_id: CLIENT,
            redirect_uris: ["https://chatgpt.com/connector_platform_oauth_redirect"],
          });
        if (request.method === "DELETE") return new Response(null, { status: 204 });
        if (request.method === "POST") return Response.json([await request.json()]);
        throw new Error("Unexpected outbound request");
      },
    }),
  );
  try {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: CLIENT,
      redirect_uri: "https://chatgpt.com/connector_platform_oauth_redirect",
      scope: SCOPE,
      resource: RESOURCE,
      state: "runtime-test",
      code_challenge: "a".repeat(43),
      code_challenge_method: "S256",
    });
    const response = await runtime.dispatchFetch(
      `https://keeptxred.com/publisher/oauth/authorize?${params}`,
    );
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("Authorize ChatGPT");
  } finally {
    await runtime.dispose();
  }
}, 30000);
