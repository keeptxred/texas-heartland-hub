import { createFileRoute, redirect } from "@tanstack/react-router";

const TEXASDEFINED_SPORTS = "https://texasdefined.com/sports";

/**
 * TexasDefined owns routine Texas sports news, teams, leagues, and fan culture.
 * KeepTXRed retains this historical URL only as a permanent one-hop handoff.
 */
export const Route = createFileRoute("/texas-sports/topic/$topic")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `${TEXASDEFINED_SPORTS}${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
