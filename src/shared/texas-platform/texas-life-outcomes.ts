export type TexasLifeOutcomeType =
  | 'resource-found'
  | 'next-step-clicked'
  | 'official-source-visited'
  | 'task-return-visit';

export type TexasLifeOutcomeEvent = {
  type: TexasLifeOutcomeType;
  pageId: string;
  sessionId: string;
  occurredAt: string;
  destination?: string;
};

export type TexasLifeOutcomeSummary = {
  totalEvents: number;
  uniqueSessions: number;
  resourceFound: number;
  nextStepClicked: number;
  officialSourceVisited: number;
  taskReturnVisit: number;
  completionRate: number;
};

const OUTCOME_TYPES: TexasLifeOutcomeType[] = [
  'resource-found',
  'next-step-clicked',
  'official-source-visited',
  'task-return-visit',
];

export function isTexasLifeOutcomeEvent(value: unknown): value is TexasLifeOutcomeEvent {
  if (!value || typeof value !== 'object') return false;
  const event = value as Partial<TexasLifeOutcomeEvent>;
  return OUTCOME_TYPES.includes(event.type as TexasLifeOutcomeType)
    && typeof event.pageId === 'string'
    && event.pageId.trim().length > 0
    && typeof event.sessionId === 'string'
    && event.sessionId.trim().length > 0
    && typeof event.occurredAt === 'string'
    && Number.isFinite(Date.parse(event.occurredAt))
    && (event.destination === undefined || (typeof event.destination === 'string' && event.destination.length > 0));
}

export function normalizeTexasLifeOutcomeEvents(values: ReadonlyArray<unknown>) {
  return values.filter(isTexasLifeOutcomeEvent).map((event) => ({
    ...event,
    pageId: event.pageId.trim(),
    sessionId: event.sessionId.trim(),
  }));
}

export function summarizeTexasLifeOutcomes(values: ReadonlyArray<unknown>): TexasLifeOutcomeSummary {
  const events = normalizeTexasLifeOutcomeEvents(values);
  const sessions = new Set(events.map((event) => event.sessionId));
  const count = (type: TexasLifeOutcomeType) => events.filter((event) => event.type === type).length;
  const resourceFound = count('resource-found');
  const nextStepClicked = count('next-step-clicked');
  const officialSourceVisited = count('official-source-visited');
  const taskReturnVisit = count('task-return-visit');
  const completedSessions = new Set(
    events.filter((event) => event.type === 'official-source-visited' || event.type === 'next-step-clicked')
      .map((event) => event.sessionId),
  ).size;

  return {
    totalEvents: events.length,
    uniqueSessions: sessions.size,
    resourceFound,
    nextStepClicked,
    officialSourceVisited,
    taskReturnVisit,
    completionRate: sessions.size ? completedSessions / sessions.size : 0,
  };
}
