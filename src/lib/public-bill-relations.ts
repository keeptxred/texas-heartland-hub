import { supabase } from '@/integrations/supabase/client';
import { findRepresentativeBySlug } from '@/data/representatives';
import { getBillRelations } from '@/lib/bills';

const db = supabase as any;

/**
 * Public bill pages may expose only approved editorial relationships.
 * Official sponsors, actions, committees, and documents continue to use the
 * established bill relation loader; subjects and articles are replaced with
 * approved-only queries here. Sponsor identity data is preserved, but a public
 * representative-profile link is exposed only when the slug resolves to the
 * verified representative directory.
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

  const [subjectRows, articleRelationshipRows] = await Promise.all([
    safe('subjects', () =>
      db
        .from('bill_subject_relationships')
        .select('bill_subjects(*)')
        .eq('bill_id', billId)
        .eq('review_status', 'approved'),
    ),
    safe('article relationships', () =>
      db
        .from('bill_article_relationships')
        .select('article_id,relationship_type,confidence,is_manual')
        .eq('bill_id', billId)
        .eq('review_status', 'approved')
        .order('is_manual', { ascending: false })
        .order('confidence', { ascending: false })
        .limit(8),
    ),
  ]);

  const articleIds = [...new Set(
    articleRelationshipRows
      .map((row: any) => String(row.article_id ?? '').trim())
      .filter(Boolean),
  )];

  const articleRows = articleIds.length
    ? await safe('articles', () =>
        db
          .from('daily_articles')
          .select('id,title,slug,dek,published_at,image_url')
          .in('id', articleIds),
      )
    : [];

  const articleById = new Map<string, any>(
    articleRows.map((article: any) => [String(article.id), article] as [string, any]),
  );

  const sponsors = (base.sponsors ?? []).map((sponsor: any) => {
    const slug = String(sponsor.sponsor_slug ?? '').trim();
    if (!slug || findRepresentativeBySlug(slug)) return sponsor;
    return { ...sponsor, sponsor_slug: null };
  });

  return {
    ...base,
    sponsors,
    subjects: subjectRows.map((row: any) => row.bill_subjects).filter(Boolean),
    articles: articleRelationshipRows
      .map((row: any) => {
        const article = articleById.get(String(row.article_id));
        return article
          ? {
              ...article,
              excerpt: article.dek,
              relationship_type: row.relationship_type,
            }
          : null;
      })
      .filter((row: any) => row?.id),
  };
}
