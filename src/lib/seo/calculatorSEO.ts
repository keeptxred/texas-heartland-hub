export interface CalculatorSEOConfig {
  title: string;

  description: string;

  slug: string;

  category: string;

  faqs?: {
    question: string;
    answer: string;
  }[];
}


export function generateCalculatorTitle(
  title: string
): string {

  return `${title} | KeepTXRed Texas Tools`;

}



export function generateCalculatorDescription(
  description: string
): string {

  return `${description} Use our free Texas calculator to estimate costs and plan your move with confidence.`;

}



export function createWebApplicationSchema(
  config: CalculatorSEOConfig
) {

  return {

    "@context":
      "https://schema.org",

    "@type":
      "WebApplication",

    name:
      config.title,

    description:
      config.description,

    applicationCategory:
      "FinanceApplication",

    operatingSystem:
      "All",

    url:
      `https://keeptxred.com${config.slug}`,

    provider: {

      "@type":
        "Organization",

      name:
        "KeepTXRed",

      url:
        "https://keeptxred.com",

    },

  };

}



export function createBreadcrumbSchema(
  config: CalculatorSEOConfig
) {

  return {

    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement: [

      {

        "@type":
          "ListItem",

        position:
          1,

        name:
          "Home",

        item:
          "https://keeptxred.com",

      },

      {

        "@type":
          "ListItem",

        position:
          2,

        name:
          "Texas Financial Tools",

        item:
          "https://keeptxred.com/tools",

      },

      {

        "@type":
          "ListItem",

        position:
          3,

        name:
          config.title,

        item:
          `https://keeptxred.com${config.slug}`,

      },

    ],

  };

}



export function createFAQSchema(
  faqs: CalculatorSEOConfig["faqs"] = []
) {

  if (!faqs.length) {
    return null;
  }


  return {

    "@context":
      "https://schema.org",

    "@type":
      "FAQPage",

    mainEntity:

      faqs.map((faq) => ({

        "@type":
          "Question",

        name:
          faq.question,

        acceptedAnswer: {

          "@type":
            "Answer",

          text:
            faq.answer,

        },

      })),

  };

}



export function generateCalculatorSchema(
  config: CalculatorSEOConfig
) {

  return [

    createWebApplicationSchema(config),

    createBreadcrumbSchema(config),

    createFAQSchema(config.faqs),

  ].filter(Boolean);

}
