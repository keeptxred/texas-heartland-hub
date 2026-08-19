import { TEXAS_CASE_POSITIONS as TEXAS_CASE_WAVE1_POSITIONS, type TexasCasePosition } from "./texas-case";
import { TEXAS_CASE_WAVE2_POSITIONS } from "./texas-case-wave2";

export const TEXAS_CASE_POSITIONS: TexasCasePosition[] = [
  ...TEXAS_CASE_WAVE1_POSITIONS,
  ...TEXAS_CASE_WAVE2_POSITIONS,
];

export function getTexasCasePosition(slug: string): TexasCasePosition | undefined {
  return TEXAS_CASE_POSITIONS.find((position) => position.slug === slug);
}
