export type LinkedBillMention = {
  bill_identifier: string;
  legislature_number: number;
  bill_type: string;
  bill_number: number;
};

export type BillMentionSegment = { text: string; href?: string };

export function billMentionSegments(
  text: string,
  bills: LinkedBillMention[],
): BillMentionSegment[] {
  if (!bills.length) return [{ text }];
  const lookup = new Map(
    bills.map((bill) => [bill.bill_identifier.replace(/\s+/g, "").toUpperCase(), bill]),
  );
  const segments: BillMentionSegment[] = [];
  const pattern = /\b(HB|SB|HJR|SJR|HCR|SCR|HR|SR)\s*-?\s*(\d{1,5})\b/gi;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    const bill = lookup.get(`${match[1]}${Number(match[2])}`.toUpperCase());
    if (!bill) continue;
    if (match.index > cursor) segments.push({ text: text.slice(cursor, match.index) });
    segments.push({
      text: match[0],
      href: `/bills/texas/${bill.legislature_number}/${bill.bill_type.toLowerCase()}/${bill.bill_number}`,
    });
    cursor = pattern.lastIndex;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments.length ? segments : [{ text }];
}
