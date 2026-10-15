import { expect, test } from "vitest";
import { printifyDescription } from "./printify-description";

test("retains supplier material and care details after a long introduction", () => {
  const intro = "A supplier-authored introduction. ".repeat(30);
  const description = `${intro}<p>Product features: 100% cotton canvas.</p><p>Care: cold wash.</p>`;
  expect(printifyDescription(description)).toContain("Product features: 100% cotton canvas. Care: cold wash.");
  expect(printifyDescription(description).length).toBeGreaterThan(800);
});
test("normalizes markup and whitespace without inventing product specifications", () => {
  expect(printifyDescription("<p>Graphic tee</p>\n<p>Color varies by variant.</p>")).toBe("Graphic tee Color varies by variant.");
  expect(printifyDescription("")).toBe("");
});
test("respects the Merchant description limit at a word boundary", () => {
  const result = printifyDescription("supplier detail ".repeat(500));
  expect(result.length).toBeLessThanOrEqual(5000);
  expect(result.endsWith("supplier") || result.endsWith("detail")).toBe(true);
});
