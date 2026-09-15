import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  KTR_PREFERRED_SOURCE_EMAIL_COPY,
  KTR_PREFERRED_SOURCE_SOCIAL_COPY,
  KTR_PREFERRED_SOURCE_URL,
} from "@/lib/google-preferred-source";

const read = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("Google Preferred Sources growth integration", () => {
  it("uses the official Google deeplink format for keeptxred.com", () => {
    expect(KTR_PREFERRED_SOURCE_URL).toBe(
      "https://www.google.com/preferences/source?q=keeptxred.com",
    );
    expect(KTR_PREFERRED_SOURCE_SOCIAL_COPY).toContain(KTR_PREFERRED_SOURCE_URL);
    expect(KTR_PREFERRED_SOURCE_EMAIL_COPY).toContain(KTR_PREFERRED_SOURCE_URL);
  });

  it("keeps the article CTA visible immediately after the byline metadata", () => {
    const route = read("src/routes/news.$slug.tsx");
    const byline = route.indexOf('By {article.author}');
    const cta = route.indexOf("<GooglePreferredSourceCta />", byline);
    const editorNote = route.indexOf("{body.editorNote ?", byline);

    expect(byline).toBeGreaterThan(-1);
    expect(cta).toBeGreaterThan(byline);
    expect(editorNote).toBeGreaterThan(cta);
  });

  it("surfaces the deeplink in the newsletter acquisition card", () => {
    const newsletter = read("src/components/newsletter-signup.tsx");
    expect(newsletter).toContain("<GooglePreferredSourceCta compact />");
  });

  it("protects the social promotion with OIDC and a repost guard", () => {
    const hook = read("src/routes/api/public/hooks/promote-google-preferred-source.ts");
    const workflow = read(".github/workflows/promote-google-preferred-source.yml");

    expect(hook).toContain('REPOST_GUARD_DAYS = 21');
    expect(hook).toContain('verifyGitHubActionsOidc');
    expect(hook).toContain('/feed`');
    expect(workflow).toContain('id-token: write');
    expect(workflow).toContain('/api/public/hooks/promote-google-preferred-source');
    expect(workflow).not.toContain('OPENAI_API_KEY');
  });
});
