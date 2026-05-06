'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';

/**
 * Native WebView behaviour (window.open / target=_blank). Capacitor is loaded
 * only inside the effect so dev/SSR and Next static-path workers do not require
 * `@capacitor/core` at module evaluation time.
 */
export function AppShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    let cancelled = false;
    let teardown: (() => void) | undefined;

    void (async () => {
      const { Capacitor } = await import('@capacitor/core');
      if (cancelled) return;
      if (!Capacitor.isNativePlatform()) return;

      const originalWindowOpen = window.open;

      (window as any).open = (
        url: string | URL,
        target?: string,
        features?: string
      ) => {
        const finalUrl = typeof url === 'string' ? url : url.toString();

        try {
          const u = new URL(finalUrl, window.location.href);
          const isSameOrigin = u.origin === window.location.origin;

          if (isSameOrigin) {
            window.location.href = u.toString();
            return null;
          }

          return originalWindowOpen
            ? originalWindowOpen(finalUrl, target, features)
            : null;
        } catch {
          return originalWindowOpen
            ? originalWindowOpen(finalUrl as any, target, features)
            : null;
        }
      };

      const clickHandler = (event: MouseEvent) => {
        const el = (event.target as HTMLElement | null)?.closest(
          'a'
        ) as HTMLAnchorElement | null;

        if (!el) return;

        const href = el.getAttribute('href');
        if (!href) return;

        if (/^(mailto:|tel:|sms:|geo:)/i.test(href)) return;

        try {
          const url = new URL(href, window.location.href);
          const isSameOrigin = url.origin === window.location.origin;

          if (isSameOrigin && el.target === '_blank') {
            event.preventDefault();
            window.location.href = url.toString();
          }
        } catch {
          // ignore parse errors
        }
      };

      document.addEventListener('click', clickHandler);

      teardown = () => {
        document.removeEventListener('click', clickHandler);
        window.open = originalWindowOpen;
      };

      if (cancelled) {
        teardown();
        teardown = undefined;
      }
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  return <>{children}</>;
}
