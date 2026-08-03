const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_PATTERN = /(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/g;
const SSN_PATTERN = /\b\d{3}-?\d{2}-?\d{4}\b/g;
const LONG_NUMBER_PATTERN = /\b\d{8,}\b/g;

export type SearchTelemetryPrivacyResult = {
  query: string;
  redacted: boolean;
};

export function sanitizeSearchTelemetryQuery(value: string): SearchTelemetryPrivacyResult {
  let redacted = false;
  const replace = (input: string, pattern: RegExp, replacement: string) => input.replace(pattern, () => {
    redacted = true;
    return replacement;
  });

  let query = value;
  query = replace(query, EMAIL_PATTERN, '[email]');
  query = replace(query, PHONE_PATTERN, '[phone]');
  query = replace(query, SSN_PATTERN, '[number]');
  query = replace(query, LONG_NUMBER_PATTERN, '[number]');
  query = query.replace(/\s+/g, ' ').trim();

  return { query, redacted };
}

export function isSearchTelemetryQuerySafe(value: string) {
  return !sanitizeSearchTelemetryQuery(value).redacted;
}
