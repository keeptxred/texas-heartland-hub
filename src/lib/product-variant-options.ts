export type ParsedProductVariantOptions = {
  color: string | null;
  size: string | null;
};

const STANDARD_SIZE_RE = /^(?:XXS|XS|S|M|L|XL|2XL|XXL|3XL|XXXL|4XL|XXXXL|5XL|6XL|OS|OSFA|OSFM)$/i;
const ONE_SIZE_RE = /^ONE\s*SIZE(?:\s*FITS\s*(?:ALL|MOST))?$/i;
const VOLUME_SIZE_RE = /^\d+(?:\.\d+)?\s*(?:FL\s*)?(?:OZ|ML|L|QT|GAL)$/i;
const DIMENSION_SIZE_RE = /^\d+(?:\.\d+)?\s*(?:IN(?:CH(?:ES)?)?|CM|MM|["″])?\s*[X×]\s*\d+(?:\.\d+)?\s*(?:IN(?:CH(?:ES)?)?|CM|MM|["″])?$/i;

export function isProductSizeOption(value: string | null | undefined): boolean {
  const option = value?.trim();
  if (!option) return false;
  return (
    STANDARD_SIZE_RE.test(option) ||
    ONE_SIZE_RE.test(option) ||
    VOLUME_SIZE_RE.test(option) ||
    DIMENSION_SIZE_RE.test(option)
  );
}

export function splitProductVariantTitle(title: string | null | undefined): string[] {
  return String(title ?? "")
    .split(/\s*\/\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function parseProductVariantOptions(
  title: string | null | undefined,
  legacyColor?: string | null,
): ParsedProductVariantOptions {
  const parts = splitProductVariantTitle(title);
  const size = parts.find((part) => isProductSizeOption(part)) ?? null;
  let color = parts.find((part) => part !== size && !isProductSizeOption(part)) ?? null;

  const fallbackColor = legacyColor?.trim() || null;
  if (!color && fallbackColor && !isProductSizeOption(fallbackColor)) {
    color = fallbackColor;
  }

  if (!size && parts.length >= 2) {
    const fallbackSize = parts.find((part) => part !== color) ?? null;
    return { color, size: fallbackSize };
  }

  return { color, size };
}
