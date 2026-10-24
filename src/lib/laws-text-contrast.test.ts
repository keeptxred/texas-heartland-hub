import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles.css", "utf8");
const lawHub = readFileSync("src/routes/laws.index.tsx", "utf8");
const header = readFileSync("src/components/site-header.tsx", "utf8");
const pageHero = readFileSync("src/components/page-hero.tsx", "utf8");
const directory = readFileSync("src/routes/laws_.topics.tsx", "utf8");

describe("Texas law authority color contrast guardrails", () => {
  it("uses accessible pale red for shared accent text over navy, not primary buttons", () => {
    expect(css).toContain(".bg-secondary .text-primary");
    expect(css).toContain("color: #fca5a5;");
    expect(css).not.toContain(".bg-primary .text-primary");
    expect(header).toContain('<span className="text-primary">TX</span>');
    expect(pageHero).toContain('<span className="text-primary">{highlight}</span>');
    expect(directory).toContain("text-secondary-foreground");
  });
  it("avoids alpha-faded tiny red section intent labels against cream", () => {
    expect(lawHub).not.toContain("text-primary/80");
    expect(lawHub).toContain("text-sm font-semibold uppercase tracking-wide text-primary");
  });
});
