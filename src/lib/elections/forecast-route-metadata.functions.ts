import { createServerFn } from "@tanstack/react-start";

/**
 * Full election forecasts stay on the server for route head/canonical checks.
 * The existing lazily rendered forecast component uses its normal repository.
 */
export const getPublishedForecastRouteMetadata = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => ({
    slug: String(input.slug ?? "").trim().slice(0, 180),
  }))
  .handler(async ({ data }) => {
    const { default: forecasts } = await import("@/data/elections/2026/forecasts.json");
    const record = forecasts.find((entry) =>
      entry.slug === data.slug &&
      entry.publicationStatus === "published" &&
      entry.verificationStatus === "verified"
    );
    return record ? {
      title: record.title,
      sourceName: record.sourceName,
      description: record.description,
    } : null;
  });
