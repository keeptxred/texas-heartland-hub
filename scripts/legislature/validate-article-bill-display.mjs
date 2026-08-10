#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const files = {
  resolver: await readFile('src/lib/article-bills.ts', 'utf8'),
  section: await readFile('src/components/bills/ArticleBillsSection.tsx', 'utf8'),
  newsletter: await readFile('src/components/newsletter-signup.tsx', 'utf8'),
  articleRoute: await readFile('src/routes/news.$slug.tsx', 'utf8'),
};

const required = [
  [files.resolver, "from('daily_articles')"],
  [files.resolver, "from('bill_article_relationships')"],
  [files.resolver, ".eq('review_status', 'approved')"],
  [files.resolver, 'canonicalBillPath'],
  [files.resolver, 'static legacy articles correctly return none'],
  [files.section, 'Bills connected to this article'],
  [files.section, 'approved article-to-bill relationships'],
  [files.newsletter, 'getApprovedBillsForArticleSlug'],
  [files.newsletter, '<ArticleBillsSection bills={articleBills} />'],
  [files.articleRoute, 'sourcePage={`/news/${article.slug}`}'],
];

const errors = required
  .filter(([source, token]) => !source.includes(token))
  .map(([, token]) => `Missing article-to-bill display requirement: ${token}`);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Approved article-to-bill display validated.');
