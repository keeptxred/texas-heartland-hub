import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  TD_EDITORIAL_AI_AUDIENCE,
  TD_EDITORIAL_AUTHORITY_MODEL,
  TD_EDITORIAL_IMAGE_MODEL,
  TD_EDITORIAL_TEXT_MODEL,
  isTexasDefinedEditorialAiWorkflow,
  parseTexasDefinedEditorialAiRequest,
} from "@/lib/texasdefined-editorial-ai-contract";

const route = readFileSync("src/routes/api/public/hooks/texasdefined-editorial-ai.ts", "utf8");
const messages = [
  { role: "system", content: "Use only verified TexasDefined public-domain factual evidence." },
  { role: "user", content: "Draft a fully grounded Texas fishing visitor guide from the evidence." },
];

describe("protected TexasDefined text and image inference", () => {
  it("recognizes only exact original owner workflows and never arbitrary GitHub Actions", () => {
    expect(TD_EDITORIAL_AI_AUDIENCE).toBe("texasdefined-editorial-ai");
    expect(isTexasDefinedEditorialAiWorkflow(".github/workflows/flyover-scheduled-publish-bridge.yml","issues")).toBe(true);
    expect(isTexasDefinedEditorialAiWorkflow(".github/workflows/texasdefined-scheduled-authority-news.yml","schedule")).toBe(true);
    expect(isTexasDefinedEditorialAiWorkflow(".github/workflows/texasdefined-auto-publication.yml","workflow_dispatch")).toBe(true);
    for (const [path,event] of [
      [".github/workflows/flyover-scheduled-publish-bridge.yml","pull_request"],
      [".github/workflows/texasdefined-scheduled-authority-news.yml","push"],
      [".github/workflows/any-other-pipeline.yml","schedule"],
      [".github/workflows/flyover-scheduled-publish-bridge.yml","workflow_dispatch"],
    ]) expect(isTexasDefinedEditorialAiWorkflow(path,event)).toBe(false);
  });

  it("accepts bounded 5000-token JSON article drafting and four-step authentic illustration requests", () => {
    expect(parseTexasDefinedEditorialAiRequest({model:TD_EDITORIAL_TEXT_MODEL,input:{messages,temperature:0.1,max_tokens:5000}})).toMatchObject({kind:"text",maxTokens:5000});
    expect(parseTexasDefinedEditorialAiRequest({model:TD_EDITORIAL_AUTHORITY_MODEL,input:{messages,temperature:0.1,max_tokens:5000}})).toMatchObject({kind:"text",model:TD_EDITORIAL_AUTHORITY_MODEL,maxTokens:5000});
    const img = parseTexasDefinedEditorialAiRequest({model:TD_EDITORIAL_IMAGE_MODEL,input:{
      prompt:"An original nonphotographic editorial watercolor illustration of rainbow trout in a Texas stream with no typography.",steps:4,
    }});
    expect(img).toMatchObject({kind:"image",model:TD_EDITORIAL_IMAGE_MODEL});
  });

  it("rejects arbitrary endpoints, expired model families, unauthorized roles, oversized prompts and AI-bill escalation", () => {
    for (const input of [
      {model:"@cf/black-forest-labs/flux-1-schnell",input:{prompt:"x".repeat(500),steps:4}},
      {model:"@cf/meta/llama-3.3-70b-instruct",input:{messages,temperature:0,max_tokens:5000}},
      {model:TD_EDITORIAL_TEXT_MODEL,input:{messages:[{role:"developer",content:"x".repeat(30)},messages[1]],temperature:0,max_tokens:5000}},
      {model:TD_EDITORIAL_TEXT_MODEL,input:{messages,temperature:0,max_tokens:12000}},
      {model:TD_EDITORIAL_TEXT_MODEL,input:{messages,temperature:2,max_tokens:5000}},
      {model:TD_EDITORIAL_IMAGE_MODEL,input:{prompt:"x".repeat(2049),steps:4}},
      {model:TD_EDITORIAL_IMAGE_MODEL,input:{prompt:"x".repeat(100),steps:40}},
      {model:TD_EDITORIAL_IMAGE_MODEL,input:{prompt:"x".repeat(12),steps:4}},
    ]) expect(()=>parseTexasDefinedEditorialAiRequest(input)).toThrow();
  });

  it("requires full cryptographic GitHub JWT and KTR paid AI tokens never appear in the returned response", () => {
    expect(route).toContain("verifyGitHubActionsOidc({");
    expect(route).toContain("repository: REPOSITORY");
    expect(route).toContain("workflowPath: workflow.path");
    expect(route).toContain("allowedEventNames: workflow.events");
    expect(route).toContain('return reply({ ok: false, error: "GitHub Actions OIDC authorization required" }, 401)');
    expect(route).toContain('"cache-control": "no-store"');
    expect(route).toContain("authorization: \"Bearer \" + apiToken");
    expect(route).not.toContain("process.env.ADMIN_PASSCODE");
    expect(route).not.toMatch(/openai.*api[-_ ]?key/i);
  });
});
