import { createServerFn } from "@tanstack/react-start";

/**
 * Project only publishable forecast head metadata from the canonical election
 * snapshot on the server. Forecast content remains in the election repository.
 * Avoid including the entire snapshot in every shared client route entry.
 */
export const getForecastRouteMetadata = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => ({
    slug: String(input.slug ?? "").trim().slice(0, 180),
  }))
  .handler(async ({ data }) => {
    const { default: forecasts } = await import("@/data/elections/2026/forecasts.json");
    const record = forecasts.find((item) =>
      item.slug === data.slug &&
      item.publicationStatus === "published" &&
      item.verificationStatus === "verified"
    );
    if (!record) return null;
    return {
      title: record.title,
      sourceName: record.sourceName,
      description: record.description,
    };
  });
