import fs from 'node:fs';

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node scripts/news/validate-daily-news-migration.mjs <migration.sql> [...]');
  process.exit(2);
}

let failed = false;

for (const file of files) {
  const sql = fs.readFileSync(file, 'utf8');
  const isInsert = /INSERT\s+INTO\s+public\.daily_articles/i.test(sql);
  const isUpdate = /UPDATE\s+public\.daily_articles/i.test(sql);
  if (!isInsert && !isUpdate) continue;

  const errors = [];
  const isBulkImageRemediation = /^\s*--\s*BULK_IMAGE_REMEDIATION\s*$/im.test(sql);
  const isBulkCategoryReclassification = /^\s*--\s*BULK_CATEGORY_RECLASSIFICATION\s*$/im.test(sql);
  const isBulkContentStructureRemediation = /^\s*--\s*BULK_CONTENT_STRUCTURE_REMEDIATION\s*$/im.test(sql);
  const isBulkArticleMaintenance = /^\s*--\s*BULK_ARTICLE_MAINTENANCE\s*$/im.test(sql);

  if (isInsert) {
    if (!/SELECT\s+slug\s*,\s*'\/news\/'\s*\|\|\s*slug/i.test(sql)) {
      errors.push("internal_url must be generated as '/news/' || slug");
    }
    const hasBuiltBodyShape = /jsonb_build_object\s*\([\s\S]*?'(?:intro|sections)'\s*,/i.test(sql);
    const hasLiteralBodyShape = /\{[\s\S]*?"(?:intro|sections)"\s*:/i.test(sql) && /::\s*jsonb/i.test(sql);
    if (!hasBuiltBodyShape && !hasLiteralBodyShape) {
      errors.push("body_json must include an 'intro' or 'sections' field accepted by daily_articles_require_body");
    }
    const packsWholeBodyIntoOneParagraph =
      /['"]paragraphs['"]\s*,\s*jsonb_build_array\s*\(\s*body\s*\)/i.test(sql) ||
      /jsonb_build_array\s*\(\s*body\s*\)[\s\S]{0,300}?body_json/i.test(sql);
    if (packsWholeBodyIntoOneParagraph) {
      errors.push('body_json may not pack the complete article body into one paragraph; store separate intro/section paragraph array items with editorial headings');
    }
    if (!/ON\s+CONFLICT\s*\(\s*slug\s*\)\s+DO\s+UPDATE/i.test(sql)) {
      errors.push('daily news publication migrations must be idempotent with ON CONFLICT (slug) DO UPDATE');
    }
  }

  if (isBulkImageRemediation) {
    const safelyScoped = isUpdate && /WHERE[\s\S]*?author\s*=\s*'Keep TX Red Newsroom'/i.test(sql) && /published_at\s*>=/i.test(sql) && /featured_image_url[\s\S]*?images\/news\/generated/i.test(sql);
    if (!safelyScoped) errors.push('BULK_IMAGE_REMEDIATION updates must be narrowly scoped to Keep TX Red Newsroom rows, a publication date floor, and generated news-image paths');
  }

  if (isBulkCategoryReclassification) {
    const safelyScoped = isUpdate && !isInsert && /SET\s+category\s*=/i.test(sql) && /FROM\s+public\.article_pillar_assignments/i.test(sql) && /a\.article_slug\s*=\s*d\.slug/i.test(sql) && /legacy_article_category_for_pillar/i.test(sql) && /category\s+IS\s+DISTINCT\s+FROM/i.test(sql);
    if (!safelyScoped) errors.push('BULK_CATEGORY_RECLASSIFICATION updates must only sync daily_articles.category from article_pillar_assignments with an idempotent distinct-value guard');
  }

  if (isBulkContentStructureRemediation) {
    const safelyScoped = isUpdate && !isInsert && /SET\s+body_json\s*=/i.test(sql) && /jsonb_array_length\s*\(\s*body_json->'sections'\s*\)\s*=\s*1/i.test(sql) && /body_json->'sections'->0->>'heading'/i.test(sql) && /jsonb_array_length\s*\(\s*body_json->'sections'->0->'paragraphs'\s*\)\s*=\s*1/i.test(sql) && /WHERE\s+slug\s*=\s*'20\d{2}-\d{2}-\d{2}-[a-z0-9-]+'/i.test(sql);
    if (!safelyScoped) errors.push('BULK_CONTENT_STRUCTURE_REMEDIATION must only update body_json, target the legacy single-section/single-paragraph shape, and include an explicitly scoped dated article repair');
  }

  if (isBulkArticleMaintenance) {
    const explicitDatedScope = /WHERE[\s\S]*?(?:[a-z_]+\.)?slug\s*=\s*'20\d{2}-\d{2}-\d{2}-[a-z0-9-]+'/i.test(sql);
    const guardedLegacyScope = /category\s*=\s*'Non-Political'/i.test(sql) && /quality_flags/i.test(sql) && /target_site/i.test(sql);
    const guardedRestoredThinScope =
      /legacy_url_restored/i.test(sql) &&
      /legacy_thin_content/i.test(sql) &&
      /SET\s+quality_flags\s*=/i.test(sql) &&
      /FROM\s+legacy_word_counts\s+wc/i.test(sql) &&
      /WHERE\s+d\.slug\s*=\s*wc\.slug/i.test(sql) &&
      /wc\.words\s*<\s*500/i.test(sql);
    const safelyScoped = isUpdate && !isInsert && /WHERE/i.test(sql) && (explicitDatedScope || guardedLegacyScope || guardedRestoredThinScope);
    if (!safelyScoped) errors.push('BULK_ARTICLE_MAINTENANCE must be update-only and narrowly scoped by an explicit dated slug, a guarded legacy category/quality/site-boundary predicate, or the restored-legacy <500-word quarantine contract');
  }

  const contentOnlyRemediation = isBulkCategoryReclassification || isBulkContentStructureRemediation || isBulkArticleMaintenance;
  if (!contentOnlyRemediation && (!/featured_image_url/i.test(sql) || !/image_alt_text/i.test(sql))) {
    errors.push('published article image changes must include featured_image_url and image_alt_text');
  }

  const imageRefs = [...sql.matchAll(/(?:https:\/\/|\/images\/news\/)[^'$\s)]+/gi)].map((match) => match[0]);
  if (imageRefs.some((ref) => /\.svg(?:\b|\?|#|&)/i.test(ref))) errors.push('SVG hero images are not allowed for published news; use a real raster photograph or photorealistic editorial image');
  if (/image\/svg\+xml/i.test(sql)) errors.push('SVG image content types are not allowed for published news');
  if (/(?:editorial\s+illustration|vector\s+illustration|generic\s+illustration|placeholder\s+image)/i.test(sql)) errors.push('placeholder/vector/illustration hero imagery is not allowed for published news');

  const valuesSlugs = [...sql.matchAll(/\('((?:live-)?(?:20\d{2}-\d{2}-\d{2})-[a-z0-9-]+)'\s*,/g)].map((match) => match[1]);
  const selectSlugs = [...sql.matchAll(/SELECT\s+'((?:live-)?(?:20\d{2}-\d{2}-\d{2})-[a-z0-9-]+)'\s*::\s*text\s+slug\b/gi)].map((match) => match[1]);
  const dollarSlugs = [...sql.matchAll(/SELECT\s+\$slug\$((?:live-)?(?:20\d{2}-\d{2}-\d{2})-[a-z0-9-]+)\$slug\$\s*::\s*text\s+slug\b/gi)].map((match) => match[1]);
  const whereSlugs = [...sql.matchAll(/WHERE\s+(?:[a-z_]+\.)?slug\s*=\s*'((?:live-)?(?:20\d{2}-\d{2}-\d{2})-[a-z0-9-]+)'/gi)].map((match) => match[1]);
  const slugs = [...valuesSlugs, ...selectSlugs, ...dollarSlugs, ...whereSlugs];
  if (!slugs.length && !isBulkImageRemediation && !isBulkCategoryReclassification && !isBulkContentStructureRemediation && !isBulkArticleMaintenance) errors.push('could not find any dated article slugs in the publication input');
  if (new Set(slugs).size !== slugs.length) errors.push('duplicate article slug found in migration');

  if (errors.length) {
    failed = true;
    console.error(`\n${file}: INVALID`);
    for (const error of errors) console.error(`  - ${error}`);
  } else {
    const detail = isBulkImageRemediation ? 'bulk image remediation' : isBulkCategoryReclassification ? 'bulk category reclassification' : isBulkContentStructureRemediation ? 'bulk content structure remediation' : isBulkArticleMaintenance ? 'scoped article maintenance' : `${slugs.length} article slug${slugs.length === 1 ? '' : 's'}`;
    console.log(`${file}: valid (${detail})`);
  }
}

if (failed) process.exit(1);
