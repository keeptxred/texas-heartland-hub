export type CalculatorCategory =

  | "Housing"

  | "Taxes"

  | "Insurance"

  | "Utilities"

  | "Relocation"

  | "Financial";




export type ResultDisplayType =

  | "currency"

  | "number"

  | "percent"

  | "text";




export interface CalculatorInputField {

  id: string;

  label: string;

  value: number | string;

  type?:
    | "number"
    | "currency"
    | "percent"
    | "text";

  prefix?: string;

  suffix?: string;

  placeholder?: string;

  helpText?: string;

  required?: boolean;

}





export interface CalculatorResultItem {

  label: string;

  value: number | string;

  type:
    ResultDisplayType;

  highlight?: boolean;

  decimals?: number;

}





export interface CalculatorBreakdownRow {

  label: string;

  value: number;

  emphasize?: boolean;

}





export interface CalculatorFAQ {

  question: string;

  answer: string;

}





export interface CalculatorMetadata {

  title: string;

  description: string;

  slug: string;

  category:
    CalculatorCategory;

  keywords?: string[];

  lastUpdated?: string;

}





export interface CalculatorShareData {

  title: string;

  summary: string;

  url?: string;

}





export interface CalculatorPageConfig {

  metadata:
    CalculatorMetadata;


  faqs?:
    CalculatorFAQ[];


  relatedCategory?:
    CalculatorCategory;


  share:
    CalculatorShareData;

}