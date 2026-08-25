import type { GovernmentEntity } from "@/lib/texas-government";
import { upgradeGovernmentEntity as applyWaveOne } from "@/lib/government-entity-upgrades";
import { applyGovernmentEntityWave2Upgrade } from "@/lib/government-entity-wave2-upgrades";

export function getPublicationGovernmentEntity(entity: GovernmentEntity): GovernmentEntity {
  return applyGovernmentEntityWave2Upgrade(applyWaveOne(entity));
}

export function getPublicationGovernmentEntities(entities: GovernmentEntity[]): GovernmentEntity[] {
  return entities.map(getPublicationGovernmentEntity);
}