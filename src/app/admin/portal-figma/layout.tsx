'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';

/**
 * Locks this route segment to the viewport and prevents the **document** scrollbar
 * (browser chrome at the window edge) while still allowing in-shell scroll panes.
 * Restores `html`/`body` overflow when leaving `/admin/portal-figma/*`.
 */
export default function AdminPortalFigmaLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return <div className="h-dvh min-h-0 w-full overflow-hidden overscroll-none">{children}</div>;
}
