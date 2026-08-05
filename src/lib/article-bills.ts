import { supabase } from '@/integrations/supabase/client';
import { canonicalBillPath } from '@/lib/bills';

const db = supabase as any;

export type ArticleBill = {
  id: string;
  bill_identifier: string;
  caption: string;
  current_status_label: string;
  became_law: boolean;
  href: string;
  relationship_type: string;
};

/**
 * Resolve only approved article-to-bill relationships. The relationship table
 * is keyed to daily_articles, so static legacy articles correctly return none
 * instead of receiving inferred bill matches.
 */
export async function getApprovedBillsForArticleSlug(slug: string): Promise<ArticleBill[]> {
  try {
    const { data: article, error: articleError } = await db
      .from('daily_articles')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (articleError || !article?.id) {
      if (articleError) console.error(`getApprovedBillsForArticleSlug article lookup failed for ${slug}:`, articleError.message ?? articleError);
      return [];
    }

    const { data, error } = await db
      .from('bill_article_relationships')
      .select('relationship_type,confidence,is_manual,bills(*)')
      .eq('article_id', article.id)
      .eq('review_status', 'approved')
      .order('is_manual', { ascending: false })
      .order('confidence', { ascending: false })
      .limit(8);

    if (error) {
      console.error(`getApprovedBillsForArticleSlug relationship lookup failed for ${slug}:`, error.message ?? error);
      return [];
    }

    return (data ?? [])
      .map((row: any) => {
        const bill = row.bills;
        if (!bill?.id || !bill?.bill_identifier) return null;
        return {
          id: bill.id,
          bill_identifier: bill.bill_identifier,
          caption: bill.caption,
          current_status_label: bill.current_status_label,
          became_law: Boolean(bill.became_law),
          href: canonicalBillPath(bill),
          relationship_type: row.relationship_type,
        } satisfies ArticleBill;
      })
      .filter((bill: ArticleBill | null): bill is ArticleBill => Boolean(bill));
  } catch (error: any) {
    console.error(`getApprovedBillsForArticleSlug threw for ${slug}:`, error?.message ?? error);
    return [];
  }
}
