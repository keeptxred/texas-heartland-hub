import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * TexasDefined owns relocation, driver-service and DMV visitor guidance.
 * KeepTXRed permanently consolidates the retired /dmv route tree there so
 * historical links do not compete with the current topical owner.
 */
export const Route = createFileRoute("/dmv")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/texas-dmv${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
