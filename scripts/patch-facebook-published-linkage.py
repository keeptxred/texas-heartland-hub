from pathlib import Path

path = Path('src/components/admin/ContentOpportunityPanel.tsx')
text = path.read_text()

old = '''      const [articlesRes, reelsRes] = await Promise.all([\n        slugs.length > 0\n          ? supabase\n              .from("daily_articles")\n              .select("slug,title,featured_image_url")\n              .in("slug", slugs)\n          : Promise.resolve({ data: [] as { slug: string; title: string; featured_image_url: string | null }[] }),'''
new = '''      const [articlesRes, reelsRes] = await Promise.all([\n        // Load a recent published-article window instead of only rows whose feed\n        // item already has internal_slug populated. Older/manual publication paths\n        // can leave texas_news_feed.internal_slug null even though daily_articles\n        // contains the finished story. Title matching below repairs that linkage in\n        // the admin UI so Facebook can use the real KeepTXRed slug/URL/image.\n        supabase\n          .from("daily_articles")\n          .select("slug,title,featured_image_url,published_at")\n          .order("published_at", { ascending: false })\n          .limit(750),'''
if old not in text:
    raise SystemExit('articles query block not found')
text = text.replace(old, new, 1)

old = '''      const articleMap = new Map<string, { title: string; featured_image_url: string | null }>();\n      (articlesRes.data ?? []).forEach((a) => articleMap.set(a.slug, a));'''
new = '''      const articleMap = new Map<string, { slug: string; title: string; featured_image_url: string | null }>();\n      const articleTitleMap = new Map<string, { slug: string; title: string; featured_image_url: string | null }>();\n      (articlesRes.data ?? []).forEach((a) => {\n        articleMap.set(a.slug, a);\n        articleTitleMap.set(a.title.toLowerCase().trim(), a);\n      });'''
if old not in text:
    raise SystemExit('article map block not found')
text = text.replace(old, new, 1)

old = '''      const statusMap: Record<number, OpportunityStatus> = {};\n      feed.forEach((f) => {\n        const article = f.internal_slug ? articleMap.get(f.internal_slug) : null;\n        if (f.id < 0) {'''
new = '''      const statusMap: Record<number, OpportunityStatus> = {};\n      feed.forEach((f) => {\n        const article =\n          (f.internal_slug ? articleMap.get(f.internal_slug) : null) ??\n          articleTitleMap.get(f.title.toLowerCase().trim()) ??\n          null;\n\n        // Repair the client-side publication linkage when the article exists but\n        // the feed row's internal_slug was never backfilled. quickPost and image\n        // generation can then use the canonical KeepTXRed article instead of\n        // incorrectly disabling Facebook.\n        if (f.id > 0 && article && !f.internal_slug) {\n          f.internal_slug = article.slug;\n          f.article_slug = article.slug;\n          f.article_url = `https://keeptxred.com/news/${article.slug}`;\n          f.article_asset_url = article.featured_image_url;\n        }\n\n        if (f.id < 0) {'''
if old not in text:
    raise SystemExit('status map block not found')
text = text.replace(old, new, 1)

path.write_text(text)
