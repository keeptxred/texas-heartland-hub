import React from "react";


interface CalculatorEmptyStateProps {

  title?: string;

  message?: string;

  actionLabel?: string;

  onRetry?: () => void;

}



export default function CalculatorEmptyState({

  title =
    "Calculator unavailable",

  message =
    "We were unable to load this calculator. Please try again.",

  actionLabel =
    "Try Again",

  onRetry,

}: CalculatorEmptyStateProps) {


  return (

    <section className="rounded-xl border bg-white p-8 text-center shadow-sm">


      <div className="mx-auto max-w-md">


        <h2 className="text-xl font-bold text-gray-900">

          {title}

        </h2>


        <p className="mt-3 text-gray-600">

          {message}

        </p>



        {onRetry && (

          <button

            onClick={onRetry}

            className="mt-6 rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white"

          >

            {actionLabel}

          </button>

        )}


      </div>


    </section>

  );

}