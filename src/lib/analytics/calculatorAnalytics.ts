export type CalculatorEventType =

  | "calculator_opened"

  | "calculation_completed"

  | "results_shared"

  | "validation_error";



export interface CalculatorAnalyticsEvent {

  event:
    CalculatorEventType;

  calculator:
    string;

  timestamp:
    string;

  metadata?: Record<string, unknown>;

}



function createEvent(
  event: CalculatorEventType,

  calculator: string,

  metadata?: Record<string, unknown>

): CalculatorAnalyticsEvent {


  return {

    event,

    calculator,

    timestamp:
      new Date().toISOString(),

    metadata,

  };

}



export function trackCalculatorOpened(
  calculator: string
) {


  const event =
    createEvent(

      "calculator_opened",

      calculator

    );


  sendAnalyticsEvent(event);

}



export function trackCalculationCompleted(
  calculator: string,

  results: Record<string, unknown>

) {


  const event =
    createEvent(

      "calculation_completed",

      calculator,

      results

    );


  sendAnalyticsEvent(event);

}



export function trackResultsShared(
  calculator: string
) {


  const event =
    createEvent(

      "results_shared",

      calculator

    );


  sendAnalyticsEvent(event);

}



export function trackValidationError(
  calculator: string,

  errors: string[]

) {


  const event =
    createEvent(

      "validation_error",

      calculator,

      {
        errors,
      }

    );


  sendAnalyticsEvent(event);

}





function sendAnalyticsEvent(
  event: CalculatorAnalyticsEvent
) {


  /*
    Integration points:

    1. Google Analytics 4

    window.gtag(
      "event",
      event.event,
      event
    )


    2. Supabase analytics table

    supabase
      .from("calculator_events")
      .insert(event)

  */


  if (
    typeof window === "undefined"
  ) {

    return;

  }



  window.dispatchEvent(

    new CustomEvent(

      "calculator-event",

      {
        detail:
          event,
      }

    )

  );

}
