export type JsonLdValue = string | number | boolean | null | JsonLdObject | JsonLdValue[];
export interface JsonLdObject { [key: string]: JsonLdValue; }
