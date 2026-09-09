type PublicArticleTitleSource = {
  title?: string | null;
  seo_headline?: string | null;
};

export function resolvePublicArticleDisplayTitle(article: PublicArticleTitleSource): string {
  const seoHeadline = String(article.seo_headline ?? '').trim();
  if (seoHeadline) return seoHeadline;
  return String(article.title ?? '').trim();
}
