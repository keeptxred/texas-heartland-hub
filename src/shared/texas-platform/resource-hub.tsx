import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Calculator,
  Compass,
  DollarSign,
  FileText,
  Home,
  Landmark,
  MapPinned,
  Scale,
  Sparkles,
  Truck,
  Users,
  Vote,
} from "lucide-react";

export type ResourceHubOwner = "shared" | "keeptxred" | "texasdefined";

export type ResourceHubLink = {
  label: string;
  href: string;
};

export type ResourceHubCategory = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  owner: ResourceHubOwner;
  exploreHref: string;
  links: ResourceHubLink[];
};

export type FeaturedResource = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  owner: ResourceHubOwner;
};

export type BrowseResource = ResourceHubLink & {
  icon: LucideIcon;
  owner: ResourceHubOwner;
};

export const RESOURCE_HUB_CATEGORIES: ResourceHubCategory[] = [
  {
    id: "home-property",
    title: "Home & Property",
    description: "Understand property taxes, homeownership costs, exemptions and buying a home in Texas.",
    icon: Home,
    owner: "texasdefined",
    exploreHref: "/texas-resources/topic/home-property",
    links: [
      { label: "Property Tax Calculator", href: "/tax-calculator" },
      { label: "Property Tax Protest Guide", href: "/texas-property-tax-protest-guide" },
      { label: "Mortgage Calculator", href: "/texas-mortgage-calculator" },
      { label: "Home Affordability Calculator", href: "/texas-home-affordability-calculator" },
      { label: "First-Time Homebuyer Programs", href: "/texas-first-time-homebuyer-programs" },
    ],
  },
  {
    id: "money-taxes",
    title: "Money & Taxes",
    description: "Compare taxes, household costs, salaries and everyday financial decisions across Texas.",
    icon: DollarSign,
    owner: "texasdefined",
    exploreHref: "/texas-financial-tools",
    links: [
      { label: "Cost of Living Calculator", href: "/texas-cost-of-living-calculator" },
      { label: "Texas Financial Tools", href: "/texas-financial-tools" },
      { label: "Sales Tax Explained", href: "/texas-sales-tax-explained" },
      { label: "Homeownership Cost Calculator", href: "/texas-homeownership-cost-calculator" },
      { label: "Property Tax Increase Calculator", href: "/texas-property-tax-increase-calculator" },
    ],
  },
  {
    id: "government-elections",
    title: "Government & Elections",
    description: "Find representatives, follow legislation and understand how Texas government works.",
    icon: Landmark,
    owner: "keeptxred",
    exploreHref: "/texas-resources/topic/government",
    links: [
      { label: "Find My Representative", href: "/representatives" },
      { label: "Texas Bills", href: "/bills" },
      { label: "Election Central", href: "/elections" },
      { label: "Texas Legislature", href: "/texas-legislature" },
      { label: "Committees", href: "/committees" },
    ],
  },
  {
    id: "texas-laws",
    title: "Texas Laws",
    description: "Get plain-language explanations of major Texas laws and legal topics that affect daily life.",
    icon: Scale,
    owner: "keeptxred",
    exploreHref: "/laws",
    links: [
      { label: "Texas Laws Hub", href: "/laws" },
      { label: "Texas Gun Laws", href: "/laws/texas-gun-laws" },
      { label: "Texas Property Tax Laws", href: "/laws/texas-property-tax-laws" },
      { label: "Texas Election Laws", href: "/laws/texas-election-laws" },
      { label: "New Texas Laws", href: "/laws/texas-new-laws-2026" },
    ],
  },
  {
    id: "cities-counties",
    title: "Cities & Counties",
    description: "Explore local information, compare communities and connect with county-level resources.",
    icon: Building2,
    owner: "texasdefined",
    exploreHref: "/texas-resources/topic/places",
    links: [
      { label: "County Information", href: "/county-elections" },
      { label: "Cost of Living", href: "/texas-cost-of-living-calculator" },
      { label: "Moving to Texas", href: "/moving-to-texas" },
      { label: "School District Resources", href: "/texas-resources/type/school-district" },
      { label: "Browse All Places", href: "/texas-resources/type/city" },
    ],
  },
  {
    id: "moving-to-texas",
    title: "Moving to Texas",
    description: "Plan a move, compare costs and handle the practical steps of becoming a Texas resident.",
    icon: Truck,
    owner: "texasdefined",
    exploreHref: "/moving-to-texas",
    links: [
      { label: "Moving to Texas Guide", href: "/moving-to-texas" },
      { label: "Cost of Living Calculator", href: "/texas-cost-of-living-calculator" },
      { label: "New Resident Vehicle Guide", href: "/vehicles/new-residents" },
      { label: "Home Affordability Calculator", href: "/texas-home-affordability-calculator" },
      { label: "Cities & Counties", href: "/texas-resources/topic/places" },
    ],
  },
  {
    id: "calculators-tools",
    title: "Calculators & Tools",
    description: "Use practical calculators and decision tools built around Texas taxes, housing and living costs.",
    icon: Calculator,
    owner: "shared",
    exploreHref: "/texas-resources/type/calculator",
    links: [
      { label: "Property Tax Calculator", href: "/tax-calculator" },
      { label: "Mortgage Calculator", href: "/texas-mortgage-calculator" },
      { label: "Cost of Living Calculator", href: "/texas-cost-of-living-calculator" },
      { label: "Home Affordability Calculator", href: "/texas-home-affordability-calculator" },
      { label: "Browse All Calculators", href: "/texas-resources/type/calculator" },
    ],
  },
  {
    id: "explore-texas",
    title: "Explore Texas",
    description: "Discover parks, destinations, history and places worth experiencing across the state.",
    icon: Compass,
    owner: "texasdefined",
    exploreHref: "/texas-resources/topic/explore-texas",
    links: [
      { label: "Parks", href: "/texas-resources/type/park" },
      { label: "Cities", href: "/texas-resources/type/city" },
      { label: "Counties", href: "/texas-resources/type/county" },
      { label: "Texas Living", href: "/texas-living" },
      { label: "Browse All Resources", href: "/texas-resources" },
    ],
  },
];

