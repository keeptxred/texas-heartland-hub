import { supabase } from '@/integrations/supabase/client';
import { getBillRelations } from '@/lib/bills';

const db = supabase as any;

/**
 * Public bill pages may expose only approved editorial relationships.
 * Official sponsors, actions, committees, and documents continue to use the
 * established bill relation loader; subjects and articles are replaced with
 * approved-only queries here.
 */
export async function getPublicBillRelations(billId: string) {
  const base = await getBillRelations(billId);

  const safe = async (label: string, build: () => any) => {
    try {
      const { data, error } = await build();
      if (error) {
        console.error(`getPublicBillRelations(${label}) failed for bill ${billId}:`, error.message ?? error);
        return [];
      }
      return data ?? [];
    } catch (error: any) {
      console.error(`getPublicBillRelations(${label}) threw for bill ${billId}:`, error?.message ?? error);
      return [];
    }
  };

  const [subjectRows, articleRows] = await Promise.all([
    safe('subjects', () =>
      db
        .from('bill_subject_relationships')
        .select('bill_subjects(*)')
        .eq('bill_id', billId)
        .eq('review_status', 'approved'),
    ),
    safe('articles', () =>
      db
        .from('bill_article_relationships')
        .select('relationship_type,confidence,is_manual,daily_articles(id,title,slug,dek,published_at,image_url)')
        .eq('bill_id', billId)
        .eq('review_status', 'approved')
        .order('is_manual', { ascending: false })
        .order('confidence', { ascending: false })
        .limit(8),
    ),
  ]);

  return {
    ...base,
    subjects: subjectRows.map((row: any) => row.bill_subjects).filter(Boolean),
    articles: articleRows
      .map((row: any) =>
        row.daily_articles
          ? {
              ...row.daily_articles,
              excerpt: row.daily_articles.dek,
              relationship_type: row.relationship_type,
            }
          : null,
      )
      .filter((row: any) => row?.id),
  };
}
