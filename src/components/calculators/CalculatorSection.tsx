import React from "react";


interface CalculatorSectionProps {

  title?: string;

  description?: string;

  children: React.ReactNode;

  className?: string;

}



export default function CalculatorSection({

  title,

  description,

  children,

  className = "",

}: CalculatorSectionProps) {


  return (

    <section

      className={`rounded-xl border bg-white p-6 shadow-sm ${className}`}

    >


      {title && (

        <h2 className="text-2xl font-bold text-gray-900">

          {title}

        </h2>

      )}



      {description && (

        <p className="mt-2 text-gray-600">

          {description}

        </p>

      )}



      <div className="mt-6">

        {children}

      </div>



    </section>

  );

}