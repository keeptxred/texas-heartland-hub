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

  if (isInsert) {
    if (!/SELECT\s+slug\s*,\s*'\/news\/'\s*\|\|\s*slug/i.test(sql)) {
      errors.push("internal_url must be generated as '/news/' || slug");
    }
    const hasBuiltBodyShape = /jsonb_build_object\s*\([\s\S]*?'(?:intro|sections)'\s*,/i.test(sql);
    const hasLiteralBodyShape = /\{[\s\S]*?"(?:intro|sections)"\s*:/i.test(sql) && /::\s*jsonb/i.test(sql);
    if (!hasBuiltBodyShape && !hasLiteralBodyShape) {
      errors.push("body_json must include an 'intro' or 'sections' field accepted by daily_articles_require_body");
    }
    if (!/ON\s+CONFLICT\s*\(\s*slug\s*\)\s+DO\s+UPDATE/i.test(sql)) {
      errors.push('daily news publication migrations must be idempotent with ON CONFLICT (slug) DO UPDATE');
    }
  }

  if (isBulkImageRemediation) {
    const safelyScoped =
      isUpdate &&
      /WHERE[\s\S]*?author\s*=\s*'Keep TX Red Newsroom'/i.test(sql) &&
      /published_at\s*>=/i.test(sql) &&
      /featured_image_url[\s\S]*?images\/news\/generated/i.test(sql);
    if (!safelyScoped) {
      errors.push('BULK_IMAGE_REMEDIATION updates must be narrowly scoped to Keep TX Red Newsroom rows, a publication date floor, and generated news-image paths');
    }
  }

  if (!/featured_image_url/i.test(sql) || !/image_alt_text/i.test(sql)) {
    errors.push('published article image changes must include featured_image_url and image_alt_text');
  }

  const imageRefs = [...sql.matchAll(/(?:https:\/\/|\/images\/news\/)[^'$\s)]+/gi)].map((match) => match[0]);
  if (imageRefs.some((ref) => /\.svg(?:\b|\?|#|&)/i.test(ref))) {
    errors.push('SVG hero images are not allowed for published news; use a real raster photograph or photorealistic editorial image');
  }

  if (/image\/svg\+xml/i.test(sql)) {
    errors.push('SVG image content types are not allowed for published news');
  }

  if (/(?:editorial\s+illustration|vector\s+illustration|generic\s+illustration|placeholder\s+image)/i.test(sql)) {
    errors.push('placeholder/vector/illustration hero imagery is not allowed for published news');
  }

  const valuesSlugs = [...sql.matchAll(/\('((?:20\d{2}-\d{2}-\d{2})-[a-z0-9-]+)'\s*,/g)].map((match) => match[1]);
  const selectSlugs = [...sql.matchAll(/SELECT\s+'((?:20\d{2}-\d{2}-\d{2})-[a-z0-9-]+)'\s*::\s*text\s+slug\b/gi)].map((match) => match[1]);
  const dollarSlugs = [...sql.matchAll(/SELECT\s+\$slug\$((?:20\d{2}-\d{2}-\d{2})-[a-z0-9-]+)\$slug\$\s*::\s*text\s+slug\b/gi)].map((match) => match[1]);
  const slugs = [...valuesSlugs, ...selectSlugs, ...dollarSlugs];
  if (!slugs.length && !isBulkImageRemediation) errors.push('could not find any dated article slugs in the publication input');
  if (new Set(slugs).size !== slugs.length) errors.push('duplicate article slug found in migration');

  if (errors.length) {
    failed = true;
    console.error(`\n${file}: INVALID`);
    for (const error of errors) console.error(`  - ${error}`);
  } else {
    const detail = isBulkImageRemediation ? 'bulk image remediation' : `${slugs.length} article slug${slugs.length === 1 ? '' : 's'}`;
    console.log(`${file}: valid (${detail})`);
  }
}

if (failed) process.exit(1);
