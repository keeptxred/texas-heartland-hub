import { createServerFn } from "@tanstack/react-start";

/**
 * Lookup only published/verified poll head fields on the server, keeping the
 * full published polling dataset in the existing election repository.
 */
export const getPollRouteMetadata = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => ({
    slug: String(input.slug ?? "").trim().slice(0, 180),
  }))
  .handler(async ({ data }) => {
    const { default: polls } = await import("@/data/elections/2026/polls.json");
    const record = polls.find((item) =>
      item.slug === data.slug &&
      item.publicationStatus === "published" &&
      item.verificationStatus === "verified"
    );
    if (!record) return null;
    return {
      title: "title" in record && typeof record.title === "string" ? record.title : null,
      pollsterName: "pollsterName" in record && typeof record.pollsterName === "string" ? record.pollsterName : null,
      description: "description" in record && typeof record.description === "string" ? record.description : null,
    };
  });
