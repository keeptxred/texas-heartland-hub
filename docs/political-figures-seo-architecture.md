# Political figure SEO architecture

The Texas political figure authority cluster uses the following architecture:

- Collection: `/texas-politics/figures`
- Canonical profiles: `/texas-politics/figures/<slug>`
- Discovery sitemap: `/sitemap-political-figures.xml`
- Parent topical hub: `/texas-politics`
- Current election facts: `/elections`
- Office powers: `/texas-government`
- Current state legislative context: `/texas-legislature`
- Durable issue context: `/texas-law-policy`

Collection SEO includes a canonical URL, index/follow directive, descriptive metadata, CollectionPage schema, ItemList schema for the exact 100-name requested collection, and BreadcrumbList schema.

Profile SEO includes a canonical URL, index/follow directive, person-specific description and keywords, ProfilePage schema, Person schema, alternate-name support, BreadcrumbList schema, category links, institutional links, and same-category related profiles.

This separation is intentional: evergreen biography pages should remain accurate when candidacy, polling, committee assignments, or officeholders change.
