import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { traceEntryStaticImporterChains } from "./client-entry-import-chains";

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
      const entry = Object.values(bundle).find((item) =>
        item.type === "chunk" && /^assets\/index-[^/]+\.js$/.test(item.fileName));
      if (!entry || entry.type !== "chunk") {
        throw new Error("Cannot profile dist/client/assets/index-*.js: expected root client entry was not emitted");
      }
      const profile = clientEntryProfile(entry.fileName, entry.code, entry.modules);
      const included = new Set(Object.keys(entry.modules));
      const normalize = (id: string) => {
        const absolute = id.replaceAll("\\", "/");
        const cwd = process.cwd().replaceAll("\\", "/");
        return absolute.startsWith(cwd + "/") ? absolute.slice(cwd.length + 1) : absolute;
      };
      const topAttribution = Object.entries(entry.modules)
        .sort((a, b) => b[1].renderedLength - a[1].renderedLength)
        .slice(0, 12)
        .map(([id, details]) => ({
          source: normalize(id),
          bytes: details.renderedLength,
          staticImportChains: traceEntryStaticImporterChains(
            id, included,
            (moduleId) => {
              const info = this.getModuleInfo(moduleId);
              return info ? { importers: info.importers } : null;
            },
          ).map((path) => path.map(normalize)),
        }));
      const outDir = resolve("laws-client-bundle-profile");
      mkdirSync(outDir, { recursive: true });
      writeFileSync(resolve(outDir, "client-entry.json"), JSON.stringify({
        ...profile,
        topModules: profile.modules.slice(0, 60),
        moduleCount: profile.modules.length,
        staticImporterProvenance: topAttribution,
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
        "## How large election data reaches the shared entry",
        "",
        "Static import chains below run from the large module toward the entry importer.",
        "A chain describes inclusion, not execution or network transfer order.",
        "",
        ...topAttribution.map((item) => [
          `### ${item.source} — ${item.bytes} attributed bytes`,
          ...(item.staticImportChains.length ? item.staticImportChains.map((path) =>
            `- ${path.map((id) => "\`" + id + "\`").join(" ← ")}`
          ) : ["- No static chain identified inside this emitted chunk"]),
          "",
        ].join("\n")),
        "",
      ].join("\n"));
      console.log(`KTR client-entry profile: ${profile.rawBytes} bytes, ${profile.modules.length} contributing modules`);
    },
  };
}
