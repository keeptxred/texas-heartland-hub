## Action

Delete one file only: `src/routes/texas-news.index.tsx`.

## Why

The build log names exactly these two conflicting files:

```text
Error: Conflicting configuration paths were found for the following routes: "/texas-news/", "/texas-news/".
Conflicting files:
 /dev-server/src/routes/texas-news/index.tsx
 /dev-server/src/routes/texas-news.index.tsx
```

Both declare `createFileRoute("/texas-news/")`. Keeping `src/routes/texas-news/index.tsx` (the newer version with the live-articles `loader`) and removing the older `src/routes/texas-news.index.tsx` (no loader) resolves the conflict and lets the route tree regenerate, which also clears the 53 stale `dmv.*` / `vehicles.*` TypeScript errors.

## After deletion (verification steps)

1. Restart the dev server so `src/routeTree.gen.ts` regenerates with the full route set.
2. Re-run `bunx tsgo --noEmit` and confirm the 53 route-path errors are gone; fix any genuine residual errors that only surface after the tree is complete.
3. Run the production build to confirm it succeeds.

No other files are touched. No functionality or design is changed.