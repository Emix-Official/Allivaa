type WindowWithAnalytics = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
};

export function trackEvent(eventName: string, payload?: Record<string, unknown>) {
  try {
    if (typeof window === 'undefined') return;
    const w = window as unknown as WindowWithAnalytics;
    if (w.dataLayer) {
      w.dataLayer.push({ event: eventName, ...(payload || {}) });
      return;
    }
    if (typeof w.gtag === 'function') {
      w.gtag('event', eventName, payload || {});
      return;
    }
  // fallback: console for local dev
  console.log('trackEvent', eventName, payload || {});
  } catch (err) {
  // don't break production for analytics failures
  console.warn('analytics.trackEvent error', err);
  }
}
