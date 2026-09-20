import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { DMV_EVERGREEN_SITEMAP_PATHS } from "@/data/dmv-evergreen-sitemap-paths";
import { absUrl, renderUrlset, xmlResponse } from "@/lib/sitemap-shared";

export const Route = createFileRoute("/sitemap-dmv.xml")({
  server: {
    handlers: {
      GET: () => xmlResponse(renderUrlset(
        DMV_EVERGREEN_SITEMAP_PATHS.map((path) => ({ loc: absUrl(path) })),
      )),
    },
  },
});
