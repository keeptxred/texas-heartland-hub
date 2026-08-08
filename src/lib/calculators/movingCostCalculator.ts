import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
export const calculateMovingCost = (inputs: Record<string, number>) => getPhaseCalculatorDefinition("movingCost").calculate(inputs);
export const validateMovingCostInputs = (inputs: Record<string, number>) => Object.values(inputs).every(Number.isFinite);
