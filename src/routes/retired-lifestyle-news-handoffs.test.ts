import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const contracts = [
  {
    path: "src/routes/news.moving-to-texas-guide.tsx",
    route: "/news/moving-to-texas-guide",
    destination: "https://texasdefined.com/article/moving-to-texas-what-nobody-tells-you",
  },
  {
    path: "src/routes/news.moving-to-austin-guide.tsx",
    route: "/news/moving-to-austin-guide",
    destination: "https://texasdefined.com/article/moving-to-austin-guide",
  },
  {
    path: "src/routes/news.moving-to-el-paso-guide.tsx",
    route: "/news/moving-to-el-paso-guide",
    destination: "https://texasdefined.com/article/moving-to-el-paso-guide",
  },
  {
    path: "src/routes/news.2026-07-04-the-real-reason-behind-the-resilience-of-texas-identity.tsx",
    route: "/news/2026-07-04-the-real-reason-behind-the-resilience-of-texas-identity",
    destination: "https://texasdefined.com/things-unique-to-texas",
  },
  {
    path: "src/routes/news.2026-07-04-the-real-reason-behind-the-resilience-of-texas-identity-in-2026-explained-simply.tsx",
    route: "/news/2026-07-04-the-real-reason-behind-the-resilience-of-texas-identity-in-2026-explained-simply",
    destination: "https://texasdefined.com/things-unique-to-texas",
  },
  {
    path: "src/routes/news.canyon-lake-pushes-to-full-capacity-following-multiyear-drought-2025-d9be1db3.tsx",
    route: "/news/canyon-lake-pushes-to-full-capacity-following-multiyear-drought-2025-d9be1db3",
    destination: "https://texasdefined.com/news/2026-08-10-canyon-lake-full-capacity-recovery",
  },
  {
    path: "src/routes/news.2026-08-09-canyon-lake-full-capacity-recovery.tsx",
    route: "/news/2026-08-09-canyon-lake-full-capacity-recovery",
    destination: "https://texasdefined.com/news/2026-08-10-canyon-lake-full-capacity-recovery",
  },
] as const;

describe("retired lifestyle news handoffs", () => {
  it("keeps legacy KTR lifestyle URLs as query-preserving one-hop TexasDefined redirects", () => {
    for (const contract of contracts) {
      const source = readFileSync(contract.path, "utf8");
      expect(source, `${contract.path} must remain a route`).toContain(contract.route);
      expect(source, `${contract.path} must use router-native redirects`).toContain(
        'import { createFileRoute, redirect } from "@tanstack/react-router"',
      );
      expect(source, `${contract.path} must target the canonical TexasDefined owner`).toContain(
        contract.destination,
      );
      expect(source, `${contract.path} must preserve query parameters`).toContain(
        "location.searchStr",
      );
      expect(source, `${contract.path} must remain permanent`).toContain("statusCode: 301");
      expect(source, `${contract.path} must redirect before rendering`).toContain("beforeLoad:");
      expect(source, `${contract.path} must not render KTR content`).not.toContain("component:");
      expect(source, `${contract.path} must not use a loader redirect`).not.toContain("loader:");
      expect(source, `${contract.path} must not force a second document redirect`).not.toContain(
        "reloadDocument",
      );
    }
  });
});
