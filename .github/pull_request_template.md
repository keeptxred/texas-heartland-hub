## Summary

Describe the user-visible change and the underlying cause.

## Verification

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] Added or updated a regression test for the reported bug
- [ ] Reviewed the final diff for unrelated file replacement
- [ ] Database schema and generated Supabase types remain synchronized

## Risk review

- [ ] Shared rules have one implementation rather than duplicated thresholds
- [ ] UI labels and server gates use the same calculated values
- [ ] No new `any` or `never` casts were added without an explanation
- [ ] Existing URLs, routes, and published content remain intact

## Deployment notes

List migrations, environment variables, cache invalidation, or manual follow-up steps. Write `None` when no deployment action is required.
