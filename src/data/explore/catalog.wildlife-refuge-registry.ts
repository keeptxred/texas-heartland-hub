export type WildlifeRefugeNameRecord = {
  canonicalName: string;
  aliases: readonly string[];
};

export const wildlifeRefugeNameRegistry: readonly WildlifeRefugeNameRecord[] = [
  {
    canonicalName: "Jocelyn Nungaray National Wildlife Refuge",
    aliases: ["Anahuac National Wildlife Refuge", "Anahuac NWR", "Jocelyn Nungaray NWR"],
  },
  {
    canonicalName: "McFaddin National Wildlife Refuge",
    aliases: ["McFaddin NWR"],
  },
  {
    canonicalName: "Texas Point National Wildlife Refuge",
    aliases: ["Texas Point NWR"],
  },
  {
    canonicalName: "Moody National Wildlife Refuge",
    aliases: ["Moody NWR"],
  },
  {
    canonicalName: "Brazoria National Wildlife Refuge",
    aliases: ["Brazoria NWR"],
  },
  {
    canonicalName: "San Bernard National Wildlife Refuge",
    aliases: ["San Bernard NWR"],
  },
  {
    canonicalName: "Big Boggy National Wildlife Refuge",
    aliases: ["Big Boggy NWR"],
  },
  {
    canonicalName: "Matagorda Island National Wildlife Refuge",
    aliases: ["Matagorda Island NWR", "Matagorda Island Unit of Aransas National Wildlife Refuge"],
  },
  {
    canonicalName: "Laguna Atascosa National Wildlife Refuge",
    aliases: ["Laguna Atascosa NWR"],
  },
  {
    canonicalName: "Lower Rio Grande Valley National Wildlife Refuge",
    aliases: ["Lower Rio Grande Valley NWR"],
  },
  {
    canonicalName: "Santa Ana National Wildlife Refuge",
    aliases: ["Santa Ana NWR"],
  },
  {
    canonicalName: "Aransas National Wildlife Refuge",
    aliases: ["Aransas NWR"],
  },
  {
    canonicalName: "Hagerman National Wildlife Refuge",
    aliases: ["Hagerman NWR"],
  },
  {
    canonicalName: "Attwater Prairie Chicken National Wildlife Refuge",
    aliases: ["Attwater's Prairie-Chicken National Wildlife Refuge", "Attwater Prairie Chicken NWR"],
  },
  {
    canonicalName: "Balcones Canyonlands National Wildlife Refuge",
    aliases: ["Balcones Canyonlands NWR"],
  },
  {
    canonicalName: "Caddo Lake National Wildlife Refuge",
    aliases: ["Caddo Lake NWR"],
  },
  {
    canonicalName: "Muleshoe National Wildlife Refuge",
    aliases: ["Muleshoe NWR"],
  },
  {
    canonicalName: "Buffalo Lake National Wildlife Refuge",
    aliases: ["Buffalo Lake NWR"],
  },
  {
    canonicalName: "Trinity River National Wildlife Refuge",
    aliases: ["Trinity River NWR"],
  },
  {
    canonicalName: "Neches River National Wildlife Refuge",
    aliases: ["Neches River NWR"],
  },
] as const;

const normalizeRefugeName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const canonicalNameByNormalizedName = new Map<string, string>();

for (const record of wildlifeRefugeNameRegistry) {
  for (const name of [record.canonicalName, ...record.aliases]) {
    const normalizedName = normalizeRefugeName(name);
    const existingCanonicalName = canonicalNameByNormalizedName.get(normalizedName);

    if (existingCanonicalName && existingCanonicalName !== record.canonicalName) {
      throw new Error(
        `Wildlife refuge alias collision: ${name} resolves to both ${existingCanonicalName} and ${record.canonicalName}`,
      );
    }

    canonicalNameByNormalizedName.set(normalizedName, record.canonicalName);
  }
}

export const canonicalizeWildlifeRefugeName = (name: string): string | null =>
  canonicalNameByNormalizedName.get(normalizeRefugeName(name)) ?? null;

export const structuredWildlifeRefugeNames = wildlifeRefugeNameRegistry.flatMap((record) => [
  record.canonicalName,
  ...record.aliases,
]);

export const removeGenericWildlifeRefugeDuplicates = <T extends { name: string }>(items: readonly T[]): T[] => {
  const seenCanonicalNames = new Set<string>();

  return items.filter((item) => {
    const canonicalName = canonicalizeWildlifeRefugeName(item.name);

    if (!canonicalName) {
      return true;
    }

    if (seenCanonicalNames.has(canonicalName)) {
      return false;
    }

    seenCanonicalNames.add(canonicalName);
    return item.name === canonicalName;
  });
};

export const assertUniqueWildlifeRefugeSlugs = <T extends { name: string; slug?: string | null; id?: string | null }>(
  items: readonly T[],
): void => {
  const seenNames = new Map<string, string>();
  const seenSlugs = new Map<string, string>();
  const seenIds = new Map<string, string>();

  for (const item of items) {
    const canonicalName = canonicalizeWildlifeRefugeName(item.name);

    if (!canonicalName) {
      continue;
    }

    const existingName = seenNames.get(canonicalName);
    if (existingName) {
      throw new Error(`Duplicate wildlife refuge destination: ${existingName} and ${item.name}`);
    }
    seenNames.set(canonicalName, item.name);

    if (item.slug) {
      const existingSlugName = seenSlugs.get(item.slug);
      if (existingSlugName) {
        throw new Error(`Duplicate wildlife refuge slug ${item.slug}: ${existingSlugName} and ${item.name}`);
      }
      seenSlugs.set(item.slug, item.name);
    }

    if (item.id) {
      const existingIdName = seenIds.get(item.id);
      if (existingIdName) {
        throw new Error(`Duplicate wildlife refuge id ${item.id}: ${existingIdName} and ${item.name}`);
      }
      seenIds.set(item.id, item.name);
    }
  }
};
