import { importEntityDraftSchema } from "@/schemas/explore/import.schema";
import type { ImportEntityDraft, ImportValidationIssue } from "@/types/explore/import";

export class ImportValidator {
  validate(record: ImportEntityDraft): ImportValidationIssue[] {
    const result = importEntityDraftSchema.safeParse(record);
    if (result.success) return [];
    return result.error.issues.map((issue) => ({
      code: issue.code,
      message: issue.message,
      path: issue.path.join("."),
      severity: "error",
    }));
  }

  assert(record: ImportEntityDraft): ImportEntityDraft {
    return importEntityDraftSchema.parse(record) as ImportEntityDraft;
  }
}
