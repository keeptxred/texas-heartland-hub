// Keep supplier specifications and care instructions that often follow the
// marketing introduction. Merchant feeds accept up to 5,000 characters.
export function printifyDescription(value: string): string {
  const text = (value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= 5000) return text;
  return text.slice(0, 5000).replace(/\s+\S*$/, "").trim();
}
