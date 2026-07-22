import React from "react";
import { Helmet } from "react-helmet-async";
import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
export default function TexasDownPaymentAssistanceSEO() { const d=getPhaseCalculatorDefinition("texasDownPaymentAssistance"); return <Helmet><title>{d.title} | Keep TX Red</title><meta name="description" content={d.description}/><link rel="canonical" href={`https://www.keeptxred.com${d.slug}`}/></Helmet>; }
