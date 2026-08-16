import { isPrimaryNewsSource } from "./newsroom-editorial-scoring";

export type NewsroomSourceIdentity = {
  source: string | null | undefined;
  link: string | null | undefined;
};

export function countDistinctNewsSources(rows: readonly NewsroomSourceIdentity[]): number {
  return new Set(
    rows
      .map((row) => row.source?.trim())
      .filter((source): source is string => Boolean(source)),
  ).size;
}

export function countDistinctPrimaryNewsSources(rows: readonly NewsroomSourceIdentity[]): number {
  return new Set(
    rows
      .filter((row) => isPrimaryNewsSource(row.source, row.link))
      .map((row) => row.source?.trim())
      .filter((source): source is string => Boolean(source)),
  ).size;
}