export const FEATURED_RESOURCES: FeaturedResource[] = [
  { title: "Property Tax Calculator", description: "Estimate your Texas property tax bill.", href: "/tax-calculator", icon: Calculator, owner: "shared" },
  { title: "Find My Representative", description: "Find the officials who represent you.", href: "/representatives", icon: Landmark, owner: "keeptxred" },
  { title: "Texas Bills", description: "Search and follow legislation in the Texas Legislature.", href: "/bills", icon: Scale, owner: "keeptxred" },
  { title: "Homestead Exemption Guide", description: "Understand eligibility, savings and how to apply.", href: "/texas-property-tax-protest-guide", icon: Home, owner: "texasdefined" },
  { title: "Cost of Living Calculator", description: "Compare household costs across Texas.", href: "/texas-cost-of-living-calculator", icon: MapPinned, owner: "texasdefined" },
  { title: "Mortgage Calculator", description: "Estimate a Texas home payment and total cost.", href: "/texas-mortgage-calculator", icon: DollarSign, owner: "texasdefined" },
];

export const BROWSE_RESOURCES: BrowseResource[] = [
  { label: "Counties", href: "/texas-resources/type/county", icon: MapPinned, owner: "texasdefined" },
  { label: "Cities", href: "/texas-resources/type/city", icon: Building2, owner: "texasdefined" },
  { label: "Representatives", href: "/representatives", icon: Users, owner: "keeptxred" },
  { label: "Bills", href: "/bills", icon: FileText, owner: "keeptxred" },
  { label: "Laws", href: "/laws", icon: Scale, owner: "keeptxred" },
  { label: "Elections", href: "/elections", icon: Vote, owner: "keeptxred" },
  { label: "Calculators", href: "/texas-resources/type/calculator", icon: Calculator, owner: "shared" },
  { label: "Guides", href: "/texas-resources/type/guide", icon: Sparkles, owner: "shared" },
];

export const POPULAR_RESOURCES: ResourceHubLink[] = [
  { label: "Texas Bills", href: "/bills" },
  { label: "Find My Representative", href: "/representatives" },
  { label: "Property Tax Calculator", href: "/tax-calculator" },
];

export const TRENDING_RESOURCES: ResourceHubLink[] = [
  { label: "Election Central", href: "/elections" },
  { label: "New Texas Laws", href: "/laws/texas-new-laws-2026" },
  { label: "Texas Legislature", href: "/texas-legislature" },
];

export const NEW_RESOURCES: ResourceHubLink[] = [
  { label: "Browse Texas Committees", href: "/committees" },
  { label: "Texas Laws Hub", href: "/laws" },
  { label: "All Calculators", href: "/texas-resources/type/calculator" },
];

export const TEXAS_ASSISTANT_EXAMPLES = [
  "How much are property taxes in Katy?",
  "Who represents District 132?",
  "What laws changed this year?",
] as const;

export function resourceHubCategoriesForOwner(owner: "keeptxred" | "texasdefined") {
  return RESOURCE_HUB_CATEGORIES.filter((category) => category.owner === "shared" || category.owner === owner);
}

export function featuredResourcesForOwner(owner: "keeptxred" | "texasdefined") {
  return FEATURED_RESOURCES.filter((resource) => resource.owner === "shared" || resource.owner === owner);
}

export function browseResourcesForOwner(owner: "keeptxred" | "texasdefined") {
  return BROWSE_RESOURCES.filter((resource) => resource.owner === "shared" || resource.owner === owner);
}
