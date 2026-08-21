export const KEEP_TX_RED_FACEBOOK_PAGE_ID = "1211420085383129";

export const FACEBOOK_PLATFORM_KEEP_TX_RED = "facebook" as const;
export const FACEBOOK_PLATFORM_TEXASDEFINED = "facebook_texasdefined" as const;

export type ManagedFacebookPlatform =
  | typeof FACEBOOK_PLATFORM_KEEP_TX_RED
  | typeof FACEBOOK_PLATFORM_TEXASDEFINED;

type FacebookPageIdentity = {
  id: string;
  name: string;
};

function normalizedPageName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function facebookPlatformForPage(
  page: FacebookPageIdentity,
): ManagedFacebookPlatform | null {
  if (page.id === KEEP_TX_RED_FACEBOOK_PAGE_ID) {
    return FACEBOOK_PLATFORM_KEEP_TX_RED;
  }

  if (normalizedPageName(page.name) === "texasdefined") {
    return FACEBOOK_PLATFORM_TEXASDEFINED;
  }

  return null;
}
