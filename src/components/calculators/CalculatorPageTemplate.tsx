import React from "react";

import CalculatorHero from "@/components/calculators/CalculatorHero";
import CalculatorFAQ, { FAQItem } from "@/components/calculators/CalculatorFAQ";
import RelatedTools from "@/components/calculators/RelatedTools";
import CalculatorDisclaimer from "@/components/calculators/CalculatorDisclaimer";
import CalculatorShareCard from "@/components/calculators/CalculatorShareCard";

interface CalculatorPageTemplateProps {
  title: string;
  description: string;
  category?: string;
  slug?: string;
  lastUpdated?: string;
  children?: React.ReactNode;
  calculator?: React.ReactNode;
  shareText?: string;
  faqs?: FAQItem[];
  relatedCategory?: "Housing" | "Taxes" | "Insurance" | "Utilities" | "Relocation" | "Financial";
}

export default function CalculatorPageTemplate({
  title,
  description,
  category = "Financial",
  slug = "",
  lastUpdated,
  children,
  calculator,
  shareText,
  faqs = [],
  relatedCategory,
}: CalculatorPageTemplateProps) {
  const resolvedShareText = shareText ?? `Use the ${title} from Keep TX Red.`;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <CalculatorHero
        title={title}
        description={description}
        category={category}
        lastUpdated={lastUpdated}
      />

      <section className="rounded-xl bg-white p-6 shadow-sm">
        {calculator}
        {children}
      </section>

      {slug && (
        <CalculatorShareCard
          calculatorName={title}
          shareText={resolvedShareText}
          url={`https://keeptxred.com${slug}`}
        />
      )}

      {faqs.length > 0 && <CalculatorFAQ items={faqs} />}

      {slug && (
        <RelatedTools
          currentSlug={slug}
          category={relatedCategory}
        />
      )}

      <CalculatorDisclaimer />
    </main>
  );
}
