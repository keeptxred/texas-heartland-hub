import React from "react";

import CalculatorHero from "@/components/calculators/CalculatorHero";

import CalculatorFAQ, {
  FAQItem,
} from "@/components/calculators/CalculatorFAQ";

import RelatedTools from "@/components/calculators/RelatedTools";

import CalculatorDisclaimer from "@/components/calculators/CalculatorDisclaimer";

import CalculatorShareCard from "@/components/calculators/CalculatorShareCard";



interface CalculatorPageTemplateProps {

  title: string;

  description: string;

  category: string;

  slug: string;

  lastUpdated?: string;


  children: React.ReactNode;


  shareText: string;


  faqs?: FAQItem[];


  relatedCategory?: 
    | "Housing"
    | "Taxes"
    | "Insurance"
    | "Utilities"
    | "Relocation"
    | "Financial";

}



export default function CalculatorPageTemplate({

  title,

  description,

  category,

  slug,

  lastUpdated,

  children,

  shareText,

  faqs = [],

  relatedCategory,

}: CalculatorPageTemplateProps) {


  return (

    <main className="mx-auto w-full max-w-6xl px-4 py-8">


      <CalculatorHero

        title={title}

        description={description}

        category={category}

        lastUpdated={lastUpdated}

      />



      <section className="rounded-xl bg-white p-6 shadow-sm">


        {children}


      </section>



      <CalculatorShareCard

        calculatorName={title}

        shareText={shareText}

        url={`https://keeptxred.com${slug}`}

      />



      {faqs.length > 0 && (

        <CalculatorFAQ

          items={faqs}

        />

      )}



      <RelatedTools

        currentSlug={slug}

        category={relatedCategory}

      />



      <CalculatorDisclaimer />


    </main>

  );

}