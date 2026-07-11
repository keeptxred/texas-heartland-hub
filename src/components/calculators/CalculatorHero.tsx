import React from "react";


interface CalculatorHeroProps {

  title: string;

  description: string;

  category?: string;

  lastUpdated?: string;

  badge?: string;

}



export default function CalculatorHero({

  title,

  description,

  category = "Texas Financial Tool",

  lastUpdated,

  badge = "Free Calculator",

}: CalculatorHeroProps) {


  return (

    <section className="mb-8 rounded-xl bg-white p-6 shadow-sm md:p-8">


      <div className="flex flex-wrap items-center gap-3">


        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">

          {category}

        </span>


        <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">

          {badge}

        </span>


      </div>



      <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">

        {title}

      </h1>



      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">

        {description}

      </p>



      <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-500">


        <span>

          ✓ Built for Texas homeowners and families

        </span>


        <span>

          ✓ Free to use

        </span>


        <span>

          ✓ Estimates updated regularly

        </span>


      </div>



      {lastUpdated && (

        <p className="mt-5 text-xs text-gray-500">

          Last updated: {lastUpdated}

        </p>

      )}


    </section>

  );

}