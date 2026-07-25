import type { ImportEntityDraft } from "@/types/explore/import";

export interface ImportPostProcessContext {
  jobId: string;
  recordId: string;
  sourceId: string;
  entityId: string;
  draft: ImportEntityDraft;
}

export interface ImportPostProcessStep {
  readonly name: string;
  execute(context: ImportPostProcessContext): Promise<void>;
}

export interface ImportPostProcessResult {
  completed: string[];
  failed: Array<{ step: string; message: string }>;
}

export class ImportPostProcessor {
  constructor(private readonly steps: readonly ImportPostProcessStep[]) {}

  async process(context: ImportPostProcessContext): Promise<ImportPostProcessResult> {
    const completed: string[] = [];
    const failed: Array<{ step: string; message: string }> = [];

    for (const step of this.steps) {
      try {
        await step.execute(context);
        completed.push(step.name);
      } catch (error) {
        failed.push({
          step: step.name,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return { completed, failed };
  }
}
