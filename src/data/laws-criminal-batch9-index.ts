import type { CornerstoneGuide } from "@/data/cornerstone-guides";
import { CRIMINAL_PROPERTY_GUIDES } from "@/data/laws-criminal-property";
import { CRIMINAL_THEFT_PUBLIC_GUIDES } from "@/data/laws-criminal-theft-public";
import { CRIMINAL_INTOX_ASSAULT_GUIDES } from "@/data/laws-criminal-intox-assault";
import { CRIMINAL_HARASSMENT_STALKING_GUIDES } from "@/data/laws-criminal-harassment-stalking";
import { CRIMINAL_POLICE_CONTACT_GUIDES } from "@/data/laws-criminal-police-contact";

export const CRIMINAL_BATCH9_GUIDES: Record<string, CornerstoneGuide> = {
  ...CRIMINAL_PROPERTY_GUIDES,
  ...CRIMINAL_THEFT_PUBLIC_GUIDES,
  ...CRIMINAL_INTOX_ASSAULT_GUIDES,
  ...CRIMINAL_HARASSMENT_STALKING_GUIDES,
  ...CRIMINAL_POLICE_CONTACT_GUIDES,
};
