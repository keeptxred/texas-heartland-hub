const MIGRATED_TOOL_CANONICALS: Record<string, string> = {
  "/texas-refinance-calculator": "https://texasdefined.com/texas-refinance-savings-calculator",
  "/tools/home-affordability-calculator": "https://texasdefined.com/texas-home-affordability-calculator",
  "/tools/home-insurance-calculator": "https://texasdefined.com/texas-home-insurance-calculator",
  "/tools/mortgage-calculator": "https://texasdefined.com/texas-mortgage-calculator",
  "/texas-property-tax-calculator": "https://texasdefined.com/decide/property-taxes",
  "/tools/property-tax-calculator": "https://texasdefined.com/decide/property-taxes",
  "/tools/closing-cost-calculator": "https://texasdefined.com/texas-closing-cost-calculator",
  "/tools/texas-utilities-calculator": "https://texasdefined.com/texas-utility-cost-calculator",
  "/texas-home-ownership-cost-calculator": "https://texasdefined.com/texas-homeownership-cost-calculator",
  "/texas-mortgage-qualification-calculator": "https://texasdefined.com/texas-home-affordability-calculator",
  "/texas-heloc-calculator": "https://texasdefined.com/texas-home-equity-calculator",
  "/moving-checklist": "https://texasdefined.com/moving-to-texas",
};

function splitHrefSuffix(href: string) {
  const query = href.indexOf("?");
  const hash = href.indexOf("#");
  const positions = [query, hash].filter((position) => position >= 0);
  const suffixStart = positions.length ? Math.min(...positions) : -1;
  return suffixStart < 0
    ? { pathname: href, suffix: "" }
    : { pathname: href.slice(0, suffixStart), suffix: href.slice(suffixStart) };
}

export function canonicalMigratedToolHref(href: string) {
  if (!href.startsWith("/")) return href;
  const { pathname, suffix } = splitHrefSuffix(href);
  const canonical = MIGRATED_TOOL_CANONICALS[pathname];
  return canonical ? `${canonical}${suffix}` : href;
}

export function canonicalizeMigratedToolMarkdownLinks(text: string) {
  return text.replace(/\]\((\/[^)]+)\)/g, (match, href: string) => {
    const canonical = canonicalMigratedToolHref(href);
    return canonical === href ? match : `](${canonical})`;
  });
}
