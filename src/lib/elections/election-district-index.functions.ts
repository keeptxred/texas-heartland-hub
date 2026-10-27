import { createServerFn } from "@tanstack/react-start";

/** Serialized public-only district race navigation and schema metadata. */
export const getVerifiedDistrictRaceDirectory = createServerFn({ method: "GET" })
  .handler(async () => {
    const { default: races } = await import("@/data/elections/2026/races.json");
    return races
      .filter((race) => race.publicationStatus === "published" && race.verificationStatus === "verified")
      .map((race) => ({
        slug: race.slug,
        name: race.name,
        jurisdictionType: race.jurisdictionType,
        districtNumber: race.districtNumber,
      }));
  });
