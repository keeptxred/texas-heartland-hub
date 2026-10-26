import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

export type ClientEntryModule = { source: string; bytes: number };
export type ClientEntryProfile = {
  entry: string;
  rawBytes: number;
  totalAttributedBytes: number;
  modules: ClientEntryModule[];
};

export function clientEntryProfile(
  fileName: string,
  code: string,
  modules: Record<string, { renderedLength: number }>,
  cwd = process.cwd(),
): ClientEntryProfile {
  const normalizedCwd = cwd.replaceAll("\\", "/");
  const root = normalizedCwd.endsWith("/") ? normalizedCwd : normalizedCwd + "/";
  const list = Object.entries(modules)
    .map(([id, info]) => ({
      source: id.replaceAll("\\", "/").replace(root, ""),
      bytes: Math.max(0, info.renderedLength || 0),
    }))
    .sort((a, b) => b.bytes - a.bytes || a.source.localeCompare(b.source));
  return {
    entry: fileName,
    rawBytes: Buffer.byteLength(code, "utf8"),
    totalAttributedBytes: list.reduce((sum, row) => sum + row.bytes, 0),
    modules: list,
  };
}

/**
 * Opt-in profiling only. Does not alter Rollup chunking, route behavior,
 * emitted JS, source maps, third-party advertising or deployment guards.
 */
export function clientEntryProfiler(): Plugin {
  return {
    name: "ktr-laws-client-entry-profile",
    apply: "build",
    writeBundle(options, bundle) {
      const outputDir = String(options.dir ?? "").replaceAll("\\", "/");
      if (!/\/(?:dist\/)?client\/?$/.test("/" + outputDir)) return;
      const entries = Object.values(bundle)
        .filter((item) => item.type === "chunk" &&
          /^assets\/index-[^/]+\.js$/.test(item.fileName))
        .sort((a, b) => b.code.length - a.code.length);
      const entry = entries[0];
      if (!entry || entry.type !== "chunk") {
        throw new Error("Cannot profile dist/client/assets/index-*.js: expected root client entry was not emitted");
      }
      const profile = clientEntryProfile(entry.fileName, entry.code, entry.modules);
      const outDir = resolve("laws-client-bundle-profile");
      mkdirSync(outDir, { recursive: true });
      writeFileSync(resolve(outDir, "client-entry.json"), JSON.stringify({
        ...profile,
        topModules: profile.modules.slice(0, 60),
        moduleCount: profile.modules.length,
      }, null, 2) + "\n");
      const top = profile.modules.slice(0, 30);
      writeFileSync(resolve(outDir, "client-entry.md"), [
        "# Keep TX Red — shared client entry module attribution",
        "",
        "This is a production Vite output diagnostic, not a CWV, LCP, or ads measurement.",
        "Rendered module sizes are Rollup attribution estimates; they are not independently downloaded files.",
        "",
        `Entry: \`${profile.entry}\``,
        `Raw JS bytes: ${profile.rawBytes}`,
        `Attributed module bytes: ${profile.totalAttributedBytes}`,
        `Modules: ${profile.modules.length}`,
        "",
        "| Rank | Module | Attributed rendered bytes |",
        "|---:|---|---:|",
        ...top.map((row, i) => `| ${i + 1} | \`${row.source.replaceAll("|", "\\|")}\` | ${row.bytes} |`),
        "",
      ].join("\n"));
      console.log(`KTR client-entry profile: ${profile.rawBytes} bytes, ${profile.modules.length} contributing modules`);
    },
  };
}
