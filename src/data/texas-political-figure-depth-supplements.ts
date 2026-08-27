import type { TexasPoliticalFigure } from "@/data/texas-political-figures";

const SUPPLEMENTAL_SECTIONS: Record<string, TexasPoliticalFigure["sections"]> = {
  "ronald-reagan-texas-conservative-legacy": [
    {
      heading: "Where Reagan and today's Texas Republican coalition differ",
      body: "Invoking Reagan can hide as much history as it reveals. His administration signed the bipartisan Immigration Reform and Control Act of 1986, which combined employer sanctions and enforcement measures with legalization for many people already living in the United States without legal status. The Reagan Library's own archival materials describe those three components together. That record does not map neatly onto today's Texas Republican debates over border enforcement and immigration. The same caution applies more broadly: the Cold War, the tax system, the structure of the electorate and the national party coalitions of the 1980s were different from those of the 2020s. Reagan is therefore most useful as a historical reference point, not as a shortcut that makes every modern policy position automatically Reaganite. Comparing the actual record with present-day positions gives readers a more accurate picture of both eras."
    }
  ]
};

export function withPoliticalFigureDepthSupplements(figure: TexasPoliticalFigure): TexasPoliticalFigure {
  const additions = SUPPLEMENTAL_SECTIONS[figure.slug];
  if (!additions?.length) return figure;
  return { ...figure, sections: [...figure.sections, ...additions] };
}
