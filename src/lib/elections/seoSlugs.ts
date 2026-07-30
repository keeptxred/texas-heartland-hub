const PARTY_SEGMENT = /-(democratic|republican|libertarian|green|independent|other)-race-2026-.+$/;

export function candidateSeoSlug(slug: string): string {
  return slug.replace(/^candidate-/, "").replace(PARTY_SEGMENT, "");
}

export function raceSeoSlug(slug: string): string {
  if (/^texas-.+-2026$/.test(slug)) return slug;

  const base = slug.replace(/^race-2026-/, "");
  const congressional = base.match(/^us-house-(\d+)$/);
  if (congressional) return `texas-us-house-district-${congressional[1]}-2026`;

  const texasHouse = base.match(/^(?:state-house|texas-house)-(\d+)$/);
  if (texasHouse) return `texas-house-district-${texasHouse[1]}-2026`;

  const texasSenate = base.match(/^(?:state-senate|texas-senate)-(\d+)$/);
  if (texasSenate) return `texas-senate-district-${texasSenate[1]}-2026`;

  return `texas-${base}-2026`;
}

export function findCandidateStoredSlug<T extends { slug: string }>(
  requestedSlug: string,
  records: readonly T[],
): string | null {
  return (
    records.find(
      (record) => record.slug === requestedSlug || candidateSeoSlug(record.slug) === requestedSlug,
    )?.slug ?? null
  );
}

export function findRaceStoredSlug<T extends { slug: string }>(
  requestedSlug: string,
  records: readonly T[],
): string | null {
  return (
    records.find((record) => record.slug === requestedSlug || raceSeoSlug(record.slug) === requestedSlug)
      ?.slug ?? null
  );
}
