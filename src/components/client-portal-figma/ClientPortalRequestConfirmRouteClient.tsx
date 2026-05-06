'use client';

import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import type { ClientPortalFigmaMainView } from '@/components/client-portal-figma/clientPortalFigmaMainView';
import { ClientPortalFigmaDashboard } from '@/components/client-portal-figma/ClientPortalFigmaDashboard';
import { ClientPortalSidebar } from '@/components/client-portal-figma/ClientPortalSidebar';
import { cn } from '@/lib/utils';

const CLIENT_PORTAL_HUB_PATH = '/client' as const;

export type ClientPortalRequestConfirmRouteClientProps = {
  className?: string;
  requestId: string;
};

/**
 * Client portal shell for **confirm selection** at `/client/requests/[id]/confirm`.
 */
export function ClientPortalRequestConfirmRouteClient({
  className,
  requestId,
}: ClientPortalRequestConfirmRouteClientProps) {
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

  const handleConfirmBack = useCallback(() => {
    router.push(`/client/requests/${encodeURIComponent(requestId)}`);
  }, [router, requestId]);

  return (
    <div
      className={cn(
        'font-avenir-regular flex h-svh min-h-0 w-full overflow-hidden bg-white text-[#0b1d37]',
        className,
      )}
    >
      <ClientPortalSidebar activeMainView="request-confirm" onMainViewChange={handleMainViewChange} />
      <ClientPortalFigmaDashboard
        activeMainView="request-confirm"
        onMainViewChange={handleMainViewChange}
        onRequestConfirmBack={handleConfirmBack}
      />
    </div>
  );
}
