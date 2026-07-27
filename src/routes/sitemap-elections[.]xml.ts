import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildElectionSitemapEntries } from "@/lib/elections/sitemap";
import { renderUrlset, xmlResponse } from "@/lib/sitemap-shared";

export const Route = createFileRoute("/sitemap-elections.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = buildElectionSitemapEntries();
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});
