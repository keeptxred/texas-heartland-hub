type Props = {
  placement: "top" | "in-content" | "footer" | "banner";
  label?: string;
};

/**
 * Reserved insertion point for future manually configured ad units.
 *
 * Keep this visually empty until a real ad unit is configured. AdSense Auto
 * Ads are bootstrapped at the document level on eligible routes, so rendering
 * placeholder copy here adds no monetization value and can make editorial or
 * noindex pages look unfinished during publisher-quality review.
 */
export function AdSlot(_: Props) {
  return null;
}
