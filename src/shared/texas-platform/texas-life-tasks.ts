export type TexasLifeDeadline = {
  id: string;
  title: string;
  opensAt?: string;
  dueAt: string;
  graceEndsAt?: string;
  reminderText: string;
  authorityName: string;
  authorityUrl: string;
  formUrl?: string;
  relatedHrefs: string[];
};

export type TexasLifeChecklistItem = {
  id: string;
  title: string;
  href?: string;
  required?: boolean;
};

export type TexasLifeChecklist = {
  id: string;
  title: string;
  items: TexasLifeChecklistItem[];
};

function validDate(value?: string) {
  return !value || !Number.isNaN(Date.parse(value));
}

function validHttps(value: string) {
  return /^https:\/\//.test(value);
}

export function validateTexasLifeDeadline(deadline: TexasLifeDeadline) {
  const errors: string[] = [];
  if (!deadline.id.trim()) errors.push('id');
  if (!deadline.title.trim()) errors.push('title');
  if (!validDate(deadline.opensAt)) errors.push('opensAt');
  if (!validDate(deadline.dueAt)) errors.push('dueAt');
  if (!validDate(deadline.graceEndsAt)) errors.push('graceEndsAt');
  if (!deadline.reminderText.trim()) errors.push('reminderText');
  if (!deadline.authorityName.trim()) errors.push('authorityName');
  if (!validHttps(deadline.authorityUrl)) errors.push('authorityUrl');
  if (deadline.formUrl && !validHttps(deadline.formUrl)) errors.push('formUrl');
  if (deadline.relatedHrefs.some((href) => !href.startsWith('/'))) errors.push('relatedHrefs');
  if (deadline.opensAt && Date.parse(deadline.opensAt) > Date.parse(deadline.dueAt)) errors.push('dateOrder');
  if (deadline.graceEndsAt && Date.parse(deadline.graceEndsAt) < Date.parse(deadline.dueAt)) errors.push('graceOrder');
  return { valid: errors.length === 0, errors };
}

export function deadlineState(deadline: TexasLifeDeadline, now = new Date()) {
  const time = now.getTime();
  const opens = deadline.opensAt ? Date.parse(deadline.opensAt) : Number.NEGATIVE_INFINITY;
  const due = Date.parse(deadline.dueAt);
  const grace = deadline.graceEndsAt ? Date.parse(deadline.graceEndsAt) : due;
  if (time < opens) return 'upcoming' as const;
  if (time <= due) return 'open' as const;
  if (time <= grace) return 'grace' as const;
  return 'closed' as const;
}

export function checklistProgress(checklist: TexasLifeChecklist, completedIds: ReadonlySet<string>) {
  const uniqueItems = checklist.items.filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index);
  const completed = uniqueItems.filter((item) => completedIds.has(item.id)).length;
  return {
    completed,
    total: uniqueItems.length,
    percent: uniqueItems.length ? Math.round((completed / uniqueItems.length) * 100) : 0,
    complete: uniqueItems.length > 0 && completed === uniqueItems.length,
  };
}

export function validateTexasLifeChecklist(checklist: TexasLifeChecklist) {
  const errors: string[] = [];
  if (!checklist.id.trim()) errors.push('id');
  if (!checklist.title.trim()) errors.push('title');
  if (!checklist.items.length) errors.push('items');
  if (new Set(checklist.items.map((item) => item.id)).size !== checklist.items.length) errors.push('duplicateItems');
  if (checklist.items.some((item) => !item.id.trim() || !item.title.trim())) errors.push('invalidItem');
  if (checklist.items.some((item) => item.href && !item.href.startsWith('/'))) errors.push('invalidHref');
  return { valid: errors.length === 0, errors };
}
