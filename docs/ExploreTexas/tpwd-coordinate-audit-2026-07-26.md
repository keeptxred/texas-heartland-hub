# Explore Texas TPWD Coordinate Audit

Audit date: 2026-07-26

Authoritative source: Texas Parks and Wildlife Department, **All Parks** directory (`https://tpwd.texas.gov/state-parks/nearby`). The TPWD table publishes the agency's official latitude and longitude for each park or park unit.

## Method

Coordinates in `src/data/explore/destinations.ts` were compared by park name against the official TPWD All Parks table. Differences below roughly 0.01 degrees were treated as rounding or minor entrance-point variation. Larger differences were flagged for correction because they can materially affect map pins, nearby sorting, radius filters, and trip routing.

## Material discrepancies

| Destination | Current latitude | Current longitude | TPWD latitude | TPWD longitude | Recommended action |
|---|---:|---:|---:|---:|---|
| Big Bend Ranch State Park | 29.470000 | -103.920000 | 29.470458 | -103.957922 | Replace with TPWD coordinates |
| Caprock Canyons State Park & Trailway | 34.411000 | -101.064000 | 34.410296 | -101.053264 | Replace with TPWD coordinates |
| Choke Canyon State Park | 28.472000 | -98.245000 | 28.465773 | -98.354195 | Replace; existing longitude is materially displaced |
| Devils River State Natural Area | 29.926000 | -100.983000 | 29.939694 | -100.970206 | Replace with TPWD coordinates |
| Devil's Sinkhole State Natural Area | 30.101000 | -100.054000 | 30.015773 | -100.208552 | Replace with TPWD-published visitor-center coordinates, or explicitly label the current point as the natural feature rather than the visitor destination |
| Enchanted Rock State Natural Area | 30.506000 | -98.819000 | 30.496033 | -98.819952 | Replace with TPWD coordinates |
| Fort Boggy State Park | 31.314000 | -95.980000 | 31.187372 | -95.976646 | Replace; existing latitude is materially displaced |
| Franklin Mountains State Park | 31.910000 | -106.490000 | 31.842388 | -106.486444 | Replace; existing latitude is materially displaced |
| Garner State Park | 29.586000 | -99.743000 | 29.598887 | -99.743981 | Replace with TPWD coordinates |
| Hueco Tanks State Park & Historic Site | 31.917000 | -106.041000 | 31.926453 | -106.042437 | Replace with TPWD coordinates |
| Lake Somerville State Park — Birch Creek Unit | 30.322000 | -96.635000 | 30.308582 | -96.634692 | Replace with TPWD unit coordinates |
| Lake Somerville State Park — Nails Creek Unit | 30.280000 | -96.660000 | 30.290719 | -96.667214 | Replace with TPWD unit coordinates |
| Lost Maples State Natural Area | 29.807000 | -99.611000 | 29.807719 | -99.570697 | Replace; existing longitude is materially displaced |
| Mission Tejas State Park | 31.532000 | -95.232000 | 31.542272 | -95.232191 | Replace with TPWD coordinates |
| Palo Pinto Mountains State Park | 32.552000 | -98.496000 | 32.535432 | -98.556552 | Replace; existing point is materially displaced |
| Powderhorn State Park | 28.470000 | -96.550000 | 28.434172 | -96.535221 | Replace with TPWD coordinates |
| Ray Roberts Lake State Park — Isle du Bois Unit | 33.368000 | -97.056000 | 33.365671 | -97.012150 | Replace with TPWD unit coordinates |
| Resaca de la Palma State Park | 25.995000 | -97.582000 | 25.996275 | -97.5712694 | Replace with TPWD coordinates |
| Tyler State Park | 32.482000 | -95.301000 | 32.482180 | -95.283396 | Replace with TPWD coordinates |

## Exact TPWD values for recently added parks

| Destination | TPWD latitude | TPWD longitude |
|---|---:|---:|
| Mustang Island State Park | 27.672162 | -97.175309 |
| Old Tunnel State Park | 30.101079 | -98.820704 |
| Palmetto State Park | 29.596906 | -97.585140 |
| Palo Duro Canyon State Park | 34.984709 | -101.701867 |
| Palo Pinto Mountains State Park | 32.535432 | -98.556552 |
| Pedernales Falls State Park | 30.308054 | -98.257649 |
| Possum Kingdom State Park | 32.873573 | -98.559331 |
| Powderhorn State Park | 28.434172 | -96.535221 |
| Purtis Creek State Park | 32.353794 | -95.993554 |
| Ray Roberts Lake State Park — Isle du Bois Unit | 33.365671 | -97.012150 |
| Ray Roberts Lake State Park — Johnson Branch Unit | 33.429802 | -97.056449 |
| Resaca de la Palma State Park | 25.996275 | -97.5712694 |
| San Angelo State Park | 31.463922 | -100.508038 |
| Sea Rim State Park | 29.675539 | -94.043525 |
| Seminole Canyon State Park & Historic Site | 29.700094 | -101.312875 |
| Sheldon Lake State Park & Environmental Learning Center | 29.857461 | -95.160029 |
| South Llano River State Park | 30.445396 | -99.804102 |
| Stephen F. Austin State Park | 29.811982 | -96.108059 |
| Tyler State Park | 32.482180 | -95.283396 |
| Village Creek State Park | 30.250499 | -94.178700 |

## Implementation guidance

Use the TPWD values as the canonical visitor-location coordinates for map pins, distance calculations, nearby results, radius filtering, and trip routing. Preserve a different coordinate only when the product intentionally maps a natural feature rather than the official visitor destination; document that exception in the destination profile.

The next data update should replace the flagged values in `src/data/explore/destinations.ts` and retain the TPWD page as the coordinate provenance source.
