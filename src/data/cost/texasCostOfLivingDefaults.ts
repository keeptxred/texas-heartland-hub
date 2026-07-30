export const texasCityCostProfiles = {
  houston:{housingMultiplier:1,utilityMultiplier:1,transportationMultiplier:1,description:"Large Texas metro baseline"},
  dallas:{housingMultiplier:1.15,utilityMultiplier:1.05,transportationMultiplier:1.05,description:"North Texas metro profile"},
  austin:{housingMultiplier:1.35,utilityMultiplier:1.05,transportationMultiplier:1.05,description:"Higher-cost Texas metro"},
  sanAntonio:{housingMultiplier:.9,utilityMultiplier:.95,transportationMultiplier:.95,description:"More affordable Texas metro"},
  fortWorth:{housingMultiplier:1,utilityMultiplier:1,transportationMultiplier:1,description:"Growing Texas city profile"}
};
export const texasBaseMonthlyCosts = {housing:2400,electricity:180,water:70,internet:75,cellPhone:120,gas:80,vehiclePayment:500,fuel:200,insurance:220,vehicleMaintenance:100,groceries:800,restaurants:300,entertainment:200,healthcare:300,childcare:800,other:250};
export const householdSizeMultipliers:Record<number,number> = {1:.65,2:1,3:1.25,4:1.5,5:1.7,6:1.9};
export const housingAffordabilityBenchmarks = {excellent:.2,comfortable:.28,acceptable:.36,high:.45};
export const savingsRateBenchmarks = {excellent:.25,good:.15,moderate:.1,low:.05};
export const texasIncomeProfiles = {starter:{annualIncome:60000,label:"Starter household"},comfortable:{annualIncome:100000,label:"Comfortable household"},upperMiddle:{annualIncome:150000,label:"Upper middle income household"},highIncome:{annualIncome:250000,label:"High income household"}};
