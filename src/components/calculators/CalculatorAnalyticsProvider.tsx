import React, {
  useEffect,
} from "react";


interface CalculatorAnalyticsProviderProps {

  calculatorName: string;

  children: React.ReactNode;

}



declare global {

  interface Window {

    gtag?: (

      event: string,

      action: string,

      params?: Record<string, unknown>

    ) => void;

  }

}



export function trackCalculatorEvent(

  eventName: string,

  calculatorName: string,

  data: Record<string, unknown> = {}

) {


  if (

    typeof window === "undefined"

  ) {

    return;

  }



  window.dispatchEvent(

    new CustomEvent(

      "calculator-event",

      {

        detail: {

          eventName,

          calculatorName,

          ...data,

        },

      }

    )

  );



  if (

    window.gtag

  ) {


    window.gtag(

      "event",

      eventName,

      {

        calculator_name:

          calculatorName,

        ...data,

      }

    );

  }

}





export default function CalculatorAnalyticsProvider({

  calculatorName,

  children,

}: CalculatorAnalyticsProviderProps) {



  useEffect(() => {


    trackCalculatorEvent(

      "calculator_view",

      calculatorName

    );


  }, [

    calculatorName

  ]);



  return (

    <>

      {children}

    </>

  );

}