export type SupremeCourtRosterEntry = {
  name: string;
  service: string;
  selection?: string;
  note?: string;
};

export type SupremeCourtSeat = {
  seat: string;
  entries: SupremeCourtRosterEntry[];
};

export const SUPREME_COURT_REVIEWED = "2026-09-08";

export const CURRENT_JUSTICES: SupremeCourtRosterEntry[] = [
  { name: "James D. “Jimmy” Blacklock", service: "Chief Justice · January 2025–present", selection: "Appointed chief justice by Gov. Greg Abbott in 2025; previously appointed to Place 2 in 2018 and elected in 2018 and 2024.", note: "28th Chief Justice of the Supreme Court of Texas." },
  { name: "James P. Sullivan", service: "Place 2 · January 2025–present", selection: "Appointed by Gov. Greg Abbott to the vacancy created when Blacklock became chief justice.", note: "Previously served as general counsel to Gov. Abbott and as an assistant solicitor general of Texas." },
  { name: "Debra H. Lehrmann", service: "Place 3 · June 2010–present", selection: "Appointed by Gov. Rick Perry in 2010; subsequently elected statewide and most recently re-elected in 2022.", note: "Senior Justice and the longest-serving woman justice in the Court’s history." },
  { name: "John Phillip Devine", service: "Place 4 · January 2013–present", selection: "First elected statewide in 2012; re-elected in 2018 and 2024.", note: "Previously served as judge of the 190th District Court in Harris County." },
  { name: "Rebeca Aizpuru Huddle", service: "Place 5 · October 2020–present", selection: "Appointed by Gov. Greg Abbott in 2020; elected to a full term in 2022.", note: "Previously served on Houston’s First Court of Appeals." },
  { name: "Jane N. Bland", service: "Place 6 · September 2019–present", selection: "Appointed by Gov. Greg Abbott in 2019; elected in 2020 and re-elected in 2024.", note: "Previously served on the First Court of Appeals and as a state district judge." },
  { name: "Kyle D. Hawkins", service: "Place 7 · October 2025–present", selection: "Appointed by Gov. Greg Abbott in October 2025 to serve through the end of 2026 unless succeeded through the electoral process.", note: "Former Texas solicitor general and former counselor to the U.S. solicitor general." },
  { name: "J. Brett Busby", service: "Place 8 · March 2019–present", selection: "Appointed by Gov. Greg Abbott in 2019 and elected to a full term in 2020.", note: "Previously served on Houston’s Fourteenth Court of Appeals." },
  { name: "Evan A. Young", service: "Place 9 · November 2021–present", selection: "Appointed by Gov. Greg Abbott in 2021 and elected statewide in 2022.", note: "Previously clerked for U.S. Supreme Court Justice Antonin Scalia." },
];

