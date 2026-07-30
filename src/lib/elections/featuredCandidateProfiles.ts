export type FeaturedCandidateProfile = {
  imageUrl: string;
  imageAltText: string;
  imageCredit: string;
  imageLicense: string;
  imageSourceUrl: string;
  biography: string;
  education: readonly string[];
  career: readonly string[];
  committees?: readonly string[];
  keyRecord: readonly string[];
  sources: readonly { label: string; url: string }[];
};

const PROFILES: Record<string, FeaturedCandidateProfile> = {
  "ken paxton": {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Ken%20Paxton%20-%2055022286853.jpg?width=900",
    imageAltText: "Ken Paxton speaking at AmericaFest 2025",
    imageCredit: "Gage Skidmore / Wikimedia Commons",
    imageLicense: "CC BY-SA 4.0",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Ken_Paxton_-_55022286853.jpg",
    biography: "Ken Paxton is the 51st Attorney General of Texas and the Republican nominee for the 2026 United States Senate election in Texas. He was first elected attorney general in 2014 and reelected in 2018 and 2022. Before becoming attorney general, he served in the Texas House of Representatives and the Texas Senate and worked in private legal practice.",
    education: [
      "B.A. in psychology, Baylor University",
      "M.B.A., Baylor University",
      "J.D., University of Virginia School of Law",
    ],
    career: [
      "Texas Attorney General, 2015-present",
      "Texas Senate, District 8, 2013-2015",
      "Texas House of Representatives, District 70, 2003-2013",
      "Attorney in private practice and former in-house counsel",
    ],
    keyRecord: [
      "Leads the Office of the Texas Attorney General, which represents Texas in litigation, enforces state consumer-protection laws, administers child-support functions, and issues legal opinions.",
      "Created and promoted state initiatives addressing human trafficking and synthetic drugs.",
      "Has made litigation against federal policies and challenges involving immigration, regulation, religious liberty, technology companies, and state sovereignty central to his public record.",
    ],
    sources: [
      { label: "Texas Attorney General biography", url: "https://www.texasattorneygeneral.gov/about-office" },
      { label: "Official campaign biography", url: "https://www.kenpaxton.com/about" },
      { label: "Photo and license", url: "https://commons.wikimedia.org/wiki/File:Ken_Paxton_-_55022286853.jpg" },
    ],
  },
  "james talarico": {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/James%20Talarico%20Press%20Conference%20%28centered%29.jpg?width=900",
    imageAltText: "Texas State Representative James Talarico at a press conference",
    imageCredit: "Wikimedia Commons contributor",
    imageLicense: "See Wikimedia Commons file page",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:James_Talarico_Press_Conference_(centered).jpg",
    biography: "James Talarico is a Democratic Texas state representative, former public-school teacher, and the Democratic nominee for the 2026 United States Senate election in Texas. First elected to the Texas House in 2018, he has represented House Districts 52 and 50. His legislative work has focused heavily on public education, health-care costs, youth services, and prescription-drug affordability.",
    education: [
      "The University of Texas at Austin",
      "Harvard University",
    ],
    career: [
      "Texas House of Representatives, District 50, 2023-present",
      "Texas House of Representatives, District 52, 2018-2023",
      "Former middle-school teacher in San Antonio",
    ],
    committees: [
      "House Committee on Public Education",
      "House Committee on Juvenile Justice and Family Issues",
      "House Committee on Calendars",
    ],
    keyRecord: [
      "Worked on Texas school-finance legislation and measures addressing student mental health, prekindergarten class sizes, and child-care affordability.",
      "Authored or supported legislation addressing insulin copays, prescription-drug costs, teen fentanyl overdoses, juvenile-justice accountability, and educational opportunities for incarcerated minors.",
      "Represents House District 50, which includes part of Travis County.",
    ],
    sources: [
      { label: "Texas House biography", url: "https://house.texas.gov/members/3685/biography" },
      { label: "Texas Legislative Reference Library service record", url: "https://lrl.texas.gov/legeleaders/members/memberdisplay.cfm?memberID=5831" },
      { label: "Texas House member page", url: "https://house.texas.gov/members/50" },
      { label: "Photo source", url: "https://commons.wikimedia.org/wiki/File:James_Talarico_Press_Conference_(centered).jpg" },
    ],
  },
};

export function getFeaturedCandidateProfile(name: string | null | undefined) {
  if (!name) return null;
  return PROFILES[name.trim().toLowerCase()] ?? null;
}
