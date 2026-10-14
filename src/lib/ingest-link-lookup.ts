/**
 * PostgREST .in('link', ...) is a GET query: RSS item URLs can contain deeply
 * nested Google News URLs and long tracking parameters. A fixed 100-link batch
 * can exceed the proxy/request-target budget and return HTTP 400.
 *
 * Bound both encoded request size and row count, so no source silently starves
 * the entire newsroom because it appears after the first 1,000 URLs.
 */
export type FeedLinkLookupBatch = { offset: number; links: string[] };
export const INGEST_EXISTING_LINK_LOOKUP_BATCH_SIZE = 20;
export const INGEST_EXISTING_LINK_QUERY_CHAR_BUDGET = 2_400;

export function partitionFeedLinkLookups(
  links: readonly string[],
  maxLinks: number = INGEST_EXISTING_LINK_LOOKUP_BATCH_SIZE,
  maxChars: number = INGEST_EXISTING_LINK_QUERY_CHAR_BUDGET,
): FeedLinkLookupBatch[] {
  if (!Number.isSafeInteger(maxLinks) || maxLinks <= 0 ||
      !Number.isSafeInteger(maxChars) || maxChars < 100) {
    throw new Error("Invalid feed-link lookup window limits");
  }
  const batches: FeedLinkLookupBatch[] = [];
  let current: string[] = [];
  let chars = 0;
  let offset = 0;
  const flush = () => {
    if (current.length) {
      batches.push({offset,links:current});
      offset += current.length;
      current = [];
      chars = 0;
    }
  };
  for (const link of links) {
    if (typeof link !== "string" || !link) throw new Error("Empty feed link cannot be looked up");
    // conservative encoded length of the .in() query including delimiters.
    const size = encodeURIComponent(link).length + 6;
    if (current.length && (current.length >= maxLinks || chars + size > maxChars)) flush();
    current.push(link);
    chars += size;
    if (current.length >= maxLinks || chars >= maxChars) flush();
  }
  flush();
  return batches;
}
