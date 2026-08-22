import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const supabasePublishableKey =
    env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const remoteBindings = env.CLOUDFLARE_VITE_REMOTE_BINDINGS !== "false";
  const compatibilityDateOverride = env.CLOUDFLARE_VITE_COMPATIBILITY_DATE;

  return {
    resolve: {
      // Vite 8 resolves tsconfig path aliases natively. Keeping this at the
      // Vite layer avoids loading the now-redundant vite-tsconfig-paths plugin.
      tsconfigPaths: true,
    },
    plugins: [
      cloudflare({
        viteEnvironment: { name: "ssr" },
        remoteBindings,
        ...(compatibilityDateOverride
          ? { config: { compatibility_date: compatibilityDateOverride } }
          : {}),
      }),
      tanstackStart({
        router: {
          // Co-located tests are not file-based routes. Excluding them here
          // prevents route-generation warnings without moving or weakening tests.
          routeFileIgnorePattern: "\\.(test|spec)\\.(ts|tsx)$",
        },
      }),
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
