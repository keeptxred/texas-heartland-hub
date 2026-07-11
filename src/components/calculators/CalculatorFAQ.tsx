import React from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface CalculatorFAQProps {
  title?: string;
  items: FAQItem[];
}


export default function CalculatorFAQ({
  title = "Frequently Asked Questions",
  items,
}: CalculatorFAQProps) {


  if (!items.length) {
    return null;
  }


  return (

    <section className="mt-10 rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-bold text-gray-900">

        {title}

      </h2>


      <div className="mt-6 space-y-6">


        {items.map(
          (item, index) => (

            <div
              key={index}
              className="border-b pb-5 last:border-b-0"
            >

              <h3 className="text-lg font-semibold text-gray-900">

                {item.question}

              </h3>


              <p className="mt-2 leading-relaxed text-gray-600">

                {item.answer}

              </p>

            </div>

          )
        )}


      </div>


    </section>

  );

}