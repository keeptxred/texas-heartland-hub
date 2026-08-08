import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
export const calculateHomeAffordability = (inputs: Record<string, number>) => getPhaseCalculatorDefinition("homeAffordability").calculate(inputs);
export const validateHomeAffordabilityInputs = (inputs: Record<string, number>) => Object.values(inputs).every(Number.isFinite);
