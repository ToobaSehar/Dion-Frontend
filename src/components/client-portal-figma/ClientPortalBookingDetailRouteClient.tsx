'use client';

import { useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  CLIENT_PORTAL_HUB_MY_BOOKINGS_HREF,
  type ClientPortalFigmaMainView,
} from '@/components/client-portal-figma/clientPortalFigmaMainView';
import {
  COMPLETED_CLIENT_PORTAL_EXTEND_REBOOK_BOOKING_DETAIL,
  CONFIRMED_CLIENT_PORTAL_EXTEND_REBOOK_BOOKING_DETAIL,
  DEFAULT_CLIENT_PORTAL_EXTEND_REBOOK_BOOKING_DETAIL,
  type ClientPortalExtendRebookBookingDetailContent,
} from '@/components/client-portal-figma/ClientPortalExtendRebookTermsView';
import { ClientPortalFigmaDashboard } from '@/components/client-portal-figma/ClientPortalFigmaDashboard';
import { ClientPortalSidebar } from '@/components/client-portal-figma/ClientPortalSidebar';
import { cn } from '@/lib/utils';

const CLIENT_PORTAL_HUB_PATH = '/client' as const;

/**
 * Maps **My Bookings** row ids to the same presets as `/client/extend-rebook` + query (`booking=confirmed` / `completed` / default).
 */
export function clientPortalBookingDetailContentForRouteId(
  bookingId: string,
): ClientPortalExtendRebookBookingDetailContent {
  switch (bookingId) {
    case '3':
    case '4':
      return CONFIRMED_CLIENT_PORTAL_EXTEND_REBOOK_BOOKING_DETAIL;
    case '5':
      return COMPLETED_CLIENT_PORTAL_EXTEND_REBOOK_BOOKING_DETAIL;
    case '1':
    case '2':
    default:
      return DEFAULT_CLIENT_PORTAL_EXTEND_REBOOK_BOOKING_DETAIL;
  }
}

export type ClientPortalBookingDetailRouteClientProps = {
  className?: string;
  bookingId: string;
};

/** Client portal shell for booking detail opened from **My Bookings** at `/client/bookings/[id]`. */
export function ClientPortalBookingDetailRouteClient({
  className,
  bookingId,
}: ClientPortalBookingDetailRouteClientProps) {
  const router = useRouter();
  const [portalView, setPortalView] = useState<'extend-rebook' | 'request-amendment'>('extend-rebook');

  const extendRebookBookingDetail = useMemo(
    () => clientPortalBookingDetailContentForRouteId(bookingId),
    [bookingId],
  );

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
    router.replace(CLIENT_PORTAL_HUB_MY_BOOKINGS_HREF);
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
