import { Route as civicToolsRoute } from "@/routes/civic-tools";
import { Route as dataRoute } from "@/routes/data";
import { Route as texasCaseRoute } from "@/routes/texas-case";
import { Route as texasGovernmentAgenciesRoute } from "@/routes/texas-government.agencies";

const patchedRoutes = new WeakSet<object>();

/**
 * Dot-named child routes make these index pages participate as TanStack parent
 * matches. Their own SEO head belongs only on the parent index URL; descendants
 * must render only the child head so submitted child URLs have one self-canonical.
 */
function makeHeadLeafOnly(route: any) {
  if (patchedRoutes.has(route)) return;
  const originalHead = route.options.head as ((context: any) => unknown) | undefined;
  if (!originalHead) return;

  route.update({
    head: (context: any) => {
      const leafMatch = context.matches.at(-1);
      if (!leafMatch || leafMatch.id !== context.match.id) return {};
      return originalHead(context);
    },
  });

  patchedRoutes.add(route);
}

const LEAF_ONLY_PARENT_HEAD_ROUTES = [
  civicToolsRoute,
  dataRoute,
  texasCaseRoute,
  texasGovernmentAgenciesRoute,
] as const;

export function applyLeafOnlyParentHeadFixes() {
  for (const route of LEAF_ONLY_PARENT_HEAD_ROUTES) makeHeadLeafOnly(route);
}
