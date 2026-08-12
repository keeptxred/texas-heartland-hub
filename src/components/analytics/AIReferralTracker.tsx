import { useEffect } from 'react';
import { classifyAIReferral } from '@/lib/analytics/aiReferral';

const SESSION_KEY = 'ktr:ai-referral-recorded';

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

export function AIReferralTracker() {
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const storage = safeSessionStorage();
    if (storage?.getItem(SESSION_KEY) === '1') return undefined;

    const referral = classifyAIReferral(document.referrer, window.location.search);
    if (!referral) return undefined;

    const send = (attemptsRemaining: number) => {
      if (cancelled) return;
      const gtag = (window as AnalyticsWindow).gtag;
      if (typeof gtag === 'function') {
        gtag('event', 'ai_referral_visit', {
          ai_platform: referral.platform,
          referrer_host: referral.referrerHost || 'not-provided',
          detection_method: referral.detection,
          landing_path: window.location.pathname,
        });
        storage?.setItem(SESSION_KEY, '1');
        return;
      }
      if (attemptsRemaining > 0) timer = setTimeout(() => send(attemptsRemaining - 1), 500);
    };

    send(10);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return null;
}

function safeSessionStorage() {
  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
}

export default AIReferralTracker;
