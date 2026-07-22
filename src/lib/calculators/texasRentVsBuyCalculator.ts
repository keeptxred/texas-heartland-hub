import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
export const calculateTexasRentVsBuy = (inputs: Record<string, number>) => getPhaseCalculatorDefinition("texasRentVsBuy").calculate(inputs);
export const validateTexasRentVsBuyInputs = (inputs: Record<string, number>) => Object.values(inputs).every(Number.isFinite);
