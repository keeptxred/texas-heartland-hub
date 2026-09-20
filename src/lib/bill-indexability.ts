export const CATALOG_SEED_ACTION_CODE = 'tlo-filed-report-latest';
export const SCHEDULE_ACTION_CODES = new Set(['tlo-rss-meeting', 'tlo-rss-calendar']);

export function normalizedBillActionCode(value: unknown): string {
  return String(value ?? '').trim().toLowerCase();
}

export function isScheduleBillActionCode(value: unknown): boolean {
  return SCHEDULE_ACTION_CODES.has(normalizedBillActionCode(value));
}

export function isSubstantiveBillActionCode(value: unknown): boolean {
  const code = normalizedBillActionCode(value);
  return Boolean(code) && code !== CATALOG_SEED_ACTION_CODE && !SCHEDULE_ACTION_CODES.has(code);
}

export function hasMeaningfulBillText(value: unknown, minimum = 80): boolean {
  return String(value ?? '').trim().length >= minimum;
}
