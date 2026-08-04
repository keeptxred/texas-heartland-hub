import { createTexasLifeBlueprint } from './texas-life-page-blueprint';

export const TEXAS_LIFE_STARTER_BLUEPRINTS = [
  createTexasLifeBlueprint({
    id: 'homestead-exemption',
    title: 'Texas Homestead Exemption',
    pillar: 'do',
    what: 'A homestead exemption can reduce the taxable value of a qualifying primary residence.',
    why: 'A lower taxable value can reduce the property taxes owed on an eligible home.',
    next: 'Confirm eligibility, gather the required identification and file with the county appraisal district.',
    verify: 'Verify eligibility, forms and deadlines with the appraisal district serving the property.',
    else: 'Approval is not automatic, requirements can vary and filing with the wrong office can delay the application.',
    trust: {
      explanation: 'TexasDefined explains the general process, common requirements and practical next steps.',
      authority: 'The county appraisal district determines eligibility and approves or denies the application.',
      authorityName: 'Texas Comptroller property tax assistance',
      authorityUrl: 'https://comptroller.texas.gov/taxes/property-tax/exemptions/',
    },
    nextSteps: [
      { title: 'Estimate property taxes', href: '/tax-calculator' },
      { title: 'Find your county', href: '/texas-resources/type/county' },
      { title: 'Review the protest guide', href: '/texas-property-tax-protest-guide' },
    ],
  }),
  createTexasLifeBlueprint({
    id: 'moving-to-texas',
    title: 'Moving to Texas',
    pillar: 'do',
    what: 'A practical sequence for establishing residency, services and local connections after a move to Texas.',
    why: 'Completing tasks in the right order reduces missed deadlines, duplicate trips and service interruptions.',
    next: 'Choose a city or county, estimate living costs and begin the driver license, vehicle and utility checklist.',
    verify: 'Use the linked state, county and municipal agencies for current requirements and applications.',
    else: 'Deadlines, documents and service providers vary by location and personal circumstances.',
    trust: {
      explanation: 'TexasDefined organizes the steps and explains how they connect.',
      authority: 'Each responsible state or local agency sets requirements and makes final decisions.',
      authorityName: 'Texas Department of Public Safety',
      authorityUrl: 'https://www.dps.texas.gov/section/driver-license',
    },
    nextSteps: [
      { title: 'Compare cost of living', href: '/texas-cost-of-living-calculator' },
      { title: 'Browse Texas cities', href: '/texas-resources/type/city' },
      { title: 'Find local government resources', href: '/texas-resources?q=local+government' },
    ],
  }),
  createTexasLifeBlueprint({
    id: 'start-an-llc',
    title: 'Start a Texas LLC',
    pillar: 'do',
    what: 'A Texas limited liability company is a business entity formed by filing with the Secretary of State.',
    why: 'The entity structure affects liability, taxes, banking and ongoing compliance obligations.',
    next: 'Confirm the name, choose a registered agent, file the formation document and complete tax and banking setup.',
    verify: 'Confirm filing requirements and status directly with the Texas Secretary of State and Comptroller.',
    else: 'Formation does not replace permits, tax registration, contracts, insurance or professional advice.',
    trust: {
      explanation: 'TexasDefined explains the sequence and highlights common decisions.',
      authority: 'The Texas Secretary of State accepts or rejects formation filings, while other agencies govern taxes and permits.',
      authorityName: 'Texas Secretary of State',
      authorityUrl: 'https://www.sos.state.tx.us/corp/index.shtml',
    },
    nextSteps: [
      { title: 'Review business resources', href: '/texas-resources?q=start+a+business' },
      { title: 'Find Texas agencies', href: '/texas-resources/type/agency' },
      { title: 'Explore business guides', href: '/texas-resources/type/guide' },
    ],
  }),
] as const;

export function texasLifeStarterBlueprint(id: string) {
  return TEXAS_LIFE_STARTER_BLUEPRINTS.find((blueprint) => blueprint.id === id);
}
