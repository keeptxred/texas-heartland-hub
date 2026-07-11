export function roundCurrency(
  value: number
): number {

  return Math.round(
    value * 100
  ) / 100;

}



export function roundNumber(
  value: number,

  decimals = 2
): number {


  const multiplier =
    Math.pow(
      10,
      decimals
    );


  return Math.round(

    value * multiplier

  ) / multiplier;

}





export function calculateMonthlyPayment(

  principal: number,

  annualInterestRate: number,

  years: number

): number {


  if (
    annualInterestRate === 0
  ) {

    return principal / (years * 12);

  }



  const monthlyRate =
    annualInterestRate / 100 / 12;


  const numberOfPayments =
    years * 12;



  return (

    principal *

    (

      monthlyRate *

      Math.pow(
        1 + monthlyRate,
        numberOfPayments
      )

    )

    /

    (

      Math.pow(
        1 + monthlyRate,
        numberOfPayments
      )

      -

      1

    )

  );

}





export function calculatePercentage(

  amount: number,

  percentage: number

): number {


  return (

    amount *

    (
      percentage / 100
    )

  );

}





export function calculateAnnualFromMonthly(

  monthlyAmount: number

): number {


  return monthlyAmount * 12;

}





export function calculateMonthlyFromAnnual(

  annualAmount: number

): number {


  return annualAmount / 12;

}





export function calculateDTI(

  monthlyDebt: number,

  grossMonthlyIncome: number

): number {


  if (
    grossMonthlyIncome <= 0
  ) {

    return 0;

  }



  return (

    monthlyDebt /

    grossMonthlyIncome

  ) * 100;

}





export function calculateLoanAmount(

  monthlyPayment: number,

  annualInterestRate: number,

  years: number

): number {


  if (
    annualInterestRate === 0
  ) {

    return monthlyPayment * years * 12;

  }



  const monthlyRate =

    annualInterestRate / 100 / 12;



  const payments =

    years * 12;



  return (

    monthlyPayment *

    (

      (

        Math.pow(
          1 + monthlyRate,
          payments
        )

        -

        1

      )

      /

      monthlyRate

    )

  );

}





export function clamp(

  value: number,

  min: number,

  max: number

): number {


  return Math.min(

    Math.max(
      value,
      min
    ),

    max

  );

}