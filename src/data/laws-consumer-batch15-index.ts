import { CONSUMER_BATCH15_DEBT_GUIDES } from "@/data/laws-consumer-batch15-debt";
import { CONSUMER_BATCH15_EXEMPTION_GUIDES } from "@/data/laws-consumer-batch15-exemptions";
import { CONSUMER_BATCH15_REPOSSESSION_GUIDES } from "@/data/laws-consumer-batch15-repossession";
import { CONSUMER_BATCH15_MORTGAGE_GUIDES } from "@/data/laws-consumer-batch15-mortgage";
import { CONSUMER_BATCH15_CREDIT_SERVICES_GUIDES } from "@/data/laws-consumer-batch15-credit-services";
import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const CONSUMER_BATCH15_GUIDES: Record<string, CornerstoneGuide> = {
  ...CONSUMER_BATCH15_DEBT_GUIDES,
  ...CONSUMER_BATCH15_EXEMPTION_GUIDES,
  ...CONSUMER_BATCH15_REPOSSESSION_GUIDES,
  ...CONSUMER_BATCH15_MORTGAGE_GUIDES,
  ...CONSUMER_BATCH15_CREDIT_SERVICES_GUIDES,
};
