export type NewsroomDecision = "SKIP" | "SINGLE" | "MERGE" | "SYNTHESIS";

export type DecisionInput = {
  editorialScore: number;
  sourceCount: number;
  primarySourceCount: number;
  trendSignalCount: number;
};

export type DecisionResult = {
  decision: NewsroomDecision;
  reason: string;
};

export function decideNewsroomFormat(input: DecisionInput): DecisionResult {
  if (input.editorialScore < 45) {
    return {
      decision: "SKIP",
      reason: `Editorial score ${input.editorialScore} is below the standalone threshold of 45.`,
    };
  }

  if (input.trendSignalCount >= 2 && input.sourceCount >= 3) {
    return {
      decision: "SYNTHESIS",
      reason: `${input.trendSignalCount} trend signals across ${input.sourceCount} sources support a broader pattern package.`,
    };
  }

  if (input.sourceCount >= 2) {
    return {
      decision: "MERGE",
      reason: `${input.sourceCount} independent sources cover the same event; merge before rewrite.`,
    };
  }

  if (input.primarySourceCount > 0) {
    return {
      decision: "SINGLE",
      reason: "A primary-source-backed development clears the standalone score threshold.",
    };
  }

  return {
    decision: "SINGLE",
    reason: "A single-source development clears the standalone score threshold.",
  };
}
