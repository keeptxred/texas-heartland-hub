export function formatCurrency(
  value: number,

  decimals = 0
): string {

  if (
    Number.isNaN(value)
  ) {

    return "$0";

  }


  return value.toLocaleString(
    "en-US",
    {

      style:
        "currency",

      currency:
        "USD",

      minimumFractionDigits:
        decimals,

      maximumFractionDigits:
        decimals,

    }
  );

}




export function formatNumber(
  value: number,

  decimals = 0
): string {


  if (
    Number.isNaN(value)
  ) {

    return "0";

  }


  return value.toLocaleString(
    "en-US",
    {

      minimumFractionDigits:
        decimals,

      maximumFractionDigits:
        decimals,

    }
  );

}




export function formatPercent(
  value: number,

  decimals = 2
): string {


  if (
    Number.isNaN(value)
  ) {

    return "0%";

  }


  return `${value.toFixed(decimals)}%`;

}




export function formatMonthly(
  annualAmount: number
): string {


  return formatCurrency(
    annualAmount / 12
  );

}




export function formatAnnual(
  monthlyAmount: number
): string {


  return formatCurrency(
    monthlyAmount * 12
  );

}




export function formatCompactCurrency(
  value: number
): string {


  if (
    Math.abs(value) >= 1000000
  ) {

    return (

      "$" +

      (
        value / 1000000
      )
        .toFixed(1)

      +

      "M"

    );

  }



  if (
    Math.abs(value) >= 1000
  ) {

    return (

      "$" +

      (
        value / 1000
      )
        .toFixed(0)

      +

      "K"

    );

  }



  return formatCurrency(value);

}