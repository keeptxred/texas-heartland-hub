export interface PhaseCalculatorField {
  key: string;
  label: string;
  defaultValue: number;
  prefix?: string;
  suffix?: string;
  helpText?: string;
}

export interface PhaseCalculatorResult {
  label: string;
  value: number;
  type?: "currency" | "number" | "percent";
  highlight?: boolean;
}

export interface PhaseCalculatorDefinition {
  key: string;
  title: string;
  description: string;
  slug: string;
  category: "Housing" | "Taxes" | "Insurance" | "Utilities" | "Relocation" | "Financial";
  fields: PhaseCalculatorField[];
  calculate: (inputs: Record<string, number>) => PhaseCalculatorResult[];
  faq: Array<{ question: string; answer: string }>;
}
