import type { CommercialCavernCatalogRecord } from "./catalog.caverns";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TEXAS_LATITUDE_RANGE = [25, 37] as const;
const TEXAS_LONGITUDE_RANGE = [-107, -93] as const;

function isValidHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function hasGuidedTourActivity(record: CommercialCavernCatalogRecord): boolean {
  return record.activities.some((activity) => /guided (?:cave|cavern) tours?/i.test(activity));
}

export function validateCommercialCavernCatalog(
  records: readonly CommercialCavernCatalogRecord[],
): void {
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const names = new Set<string>();
  const errors: string[] = [];

  for (const record of records) {
    const label = `${record.name} (${record.slug})`;
    const normalizedName = record.name.trim().toLowerCase();

    if (ids.has(record.id)) errors.push(`${label}: duplicate id ${record.id}`);
    if (slugs.has(record.slug)) errors.push(`${label}: duplicate slug ${record.slug}`);
    if (names.has(normalizedName)) errors.push(`${label}: duplicate normalized name`);

    ids.add(record.id);
    slugs.add(record.slug);
    names.add(normalizedName);

    if (!/^commercial-cavern-[a-z0-9-]+$/.test(record.id)) {
      errors.push(`${label}: id must use the commercial-cavern-* format`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug)) {
      errors.push(`${label}: slug must be canonical lowercase kebab-case`);
    }
    if (!isValidHttpsUrl(record.officialUrl)) {
      errors.push(`${label}: officialUrl must be a valid HTTPS URL`);
    }
    if (
      record.latitude < TEXAS_LATITUDE_RANGE[0] ||
      record.latitude > TEXAS_LATITUDE_RANGE[1] ||
      record.longitude < TEXAS_LONGITUDE_RANGE[0] ||
      record.longitude > TEXAS_LONGITUDE_RANGE[1]
    ) {
      errors.push(`${label}: coordinates fall outside the Texas validation bounds`);
    }
    if (!ISO_DATE_PATTERN.test(record.last_reviewed) || Number.isNaN(Date.parse(record.last_reviewed))) {
      errors.push(`${label}: last_reviewed must be a valid YYYY-MM-DD date`);
    }
    if (record.guided_tours && !hasGuidedTourActivity(record)) {
      errors.push(`${label}: guided_tours is true but no guided-tour activity is listed`);
    }
    if (!record.guided_tours && hasGuidedTourActivity(record)) {
      errors.push(`${label}: guided-tour activity conflicts with guided_tours=false`);
    }
    if (record.reservations_recommended && !record.admission_required) {
      errors.push(`${label}: reservations are recommended while admission_required is false`);
    }
    if (record.image_url && !isValidHttpsUrl(record.image_url)) {
      errors.push(`${label}: image_url must be HTTPS when present`);
    }
    if (record.media_status === "approved" && !record.image_url) {
      errors.push(`${label}: approved media_status requires image_url`);
    }
    if (!record.summary.trim() || !record.accessibility.trim() || !record.pet_policy.trim()) {
      errors.push(`${label}: summary, accessibility, and pet_policy are required`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Commercial cavern catalog validation failed:\n- ${errors.join("\n- ")}`);
  }
}
