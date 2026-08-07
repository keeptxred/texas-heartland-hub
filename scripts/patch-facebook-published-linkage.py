from pathlib import Path

# One-time guarded hardening pass: resolve a published article by source URL first,
# then title, when a feed row is missing internal_slug.
path = Path('src/components/admin/ContentOpportunityPanel.tsx')
text = path.read_text()

old = '''      const slugs = feed.map((f) => f.internal_slug).filter(Boolean) as string[];\n      const links = feed.map((f) => f.link).filter(Boolean) as string[];'''
new = '''      const links = feed.map((f) => f.link).filter(Boolean) as string[];'''
if old not in text:
    raise SystemExit('unused slugs declaration not found')
text = text.replace(old, new, 1)

old = '''          .select("slug,title,featured_image_url,published_at")'''
new = '''          .select("slug,title,source_url,featured_image_url,published_at")'''
if old not in text:
    raise SystemExit('daily_articles select not found')
text = text.replace(old, new, 1)

old = '''      const articleMap = new Map<string, { slug: string; title: string; featured_image_url: string | null }>();\n      const articleTitleMap = new Map<string, { slug: string; title: string; featured_image_url: string | null }>();\n      (articlesRes.data ?? []).forEach((a) => {\n        articleMap.set(a.slug, a);\n        articleTitleMap.set(a.title.toLowerCase().trim(), a);\n      });'''
new = '''      type PublishedArticleRef = {\n        slug: string;\n        title: string;\n        source_url: string | null;\n        featured_image_url: string | null;\n      };\n      const articleMap = new Map<string, PublishedArticleRef>();\n      const articleSourceMap = new Map<string, PublishedArticleRef>();\n      const articleTitleMap = new Map<string, PublishedArticleRef>();\n      (articlesRes.data ?? []).forEach((a) => {\n        articleMap.set(a.slug, a);\n        if (a.source_url) articleSourceMap.set(a.source_url.toLowerCase().trim(), a);\n        articleTitleMap.set(a.title.toLowerCase().trim(), a);\n      });'''
if old not in text:
    raise SystemExit('article maps block not found')
text = text.replace(old, new, 1)

old = '''        const article =\n          (f.internal_slug ? articleMap.get(f.internal_slug) : null) ??\n          articleTitleMap.get(f.title.toLowerCase().trim()) ??\n          null;'''
new = '''        const article =\n          (f.internal_slug ? articleMap.get(f.internal_slug) : null) ??\n          (f.link ? articleSourceMap.get(f.link.toLowerCase().trim()) : null) ??\n          articleTitleMap.get(f.title.toLowerCase().trim()) ??\n          null;'''
if old not in text:
    raise SystemExit('article resolution block not found')
text = text.replace(old, new, 1)

path.write_text(text)
