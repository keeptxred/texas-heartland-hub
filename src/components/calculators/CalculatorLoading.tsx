import React from "react";


interface CalculatorLoadingProps {

  message?: string;

}



export default function CalculatorLoading({

  message = "Loading calculator...",

}: CalculatorLoadingProps) {


  return (

    <section className="flex min-h-[300px] items-center justify-center rounded-xl border bg-white p-8">


      <div className="w-full max-w-md space-y-5">


        <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />


        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />


        <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />


        <div className="h-12 w-full animate-pulse rounded bg-gray-200" />


        <p className="text-center text-sm text-gray-500">

          {message}

        </p>


      </div>


    </section>

  );

}