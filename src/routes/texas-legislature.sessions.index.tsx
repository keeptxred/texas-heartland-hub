import { createFileRoute } from '@tanstack/react-router';
import TexasLegislaturePage from '@/components/legislature/TexasLegislaturePage';
import { legislatureSeo } from '@/lib/legislature-seo';
const title = 'Past Texas Legislative Sessions';
const description = 'Browse past Texas legislative sessions and connect prior regular and special sessions with Texas laws, policy coverage, lawmakers, and elections.';
export const Route = createFileRoute('/texas-legislature/sessions/')({ head: () => legislatureSeo({ title, description, path: '/texas-legislature/sessions', breadcrumb: 'Past Sessions' }), component: () => <TexasLegislaturePage page="past" /> });
