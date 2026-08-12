# Citation Magnet Batches 2.16–2.19

Status: **implemented for validation**

- **2.16 — District/race lookup architecture:** `/elections/districts` now preserves every canonical district page while attaching a direct 2026 race link only when a published, verified race matches the jurisdiction type and district number. Address-specific representation remains delegated to official Texas lookup tools.
- **2.17 — Legislative voting-record reference:** `/texas-legislature/votes` exposes normalized committee vote dates, related bills, committees and stored official source links. It explicitly does not infer vote totals or individual member positions from date-only committee activity.
- **2.18 — Bill → law → agency relationships:** bill pages now expose whether the normalized official record says a bill became law, its signed/effective dates when available, and verified agencies cited in parsed official fiscal material. Fiscal-note agency citations are labeled as context and are not presented as administering-agency assignments.
- **2.19 — Election → candidate → district relationships:** race pages now include an explicit relationship map linking the verified race to attached candidate profiles and the canonical district entity when the race has a legislative/congressional district.

The relationship layer does not invent missing roll-call, administration, address-assignment or entity relationships.
