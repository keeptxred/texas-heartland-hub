import { describe, expect, it } from 'vitest';
import { parseTexasAgPressReleaseIndex } from '../../src/lib/texas-ag-press-releases';

const NOW = Date.parse('2026-10-19T20:00:00Z');
function card(href, title, date, excerpt = 'The official press release contains current facts.') {
  return '<div class="m-b-3"><h4 class="m-b-1 h4-sans"><a href="' + href + '">' + title
    + '</a></h4><p class="m-b-0">' + excerpt + '</p><p class="meta m-b-0">'
    + date + '  | Press Release</p></div>';
}

describe('first-party Texas Attorney General release index', () => {
  it('uses the agency publication date, canonical URL, and excerpt, never crawl time', () => {
    const html = card(
      '/news/releases/attorney-general-secures-new-settlement',
      'Attorney General Secures New Settlement for Texas Consumers',
      'October 16, 2026',
      'The state office announced a settlement protecting Texas consumers.',
    );
    expect(parseTexasAgPressReleaseIndex(html, NOW)).toEqual([{
      title: 'Attorney General Secures New Settlement for Texas Consumers',
      link: 'https://www.texasattorneygeneral.gov/news/releases/attorney-general-secures-new-settlement',
      pub_date: '2026-10-16T12:00:00.000Z',
      source: 'Texas Attorney General — Direct News Releases',
      description: 'The state office announced a settlement protecting Texas consumers.',
    }]);
  });

  it('rejects undated, old, future and off-domain links and deduplicates releases', () => {
    const good = card('/news/releases/new-consumer-action', 'Attorney General Announces a New Consumer Action', 'October 15, 2026');
    const html = [
      good, good,
      card('/news/releases/old-news', 'Attorney General Announces an Old Consumer Action', 'April 15, 2026'),
      card('/news/releases/future-news', 'Attorney General Announces a Future Consumer Action', 'November 12, 2026'),
      card('https://attacker.example/news/releases/fake', 'Attorney General Announces a False Consumer Action', 'October 15, 2026'),
      '<div class="m-b-3"><h4><a href="/news/releases/undated">Attorney General Announces a Date-Free Action</a></h4></div>',
    ].join('\n');
    expect(parseTexasAgPressReleaseIndex(html, NOW).map((item) => item.link)).toEqual([
      'https://www.texasattorneygeneral.gov/news/releases/new-consumer-action',
    ]);
  });

  it('strips harmless editorial markup and discretionary hyphens in official titles', () => {
    const html = card('/news/releases/new-release', 'Attor\u00adney General <span class="caps">Texas</span> Release &amp; Consumer Protection', 'October 16, 2026');
    const [item] = parseTexasAgPressReleaseIndex(html, NOW);
    expect(item.title).toBe('Attorney General Texas Release & Consumer Protection');
  });
});
