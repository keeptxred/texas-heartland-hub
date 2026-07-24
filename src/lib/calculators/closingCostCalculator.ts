import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
export const calculateClosingCost = (inputs: Record<string, number>) => getPhaseCalculatorDefinition("closingCost").calculate(inputs);
export const validateClosingCostInputs = (inputs: Record<string, number>) => Object.values(inputs).every(Number.isFinite);
