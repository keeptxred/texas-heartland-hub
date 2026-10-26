const SYNTHETIC_EVIDENCE_MARKERS = [
  "MULTI-SOURCE STORY PACKET.",
  "RAW SOURCE PACKET",
  "STRUCTURED FACT LEDGER",
  "PRIMARY-RECORD-AUGMENTED SOURCE PACKET.",
  "RELATED OFFICIAL RELEASE SERIES:",
] as const;

export function isSyntheticNewsroomEvidence(value: string | null | undefined): boolean {
  if (!value) return false;
  const normalized = value.replace(/\s+/g, " ").trim().toUpperCase();
  return SYNTHETIC_EVIDENCE_MARKERS.some((marker) => normalized.includes(marker));
}