export const COURT_TIMELINE = [
  { year: "1836", title: "Republic of Texas creates a Supreme Court", text: "The Republic constitution provides for a chief justice and associate justices. District judges later serve ex officio as associates." },
  { year: "1840", title: "The Republic court begins regular sessions", text: "The district judges begin sitting with the chief justice as associate justices." },
  { year: "1845–1846", title: "Statehood creates a new constitutional court", text: "Texas enters the United States and organizes a state Supreme Court under the Constitution of 1845." },
  { year: "1867", title: "Military Reconstruction removes the sitting court", text: "Federal military authorities remove the postwar justices and install replacements during Reconstruction." },
  { year: "1870–1874", title: "The Reconstruction-era ‘Semicolon Court’", text: "A three-member appointed court becomes politically notorious after Ex parte Rodriguez and the disputed 1873 election." },
  { year: "1876", title: "The present constitutional foundation takes effect", text: "The Constitution of 1876 restores an elected Supreme Court and divides the state’s judicial structure." },
  { year: "1891", title: "Judicial reorganization reshapes appellate jurisdiction", text: "A constitutional amendment ends the traveling-court system, fixes the Supreme Court in Austin, and helps create the modern separation of civil and criminal appellate courts." },
  { year: "1918–1945", title: "Commission of Appeals helps handle the docket", text: "Commission judges assist a three-member Supreme Court during a period of increasing caseload." },
  { year: "1925", title: "Special all-woman Supreme Court sits", text: "Hortense Ward, Ruth V. Brazzil, and Hattie L. Henenberg hear Johnson v. Darr after the regular male justices are disqualified." },
  { year: "1945", title: "Court expands from three to nine", text: "A constitutional amendment creates the modern nine-member court; six Commission of Appeals judges become associate justices." },
  { year: "1982", title: "Ruby Kless Sondock joins the Court", text: "Sondock becomes the first woman to serve on the regular Supreme Court of Texas, following the 1925 special court." },
  { year: "1988–1990s", title: "Republican realignment accelerates", text: "Thomas Phillips and Nathan Hecht become central figures as Republicans turn statewide judicial victories into durable control of the Court." },
  { year: "1989", title: "Edgewood ISD v. Kirby", text: "The Court holds the public-school finance system unconstitutional under the Texas Constitution’s efficiency requirement, triggering years of legislative and judicial restructuring." },
  { year: "2001–2004", title: "Wallace Jefferson breaks historic barriers", text: "Jefferson becomes the Court’s first Black justice and later its first Black chief justice." },
  { year: "2009", title: "Eva Guzman joins the Court", text: "Guzman becomes the first Hispanic woman to serve on the Supreme Court of Texas." },
  { year: "2013–2024", title: "Nathan Hecht serves as chief justice", text: "Hecht concludes the longest tenure by any member of the Court and leads major judicial-administration and access-to-justice efforts." },
  { year: "2025", title: "James Blacklock becomes chief justice", text: "Blacklock succeeds Hecht; James Sullivan joins Place 2, and Kyle Hawkins later succeeds Jeff Boyd in Place 7." },
] as const;

export const LANDMARK_CASES = [
  { year: "1873", name: "Ex parte Rodriguez", significance: "The Reconstruction-era Court invalidated the 1873 general election based on its reading of constitutional election language. The ruling was not enforced and became the source of the derisive ‘Semicolon Court’ label." },
  { year: "1925", name: "Johnson v. Darr", significance: "A specially appointed all-woman court heard the land-title dispute after the regular justices were disqualified because of membership in the Woodmen of the World." },
  { year: "1989", name: "Edgewood Independent School District v. Kirby", significance: "A unanimous Court held that Texas’s school-finance system failed the state constitution’s requirement for an efficient public-school system, beginning a long sequence of school-finance litigation and legislative responses." },
  { year: "2015", name: "Patel v. Texas Department of Licensing and Regulation", significance: "The Court held that the state’s licensing requirements for eyebrow threaders were unconstitutionally oppressive as applied, producing a major modern discussion of the Texas Constitution’s due-course-of-law protection." },
] as const;

export const HISTORIC_FIRSTS = [
  { title: "1925 special all-woman court", detail: "Chief Justice Hortense Ward and Justices Ruth V. Brazzil and Hattie L. Henenberg formed a special Supreme Court to hear one case when the regular justices were disqualified." },
  { title: "Ruby Kless Sondock", detail: "Appointed in 1982 to Place 6, she became the first woman to serve on the regular Supreme Court of Texas after the 1925 special court." },
  { title: "Raul A. Gonzalez", detail: "Appointed to Place 4 in 1984, Gonzalez became the first Hispanic justice to serve on the Supreme Court of Texas and later the first Hispanic elected to statewide office in Texas." },
  { title: "Rose Spector", detail: "Elected in 1992 and serving from 1993 through 1998, Spector became the first woman elected to the Supreme Court of Texas." },
  { title: "Wallace B. Jefferson", detail: "Appointed in 2001 and named chief justice in 2004, Jefferson became the Court’s first Black justice and first Black chief justice." },
  { title: "Eva M. Guzman", detail: "Appointed in 2009, Guzman became the first Hispanic woman to serve on the Court." },
  { title: "Nathan L. Hecht", detail: "Hecht served from 1989 through 2024 and became the longest-serving member in the Court’s history." },
  { title: "Debra H. Lehrmann", detail: "Lehrmann is the longest-serving woman justice in the Court’s history and serves as the current Senior Justice." },
] as const;

