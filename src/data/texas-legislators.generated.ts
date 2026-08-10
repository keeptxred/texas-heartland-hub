/* eslint-disable */
/**
 * Generated from current Open States Texas records and their linked official
 * Texas House, Texas Senate, and Texas Legislature Online sources.
 * Reviewed 2026-07-31. Refresh with the official-source sync; do not edit manually.
 */

import type { RepresentativeAuthority } from "./representative-authority";

export type TexasLegislativeChamber = "house" | "senate";

export type TexasLegislativeSeat = {
  slug: string;
  name: string | null;
  chamber: TexasLegislativeChamber;
  district: number;
  party: "R" | "D" | null;
  website: string;
  imageUrl: string | null;
  officialCode: string | null;
  home: string | null;
  phone: string | null;
  capitolAddress: string | null;
  districtAddress: string | null;
  vacant: boolean;
  authority: RepresentativeAuthority | null;
};

export const TEXAS_LEGISLATIVE_SEATS: TexasLegislativeSeat[] = [
  {
    slug: "gary-vandeaver",
    name: "Gary VanDeaver",
    chamber: "house",
    district: 1,
    party: "R",
    website: "https://house.texas.gov/members/2540",
    imageUrl: "https://house.texas.gov/images/members/2540.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "903-628-0361",
    capitolAddress: "710 James Bowie Drive, New Boston, TX 75570",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "gary-vandeaver",
      reviewedAt: "2026-07-31",
      biography:
        "Gary VanDeaver is the current Representative for Texas House District 1. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 1 since 2015-01-13.",
        "Capitol office: 710 James Bowie Drive, New Boston, TX 75570",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Higher Education", "Public Health — Chair"],
      electionHistory: [
        {
          year: "2015",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 1. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Gary VanDeaver", "Representative Gary VanDeaver", "Texas House District 1"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2540",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2540/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "brent-money",
    name: "Brent Money",
    chamber: "house",
    district: 2,
    party: "R",
    website: "https://house.texas.gov/members/2",
    imageUrl: "https://www.house.texas.gov/images/members/4670.jpg?v=1",
    officialCode: null,
    home: "220 Burnett Trail, Canton, TX 75103",
    phone: "512-463-0880",
    capitolAddress: "Room E2.414, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "220 Burnett Trail, Canton, TX 75103",
    vacant: false,
    authority: {
      slug: "brent-money",
      reviewedAt: "2026-07-31",
      biography:
        "Brent Money is the current Representative for Texas House District 2. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 2 since 2025-01-14.",
        "Capitol office: Room E2.414, P.O. Box 12910, Austin, TX 78711",
        "District office: 220 Burnett Trail, Canton, TX 75103",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Agriculture and Livestock", "Criminal Jurisprudence"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 2. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Brent Money", "Representative Brent Money", "Texas House District 2"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4670/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "cecil-bell",
    name: "Cecil Bell",
    chamber: "house",
    district: 3,
    party: "R",
    website: "https://house.texas.gov/members/2335",
    imageUrl: "https://house.texas.gov/images/members/2335.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0650",
    capitolAddress: "Room E2.708, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "cecil-bell",
      reviewedAt: "2026-07-31",
      biography:
        "Cecil Bell is the current Representative for Texas House District 3. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 3 since 2013-01-03.",
        "Capitol office: Room E2.708, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Intergovernmental Affairs — Chair", "Natural Resources"],
      electionHistory: [
        {
          year: "2013",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 3. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Cecil Bell", "Representative Cecil Bell", "Texas House District 3"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2335",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2335/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "keith-bell",
    name: "Keith Bell",
    chamber: "house",
    district: 4,
    party: "R",
    website: "https://house.texas.gov/members/3695",
    imageUrl: "https://house.texas.gov/images/members/3695.jpg?v=1",
    officialCode: null,
    home: "100 E. Corsicana St. Suite 204, Athens, TX 75751",
    phone: "512-463-0458",
    capitolAddress: "Room E2.508, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "100 E. Corsicana St. Suite 204, Athens, TX 75751",
    vacant: false,
    authority: {
      slug: "keith-bell",
      reviewedAt: "2026-07-31",
      biography:
        "Keith Bell is the current Representative for Texas House District 4. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 4 since 2019-01-08.",
        "Capitol office: Room E2.508, P.O. Box 12910, Austin, TX 78711",
        "District office: 100 E. Corsicana St. Suite 204, Athens, TX 75751",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Environmental Regulation",
        "General Aviation Select — Chair",
        "General Investigating — Chair",
        "Sunset Advisory Commission",
        "Trade, Workforce and Economic Development",
      ],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 4. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Keith Bell", "Representative Keith Bell", "Texas House District 4"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3695",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3695/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "cole-hefner",
    name: "Cole Hefner",
    chamber: "house",
    district: 5,
    party: "R",
    website: "https://house.texas.gov/members/3505",
    imageUrl: "https://house.texas.gov/images/members/3505.jpg?v=1",
    officialCode: null,
    home: "115 W. 1st St., Mount Pleasant, TX 75455",
    phone: "512-463-0271",
    capitolAddress: "Room E2.610, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "115 W. 1st St., Mount Pleasant, TX 75455",
    vacant: false,
    authority: {
      slug: "cole-hefner",
      reviewedAt: "2026-07-31",
      biography:
        "Cole Hefner is the current Representative for Texas House District 5. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 5 since 2017-01-10.",
        "Capitol office: Room E2.610, P.O. Box 12910, Austin, TX 78711",
        "District office: 115 W. 1st St., Mount Pleasant, TX 75455",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Congressional Redistricting Select",
        "General Aviation Select",
        "Homeland Security, Public Safety and Veterans' Affairs — Chair",
        "Redistricting",
        "Transportation",
      ],
      electionHistory: [
        {
          year: "2017",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 5. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Cole Hefner", "Representative Cole Hefner", "Texas House District 5"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3505",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3505/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "daniel-alders",
    name: "Daniel Alders",
    chamber: "house",
    district: 6,
    party: "R",
    website: "https://house.texas.gov/members/4395",
    imageUrl: "https://www.house.texas.gov/images/members/4395.jpg?v=1",
    officialCode: null,
    home: "110 N. College Ave. Suite 217, Tyler, TX 75702",
    phone: "512-463-0584",
    capitolAddress: "Room E2.402, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "110 N. College Ave. Suite 217, Tyler, TX 75702",
    vacant: false,
    authority: {
      slug: "daniel-alders",
      reviewedAt: "2026-07-31",
      biography:
        "Daniel Alders is the current Representative for Texas House District 6. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 6 since 2025-01-14.",
        "Capitol office: Room E2.402, P.O. Box 12910, Austin, TX 78711",
        "District office: 110 N. College Ave. Suite 217, Tyler, TX 75702",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Delivery of Government Efficiency",
        "Health Care Affordability Select",
        "Land and Resource Management",
      ],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 6. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Daniel Alders", "Representative Daniel Alders", "Texas House District 6"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4395",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4395/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "jay-dean",
    name: "Jay Dean",
    chamber: "house",
    district: 7,
    party: "R",
    website: "https://house.texas.gov/members/3515",
    imageUrl: "https://house.texas.gov/images/members/3515.jpg?v=1",
    officialCode: null,
    home: "101 E. Methvin Suite 103, Longview, TX 75601",
    phone: "512-463-0750",
    capitolAddress: "Room GN.11, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "101 E. Methvin Suite 103, Longview, TX 75601",
    vacant: false,
    authority: {
      slug: "jay-dean",
      reviewedAt: "2026-07-31",
      biography:
        "Jay Dean is the current Representative for Texas House District 7. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 7 since 2017-01-10.",
        "Capitol office: Room GN.11, P.O. Box 12910, Austin, TX 78711",
        "District office: 101 E. Methvin Suite 103, Longview, TX 75601",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Energy Resources", "Health Care Affordability Select", "Insurance — Chair"],
      electionHistory: [
        {
          year: "2017",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 7. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Jay Dean", "Representative Jay Dean", "Texas House District 7"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3515",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3515/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "cody-harris",
    name: "Cody Harris",
    chamber: "house",
    district: 8,
    party: "R",
    website: "https://house.texas.gov/members/3580",
    imageUrl: "https://house.texas.gov/images/members/3580.jpg?v=3",
    officialCode: null,
    home: "519 N. Sycamore, Palestine, TX 75801",
    phone: "512-463-0730",
    capitolAddress: "Room E2.504, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "519 N. Sycamore, Palestine, TX 75801",
    vacant: false,
    authority: {
      slug: "cody-harris",
      reviewedAt: "2026-07-31",
      biography:
        "Cody Harris is the current Representative for Texas House District 8. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 8 since 2019-01-08.",
        "Capitol office: Room E2.504, P.O. Box 12910, Austin, TX 78711",
        "District office: 519 N. Sycamore, Palestine, TX 75801",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Calendars",
        "Licensing and Administrative Procedures",
        "Natural Resources — Chair",
      ],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 8. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Cody Harris", "Representative Cody Harris", "Texas House District 8"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3580",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3580/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "trent-ashby",
    name: "Trent Ashby",
    chamber: "house",
    district: 9,
    party: "R",
    website: "https://house.texas.gov/members/2330",
    imageUrl: "https://house.texas.gov/images/members/2330.jpg?v=1",
    officialCode: null,
    home: "2915 Atkinson Drive, Lufkin, TX 75901",
    phone: "512-463-0508",
    capitolAddress: "Room E2.806, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "2915 Atkinson Drive, Lufkin, TX 75901",
    vacant: false,
    authority: {
      slug: "trent-ashby",
      reviewedAt: "2026-07-31",
      biography:
        "Trent Ashby is the current Representative for Texas House District 9. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 9 since 2023-01-10.",
        "Capitol office: Room E2.806, P.O. Box 12910, Austin, TX 78711",
        "District office: 2915 Atkinson Drive, Lufkin, TX 75901",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Natural Resources", "Public Education"],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 9. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Trent Ashby", "Representative Trent Ashby", "Texas House District 9"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2330",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2330/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "brian-harrison",
    name: "Brian Harrison",
    chamber: "house",
    district: 10,
    party: "R",
    website: "https://house.texas.gov/members/4085",
    imageUrl: "https://house.texas.gov/images/members/4085.jpg?v=1",
    officialCode: null,
    home: "100 N. College St. Suite 306, Waxahachie, TX 75165",
    phone: "512-463-0516",
    capitolAddress: "Room E1.414, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "100 N. College St. Suite 306, Waxahachie, TX 75165",
    vacant: false,
    authority: {
      slug: "brian-harrison",
      reviewedAt: "2026-07-31",
      biography:
        "Brian Harrison is the current Representative for Texas House District 10. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 10 since 2021-10-12.",
        "Capitol office: Room E1.414, P.O. Box 12910, Austin, TX 78711",
        "District office: 100 N. College St. Suite 306, Waxahachie, TX 75165",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Appropriations", "Corrections"],
      electionHistory: [
        {
          year: "2021",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 10. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Brian Harrison", "Representative Brian Harrison", "Texas House District 10"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4085",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4085/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "joanne-shofner",
    name: "Joanne Shofner",
    chamber: "house",
    district: 11,
    party: "R",
    website: "https://house.texas.gov/members/11",
    imageUrl: "https://www.house.texas.gov/images/members/4755.jpg?v=1",
    officialCode: null,
    home: "Room 310, 202 E. Pilar St., Nacogdoches, TX 75961",
    phone: "512-463-0592",
    capitolAddress: "Room E1.208, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "Room 310, 202 E. Pilar St., Nacogdoches, TX 75961",
    vacant: false,
    authority: {
      slug: "joanne-shofner",
      reviewedAt: "2026-07-31",
      biography:
        "Joanne Shofner is the current Representative for Texas House District 11. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 11 since 2025-01-14.",
        "Capitol office: Room E1.208, P.O. Box 12910, Austin, TX 78711",
        "District office: Room 310, 202 E. Pilar St., Nacogdoches, TX 75961",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Higher Education", "Public Health"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 11. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Joanne Shofner", "Representative Joanne Shofner", "Texas House District 11"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/11",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4755/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "trey-wharton",
    name: "Trey Wharton",
    chamber: "house",
    district: 12,
    party: "R",
    website: "https://house.texas.gov/members/4795",
    imageUrl: "https://house.texas.gov/images/members/4795.jpg?v=1",
    officialCode: null,
    home: "2503 Lake Road Suite A-100, Huntsville, TX 77340",
    phone: "512-463-0412",
    capitolAddress: "Room E1.312, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "2503 Lake Road Suite A-100, Huntsville, TX 77340",
    vacant: false,
    authority: {
      slug: "trey-wharton",
      reviewedAt: "2026-07-31",
      biography:
        "Trey Wharton is the current Representative for Texas House District 12. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 12 since 2025-01-14.",
        "Capitol office: Room E1.312, P.O. Box 12910, Austin, TX 78711",
        "District office: 2503 Lake Road Suite A-100, Huntsville, TX 77340",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Corrections", "Health Care Affordability Select", "Insurance"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 12. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Trey Wharton", "Representative Trey Wharton", "Texas House District 12"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4795",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4795/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "angelia-orr",
    name: "Angelia Orr",
    chamber: "house",
    district: 13,
    party: "R",
    website: "https://house.texas.gov/members/4340",
    imageUrl: "https://house.texas.gov/images/members/4340.jpg?v=1",
    officialCode: null,
    home: "214 E. Elm St., Hillsboro, TX 76645",
    phone: "512-463-0600",
    capitolAddress: "Room E1.220, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "214 E. Elm St., Hillsboro, TX 76645",
    vacant: false,
    authority: {
      slug: "angelia-orr",
      reviewedAt: "2026-07-31",
      biography:
        "Angelia Orr is the current Representative for Texas House District 13. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 13 since 2023-01-10.",
        "Capitol office: Room E1.220, P.O. Box 12910, Austin, TX 78711",
        "District office: 214 E. Elm St., Hillsboro, TX 76645",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Appropriations", "Culture, Recreation and Tourism"],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 13. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Angelia Orr", "Representative Angelia Orr", "Texas House District 13"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4340",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4340/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "paul-dyson",
    name: "Paul Dyson",
    chamber: "house",
    district: 14,
    party: "R",
    website: "https://house.texas.gov/members/14",
    imageUrl: "https://www.house.texas.gov/images/members/4475.jpg?v=1",
    officialCode: null,
    home: "3000 Briarcrest Drive Suite 212, Bryan, TX 77802",
    phone: "512-463-0698",
    capitolAddress: "Room E2.702, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "3000 Briarcrest Drive Suite 212, Bryan, TX 77802",
    vacant: false,
    authority: {
      slug: "paul-dyson",
      reviewedAt: "2026-07-31",
      biography:
        "Paul Dyson is the current Representative for Texas House District 14. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 14 since 2025-01-14.",
        "Capitol office: Room E2.702, P.O. Box 12910, Austin, TX 78711",
        "District office: 3000 Briarcrest Drive Suite 212, Bryan, TX 77802",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Energy Resources",
        "General Investigating Committee on the July 2025 Flooding Events",
        "Judiciary and Civil Jurisprudence",
      ],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 14. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Paul Dyson", "Representative Paul Dyson", "Texas House District 14"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/14",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4475/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "steve-toth",
    name: "Steve Toth",
    chamber: "house",
    district: 15,
    party: "R",
    website: "https://house.texas.gov/members/2825",
    imageUrl: "https://house.texas.gov/images/members/2825.jpg?v=1",
    officialCode: null,
    home: "25700 Interstate Highway 45 Suite 180, Spring, TX 77386",
    phone: "512-463-0797",
    capitolAddress: "Room E1.404, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "25700 Interstate Highway 45 Suite 180, Spring, TX 77386",
    vacant: false,
    authority: {
      slug: "steve-toth",
      reviewedAt: "2026-07-31",
      biography:
        "Steve Toth is the current Representative for Texas House District 15. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 15 since 2019-01-08.",
        "Capitol office: Room E1.404, P.O. Box 12910, Austin, TX 78711",
        "District office: 25700 Interstate Highway 45 Suite 180, Spring, TX 77386",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Elections", "Environmental Regulation"],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 15. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Steve Toth", "Representative Steve Toth", "Texas House District 15"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2825",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2825/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "will-metcalf",
    name: "Will Metcalf",
    chamber: "house",
    district: 16,
    party: "R",
    website: "https://house.texas.gov/members/2900",
    imageUrl: "https://house.texas.gov/images/members/2900.jpg?v=1",
    officialCode: null,
    home: "100 Nugent St., Conroe, TX 77301",
    phone: "512-463-0726",
    capitolAddress: "Room 1N.12, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "100 Nugent St., Conroe, TX 77301",
    vacant: false,
    authority: {
      slug: "will-metcalf",
      reviewedAt: "2026-07-31",
      biography:
        "Will Metcalf is the current Representative for Texas House District 16. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 16 since 2015-01-13.",
        "Capitol office: Room 1N.12, P.O. Box 12910, Austin, TX 78711",
        "District office: 100 Nugent St., Conroe, TX 77301",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Congressional Redistricting Select",
        "Culture, Recreation and Tourism — Chair",
        "State Affairs",
      ],
      electionHistory: [
        {
          year: "2015",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 16. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Will Metcalf", "Representative Will Metcalf", "Texas House District 16"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2900",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2900/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "stan-gerdes",
    name: "Stan Gerdes",
    chamber: "house",
    district: 17,
    party: "R",
    website: "https://house.texas.gov/members/4195",
    imageUrl: "https://house.texas.gov/images/members/4195.jpg?v=1",
    officialCode: null,
    home: "1011 Alley A St., #B, Bastrop, TX 78602",
    phone: "512-463-0682",
    capitolAddress: "Room E2.604, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "1011 Alley A St., #B, Bastrop, TX 78602",
    vacant: false,
    authority: {
      slug: "stan-gerdes",
      reviewedAt: "2026-07-31",
      biography:
        "Stan Gerdes is the current Representative for Texas House District 17. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 17 since 2023-01-10.",
        "Capitol office: Room E2.604, P.O. Box 12910, Austin, TX 78711",
        "District office: 1011 Alley A St., #B, Bastrop, TX 78602",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Calendars", "Energy Resources", "Licensing and Administrative Procedures"],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 17. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Stan Gerdes", "Representative Stan Gerdes", "Texas House District 17"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4195",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4195/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "janis-holt",
    name: "Janis Holt",
    chamber: "house",
    district: 18,
    party: "R",
    website: "https://house.texas.gov/members/18",
    imageUrl: "https://www.house.texas.gov/images/members/4535.jpg?v=2",
    officialCode: null,
    home: "1023 N. Main St. Suite 103, Liberty, TX 77575",
    phone: "512-463-0570",
    capitolAddress: "Room E1.416, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "1023 N. Main St. Suite 103, Liberty, TX 77575",
    vacant: false,
    authority: {
      slug: "janis-holt",
      reviewedAt: "2026-07-31",
      biography:
        "Janis Holt is the current Representative for Texas House District 18. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 18 since 2025-01-14.",
        "Capitol office: Room E1.416, P.O. Box 12910, Austin, TX 78711",
        "District office: 1023 N. Main St. Suite 103, Liberty, TX 77575",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Homeland Security, Public Safety and Veterans' Affairs",
        "Pensions, Investments and Financial Services",
      ],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 18. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Janis Holt", "Representative Janis Holt", "Texas House District 18"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/18",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4535/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "ellen-troxclair",
    name: "Ellen Troxclair",
    chamber: "house",
    district: 19,
    party: "R",
    website: "https://house.texas.gov/members/19",
    imageUrl: "https://house.texas.gov/images/members/4385.jpg?v=1",
    officialCode: null,
    home: "100 Avenue G Third Floor, Marble Falls, TX 78654",
    phone: "512-463-0490",
    capitolAddress: "Room E1.322, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "100 Avenue G Third Floor, Marble Falls, TX 78654",
    vacant: false,
    authority: {
      slug: "ellen-troxclair",
      reviewedAt: "2026-07-31",
      biography:
        "Ellen Troxclair is the current Representative for Texas House District 19. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 19 since 2023-01-10.",
        "Capitol office: Room E1.322, P.O. Box 12910, Austin, TX 78711",
        "District office: 100 Avenue G Third Floor, Marble Falls, TX 78654",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Delivery of Government Efficiency",
        "Governmental Oversight Select",
        "Ways and Means",
      ],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 19. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Ellen Troxclair",
        "Representative Ellen Troxclair",
        "Texas House District 19",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/19",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4385/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "terry-wilson",
    name: "Terry Wilson",
    chamber: "house",
    district: 20,
    party: "R",
    website: "https://house.texas.gov/members/3525",
    imageUrl: "https://house.texas.gov/images/members/3525.jpg?v=1",
    officialCode: null,
    home: "710 Main St. Suite 242, Georgetown, TX 78626",
    phone: "512-463-0309",
    capitolAddress: "Room E2.722, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "710 Main St. Suite 242, Georgetown, TX 78626",
    vacant: false,
    authority: {
      slug: "terry-wilson",
      reviewedAt: "2026-07-31",
      biography:
        "Terry Wilson is the current Representative for Texas House District 20. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 20 since 2017-01-10.",
        "Capitol office: Room E2.722, P.O. Box 12910, Austin, TX 78711",
        "District office: 710 Main St. Suite 242, Georgetown, TX 78626",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Civil Discourse and Freedom of Speech in Higher Education Select — Chair",
        "Congressional Redistricting Select",
        "Disaster Preparedness and Flooding Select",
        "Elections",
        "Higher Education — Chair",
        "Redistricting",
      ],
      electionHistory: [
        {
          year: "2017",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 20. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Terry Wilson", "Representative Terry Wilson", "Texas House District 20"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3525",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3525/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "dade-phelan",
    name: "Dade Phelan",
    chamber: "house",
    district: 21,
    party: "R",
    website: "https://house.texas.gov/members/2905",
    imageUrl: "https://house.texas.gov/images/members/2905.jpg?v=1",
    officialCode: null,
    home: "812 N. 16th St., Orange, TX 77630",
    phone: "512-463-0706",
    capitolAddress: "Room GW.8, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "812 N. 16th St., Orange, TX 77630",
    vacant: false,
    authority: {
      slug: "dade-phelan",
      reviewedAt: "2026-07-31",
      biography:
        "Dade Phelan is the current Representative for Texas House District 21. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 21 since 2015-01-13.",
        "Capitol office: Room GW.8, P.O. Box 12910, Austin, TX 78711",
        "District office: 812 N. 16th St., Orange, TX 77630",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Licensing and Administrative Procedures — Chair", "State Affairs"],
      electionHistory: [
        {
          year: "2015",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 21. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Dade Phelan", "Representative Dade Phelan", "Texas House District 21"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2905",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2905/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "christian-manuel",
    name: "Christian Manuel",
    chamber: "house",
    district: 22,
    party: "D",
    website: "https://house.texas.gov/members/4255",
    imageUrl: "https://house.texas.gov/images/members/4255.jpg?v=1",
    officialCode: null,
    home: "2300 Highway 365 Suite 360, Nederland, TX 77627",
    phone: "512-463-0662",
    capitolAddress: "Room E2.412, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "2300 Highway 365 Suite 360, Nederland, TX 77627",
    vacant: false,
    authority: {
      slug: "christian-manuel",
      reviewedAt: "2026-07-31",
      biography:
        "Christian Manuel is the current Representative for Texas House District 22. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 22 since 2023-01-10.",
        "Capitol office: Room E2.412, P.O. Box 12910, Austin, TX 78711",
        "District office: 2300 Highway 365 Suite 360, Nederland, TX 77627",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Appropriations",
        "Congressional Redistricting Select",
        "Governmental Oversight Select",
        "Human Services — Vice Chair",
        "Redistricting",
      ],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 22. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Christian Manuel",
        "Representative Christian Manuel",
        "Texas House District 22",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4255",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4255/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "terri-leo-wilson",
    name: "Terri Leo-Wilson",
    chamber: "house",
    district: 23,
    party: "R",
    website: "https://house.texas.gov/members/4290",
    imageUrl: "https://house.texas.gov/images/members/4290.jpg?v=1",
    officialCode: null,
    home: "305 21st St. Suite 241, Galveston, TX 77550",
    phone: "512-463-0502",
    capitolAddress: "Room E2.810, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "305 21st St. Suite 241, Galveston, TX 77550",
    vacant: false,
    authority: {
      slug: "terri-leo-wilson",
      reviewedAt: "2026-07-31",
      biography:
        "Terri Leo-Wilson is the current Representative for Texas House District 23. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 23 since 2023-01-10.",
        "Capitol office: Room E2.810, P.O. Box 12910, Austin, TX 78711",
        "District office: 305 21st St. Suite 241, Galveston, TX 77550",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Intergovernmental Affairs", "Public Education"],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 23. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Terri Leo-Wilson",
        "Representative Terri Leo-Wilson",
        "Texas House District 23",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4290",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4290/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "greg-bonnen",
    name: "Greg Bonnen",
    chamber: "house",
    district: 24,
    party: "R",
    website: "https://house.texas.gov/members/24",
    imageUrl: "https://house.texas.gov/images/members/2875.jpg?v=1",
    officialCode: null,
    home: "174 Calder Road Suite 1000, League City, TX 77573",
    phone: "512-463-0729",
    capitolAddress: "Room E2.502, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "174 Calder Road Suite 1000, League City, TX 77573",
    vacant: false,
    authority: {
      slug: "greg-bonnen",
      reviewedAt: "2026-07-31",
      biography:
        "Greg Bonnen is the current Representative for Texas House District 24. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 24 since 2013-01-08.",
        "Capitol office: Room E2.502, P.O. Box 12910, Austin, TX 78711",
        "District office: 174 Calder Road Suite 1000, League City, TX 77573",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Appropriations — Chair",
        "Disaster Preparedness and Flooding Select",
        "General Investigating",
        "Legislative Budget Board",
      ],
      electionHistory: [
        {
          year: "2013",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 24. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Greg Bonnen", "Representative Greg Bonnen", "Texas House District 24"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/24",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2875/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "cody-vasut",
    name: "Cody Vasut",
    chamber: "house",
    district: 25,
    party: "R",
    website: "https://house.texas.gov/members/4065",
    imageUrl: "https://house.texas.gov/images/members/4065.jpg?v=1",
    officialCode: null,
    home: "222 N. Velasco St. Suite 25, Angleton, TX 77515",
    phone: "512-463-0564",
    capitolAddress: "Room E1.314, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "222 N. Velasco St. Suite 25, Angleton, TX 77515",
    vacant: false,
    authority: {
      slug: "cody-vasut",
      reviewedAt: "2026-07-31",
      biography:
        "Cody Vasut is the current Representative for Texas House District 25. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 25 since 2021-01-12.",
        "Capitol office: Room E1.314, P.O. Box 12910, Austin, TX 78711",
        "District office: 222 N. Velasco St. Suite 25, Angleton, TX 77515",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Congressional Redistricting Select — Chair",
        "Culture, Recreation and Tourism",
        "Governmental Oversight Select — Chair",
        "Redistricting — Chair",
        "Ways and Means",
      ],
      electionHistory: [
        {
          year: "2021",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 25. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Cody Vasut", "Representative Cody Vasut", "Texas House District 25"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4065",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4065/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "matt-morgan",
    name: "Matt Morgan",
    chamber: "house",
    district: 26,
    party: "R",
    website: "https://house.texas.gov/members/26",
    imageUrl: "https://www.house.texas.gov/images/members/4675.jpg?v=1",
    officialCode: null,
    home: "22333 Grand Corner Drive, Katy, TX 77494",
    phone: "512-463-0710",
    capitolAddress: "Room E2.802, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "22333 Grand Corner Drive, Katy, TX 77494",
    vacant: false,
    authority: {
      slug: "matt-morgan",
      reviewedAt: "2026-07-31",
      biography:
        "Matt Morgan is the current Representative for Texas House District 26. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 26 since 2025-01-14.",
        "Capitol office: Room E2.802, P.O. Box 12910, Austin, TX 78711",
        "District office: 22333 Grand Corner Drive, Katy, TX 77494",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Insurance", "Land and Resource Management"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 26. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Matt Morgan", "Representative Matt Morgan", "Texas House District 26"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/26",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/26",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "ron-reynolds",
    name: "Ron Reynolds",
    chamber: "house",
    district: 27,
    party: "D",
    website: "https://house.texas.gov/members/2040",
    imageUrl: "https://house.texas.gov/images/members/2040.jpg?v=1",
    officialCode: null,
    home: "2440 Texas Parkway Suite 102, Missouri City, TX 77489",
    phone: "512-463-0494",
    capitolAddress: "Room 4N.7, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "2440 Texas Parkway Suite 102, Missouri City, TX 77489",
    vacant: false,
    authority: {
      slug: "ron-reynolds",
      reviewedAt: "2026-07-31",
      biography:
        "Ron Reynolds is the current Representative for Texas House District 27. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 27 since 2011-01-11.",
        "Capitol office: Room 4N.7, P.O. Box 12910, Austin, TX 78711",
        "District office: 2440 Texas Parkway Suite 102, Missouri City, TX 77489",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Administration", "Energy Resources", "Environmental Regulation"],
      electionHistory: [
        {
          year: "2011",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 27. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Ron Reynolds", "Representative Ron Reynolds", "Texas House District 27"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2040",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2040/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "gary-gates",
    name: "Gary Gates",
    chamber: "house",
    district: 28,
    party: "R",
    website: "https://house.texas.gov/members/3920",
    imageUrl: "https://house.texas.gov/images/members/3920.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0657",
    capitolAddress: "Room E2.322, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "gary-gates",
      reviewedAt: "2026-07-31",
      biography:
        "Gary Gates is the current Representative for Texas House District 28. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 28 since 2020-01-11.",
        "Capitol office: Room E2.322, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Energy Resources",
        "General Aviation Select",
        "Land and Resource Management — Chair",
      ],
      electionHistory: [
        {
          year: "2020",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 28. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Gary Gates", "Representative Gary Gates", "Texas House District 28"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3920",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3920/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "jeff-barry",
    name: "Jeff Barry",
    chamber: "house",
    district: 29,
    party: "R",
    website: "https://house.texas.gov/members/29",
    imageUrl: "https://www.house.texas.gov/images/members/4405.jpg?v=1",
    officialCode: null,
    home: "2341 N. Galveston Ave., Pearland, TX 77581",
    phone: "512-463-0707",
    capitolAddress: "Room E2.814, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "2341 N. Galveston Ave., Pearland, TX 77581",
    vacant: false,
    authority: {
      slug: "jeff-barry",
      reviewedAt: "2026-07-31",
      biography:
        "Jeff Barry is the current Representative for Texas House District 29. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 29 since 2025-01-14.",
        "Capitol office: Room E2.814, P.O. Box 12910, Austin, TX 78711",
        "District office: 2341 N. Galveston Ave., Pearland, TX 77581",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Appropriations", "Local and Consent Calendars", "Natural Resources"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 29. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Jeff Barry", "Representative Jeff Barry", "Texas House District 29"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/29",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4405/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "a-j-louderback",
    name: "A.J. Louderback",
    chamber: "house",
    district: 30,
    party: "R",
    website: "https://house.texas.gov/members/4620",
    imageUrl: "https://house.texas.gov/images/members/4620.jpg?v=1",
    officialCode: null,
    home: "5606 N. Navarro St. Suite 200-A, Victoria, TX 77904",
    phone: "512-463-0456",
    capitolAddress: "Room E1.418, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "5606 N. Navarro St. Suite 200-A, Victoria, TX 77904",
    vacant: false,
    authority: {
      slug: "a-j-louderback",
      reviewedAt: "2026-07-31",
      biography:
        "A.J. Louderback is the current Representative for Texas House District 30. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 30 since 2025-01-14.",
        "Capitol office: Room E1.418, P.O. Box 12910, Austin, TX 78711",
        "District office: 5606 N. Navarro St. Suite 200-A, Victoria, TX 77904",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Criminal Jurisprudence",
        "Disaster Preparedness and Flooding Select",
        "Governmental Oversight Select",
        "Homeland Security, Public Safety and Veterans' Affairs",
      ],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 30. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "A.J. Louderback",
        "Representative A.J. Louderback",
        "Texas House District 30",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4620",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4620/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "ryan-guillen",
    name: "Ryan Guillen",
    chamber: "house",
    district: 31,
    party: "R",
    website: "https://house.texas.gov/members/3045",
    imageUrl: "https://house.texas.gov/images/members/3045.jpg?v=1",
    officialCode: null,
    home: "100 North F.M. 3167 Suite 212, Rio Grande City, TX 78582",
    phone: "512-463-0416",
    capitolAddress: "Room 3N.6, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "100 North F.M. 3167 Suite 212, Rio Grande City, TX 78582",
    vacant: false,
    authority: {
      slug: "ryan-guillen",
      reviewedAt: "2026-07-31",
      biography:
        "Ryan Guillen is the current Representative for Texas House District 31. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 31 since 2003-01-14.",
        "Capitol office: Room 3N.6, P.O. Box 12910, Austin, TX 78711",
        "District office: 100 North F.M. 3167 Suite 212, Rio Grande City, TX 78582",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Agriculture and Livestock — Chair",
        "Congressional Redistricting Select",
        "Redistricting",
        "State Affairs",
      ],
      electionHistory: [
        {
          year: "2003",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 31. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Ryan Guillen", "Representative Ryan Guillen", "Texas House District 31"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3045",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3045/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "todd-hunter",
    name: "Todd Hunter",
    chamber: "house",
    district: 32,
    party: "R",
    website: "https://house.texas.gov/members/3365",
    imageUrl: "https://house.texas.gov/images/members/3365.jpg?v=1",
    officialCode: null,
    home: "15217 S. Padre Island Drive Suite 201, Corpus Christi, TX 78418",
    phone: "512-463-0672",
    capitolAddress: "Room 1W.6, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "15217 S. Padre Island Drive Suite 201, Corpus Christi, TX 78418",
    vacant: false,
    authority: {
      slug: "todd-hunter",
      reviewedAt: "2026-07-31",
      biography:
        "Todd Hunter is the current Representative for Texas House District 32. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 32 since 2009-01-13.",
        "Capitol office: Room 1W.6, P.O. Box 12910, Austin, TX 78711",
        "District office: 15217 S. Padre Island Drive Suite 201, Corpus Christi, TX 78418",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Calendars — Chair",
        "Congressional Redistricting Select",
        "Land and Resource Management",
        "Public Education",
      ],
      electionHistory: [
        {
          year: "2009",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 32. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Todd Hunter", "Representative Todd Hunter", "Texas House District 32"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3365",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3365/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "katrina-pierson",
    name: "Katrina Pierson",
    chamber: "house",
    district: 33,
    party: "R",
    website: "https://house.texas.gov/members/33",
    imageUrl: "https://www.house.texas.gov/images/members/4715.jpg?v=2",
    officialCode: null,
    home: "101 E. Rusk St. Suite 201, Rockwall, TX 75087",
    phone: "512-463-0484",
    capitolAddress: "Room E2.714, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "101 E. Rusk St. Suite 201, Rockwall, TX 75087",
    vacant: false,
    authority: {
      slug: "katrina-pierson",
      reviewedAt: "2026-07-31",
      biography:
        "Katrina Pierson is the current Representative for Texas House District 33. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 33 since 2025-01-14.",
        "Capitol office: Room E2.714, P.O. Box 12910, Austin, TX 78711",
        "District office: 101 E. Rusk St. Suite 201, Rockwall, TX 75087",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Congressional Redistricting Select",
        "Homeland Security, Public Safety and Veterans' Affairs",
        "Public Health",
      ],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 33. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Katrina Pierson",
        "Representative Katrina Pierson",
        "Texas House District 33",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/33",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4715/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "denise-villalobos",
    name: "Denise Villalobos",
    chamber: "house",
    district: 34,
    party: "R",
    website: "https://house.texas.gov/members/34",
    imageUrl: "https://house.texas.gov/images/members/4770.jpg?v=1",
    officialCode: null,
    home: "101 E. Main Ave., Robstown, TX 78380",
    phone: "512-463-0462",
    capitolAddress: "Room E2.812, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "101 E. Main Ave., Robstown, TX 78380",
    vacant: false,
    authority: {
      slug: "denise-villalobos",
      reviewedAt: "2026-07-31",
      biography:
        "Denise Villalobos is the current Representative for Texas House District 34. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 34 since 2025-01-14.",
        "Capitol office: Room E2.812, P.O. Box 12910, Austin, TX 78711",
        "District office: 101 E. Main Ave., Robstown, TX 78380",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Appropriations",
        "Health Care Affordability Select",
        "Local and Consent Calendars",
        "Natural Resources",
      ],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 34. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Denise Villalobos",
        "Representative Denise Villalobos",
        "Texas House District 34",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/34",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4770/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "oscar-longoria",
    name: "Oscar Longoria",
    chamber: "house",
    district: 35,
    party: "D",
    website: "https://house.texas.gov/members/2485",
    imageUrl: "https://house.texas.gov/images/members/2485.jpg?v=1",
    officialCode: null,
    home: "126 E. Commercial Ave., La Feria, TX 78559",
    phone: "512-463-0645",
    capitolAddress: "Room 4N.4, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "126 E. Commercial Ave., La Feria, TX 78559",
    vacant: false,
    authority: {
      slug: "oscar-longoria",
      reviewedAt: "2026-07-31",
      biography:
        "Oscar Longoria is the current Representative for Texas House District 35. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 35 since 2013-01-08.",
        "Capitol office: Room 4N.4, P.O. Box 12910, Austin, TX 78711",
        "District office: 126 E. Commercial Ave., La Feria, TX 78559",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Licensing and Administrative Procedures",
        "Trade, Workforce and Economic Development",
      ],
      electionHistory: [
        {
          year: "2013",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 35. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Oscar Longoria", "Representative Oscar Longoria", "Texas House District 35"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2485",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2485/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "sergio-munoz",
    name: "Sergio Muñoz",
    chamber: "house",
    district: 36,
    party: "D",
    website: "https://house.texas.gov/members/2060",
    imageUrl: "https://house.texas.gov/images/members/2060.jpg?v=1",
    officialCode: null,
    home: "121 E. Tom Landry St., Mission, TX 78572",
    phone: "512-463-0704",
    capitolAddress: "Room 1N.8, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "121 E. Tom Landry St., Mission, TX 78572",
    vacant: false,
    authority: {
      slug: "sergio-munoz",
      reviewedAt: "2026-07-31",
      biography:
        "Sergio Muñoz is the current Representative for Texas House District 36. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 36 since 2011-01-11.",
        "Capitol office: Room 1N.8, P.O. Box 12910, Austin, TX 78711",
        "District office: 121 E. Tom Landry St., Mission, TX 78572",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Agriculture and Livestock", "Ways and Means"],
      electionHistory: [
        {
          year: "2011",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 36. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Sergio Muñoz", "Representative Sergio Muñoz", "Texas House District 36"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2060",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2060/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "janie-lopez",
    name: "Janie Lopez",
    chamber: "house",
    district: 37,
    party: "R",
    website: "https://house.texas.gov/members/37",
    imageUrl: "https://house.texas.gov/images/members/4295.jpg?v=2",
    officialCode: null,
    home: "1390 W. Expressway 83, San Benito, TX 78586",
    phone: "512-463-0640",
    capitolAddress: "Room E1.422, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "1390 W. Expressway 83, San Benito, TX 78586",
    vacant: false,
    authority: {
      slug: "janie-lopez",
      reviewedAt: "2026-07-31",
      biography:
        "Janie Lopez is the current Representative for Texas House District 37. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 37 since 2023-01-10.",
        "Capitol office: Room E1.422, P.O. Box 12910, Austin, TX 78711",
        "District office: 1390 W. Expressway 83, San Benito, TX 78586",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Agriculture and Livestock", "Appropriations", "Calendars"],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 37. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Janie Lopez", "Representative Janie Lopez", "Texas House District 37"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/37",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4295/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "erin-gamez",
    name: "Erin Gámez",
    chamber: "house",
    district: 38,
    party: "D",
    website: "https://house.texas.gov/members/38",
    imageUrl: "https://house.texas.gov/images/members/4095.jpg?v=1",
    officialCode: null,
    home: "777 E. Harrison St. Second Floor, Brownsville, TX 78520",
    phone: "512-463-0606",
    capitolAddress: "Room E1.510, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "777 E. Harrison St. Second Floor, Brownsville, TX 78520",
    vacant: false,
    authority: {
      slug: "erin-gamez",
      reviewedAt: "2026-07-31",
      biography:
        "Erin Gámez is the current Representative for Texas House District 38. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 38 since 2022-03-15.",
        "Capitol office: Room E1.510, P.O. Box 12910, Austin, TX 78711",
        "District office: 777 E. Harrison St. Second Floor, Brownsville, TX 78520",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "General Investigating Committee on the July 2025 Flooding Events",
        "General Investigating — Vice Chair",
        "Natural Resources",
        "Transportation",
      ],
      electionHistory: [
        {
          year: "2022",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 38. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Erin Gámez", "Representative Erin Gámez", "Texas House District 38"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/38",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4095/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "mando-martinez",
    name: "Mando Martinez",
    chamber: "house",
    district: 39,
    party: "D",
    website: "https://house.texas.gov/members/3780",
    imageUrl: "https://house.texas.gov/images/members/3780.jpg?v=1",
    officialCode: null,
    home: "914 W. Pike Blvd., Weslaco, TX 78596",
    phone: "512-463-0530",
    capitolAddress: "Room 1N.10, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "914 W. Pike Blvd., Weslaco, TX 78596",
    vacant: false,
    authority: {
      slug: "mando-martinez",
      reviewedAt: "2026-07-31",
      biography:
        "Mando Martinez is the current Representative for Texas House District 39. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 39 since 2005-01-11.",
        "Capitol office: Room 1N.10, P.O. Box 12910, Austin, TX 78711",
        "District office: 914 W. Pike Blvd., Weslaco, TX 78596",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Administration",
        "Appropriations",
        "Disaster Preparedness and Flooding Select — Vice Chair",
        "General Aviation Select — Vice Chair",
        "Natural Resources — Vice Chair",
      ],
      electionHistory: [
        {
          year: "2005",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 39. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Mando Martinez", "Representative Mando Martinez", "Texas House District 39"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3780",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3780/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "terry-canales",
    name: "Terry Canales",
    chamber: "house",
    district: 40,
    party: "D",
    website: "https://house.texas.gov/members/2340",
    imageUrl: "https://house.texas.gov/images/members/2340.jpg",
    officialCode: null,
    home: "602 W. University Drive Suite B, Edinburg, TX 78539",
    phone: "512-463-0426",
    capitolAddress: "Room 4S.4, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "602 W. University Drive Suite B, Edinburg, TX 78539",
    vacant: false,
    authority: {
      slug: "terry-canales",
      reviewedAt: "2026-07-31",
      biography:
        "Terry Canales is the current Representative for Texas House District 40. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 40 since 2013-01-08.",
        "Capitol office: Room 4S.4, P.O. Box 12910, Austin, TX 78711",
        "District office: 602 W. University Drive Suite B, Edinburg, TX 78539",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Calendars",
        "General Aviation Select",
        "Homeland Security, Public Safety and Veterans' Affairs",
        "Transportation",
      ],
      electionHistory: [
        {
          year: "2013",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 40. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Terry Canales", "Representative Terry Canales", "Texas House District 40"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2340",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2340/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "bobby-guerra",
    name: "Bobby Guerra",
    chamber: "house",
    district: 41,
    party: "D",
    website: "https://house.texas.gov/members/2325",
    imageUrl: "https://house.texas.gov/images/members/2325.jpg?v=1",
    officialCode: null,
    home: "10213 N. 10th St. Suite B, McAllen, TX 78504",
    phone: "512-463-0578",
    capitolAddress: "Room GN.7, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "10213 N. 10th St. Suite B, McAllen, TX 78504",
    vacant: false,
    authority: {
      slug: "bobby-guerra",
      reviewedAt: "2026-07-31",
      biography:
        "Bobby Guerra is the current Representative for Texas House District 41. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 41 since 2012-09-25.",
        "Capitol office: Room GN.7, P.O. Box 12910, Austin, TX 78711",
        "District office: 10213 N. 10th St. Suite B, McAllen, TX 78504",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Agriculture and Livestock — Vice Chair",
        "Congressional Redistricting Select",
        "Energy Resources",
        "Redistricting",
      ],
      electionHistory: [
        {
          year: "2012",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 41. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Bobby Guerra", "Representative Bobby Guerra", "Texas House District 41"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2325",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2325/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "richard-raymond",
    name: "Richard Raymond",
    chamber: "house",
    district: 42,
    party: "D",
    website: "https://house.texas.gov/members/4215",
    imageUrl: "https://house.texas.gov/images/members/4215.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0558",
    capitolAddress: "Room 1W.2, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "richard-raymond",
      reviewedAt: "2026-07-31",
      biography:
        "Richard Raymond is the current Representative for Texas House District 42. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 42 since 2021-01-24.",
        "Capitol office: Room 1W.2, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Civil Discourse and Freedom of Speech in Higher Education Select — Vice Chair",
        "Elections",
        "Governmental Oversight Select",
        "State Affairs",
      ],
      electionHistory: [
        {
          year: "2021",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 42. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Richard Raymond",
        "Representative Richard Raymond",
        "Texas House District 42",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4215",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4215/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "j-m-lozano",
    name: "J.M. Lozano",
    chamber: "house",
    district: 43,
    party: "R",
    website: "https://house.texas.gov/members/2065",
    imageUrl: "https://house.texas.gov/images/members/2065.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0463",
    capitolAddress: "Room 1W.4, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "j-m-lozano",
      reviewedAt: "2026-07-31",
      biography:
        "J.M. Lozano is the current Representative for Texas House District 43. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 43 since 2012-03-08.",
        "Capitol office: Room 1W.4, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Appropriations", "Corrections"],
      electionHistory: [
        {
          year: "2012",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 43. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["J.M. Lozano", "Representative J.M. Lozano", "Texas House District 43"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2065",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2065/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "alan-schoolcraft",
    name: "Alan Schoolcraft",
    chamber: "house",
    district: 44,
    party: "R",
    website: "https://house.texas.gov/members/4745",
    imageUrl: "https://house.texas.gov/images/members/4745.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0602",
    capitolAddress: "Room E1.308, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "alan-schoolcraft",
      reviewedAt: "2026-07-31",
      biography:
        "Alan Schoolcraft is the current Representative for Texas House District 44. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 44 since 2025-01-14.",
        "Capitol office: Room E1.308, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Pensions, Investments and Financial Services", "Public Education"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 44. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Alan Schoolcraft",
        "Representative Alan Schoolcraft",
        "Texas House District 44",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4745",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4745/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "erin-zwiener",
    name: "Erin Zwiener",
    chamber: "house",
    district: 45,
    party: "D",
    website: "https://house.texas.gov/members/3710",
    imageUrl: "https://house.texas.gov/images/members/3710.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0647",
    capitolAddress: "Room E2.306, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "erin-zwiener",
      reviewedAt: "2026-07-31",
      biography:
        "Erin Zwiener is the current Representative for Texas House District 45. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 45 since 2019-01-08.",
        "Capitol office: Room E2.306, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Governmental Oversight Select",
        "Intergovernmental Affairs — Vice Chair",
        "Local and Consent Calendars",
        "Natural Resources",
      ],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 45. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Erin Zwiener", "Representative Erin Zwiener", "Texas House District 45"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3710",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3710/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "sheryl-cole",
    name: "Sheryl Cole",
    chamber: "house",
    district: 46,
    party: "D",
    website: "https://house.texas.gov/members/3625",
    imageUrl: "https://house.texas.gov/images/members/3625.jpg?v=2",
    officialCode: null,
    home: null,
    phone: "512-463-0506",
    capitolAddress: "Room E2.910, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "sheryl-cole",
      reviewedAt: "2026-07-31",
      biography:
        "Sheryl Cole is the current Representative for Texas House District 46. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 46 since 2019-01-08.",
        "Capitol office: Room E2.910, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Administration — Vice Chair",
        "Culture, Recreation and Tourism",
        "Intergovernmental Affairs",
      ],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 46. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Sheryl Cole", "Representative Sheryl Cole", "Texas House District 46"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3625",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3625/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "vikki-goodwin",
    name: "Vikki Goodwin",
    chamber: "house",
    district: 47,
    party: "D",
    website: "https://house.texas.gov/members/3820",
    imageUrl: "https://house.texas.gov/images/members/3820.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0652",
    capitolAddress: "Room E2.318, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "vikki-goodwin",
      reviewedAt: "2026-07-31",
      biography:
        "Vikki Goodwin is the current Representative for Texas House District 47. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 47 since 2019-01-08.",
        "Capitol office: Room E2.318, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Appropriations", "Insurance"],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 47. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Vikki Goodwin", "Representative Vikki Goodwin", "Texas House District 47"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3820",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3820/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "donna-howard",
    name: "Donna Howard",
    chamber: "house",
    district: 48,
    party: "D",
    website: "https://house.texas.gov/members/3310",
    imageUrl: "https://house.texas.gov/images/members/3310.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0631",
    capitolAddress: "Room GW.11, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "donna-howard",
      reviewedAt: "2026-07-31",
      biography:
        "Donna Howard is the current Representative for Texas House District 48. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 48 since 2006-03-02.",
        "Capitol office: Room GW.11, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Appropriations", "Higher Education — Vice Chair"],
      electionHistory: [
        {
          year: "2006",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 48. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Donna Howard", "Representative Donna Howard", "Texas House District 48"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3310",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3310/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "gina-hinojosa",
    name: "Gina Hinojosa",
    chamber: "house",
    district: 49,
    party: "D",
    website: "https://house.texas.gov/members/3210",
    imageUrl: "https://house.texas.gov/images/members/3210.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0668",
    capitolAddress: "Room 4S.2, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "gina-hinojosa",
      reviewedAt: "2026-07-31",
      biography:
        "Gina Hinojosa is the current Representative for Texas House District 49. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 49 since 2017-01-10.",
        "Capitol office: Room 4S.2, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Land and Resource Management", "Public Education"],
      electionHistory: [
        {
          year: "2017",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 49. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Gina Hinojosa", "Representative Gina Hinojosa", "Texas House District 49"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3210",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3210/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "james-talarico",
    name: "James Talarico",
    chamber: "house",
    district: 50,
    party: "D",
    website: "https://house.texas.gov/members/3685",
    imageUrl: "https://house.texas.gov/images/members/3685.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0821",
    capitolAddress: "Room E2.902, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "james-talarico",
      reviewedAt: "2026-07-31",
      biography:
        "James Talarico is the current Representative for Texas House District 50. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 50 since 2023-01-10.",
        "Capitol office: Room E2.902, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Administration",
        "Public Education",
        "Trade, Workforce and Economic Development — Vice Chair",
      ],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 50. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["James Talarico", "Representative James Talarico", "Texas House District 50"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3685",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3685/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "lulu-flores",
    name: "Lulu Flores",
    chamber: "house",
    district: 51,
    party: "D",
    website: "https://house.texas.gov/members/4150",
    imageUrl: "https://house.texas.gov/images/members/4150.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0674",
    capitolAddress: "Room E2.310, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "lulu-flores",
      reviewedAt: "2026-07-31",
      biography:
        "Lulu Flores is the current Representative for Texas House District 51. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 51 since 2023-01-10.",
        "Capitol office: Room E2.310, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Culture, Recreation and Tourism — Vice Chair",
        "Judiciary and Civil Jurisprudence",
      ],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 51. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Lulu Flores", "Representative Lulu Flores", "Texas House District 51"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4150",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4150/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "caroline-harris-davila",
    name: "Caroline Harris Davila",
    chamber: "house",
    district: 52,
    party: "R",
    website: "https://house.texas.gov/members/4205",
    imageUrl: "https://house.texas.gov/images/members/4205.jpg?v=1",
    officialCode: null,
    home: "3010 E. Old Settlers Blvd., Round Rock, TX 78665",
    phone: "512-463-0670",
    capitolAddress: "Room E1.324, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "3010 E. Old Settlers Blvd., Round Rock, TX 78665",
    vacant: false,
    authority: {
      slug: "caroline-harris-davila",
      reviewedAt: "2026-07-31",
      biography:
        "Caroline Harris Davila is the current Representative for Texas House District 52. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 52 since 2023-01-10.",
        "Capitol office: Room E1.324, P.O. Box 12910, Austin, TX 78711",
        "District office: 3010 E. Old Settlers Blvd., Round Rock, TX 78665",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Trade, Workforce and Economic Development", "Transportation"],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 52. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Caroline Harris Davila",
        "Representative Caroline Harris Davila",
        "Texas House District 52",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4205",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4205/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "wes-virdell",
    name: "Wes Virdell",
    chamber: "house",
    district: 53,
    party: "R",
    website: "https://house.texas.gov/members/53",
    imageUrl: "https://www.house.texas.gov/images/members/4775.jpg?v=1",
    officialCode: null,
    home: "301 Junction Highway Suite 254, Kerrville, TX 78028",
    phone: "512-463-0536",
    capitolAddress: "Room E2.304, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "301 Junction Highway Suite 254, Kerrville, TX 78028",
    vacant: false,
    authority: {
      slug: "wes-virdell",
      reviewedAt: "2026-07-31",
      biography:
        "Wes Virdell is the current Representative for Texas House District 53. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 53 since 2025-01-14.",
        "Capitol office: Room E2.304, P.O. Box 12910, Austin, TX 78711",
        "District office: 301 Junction Highway Suite 254, Kerrville, TX 78028",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Criminal Jurisprudence",
        "Disaster Preparedness and Flooding Select",
        "Land and Resource Management",
      ],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 53. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Wes Virdell", "Representative Wes Virdell", "Texas House District 53"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/53",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4775/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "brad-buckley",
    name: "Brad Buckley",
    chamber: "house",
    district: 54,
    party: "R",
    website: "https://house.texas.gov/members/54",
    imageUrl: "https://house.texas.gov/images/members/3585.jpg?v=1",
    officialCode: null,
    home: "1301 N. Stagecoach Road, Salado, TX 76571",
    phone: "512-463-0684",
    capitolAddress: "Room E2.510, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "1301 N. Stagecoach Road, Salado, TX 76571",
    vacant: false,
    authority: {
      slug: "brad-buckley",
      reviewedAt: "2026-07-31",
      biography:
        "Brad Buckley is the current Representative for Texas House District 54. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 54 since 2019-01-08.",
        "Capitol office: Room E2.510, P.O. Box 12910, Austin, TX 78711",
        "District office: 1301 N. Stagecoach Road, Salado, TX 76571",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Civil Discourse and Freedom of Speech in Higher Education Select",
        "Natural Resources",
        "Public Education — Chair",
      ],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 54. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Brad Buckley", "Representative Brad Buckley", "Texas House District 54"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/54",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3585/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "hillary-hickland",
    name: "Hillary Hickland",
    chamber: "house",
    district: 55,
    party: "R",
    website: "https://house.texas.gov/members/55",
    imageUrl: "https://www.house.texas.gov/images/members/4520.jpg?v=1",
    officialCode: null,
    home: "2180 N. Main St. Office H7, Belton, TX 76513",
    phone: "512-463-0630",
    capitolAddress: "Room E1.218, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "2180 N. Main St. Office H7, Belton, TX 76513",
    vacant: false,
    authority: {
      slug: "hillary-hickland",
      reviewedAt: "2026-07-31",
      biography:
        "Hillary Hickland is the current Representative for Texas House District 55. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 55 since 2025-01-14.",
        "Capitol office: Room E1.218, P.O. Box 12910, Austin, TX 78711",
        "District office: 2180 N. Main St. Office H7, Belton, TX 76513",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Congressional Redistricting Select",
        "Homeland Security, Public Safety and Veterans' Affairs",
        "Redistricting",
        "Ways and Means",
      ],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 55. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Hillary Hickland",
        "Representative Hillary Hickland",
        "Texas House District 55",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/55",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4520/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "pat-curry",
    name: "Pat Curry",
    chamber: "house",
    district: 56,
    party: "R",
    website: "https://house.texas.gov/members/4415",
    imageUrl: "https://house.texas.gov/images/members/4415.jpg?v=2",
    officialCode: null,
    home: "204 Woodhew Drive, Waco, TX 76712",
    phone: "512-463-0135",
    capitolAddress: "Room E1.512, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "204 Woodhew Drive, Waco, TX 76712",
    vacant: false,
    authority: {
      slug: "pat-curry",
      reviewedAt: "2026-07-31",
      biography:
        "Pat Curry is the current Representative for Texas House District 56. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 56 since 2024-11-18.",
        "Capitol office: Room E1.512, P.O. Box 12910, Austin, TX 78711",
        "District office: 204 Woodhew Drive, Waco, TX 76712",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Delivery of Government Efficiency",
        "General Aviation Select",
        "Transportation",
      ],
      electionHistory: [
        {
          year: "2024",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 56. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Pat Curry", "Representative Pat Curry", "Texas House District 56"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4415",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4415/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "richard-hayes",
    name: "Richard Hayes",
    chamber: "house",
    district: 57,
    party: "R",
    website: "https://house.texas.gov/members/4165",
    imageUrl: "https://house.texas.gov/images/members/4165.jpg?v=1",
    officialCode: null,
    home: "2000 S. Stemmons Freeway Suite 203, Lake Dallas, TX 75065",
    phone: "512-463-0556",
    capitolAddress: "Room E1.424, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "2000 S. Stemmons Freeway Suite 203, Lake Dallas, TX 75065",
    vacant: false,
    authority: {
      slug: "richard-hayes",
      reviewedAt: "2026-07-31",
      biography:
        "Richard Hayes is the current Representative for Texas House District 57. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 57 since 2023-01-10.",
        "Capitol office: Room E1.424, P.O. Box 12910, Austin, TX 78711",
        "District office: 2000 S. Stemmons Freeway Suite 203, Lake Dallas, TX 75065",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Governmental Oversight Select",
        "Judiciary and Civil Jurisprudence",
        "Pensions, Investments and Financial Services",
      ],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 57. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Richard Hayes", "Representative Richard Hayes", "Texas House District 57"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4165",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4165/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "helen-kerwin",
    name: "Helen Kerwin",
    chamber: "house",
    district: 58,
    party: "R",
    website: "https://house.texas.gov/members/58",
    imageUrl: "https://www.house.texas.gov/images/members/4575.jpg?v=1",
    officialCode: null,
    home: "100 N. Main St. Suite A, Joshua, TX 76058",
    phone: "512-463-0538",
    capitolAddress: "Room E1.216, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "100 N. Main St. Suite A, Joshua, TX 76058",
    vacant: false,
    authority: {
      slug: "helen-kerwin",
      reviewedAt: "2026-07-31",
      biography:
        "Helen Kerwin is the current Representative for Texas House District 58. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 58 since 2025-01-14.",
        "Capitol office: Room E1.216, P.O. Box 12910, Austin, TX 78711",
        "District office: 100 N. Main St. Suite A, Joshua, TX 76058",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Culture, Recreation and Tourism", "Public Education"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 58. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Helen Kerwin", "Representative Helen Kerwin", "Texas House District 58"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/58",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4575/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "shelby-slawson",
    name: "Shelby Slawson",
    chamber: "house",
    district: 59,
    party: "R",
    website: "https://house.texas.gov/members/4055",
    imageUrl: "https://house.texas.gov/images/members/4055.jpg?v=2",
    officialCode: null,
    home: "Room 305, Historical Hood County Courthouse 100 E. Pearl St., Granbury, TX 76048",
    phone: "512-463-0628",
    capitolAddress: "Room E2.506, P.O. Box 12910, Austin, TX 78711",
    districtAddress:
      "Room 305, Historical Hood County Courthouse 100 E. Pearl St., Granbury, TX 76048",
    vacant: false,
    authority: {
      slug: "shelby-slawson",
      reviewedAt: "2026-07-31",
      biography:
        "Shelby Slawson is the current Representative for Texas House District 59. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 59 since 2021-01-12.",
        "Capitol office: Room E2.506, P.O. Box 12910, Austin, TX 78711",
        "District office: Room 305, Historical Hood County Courthouse 100 E. Pearl St., Granbury, TX 76048",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Appropriations",
        "Civil Discourse and Freedom of Speech in Higher Education Select",
        "Governmental Oversight Select",
        "Human Services",
      ],
      electionHistory: [
        {
          year: "2021",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 59. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Shelby Slawson", "Representative Shelby Slawson", "Texas House District 59"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4055",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4055/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "mike-olcott",
    name: "Mike Olcott",
    chamber: "house",
    district: 60,
    party: "R",
    website: "https://house.texas.gov/members/60",
    imageUrl: "https://www.house.texas.gov/images/members/4705.jpg?v=1",
    officialCode: null,
    home: "212 Santa Fe Drive, Weatherford, TX 76086",
    phone: "512-463-0656",
    capitolAddress: "Room E2.704, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "212 Santa Fe Drive, Weatherford, TX 76086",
    vacant: false,
    authority: {
      slug: "mike-olcott",
      reviewedAt: "2026-07-31",
      biography:
        "Mike Olcott is the current Representative for Texas House District 60. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 60 since 2025-01-14.",
        "Capitol office: Room E2.704, P.O. Box 12910, Austin, TX 78711",
        "District office: 212 Santa Fe Drive, Weatherford, TX 76086",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Delivery of Government Efficiency", "Public Health"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 60. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Mike Olcott", "Representative Mike Olcott", "Texas House District 60"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/60",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4705/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "keresa-richardson",
    name: "Keresa Richardson",
    chamber: "house",
    district: 61,
    party: "R",
    website: "https://house.texas.gov/members/61",
    imageUrl: "https://house.texas.gov/images/members/4735.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0738",
    capitolAddress: "Room E2.416, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "keresa-richardson",
      reviewedAt: "2026-07-31",
      biography:
        "Keresa Richardson is the current Representative for Texas House District 61. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 61 since 2025-01-14.",
        "Capitol office: Room E2.416, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Human Services", "Trade, Workforce and Economic Development"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 61. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Keresa Richardson",
        "Representative Keresa Richardson",
        "Texas House District 61",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/61",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4735/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "shelley-luther",
    name: "Shelley Luther",
    chamber: "house",
    district: 62,
    party: "R",
    website: "https://house.texas.gov/members/62",
    imageUrl: "https://www.house.texas.gov/images/members/4645.jpg?v=1",
    officialCode: null,
    home: "Room #201, 100 N. Travis St., Sherman, TX 75090",
    phone: "512-463-0297",
    capitolAddress: "Room E2.404, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "Room #201, 100 N. Travis St., Sherman, TX 75090",
    vacant: false,
    authority: {
      slug: "shelley-luther",
      reviewedAt: "2026-07-31",
      biography:
        "Shelley Luther is the current Representative for Texas House District 62. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 62 since 2025-01-14.",
        "Capitol office: Room E2.404, P.O. Box 12910, Austin, TX 78711",
        "District office: Room #201, 100 N. Travis St., Sherman, TX 75090",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Health Care Affordability Select",
        "Intergovernmental Affairs",
        "Trade, Workforce and Economic Development",
      ],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 62. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Shelley Luther", "Representative Shelley Luther", "Texas House District 62"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/62",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4645/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "ben-bumgarner",
    name: "Ben Bumgarner",
    chamber: "house",
    district: 63,
    party: "R",
    website: "https://house.texas.gov/members/63",
    imageUrl: "https://house.texas.gov/images/members/4125.jpg?v=1",
    officialCode: null,
    home: "108 S. Oak St., Roanoke, TX 76262",
    phone: "512-463-0688",
    capitolAddress: "Room E1.310, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "108 S. Oak St., Roanoke, TX 76262",
    vacant: false,
    authority: {
      slug: "ben-bumgarner",
      reviewedAt: "2026-07-31",
      biography:
        "Ben Bumgarner is the current Representative for Texas House District 63. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 63 since 2023-01-10.",
        "Capitol office: Room E1.310, P.O. Box 12910, Austin, TX 78711",
        "District office: 108 S. Oak St., Roanoke, TX 76262",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Environmental Regulation", "Pensions, Investments and Financial Services"],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 63. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Ben Bumgarner", "Representative Ben Bumgarner", "Texas House District 63"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/63",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4125/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "andy-hopper",
    name: "Andy Hopper",
    chamber: "house",
    district: 64,
    party: "R",
    website: "https://house.texas.gov/members/64",
    imageUrl: "https://www.house.texas.gov/images/members/4555.jpg?v=1",
    officialCode: null,
    home: "204 W. Walnut St., Decatur, TX 76234",
    phone: "512-463-0582",
    capitolAddress: "Room E2.316, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "204 W. Walnut St., Decatur, TX 76234",
    vacant: false,
    authority: {
      slug: "andy-hopper",
      reviewedAt: "2026-07-31",
      biography:
        "Andy Hopper is the current Representative for Texas House District 64. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 64 since 2025-01-14.",
        "Capitol office: Room E2.316, P.O. Box 12910, Austin, TX 78711",
        "District office: 204 W. Walnut St., Decatur, TX 76234",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Agriculture and Livestock", "Insurance"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 64. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Andy Hopper", "Representative Andy Hopper", "Texas House District 64"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/64",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4555/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "mitch-little",
    name: "Mitch Little",
    chamber: "house",
    district: 65,
    party: "R",
    website: "https://house.texas.gov/members/4615",
    imageUrl: "https://house.texas.gov/images/members/4615.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0478",
    capitolAddress: "Room E2.420, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "mitch-little",
      reviewedAt: "2026-07-31",
      biography:
        "Mitch Little is the current Representative for Texas House District 65. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 65 since 2025-01-14.",
        "Capitol office: Room E2.420, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Criminal Jurisprudence", "Governmental Oversight Select", "Transportation"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 65. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Mitch Little", "Representative Mitch Little", "Texas House District 65"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4615",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4615",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "matt-shaheen",
    name: "Matt Shaheen",
    chamber: "house",
    district: 66,
    party: "R",
    website: "https://house.texas.gov/members/66",
    imageUrl: "https://house.texas.gov/images/members/2995.jpg?v=1",
    officialCode: null,
    home: "TX",
    phone: "512-463-0594",
    capitolAddress: "Room GS.6, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "TX",
    vacant: false,
    authority: {
      slug: "matt-shaheen",
      reviewedAt: "2026-07-31",
      biography:
        "Matt Shaheen is the current Representative for Texas House District 66. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 66 since 2015-01-13.",
        "Capitol office: Room GS.6, P.O. Box 12910, Austin, TX 78711",
        "District office: TX",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Elections — Chair", "Higher Education", "Sunset Advisory Commission"],
      electionHistory: [
        {
          year: "2015",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 66. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Matt Shaheen", "Representative Matt Shaheen", "Texas House District 66"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/66",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2995/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "jeff-leach",
    name: "Jeff Leach",
    chamber: "house",
    district: 67,
    party: "R",
    website: "https://house.texas.gov/members/2475",
    imageUrl: "https://house.texas.gov/images/members/2475.jpg?v=1",
    officialCode: null,
    home: "300 E. Davis St., #170, McKinney, TX 75069",
    phone: "512-463-0544",
    capitolAddress: "Room 1W.3, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "300 E. Davis St., #170, McKinney, TX 75069",
    vacant: false,
    authority: {
      slug: "jeff-leach",
      reviewedAt: "2026-07-31",
      biography:
        "Jeff Leach is the current Representative for Texas House District 67. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 67 since 2013-01-08.",
        "Capitol office: Room 1W.3, P.O. Box 12910, Austin, TX 78711",
        "District office: 300 E. Davis St., #170, McKinney, TX 75069",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Calendars", "Judiciary and Civil Jurisprudence — Chair", "Public Education"],
      electionHistory: [
        {
          year: "2013",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 67. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Jeff Leach", "Representative Jeff Leach", "Texas House District 67"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2475",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2475/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "david-spiller",
    name: "David Spiller",
    chamber: "house",
    district: 68,
    party: "R",
    website: "https://house.texas.gov/members/4075",
    imageUrl: "https://house.texas.gov/images/members/4075.jpg?v=1",
    officialCode: null,
    home: "110 E. Pecan St., Gainesville, TX 76240",
    phone: "512-463-0526",
    capitolAddress: "Room E1.302, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "110 E. Pecan St., Gainesville, TX 76240",
    vacant: false,
    authority: {
      slug: "david-spiller",
      reviewedAt: "2026-07-31",
      biography:
        "David Spiller is the current Representative for Texas House District 68. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 68 since 2021-03-09.",
        "Capitol office: Room E1.302, P.O. Box 12910, Austin, TX 78711",
        "District office: 110 E. Pecan St., Gainesville, TX 76240",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Congressional Redistricting Select",
        "Insurance",
        "Intergovernmental Affairs",
        "Redistricting",
      ],
      electionHistory: [
        {
          year: "2021",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 68. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["David Spiller", "Representative David Spiller", "Texas House District 68"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4075",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4075",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "james-frank",
    name: "James Frank",
    chamber: "house",
    district: 69,
    party: "R",
    website: "https://house.texas.gov/members/2385",
    imageUrl: "https://house.texas.gov/images/members/2385.jpg?v=1",
    officialCode: null,
    home: "1206 Hatton Road, Wichita Falls, TX 76302",
    phone: "512-463-0534",
    capitolAddress: "Room 1N.9, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "1206 Hatton Road, Wichita Falls, TX 76302",
    vacant: false,
    authority: {
      slug: "james-frank",
      reviewedAt: "2026-07-31",
      biography:
        "James Frank is the current Representative for Texas House District 69. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 69 since 2013-01-08.",
        "Capitol office: Room 1N.9, P.O. Box 12910, Austin, TX 78711",
        "District office: 1206 Hatton Road, Wichita Falls, TX 76302",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Civil Discourse and Freedom of Speech in Higher Education Select",
        "Health Care Affordability Select — Chair",
        "Public Education",
        "Public Health",
      ],
      electionHistory: [
        {
          year: "2013",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 69. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["James Frank", "Representative James Frank", "Texas House District 69"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2385",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2385/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "mihaela-plesa",
    name: "Mihaela Pleșa",
    chamber: "house",
    district: 70,
    party: "D",
    website: "https://house.texas.gov/members/70",
    imageUrl: "https://house.texas.gov/images/members/4345.jpg?v=1",
    officialCode: null,
    home: "900 E. Park Blvd. Suite 140-C, Plano, TX 75074",
    phone: "512-463-0356",
    capitolAddress: "Room E2.210, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "900 E. Park Blvd. Suite 140-C, Plano, TX 75074",
    vacant: false,
    authority: {
      slug: "mihaela-plesa",
      reviewedAt: "2026-07-31",
      biography:
        "Mihaela Pleșa is the current Representative for Texas House District 70. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 70 since 2023-01-10.",
        "Capitol office: Room E2.210, P.O. Box 12910, Austin, TX 78711",
        "District office: 900 E. Park Blvd. Suite 140-C, Plano, TX 75074",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Elections", "Pensions, Investments and Financial Services — Vice Chair"],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 70. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Mihaela Pleșa", "Representative Mihaela Pleșa", "Texas House District 70"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/70",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4345/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "stan-lambert",
    name: "Stan Lambert",
    chamber: "house",
    district: 71,
    party: "R",
    website: "https://house.texas.gov/members/3225",
    imageUrl: "https://house.texas.gov/images/members/3225.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0718",
    capitolAddress: "Room E2.818, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "stan-lambert",
      reviewedAt: "2026-07-31",
      biography:
        "Stan Lambert is the current Representative for Texas House District 71. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 71 since 2017-01-10.",
        "Capitol office: Room E2.818, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Higher Education", "Pensions, Investments and Financial Services — Chair"],
      electionHistory: [
        {
          year: "2017",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 71. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Stan Lambert", "Representative Stan Lambert", "Texas House District 71"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3225",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3225/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "drew-darby",
    name: "Drew Darby",
    chamber: "house",
    district: 72,
    party: "R",
    website: "https://house.texas.gov/members/2645",
    imageUrl: "https://house.texas.gov/images/members/2645.jpg?v=1",
    officialCode: null,
    home: "136 W. Twohig Ave. Suite E, San Angelo, TX 76903",
    phone: "512-463-0331",
    capitolAddress: "Room GW.12, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "136 W. Twohig Ave. Suite E, San Angelo, TX 76903",
    vacant: false,
    authority: {
      slug: "drew-darby",
      reviewedAt: "2026-07-31",
      biography:
        "Drew Darby is the current Representative for Texas House District 72. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 72 since 2007-01-09.",
        "Capitol office: Room GW.12, P.O. Box 12910, Austin, TX 78711",
        "District office: 136 W. Twohig Ave. Suite E, San Angelo, TX 76903",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Administration",
        "Disaster Preparedness and Flooding Select",
        "Energy Resources — Chair",
        "General Investigating Committee on the July 2025 Flooding Events",
        "State Affairs",
      ],
      electionHistory: [
        {
          year: "2007",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 72. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Drew Darby", "Representative Drew Darby", "Texas House District 72"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2645",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2645",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "carrie-isaac",
    name: "Carrie Isaac",
    chamber: "house",
    district: 73,
    party: "R",
    website: "https://house.texas.gov/members/73",
    imageUrl: "https://house.texas.gov/images/members/4265.jpg?v=3",
    officialCode: null,
    home: "445 N. Seguin Ave., New Braunfels, TX 78130",
    phone: "512-463-0325",
    capitolAddress: "Room E1.306, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "445 N. Seguin Ave., New Braunfels, TX 78130",
    vacant: false,
    authority: {
      slug: "carrie-isaac",
      reviewedAt: "2026-07-31",
      biography:
        "Carrie Isaac is the current Representative for Texas House District 73. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 73 since 2023-01-10.",
        "Capitol office: Room E1.306, P.O. Box 12910, Austin, TX 78711",
        "District office: 445 N. Seguin Ave., New Braunfels, TX 78130",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Elections", "Homeland Security, Public Safety and Veterans' Affairs"],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 73. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Carrie Isaac", "Representative Carrie Isaac", "Texas House District 73"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/73",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4265/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "eddie-morales",
    name: "Eddie Morales",
    chamber: "house",
    district: 74,
    party: "D",
    website: "https://house.texas.gov/members/4000",
    imageUrl: "https://house.texas.gov/images/members/4000.jpg?v=1",
    officialCode: null,
    home: "100 S. Monroe St., Eagle Pass, TX 78852",
    phone: "512-463-0566",
    capitolAddress: "Room E2.406, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "100 S. Monroe St., Eagle Pass, TX 78852",
    vacant: false,
    authority: {
      slug: "eddie-morales",
      reviewedAt: "2026-07-31",
      biography:
        "Eddie Morales is the current Representative for Texas House District 74. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 74 since 2021-01-12.",
        "Capitol office: Room E2.406, P.O. Box 12910, Austin, TX 78711",
        "District office: 100 S. Monroe St., Eagle Pass, TX 78852",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Energy Resources — Vice Chair",
        "Governmental Oversight Select",
        "Transportation",
      ],
      electionHistory: [
        {
          year: "2021",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 74. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Eddie Morales", "Representative Eddie Morales", "Texas House District 74"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4000",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4000/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "mary-gonzalez",
    name: "Mary González",
    chamber: "house",
    district: 75,
    party: "D",
    website: "https://house.texas.gov/members/2410",
    imageUrl: "https://house.texas.gov/images/members/2410.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0613",
    capitolAddress: "Room E1.504, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "mary-gonzalez",
      reviewedAt: "2026-07-31",
      biography:
        "Mary González is the current Representative for Texas House District 75. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 75 since 2013-01-08.",
        "Capitol office: Room E1.504, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Appropriations — Vice Chair",
        "Health Care Affordability Select",
        "Legislative Budget Board",
        "Natural Resources",
      ],
      electionHistory: [
        {
          year: "2013",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 75. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Mary González", "Representative Mary González", "Texas House District 75"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2410",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2410/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "suleman-lalani",
    name: "Suleman Lalani",
    chamber: "house",
    district: 76,
    party: "D",
    website: "https://house.texas.gov/members/4285",
    imageUrl: "https://house.texas.gov/images/members/4285.jpg?v=1",
    officialCode: null,
    home: "12550 Emily Court Suite 300, Sugar Land, TX 77478",
    phone: "512-463-0596",
    capitolAddress: "Room E1.212, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "12550 Emily Court Suite 300, Sugar Land, TX 77478",
    vacant: false,
    authority: {
      slug: "suleman-lalani",
      reviewedAt: "2026-07-31",
      biography:
        "Suleman Lalani is the current Representative for Texas House District 76. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 76 since 2023-01-10.",
        "Capitol office: Room E1.212, P.O. Box 12910, Austin, TX 78711",
        "District office: 12550 Emily Court Suite 300, Sugar Land, TX 77478",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Health Care Affordability Select",
        "Higher Education",
        "Land and Resource Management — Vice Chair",
      ],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 76. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Suleman Lalani", "Representative Suleman Lalani", "Texas House District 76"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4285",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4285/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "vince-perez",
    name: "Vince Perez",
    chamber: "house",
    district: 77,
    party: "D",
    website: "https://house.texas.gov/members/77",
    imageUrl: "https://www.house.texas.gov/images/members/4710.jpg?v=1",
    officialCode: null,
    home: "100 N. Ochoa St., Suite A, El Paso, TX 79901",
    phone: "512-463-0638",
    capitolAddress: "Room E2.312, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "100 N. Ochoa St., Suite A, El Paso, TX 79901",
    vacant: false,
    authority: {
      slug: "vince-perez",
      reviewedAt: "2026-07-31",
      biography:
        "Vince Perez is the current Representative for Texas House District 77. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 77 since 2025-01-14.",
        "Capitol office: Room E2.312, P.O. Box 12910, Austin, TX 78711",
        "District office: 100 N. Ochoa St., Suite A, El Paso, TX 79901",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Higher Education", "Local and Consent Calendars", "Ways and Means"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 77. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Vince Perez", "Representative Vince Perez", "Texas House District 77"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/77",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4710/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "joe-moody",
    name: "Joe Moody",
    chamber: "house",
    district: 78,
    party: "D",
    website: "https://house.texas.gov/members/3850",
    imageUrl: "https://house.texas.gov/images/members/3850.jpg?v=1",
    officialCode: null,
    home: "7365 Remcon Circle C-301, El Paso, TX 79912",
    phone: "512-463-0728",
    capitolAddress: "Room GW.18, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "7365 Remcon Circle C-301, El Paso, TX 79912",
    vacant: false,
    authority: {
      slug: "joe-moody",
      reviewedAt: "2026-07-31",
      biography:
        "Joe Moody is the current Representative for Texas House District 78. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 78 since 2013-01-08.",
        "Capitol office: Room GW.18, P.O. Box 12910, Austin, TX 78711",
        "District office: 7365 Remcon Circle C-301, El Paso, TX 79912",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Administration",
        "Congressional Redistricting Select",
        "Criminal Jurisprudence",
        "Disaster Preparedness and Flooding Select",
        "General Investigating",
        "General Investigating Committee on the July 2025 Flooding Events — Vice Chair",
        "Judiciary and Civil Jurisprudence",
      ],
      electionHistory: [
        {
          year: "2013",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 78. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Joe Moody", "Representative Joe Moody", "Texas House District 78"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3850",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3850/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "claudia-ordaz",
    name: "Claudia Ordaz",
    chamber: "house",
    district: 79,
    party: "D",
    website: "https://house.texas.gov/members/4015",
    imageUrl: "https://house.texas.gov/images/members/4015.jpg?v=3",
    officialCode: null,
    home: "1200 Golden Key Circle Suite 141, El Paso, TX 79925",
    phone: "512-463-0622",
    capitolAddress: "Room E2.706, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "1200 Golden Key Circle Suite 141, El Paso, TX 79925",
    vacant: false,
    authority: {
      slug: "claudia-ordaz",
      reviewedAt: "2026-07-31",
      biography:
        "Claudia Ordaz is the current Representative for Texas House District 79. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 79 since 2023-01-10.",
        "Capitol office: Room E2.706, P.O. Box 12910, Austin, TX 78711",
        "District office: 1200 Golden Key Circle Suite 141, El Paso, TX 79925",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Environmental Regulation — Vice Chair",
        "Trade, Workforce and Economic Development",
      ],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 79. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Claudia Ordaz", "Representative Claudia Ordaz", "Texas House District 79"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4015",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4015/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "don-mclaughlin",
    name: "Don McLaughlin",
    chamber: "house",
    district: 80,
    party: "R",
    website: "https://house.texas.gov/members/4655",
    imageUrl: "https://house.texas.gov/images/members/4655.jpg?v=1",
    officialCode: null,
    home: "Room 130, 5500 S. Zapata Highway, Building F, Laredo, TX 78046",
    phone: "512-463-0194",
    capitolAddress: "Room E2.820, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "Room 130, 5500 S. Zapata Highway, Building F, Laredo, TX 78046",
    vacant: false,
    authority: {
      slug: "don-mclaughlin",
      reviewedAt: "2026-07-31",
      biography:
        "Don McLaughlin is the current Representative for Texas House District 80. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 80 since 2025-01-14.",
        "Capitol office: Room E2.820, P.O. Box 12910, Austin, TX 78711",
        "District office: Room 130, 5500 S. Zapata Highway, Building F, Laredo, TX 78046",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Agriculture and Livestock",
        "Homeland Security, Public Safety and Veterans' Affairs",
      ],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 80. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Don McLaughlin", "Representative Don McLaughlin", "Texas House District 80"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4655",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4655/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "brooks-landgraf",
    name: "Brooks Landgraf",
    chamber: "house",
    district: 81,
    party: "R",
    website: "https://house.texas.gov/members/3040",
    imageUrl: "https://house.texas.gov/images/members/3040.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0546",
    capitolAddress: "Room E2.602, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "brooks-landgraf",
      reviewedAt: "2026-07-31",
      biography:
        "Brooks Landgraf is the current Representative for Texas House District 81. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 81 since 2015-01-13.",
        "Capitol office: Room E2.602, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Environmental Regulation — Chair",
        "Governmental Oversight Select",
        "Judiciary and Civil Jurisprudence",
      ],
      electionHistory: [
        {
          year: "2015",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 81. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Brooks Landgraf",
        "Representative Brooks Landgraf",
        "Texas House District 81",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3040",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3040/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "tom-craddick",
    name: "Tom Craddick",
    chamber: "house",
    district: 82,
    party: "R",
    website: "https://house.texas.gov/members/2610",
    imageUrl: "https://house.texas.gov/images/members/2610.jpg?v=1",
    officialCode: null,
    home: "500 W. Texas Ave. Suite 880, Midland, TX 79701",
    phone: "512-463-0500",
    capitolAddress: "Room 1W.9, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "500 W. Texas Ave. Suite 880, Midland, TX 79701",
    vacant: false,
    authority: {
      slug: "tom-craddick",
      reviewedAt: "2026-07-31",
      biography:
        "Tom Craddick is the current Representative for Texas House District 82. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 82 since 1993-01-12.",
        "Capitol office: Room 1W.9, P.O. Box 12910, Austin, TX 78711",
        "District office: 500 W. Texas Ave. Suite 880, Midland, TX 79701",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Energy Resources", "Transportation — Chair"],
      electionHistory: [
        {
          year: "1993",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 82. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Tom Craddick", "Representative Tom Craddick", "Texas House District 82"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2610",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2610/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "dustin-burrows",
    name: "Dustin Burrows",
    chamber: "house",
    district: 83,
    party: "R",
    website: "https://house.texas.gov/members/3055",
    imageUrl: "https://house.texas.gov/images/members/3055.jpg?v=2",
    officialCode: null,
    home: "10507 Quaker Ave. Suite 103, Lubbock, TX 79424",
    phone: "512-463-0542",
    capitolAddress: "P.O. Box 12910, Austin, TX 78711",
    districtAddress: "10507 Quaker Ave. Suite 103, Lubbock, TX 79424",
    vacant: false,
    authority: {
      slug: "dustin-burrows",
      reviewedAt: "2026-07-31",
      biography:
        "Dustin Burrows is the current Representative for Texas House District 83. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 83 since 2015-01-13.",
        "Capitol office: P.O. Box 12910, Austin, TX 78711",
        "District office: 10507 Quaker Ave. Suite 103, Lubbock, TX 79424",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Legislative Budget Board — Chair"],
      electionHistory: [
        {
          year: "2015",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 83. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Dustin Burrows", "Representative Dustin Burrows", "Texas House District 83"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3055",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3055/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "carl-tepper",
    name: "Carl Tepper",
    chamber: "house",
    district: 84,
    party: "R",
    website: "https://house.texas.gov/members/4360",
    imageUrl: "https://house.texas.gov/images/members/4360.jpg?v=1",
    officialCode: null,
    home: "6515 68th St. Suite 200-7, Lubbock, TX 79424",
    phone: "512-463-0676",
    capitolAddress: "Room E1.316, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "6515 68th St. Suite 200-7, Lubbock, TX 79424",
    vacant: false,
    authority: {
      slug: "carl-tepper",
      reviewedAt: "2026-07-31",
      biography:
        "Carl Tepper is the current Representative for Texas House District 84. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 84 since 2023-01-10.",
        "Capitol office: Room E1.316, P.O. Box 12910, Austin, TX 78711",
        "District office: 6515 68th St. Suite 200-7, Lubbock, TX 79424",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Appropriations",
        "Calendars",
        "Congressional Redistricting Select",
        "Governmental Oversight Select",
        "Intergovernmental Affairs",
        "Redistricting",
      ],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 84. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Carl Tepper", "Representative Carl Tepper", "Texas House District 84"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4360",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4360/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "stan-kitzman",
    name: "Stan Kitzman",
    chamber: "house",
    district: 85,
    party: "R",
    website: "https://house.texas.gov/members/4280",
    imageUrl: "https://house.texas.gov/images/members/4280.jpg?v=1",
    officialCode: null,
    home: "1 E. Main, Suite 202, Bellville, TX 77418",
    phone: "512-463-0604",
    capitolAddress: "Room E2.606, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "1 E. Main, Suite 202, Bellville, TX 77418",
    vacant: false,
    authority: {
      slug: "stan-kitzman",
      reviewedAt: "2026-07-31",
      biography:
        "Stan Kitzman is the current Representative for Texas House District 85. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 85 since 2023-01-10.",
        "Capitol office: Room E2.606, P.O. Box 12910, Austin, TX 78711",
        "District office: 1 E. Main, Suite 202, Bellville, TX 77418",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Agriculture and Livestock", "Appropriations"],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 85. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Stan Kitzman", "Representative Stan Kitzman", "Texas House District 85"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4280",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4280/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "john-smithee",
    name: "John Smithee",
    chamber: "house",
    district: 86,
    party: "R",
    website: "https://house.texas.gov/members/4530",
    imageUrl: "https://house.texas.gov/images/members/4530.jpg?v=1",
    officialCode: null,
    home: "320 S. Polk First Floor, Amarillo, TX 79101",
    phone: "512-463-0702",
    capitolAddress: "Room 1W.10, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "320 S. Polk First Floor, Amarillo, TX 79101",
    vacant: false,
    authority: {
      slug: "john-smithee",
      reviewedAt: "2026-07-31",
      biography:
        "John Smithee is the current Representative for Texas House District 86. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 86 since 1985-01-08.",
        "Capitol office: Room 1W.10, P.O. Box 12910, Austin, TX 78711",
        "District office: 320 S. Polk First Floor, Amarillo, TX 79101",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Criminal Jurisprudence — Chair", "State Affairs"],
      electionHistory: [
        {
          year: "1985",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 86. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["John Smithee", "Representative John Smithee", "Texas House District 86"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4530",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4530",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "caroline-fairly",
    name: "Caroline Fairly",
    chamber: "house",
    district: 87,
    party: "R",
    website: "https://house.texas.gov/members/87",
    imageUrl: "https://www.house.texas.gov/images/members/4480.jpg?v=1",
    officialCode: null,
    home: "1800 S. Washington St., Amarillo, TX 79102",
    phone: "512-463-0470",
    capitolAddress: "Room E2.816, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "1800 S. Washington St., Amarillo, TX 79102",
    vacant: false,
    authority: {
      slug: "caroline-fairly",
      reviewedAt: "2026-07-31",
      biography:
        "Caroline Fairly is the current Representative for Texas House District 87. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 87 since 2025-01-14.",
        "Capitol office: Room E2.816, P.O. Box 12910, Austin, TX 78711",
        "District office: 1800 S. Washington St., Amarillo, TX 79102",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Appropriations",
        "Civil Discourse and Freedom of Speech in Higher Education Select",
        "Local and Consent Calendars",
        "Natural Resources",
      ],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 87. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Caroline Fairly",
        "Representative Caroline Fairly",
        "Texas House District 87",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/87",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4480/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "ken-king",
    name: "Ken King",
    chamber: "house",
    district: 88,
    party: "R",
    website: "https://house.texas.gov/members/2455",
    imageUrl: "https://house.texas.gov/images/members/2455.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0736",
    capitolAddress: "Room GW.17, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "ken-king",
      reviewedAt: "2026-07-31",
      biography:
        "Ken King is the current Representative for Texas House District 88. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 88 since 2013-01-08.",
        "Capitol office: Room GW.17, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Administration",
        "Disaster Preparedness and Flooding Select — Chair",
        "State Affairs — Chair",
      ],
      electionHistory: [
        {
          year: "2013",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 88. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Ken King", "Representative Ken King", "Texas House District 88"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2455",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2455/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "candy-noble",
    name: "Candy Noble",
    chamber: "house",
    district: 89,
    party: "R",
    website: "https://house.texas.gov/members/3740",
    imageUrl: "https://house.texas.gov/images/members/3740.jpg?v=1",
    officialCode: null,
    home: "206 N. Murphy Road, Murphy, TX 75094",
    phone: "512-463-0186",
    capitolAddress: "Room E1.508, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "206 N. Murphy Road, Murphy, TX 75094",
    vacant: false,
    authority: {
      slug: "candy-noble",
      reviewedAt: "2026-07-31",
      biography:
        "Candy Noble is the current Representative for Texas House District 89. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 89 since 2019-01-08.",
        "Capitol office: Room E1.508, P.O. Box 12910, Austin, TX 78711",
        "District office: 206 N. Murphy Road, Murphy, TX 75094",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Human Services", "Ways and Means"],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 89. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Candy Noble", "Representative Candy Noble", "Texas House District 89"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3740",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3740/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "ramon-romero",
    name: "Ramon Romero",
    chamber: "house",
    district: 90,
    party: "D",
    website: "https://house.texas.gov/members/3060",
    imageUrl: "https://house.texas.gov/images/members/3060.jpg?v=1",
    officialCode: null,
    home: "1500 N. Main St. Suite 212, Fort Worth, TX 76164",
    phone: "512-463-0740",
    capitolAddress: "Room 4S.6, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "1500 N. Main St. Suite 212, Fort Worth, TX 76164",
    vacant: false,
    authority: {
      slug: "ramon-romero",
      reviewedAt: "2026-07-31",
      biography:
        "Ramon Romero is the current Representative for Texas House District 90. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 90 since 2015-01-13.",
        "Capitol office: Room 4S.6, P.O. Box 12910, Austin, TX 78711",
        "District office: 1500 N. Main St. Suite 212, Fort Worth, TX 76164",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Calendars", "Licensing and Administrative Procedures", "Natural Resources"],
      electionHistory: [
        {
          year: "2015",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 90. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Ramon Romero", "Representative Ramon Romero", "Texas House District 90"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3060",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3060/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "david-lowe",
    name: "David Lowe",
    chamber: "house",
    district: 91,
    party: "R",
    website: "https://house.texas.gov/members/91",
    imageUrl: "https://www.house.texas.gov/images/members/4643.jpg?v=1",
    officialCode: null,
    home: "8376 Davis Blvd. Suite 267, North Richland Hills, TX 76182",
    phone: "512-463-0599",
    capitolAddress: "Room E1.412, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "8376 Davis Blvd. Suite 267, North Richland Hills, TX 76182",
    vacant: false,
    authority: {
      slug: "david-lowe",
      reviewedAt: "2026-07-31",
      biography:
        "David Lowe is the current Representative for Texas House District 91. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 91 since 2025-01-14.",
        "Capitol office: Room E1.412, P.O. Box 12910, Austin, TX 78711",
        "District office: 8376 Davis Blvd. Suite 267, North Richland Hills, TX 76182",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Corrections", "Intergovernmental Affairs"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 91. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["David Lowe", "Representative David Lowe", "Texas House District 91"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/91",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4643/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "salman-bhojani",
    name: "Salman Bhojani",
    chamber: "house",
    district: 92,
    party: "D",
    website: "https://house.texas.gov/members/92",
    imageUrl: "https://house.texas.gov/images/members/4115.jpg?v=1",
    officialCode: null,
    home: "1001 W. Euless Blvd. Suite 410B, Euless, TX 76040",
    phone: "512-463-0522",
    capitolAddress: "Room E2.906, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "1001 W. Euless Blvd. Suite 410B, Euless, TX 76040",
    vacant: false,
    authority: {
      slug: "salman-bhojani",
      reviewedAt: "2026-07-31",
      biography:
        "Salman Bhojani is the current Representative for Texas House District 92. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 92 since 2023-01-10.",
        "Capitol office: Room E2.906, P.O. Box 12910, Austin, TX 78711",
        "District office: 1001 W. Euless Blvd. Suite 410B, Euless, TX 76040",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Delivery of Government Efficiency — Vice Chair",
        "Trade, Workforce and Economic Development",
      ],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 92. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Salman Bhojani", "Representative Salman Bhojani", "Texas House District 92"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/92",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4115/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "nate-schatzline",
    name: "Nate Schatzline",
    chamber: "house",
    district: 93,
    party: "R",
    website: "https://house.texas.gov/members/4355",
    imageUrl: "https://house.texas.gov/images/members/4355.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0562",
    capitolAddress: "Room E1.410, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "nate-schatzline",
      reviewedAt: "2026-07-31",
      biography:
        "Nate Schatzline is the current Representative for Texas House District 93. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 93 since 2023-01-10.",
        "Capitol office: Room E1.410, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Corrections", "Human Services"],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 93. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Nate Schatzline",
        "Representative Nate Schatzline",
        "Texas House District 93",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4355",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4355/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "tony-tinderholt",
    name: "Tony Tinderholt",
    chamber: "house",
    district: 94,
    party: "R",
    website: "https://house.texas.gov/members/3065",
    imageUrl: "https://house.texas.gov/images/members/3065.jpg?v=1",
    officialCode: null,
    home: "1000 Ballpark Way Suite 301, Arlington, TX 76011",
    phone: "512-463-0624",
    capitolAddress: "Room E1.420, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "1000 Ballpark Way Suite 301, Arlington, TX 76011",
    vacant: false,
    authority: {
      slug: "tony-tinderholt",
      reviewedAt: "2026-07-31",
      biography:
        "Tony Tinderholt is the current Representative for Texas House District 94. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 94 since 2015-01-13.",
        "Capitol office: Room E1.420, P.O. Box 12910, Austin, TX 78711",
        "District office: 1000 Ballpark Way Suite 301, Arlington, TX 76011",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Delivery of Government Efficiency", "Higher Education"],
      electionHistory: [
        {
          year: "2015",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 94. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Tony Tinderholt",
        "Representative Tony Tinderholt",
        "Texas House District 94",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3065",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3065/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "nicole-collier",
    name: "Nicole Collier",
    chamber: "house",
    district: 95,
    party: "D",
    website: "https://house.texas.gov/members/95",
    imageUrl: "https://house.texas.gov/images/members/2360.jpg?v=1",
    officialCode: null,
    home: "101. S. Jennings Suite 103A, Fort Worth, TX 76104",
    phone: "512-463-0716",
    capitolAddress: "Room 3S.2, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "101. S. Jennings Suite 103A, Fort Worth, TX 76104",
    vacant: false,
    authority: {
      slug: "nicole-collier",
      reviewedAt: "2026-07-31",
      biography:
        "Nicole Collier is the current Representative for Texas House District 95. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 95 since 2013-01-08.",
        "Capitol office: Room 3S.2, P.O. Box 12910, Austin, TX 78711",
        "District office: 101. S. Jennings Suite 103A, Fort Worth, TX 76104",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Appropriations", "Public Health"],
      electionHistory: [
        {
          year: "2013",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 95. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Nicole Collier", "Representative Nicole Collier", "Texas House District 95"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/95",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2360/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "david-cook",
    name: "David Cook",
    chamber: "house",
    district: 96,
    party: "R",
    website: "https://house.texas.gov/members/3960",
    imageUrl: "https://house.texas.gov/images/members/3960.jpg?v=1",
    officialCode: null,
    home: "309 E. Broad St., Mansfield, TX 76063",
    phone: "512-463-0374",
    capitolAddress: "Room E1.402, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "309 E. Broad St., Mansfield, TX 76063",
    vacant: false,
    authority: {
      slug: "david-cook",
      reviewedAt: "2026-07-31",
      biography:
        "David Cook is the current Representative for Texas House District 96. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 96 since 2021-01-12.",
        "Capitol office: Room E1.402, P.O. Box 12910, Austin, TX 78711",
        "District office: 309 E. Broad St., Mansfield, TX 76063",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Criminal Jurisprudence", "Delivery of Government Efficiency"],
      electionHistory: [
        {
          year: "2021",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 96. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["David Cook", "Representative David Cook", "Texas House District 96"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3960",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3960/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "john-mcqueeney",
    name: "John McQueeney",
    chamber: "house",
    district: 97,
    party: "R",
    website: "https://house.texas.gov/members/97",
    imageUrl: "https://www.house.texas.gov/images/members/4665.jpg?v=1",
    officialCode: null,
    home: "4521 S. Hulen St. Suite 122, Fort Worth, TX 76109",
    phone: "512-463-0608",
    capitolAddress: "Room E2.720, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "4521 S. Hulen St. Suite 122, Fort Worth, TX 76109",
    vacant: false,
    authority: {
      slug: "john-mcqueeney",
      reviewedAt: "2026-07-31",
      biography:
        "John McQueeney is the current Representative for Texas House District 97. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 97 since 2025-01-14.",
        "Capitol office: Room E2.720, P.O. Box 12910, Austin, TX 78711",
        "District office: 4521 S. Hulen St. Suite 122, Fort Worth, TX 76109",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Congressional Redistricting Select",
        "General Aviation Select",
        "Licensing and Administrative Procedures",
        "State Affairs",
      ],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 97. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["John McQueeney", "Representative John McQueeney", "Texas House District 97"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/97",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4665/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "giovanni-capriglione",
    name: "Giovanni Capriglione",
    chamber: "house",
    district: 98,
    party: "R",
    website: "https://house.texas.gov/members/98",
    imageUrl: "https://house.texas.gov/images/members/2345.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0690",
    capitolAddress: "Room E1.506, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "giovanni-capriglione",
      reviewedAt: "2026-07-31",
      biography:
        "Giovanni Capriglione is the current Representative for Texas House District 98. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 98 since 2013-01-08.",
        "Capitol office: Room E1.506, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Delivery of Government Efficiency — Chair", "Ways and Means"],
      electionHistory: [
        {
          year: "2013",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 98. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Giovanni Capriglione",
        "Representative Giovanni Capriglione",
        "Texas House District 98",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/98",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2345/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "charlie-geren",
    name: "Charlie Geren",
    chamber: "house",
    district: 99,
    party: "R",
    website: "https://house.texas.gov/members/2945",
    imageUrl: "https://house.texas.gov/images/members/2945.jpg?v=1",
    officialCode: null,
    home: "6713 Telephone Road Suite 301, Lake Worth, TX 76135",
    phone: "512-463-0610",
    capitolAddress: "Room GW.15, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "6713 Telephone Road Suite 301, Lake Worth, TX 76135",
    vacant: false,
    authority: {
      slug: "charlie-geren",
      reviewedAt: "2026-07-31",
      biography:
        "Charlie Geren is the current Representative for Texas House District 99. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 99 since 2003-01-14.",
        "Capitol office: Room GW.15, P.O. Box 12910, Austin, TX 78711",
        "District office: 6713 Telephone Road Suite 301, Lake Worth, TX 76135",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Administration — Chair",
        "Congressional Redistricting Select",
        "General Investigating",
        "Licensing and Administrative Procedures",
        "State Affairs",
      ],
      electionHistory: [
        {
          year: "2003",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 99. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Charlie Geren", "Representative Charlie Geren", "Texas House District 99"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2945",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2945/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "venton-jones",
    name: "Venton Jones",
    chamber: "house",
    district: 100,
    party: "D",
    website: "https://house.texas.gov/members/4275",
    imageUrl: "https://house.texas.gov/images/members/4275.jpg?v=1",
    officialCode: null,
    home: "3535 Grand Ave., Dallas, TX 75210",
    phone: "512-463-0586",
    capitolAddress: "Room E2.208, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "3535 Grand Ave., Dallas, TX 75210",
    vacant: false,
    authority: {
      slug: "venton-jones",
      reviewedAt: "2026-07-31",
      biography:
        "Venton Jones is the current Representative for Texas House District 100. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 100 since 2023-01-10.",
        "Capitol office: Room E2.208, P.O. Box 12910, Austin, TX 78711",
        "District office: 3535 Grand Ave., Dallas, TX 75210",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Appropriations", "Corrections — Vice Chair"],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 100. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Venton Jones", "Representative Venton Jones", "Texas House District 100"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4275",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4275/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "chris-turner",
    name: "Chris Turner",
    chamber: "house",
    district: 101,
    party: "D",
    website: "https://house.texas.gov/members/4680",
    imageUrl: "https://house.texas.gov/images/members/4680.jpg?v=1",
    officialCode: null,
    home: "320 Westway Place Suite 501, Arlington, TX 76018",
    phone: "512-463-0574",
    capitolAddress: "Room 1N.5, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "320 Westway Place Suite 501, Arlington, TX 76018",
    vacant: false,
    authority: {
      slug: "chris-turner",
      reviewedAt: "2026-07-31",
      biography:
        "Chris Turner is the current Representative for Texas House District 101. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 101 since 2013-01-08.",
        "Capitol office: Room 1N.5, P.O. Box 12910, Austin, TX 78711",
        "District office: 320 Westway Place Suite 501, Arlington, TX 76018",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Congressional Redistricting Select", "State Affairs", "Ways and Means"],
      electionHistory: [
        {
          year: "2013",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 101. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Chris Turner", "Representative Chris Turner", "Texas House District 101"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4680",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4680/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "ana-maria-rodriguez-ramos",
    name: "Ana-Maria Rodriguez Ramos",
    chamber: "house",
    district: 102,
    party: "D",
    website: "https://house.texas.gov/members/3735",
    imageUrl: "https://house.texas.gov/images/members/3735.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0454",
    capitolAddress: "Room E2.204, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "ana-maria-rodriguez-ramos",
      reviewedAt: "2026-07-31",
      biography:
        "Ana-Maria Rodriguez Ramos is the current Representative for Texas House District 102. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 102 since 2019-01-08.",
        "Capitol office: Room E2.204, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Criminal Jurisprudence", "Delivery of Government Efficiency"],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 102. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Ana-Maria Rodriguez Ramos",
        "Representative Ana-Maria Rodriguez Ramos",
        "Texas House District 102",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3735",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3735/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "rafael-anchia",
    name: "Rafael Anchía",
    chamber: "house",
    district: 103,
    party: "D",
    website: "https://house.texas.gov/members/2150",
    imageUrl: "https://house.texas.gov/images/members/2150.jpg",
    officialCode: null,
    home: "1111 W. Mockingbird Lane Suite 1010, Dallas, TX 75247",
    phone: "512-463-0746",
    capitolAddress: "Room 1W.5, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "1111 W. Mockingbird Lane Suite 1010, Dallas, TX 75247",
    vacant: false,
    authority: {
      slug: "rafael-anchia",
      reviewedAt: "2026-07-31",
      biography:
        "Rafael Anchía is the current Representative for Texas House District 103. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 103 since 2005-01-11.",
        "Capitol office: Room 1W.5, P.O. Box 12910, Austin, TX 78711",
        "District office: 1111 W. Mockingbird Lane Suite 1010, Dallas, TX 75247",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Environmental Regulation", "State Affairs"],
      electionHistory: [
        {
          year: "2005",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 103. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Rafael Anchía", "Representative Rafael Anchía", "Texas House District 103"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2150",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2150/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "jessica-gonzalez",
    name: "Jessica González",
    chamber: "house",
    district: 104,
    party: "D",
    website: "https://house.texas.gov/members/3335",
    imageUrl: "https://house.texas.gov/images/members/3335.jpg?v=1",
    officialCode: null,
    home: "400 S. Zang Blvd. Suite 1214, Dallas, TX 75208",
    phone: "512-463-0408",
    capitolAddress: "Room E2.808, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "400 S. Zang Blvd. Suite 1214, Dallas, TX 75208",
    vacant: false,
    authority: {
      slug: "jessica-gonzalez",
      reviewedAt: "2026-07-31",
      biography:
        "Jessica González is the current Representative for Texas House District 104. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 104 since 2019-01-08.",
        "Capitol office: Room E2.808, P.O. Box 12910, Austin, TX 78711",
        "District office: 400 S. Zang Blvd. Suite 1214, Dallas, TX 75208",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Insurance", "Judiciary and Civil Jurisprudence", "Local and Consent Calendars"],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 104. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Jessica González",
        "Representative Jessica González",
        "Texas House District 104",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3335",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3335/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "terry-meza",
    name: "Terry Meza",
    chamber: "house",
    district: 105,
    party: "D",
    website: "https://house.texas.gov/members/3455",
    imageUrl: "https://house.texas.gov/images/members/3455.jpg?v=1",
    officialCode: null,
    home: "800 W. Airport Freeway 1008, Irving, TX 75062",
    phone: "512-463-0641",
    capitolAddress: "Room E1.204, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "800 W. Airport Freeway 1008, Irving, TX 75062",
    vacant: false,
    authority: {
      slug: "terry-meza",
      reviewedAt: "2026-07-31",
      biography:
        "Terry Meza is the current Representative for Texas House District 105. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 105 since 2019-01-08.",
        "Capitol office: Room E1.204, P.O. Box 12910, Austin, TX 78711",
        "District office: 800 W. Airport Freeway 1008, Irving, TX 75062",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Corrections", "Trade, Workforce and Economic Development"],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 105. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Terry Meza", "Representative Terry Meza", "Texas House District 105"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3455",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3455/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "jared-patterson",
    name: "Jared Patterson",
    chamber: "house",
    district: 106,
    party: "R",
    website: "https://house.texas.gov/members/3655",
    imageUrl: "https://house.texas.gov/images/members/3655.jpg?v=1",
    officialCode: null,
    home: "5533 FM 423 Suite 503, Frisco, TX 75036",
    phone: "512-463-0694",
    capitolAddress: "Room E2.608, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "5533 FM 423 Suite 503, Frisco, TX 75036",
    vacant: false,
    authority: {
      slug: "jared-patterson",
      reviewedAt: "2026-07-31",
      biography:
        "Jared Patterson is the current Representative for Texas House District 106. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 106 since 2019-01-08.",
        "Capitol office: Room E2.608, P.O. Box 12910, Austin, TX 78711",
        "District office: 5533 FM 423 Suite 503, Frisco, TX 75036",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Licensing and Administrative Procedures",
        "Local and Consent Calendars — Chair",
        "Transportation",
      ],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 106. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Jared Patterson",
        "Representative Jared Patterson",
        "Texas House District 106",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3655",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3655/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "linda-garcia",
    name: "Linda Garcia",
    chamber: "house",
    district: 107,
    party: "D",
    website: "https://house.texas.gov/members/107",
    imageUrl: "https://www.house.texas.gov/images/members/4485.jpg?v=3",
    officialCode: null,
    home: "18601 Lyndon B. Johnson Freeway Suite 509, Mesquite, TX 75150",
    phone: "512-463-0244",
    capitolAddress: "Room E2.716, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "18601 Lyndon B. Johnson Freeway Suite 509, Mesquite, TX 75150",
    vacant: false,
    authority: {
      slug: "linda-garcia",
      reviewedAt: "2026-07-31",
      biography:
        "Linda Garcia is the current Representative for Texas House District 107. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 107 since 2025-01-14.",
        "Capitol office: Room E2.716, P.O. Box 12910, Austin, TX 78711",
        "District office: 18601 Lyndon B. Johnson Freeway Suite 509, Mesquite, TX 75150",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Delivery of Government Efficiency",
        "Pensions, Investments and Financial Services",
      ],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 107. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Linda Garcia", "Representative Linda Garcia", "Texas House District 107"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/107",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4485/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "morgan-meyer",
    name: "Morgan Meyer",
    chamber: "house",
    district: 108,
    party: "R",
    website: "https://house.texas.gov/members/3075",
    imageUrl: "https://house.texas.gov/images/members/3075.jpg?v=1",
    officialCode: null,
    home: "3131 McKinney Ave. #500, Dallas, TX 75204",
    phone: "512-463-0367",
    capitolAddress: "Room GN.8, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "3131 McKinney Ave. #500, Dallas, TX 75204",
    vacant: false,
    authority: {
      slug: "morgan-meyer",
      reviewedAt: "2026-07-31",
      biography:
        "Morgan Meyer is the current Representative for Texas House District 108. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 108 since 2015-01-13.",
        "Capitol office: Room GN.8, P.O. Box 12910, Austin, TX 78711",
        "District office: 3131 McKinney Ave. #500, Dallas, TX 75204",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Administration",
        "General Investigating Committee on the July 2025 Flooding Events — Chair",
        "Legislative Budget Board",
        "Ways and Means — Chair",
      ],
      electionHistory: [
        {
          year: "2015",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 108. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Morgan Meyer", "Representative Morgan Meyer", "Texas House District 108"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3075",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3075/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "aicha-davis",
    name: "Aicha Davis",
    chamber: "house",
    district: 109,
    party: "D",
    website: "https://house.texas.gov/members/109",
    imageUrl: "https://www.house.texas.gov/images/members/4465.jpg?v=1",
    officialCode: null,
    home: null,
    phone: "512-463-0953",
    capitolAddress: "Room E2.302, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "aicha-davis",
      reviewedAt: "2026-07-31",
      biography:
        "Aicha Davis is the current Representative for Texas House District 109. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 109 since 2025-01-14.",
        "Capitol office: Room E2.302, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Higher Education", "Human Services"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 109. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Aicha Davis", "Representative Aicha Davis", "Texas House District 109"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/109",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4465/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "toni-rose",
    name: "Toni Rose",
    chamber: "house",
    district: 110,
    party: "D",
    website: "https://house.texas.gov/members/2555",
    imageUrl: "https://house.texas.gov/images/members/2555.jpg?v=3",
    officialCode: null,
    home: "12450 Elam Road, Balch Springs, TX 75180",
    phone: "512-463-0664",
    capitolAddress: "Room 4N.5, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "12450 Elam Road, Balch Springs, TX 75180",
    vacant: false,
    authority: {
      slug: "toni-rose",
      reviewedAt: "2026-07-31",
      biography:
        "Toni Rose is the current Representative for Texas House District 110. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 110 since 2013-01-08.",
        "Capitol office: Room 4N.5, P.O. Box 12910, Austin, TX 78711",
        "District office: 12450 Elam Road, Balch Springs, TX 75180",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Appropriations",
        "Calendars — Vice Chair",
        "Health Care Affordability Select — Vice Chair",
        "Human Services",
      ],
      electionHistory: [
        {
          year: "2013",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 110. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Toni Rose", "Representative Toni Rose", "Texas House District 110"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2555",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2555/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "yvonne-davis",
    name: "Yvonne Davis",
    chamber: "house",
    district: 111,
    party: "D",
    website: "https://house.texas.gov/members/2625",
    imageUrl:
      "https://cdn.ballotpedia.org/images/thumb/0/06/Yvonne_Davis.jpg/200px-Yvonne_Davis.jpg",
    officialCode: null,
    home: "5787 S. Hampton Road Suite 447, Dallas, TX 75232",
    phone: "512-463-0598",
    capitolAddress: "Room 4N.9, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "5787 S. Hampton Road Suite 447, Dallas, TX 75232",
    vacant: false,
    authority: {
      slug: "yvonne-davis",
      reviewedAt: "2026-07-31",
      biography:
        "Yvonne Davis is the current Representative for Texas House District 111. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 111 since 1993-01-12.",
        "Capitol office: Room 4N.9, P.O. Box 12910, Austin, TX 78711",
        "District office: 5787 S. Hampton Road Suite 447, Dallas, TX 75232",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Land and Resource Management", "State Affairs"],
      electionHistory: [
        {
          year: "1993",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 111. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Yvonne Davis", "Representative Yvonne Davis", "Texas House District 111"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2625",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2625/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "angie-button",
    name: "Angie Button",
    chamber: "house",
    district: 112,
    party: "R",
    website: "https://house.texas.gov/members/2510",
    imageUrl: "https://house.texas.gov/images/members/2510.jpg?v=1",
    officialCode: null,
    home: "1201 International Parkway Suite 130, Richardson, TX 75081",
    phone: "512-463-0486",
    capitolAddress: "Room GW.7, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "1201 International Parkway Suite 130, Richardson, TX 75081",
    vacant: false,
    authority: {
      slug: "angie-button",
      reviewedAt: "2026-07-31",
      biography:
        "Angie Button is the current Representative for Texas House District 112. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 112 since 2009-01-13.",
        "Capitol office: Room GW.7, P.O. Box 12910, Austin, TX 78711",
        "District office: 1201 International Parkway Suite 130, Richardson, TX 75081",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Administration",
        "Trade, Workforce and Economic Development — Chair",
        "Ways and Means",
      ],
      electionHistory: [
        {
          year: "2009",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 112. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Angie Button", "Representative Angie Button", "Texas House District 112"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2510",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2510/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "rhetta-bowers",
    name: "Rhetta Bowers",
    chamber: "house",
    district: 113,
    party: "D",
    website: "https://house.texas.gov/members/3565",
    imageUrl: "https://house.texas.gov/images/members/3565.jpg?v=1",
    officialCode: null,
    home: "18601 Lyndon B. Johnson Freeway Suite 301, Mesquite, TX 75150",
    phone: "512-463-0464",
    capitolAddress: "Room E2.214, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "18601 Lyndon B. Johnson Freeway Suite 301, Mesquite, TX 75150",
    vacant: false,
    authority: {
      slug: "rhetta-bowers",
      reviewedAt: "2026-07-31",
      biography:
        "Rhetta Bowers is the current Representative for Texas House District 113. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 113 since 2019-01-08.",
        "Capitol office: Room E2.214, P.O. Box 12910, Austin, TX 78711",
        "District office: 18601 Lyndon B. Johnson Freeway Suite 301, Mesquite, TX 75150",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Criminal Jurisprudence",
        "Delivery of Government Efficiency",
        "Local and Consent Calendars — Vice Chair",
      ],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 113. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Rhetta Bowers", "Representative Rhetta Bowers", "Texas House District 113"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3565",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3565/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "john-bryant",
    name: "John Bryant",
    chamber: "house",
    district: 114,
    party: "D",
    website: "https://house.texas.gov/members/4120",
    imageUrl: "https://house.texas.gov/images/members/4120.jpg?v=1",
    officialCode: null,
    home: "6301 Gaston Ave. Suite 1110, Dallas, TX 75214",
    phone: "512-463-0576",
    capitolAddress: "Room 4S.3, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "6301 Gaston Ave. Suite 1110, Dallas, TX 75214",
    vacant: false,
    authority: {
      slug: "john-bryant",
      reviewedAt: "2026-07-31",
      biography:
        "John Bryant is the current Representative for Texas House District 114. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 114 since 2023-01-10.",
        "Capitol office: Room 4S.3, P.O. Box 12910, Austin, TX 78711",
        "District office: 6301 Gaston Ave. Suite 1110, Dallas, TX 75214",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Pensions, Investments and Financial Services", "Public Education"],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 114. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["John Bryant", "Representative John Bryant", "Texas House District 114"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4120",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4120/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "cas-garcia-hernandez",
    name: "Cas Garcia Hernandez",
    chamber: "house",
    district: 115,
    party: "D",
    website: "https://house.texas.gov/members/115",
    imageUrl: "https://www.house.texas.gov/images/members/4495.jpg?v=1",
    officialCode: null,
    home: "4099 McEwen Road, Suite 622, Dallas, TX 75244",
    phone: "512-463-0468",
    capitolAddress: "Room E2.712, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "4099 McEwen Road, Suite 622, Dallas, TX 75244",
    vacant: false,
    authority: {
      slug: "cas-garcia-hernandez",
      reviewedAt: "2026-07-31",
      biography:
        "Cas Garcia Hernandez is the current Representative for Texas House District 115. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 115 since 2025-01-14.",
        "Capitol office: Room E2.712, P.O. Box 12910, Austin, TX 78711",
        "District office: 4099 McEwen Road, Suite 622, Dallas, TX 75244",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Appropriations", "Intergovernmental Affairs"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 115. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Cas Garcia Hernandez",
        "Representative Cas Garcia Hernandez",
        "Texas House District 115",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/115",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4495/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "trey-martinez-fischer",
    name: "Trey Martinez Fischer",
    chamber: "house",
    district: 116,
    party: "D",
    website: "https://house.texas.gov/members/2835",
    imageUrl: "https://house.texas.gov/images/members/2835.jpg?v=1",
    officialCode: null,
    home: "4243 E. Piedras Drive Suite 256, San Antonio, TX 78228",
    phone: "512-463-0616",
    capitolAddress: "Room 4S.5, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "4243 E. Piedras Drive Suite 256, San Antonio, TX 78228",
    vacant: false,
    authority: {
      slug: "trey-martinez-fischer",
      reviewedAt: "2026-07-31",
      biography:
        "Trey Martinez Fischer is the current Representative for Texas House District 116. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 116 since 2019-01-08.",
        "Capitol office: Room 4S.5, P.O. Box 12910, Austin, TX 78711",
        "District office: 4243 E. Piedras Drive Suite 256, San Antonio, TX 78228",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Culture, Recreation and Tourism", "Ways and Means — Vice Chair"],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 116. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Trey Martinez Fischer",
        "Representative Trey Martinez Fischer",
        "Texas House District 116",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2835",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2835/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "philip-cortez",
    name: "Philip Cortez",
    chamber: "house",
    district: 117,
    party: "D",
    website: "https://house.texas.gov/members/2365",
    imageUrl: "https://house.texas.gov/images/members/2365.jpg?v=2",
    officialCode: null,
    home: "2600 SW Military Drive Suite 211, San Antonio, TX 78224",
    phone: "512-463-0269",
    capitolAddress: "Room 4N.3, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "2600 SW Military Drive Suite 211, San Antonio, TX 78224",
    vacant: false,
    authority: {
      slug: "philip-cortez",
      reviewedAt: "2026-07-31",
      biography:
        "Philip Cortez is the current Representative for Texas House District 117. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 117 since 2017-01-10.",
        "Capitol office: Room 4N.3, P.O. Box 12910, Austin, TX 78711",
        "District office: 2600 SW Military Drive Suite 211, San Antonio, TX 78224",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "General Aviation Select",
        "Homeland Security, Public Safety and Veterans' Affairs",
        "Intergovernmental Affairs",
      ],
      electionHistory: [
        {
          year: "2017",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 117. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Philip Cortez", "Representative Philip Cortez", "Texas House District 117"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2365",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2365/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "john-lujan",
    name: "John Lujan",
    chamber: "house",
    district: 118,
    party: "R",
    website: "https://house.texas.gov/members/3145",
    imageUrl: "https://house.texas.gov/images/members/3145.jpg?v=1",
    officialCode: null,
    home: "8307 S. Flores St., San Antonio, TX 78221",
    phone: "512-463-0714",
    capitolAddress: "Room E2.822, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "8307 S. Flores St., San Antonio, TX 78221",
    vacant: false,
    authority: {
      slug: "john-lujan",
      reviewedAt: "2026-07-31",
      biography:
        "John Lujan is the current Representative for Texas House District 118. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 118 since 2021-11-16.",
        "Capitol office: Room E2.822, P.O. Box 12910, Austin, TX 78711",
        "District office: 8307 S. Flores St., San Antonio, TX 78221",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Appropriations",
        "Local and Consent Calendars",
        "Trade, Workforce and Economic Development",
      ],
      electionHistory: [
        {
          year: "2021",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 118. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["John Lujan", "Representative John Lujan", "Texas House District 118"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3145",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3145/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "liz-campos",
    name: "Liz Campos",
    chamber: "house",
    district: 119,
    party: "D",
    website: "https://house.texas.gov/members/119",
    imageUrl: "https://house.texas.gov/images/members/3950.jpg?v=1",
    officialCode: null,
    home: "3124 Sidney Brooks Suite A, San Antonio, TX 78235",
    phone: "512-463-0452",
    capitolAddress: "Room E2.422, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "3124 Sidney Brooks Suite A, San Antonio, TX 78235",
    vacant: false,
    authority: {
      slug: "liz-campos",
      reviewedAt: "2026-07-31",
      biography:
        "Liz Campos is the current Representative for Texas House District 119. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 119 since 2021-01-12.",
        "Capitol office: Room E2.422, P.O. Box 12910, Austin, TX 78711",
        "District office: 3124 Sidney Brooks Suite A, San Antonio, TX 78235",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Delivery of Government Efficiency", "Public Health — Vice Chair"],
      electionHistory: [
        {
          year: "2021",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 119. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Liz Campos", "Representative Liz Campos", "Texas House District 119"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/119",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3950/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "barbara-gervin-hawkins",
    name: "Barbara Gervin-Hawkins",
    chamber: "house",
    district: 120,
    party: "D",
    website: "https://house.texas.gov/members/120",
    imageUrl: "https://house.texas.gov/images/members/3445.jpg?v=1",
    officialCode: null,
    home: "3503 NE Parkway, San Antonio, TX 78218",
    phone: "512-463-0708",
    capitolAddress: "Room GN.12, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "3503 NE Parkway, San Antonio, TX 78218",
    vacant: false,
    authority: {
      slug: "barbara-gervin-hawkins",
      reviewedAt: "2026-07-31",
      biography:
        "Barbara Gervin-Hawkins is the current Representative for Texas House District 120. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 120 since 2017-01-10.",
        "Capitol office: Room GN.12, P.O. Box 12910, Austin, TX 78711",
        "District office: 3503 NE Parkway, San Antonio, TX 78218",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Appropriations",
        "Congressional Redistricting Select",
        "Redistricting",
        "Ways and Means",
      ],
      electionHistory: [
        {
          year: "2017",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 120. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Barbara Gervin-Hawkins",
        "Representative Barbara Gervin-Hawkins",
        "Texas House District 120",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/120",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3445/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "marc-lahood",
    name: "Marc LaHood",
    chamber: "house",
    district: 121,
    party: "R",
    website: "https://house.texas.gov/members/121",
    imageUrl: "https://www.house.texas.gov/images/members/4595.jpg?v=1",
    officialCode: null,
    home: "1635 NE Loop 410 Suite 901, San Antonio, TX 78209",
    phone: "512-463-0686",
    capitolAddress: "Room E2.804, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "1635 NE Loop 410 Suite 901, San Antonio, TX 78209",
    vacant: false,
    authority: {
      slug: "marc-lahood",
      reviewedAt: "2026-07-31",
      biography:
        "Marc LaHood is the current Representative for Texas House District 121. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 121 since 2025-01-14.",
        "Capitol office: Room E2.804, P.O. Box 12910, Austin, TX 78711",
        "District office: 1635 NE Loop 410 Suite 901, San Antonio, TX 78209",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Judiciary and Civil Jurisprudence", "Transportation"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 121. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Marc LaHood", "Representative Marc LaHood", "Texas House District 121"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/121",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4595/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "mark-dorazio",
    name: "Mark Dorazio",
    chamber: "house",
    district: 122,
    party: "R",
    website: "https://house.texas.gov/members/122",
    imageUrl: "https://house.texas.gov/images/members/4145.jpg?v=2",
    officialCode: null,
    home: "4634 De Zavala Road, San Antonio, TX 78249",
    phone: "512-463-0646",
    capitolAddress: "Room E1.406, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "4634 De Zavala Road, San Antonio, TX 78249",
    vacant: false,
    authority: {
      slug: "mark-dorazio",
      reviewedAt: "2026-07-31",
      biography:
        "Mark Dorazio is the current Representative for Texas House District 122. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 122 since 2023-01-10.",
        "Capitol office: Room E1.406, P.O. Box 12910, Austin, TX 78711",
        "District office: 4634 De Zavala Road, San Antonio, TX 78249",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Homeland Security, Public Safety and Veterans' Affairs", "Human Services"],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 122. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Mark Dorazio", "Representative Mark Dorazio", "Texas House District 122"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/122",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4145/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "diego-bernal",
    name: "Diego Bernal",
    chamber: "house",
    district: 123,
    party: "D",
    website: "https://house.texas.gov/members/3110",
    imageUrl: "https://house.texas.gov/images/members/3110.jpg?v=1",
    officialCode: null,
    home: "9862 Lorene Lane Suite 102, San Antonio, TX 78216",
    phone: "512-463-0532",
    capitolAddress: "Room 4N.6, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "9862 Lorene Lane Suite 102, San Antonio, TX 78216",
    vacant: false,
    authority: {
      slug: "diego-bernal",
      reviewedAt: "2026-07-31",
      biography:
        "Diego Bernal is the current Representative for Texas House District 123. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 123 since 2015-03-03.",
        "Capitol office: Room 4N.6, P.O. Box 12910, Austin, TX 78711",
        "District office: 9862 Lorene Lane Suite 102, San Antonio, TX 78216",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Public Education — Vice Chair", "Ways and Means"],
      electionHistory: [
        {
          year: "2015",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 123. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Diego Bernal", "Representative Diego Bernal", "Texas House District 123"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3110",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3110/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "josey-garcia",
    name: "Josey Garcia",
    chamber: "house",
    district: 124,
    party: "D",
    website: "https://house.texas.gov/members/124",
    imageUrl: "https://house.texas.gov/images/members/4170.jpg?v=1",
    officialCode: null,
    home: "9258 Culebra Road Suite 121, San Antonio, TX 78251",
    phone: "512-463-0634",
    capitolAddress: "Room E2.904, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "9258 Culebra Road Suite 121, San Antonio, TX 78251",
    vacant: false,
    authority: {
      slug: "josey-garcia",
      reviewedAt: "2026-07-31",
      biography:
        "Josey Garcia is the current Representative for Texas House District 124. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 124 since 2023-01-10.",
        "Capitol office: Room E2.904, P.O. Box 12910, Austin, TX 78711",
        "District office: 9258 Culebra Road Suite 121, San Antonio, TX 78251",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Congressional Redistricting Select",
        "Energy Resources",
        "Natural Resources",
        "Redistricting",
      ],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 124. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Josey Garcia", "Representative Josey Garcia", "Texas House District 124"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/124",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4170/biography",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "ray-lopez",
    name: "Ray Lopez",
    chamber: "house",
    district: 125,
    party: "D",
    website: "https://house.texas.gov/members/3915",
    imageUrl: "https://house.texas.gov/images/members/3915.jpg?v=1",
    officialCode: null,
    home: "5309 Wurzbach Road #100-7, San Antonio, TX 78238",
    phone: "512-463-0669",
    capitolAddress: "Room GW.4, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "5309 Wurzbach Road #100-7, San Antonio, TX 78238",
    vacant: false,
    authority: {
      slug: "ray-lopez",
      reviewedAt: "2026-07-31",
      biography:
        "Ray Lopez is the current Representative for Texas House District 125. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 125 since 2019-03-21.",
        "Capitol office: Room GW.4, P.O. Box 12910, Austin, TX 78711",
        "District office: 5309 Wurzbach Road #100-7, San Antonio, TX 78238",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Homeland Security, Public Safety and Veterans' Affairs — Vice Chair",
        "Land and Resource Management",
      ],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 125. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Ray Lopez", "Representative Ray Lopez", "Texas House District 125"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3915",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3915",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "sam-harless",
    name: "Sam Harless",
    chamber: "house",
    district: 126,
    party: "R",
    website: "https://house.texas.gov/members/3775",
    imageUrl: "https://house.texas.gov/images/members/3775.jpg?v=1",
    officialCode: null,
    home: "15900 Stuebner Airline Road, Spring, TX 77379",
    phone: "512-463-0496",
    capitolAddress: "Room GW.6, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "15900 Stuebner Airline Road, Spring, TX 77379",
    vacant: false,
    authority: {
      slug: "sam-harless",
      reviewedAt: "2026-07-31",
      biography:
        "Sam Harless is the current Representative for Texas House District 126. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 126 since 2019-01-08.",
        "Capitol office: Room GW.6, P.O. Box 12910, Austin, TX 78711",
        "District office: 15900 Stuebner Airline Road, Spring, TX 77379",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Administration",
        "Corrections — Chair",
        "Licensing and Administrative Procedures",
      ],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 126. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Sam Harless", "Representative Sam Harless", "Texas House District 126"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3775",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3775",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "charles-cunningham",
    name: "Charles Cunningham",
    chamber: "house",
    district: 127,
    party: "R",
    website: "https://house.texas.gov/members/4130",
    imageUrl: "https://house.texas.gov/images/members/4130.jpg?v=1",
    officialCode: null,
    home: "110 W. Main St., Humble, TX 77338",
    phone: "512-463-0520",
    capitolAddress: "Room E2.410, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "110 W. Main St., Humble, TX 77338",
    vacant: false,
    authority: {
      slug: "charles-cunningham",
      reviewedAt: "2026-07-31",
      biography:
        "Charles Cunningham is the current Representative for Texas House District 127. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 127 since 2023-01-10.",
        "Capitol office: Room E2.410, P.O. Box 12910, Austin, TX 78711",
        "District office: 110 W. Main St., Humble, TX 77338",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Local and Consent Calendars", "Public Education", "Public Health"],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 127. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Charles Cunningham",
        "Representative Charles Cunningham",
        "Texas House District 127",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4130",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4130",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "briscoe-cain",
    name: "Briscoe Cain",
    chamber: "house",
    district: 128,
    party: "R",
    website: "https://house.texas.gov/members/3265",
    imageUrl: "https://house.texas.gov/images/members/3265.jpg?v=2",
    officialCode: null,
    home: "None",
    phone: "512-463-0733",
    capitolAddress: "Room E1.320, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "None",
    vacant: false,
    authority: {
      slug: "briscoe-cain",
      reviewedAt: "2026-07-31",
      biography:
        "Briscoe Cain is the current Representative for Texas House District 128. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 128 since 2017-01-10.",
        "Capitol office: Room E1.320, P.O. Box 12910, Austin, TX 78711",
        "District office: None",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Agriculture and Livestock", "Delivery of Government Efficiency"],
      electionHistory: [
        {
          year: "2017",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 128. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Briscoe Cain", "Representative Briscoe Cain", "Texas House District 128"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3265",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3265",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "dennis-paul",
    name: "Dennis Paul",
    chamber: "house",
    district: 129,
    party: "R",
    website: "https://house.texas.gov/members/3090",
    imageUrl: "https://house.texas.gov/images/members/3090.jpg?v=1",
    officialCode: null,
    home: "17225 El Camino Real Blvd. Suite 415, Houston, TX 77058",
    phone: "512-463-0734",
    capitolAddress: "Room GS.2, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "17225 El Camino Real Blvd. Suite 415, Houston, TX 77058",
    vacant: false,
    authority: {
      slug: "dennis-paul",
      reviewedAt: "2026-07-31",
      biography:
        "Dennis Paul is the current Representative for Texas House District 129. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 129 since 2015-01-13.",
        "Capitol office: Room GS.2, P.O. Box 12910, Austin, TX 78711",
        "District office: 17225 El Camino Real Blvd. Suite 415, Houston, TX 77058",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Insurance", "Transportation"],
      electionHistory: [
        {
          year: "2015",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 129. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Dennis Paul", "Representative Dennis Paul", "Texas House District 129"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3090",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3090",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "tom-oliverson",
    name: "Tom Oliverson",
    chamber: "house",
    district: 130,
    party: "R",
    website: "https://house.texas.gov/members/3535",
    imageUrl: "https://house.texas.gov/images/members/3535.jpg?v=1",
    officialCode: null,
    home: "825 Village Square Drive, #4, Tomball, TX 77375",
    phone: "512-463-0661",
    capitolAddress: "Room E2.408, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "825 Village Square Drive, #4, Tomball, TX 77375",
    vacant: false,
    authority: {
      slug: "tom-oliverson",
      reviewedAt: "2026-07-31",
      biography:
        "Tom Oliverson is the current Representative for Texas House District 130. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 130 since 2017-01-10.",
        "Capitol office: Room E2.408, P.O. Box 12910, Austin, TX 78711",
        "District office: 825 Village Square Drive, #4, Tomball, TX 77375",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Appropriations",
        "Environmental Regulation",
        "Health Care Affordability Select",
        "Redistricting",
      ],
      electionHistory: [
        {
          year: "2017",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 130. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Tom Oliverson", "Representative Tom Oliverson", "Texas House District 130"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3535",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3535",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "alma-allen",
    name: "Alma Allen",
    chamber: "house",
    district: 131,
    party: "D",
    website: "https://house.texas.gov/members/2100",
    imageUrl: "https://house.texas.gov/images/members/2100.jpg?v=1",
    officialCode: null,
    home: "10101 Fondren Road Suite 500, Houston, TX 77096",
    phone: "512-463-0744",
    capitolAddress: "Room 4N.10, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "10101 Fondren Road Suite 500, Houston, TX 77096",
    vacant: false,
    authority: {
      slug: "alma-allen",
      reviewedAt: "2026-07-31",
      biography:
        "Alma Allen is the current Representative for Texas House District 131. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 131 since 2005-01-11.",
        "Capitol office: Room 4N.10, P.O. Box 12910, Austin, TX 78711",
        "District office: 10101 Fondren Road Suite 500, Houston, TX 77096",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Corrections", "Public Education"],
      electionHistory: [
        {
          year: "2005",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 131. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Alma Allen", "Representative Alma Allen", "Texas House District 131"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2100",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2100",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "mike-schofield",
    name: "Mike Schofield",
    chamber: "house",
    district: 132,
    party: "R",
    website: "https://house.texas.gov/members/3095",
    imageUrl: "https://house.texas.gov/images/members/3095.jpg?v=1",
    officialCode: null,
    home: "22910 Colonial Parkway Suite 1001, Katy, TX 77449",
    phone: "512-463-0528",
    capitolAddress: "Room E2.418, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "22910 Colonial Parkway Suite 1001, Katy, TX 77449",
    vacant: false,
    authority: {
      slug: "mike-schofield",
      reviewedAt: "2026-07-31",
      biography:
        "Mike Schofield is the current Representative for Texas House District 132. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 132 since 2021-01-12.",
        "Capitol office: Room E2.418, P.O. Box 12910, Austin, TX 78711",
        "District office: 22910 Colonial Parkway Suite 1001, Katy, TX 77449",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Judiciary and Civil Jurisprudence", "Public Health"],
      electionHistory: [
        {
          year: "2021",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 132. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Mike Schofield", "Representative Mike Schofield", "Texas House District 132"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3095",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3095",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "mano-deayala",
    name: "Mano DeAyala",
    chamber: "house",
    district: 133,
    party: "R",
    website: "https://house.texas.gov/members/4135",
    imageUrl: "https://house.texas.gov/images/members/4135.jpg?v=1",
    officialCode: null,
    home: "9525 Katy Freeway Suite 215B, Houston, TX 77024",
    phone: "512-463-0514",
    capitolAddress: "Room E1.318, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "9525 Katy Freeway Suite 215B, Houston, TX 77024",
    vacant: false,
    authority: {
      slug: "mano-deayala",
      reviewedAt: "2026-07-31",
      biography:
        "Mano DeAyala is the current Representative for Texas House District 133. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 133 since 2023-01-10.",
        "Capitol office: Room E1.318, P.O. Box 12910, Austin, TX 78711",
        "District office: 9525 Katy Freeway Suite 215B, Houston, TX 77024",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Appropriations", "Culture, Recreation and Tourism"],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 133. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Mano DeAyala", "Representative Mano DeAyala", "Texas House District 133"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4135",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4135",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "ann-johnson",
    name: "Ann Johnson",
    chamber: "house",
    district: 134,
    party: "D",
    website: "https://house.texas.gov/members/134",
    imageUrl: "https://house.texas.gov/images/members/3985.jpg?v=1",
    officialCode: null,
    home: "5601 W. Loop South Suite C218, Houston, TX 77081",
    phone: "512-463-0389",
    capitolAddress: "Room E2.718, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "5601 W. Loop South Suite C218, Houston, TX 77081",
    vacant: false,
    authority: {
      slug: "ann-johnson",
      reviewedAt: "2026-07-31",
      biography:
        "Ann Johnson is the current Representative for Texas House District 134. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 134 since 2021-01-12.",
        "Capitol office: Room E2.718, P.O. Box 12910, Austin, TX 78711",
        "District office: 5601 W. Loop South Suite C218, Houston, TX 77081",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Calendars",
        "Disaster Preparedness and Flooding Select",
        "Judiciary and Civil Jurisprudence — Vice Chair",
        "Public Health",
      ],
      electionHistory: [
        {
          year: "2021",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 134. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Ann Johnson", "Representative Ann Johnson", "Texas House District 134"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/134",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/134",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "jon-rosenthal",
    name: "Jon Rosenthal",
    chamber: "house",
    district: 135,
    party: "D",
    website: "https://house.texas.gov/members/135",
    imageUrl: "https://house.texas.gov/images/members/3635.jpg?v=1",
    officialCode: null,
    home: "8440 Greenhouse Road Suite #A104, Cypress, TX 77433",
    phone: "512-463-0722",
    capitolAddress: "Room E2.308, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "8440 Greenhouse Road Suite #A104, Cypress, TX 77433",
    vacant: false,
    authority: {
      slug: "jon-rosenthal",
      reviewedAt: "2026-07-31",
      biography:
        "Jon Rosenthal is the current Representative for Texas House District 135. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 135 since 2019-01-08.",
        "Capitol office: Room E2.308, P.O. Box 12910, Austin, TX 78711",
        "District office: 8440 Greenhouse Road Suite #A104, Cypress, TX 77433",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Congressional Redistricting Select — Vice Chair",
        "Energy Resources",
        "Intergovernmental Affairs",
        "Redistricting — Vice Chair",
      ],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 135. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Jon Rosenthal", "Representative Jon Rosenthal", "Texas House District 135"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/135",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/135",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "john-bucy",
    name: "John Bucy",
    chamber: "house",
    district: 136,
    party: "D",
    website: "https://house.texas.gov/members/136",
    imageUrl: "https://house.texas.gov/images/members/3595.jpg?v=5",
    officialCode: null,
    home: null,
    phone: "512-463-0696",
    capitolAddress: "Room GN.9, P.O. Box 12910, Austin, TX 78711",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "john-bucy",
      reviewedAt: "2026-07-31",
      biography:
        "John Bucy is the current Representative for Texas House District 136. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 136 since 2019-01-08.",
        "Capitol office: Room GN.9, P.O. Box 12910, Austin, TX 78711",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Elections — Vice Chair", "Local and Consent Calendars", "Public Health"],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 136. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["John Bucy", "Representative John Bucy", "Texas House District 136"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/136",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/136",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "gene-wu",
    name: "Gene Wu",
    chamber: "house",
    district: 137,
    party: "D",
    website: "https://house.texas.gov/members/2865",
    imageUrl: "https://house.texas.gov/images/members/2865.jpg?v=1",
    officialCode: null,
    home: "6500 Rookin, Building C, Houston, TX 77074",
    phone: "512-463-0492",
    capitolAddress: "Room GW.5, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "6500 Rookin, Building C, Houston, TX 77074",
    vacant: false,
    authority: {
      slug: "gene-wu",
      reviewedAt: "2026-07-31",
      biography:
        "Gene Wu is the current Representative for Texas House District 137. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 137 since 2013-01-08.",
        "Capitol office: Room GW.5, P.O. Box 12910, Austin, TX 78711",
        "District office: 6500 Rookin, Building C, Houston, TX 77074",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Appropriations",
        "Congressional Redistricting Select",
        "Criminal Jurisprudence — Vice Chair",
        "Redistricting",
      ],
      electionHistory: [
        {
          year: "2013",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 137. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Gene Wu", "Representative Gene Wu", "Texas House District 137"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2865",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2865",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "lacey-hull",
    name: "Lacey Hull",
    chamber: "house",
    district: 138,
    party: "R",
    website: "https://house.texas.gov/members/3975",
    imageUrl: "https://house.texas.gov/images/members/3975.jpg?v=1",
    officialCode: null,
    home: "10190 Katy Freeway Suite 555G, Houston, TX 77043",
    phone: "512-463-0727",
    capitolAddress: "Room E2.212, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "10190 Katy Freeway Suite 555G, Houston, TX 77043",
    vacant: false,
    authority: {
      slug: "lacey-hull",
      reviewedAt: "2026-07-31",
      biography:
        "Lacey Hull is the current Representative for Texas House District 138. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 138 since 2021-01-12.",
        "Capitol office: Room E2.212, P.O. Box 12910, Austin, TX 78711",
        "District office: 10190 Katy Freeway Suite 555G, Houston, TX 77043",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Human Services — Chair", "State Affairs"],
      electionHistory: [
        {
          year: "2021",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 138. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Lacey Hull", "Representative Lacey Hull", "Texas House District 138"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3975",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3975",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "charlene-ward-johnson",
    name: "Charlene Ward Johnson",
    chamber: "house",
    district: 139,
    party: "D",
    website: "https://house.texas.gov/members/139",
    imageUrl: "https://www.house.texas.gov/images/members/4785.jpg?v=3",
    officialCode: null,
    home: "630 W. Little York Road, Houston, TX 77091",
    phone: "512-463-0554",
    capitolAddress: "Room E2.320, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "630 W. Little York Road, Houston, TX 77091",
    vacant: false,
    authority: {
      slug: "charlene-ward-johnson",
      reviewedAt: "2026-07-31",
      biography:
        "Charlene Ward Johnson is the current Representative for Texas House District 139. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 139 since 2025-01-14.",
        "Capitol office: Room E2.320, P.O. Box 12910, Austin, TX 78711",
        "District office: 630 W. Little York Road, Houston, TX 77091",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Culture, Recreation and Tourism", "Higher Education"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 139. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Charlene Ward Johnson",
        "Representative Charlene Ward Johnson",
        "Texas House District 139",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/139",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/139",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "armando-walle",
    name: "Armando Walle",
    chamber: "house",
    district: 140,
    party: "D",
    website: "https://house.texas.gov/members/4930",
    imageUrl: "https://house.texas.gov/images/members/4930.jpg?v=1",
    officialCode: null,
    home: "2909 E. Aldine Amphitheatre Drive Suite 307, Houston, TX 77039",
    phone: "512-463-0924",
    capitolAddress: "Room GW.16, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "2909 E. Aldine Amphitheatre Drive Suite 307, Houston, TX 77039",
    vacant: false,
    authority: {
      slug: "armando-walle",
      reviewedAt: "2026-07-31",
      biography:
        "Armando Walle is the current Representative for Texas House District 140. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 140 since 2009-01-13.",
        "Capitol office: Room GW.16, P.O. Box 12910, Austin, TX 78711",
        "District office: 2909 E. Aldine Amphitheatre Drive Suite 307, Houston, TX 77039",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Appropriations",
        "Governmental Oversight Select — Vice Chair",
        "Legislative Budget Board",
        "Licensing and Administrative Procedures",
      ],
      electionHistory: [
        {
          year: "2009",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 140. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Armando Walle", "Representative Armando Walle", "Texas House District 140"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4930",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4930",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "senfronia-thompson",
    name: "Senfronia Thompson",
    chamber: "house",
    district: 141,
    party: "D",
    website: "https://house.texas.gov/members/4630",
    imageUrl: "https://house.texas.gov/images/members/4630.jpg?v=1",
    officialCode: null,
    home: "350 N. Sam Houston Parkway Suite B202, Houston, TX 77060",
    phone: "512-463-0720",
    capitolAddress: "Room 3S.6, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "350 N. Sam Houston Parkway Suite B202, Houston, TX 77060",
    vacant: false,
    authority: {
      slug: "senfronia-thompson",
      reviewedAt: "2026-07-31",
      biography:
        "Senfronia Thompson is the current Representative for Texas House District 141. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 141 since 1983-01-11.",
        "Capitol office: Room 3S.6, P.O. Box 12910, Austin, TX 78711",
        "District office: 350 N. Sam Houston Parkway Suite B202, Houston, TX 77060",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Civil Discourse and Freedom of Speech in Higher Education Select",
        "Congressional Redistricting Select",
        "Licensing and Administrative Procedures — Vice Chair",
        "State Affairs",
      ],
      electionHistory: [
        {
          year: "1983",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 141. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Senfronia Thompson",
        "Representative Senfronia Thompson",
        "Texas House District 141",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4630",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4630",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "harold-dutton",
    name: "Harold Dutton",
    chamber: "house",
    district: 142,
    party: "D",
    website: "https://house.texas.gov/members/2650",
    imageUrl: "https://house.texas.gov/images/members/2650.jpg?v=3",
    officialCode: null,
    home: "8799 N. Loop East Suite 200, Houston, TX 77029",
    phone: "512-463-0510",
    capitolAddress: "Room 3N.5, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "8799 N. Loop East Suite 200, Houston, TX 77029",
    vacant: false,
    authority: {
      slug: "harold-dutton",
      reviewedAt: "2026-07-31",
      biography:
        "Harold Dutton is the current Representative for Texas House District 142. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 142 since 1985-01-08.",
        "Capitol office: Room 3N.5, P.O. Box 12910, Austin, TX 78711",
        "District office: 8799 N. Loop East Suite 200, Houston, TX 77029",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Judiciary and Civil Jurisprudence", "Public Education"],
      electionHistory: [
        {
          year: "1985",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 142. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Harold Dutton", "Representative Harold Dutton", "Texas House District 142"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2650",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2650",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "ana-hernandez",
    name: "Ana Hernandez",
    chamber: "house",
    district: 143,
    party: "D",
    website: "https://house.texas.gov/members/3155",
    imageUrl: "https://house.texas.gov/images/members/3155.jpg?v=1",
    officialCode: null,
    home: "1233 Mercury Drive, Houston, TX 77029",
    phone: "512-463-0614",
    capitolAddress: "Room 1W.11, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "1233 Mercury Drive, Houston, TX 77029",
    vacant: false,
    authority: {
      slug: "ana-hernandez",
      reviewedAt: "2026-07-31",
      biography:
        "Ana Hernandez is the current Representative for Texas House District 143. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 143 since 2005-12-20.",
        "Capitol office: Room 1W.11, P.O. Box 12910, Austin, TX 78711",
        "District office: 1233 Mercury Drive, Houston, TX 77029",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Calendars",
        "Licensing and Administrative Procedures",
        "State Affairs — Vice Chair",
      ],
      electionHistory: [
        {
          year: "2005",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 143. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Ana Hernandez", "Representative Ana Hernandez", "Texas House District 143"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3155",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3155",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "mary-ann-perez",
    name: "Mary Ann Perez",
    chamber: "house",
    district: 144,
    party: "D",
    website: "https://house.texas.gov/members/2535",
    imageUrl: "https://house.texas.gov/images/members/2535.jpg?v=1",
    officialCode: null,
    home: "101 S. Richey St. Suite F107, Pasadena, TX 77506",
    phone: "512-463-0460",
    capitolAddress: "Room 1N.7, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "101 S. Richey St. Suite F107, Pasadena, TX 77506",
    vacant: false,
    authority: {
      slug: "mary-ann-perez",
      reviewedAt: "2026-07-31",
      biography:
        "Mary Ann Perez is the current Representative for Texas House District 144. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 144 since 2017-01-10.",
        "Capitol office: Room 1N.7, P.O. Box 12910, Austin, TX 78711",
        "District office: 101 S. Richey St. Suite F107, Pasadena, TX 77506",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "General Aviation Select",
        "Licensing and Administrative Procedures",
        "Transportation — Vice Chair",
      ],
      electionHistory: [
        {
          year: "2017",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 144. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Mary Ann Perez", "Representative Mary Ann Perez", "Texas House District 144"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/2535",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/2535",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "christina-morales",
    name: "Christina Morales",
    chamber: "house",
    district: 145,
    party: "D",
    website: "https://house.texas.gov/members/3910",
    imageUrl: "https://house.texas.gov/images/members/3910.jpg?v=1",
    officialCode: null,
    home: "6960 Rustic St., Suite 107 Parking Garage, Building C, Houston, TX 77087",
    phone: "512-463-0732",
    capitolAddress: "Room GN.10, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "6960 Rustic St., Suite 107 Parking Garage, Building C, Houston, TX 77087",
    vacant: false,
    authority: {
      slug: "christina-morales",
      reviewedAt: "2026-07-31",
      biography:
        "Christina Morales is the current Representative for Texas House District 145. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 145 since 2019-03-18.",
        "Capitol office: Room GN.10, P.O. Box 12910, Austin, TX 78711",
        "District office: 6960 Rustic St., Suite 107 Parking Garage, Building C, Houston, TX 77087",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Human Services", "Transportation"],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 145. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Christina Morales",
        "Representative Christina Morales",
        "Texas House District 145",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3910",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3910",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "lauren-simmons",
    name: "Lauren Simmons",
    chamber: "house",
    district: 146,
    party: "D",
    website: "https://house.texas.gov/members/4765",
    imageUrl: "https://house.texas.gov/images/members/4765.jpg?v=1",
    officialCode: null,
    home: "7901 El Rio St. Office 1039 and 1041, Houston, TX 77054",
    phone: "512-463-0518",
    capitolAddress: "Room E2.314, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "7901 El Rio St. Office 1039 and 1041, Houston, TX 77054",
    vacant: false,
    authority: {
      slug: "lauren-simmons",
      reviewedAt: "2026-07-31",
      biography:
        "Lauren Simmons is the current Representative for Texas House District 146. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 146 since 2025-01-14.",
        "Capitol office: Room E2.314, P.O. Box 12910, Austin, TX 78711",
        "District office: 7901 El Rio St. Office 1039 and 1041, Houston, TX 77054",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Appropriations", "Health Care Affordability Select", "Public Health"],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 146. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Lauren Simmons", "Representative Lauren Simmons", "Texas House District 146"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4765",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4765",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "jo-jones",
    name: "Jo Jones",
    chamber: "house",
    district: 147,
    party: "D",
    website: "https://house.texas.gov/members/4105",
    imageUrl: "https://house.texas.gov/images/members/4105.jpg?v=1",
    officialCode: null,
    home: "5445 Almeda Road Suite 410, Houston, TX 77004",
    phone: "512-463-0524",
    capitolAddress: "Room E2.908, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "5445 Almeda Road Suite 410, Houston, TX 77004",
    vacant: false,
    authority: {
      slug: "jo-jones",
      reviewedAt: "2026-07-31",
      biography:
        "Jo Jones is the current Representative for Texas House District 147. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 147 since 2022-05-18.",
        "Capitol office: Room E2.908, P.O. Box 12910, Austin, TX 78711",
        "District office: 5445 Almeda Road Suite 410, Houston, TX 77004",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Criminal Jurisprudence", "Public Health", "Redistricting"],
      electionHistory: [
        {
          year: "2022",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 147. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Jo Jones", "Representative Jo Jones", "Texas House District 147"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4105",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4105",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "penny-morales-shaw",
    name: "Penny Morales Shaw",
    chamber: "house",
    district: 148,
    party: "D",
    website: "https://house.texas.gov/members/4035",
    imageUrl: "https://house.texas.gov/images/members/4035.jpg?v=1",
    officialCode: null,
    home: "10900 NW Freeway Suite 210 D, Houston, TX 77092",
    phone: "512-463-0620",
    capitolAddress: "Room E2.710, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "10900 NW Freeway Suite 210 D, Houston, TX 77092",
    vacant: false,
    authority: {
      slug: "penny-morales-shaw",
      reviewedAt: "2026-07-31",
      biography:
        "Penny Morales Shaw is the current Representative for Texas House District 148. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 148 since 2021-01-12.",
        "Capitol office: Room E2.710, P.O. Box 12910, Austin, TX 78711",
        "District office: 10900 NW Freeway Suite 210 D, Houston, TX 77092",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Elections", "Environmental Regulation"],
      electionHistory: [
        {
          year: "2021",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 148. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Penny Morales Shaw",
        "Representative Penny Morales Shaw",
        "Texas House District 148",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4035",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4035",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "hubert-vo",
    name: "Hubert Vo",
    chamber: "house",
    district: 149,
    party: "D",
    website: "https://house.texas.gov/members/4900",
    imageUrl: "https://house.texas.gov/images/members/4900.jpg?v=1",
    officialCode: null,
    home: "7474 S. Kirkwood Suite 106, Houston, TX 77072",
    phone: "512-463-0568",
    capitolAddress: "Room 4N.8, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "7474 S. Kirkwood Suite 106, Houston, TX 77072",
    vacant: false,
    authority: {
      slug: "hubert-vo",
      reviewedAt: "2026-07-31",
      biography:
        "Hubert Vo is the current Representative for Texas House District 149. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 149 since 2005-01-11.",
        "Capitol office: Room 4N.8, P.O. Box 12910, Austin, TX 78711",
        "District office: 7474 S. Kirkwood Suite 106, Houston, TX 77072",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Insurance — Vice Chair", "Pensions, Investments and Financial Services"],
      electionHistory: [
        {
          year: "2005",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 149. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Hubert Vo", "Representative Hubert Vo", "Texas House District 149"],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/4900",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/4900",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "valoree-swanson",
    name: "Valoree Swanson",
    chamber: "house",
    district: 150,
    party: "R",
    website: "https://house.texas.gov/members/3425",
    imageUrl: "https://house.texas.gov/images/members/3425.jpg?v=1",
    officialCode: null,
    home: "23008 Northcrest Drive, Spring, TX 77389",
    phone: "512-463-0572",
    capitolAddress: "Room E1.408, P.O. Box 12910, Austin, TX 78711",
    districtAddress: "23008 Northcrest Drive, Spring, TX 77389",
    vacant: false,
    authority: {
      slug: "valoree-swanson",
      reviewedAt: "2026-07-31",
      biography:
        "Valoree Swanson is the current Representative for Texas House District 150. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Representative for Texas House District 150 since 2017-01-10.",
        "Capitol office: Room E1.408, P.O. Box 12910, Austin, TX 78711",
        "District office: 23008 Northcrest Drive, Spring, TX 77389",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Elections", "Human Services"],
      electionHistory: [
        {
          year: "2017",
          result: "Current recorded Texas House service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas House District 150. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: [
        "Valoree Swanson",
        "Representative Valoree Swanson",
        "Texas House District 150",
      ],
      sources: [
        {
          label: "Official Texas House member page",
          url: "https://house.texas.gov/members/3425",
        },
        {
          label: "Official member biography",
          url: "https://house.texas.gov/members/3425",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=H",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "bryan-hughes",
    name: "Bryan Hughes",
    chamber: "senate",
    district: 1,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=1",
    imageUrl: "https://senate.texas.gov/members/d01/img/Hughes_86-0702D-030-web.jpg",
    officialCode: null,
    home: "110 N. College Ave. Suite 208, Tyler, TX 75702",
    phone: "512-463-0101",
    capitolAddress: "Room 3E.8, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "110 N. College Ave. Suite 208, Tyler, TX 75702",
    vacant: false,
    authority: {
      slug: "bryan-hughes",
      reviewedAt: "2026-07-31",
      biography:
        "Bryan Hughes is the current Senator for Texas Senate District 1. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 1 since 2017-01-10.",
        "Capitol office: Room 3E.8, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 110 N. College Ave. Suite 208, Tyler, TX 75702",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Civil Discourse and Freedom of Speech in Higher Education Select — Vice Chair",
        "General Investigating Committee on the July 2025 Flooding Events",
        "Health and Human Services",
        "Local Government — Vice Chair",
        "Natural Resources",
        "Nominations",
        "Religious Liberty Select",
        "Special Committee on Congressional Redistricting",
        "State Affairs — Chair",
      ],
      electionHistory: [
        {
          year: "2017",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 1. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Bryan Hughes", "Senator Bryan Hughes", "Texas Senate District 1"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=1",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=1",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "bob-hall",
    name: "Bob Hall",
    chamber: "senate",
    district: 2,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=2",
    imageUrl: "https://senate.texas.gov/members/d02/img/headshot.jpg",
    officialCode: null,
    home: "17585 State Highway 19 Suite 200, Canton, TX 75103",
    phone: "512-463-0102",
    capitolAddress: "Room 1E.15, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "17585 State Highway 19 Suite 200, Canton, TX 75103",
    vacant: false,
    authority: {
      slug: "bob-hall",
      reviewedAt: "2026-07-31",
      biography:
        "Bob Hall is the current Senator for Texas Senate District 2. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 2 since 2015-01-13.",
        "Capitol office: Room 1E.15, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 17585 State Highway 19 Suite 200, Canton, TX 75103",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Administration — Chair",
        "Civil Discourse and Freedom of Speech in Higher Education Select",
        "Finance",
        "Health and Human Services",
        "Homeland and Border Security Select",
        "State Affairs",
        "Veteran Affairs Select — Vice Chair",
      ],
      electionHistory: [
        {
          year: "2015",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 2. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Bob Hall", "Senator Bob Hall", "Texas Senate District 2"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=2",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=2",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "robert-nichols",
    name: "Robert Nichols",
    chamber: "senate",
    district: 3,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=3",
    imageUrl: "https://senate.texas.gov/members/d03/img/headshot.jpg",
    officialCode: null,
    home: "202 E. Pilar St. Suite 309, Nacogdoches, TX 75961",
    phone: "512-463-0103",
    capitolAddress: "Room E1.704, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "202 E. Pilar St. Suite 309, Nacogdoches, TX 75961",
    vacant: false,
    authority: {
      slug: "robert-nichols",
      reviewedAt: "2026-07-31",
      biography:
        "Robert Nichols is the current Senator for Texas Senate District 3. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 3 since 2007-01-09.",
        "Capitol office: Room E1.704, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 202 E. Pilar St. Suite 309, Nacogdoches, TX 75961",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "No current committee assignment is published for this member in the maintained Texas Senate roster.",
      ],
      electionHistory: [
        {
          year: "2007",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 3. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Robert Nichols", "Senator Robert Nichols", "Texas Senate District 3"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=3",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=3",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "brett-ligon",
    name: "Brett Ligon",
    chamber: "senate",
    district: 4,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=4",
    imageUrl: "https://www.bihmfirm.com/images/att_brett.jpg",
    officialCode: null,
    home: null,
    phone: null,
    capitolAddress: null,
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "brett-ligon",
      reviewedAt: "2026-07-31",
      biography:
        "Brett Ligon is the current Senator for Texas Senate District 4. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: ["Serving as Senator for Texas Senate District 4 since 2025-01-14."],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "No current committee assignment is published for this member in the maintained Texas Senate roster.",
      ],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 4. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Brett Ligon", "Senator Brett Ligon", "Texas Senate District 4"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=4",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=4",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "charles-schwertner",
    name: "Charles Schwertner",
    chamber: "senate",
    district: 5,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=5",
    imageUrl: "https://senate.texas.gov/members/d05/img/headshot.jpg",
    officialCode: null,
    home: "3000 Briarcrest Drive Suite 202, Bryan, TX 77802",
    phone: "512-463-0105",
    capitolAddress: "Room 3S.5, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "3000 Briarcrest Drive Suite 202, Bryan, TX 77802",
    vacant: false,
    authority: {
      slug: "charles-schwertner",
      reviewedAt: "2026-07-31",
      biography:
        "Charles Schwertner is the current Senator for Texas Senate District 5. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 5 since 2013-01-08.",
        "Capitol office: Room 3S.5, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 3000 Briarcrest Drive Suite 202, Bryan, TX 77802",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Business and Commerce — Chair",
        "Disaster Preparedness and Flooding Select",
        "Economic Development",
        "Finance",
        "Legislative Budget Board",
        "State Affairs",
      ],
      electionHistory: [
        {
          year: "2013",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 5. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Charles Schwertner", "Senator Charles Schwertner", "Texas Senate District 5"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=5",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=5",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "carol-alvarado",
    name: "Carol Alvarado",
    chamber: "senate",
    district: 6,
    party: "D",
    website: "https://senate.texas.gov/member.php?d=6",
    imageUrl: "https://senate.texas.gov/members/d06/img/CA-2018_web.jpg",
    officialCode: null,
    home: "4450 Harrisburg Suite 436, Houston, TX 77011",
    phone: "512-463-0106",
    capitolAddress: "Room 1E.9, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "4450 Harrisburg Suite 436, Houston, TX 77011",
    vacant: false,
    authority: {
      slug: "carol-alvarado",
      reviewedAt: "2026-07-31",
      biography:
        "Carol Alvarado is the current Senator for Texas Senate District 6. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 6 since 2018-12-21.",
        "Capitol office: Room 1E.9, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 4450 Harrisburg Suite 436, Houston, TX 77011",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Economic Development",
        "Finance",
        "Higher Education",
        "Natural Resources",
        "Nominations",
        "Special Committee on Congressional Redistricting",
      ],
      electionHistory: [
        {
          year: "2018",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 6. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Carol Alvarado", "Senator Carol Alvarado", "Texas Senate District 6"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=6",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=6",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "paul-bettencourt",
    name: "Paul Bettencourt",
    chamber: "senate",
    district: 7,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=7",
    imageUrl: "https://senate.texas.gov/members/d07/img/action.jpg",
    officialCode: null,
    home: "11451 Katy Freeway Suite 209, Houston, TX 77079",
    phone: "512-463-0107",
    capitolAddress: "Room 3E.16, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "11451 Katy Freeway Suite 209, Houston, TX 77079",
    vacant: false,
    authority: {
      slug: "paul-bettencourt",
      reviewedAt: "2026-07-31",
      biography:
        "Paul Bettencourt is the current Senator for Texas Senate District 7. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 7 since 2015-01-13.",
        "Capitol office: Room 3E.16, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 11451 Katy Freeway Suite 209, Houston, TX 77079",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Civil Discourse and Freedom of Speech in Higher Education Select — Chair",
        "Disaster Preparedness and Flooding Select",
        "Education — Vice Chair",
        "Finance",
        "Higher Education — Chair",
        "Local Government — Chair",
        "State Affairs",
        "Transportation",
      ],
      electionHistory: [
        {
          year: "2015",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 7. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Paul Bettencourt", "Senator Paul Bettencourt", "Texas Senate District 7"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=7",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=7",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "angela-paxton",
    name: "Angela Paxton",
    chamber: "senate",
    district: 8,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=8",
    imageUrl: "https://senate.texas.gov/members/d08/img/Paxton_2019.jpg",
    officialCode: null,
    home: "2816 Lee St. Suite A, Greenville, TX 75401",
    phone: "512-463-0108",
    capitolAddress: "Room 3E.10, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "2816 Lee St. Suite A, Greenville, TX 75401",
    vacant: false,
    authority: {
      slug: "angela-paxton",
      reviewedAt: "2026-07-31",
      biography:
        "Angela Paxton is the current Senator for Texas Senate District 8. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 8 since 2019-01-08.",
        "Capitol office: Room 3E.10, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 2816 Lee St. Suite A, Greenville, TX 75401",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Economic Development — Chair",
        "Education",
        "Finance",
        "Higher Education",
        "Local Government",
        "Nominations",
        "Religious Liberty Select — Vice Chair",
        "Special Committee on Congressional Redistricting",
        "State Affairs — Vice Chair",
      ],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 8. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Angela Paxton", "Senator Angela Paxton", "Texas Senate District 8"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=8",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=8",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "taylor-rehmet",
    name: "Taylor Rehmet",
    chamber: "senate",
    district: 9,
    party: "D",
    website: "https://senate.texas.gov/member.php?d=9",
    imageUrl: "https://senate.texas.gov/members/d09/img/Rehmet-89-0739D-017-web.jpg",
    officialCode: null,
    home: "217 S. Jennings Ave. Suite 100, Fort Worth, TX 76104",
    phone: "512-463-0109",
    capitolAddress: "P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "217 S. Jennings Ave. Suite 100, Fort Worth, TX 76104",
    vacant: false,
    authority: {
      slug: "taylor-rehmet",
      reviewedAt: "2026-07-31",
      biography:
        "Taylor Rehmet is the current Senator for Texas Senate District 9. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 9 since 2026-02-19.",
        "Capitol office: P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 217 S. Jennings Ave. Suite 100, Fort Worth, TX 76104",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "No current committee assignment is published for this member in the maintained Texas Senate roster.",
      ],
      electionHistory: [
        {
          year: "2026",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 9. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Taylor Rehmet", "Senator Taylor Rehmet", "Texas Senate District 9"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=9",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=9",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "phil-king",
    name: "Phil King",
    chamber: "senate",
    district: 10,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=10",
    imageUrl: "https://senate.texas.gov/members/d10/img/King_88-0550D-004-WEB.jpg",
    officialCode: null,
    home: "Heritage Rock II 2340 W. Interstate 20, Suite 218, Arlington, TX 76017",
    phone: "512-463-0110",
    capitolAddress: "Room GE.5, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "Heritage Rock II 2340 W. Interstate 20, Suite 218, Arlington, TX 76017",
    vacant: false,
    authority: {
      slug: "phil-king",
      reviewedAt: "2026-07-31",
      biography:
        "Phil King is the current Senator for Texas Senate District 10. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 10 since 2023-01-10.",
        "Capitol office: Room GE.5, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: Heritage Rock II 2340 W. Interstate 20, Suite 218, Arlington, TX 76017",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Business and Commerce — Vice Chair",
        "Criminal Justice",
        "Education",
        "Finance",
        "Higher Education",
        "Homeland and Border Security Select — Chair",
        "Local Government",
        "Religious Liberty Select — Chair",
        "Special Committee on Congressional Redistricting — Chair",
        "Transportation",
      ],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 10. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Phil King", "Senator Phil King", "Texas Senate District 10"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=10",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=10",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "mayes-middleton",
    name: "Mayes Middleton",
    chamber: "senate",
    district: 11,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=11",
    imageUrl: "https://senate.texas.gov/members/d11/img/Middleton_87-0662D-009.jpg",
    officialCode: null,
    home: "174 Calder Road Suite 900, League City, TX 77573",
    phone: "512-463-0111",
    capitolAddress: "Room E1.706, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "174 Calder Road Suite 900, League City, TX 77573",
    vacant: false,
    authority: {
      slug: "mayes-middleton",
      reviewedAt: "2026-07-31",
      biography:
        "Mayes Middleton is the current Senator for Texas Senate District 11. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 11 since 2023-01-10.",
        "Capitol office: Room E1.706, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 174 Calder Road Suite 900, League City, TX 77573",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "No current committee assignment is published for this member in the maintained Texas Senate roster.",
      ],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 11. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Mayes Middleton", "Senator Mayes Middleton", "Texas Senate District 11"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=11",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=11",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "tan-parker",
    name: "Tan Parker",
    chamber: "senate",
    district: 12,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=12",
    imageUrl: "https://senate.texas.gov/members/d12/img/86_20190619_SAM_0008.jpg",
    officialCode: null,
    home: "600 Parker Square Suite 250, Flower Mound, TX 75028",
    phone: "512-463-0112",
    capitolAddress: "Room E1.608, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "600 Parker Square Suite 250, Flower Mound, TX 75028",
    vacant: false,
    authority: {
      slug: "tan-parker",
      reviewedAt: "2026-07-31",
      biography:
        "Tan Parker is the current Senator for Texas Senate District 12. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 12 since 2023-01-10.",
        "Capitol office: Room E1.608, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 600 Parker Square Suite 250, Flower Mound, TX 75028",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Criminal Justice — Vice Chair",
        "Education",
        "Higher Education",
        "Homeland and Border Security Select",
        "Natural Resources",
        "Special Committee on Congressional Redistricting",
        "State Affairs",
        "Transportation — Chair",
        "Veteran Affairs Select",
      ],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 12. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Tan Parker", "Senator Tan Parker", "Texas Senate District 12"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=12",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=12",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "borris-miles",
    name: "Borris Miles",
    chamber: "senate",
    district: 13,
    party: "D",
    website: "https://senate.texas.gov/member.php?d=13",
    imageUrl: "https://senate.texas.gov/members/d13/img/Sen-Miles-2025-Headshot-web.jpg",
    officialCode: null,
    home: "11903 Bellaire Blvd. Suite 1213, Houston, TX 77072",
    phone: "512-463-0113",
    capitolAddress: "Room 3E.12, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "11903 Bellaire Blvd. Suite 1213, Houston, TX 77072",
    vacant: false,
    authority: {
      slug: "borris-miles",
      reviewedAt: "2026-07-31",
      biography:
        "Borris Miles is the current Senator for Texas Senate District 13. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 13 since 2017-01-10.",
        "Capitol office: Room 3E.12, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 11903 Bellaire Blvd. Suite 1213, Houston, TX 77072",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Criminal Justice",
        "Health and Human Services",
        "Nominations",
        "Special Committee on Congressional Redistricting",
        "Transportation",
      ],
      electionHistory: [
        {
          year: "2017",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 13. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Borris Miles", "Senator Borris Miles", "Texas Senate District 13"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=13",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=13",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "sarah-eckhardt",
    name: "Sarah Eckhardt",
    chamber: "senate",
    district: 14,
    party: "D",
    website: "https://senate.texas.gov/member.php?d=14",
    imageUrl: "https://senate.texas.gov/members/d14/img/SE_headshot_2020.jpg",
    officialCode: null,
    home: null,
    phone: "512-463-0114",
    capitolAddress: "Room E1.804, 1100 Congress Ave., Austin, TX 78701",
    districtAddress: null,
    vacant: false,
    authority: {
      slug: "sarah-eckhardt",
      reviewedAt: "2026-07-31",
      biography:
        "Sarah Eckhardt is the current Senator for Texas Senate District 14. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 14 since 2020-07-31.",
        "Capitol office: Room E1.804, 1100 Congress Ave., Austin, TX 78701",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Administration", "Nominations"],
      electionHistory: [
        {
          year: "2020",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 14. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Sarah Eckhardt", "Senator Sarah Eckhardt", "Texas Senate District 14"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=14",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=14",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "molly-cook",
    name: "Molly Cook",
    chamber: "senate",
    district: 15,
    party: "D",
    website: "https://senate.texas.gov/member.php?d=15",
    imageUrl: "https://senate.texas.gov/members/d15/img/Cook_88-0807D-014-2025.jpg",
    officialCode: null,
    home: "4808 Gibson St. Suite 210, Houston, TX 77007",
    phone: "512-463-0115",
    capitolAddress: "Room E1.810, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "4808 Gibson St. Suite 210, Houston, TX 77007",
    vacant: false,
    authority: {
      slug: "molly-cook",
      reviewedAt: "2026-07-31",
      biography:
        "Molly Cook is the current Senator for Texas Senate District 15. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 15 since 2024-05-16.",
        "Capitol office: Room E1.810, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 4808 Gibson St. Suite 210, Houston, TX 77007",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Administration", "Health and Human Services", "Local Government"],
      electionHistory: [
        {
          year: "2024",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 15. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Molly Cook", "Senator Molly Cook", "Texas Senate District 15"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=15",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=15",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "nathan-johnson",
    name: "Nathan Johnson",
    chamber: "senate",
    district: 16,
    party: "D",
    website: "https://senate.texas.gov/member.php?d=16",
    imageUrl: "https://senate.texas.gov/members/d16/img/SNJ-Headshot-2023-web.jpg",
    officialCode: null,
    home: "Merit Tower 12222 Merit Drive, Suite 1010, Dallas, TX 75251",
    phone: "512-463-0116",
    capitolAddress: "Room 4E.2, 1100 Congress Ave., Austin, TX 78701",
    districtAddress: "Merit Tower 12222 Merit Drive, Suite 1010, Dallas, TX 75251",
    vacant: false,
    authority: {
      slug: "nathan-johnson",
      reviewedAt: "2026-07-31",
      biography:
        "Nathan Johnson is the current Senator for Texas Senate District 16. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 16 since 2019-01-08.",
        "Capitol office: Room 4E.2, 1100 Congress Ave., Austin, TX 78701",
        "District office: Merit Tower 12222 Merit Drive, Suite 1010, Dallas, TX 75251",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Business and Commerce", "Transportation"],
      electionHistory: [
        {
          year: "2019",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 16. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Nathan Johnson", "Senator Nathan Johnson", "Texas Senate District 16"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=16",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=16",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "joan-huffman",
    name: "Joan Huffman",
    chamber: "senate",
    district: 17,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=17",
    imageUrl: "https://senate.texas.gov/members/d17/img/Huffman_9S5A0096-2021web.jpg",
    officialCode: null,
    home: "129 Circle Way Suite 101, Lake Jackson, TX 77566",
    phone: "512-463-0117",
    capitolAddress: "Room 1E.14, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "129 Circle Way Suite 101, Lake Jackson, TX 77566",
    vacant: false,
    authority: {
      slug: "joan-huffman",
      reviewedAt: "2026-07-31",
      biography:
        "Joan Huffman is the current Senator for Texas Senate District 17. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 17 since 2008-12-29.",
        "Capitol office: Room 1E.14, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 129 Circle Way Suite 101, Lake Jackson, TX 77566",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Criminal Justice", "Finance — Chair", "Legislative Budget Board"],
      electionHistory: [
        {
          year: "2008",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 17. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Joan Huffman", "Senator Joan Huffman", "Texas Senate District 17"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=17",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=17",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "lois-kolkhorst",
    name: "Lois Kolkhorst",
    chamber: "senate",
    district: 18,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=18",
    imageUrl: "https://senate.texas.gov/members/d18/img/LWK_2020.jpg",
    officialCode: null,
    home: "18230 Farm to Market Road 1488 Suite 314, Magnolia, TX 77354",
    phone: "512-463-0118",
    capitolAddress: "Room GE.4, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "18230 Farm to Market Road 1488 Suite 314, Magnolia, TX 77354",
    vacant: false,
    authority: {
      slug: "lois-kolkhorst",
      reviewedAt: "2026-07-31",
      biography:
        "Lois Kolkhorst is the current Senator for Texas Senate District 18. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 18 since 2014-12-22.",
        "Capitol office: Room GE.4, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 18230 Farm to Market Road 1488 Suite 314, Magnolia, TX 77354",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Administration",
        "Business and Commerce",
        "Civil Discourse and Freedom of Speech in Higher Education Select",
        "Disaster Preparedness and Flooding Select",
        "Finance",
        "General Investigating Committee on the July 2025 Flooding Events",
        "Health and Human Services — Chair",
        "Legislative Budget Board",
        "Water, Agriculture and Rural Affairs",
      ],
      electionHistory: [
        {
          year: "2014",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 18. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Lois Kolkhorst", "Senator Lois Kolkhorst", "Texas Senate District 18"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=18",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=18",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "roland-gutierrez",
    name: "Roland Gutierrez",
    chamber: "senate",
    district: 19,
    party: "D",
    website: "https://senate.texas.gov/member.php?d=19",
    imageUrl: "https://senate.texas.gov/members/d19/img/Gutierrez_87-0522D-016-Web.jpg",
    officialCode: null,
    home: "1313 SE Military Drive Suite 207, San Antonio, TX 78214",
    phone: "512-463-0119",
    capitolAddress: "Room 3S.3, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "1313 SE Military Drive Suite 207, San Antonio, TX 78214",
    vacant: false,
    authority: {
      slug: "roland-gutierrez",
      reviewedAt: "2026-07-31",
      biography:
        "Roland Gutierrez is the current Senator for Texas Senate District 19. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 19 since 2021-01-12.",
        "Capitol office: Room 3S.3, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 1313 SE Military Drive Suite 207, San Antonio, TX 78214",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: ["Local Government", "Water, Agriculture and Rural Affairs"],
      electionHistory: [
        {
          year: "2021",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 19. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Roland Gutierrez", "Senator Roland Gutierrez", "Texas Senate District 19"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=19",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=19",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "chuy-hinojosa",
    name: "Chuy Hinojosa",
    chamber: "senate",
    district: 20,
    party: "D",
    website: "https://senate.texas.gov/member.php?d=20",
    imageUrl: "https://senate.texas.gov/members/d20/img/Hinojosa_84-0784D-006.jpg",
    officialCode: null,
    home: "1508 S. Lone Star Way Suite 6A, Edinburg, TX 78539",
    phone: "512-463-0120",
    capitolAddress: "Room 3E.6, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "1508 S. Lone Star Way Suite 6A, Edinburg, TX 78539",
    vacant: false,
    authority: {
      slug: "chuy-hinojosa",
      reviewedAt: "2026-07-31",
      biography:
        "Chuy Hinojosa is the current Senator for Texas Senate District 20. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 20 since 2003-01-14.",
        "Capitol office: Room 3E.6, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 1508 S. Lone Star Way Suite 6A, Edinburg, TX 78539",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Civil Discourse and Freedom of Speech in Higher Education Select",
        "Criminal Justice",
        "Finance — Vice Chair",
        "Homeland and Border Security Select — Vice Chair",
        "Special Committee on Congressional Redistricting",
        "Transportation",
      ],
      electionHistory: [
        {
          year: "2003",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 20. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Chuy Hinojosa", "Senator Chuy Hinojosa", "Texas Senate District 20"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=20",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=20",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "judith-zaffirini",
    name: "Judith Zaffirini",
    chamber: "senate",
    district: 21,
    party: "D",
    website: "https://senate.texas.gov/member.php?d=21",
    imageUrl: "https://senate.texas.gov/members/d21/img/Zaffirini_2017.jpg",
    officialCode: null,
    home: "1407 Washington St., Laredo, TX 78040",
    phone: "512-463-0121",
    capitolAddress: "Room 1E.13, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "1407 Washington St., Laredo, TX 78040",
    vacant: false,
    authority: {
      slug: "judith-zaffirini",
      reviewedAt: "2026-07-31",
      biography:
        "Judith Zaffirini is the current Senator for Texas Senate District 21. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 21 since 1987-01-13.",
        "Capitol office: Room 1E.13, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 1407 Washington St., Laredo, TX 78040",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Business and Commerce",
        "Finance",
        "Natural Resources — Vice Chair",
        "State Affairs",
      ],
      electionHistory: [
        {
          year: "1987",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 21. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Judith Zaffirini", "Senator Judith Zaffirini", "Texas Senate District 21"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=21",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=21",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "texas-senate-district-22-vacant",
    name: null,
    chamber: "senate",
    district: 22,
    party: null,
    website: "https://senate.texas.gov/member.php?d=22",
    imageUrl: null,
    officialCode: null,
    home: null,
    phone: null,
    capitolAddress: null,
    districtAddress: null,
    vacant: true,
    authority: null,
  },
  {
    slug: "royce-west",
    name: "Royce West",
    chamber: "senate",
    district: 23,
    party: "D",
    website: "https://senate.texas.gov/member.php?d=23",
    imageUrl: "https://senate.texas.gov/members/d23/img/West_87-0474D-015-web.jpg",
    officialCode: null,
    home: "5787 S. Hampton Road Suite 385, Dallas, TX 75232",
    phone: "512-463-0123",
    capitolAddress: "Room 1E.5, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "5787 S. Hampton Road Suite 385, Dallas, TX 75232",
    vacant: false,
    authority: {
      slug: "royce-west",
      reviewedAt: "2026-07-31",
      biography:
        "Royce West is the current Senator for Texas Senate District 23. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 23 since 1993-01-12.",
        "Capitol office: Room 1E.5, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 5787 S. Hampton Road Suite 385, Dallas, TX 75232",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Economic Development",
        "Education",
        "Finance",
        "Higher Education",
        "Local Government",
        "Transportation — Vice Chair",
      ],
      electionHistory: [
        {
          year: "1993",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 23. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Royce West", "Senator Royce West", "Texas Senate District 23"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=23",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=23",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "pete-flores",
    name: "Pete Flores",
    chamber: "senate",
    district: 24,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=24",
    imageUrl: "https://senate.texas.gov/members/d24/img/Flores_86-0634D-001-web.jpg",
    officialCode: null,
    home: "2180 N. Main St. H1 & H2, Belton, TX 76513",
    phone: "512-463-0124",
    capitolAddress: "Room E1.808, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "2180 N. Main St. H1 & H2, Belton, TX 76513",
    vacant: false,
    authority: {
      slug: "pete-flores",
      reviewedAt: "2026-07-31",
      biography:
        "Pete Flores is the current Senator for Texas Senate District 24. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 24 since 2023-01-10.",
        "Capitol office: Room E1.808, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 2180 N. Main St. H1 & H2, Belton, TX 76513",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Criminal Justice — Chair",
        "Disaster Preparedness and Flooding Select — Vice Chair",
        "Finance",
        "General Investigating Committee on the July 2025 Flooding Events — Chair",
        "Natural Resources",
        "Veteran Affairs Select",
      ],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 24. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Pete Flores", "Senator Pete Flores", "Texas Senate District 24"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=24",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=24",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "donna-campbell",
    name: "Donna Campbell",
    chamber: "senate",
    district: 25,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=25",
    imageUrl: "https://senate.texas.gov/members/d25/img/headshot.jpg",
    officialCode: null,
    home: "229 Hunters Village Suite 105, New Braunfels, TX 78132",
    phone: "512-463-0125",
    capitolAddress: "Room 3E.18, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "229 Hunters Village Suite 105, New Braunfels, TX 78132",
    vacant: false,
    authority: {
      slug: "donna-campbell",
      reviewedAt: "2026-07-31",
      biography:
        "Donna Campbell is the current Senator for Texas Senate District 25. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 25 since 2013-01-08.",
        "Capitol office: Room 3E.18, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 229 Hunters Village Suite 105, New Braunfels, TX 78132",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Business and Commerce",
        "Civil Discourse and Freedom of Speech in Higher Education Select",
        "Disaster Preparedness and Flooding Select",
        "Education — Chair",
        "Finance",
      ],
      electionHistory: [
        {
          year: "2013",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 25. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Donna Campbell", "Senator Donna Campbell", "Texas Senate District 25"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=25",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=25",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "jose-menendez",
    name: "José Menéndez",
    chamber: "senate",
    district: 26,
    party: "D",
    website: "https://senate.texas.gov/member.php?d=26",
    imageUrl: "https://senate.texas.gov/members/d26/img/headshot.jpg",
    officialCode: null,
    home: "4522 Fredericksburg Road, A-22, San Antonio, TX 78201",
    phone: "512-463-0126",
    capitolAddress: "Room E1.610, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "4522 Fredericksburg Road, A-22, San Antonio, TX 78201",
    vacant: false,
    authority: {
      slug: "jose-menendez",
      reviewedAt: "2026-07-31",
      biography:
        "José Menéndez is the current Senator for Texas Senate District 26. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 26 since 2015-03-04.",
        "Capitol office: Room E1.610, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 4522 Fredericksburg Road, A-22, San Antonio, TX 78201",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Administration",
        "Business and Commerce",
        "Disaster Preparedness and Flooding Select",
        "Education",
        "General Investigating Committee on the July 2025 Flooding Events",
        "Veteran Affairs Select",
        "Water, Agriculture and Rural Affairs",
      ],
      electionHistory: [
        {
          year: "2015",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 26. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["José Menéndez", "Senator José Menéndez", "Texas Senate District 26"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=26",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=26",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "adam-hinojosa",
    name: "Adam Hinojosa",
    chamber: "senate",
    district: 27,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=27",
    imageUrl: "https://senate.texas.gov/members/d27/img/Hinojosa_Adam-88-0913D-005-web.jpg",
    officialCode: null,
    home: "255 S. Kansas Ave., Weslaco, TX 78596",
    phone: "512-463-0127",
    capitolAddress: "Room E1.712, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "255 S. Kansas Ave., Weslaco, TX 78596",
    vacant: false,
    authority: {
      slug: "adam-hinojosa",
      reviewedAt: "2026-07-31",
      biography:
        "Adam Hinojosa is the current Senator for Texas Senate District 27. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 27 since 2025-01-14.",
        "Capitol office: Room E1.712, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 255 S. Kansas Ave., Weslaco, TX 78596",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Administration",
        "Business and Commerce",
        "Disaster Preparedness and Flooding Select",
        "Nominations — Chair",
        "Religious Liberty Select",
        "State Affairs",
        "Water, Agriculture and Rural Affairs",
      ],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 27. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Adam Hinojosa", "Senator Adam Hinojosa", "Texas Senate District 27"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=27",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=27",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "charles-perry",
    name: "Charles Perry",
    chamber: "senate",
    district: 28,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=28",
    imageUrl: "https://senate.texas.gov/members/d28/img/Perry-Headshot-2019.jpg",
    officialCode: null,
    home: "11003 Quaker Ave., #101, Lubbock, TX 79424",
    phone: "512-463-0128",
    capitolAddress: "Room E1.806, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "11003 Quaker Ave., #101, Lubbock, TX 79424",
    vacant: false,
    authority: {
      slug: "charles-perry",
      reviewedAt: "2026-07-31",
      biography:
        "Charles Perry is the current Senator for Texas Senate District 28. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 28 since 2014-09-30.",
        "Capitol office: Room E1.806, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 11003 Quaker Ave., #101, Lubbock, TX 79424",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Disaster Preparedness and Flooding Select — Chair",
        "Finance",
        "General Investigating Committee on the July 2025 Flooding Events — Vice Chair",
        "Health and Human Services — Vice Chair",
        "Religious Liberty Select",
        "State Affairs",
        "Transportation",
        "Water, Agriculture and Rural Affairs — Chair",
      ],
      electionHistory: [
        {
          year: "2014",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 28. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Charles Perry", "Senator Charles Perry", "Texas Senate District 28"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=28",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=28",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "cesar-blanco",
    name: "César Blanco",
    chamber: "senate",
    district: 29,
    party: "D",
    website: "https://senate.texas.gov/member.php?d=29",
    imageUrl: "https://senate.texas.gov/members/d29/img/SCBBio88th-web.jpg",
    officialCode: null,
    home: "416 N. Stanton St. Suite 700, El Paso, TX 79901",
    phone: "512-463-0129",
    capitolAddress: "Room 3E.2, 1100 Congress Ave., Austin, TX 78701",
    districtAddress: "416 N. Stanton St. Suite 700, El Paso, TX 79901",
    vacant: false,
    authority: {
      slug: "cesar-blanco",
      reviewedAt: "2026-07-31",
      biography:
        "César Blanco is the current Senator for Texas Senate District 29. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 29 since 2021-01-12.",
        "Capitol office: Room 3E.2, 1100 Congress Ave., Austin, TX 78701",
        "District office: 416 N. Stanton St. Suite 700, El Paso, TX 79901",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Business and Commerce",
        "Civil Discourse and Freedom of Speech in Higher Education Select",
        "Disaster Preparedness and Flooding Select",
        "Health and Human Services",
        "Natural Resources",
        "Religious Liberty Select",
        "Sunset Advisory Commission",
        "Water, Agriculture and Rural Affairs",
      ],
      electionHistory: [
        {
          year: "2021",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 29. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["César Blanco", "Senator César Blanco", "Texas Senate District 29"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=29",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=29",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "brent-hagenbuch",
    name: "Brent Hagenbuch",
    chamber: "senate",
    district: 30,
    party: "R",
    website: "https://www.senate.texas.gov/member.php?d=30",
    imageUrl: "https://www.senate.texas.gov/members/d30/img/Hagenbuch_89-0029-009-web.jpg",
    officialCode: null,
    home: "100 Austin Ave. Suite 103, Weatherford, TX 76086",
    phone: "512-463-0130",
    capitolAddress: "Room GE.7, P.O. Box 12068 Capitol Station, Austin, TX 78711",
    districtAddress: "100 Austin Ave. Suite 103, Weatherford, TX 76086",
    vacant: false,
    authority: {
      slug: "brent-hagenbuch",
      reviewedAt: "2026-07-31",
      biography:
        "Brent Hagenbuch is the current Senator for Texas Senate District 30. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 30 since 2025-01-14.",
        "Capitol office: Room GE.7, P.O. Box 12068 Capitol Station, Austin, TX 78711",
        "District office: 100 Austin Ave. Suite 103, Weatherford, TX 76086",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Administration — Vice Chair",
        "Business and Commerce",
        "Criminal Justice",
        "Education",
        "Higher Education — Vice Chair",
        "Religious Liberty Select",
        "Transportation",
        "Veteran Affairs Select — Chair",
      ],
      electionHistory: [
        {
          year: "2025",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 30. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Brent Hagenbuch", "Senator Brent Hagenbuch", "Texas Senate District 30"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://www.senate.texas.gov/member.php?d=30",
        },
        {
          label: "Official member biography",
          url: "https://www.senate.texas.gov/member.php?d=30",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
  {
    slug: "kevin-sparks",
    name: "Kevin Sparks",
    chamber: "senate",
    district: 31,
    party: "R",
    website: "https://senate.texas.gov/member.php?d=31",
    imageUrl: "https://senate.texas.gov/members/d31/img/Sparks_88-0063D-012-web.jpg",
    officialCode: null,
    home: "ClayDesta Center 6 Desta Drive, Suite 1325, Midland, TX 79705",
    phone: "512-463-0131",
    capitolAddress: "Room E1.708, 1100 Congress Ave., Austin, TX 78701",
    districtAddress: "ClayDesta Center 6 Desta Drive, Suite 1325, Midland, TX 79705",
    vacant: false,
    authority: {
      slug: "kevin-sparks",
      reviewedAt: "2026-07-31",
      biography:
        "Kevin Sparks is the current Senator for Texas Senate District 31. This authority profile consolidates the official member page, current committee assignments, legislative service, contact information, campaign-finance lookup, and district sources.",
      career: [
        "Serving as Senator for Texas Senate District 31 since 2023-01-10.",
        "Capitol office: Room E1.708, 1100 Congress Ave., Austin, TX 78701",
        "District office: ClayDesta Center 6 Desta Drive, Suite 1325, Midland, TX 79705",
      ],
      education: [
        "Consult the linked official biography for published education and professional credentials; no independent credential claim is added here.",
      ],
      committees: [
        "Business and Commerce",
        "Economic Development — Vice Chair",
        "Health and Human Services",
        "Homeland and Border Security Select",
        "Natural Resources — Chair",
        "Nominations",
        "Special Committee on Congressional Redistricting",
        "Sunset Advisory Commission",
        "Water, Agriculture and Rural Affairs — Vice Chair",
      ],
      electionHistory: [
        {
          year: "2023",
          result: "Current recorded Texas Senate service began.",
        },
        {
          year: "2025–2027",
          result: "Serving during the 89th Texas Legislature.",
        },
      ],
      districtOverview:
        "Texas Senate District 31. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.",
      financeUrl: "https://www.ethics.state.tx.us/search/cf/",
      financeLabel: "Texas Ethics Commission campaign-finance search",
      newsKeywords: ["Kevin Sparks", "Senator Kevin Sparks", "Texas Senate District 31"],
      sources: [
        {
          label: "Official Texas Senate member page",
          url: "https://senate.texas.gov/member.php?d=31",
        },
        {
          label: "Official member biography",
          url: "https://senate.texas.gov/member.php?d=31",
        },
        {
          label: "Texas Legislature Online member directory",
          url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S",
        },
        {
          label: "Open States maintained Texas legislator record",
          url: "https://github.com/openstates/people/tree/main/data/tx/legislature",
        },
      ],
    },
  },
];

export const TEXAS_HOUSE_SEATS = TEXAS_LEGISLATIVE_SEATS.filter((seat) => seat.chamber === "house");
export const TEXAS_SENATE_SEATS = TEXAS_LEGISLATIVE_SEATS.filter(
  (seat) => seat.chamber === "senate",
);
export const TEXAS_LEGISLATORS = TEXAS_LEGISLATIVE_SEATS.filter(
  (
    seat,
  ): seat is TexasLegislativeSeat & {
    name: string;
    party: "R" | "D";
    authority: RepresentativeAuthority;
  } => !seat.vacant && Boolean(seat.name && seat.party && seat.authority),
);
export const TEXAS_LEGISLATOR_AUTHORITY = TEXAS_LEGISLATORS.map((seat) => seat.authority);

export function getTexasLegislativeSeatBySlug(slug: string) {
  return TEXAS_LEGISLATIVE_SEATS.find((seat) => seat.slug === slug);
}
