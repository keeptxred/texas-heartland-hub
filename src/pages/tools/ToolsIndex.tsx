import React from "react";

import CalculatorLayout from "@/components/calculators/CalculatorLayout";

import {
  calculators,
  getFeaturedCalculators,
  getCalculatorsByCategory,
} from "@/data/calculators";


export default function ToolsIndex() {

  const featured =
    getFeaturedCalculators();


  const categories = [

    "Housing",
    "Taxes",
    "Insurance",
    "Utilities",
    "Relocation",
    "Financial",

  ] as const;



  return (

    <CalculatorLayout

      title="Texas Financial Tools & Calculators"

      description="Use our free Texas calculators to estimate mortgage payments, property taxes, insurance costs, utilities, closing costs, and the true cost of living in Texas."

      canonicalUrl="https://keeptxred.com/tools"

      lastUpdated="July 2026"

      schema={{

        "@context":
          "https://schema.org",

        "@type":
          "CollectionPage",

        name:
          "Texas Financial Tools",

        description:
          "Free Texas financial calculators and relocation tools.",

      }}

    >

      <div className="space-y-12">


        <section>

          <h2 className="text-3xl font-bold text-gray-900">

            Featured Texas Calculators

          </h2>


          <p className="mt-2 text-gray-600">

            Plan your move, purchase a home, and understand
            the true costs of living in Texas.

          </p>


          <div className="mt-6 grid gap-5 md:grid-cols-2">


            {featured.map((tool) => (

              <a

                key={tool.id}

                href={tool.slug}

                className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"

              >

                <h3 className="text-xl font-bold text-red-700">

                  {tool.title}

                </h3>


                <p className="mt-2 text-gray-600">

                  {tool.description}

                </p>


              </a>

            ))}


          </div>

        </section>




        {categories.map((category) => {

          const items =
            getCalculatorsByCategory(
              category
            );


          if (!items.length) {
            return null;
          }


          return (

            <section
              key={category}
            >

              <h2 className="text-2xl font-bold text-gray-900">

                {category} Tools

              </h2>


              <div className="mt-5 grid gap-5 md:grid-cols-2">


                {items.map((tool) => (

                  <a

                    key={tool.id}

                    href={tool.slug}

                    className="rounded-xl border bg-white p-5 transition hover:bg-gray-50"

                  >

                    <h3 className="font-semibold text-gray-900">

                      {tool.title}

                    </h3>


                    <p className="mt-2 text-sm text-gray-600">

                      {tool.description}

                    </p>


                  </a>

                ))}


              </div>

            </section>

          );

        })}



        <section className="rounded-xl bg-gray-50 p-6">


          <h2 className="text-2xl font-bold text-gray-900">

            Why Use Texas Financial Tools?

          </h2>


          <div className="mt-4 space-y-3 text-gray-700">


            <p>

              Moving to Texas involves more than comparing
              home prices. Property taxes, insurance,
              utilities, and closing costs can significantly
              affect your monthly budget.

            </p>


            <p>

              These calculators help Texas families estimate
              real-world costs before buying a home or
              relocating.

            </p>


            <p>

              Bookmark this page as we continue adding new
              Texas-focused financial tools.

            </p>


          </div>


        </section>


      </div>


    </CalculatorLayout>

  );

}