export const REPUBLIC_CHIEF_JUSTICES: SupremeCourtRosterEntry[] = [
  { name: "James Collinsworth", service: "Chief Justice · December 1836–July 1838", selection: "Chief justices of the Republic were appointed under the Republic constitutional system." },
  { name: "John Birdsall", service: "Chief Justice · November–December 1838", selection: "Republic appointment." },
  { name: "Thomas J. Rusk", service: "Chief Justice · December 1838–December 1840", selection: "Republic appointment." },
  { name: "John Hemphill", service: "Chief Justice · December 1840–December 1845", selection: "Republic appointment; continued as the first chief justice of the state-era Court in 1846." },
];

export const REPUBLIC_ASSOCIATE_JUSTICES = [
  "R. E. B. Baylor", "E. T. Branch", "George W. Terrell", "John M. Hansford", "Anderson Hutchinson", "Patrick C. Jack", "John B. Jones", "William E. Jones", "William J. Jones", "John T. Mills", "Richard Morris", "M. P. Norton", "William B. Ochiltree", "J. W. Robinson", "Richardson A. Scurry", "Anthony B. Shelby",
] as const;

export const STATEHOOD_TO_1876_GROUPS = [
  {
    title: "Constitutions of 1845 and 1861",
    note: "The Court operated through statehood, secession, and the Civil War. For part of this era it traveled among Austin, Galveston, and Tyler.",
    entries: [
      { name: "John Hemphill", service: "Chief Justice · March 1846–October 1858" },
      { name: "Royall T. Wheeler", service: "Associate · March 1846–October 1858; Chief Justice · October 1858–April 1864" },
      { name: "Oran M. Roberts", service: "Associate · April 1857–October 1862; Chief Justice · November 1864–June 1866" },
      { name: "Abner S. Lipscomb", service: "Associate Justice · March 1846–November 1856" },
      { name: "James H. Bell", service: "Associate Justice · October 1858–August 1864" },
      { name: "George F. Moore", service: "Associate Justice · October 1862–June 1866" },
      { name: "Reuben A. Reeves", service: "Associate Justice · November 1864–June 1866" },
    ],
  },
  {
    title: "Constitution of 1866 and Military Reconstruction",
    note: "The postwar bench was removed by U.S. military authorities in 1867 and replaced as Reconstruction government was reorganized.",
    entries: [
      { name: "George F. Moore", service: "Chief Justice · August 1866–September 1867", note: "Removed by U.S. military authorities." },
      { name: "Richard Coke", service: "Justice · August 1866–September 1867", note: "Removed by U.S. military authorities." },
      { name: "S. P. Donley", service: "Justice · October 1866–September 1867", note: "Removed by U.S. military authorities." },
      { name: "Asa H. Willie", service: "Justice · August 1866–September 1867", note: "Removed by U.S. military authorities." },
      { name: "George W. Smith", service: "Justice · August 1866–September 1867", note: "Removed by U.S. military authorities." },
      { name: "Amos Morrill", service: "Chief Justice · September 1867–July 1870", selection: "Appointed during Military Reconstruction." },
      { name: "Livingston Lindsay", service: "Justice · September 1867–July 1870", selection: "Appointed during Military Reconstruction." },
      { name: "Albert H. Latimer", service: "Justice · September 1867–November 1869", selection: "Appointed during Military Reconstruction." },
      { name: "James Denison", service: "Justice · January–July 1870", selection: "Appointed during Military Reconstruction." },
      { name: "Colbert Coldwell", service: "Justice · September 1867–October 1869", selection: "Appointed during Military Reconstruction." },
      { name: "C. B. Sabin", service: "Appointed March 1870", note: "Official Court history notes no record of service." },
      { name: "Andrew J. Hamilton", service: "Justice · November 1867–October 1869", selection: "Appointed during Military Reconstruction." },
      { name: "Moses B. Walker", service: "Justice · December 1869–July 1870", selection: "Appointed during Military Reconstruction." },
    ],
  },
  {
    title: "Constitution of 1869 — three-member court, 1870–1874",
    note: "The appointed court associated with the Reconstruction government later became known as the ‘Semicolon Court.’",
    entries: [
      { name: "Lemuel D. Evans", service: "Chief Justice · July 1870–August 1873", selection: "Appointed under the Constitution of 1869." },
      { name: "Wesley Ogden", service: "Justice · July 1870–August 1873; Chief Justice · August 1873–January 1874", selection: "Appointed under the Constitution of 1869." },
      { name: "Moses B. Walker", service: "Justice · July 1870–January 1874", selection: "Appointed under the Constitution of 1869." },
      { name: "J. D. McAdoo", service: "Justice · August 1873–January 1874", selection: "Appointed under the Constitution of 1869." },
    ],
  },
  {
    title: "Five-member court, 1874–1876",
    note: "A constitutional change expanded the Court before the Constitution of 1876 created the next enduring framework.",
    entries: [
      { name: "Oran M. Roberts", service: "Chief Justice · January 1874–April 1876" },
      { name: "Reuben A. Reeves", service: "Justice · January 1874–April 1876" },
      { name: "Thomas J. Devine", service: "Justice · January 1874–September 1875" },
      { name: "John Ireland", service: "Justice · September 1875–April 1876" },
      { name: "George F. Moore", service: "Justice · February 1874–April 1876" },
      { name: "William P. Ballinger", service: "Appointed February 3, 1874; resigned the same day" },
      { name: "Peter W. Gray", service: "Justice · February 1874–April 1876" },
      { name: "Robert S. Gould", service: "Justice · May 1874–April 1876" },
    ],
  },
] as const;

