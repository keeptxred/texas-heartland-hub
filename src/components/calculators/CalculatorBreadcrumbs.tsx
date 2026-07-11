import React from "react";


interface BreadcrumbItem {

  name: string;

  url: string;

}



interface CalculatorBreadcrumbsProps {

  items: BreadcrumbItem[];

}



export default function CalculatorBreadcrumbs({

  items,

}: CalculatorBreadcrumbsProps) {


  const schema = {

    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement:

      items.map(

        (item, index) => ({

          "@type":
            "ListItem",

          position:
            index + 1,

          name:
            item.name,

          item:
            item.url,

        })

      ),

  };



  return (

    <>

      <script

        type="application/ld+json"

        dangerouslySetInnerHTML={{

          __html:

            JSON.stringify(schema),

        }}

      />



      <nav

        aria-label="Breadcrumb"

        className="mb-6 text-sm text-gray-600"

      >

        <ol className="flex flex-wrap items-center gap-2">


          {items.map(

            (item, index) => (

              <li

                key={item.url}

                className="flex items-center gap-2"

              >

                {index > 0 && (

                  <span>

                    /

                  </span>

                )}



                {index === items.length - 1 ? (

                  <span className="font-medium text-gray-900">

                    {item.name}

                  </span>

                ) : (

                  <a

                    href={item.url}

                    className="hover:text-gray-900"

                  >

                    {item.name}

                  </a>

                )}

              </li>

            )

          )}


        </ol>

      </nav>


    </>

  );

}