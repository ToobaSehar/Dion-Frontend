'use client';

import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import {
  CLIENT_PORTAL_HUB_MY_REQUESTS_HREF,
  type ClientPortalFigmaMainView,
} from '@/components/client-portal-figma/clientPortalFigmaMainView';
import { ClientPortalFigmaDashboard } from '@/components/client-portal-figma/ClientPortalFigmaDashboard';
import { ClientPortalSidebar } from '@/components/client-portal-figma/ClientPortalSidebar';
import { cn } from '@/lib/utils';

const CLIENT_PORTAL_HUB_PATH = '/client' as const;

export type ClientPortalRequestDetailRouteClientProps = {
  className?: string;
  /** Route param — reserved for wiring request-scoped data later. */
  requestId: string;
};

/**
 * Client portal shell for **request detail** at `/client/requests/[id]` — same chrome as `/client`, URL-driven.
 */
export function ClientPortalRequestDetailRouteClient({
  className,
  requestId,
}: ClientPortalRequestDetailRouteClientProps) {
  void requestId;
  const router = useRouter();

  const goToPortalHub = useCallback(() => {
    router.push(CLIENT_PORTAL_HUB_PATH);
  }, [router]);

  const handleMainViewChange = useCallback(
    (_view: ClientPortalFigmaMainView) => {
      goToPortalHub();
    },
    [goToPortalHub],
  );

  return (
    <div
      className={cn(
        'font-avenir-regular flex h-svh min-h-0 w-full overflow-hidden bg-white text-[#0b1d37]',
        className,
      )}
    >
      <ClientPortalSidebar activeMainView="request-detail" onMainViewChange={handleMainViewChange} />
      <ClientPortalFigmaDashboard
        activeMainView="request-detail"
        onMainViewChange={handleMainViewChange}
        onRequestDetailBack={() => router.replace(CLIENT_PORTAL_HUB_MY_REQUESTS_HREF)}
      />
    </div>
  );
}