export const JUSTICES_1876_1945 = {
  chief: [
    ["Oran M. Roberts", "April 1876–October 1878"], ["George F. Moore", "November 1878–November 1881"], ["Robert S. Gould", "November 1881–December 1882"], ["Asa H. Willie", "December 1882–March 1888"], ["John W. Stayton", "March 1888–July 1894"], ["Reuben R. Gaines", "July 1894–January 1911"], ["Thomas J. Brown", "January 1911–May 1915"], ["Nelson Phillips", "June 1915–November 1921"], ["Calvin M. Cureton", "December 1921–April 1940"], ["W. F. Moore", "April 1940–January 1941"], ["James P. Alexander", "January 1941–September 1945"],
  ],
  associate: [
    ["Robert S. Gould", "April 1876–November 1881"], ["John W. Stayton", "November 1881–March 1888"], ["A. S. Walker", "April 1888–January 1889"], ["J. L. Henry", "January 1889–May 1893"], ["T. J. Brown", "May 1893–January 1911"], ["W. F. Ramsey", "January 1911–April 1912"], ["Nelson Phillips", "April 1912–June 1915"], ["J. E. Yantis", "June 1915–March 1918"], ["Thomas B. Greenwood", "April 1918–December 1934"], ["John H. Sharp", "December 1934–September 1945"], ["George F. Moore", "April 1876–October 1878"], ["Micajah H. Bonner", "November 1878–December 1882"], ["Charles S. West", "December 1882–September 1885"], ["Sawnie Robertson", "October 1885–September 1886"], ["Reuben R. Gaines", "September 1886–July 1894"], ["Leroy G. Denman", "July 1894–May 1899"], ["F. A. Williams", "May 1899–April 1911"], ["J. B. Dibrell", "April 1911–January 1913"], ["William E. Hawkins", "January 1913–January 1921"], ["William Pierson", "January 1921–April 1935"], ["Richard Critz", "May 1935–January 1945"], ["Gordon Simpson", "January–September 1945"],
  ],
} as const;

