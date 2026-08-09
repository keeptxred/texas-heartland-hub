// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    // The hosted dev sandbox can retain an outdated node_modules/.vite pre-bundle
    // across rapid repository updates. When that happens the browser requests old
    // dependency hashes and Vite answers with 504s before the app handler runs.
    // Force a fresh dependency pre-bundle whenever the dev server starts so React
    // and TanStack dependencies cannot be served from a stale optimizer cache.
    optimizeDeps: {
      force: true,
    },
    // Lovable injects VITE_* variables into the bundled runtime. A few older
    // SSR helpers still read process.env directly; map the two public Supabase
    // connection values to the injected equivalents so those helpers query the
    // same Lovable-managed database instead of silently falling back.
    define: {
      "process.env.SUPABASE_URL": "import.meta.env.VITE_SUPABASE_URL",
      "process.env.SUPABASE_PUBLISHABLE_KEY": "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY",
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
