/**
 * Follow only Rollup's static importer edges within a particular emitted entry.
 * This is diagnostic output: module attribution is not downloaded JS size.
 */
export type StaticImporterInfo = { importers: readonly string[] };

export function traceEntryStaticImporterChains(
  target: string,
  included: ReadonlySet<string>,
  getInfo: (id: string) => StaticImporterInfo | null,
  maxChains = 4,
): string[][] {
  if (!included.has(target) || maxChains <= 0) return [];
  const result: string[][] = [];
  const queue: string[][] = [[target]];
  const visited = new Set<string>();
  let explored = 0;
  while (queue.length > 0 && result.length < maxChains && explored < 2000) {
    const path = queue.shift()!;
    const id = path[path.length - 1];
    const key = id + "|" + path.length;
    if (visited.has(key)) continue;
    visited.add(key);
    explored++;
    const parents = (getInfo(id)?.importers ?? []).filter((parent) =>
      included.has(parent) && !path.includes(parent)).sort();
    if (parents.length === 0 || path.length >= 18) {
      result.push(path);
    } else {
      for (const parent of parents) queue.push([...path, parent]);
    }
  }
  return result;
}
