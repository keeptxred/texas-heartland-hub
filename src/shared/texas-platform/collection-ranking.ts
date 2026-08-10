import type { SharedEntity } from './entities';

function resourceId(entity: SharedEntity) {
  return entity.sourceResourceId ?? entity.id.replace(/^resource:/, '');
}

export function rankCollectionEntities(
  entities: readonly SharedEntity[],
  preferredResourceIds: readonly string[],
) {
  const preferred = new Map(preferredResourceIds.map((id, index) => [id, index]));
  return [...entities].sort((a, b) => {
    const aRank = preferred.get(resourceId(a));
    const bRank = preferred.get(resourceId(b));
    if (aRank !== undefined || bRank !== undefined) {
      if (aRank === undefined) return 1;
      if (bRank === undefined) return -1;
      if (aRank !== bRank) return aRank - bRank;
    }
    return a.title.localeCompare(b.title);
  });
}

export function collectionItemList(entities: readonly SharedEntity[], siteUrl: string) {
  return {
    '@type': 'ItemList',
    numberOfItems: entities.length,
    itemListElement: entities.map((entity, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entity.title,
      url: `${siteUrl}${entity.route}`,
    })),
  };
}
