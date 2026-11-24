import { availableElectionReferences } from "@/lib/public-election-reference";
import type { GovernmentEntity } from "@/lib/texas-government";
import { upgradeGovernmentEntity as applyWaveOne } from "@/lib/government-entity-upgrades";
import { applyGovernmentEntityWave2Upgrade } from "@/lib/government-entity-wave2-upgrades";

export function getPublicationGovernmentEntity(entity: GovernmentEntity): GovernmentEntity {
  const upgraded = applyGovernmentEntityWave2Upgrade(applyWaveOne(entity));
  return {
    ...upgraded,
    relatedElections: availableElectionReferences(upgraded.relatedElections),
    relatedRepresentatives: availableElectionReferences(upgraded.relatedRepresentatives),
  };
}

export function getPublicationGovernmentEntities(entities: GovernmentEntity[]): GovernmentEntity[] {
  return entities.map(getPublicationGovernmentEntity);
}