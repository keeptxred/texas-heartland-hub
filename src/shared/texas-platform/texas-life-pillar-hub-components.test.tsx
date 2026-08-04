import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TEXAS_LIFE_PILLAR_HUBS } from './texas-life-pillar-hubs';
import {
  TexasLifePillarHubPage,
  TexasLifePillarNavigation,
  TexasLifePillarResourceCard,
} from './texas-life-pillar-hub-components';

describe('Texas Life pillar hub components', () => {
  it('renders a complete pillar hub page', () => {
    const html = renderToStaticMarkup(<TexasLifePillarHubPage hub={TEXAS_LIFE_PILLAR_HUBS[0]} />);
    expect(html).toContain('Help me understand.');
    expect(html).toContain('Texas Property Taxes');
    expect(html).toContain('Start here');
  });

  it('renders all five persistent pillar navigation links', () => {
    const html = renderToStaticMarkup(<TexasLifePillarNavigation hubs={TEXAS_LIFE_PILLAR_HUBS} />);
    for (const hub of TEXAS_LIFE_PILLAR_HUBS) {
      expect(html).toContain(`/texas-life/${hub.id}`);
      expect(html).toContain(hub.title);
    }
  });

  it('marks external official resources safely', () => {
    const html = renderToStaticMarkup(
      <TexasLifePillarResourceCard
        resource={{
          title: 'Road Conditions',
          description: 'Check current official travel conditions.',
          href: 'https://drivetexas.org/',
        }}
      />,
    );
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer"');
    expect(html).toContain('Visit official resource');
  });

  it('keeps internal resources in the same browsing context', () => {
    const html = renderToStaticMarkup(
      <TexasLifePillarResourceCard
        resource={{
          title: 'Property Tax Calculator',
          description: 'Estimate property taxes.',
          href: '/tax-calculator',
        }}
      />,
    );
    expect(html).not.toContain('target="_blank"');
    expect(html).toContain('Explore');
  });
});
