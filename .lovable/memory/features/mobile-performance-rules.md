---
name: Mobile performance rules (LCP <4s)
description: HEAD-only mobile speed rules — image lazy-load, hero preload, font/ad resource hints, non-blocking CSS
type: feature
---
# Mobile Performance Rules

Target: mobile LCP under 4 seconds. Apply HEAD-only changes — never rewrite page content or regenerate components for perf alone.

## Images
- Every `<img>` except the page's single LCP candidate MUST set `loading="lazy"`.
- The LCP image MUST be preloaded in that route's `head().links` with `rel="preload"`, `as="image"`, `fetchpriority="high"`.
- Prefer WebP/AVIF via `vite-imagetools` when adding new bundled images.

## Fonts
- Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com` (crossOrigin) in `__root.tsx`.
- Always use `&display=swap` on Google Fonts URLs to avoid invisible text.
- Preload the Google Fonts stylesheet (`rel="preload" as="style"`) before loading it.

## Resource hints (sitewide, in `__root.tsx`)
`dns-prefetch` + `preconnect` for: fonts.googleapis.com, fonts.gstatic.com, pagead2.googlesyndication.com, googleads.g.doubleclick.net, tpc.googlesyndication.com, www.googletagservices.com.

## Scripts
- AdSense and other third-party scripts MUST be `async`.
- Never add render-blocking inline scripts in `__root.tsx`.

## What NOT to do
- Do not rewrite components for perf.
- Do not inline CSS — Tailwind v4 build already trims unused rules.
- Do not set `onLoad` strings on `<link>` in TanStack `head()` — the type does not allow it.
