import { supabase } from '@/integrations/supabase/client';
import { findRepresentativeBySlug } from '@/data/representatives';
import { getBillRelations } from '@/lib/bills';
import { resolvePublicArticleDisplayTitle } from '@/lib/public-article-display-title';

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
  const base = await getBillRelations(billId, { includeEditorialRelations: false });

  const safe = async (label: string, build: () => any) => {
    // These are read-only public relationships. Retry one failed request, not
    // every legitimate empty response, to avoid dropping verified editorial
    // crosslinks during a transient PostgREST/edge transport failure.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const { data, error } = await build();
        if (!error) return data ?? [];
        if (attempt === 1) {
          console.error(`getPublicBillRelations(${label}) failed for bill ${billId}:`, error.message ?? error);
        }
      } catch (error: any) {
        if (attempt === 1) {
          console.error(`getPublicBillRelations(${label}) threw for bill ${billId}:`, error?.message ?? error);
        }
      }
    }
    return [];
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
        .select('article_id,review_status,relationship_type,confidence,is_manual,daily_articles(id,title,seo_headline,slug,dek,published_at,image_url)')
        .eq('bill_id', billId)
        .eq('review_status', 'approved')
        .order('is_manual', { ascending: false })
        .order('confidence', { ascending: false })
        .limit(8),
    ),
  ]);

  // The relationship's declared article_id FK lets PostgREST return the
  // published article in the same public, approved-only read. This avoids a
  // second independent lookup failing after an approved relation was fetched.
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
      .filter((row: any) => row?.review_status === 'approved')
      .map((row: any) => {
        const nested = row.daily_articles;
        const article = Array.isArray(nested) ? nested[0] : nested;
        return article?.id && article?.slug
          ? {
              ...article,
              title: resolvePublicArticleDisplayTitle(article),
              excerpt: article.dek,
              relationship_type: row.relationship_type,
            }
          : null;
      })
      .filter((row: any) => row?.id),
  };
}
