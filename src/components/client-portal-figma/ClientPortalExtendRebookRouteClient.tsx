'use client';

import { useCallback, useMemo, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import type { ClientPortalFigmaMainView } from '@/components/client-portal-figma/clientPortalFigmaMainView';
import {
  COMPLETED_CLIENT_PORTAL_EXTEND_REBOOK_BOOKING_DETAIL,
  CONFIRMED_CLIENT_PORTAL_EXTEND_REBOOK_BOOKING_DETAIL,
  DEFAULT_CLIENT_PORTAL_EXTEND_REBOOK_BOOKING_DETAIL,
} from '@/components/client-portal-figma/ClientPortalExtendRebookTermsView';
import { ClientPortalFigmaDashboard } from '@/components/client-portal-figma/ClientPortalFigmaDashboard';
import { ClientPortalSidebar } from '@/components/client-portal-figma/ClientPortalSidebar';
import { cn } from '@/lib/utils';

const CLIENT_PORTAL_HUB_PATH = '/client' as const;

export type ClientPortalExtendRebookRouteClientProps = {
  className?: string;
};

/**
 * Client portal shell for **extend or rebook** (active booking detail) at `/client/extend-rebook`.
 */
export function ClientPortalExtendRebookRouteClient({ className }: ClientPortalExtendRebookRouteClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [portalView, setPortalView] = useState<'extend-rebook' | 'request-amendment'>('extend-rebook');

  const extendRebookBookingDetail = useMemo(() => {
    const booking = searchParams.get('booking');
    if (booking === 'confirmed') return CONFIRMED_CLIENT_PORTAL_EXTEND_REBOOK_BOOKING_DETAIL;
    if (booking === 'completed') return COMPLETED_CLIENT_PORTAL_EXTEND_REBOOK_BOOKING_DETAIL;
    return DEFAULT_CLIENT_PORTAL_EXTEND_REBOOK_BOOKING_DETAIL;
  }, [searchParams]);

  const amendmentCopy = useMemo(
    () => ({
      propertyTitle: extendRebookBookingDetail.propertyTitle,
      referenceCode: extendRebookBookingDetail.referenceCode,
    }),
    [extendRebookBookingDetail],
  );

  const goToPortalHub = useCallback(() => {
    router.push(CLIENT_PORTAL_HUB_PATH);
  }, [router]);

  const handleMainViewChange = useCallback(
    (_view: ClientPortalFigmaMainView) => {
      goToPortalHub();
    },
    [goToPortalHub],
  );

  const handleExtendRebookBack = useCallback(() => {
    if (portalView === 'request-amendment') {
      setPortalView('extend-rebook');
      return;
    }
    router.push(CLIENT_PORTAL_HUB_PATH);
  }, [portalView, router]);

  return (
    <div
      className={cn(
        'font-avenir-regular flex h-svh min-h-0 w-full overflow-hidden bg-white text-[#0b1d37]',
        className,
      )}
    >
      <ClientPortalSidebar activeMainView="extend-rebook" onMainViewChange={handleMainViewChange} />
      <ClientPortalFigmaDashboard
        activeMainView={portalView}
        onMainViewChange={handleMainViewChange}
        onExtendRebookBack={handleExtendRebookBack}
        onRequestAmendment={() => setPortalView('request-amendment')}
        onRequestAmendmentBack={() => setPortalView('extend-rebook')}
        requestAmendmentContent={amendmentCopy}
        extendRebookBookingDetail={extendRebookBookingDetail}
      />
    </div>
  );
}
