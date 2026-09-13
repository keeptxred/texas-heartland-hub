# Texas Living Platform Architecture — Retired in KeepTXRed

This document is retained only as migration history.

## Current ownership

TexasDefined is the canonical home for Texas relocation, living-in-Texas, financial calculator, housing-cost, school/DMV, parks, destinations, road-trip, and other lifestyle utility content.

KeepTXRed is the canonical home for Texas politics, elections, legislation, government, public policy, political news, and related civic coverage.

Do not rebuild the relocation or lifestyle platform in KeepTXRed.

## Canonical TexasDefined destinations

- Moving to Texas: `https://texasdefined.com/moving-to-texas`
- Financial tools: `https://texasdefined.com/decide/financial-tools`
- Property-tax tools: `https://texasdefined.com/decide/property-taxes`
- Explore Texas: `https://texasdefined.com/explore`

Legacy KeepTXRed relocation, lifestyle, and calculator URLs should remain only where needed for one-hop permanent redirects, cross-site discovery metadata, or regression tests.

## KeepTXRed implementation rules

- Do not add indexable relocation, lifestyle, destination, parks, school-finder, DMV-finder, or consumer financial-calculator pages to KeepTXRed.
- Do not expose TexasDefined-owned tools as KeepTXRed-owned resources in shared search or registry data.
- Preserve one-hop 301 redirects from historical KeepTXRed URLs to the exact TexasDefined canonical destination.
- Keep cross-site links when contextually useful, but label and route them as TexasDefined resources.
- Retained calculation modules may exist only for regression compatibility when they are not publicly reachable or represented as KeepTXRed-owned products.
- KeepTXRed automated evergreen generation must remain policy/news focused and must not recreate TexasDefined-owned lifestyle content.

## Migration status

The former KeepTXRed Texas Living / Moving to Texas initiative has been migrated to TexasDefined. Any future relocation expansion belongs in the `keeptxred/TexasDefined` repository.
