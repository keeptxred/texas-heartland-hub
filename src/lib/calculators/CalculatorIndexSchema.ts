export interface CalculatorSchemaItem {

  name: string;

  description: string;

  url: string;

}



interface CalculatorIndexSchemaProps {

  calculators: CalculatorSchemaItem[];

}



export function generateCalculatorIndexSchema({

  calculators,

}: CalculatorIndexSchemaProps) {


  return {

    "@context":
      "https://schema.org",


    "@type":
      "CollectionPage",


    name:
      "Texas Financial Tools",


    description:
      "Free Texas calculators for mortgages, property taxes, insurance, utilities, affordability, and relocation planning.",


    mainEntity: {


      "@type":
        "ItemList",


      itemListElement:

        calculators.map(

          (calculator, index) => ({

            "@type":
              "ListItem",


            position:
              index + 1,


            item: {

              "@type":
                "WebApplication",


              name:
                calculator.name,


              description:
                calculator.description,


              url:
                calculator.url,


              applicationCategory:
                "FinanceApplication",


              operatingSystem:
                "Web",

            },

          })

        ),

    },


  };

}