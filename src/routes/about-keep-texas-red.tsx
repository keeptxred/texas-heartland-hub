import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy brand/about URL. The canonical newsroom/business About page is /about;
 * keep this path only as a permanent equity-preserving redirect.
 */
export const Route = createFileRoute("/about-keep-texas-red")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://keeptxred.com/about${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
