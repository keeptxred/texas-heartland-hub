import React from "react";


interface CalculatorInputGridProps {

  children: React.ReactNode;

  columns?: 1 | 2 | 3;

  title?: string;

}



export default function CalculatorInputGrid({

  children,

  columns = 2,

  title = "Calculator Inputs",

}: CalculatorInputGridProps) {



  const columnClass = {

    1:
      "grid-cols-1",

    2:
      "grid-cols-1 md:grid-cols-2",

    3:
      "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",

  }[columns];



  return (

    <section className="space-y-5">


      <h2 className="text-2xl font-bold text-gray-900">

        {title}

      </h2>



      <div

        className={`grid gap-5 ${columnClass}`}

      >

        {children}

      </div>


    </section>

  );

}