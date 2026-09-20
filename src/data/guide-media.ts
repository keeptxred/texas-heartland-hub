export type GuidePhoto = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  sourceUrl: string;
  licenseUrl?: string;
};

export type GuideMedia = {
  hero?: GuidePhoto;
  inline?: Array<GuidePhoto & { afterSection: number }>;
};

export const GUIDE_MEDIA: Record<string, GuideMedia> = {
  "texas-failure-to-identify-law": {
    hero: {
      src: "https://images.pexels.com/photos/7715194/pexels-photo-7715194.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Police officer speaking with a driver during a traffic stop",
      caption:
        "Texas law treats a driver's duty to display a license differently from identification rules that apply to pedestrians, passengers, witnesses and people who have been arrested.",
      credit: "Kindel Media / Pexels",
      sourceUrl:
        "https://www.pexels.com/photo/man-handing-his-driver-s-license-to-the-police-officer-7715194/",
      licenseUrl: "https://www.pexels.com/license/",
    },
    inline: [
      {
        afterSection: 3,
        src: "https://images.pexels.com/photos/7715242/pexels-photo-7715242.jpeg?auto=compress&cs=tinysrgb&w=1400",
        alt: "Police officer speaking with a motorist through an open car window",
        caption:
          "A Texas traffic stop brings driver-specific rules into play, including Transportation Code § 521.025 and Penal Code § 38.02(b-1).",
        credit: "Kindel Media / Pexels",
        sourceUrl:
          "https://www.pexels.com/photo/man-in-black-sunglasses-and-yellow-shirt-driving-car-7715242/",
        licenseUrl: "https://www.pexels.com/license/",
      },
    ],
  },
};
