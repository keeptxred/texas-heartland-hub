function readBooleanFlag(value: string | boolean | undefined, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return fallback;

  const normalized = value.trim().toLowerCase();

  if (["1", "true", "yes", "on", "enabled"].includes(normalized)) return true;
  if (["0", "false", "no", "off", "disabled"].includes(normalized)) return false;

  return fallback;
}

export const ELECTION_FEATURE_FLAGS = {
  homepagePromotion: readBooleanFlag(
    import.meta.env.VITE_ENABLE_ELECTION_CENTRAL_HOMEPAGE,
    false,
  ),
} as const;

export type ElectionFeatureFlag = keyof typeof ELECTION_FEATURE_FLAGS;

export function isElectionFeatureEnabled(flag: ElectionFeatureFlag): boolean {
  return ELECTION_FEATURE_FLAGS[flag];
}
