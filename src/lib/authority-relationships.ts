import { supabase } from '@/integrations/supabase/client';
import { publicBillPath } from '@/lib/bill-public-path';
import {
  isAuthorityEntityType,
  type AuthorityEntityType,
} from '@/lib/authority-entity';
import { authorityEntityPath } from '@/lib/authority-entity-paths';
import { isPublicArticleReady } from '@/lib/public-article-readiness';

const db = supabase as any;

export type AuthorityRelationshipType =
  | AuthorityEntityType
  | 'bill'
  | 'representative'
  | 'election'
  | 'government'
  | 'article'
  | 'session'
  | 'subject';

/** @deprecated Use AuthorityRelationshipType for relationship graph records. */
export type AuthorityType = AuthorityRelationshipType;

export type RelatedAuthorityItem = {
  type: AuthorityRelationshipType;
  key: string;
  relationship: string;
  score: number;
  title: string;
  description?: string | null;
  href: string;
};

const fallback = (row: any): RelatedAuthorityItem => {
  const labels: Record<AuthorityRelationshipType, string> = {
    'statewide-office': 'Statewide office',
    legislator: 'Legislator',
    candidate: 'Candidate',
    race: 'Election race',
    committee: 'Legislative committee',
    agency: 'Texas agency',
    district: 'District',
    representative: 'Representative',
    election: 'Election',
    government: 'Texas government',
    session: 'Legislative session',
    subject: 'Bill subject',
    article: 'Related news',
    bill: 'Related bill',
  };
  const legacyPaths: Partial<Record<AuthorityRelationshipType, string>> = {
    representative: '/representatives/',
    election: '/elections/races/',
    government: '/texas-government/',
    session: '/texas-legislature/sessions/',
    subject: '/bills/subject/',
  };
  const type = row.target_type as AuthorityRelationshipType;
  const href = isAuthorityEntityType(type)
    ? authorityEntityPath(type, row.target_key)
    : `${legacyPaths[type] || '/'}${row.target_key}`;

  return {
    type,
    key: row.target_key,
    relationship: row.relationship_type,
    score: row.score,
    title: `${labels[type] || 'Related content'}: ${row.target_key.replaceAll('-', ' ')}`,
    href,
  };
};

export async function getRelatedAuthorityContent(
  sourceType: AuthorityRelationshipType,
  sourceKey: string,
  limit = 12,
): Promise<RelatedAuthorityItem[]> {
  const { data, error } = await db.rpc('related_authority_content', {
    p_source_type: sourceType,
    p_source_key: sourceKey,
    p_limit: limit,
  });
  if (error) throw error;
  const rows = data ?? [];
  const billIds = rows
    .filter((row: any) => row.target_type === 'bill')
    .map((row: any) => row.target_key);
  const articleIds = rows
    .filter((row: any) => row.target_type === 'article')
    .map((row: any) => row.target_key);
  const [bills, articles] = await Promise.all([
    billIds.length
      ? db
          .from('bills')
          .select(
            'id,legislature_number,session_code,bill_type,bill_number,bill_identifier,caption,current_status_label',
          )
          .in('id', billIds)
      : { data: [] },
    articleIds.length
      ? db
          .from('daily_articles')
          .select('id,title,slug,dek,category,source_name,source_url,published_at,content_quality_score,body_json,quality_flags')
          .in('id', articleIds)
      : { data: [] },
  ]);
  const billMap = new Map((bills.data ?? []).map((bill: any) => [bill.id, bill]));
  const articleMap = new Map(
    (articles.data ?? [])
      .filter((article: any) => isPublicArticleReady(article))
      .map((article: any) => [article.id, article]),
  );

  return rows.flatMap((row: any): RelatedAuthorityItem[] => {
    if (row.target_type === 'bill' && billMap.has(row.target_key)) {
      const bill: any = billMap.get(row.target_key);
      return [{
        type: 'bill',
        key: row.target_key,
        relationship: row.relationship_type,
        score: row.score,
        title: `${bill.bill_identifier}: ${bill.caption}`,
        description: bill.current_status_label,
        href: publicBillPath(bill),
      }];
    }
    if (row.target_type === 'article') {
      if (!articleMap.has(row.target_key)) return [];
      const article: any = articleMap.get(row.target_key);
      return [{
        type: 'article',
        key: row.target_key,
        relationship: row.relationship_type,
        score: row.score,
        title: article.title,
        description: article.dek,
        href: `/news/${article.slug}`,
      }];
    }
    return [fallback(row)];
  });
}
