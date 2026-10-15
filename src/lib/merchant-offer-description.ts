// Variant facts come from the same catalog options used by checkout.
export function merchantOfferDescription(description: string, color?: string, size?: string): string {
  const facts = [color?.trim() ? `Color: ${color.trim()}.` : "", size?.trim() ? `Size: ${size.trim()}.` : ""].filter(Boolean);
  const text = [...facts, description.trim()].filter(Boolean).join(" ");
  return text.length <= 5000 ? text : text.slice(0, 5000).replace(/\s+\S*$/, "").trim();
}