export const MODERN_SEATS: SupremeCourtSeat[] = [
  {
    seat: "Chief Justice (Place 1)",
    entries: [
      { name: "James P. Alexander", service: "September 1945–January 1948", selection: "Continued as chief justice when the Court expanded; elected in 1946." },
      { name: "John E. Hickman", service: "January 1948–January 1961", selection: "Appointed to replace Alexander; elected in 1948 and 1954." },
      { name: "Robert W. Calvert", service: "January 1961–October 1972", selection: "Elected chief justice in 1960 and 1966." },
      { name: "Joseph R. Greenhill", service: "October 1972–October 1982", selection: "Appointed by Gov. Preston Smith; elected in 1972 and 1978." },
      { name: "Andrew Jackson “Jack” Pope", service: "November 1982–January 1985", selection: "Appointed chief justice by Gov. Bill Clements after long service as an associate justice." },
      { name: "John L. Hill", service: "January 1985–January 1988", selection: "Elected chief justice in 1984." },
      { name: "Thomas R. Phillips", service: "January 1988–September 2004", selection: "Appointed by Gov. Bill Clements in 1987; elected in 1988 and repeatedly re-elected." },
      { name: "Wallace B. Jefferson", service: "September 2004–October 2013", selection: "Appointed chief justice by Gov. Rick Perry; elected in 2006 and 2008." },
      { name: "Nathan L. Hecht", service: "October 2013–December 2024", selection: "Appointed chief justice by Gov. Rick Perry; elected in 2014 and 2020." },
      { name: "James D. Blacklock", service: "January 2025–present", selection: "Appointed chief justice by Gov. Greg Abbott." },
    ],
  },
  {
    seat: "Place 2",
    entries: [
      { name: "John H. Sharp", service: "September 1945–December 1952", selection: "Entered the nine-member Court through the 1945 constitutional transition; re-elected in 1946." },
      { name: "Frank P. Culver Jr.", service: "January 1953–January 1965", selection: "Elected in 1952 and re-elected in 1958." },
      { name: "Jack Pope", service: "January 1965–November 1982", selection: "Elected in 1964, 1970, and 1976; later appointed chief justice." },
      { name: "Ted Robertson", service: "December 1982–December 1988", selection: "Appointed by Gov. Bill Clements." },
      { name: "Lloyd Doggett", service: "January 1989–December 1994", selection: "Elected in 1988." },
      { name: "Priscilla R. Owen", service: "January 1995–June 2005", selection: "Elected in 1994 and 2000; left for the U.S. Court of Appeals for the Fifth Circuit." },
      { name: "Don R. Willett", service: "August 2005–January 2018", selection: "Appointed by Gov. Rick Perry; elected in 2006 and 2012; left for the Fifth Circuit." },
      { name: "James D. Blacklock", service: "January 2018–January 2025", selection: "Appointed by Gov. Greg Abbott; elected in 2018 and 2024; later appointed chief justice." },
      { name: "James P. Sullivan", service: "January 2025–present", selection: "Appointed by Gov. Greg Abbott." },
    ],
  },
  {
    seat: "Place 3",
    entries: [
      { name: "Gordon Simpson", service: "September 1945–March 1949", selection: "Elected before the 1945 expansion and continued on the nine-member Court." },
      { name: "R. H. Harvey", service: "March 1949–September 1950", selection: "Appointed by Gov. Beauford Jester." },
      { name: "Robert W. Calvert", service: "September 1950–January 1961", selection: "Appointed by Gov. Allan Shivers; later elected and then became chief justice." },
      { name: "Zollie Steakley", service: "January 1961–December 1980", selection: "Appointed by Gov. Price Daniel; subsequently elected." },
      { name: "James P. Wallace", service: "January 1981–September 1988", selection: "Elected in 1980 and 1986." },
      { name: "Eugene A. Cook", service: "September 1988–December 1992", selection: "Appointed by Gov. Bill Clements and elected in 1988." },
      { name: "Rose Spector", service: "January 1993–December 1998", selection: "Elected in 1992." },
      { name: "Harriet O’Neill", service: "January 1999–June 2010", selection: "Elected in 1998 and 2004." },
      { name: "Debra H. Lehrmann", service: "June 2010–present", selection: "Appointed by Gov. Rick Perry; subsequently elected and re-elected." },
    ],
  },
  {
    seat: "Place 4",
    entries: [
      { name: "Graham B. Smedley", service: "September 1945–June 1954", selection: "Commissioner became justice in the 1945 constitutional expansion; later elected." },
      { name: "Ruel C. Walker", service: "October 1954–September 1975", selection: "Appointed by Gov. Allan Shivers; repeatedly elected." },
      { name: "Ross E. Doughty", service: "October 1975–December 1976", selection: "Appointed by Gov. Dolph Briscoe." },
      { name: "Don Yarbrough", service: "January–July 1977", selection: "Elected in 1976; resigned in 1977." },
      { name: "Charles W. Barrow", service: "July 1977–September 1984", selection: "Appointed by Gov. Dolph Briscoe; elected in 1978 and 1982." },
      { name: "Raul A. Gonzalez", service: "October 1984–December 1998", selection: "Appointed by Gov. Mark White; subsequently elected and re-elected." },
      { name: "Alberto R. Gonzales", service: "January 1999–December 2000", selection: "Appointed by Gov. George W. Bush; elected in 2000; left to become White House counsel." },
      { name: "Wallace B. Jefferson", service: "April 2001–September 2004", selection: "Appointed by Gov. Rick Perry; elected in 2002; later appointed chief justice." },
      { name: "David M. Medina", service: "November 2004–December 2012", selection: "Appointed by Gov. Rick Perry; elected in 2006." },
      { name: "John Phillip Devine", service: "January 2013–present", selection: "Elected in 2012 and re-elected in 2018 and 2024." },
    ],
  },
  {
    seat: "Place 5",
    entries: [
      { name: "W. M. Taylor", service: "September 1945–December 1950", selection: "Commissioner became justice through the 1945 constitutional amendment." },
      { name: "Will R. Wilson", service: "January 1951–June 1956", selection: "Elected in 1950; resigned to run for attorney general." },
      { name: "Abner V. McCall", service: "June–December 1956", selection: "Appointed by Gov. Allan Shivers." },
      { name: "James R. Norvell", service: "January 1957–October 1968", selection: "Elected in 1956 and 1962." },
      { name: "Thomas M. Reavley", service: "October 1968–October 1977", selection: "Appointed by Gov. John Connally; later elected; subsequently joined the Fifth Circuit." },
      { name: "T. C. Chadick", service: "October 1977–December 1978", selection: "Appointed by Gov. Dolph Briscoe." },
      { name: "Robert M. Campbell", service: "December 1978–February 1988", selection: "Won election in 1978 and was re-elected in 1980 and 1986." },
      { name: "Barbara Culver", service: "February–December 1988", selection: "Appointed by Gov. Bill Clements." },
      { name: "Jack Hightower", service: "December 1988–January 1996", selection: "Elected in 1988 and re-elected in 1992." },
      { name: "Greg Abbott", service: "January 1996–June 2001", selection: "Appointed by Gov. George W. Bush; elected in 1996 and 1998; later became attorney general and governor." },
      { name: "Xavier Rodriguez", service: "September 2001–November 2002", selection: "Appointed by Gov. Rick Perry." },
      { name: "Steven W. Smith", service: "November 2002–December 2004", selection: "Elected in 2002." },
      { name: "Paul W. Green", service: "January 2005–August 2020", selection: "Elected in 2004 and re-elected in 2010 and 2016." },
      { name: "Rebeca Aizpuru Huddle", service: "October 2020–present", selection: "Appointed by Gov. Greg Abbott; elected in 2022." },
    ],
  },
  {
    seat: "Place 6",
    entries: [
      { name: "John E. Hickman", service: "September 1945–January 1948", selection: "Commissioner became justice in the 1945 expansion; later became chief justice." },
      { name: "W. St. John Garwood", service: "January 1948–December 1958", selection: "Appointed by Gov. Beauford Jester; later elected." },
      { name: "Robert W. Hamilton", service: "January 1959–December 1970", selection: "Elected in 1958 and 1964." },
      { name: "James G. Denton", service: "January 1971–June 1982", selection: "Elected in 1970 and 1976; died in office." },
      { name: "Ruby Kless Sondock", service: "June 1982–December 1982", selection: "Appointed by Gov. Bill Clements to Denton’s vacancy; completed Denton’s term and returned to district court." },
      { name: "William W. Kilgarlin", service: "January 1983–December 1988", selection: "Elected in 1982; defeated in 1988." },
      { name: "Nathan L. Hecht", service: "January 1989–October 2013", selection: "Elected in 1988 and repeatedly re-elected; later appointed chief justice." },
      { name: "Jeffrey V. Brown", service: "October 2013–September 2019", selection: "Appointed in 2013; elected in 2014 and 2018; left for the federal district court." },
      { name: "Jane N. Bland", service: "September 2019–present", selection: "Appointed by Gov. Greg Abbott; elected in 2020 and 2024." },
    ],
  },
  {
    seat: "Place 7",
    entries: [
      { name: "Charles S. Slatton", service: "September 1945–October 1947", selection: "Commissioner became justice through the 1945 constitutional amendment." },
      { name: "James P. Hart", service: "October 1947–November 1950", selection: "Appointed by Gov. Beauford Jester; elected in 1948." },
      { name: "Clyde E. Smith", service: "November 1950–December 1970", selection: "Appointed by Gov. Allan Shivers; later elected and re-elected." },
      { name: "Price Daniel", service: "January 1971–December 1978", selection: "Appointed by Gov. Preston Smith; elected in 1972." },
      { name: "Franklin S. Spears", service: "January 1979–December 1990", selection: "Elected in 1978 and 1984." },
      { name: "John Cornyn", service: "January 1991–October 1997", selection: "Elected in 1990 and 1996; resigned to run for attorney general and later became a U.S. senator." },
      { name: "Deborah Hankinson", service: "October 1997–December 2002", selection: "Appointed by Gov. George W. Bush; elected in 1998." },
      { name: "Dale Wainwright", service: "January 2003–September 2012", selection: "Elected in 2002 and 2008." },
      { name: "Jeffrey S. Boyd", service: "December 2012–2025", selection: "Appointed by Gov. Rick Perry; elected in 2014 and 2020; retired before the end of his term." },
      { name: "Kyle D. Hawkins", service: "October 2025–present", selection: "Appointed by Gov. Greg Abbott to the vacancy left by Boyd." },
    ],
  },
  {
    seat: "Place 8",
    entries: [
      { name: "Few Brewster", service: "September 1945–September 1957", selection: "Commissioner became justice through the 1945 constitutional amendment; later elected." },
      { name: "Joe R. Greenhill", service: "October 1957–October 1972", selection: "Appointed by Gov. Price Daniel; later elected; then became chief justice." },
      { name: "Hawthorne Phillips", service: "October–December 1972", selection: "Appointed by Gov. Preston Smith." },
      { name: "Sam Johnson", service: "January 1973–October 1979", selection: "Elected in 1972 and 1978; left for the Fifth Circuit." },
      { name: "Will Garwood", service: "November 1979–December 1980", selection: "Appointed by Gov. Bill Clements." },
      { name: "C. L. Ray Jr.", service: "November 1980–December 1990", selection: "Elected in 1980 and 1984." },
      { name: "Robert A. Gammage", service: "January 1991–August 1995", selection: "Elected in 1990." },
      { name: "James A. Baker", service: "September 1995–August 2002", selection: "Appointed by Gov. George W. Bush; elected in 1996." },
      { name: "Michael H. Schneider", service: "September 2002–September 2004", selection: "Appointed by Gov. Rick Perry; elected in 2002; left for federal district court." },
      { name: "Phil Johnson", service: "April 2005–December 2018", selection: "Appointed by Gov. Rick Perry; elected in 2006, 2008, and 2014." },
      { name: "J. Brett Busby", service: "March 2019–present", selection: "Appointed by Gov. Greg Abbott; elected in 2020." },
    ],
  },
  {
    seat: "Place 9",
    entries: [
      { name: "A. J. Folley", service: "September 1945–April 1949", selection: "Commissioner became justice through the 1945 constitutional amendment." },
      { name: "Meade F. Griffin", service: "April 1949–December 1968", selection: "Appointed by Gov. Beauford Jester; later elected and re-elected." },
      { name: "Sears McGee", service: "January 1969–December 1986", selection: "Elected in 1968 and repeatedly re-elected." },
      { name: "Oscar H. Mauzy", service: "January 1987–December 1992", selection: "Elected in 1986; defeated in 1992." },
      { name: "Craig T. Enoch", service: "January 1993–October 2003", selection: "Elected in 1992 and 1998." },
      { name: "Scott A. Brister", service: "November 2003–September 2009", selection: "Appointed by Gov. Rick Perry; elected in 2004." },
      { name: "Eva M. Guzman", service: "October 2009–June 2021", selection: "Appointed by Gov. Rick Perry; elected in 2010 and 2016." },
      { name: "Evan A. Young", service: "November 2021–present", selection: "Appointed by Gov. Greg Abbott; elected in 2022." },
    ],
  },
];

