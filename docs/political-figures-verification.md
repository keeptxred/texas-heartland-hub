# Political figure verification gates

Before merge, this authority-cluster change should pass the repository's existing required `verify` check. The new collection-specific Vitest coverage additionally verifies:

1. the canonical requested target list contains exactly 100 names;
2. all 100 names resolve to a profile;
3. the exact public 100-leader collection contains 100 profiles;
4. canonical slugs are unique;
5. each requested profile has substantive body copy and internal links; and
6. the source-list `Jimmy Blacklock` variant resolves to canonical `James Blacklock` with `James D. Blacklock` retained as an alternate name.

No publication automation, Supabase configuration, election publication guard, branch protection, or existing SEO gate is disabled by this work.
