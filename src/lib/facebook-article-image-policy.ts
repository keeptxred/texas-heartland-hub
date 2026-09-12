export type FacebookArticleImagePolicyInput = {
  imageGenerationStatus: string | null | undefined;
  storedFeaturedImageUrl: string | null;
  requestedImageUrl: string | null;
};

export type FacebookArticleImagePolicyResult =
  | { ready: true }
  | { ready: false; error: string };

export function assessFacebookArticleImagePolicy(
  input: FacebookArticleImagePolicyInput,
): FacebookArticleImagePolicyResult {
  const status = (input.imageGenerationStatus ?? "").trim().toLowerCase();
  if (status !== "ready") {
    return {
      ready: false,
      error: "Facebook post blocked: the article featured image is not in ready status.",
    };
  }

  if (!input.storedFeaturedImageUrl) {
    return {
      ready: false,
      error: "Facebook post blocked: the article does not have a canonical featured image.",
    };
  }

  if (!input.requestedImageUrl) {
    return {
      ready: false,
      error: "Facebook post blocked: no featured image was supplied for the article.",
    };
  }

  if (input.requestedImageUrl !== input.storedFeaturedImageUrl) {
    return {
      ready: false,
      error: "Facebook post blocked: the requested image does not match the article's canonical featured image.",
    };
  }

  return { ready: true };
}
