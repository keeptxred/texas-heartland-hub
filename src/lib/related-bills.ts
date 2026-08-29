import { supabase } from '@/integrations/supabase/client';
import { type Bill } from '@/lib/bills';
import { publicBillPath } from '@/lib/bill-public-path';

const db = supabase as any;

export type RelatedBill = Pick<
  Bill,
  | 'id'
  | 'legislature_number'
  | 'session_code'
  | 'bill_type'
  | 'bill_number'
  | 'bill_identifier'
  | 'caption'
  | 'current_status_label'
  | 'last_action_date'
  | 'became_law'
> & {
  href: string;
  relationshipReasons: string[];
  relationshipScore: number;
};

type CandidateScore = {
  subjectMatches: number;
  sponsorMatches: number;
};

/**
 * Finds related bills from verified graph edges already stored in KeepTXRed.
 * Shared approved subjects are weighted above shared sponsors; title-keyword
 * guessing is intentionally excluded so unrelated bills are never linked by
 * wording alone.
 */
export async function getRelatedBills(
  billId: string,
  legislatureNumber: number,
  limit = 8,
): Promise<RelatedBill[]> {
  const safe = async (build: () => any) => {
    try {
      const { data, error } = await build();
      if (error) return [];
      return data ?? [];
    } catch {
      return [];
    }
  };

  const [subjectRows, sponsorRows] = await Promise.all([
    safe(() =>
      db
        .from('bill_subject_relationships')
        .select('subject_id')
        .eq('bill_id', billId)
        .eq('review_status', 'approved'),
    ),
    safe(() =>
      db
        .from('bill_sponsors')
        .select('sponsor_slug')
        .eq('bill_id', billId)
        .not('sponsor_slug', 'is', null),
    ),
  ]);

  const subjectIds = [...new Set(subjectRows.map((row: any) => row.subject_id).filter(Boolean))];
  const sponsorSlugs = [...new Set(sponsorRows.map((row: any) => row.sponsor_slug).filter(Boolean))];

  if (!subjectIds.length && !sponsorSlugs.length) return [];

  const [subjectMatches, sponsorMatches] = await Promise.all([
    subjectIds.length
      ? safe(() =>
          db
            .from('bill_subject_relationships')
            .select('bill_id,subject_id')
            .in('subject_id', subjectIds)
            .eq('review_status', 'approved')
            .neq('bill_id', billId),
        )
      : [],
    sponsorSlugs.length
      ? safe(() =>
          db
            .from('bill_sponsors')
            .select('bill_id,sponsor_slug')
            .in('sponsor_slug', sponsorSlugs)
            .neq('bill_id', billId),
        )
      : [],
  ]);

  const scores = new Map<string, CandidateScore>();
  for (const row of subjectMatches) {
    const current = scores.get(row.bill_id) ?? { subjectMatches: 0, sponsorMatches: 0 };
    current.subjectMatches += 1;
    scores.set(row.bill_id, current);
  }
  for (const row of sponsorMatches) {
    const current = scores.get(row.bill_id) ?? { subjectMatches: 0, sponsorMatches: 0 };
    current.sponsorMatches += 1;
    scores.set(row.bill_id, current);
  }

  const rankedIds = [...scores.entries()]
    .map(([id, score]) => ({
      id,
      ...score,
      weightedScore: score.subjectMatches * 3 + score.sponsorMatches,
    }))
    .sort((a, b) => b.weightedScore - a.weightedScore)
    .slice(0, Math.max(limit * 3, limit))
    .map((item) => item.id);

  if (!rankedIds.length) return [];

  const bills = await safe(() =>
    db
      .from('bills')
      .select(
        'id,legislature_number,session_code,bill_type,bill_number,bill_identifier,caption,current_status_label,last_action_date,became_law',
      )
      .in('id', rankedIds)
      .eq('legislature_number', legislatureNumber)
      .eq('is_active', true),
  );

  return bills
    .map((bill: any) => {
      const score = scores.get(bill.id)!;
      const reasons: string[] = [];
      if (score.subjectMatches) {
        reasons.push(
          `${score.subjectMatches} shared verified subject${score.subjectMatches === 1 ? '' : 's'}`,
        );
      }
      if (score.sponsorMatches) {
        reasons.push(
          `${score.sponsorMatches} shared sponsor${score.sponsorMatches === 1 ? '' : 's'}`,
        );
      }
      return {
        ...bill,
        href: publicBillPath(bill),
        relationshipReasons: reasons,
        relationshipScore: score.subjectMatches * 3 + score.sponsorMatches,
      } as RelatedBill;
    })
    .sort(
      (a: RelatedBill, b: RelatedBill) =>
        b.relationshipScore - a.relationshipScore ||
        String(b.last_action_date ?? '').localeCompare(String(a.last_action_date ?? '')),
    )
    .slice(0, limit);
}
