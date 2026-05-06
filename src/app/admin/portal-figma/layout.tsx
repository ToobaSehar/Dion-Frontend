import type { ReactNode } from 'react';

/**
 * Locks this route to the viewport so the shell (`AdminPortalFigmaScreen` + `main` scroll)
 * does not also scroll the document — avoids double vertical scrollbars.
 */
export default function AdminPortalFigmaLayout({ children }: { children: ReactNode }) {
  return <div className="h-dvh min-h-0 w-full overflow-hidden">{children}</div>;
}
