import { TEXAS_CASE_POSITIONS as TEXAS_CASE_WAVE1_POSITIONS, type TexasCasePosition } from "./texas-case";
import { TEXAS_CASE_WAVE2_POSITIONS } from "./texas-case-wave2";
import { TEXAS_CASE_PRIORITY_UPGRADES } from "./texas-case-priority-upgrades";

const BASE_TEXAS_CASE_POSITIONS: TexasCasePosition[] = [
  ...TEXAS_CASE_WAVE1_POSITIONS,
  ...TEXAS_CASE_WAVE2_POSITIONS,
];

export const TEXAS_CASE_POSITIONS: TexasCasePosition[] = BASE_TEXAS_CASE_POSITIONS.map((position) => {
  const upgrade = TEXAS_CASE_PRIORITY_UPGRADES[position.slug];
  if (!upgrade) return position;

  return {
    ...position,
    sections: [...position.sections, ...upgrade.sections],
    sources: [...position.sources, ...(upgrade.sources ?? [])],
  };
});

export function getTexasCasePosition(slug: string): TexasCasePosition | undefined {
  return TEXAS_CASE_POSITIONS.find((position) => position.slug === slug);
}
