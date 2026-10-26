export function rootOrganizationJsonLd() {
  const site = "https://keeptxred.com";
  const title = "Keep TX Red";
  const logo = site + "/keep-tx-red-icon.svg";
  const image = site + "/og/default.jpg";
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "@id": site + "/#organization",
    name: title,
    alternateName: ["Keep Texas Red", "KeepTXRed.com"],
    url: site + "/",
    description: "Keep TX Red is a Texas-focused news and analysis outlet covering policy, elections, and issues shaping the state.",
    publishingPrinciples: site + "/editorial-standards",
    diversityPolicy: site + "/editorial-standards",
    ethicsPolicy: site + "/editorial-standards",
    logo: {
      "@type": "ImageObject",
      url: logo,
      contentUrl: logo,
      caption: title,
      description: "Keep TX Red red Texas logo",
    },
    image: {
      "@type": "ImageObject",
      url: image,
      contentUrl: image,
      width: 1200,
      height: 630,
      caption: title,
      description: "Keep TX Red — Texas News, Politics & Conservative Commentary",
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61591363654407",
      "https://www.instagram.com/keeptxreddotcom/",
      "https://github.com/keeptxred",
    ],
    knowsAbout: ["Texas politics", "Texas policy", "Texas elections", "Texas legislature", "Texas news"],
    contactPoint: {
      "@type": "ContactPoint",
      email: "admin@keeptxred.com",
      contactType: "Editorial",
    },
    areaServed: { "@type": "State", name: "Texas" },
  };
}
