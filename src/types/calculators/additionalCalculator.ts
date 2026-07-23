export interface AdditionalCalculatorField {
  key: string;
  label: string;
  defaultValue: number;
  prefix?: string;
  suffix?: string;
  helpText?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export interface AdditionalCalculatorResult {
  label: string;
  value: number;
  type?: "currency" | "number" | "percent";
  highlight?: boolean;
  decimals?: number;
}

export interface AdditionalCalculatorPreset {
  label: string;
  description: string;
  values: Record<string, number>;
}

export interface AdditionalCalculatorDefinition {
  key: string;
  title: string;
  description: string;
  slug: string;
  category: "Housing" | "Taxes" | "Insurance" | "Utilities" | "Relocation" | "Financial";
  fields: AdditionalCalculatorField[];
  calculate: (inputs: Record<string, number>) => AdditionalCalculatorResult[];
  validate?: (inputs: Record<string, number>) => Record<string, string>;
  presets?: AdditionalCalculatorPreset[];
  assumptions: string[];
  resultMeaning: string;
  disclaimer: string;
  faq: Array<{ question: string; answer: string }>;
}
