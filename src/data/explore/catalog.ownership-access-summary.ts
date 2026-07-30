import {
  ownershipAccessAudit,
  type OwnershipAccessCatalogFamily,
  type UnifiedOwnershipAccessAuditRecord,
} from "./catalog.ownership-access-audit";

export type OwnershipAccessAuditSummary = {
  totalRecords: number;
  publicAccessRecords: number;
  admissionRequiredRecords: number;
  freeAccessRecords: number;
  reservationSensitiveRecords: number;
  guidedAccessRecords: number;
  overnightAccessRecords: number;
  officialSourceReviewedRecords: number;
  recordsByFamily: Record<OwnershipAccessCatalogFamily, number>;
  recordsByOwnershipClassification: Record<string, number>;
  recordsByAccessModel: Record<string, number>;
};

function countBy(
  records: readonly UnifiedOwnershipAccessAuditRecord[],
  selectKey: (record: UnifiedOwnershipAccessAuditRecord) => string,
): Record<string, number> {
  return records.reduce<Record<string, number>>((counts, record) => {
    const key = selectKey(record);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

export function buildOwnershipAccessAuditSummary(
  records: readonly UnifiedOwnershipAccessAuditRecord[] = ownershipAccessAudit,
): OwnershipAccessAuditSummary {
  const recordsByFamily = countBy(records, (record) => record.catalogFamily) as Record<
    OwnershipAccessCatalogFamily,
    number
  >;

  for (const family of [
    "commercial-cavern",
    "major-spring",
    "private-natural-landmark",
    "private-cultural-landmark",
  ] as const) {
    recordsByFamily[family] ??= 0;
  }

  return {
    totalRecords: records.length,
    publicAccessRecords: records.filter((record) => record.publicAccess).length,
    admissionRequiredRecords: records.filter((record) => record.admissionRequired).length,
    freeAccessRecords: records.filter((record) => !record.admissionRequired).length,
    reservationSensitiveRecords: records.filter(
      (record) => record.reservationsRequiredOrRecommended,
    ).length,
    guidedAccessRecords: records.filter((record) => record.guidedAccess).length,
    overnightAccessRecords: records.filter((record) => record.overnightAccess === true).length,
    officialSourceReviewedRecords: records.filter(
      (record) => record.verificationStatus === "official-source-reviewed",
    ).length,
    recordsByFamily,
    recordsByOwnershipClassification: countBy(
      records,
      (record) => record.ownershipClassification,
    ),
    recordsByAccessModel: countBy(records, (record) => record.accessModel),
  };
}

export const ownershipAccessAuditSummary = buildOwnershipAccessAuditSummary();
