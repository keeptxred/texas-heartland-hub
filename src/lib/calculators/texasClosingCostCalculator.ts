import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
export const calculateTexasClosingCost = (inputs: Record<string, number>) => getPhaseCalculatorDefinition("texasClosingCost").calculate(inputs);
export const validateTexasClosingCostInputs = (inputs: Record<string, number>) => Object.values(inputs).every(Number.isFinite);
