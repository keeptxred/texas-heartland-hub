import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { renderUrlset, xmlResponse } from "@/lib/sitemap-shared";

/** Withdraw all public Election Central URLs from previously submitted sitemaps. */
export const Route = createFileRoute("/sitemap-elections.xml")({
  server: {
    handlers: {
      GET: () => xmlResponse(renderUrlset([])),
    },
  },
});
