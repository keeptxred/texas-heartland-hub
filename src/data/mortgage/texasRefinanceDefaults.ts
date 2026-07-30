export const refinanceRateImprovementBenchmarks={small:{difference:.005,label:"0.50% rate reduction"},moderate:{difference:.01,label:"1.00% rate reduction"},large:{difference:.015,label:"1.50% rate reduction"}};
export const refinanceClosingCostBenchmarks={low:{percentage:.015,label:"Lower refinance cost estimate"},average:{percentage:.025,label:"Typical refinance cost estimate"},high:{percentage:.04,label:"Higher refinance cost estimate"}};
export const refinanceDecisionThresholds={excellentSavings:50000,goodSavings:25000,minimumSavings:10000,minimumRateReduction:.0075,maximumBreakEvenMonths:36};
export const refinanceCostDefaults={appraisal:600,origination:1500,title:1000,recording:300,miscellaneous:600};
export const refinanceRules={strongRefinance:{minimumSavings:50000,maximumBreakEvenMonths:24},considerRefinance:{minimumSavings:10000,maximumBreakEvenMonths:48},avoidRefinance:{minimumSavings:0,maximumBreakEvenMonths:60}};
