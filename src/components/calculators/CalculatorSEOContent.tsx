import React from "react";


interface SEOContentSection {

  heading: string;

  content: string;

}



interface CalculatorSEOContentProps {

  sections: SEOContentSection[];

}



export default function CalculatorSEOContent({

  sections,

}: CalculatorSEOContentProps) {


  if (!sections.length) {

    return null;

  }



  return (

    <section className="mt-10 space-y-8 rounded-xl border bg-white p-6 shadow-sm">


      {sections.map(

        (section, index) => (

          <article

            key={index}

          >

            <h2 className="text-2xl font-bold text-gray-900">

              {section.heading}

            </h2>



            <p className="mt-3 leading-relaxed text-gray-700">

              {section.content}

            </p>


          </article>

        )

      )}


    </section>

  );

}