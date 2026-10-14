// Keep every additional photo tied to the exact offer, never another color.
export function additionalMerchantImages(primary: string, candidates: Array<string | null | undefined>, normalize: (value: string | null | undefined) => string): string[] {
  const seen = new Set([primary]);
  const images: string[] = [];
  for (const candidate of candidates) {
    const image = normalize(candidate);
    if (!image || seen.has(image)) continue;
    seen.add(image);
    images.push(image);
    if (images.length === 10) break;
  }
  return images;
}
