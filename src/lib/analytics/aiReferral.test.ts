import { describe, expect, it } from 'vitest';
import { classifyAIReferral } from './aiReferral';

describe('AI referral classification', () => {
  it('classifies ChatGPT referrers', () => {
    expect(classifyAIReferral('https://chatgpt.com/c/abc', '')).toEqual({
      platform: 'chatgpt',
      referrerHost: 'chatgpt.com',
      detection: 'referrer',
    });
    expect(classifyAIReferral('https://chat.openai.com/', '')?.platform).toBe('chatgpt');
  });

  it('classifies Perplexity and Gemini referrers', () => {
    expect(classifyAIReferral('https://www.perplexity.ai/search/example', '')?.platform).toBe('perplexity');
    expect(classifyAIReferral('https://gemini.google.com/app/example', '')?.platform).toBe('gemini');
  });

  it('uses explicit UTM source when the referrer is unavailable', () => {
    expect(classifyAIReferral('', '?utm_source=perplexity&utm_medium=referral')).toEqual({
      platform: 'perplexity',
      referrerHost: '',
      detection: 'utm_source',
    });
  });

  it('does not classify ordinary Google search as Gemini', () => {
    expect(classifyAIReferral('https://www.google.com/search?q=texas', '')).toBeNull();
  });

  it('does not retain arbitrary query contents', () => {
    expect(classifyAIReferral('', '?q=private-content')).toBeNull();
  });
});
