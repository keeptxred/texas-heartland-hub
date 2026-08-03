import type { SharedEntityType } from './entities';
import { resourceSearchHref } from './search-params';

export function absoluteResourceSearchUrl(
  origin: string,
  query: string,
  type: SharedEntityType | 'all' = 'all',
) {
  return new URL(resourceSearchHref(query, type), origin).toString();
}

export async function copyText(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  if (typeof document === 'undefined') return false;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);
  return copied;
}
