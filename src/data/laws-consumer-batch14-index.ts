import { CONSUMER_BATCH14_DEBT_GUIDES } from "@/data/laws-consumer-batch14-debt";
import { CONSUMER_BATCH14_PRIVACY_GUIDES } from "@/data/laws-consumer-batch14-privacy";
import { CONSUMER_BATCH14_DTPA_GUIDES } from "@/data/laws-consumer-batch14-dtpa";
import { CONSUMER_BATCH14_TRANSACTION_GUIDES } from "@/data/laws-consumer-batch14-transactions";
import { CONSUMER_BATCH14_AUTO_GUIDES } from "@/data/laws-consumer-batch14-auto";
import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const CONSUMER_BATCH14_GUIDES: Record<string, CornerstoneGuide> = {
  ...CONSUMER_BATCH14_DEBT_GUIDES,
  ...CONSUMER_BATCH14_PRIVACY_GUIDES,
  ...CONSUMER_BATCH14_DTPA_GUIDES,
  ...CONSUMER_BATCH14_TRANSACTION_GUIDES,
  ...CONSUMER_BATCH14_AUTO_GUIDES,
};
