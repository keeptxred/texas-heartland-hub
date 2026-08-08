import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
export const calculateCostOfLiving = (inputs: Record<string, number>) => getPhaseCalculatorDefinition("costOfLiving").calculate(inputs);
export const validateCostOfLivingInputs = (inputs: Record<string, number>) => Object.values(inputs).every(Number.isFinite);
