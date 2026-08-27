// TanStack Router file-route helpers used by the broken-link audit.
// Route-token syntax affects nesting/layout behavior but must not be mistaken
// for literal public URL characters.

export function normalizeRoutePart(part) {
  if (typeof part !== 'string' || !part) return null;

  // Route groups and pathless layout segments do not contribute to the URL.
  if (/^\(.+\)$/.test(part) || (part.startsWith('_') && !part.startsWith('__'))) return null;

  // A trailing underscore opts a file route out of parent nesting, but the
  // underscore itself is not part of the public pathname.
  if (part.endsWith('_')) part = part.slice(0, -1);
  return part || null;
}
