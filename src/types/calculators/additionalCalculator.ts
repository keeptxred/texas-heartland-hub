export interface AdditionalCalculatorField {
  key: string;
  label: string;
  defaultValue: number;
  prefix?: string;
  suffix?: string;
  helpText?: string;
}

export interface AdditionalCalculatorResult {
  label: string;
  value: number;
  type?: "currency" | "number" | "percent";
  highlight?: boolean;
  decimals?: number;
}

export interface AdditionalCalculatorDefinition {
  key: string;
  title: string;
  description: string;
  slug: string;
  category: "Housing" | "Taxes" | "Insurance" | "Utilities" | "Relocation" | "Financial";
  fields: AdditionalCalculatorField[];
  calculate: (inputs: Record<string, number>) => AdditionalCalculatorResult[];
  faq: Array<{ question: string; answer: string }>;
}
