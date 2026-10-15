/**
 * Texas Defined shop shipping policy must agree with the publicly published
 * Google Merchant product feed: $6.99 standard US shipping and free shipping
 * when merchandise subtotal exceeds $35.00.
 *
 * Rates here are customer-facing policy rates, NOT Printify shipping quotes.
 */
export const TEXASDEFINED_STANDARD_SHIPPING_CENTS = 699;
export const TEXASDEFINED_FREE_SHIPPING_THRESHOLD_CENTS = 3500;

export function texasDefinedShippingCents(subtotalCents: number): number {
  if (!Number.isSafeInteger(subtotalCents) || subtotalCents <= 0) {
    throw new Error("Invalid merchandise subtotal.");
  }
  return subtotalCents > TEXASDEFINED_FREE_SHIPPING_THRESHOLD_CENTS
    ? 0
    : TEXASDEFINED_STANDARD_SHIPPING_CENTS;
}

/** Coarse diagnostic classification only; never used to reject a shopper. */
export function checkoutClientKind(userAgent: string | null): "crawler" | "automation" | "browser" | "unknown" {
  if (!userAgent) return "unknown";
  if (/(?:googlebot|bingbot|duckduckbot|gptbot|oai-searchbot|facebookexternalhit|slackbot|twitterbot|yandexbot|baiduspider)/i.test(userAgent)) return "crawler";
  if (/(?:headlesschrome|lighthouse|playwright|puppeteer|selenium|texasdefined-[^ ]*smoke)/i.test(userAgent)) return "automation";
  if (/(?:mozilla\/5\.0|chrome\/|safari\/|firefox\/)/i.test(userAgent)) return "browser";
  return "unknown";
}
