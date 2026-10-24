import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const root = readFileSync("src/routes/__root.tsx", "utf8");
const adsense = root.split("const ADSENSE_BOOTSTRAP = ")[1]?.split("const INFOLINKS_BOOTSTRAP")[0] ?? "";
const infolinks = root.split("const INFOLINKS_BOOTSTRAP = ")[1]?.split("function ErrorComponent")[0] ?? "";

describe("Texas legal authority first-render ad scheduling", () => {
  it("preserves both providers and every existing eligibility gate", () => {
    expect(adsense).toContain("pagead2.googlesyndication.com");
    expect(infolinks).toContain("resources.infolinks.com");
    for (const script of [adsense, infolinks]) {
      expect(script).toContain("if(excluded||noindex||ineligible)return");
      expect(script).toContain("u.indexOf('KeepTXRed-')!==-1&&/smoke/i.test(u)");
      expect(script).toContain("DOMContentLoaded");
    }
  });
  it("limits first-render deferral to actual laws routes and leaves other paths unchanged", () => {
    for (const script of [adsense, infolinks]) {
      expect(script).toContain("location.pathname==='/laws'||location.pathname.indexOf('/laws/')===0");
      expect(script).toContain("if(lawPage)");
      expect(script).toContain("window.addEventListener('load',afterLoad,{once:true})");
      expect(script).toContain("window.requestIdleCallback(load,{timeout:2500})");
      expect(script).toContain("else if(document.readyState==='loading')");
    }
  });
  it("stagger-loads the two independent monetization providers without removing them", () => {
    expect(adsense).toContain("else{load();}},0)");
    expect(infolinks).toContain("else{load();}},600)");
    expect(root.split("var lawPage=").length - 1).toBe(2);
    expect(root).toContain("data-adsense-gated");
    expect(root).toContain("data-infolinks-gated");
  });
});
