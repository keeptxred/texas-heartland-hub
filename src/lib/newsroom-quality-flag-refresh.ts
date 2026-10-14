const RECOMPUTED_FLAGS = new Set([
  "weak_title",
  "weak_dek",
  "missing_author",
  "missing_publish_date",
  "missing_image",
  "thin_body",
  "missing_why_this_matters",
  "missing_texas_context",
  "search_recovery_source_first",
  // These are calculated by finalize-newsroom-article for the current body
  // and sources. Retaining old values after an evidence-backed edit would
  // permanently quarantine an article even when the defect is corrected.
  "internal_repetition",
  "seo_false_multisource",
]);

/**
 * Preserve manually assigned editorial quarantine flags. Recompute the
 * newsroom's own score, source-integrity and repetition flags on every pass.
 * seo_low_value_commodity can also be a deliberate editorial decision;
 * only reset it when coupled to the old generated internal_repetition flag.
 */
export function retainNewsroomEditorialFlags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const flags = value.filter((flag): flag is string => typeof flag === "string");
  const hadGeneratedRepetition = flags.includes("internal_repetition");
  return [...new Set(flags.filter((flag) =>
    !RECOMPUTED_FLAGS.has(flag)
    && !(hadGeneratedRepetition && flag === "seo_low_value_commodity"),
  ))];
}
