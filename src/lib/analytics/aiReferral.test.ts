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

  it('classifies major AI discovery referrers conservatively', () => {
    expect(classifyAIReferral('https://www.perplexity.ai/search/example', '')?.platform).toBe('perplexity');
    expect(classifyAIReferral('https://gemini.google.com/app/example', '')?.platform).toBe('gemini');
    expect(classifyAIReferral('https://copilot.microsoft.com/chats/example', '')?.platform).toBe('copilot');
    expect(classifyAIReferral('https://copilot.com/', '')?.platform).toBe('copilot');
    expect(classifyAIReferral('https://claude.ai/chat/example', '')?.platform).toBe('claude');
    expect(classifyAIReferral('https://you.com/search?q=texas', '')?.platform).toBe('you');
  });

  it('uses explicit UTM source when the referrer is unavailable', () => {
    expect(classifyAIReferral('', '?utm_source=perplexity&utm_medium=referral')).toEqual({
      platform: 'perplexity',
      referrerHost: '',
      detection: 'utm_source',
    });
    expect(classifyAIReferral('', '?utm_source=microsoft_copilot')?.platform).toBe('copilot');
    expect(classifyAIReferral('', '?utm_source=anthropic')?.platform).toBe('claude');
    expect(classifyAIReferral('', '?utm_source=you_com')?.platform).toBe('you');
  });

  it('does not classify ordinary search traffic as an AI assistant', () => {
    expect(classifyAIReferral('https://www.google.com/search?q=texas', '')).toBeNull();
    expect(classifyAIReferral('https://www.bing.com/search?q=texas', '')).toBeNull();
  });

  it('does not retain arbitrary query contents', () => {
    expect(classifyAIReferral('', '?q=private-content')).toBeNull();
  });
});
