/** Literal router templates are not public document URLs. */
export function hasUnresolvedPublicRouteParameter(pathname: string): boolean {
  if (/^\/(?:api|admin)(?:\/|$)/i.test(pathname)) return false;
  return /(?:^|\/)(?:\$|%24)[a-z_][a-z0-9_]*(?=\/|$)/i.test(pathname);
}
