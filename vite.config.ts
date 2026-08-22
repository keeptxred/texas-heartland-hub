import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const supabasePublishableKey =
    env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const remoteBindings = env.CLOUDFLARE_VITE_REMOTE_BINDINGS !== "false";
  const compatibilityDateOverride = env.CLOUDFLARE_VITE_COMPATIBILITY_DATE;
  const allowPrivateOriginForLocalQa = env.CLOUDFLARE_VITE_ALLOW_PRIVATE_ORIGIN === "true";

  return {
    plugins: [
      cloudflare({
        viteEnvironment: { name: "ssr" },
        remoteBindings,
        config: (userConfig) => {
          if (compatibilityDateOverride) {
            userConfig.compatibility_date = compatibilityDateOverride;
          }

          if (allowPrivateOriginForLocalQa) {
            // Local Playwright QA serves the built Worker on loopback. The production
            // global_fetch_strictly_public safeguard rejects Worker subrequests to
            // 127.0.0.1, so opt into the documented private-origin behavior only
            // when the dedicated QA environment explicitly requests it.
            const existingFlags = userConfig.compatibility_flags ?? [];
            userConfig.compatibility_flags = [
              ...existingFlags.filter(
                (flag) =>
                  flag !== "global_fetch_strictly_public" && flag !== "global_fetch_private_origin",
              ),
              "global_fetch_private_origin",
            ];
          }
        },
      }),
      tanstackStart(),
      tsConfigPaths(),
      tailwindcss(),
      viteReact(),
    ],
    optimizeDeps: {
      force: true,
    },
    // These values are public Supabase connection metadata. Privileged
    // credentials stay exclusively in Cloudflare Worker secrets.
    define: {
      "process.env.SUPABASE_URL": JSON.stringify(supabaseUrl),
      "process.env.SUPABASE_PUBLISHABLE_KEY": JSON.stringify(supabasePublishableKey),
    },
  };
});
