import fs from 'node:fs';

const path = 'src/lib/evergreen.functions.ts';
let source = fs.readFileSync(path, 'utf8');

const importAnchor = 'import { hasSeoDuplicateFlag, selectCanonicalArticles } from "@/lib/article-canonical";';
const fallbackImport = 'import { getChatNewsFallbackBySlug } from "@/lib/chat-news-fallback";';
if (!source.includes(fallbackImport)) {
  if (!source.includes(importAnchor)) throw new Error('Import anchor not found');
  source = source.replace(importAnchor, `${importAnchor}\n${fallbackImport}`);
}

const start = '  .handler(async ({ data }): Promise<EvergreenArticle | null> => {\n    const supabase = client();\n    if (!supabase) return null;';
const startReplacement = '  .handler(async ({ data }): Promise<EvergreenArticle | null> => {\n    const fallback = getChatNewsFallbackBySlug(data.slug) as EvergreenArticle | null;\n    const supabase = client();\n    if (!supabase) return fallback;';
if (source.includes(start)) source = source.replace(start, startReplacement);
else if (!source.includes('const fallback = getChatNewsFallbackBySlug(data.slug)')) throw new Error('Handler start anchor not found');

const queryFailure = '    if (error || !row) return null;';
if (source.includes(queryFailure)) source = source.replace(queryFailure, '    if (error || !row) return fallback;');

const bodyFailure = '    if (!rawBody) return null;';
if (source.includes(bodyFailure)) source = source.replace(bodyFailure, '    if (!rawBody) return fallback;');

const lengthFailure = '    if (!meetsArticleMainWordCount(row.kind, body)) return null;';
if (source.includes(lengthFailure)) source = source.replace(lengthFailure, '    if (!meetsArticleMainWordCount(row.kind, body)) return fallback;');

fs.writeFileSync(path, source);
