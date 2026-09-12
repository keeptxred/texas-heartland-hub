import { describe, expect, it } from "vitest";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { privacyHead } from "@/routes/privacy";
import { shippingPolicyHead } from "@/routes/shipping-policy";
import { termsOfServiceHead } from "@/routes/terms-of-service";
import { returnRefundPolicyHead } from "@/routes/return-refund-policy";

function metaContent(
  meta: Array<Record<string, string>>,
  key: "name" | "property",
  value: string,
) {
  return meta.find((item) => item[key] === value)?.content;
}

const INDEX_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

const policies = [
  {
    name: "Privacy",
    head: privacyHead,
    path: "/privacy",
    title: "Privacy Policy | Keep TX Red",
  },
  {
    name: "Shipping",
    head: shippingPolicyHead,
    path: "/shipping-policy",
    title: "Shipping Policy | Keep TX Red",
  },
  {
    name: "Terms",
    head: termsOfServiceHead,
    path: "/terms-of-service",
    title: "Terms of Service | Keep TX Red",
  },
  {
    name: "Return and Refund",
    head: returnRefundPolicyHead,
    path: "/return-refund-policy",
    title: "Return & Refund Policy | Keep TX Red",
  },
] as const;

describe("legal policy shared SEO metadata", () => {
  for (const policy of policies) {
    it(`${policy.name} uses the canonical shared metadata contract`, () => {
      const head = policy.head();

      expect(head.meta.find((item) => "title" in item)?.title).toBe(policy.title);
      expect(head.links).toEqual([
        { rel: "canonical", href: `${SITE_URL}${policy.path}` },
      ]);
      expect(metaContent(head.meta, "name", "robots")).toBe(INDEX_ROBOTS);
      expect(metaContent(head.meta, "property", "og:image")).toBe(DEFAULT_OG_IMAGE);
      expect(metaContent(head.meta, "name", "twitter:card")).toBe(
        "summary_large_image",
      );
      expect(metaContent(head.meta, "name", "twitter:image")).toBe(DEFAULT_OG_IMAGE);
    });
  }
});
