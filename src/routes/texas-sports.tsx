import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * TexasDefined owns Texas sports discovery and evergreen sports coverage.
 * KeepTXRed permanently redirects this retired route tree so historical links
 * consolidate on the current topical owner instead of leaving a competing
 * noindex surface behind.
 */
export const Route = createFileRoute("/texas-sports")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/sports${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