export const SUPREME_COURT_SOURCES = [
  { href: "https://www.txcourts.gov/supreme/about-the-court/", label: "Supreme Court of Texas — current justices" },
  { href: "https://www.txcourts.gov/supreme/about-the-court/court-history/", label: "Supreme Court of Texas — Court history" },
  { href: "https://www.txcourts.gov/supreme/about-the-court/court-history/justices-of-the-republic-of-texas/", label: "Supreme Court of Texas — Justices of the Republic of Texas" },
  { href: "https://www.txcourts.gov/supreme/about-the-court/court-history/justices-from-1845-1876/", label: "Supreme Court of Texas — Justices from 1845–1876" },
  { href: "https://www.txcourts.gov/supreme/about-the-court/court-history/justices-from-1876-1945/", label: "Supreme Court of Texas — Justices from 1876–1945" },
  { href: "https://www.txcourts.gov/supreme/about-the-court/court-history/justices-since-1945/", label: "Supreme Court of Texas — Justices since 1945" },
  { href: "https://www.txcourts.gov/supreme/about-the-court/court-history/supreme-court-judicial-election-history.aspx", label: "Supreme Court of Texas — judicial election history" },
  { href: "https://statutes.capitol.texas.gov/Docs/CN/pdf/CN.5.pdf", label: "Texas Constitution, Article V" },
  { href: "https://www.txcourts.gov/supreme/about-the-court/court-history/all-woman-supreme-court.aspx", label: "Supreme Court of Texas — 1925 All-Woman Supreme Court" },
  { href: "https://www.txcourts.gov/supreme/about-the-court/court-history/the-semicolon-court/", label: "Supreme Court of Texas — the Semicolon Court" },
  { href: "https://findingaids.lib.uh.edu/repositories/2/resources/70/", label: "University of Houston Libraries — Judge Ruby Kless Sondock collection" },
  { href: "https://gov.texas.gov/news/post/governor-abbott-appoints-hawkins-as-justice-of-the-supreme-court-of-texas", label: "Office of the Governor — Kyle Hawkins appointment" },
] as const;
