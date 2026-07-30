# Explore Texas public API

Base path: `/api/public/explore`

All responses contain published public data only. Authentication is not required for these read and recommendation endpoints. Consumers must respect cache headers and a maximum practical request rate of 60 requests per minute per client.

## `GET /entities`

Search published entities. Parameters:

- `q`: full-text query, maximum 120 characters
- `types`, `regions`, `counties`, `activities`, `amenities`: comma-separated filters, at most 20 values each
- `familyFriendly`, `petFriendly`, `accessible`: boolean filters
- `fee`: `free` or `required`
- `lat`, `lng`, `radiusKm`: Texas-bounded radius search; coordinates must be supplied together and radius is capped at 500 km
- `page`: positive integer
- `pageSize`: 1–48
- `sort`: `relevance`, `name`, or `distance`

Success returns `{ data, pagination, requestId }`. Invalid requests return HTTP 400 with `{ error: { code, message, issues, requestId } }`. Rate limiting returns HTTP 429.

Example:

```http
GET /api/public/explore/entities?q=birding&types=park,wildlife_area&page=1&pageSize=12
```

## `GET /autocomplete`

Returns up to eight ranked entity names, slugs, types, and regions. `q` is required and must contain 2–80 characters. Matching includes canonical names, alternate names, prefixes, and trigram similarity.

```http
GET /api/public/explore/autocomplete?q=guadalupe
```

## `GET /map`

Returns a compact marker payload for entities with verified coordinates. It accepts the entity search filters and caps results at 48 per request. Internal fields and entities without coordinates are excluded.

## `POST /recommendations`

Validates trip preferences and returns a deterministic itinerary with explanations. JSON bodies are capped at 16 KiB. Required fields follow the trip planner constraints: title, 1–14 days, traveler counts, booleans for pets/RV/accessibility, 1–12 interests, and 10–800 km driving tolerance.

```json
{
  "title": "Hill Country weekend",
  "region": "Hill Country",
  "days": 2,
  "adults": 2,
  "children": 0,
  "pets": false,
  "rv": false,
  "accessible": false,
  "interests": ["hiking", "history"],
  "maxDrivingKm": 200
}
```

Errors consistently use `{ "error": { "code": "...", "message": "...", "issues": {} } }` where applicable. No endpoint exposes moderation data, private source configuration, unpublished entities, or private trips.
