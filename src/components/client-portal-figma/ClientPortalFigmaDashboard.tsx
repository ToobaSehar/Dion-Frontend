'use client';

import { useEffect, useRef } from 'react';

import { ClientPortalDashboardHomeView } from '@/components/client-portal-figma/ClientPortalDashboardHomeView';
import type { ClientPortalFigmaMainView } from '@/components/client-portal-figma/clientPortalFigmaMainView';
import { ClientPortalMainTopBar } from '@/components/client-portal-figma/ClientPortalMainTopBar';
import { ClientPortalMyBookingsView } from '@/components/client-portal-figma/ClientPortalMyBookingsView';
import {
  ClientPortalMyRequestsView,
  type ClientPortalMyRequestRow,
} from '@/components/client-portal-figma/ClientPortalMyRequestsView';
import { ClientPortalNewRequestView } from '@/components/client-portal-figma/ClientPortalNewRequestView';
import { ClientPortalNotificationsView } from '@/components/client-portal-figma/ClientPortalNotificationsView';
import { ClientPortalSettingsView } from '@/components/client-portal-figma/ClientPortalSettingsView';
import { ClientPortalMakePaymentView } from '@/components/client-portal-figma/ClientPortalMakePaymentView';
import { ClientPortalPaymentSchedulePanel } from '@/components/client-portal-figma/ClientPortalPaymentSchedulePanel';
import {
  ClientPortalExtendRebookTermsView,
  type ClientPortalExtendRebookBookingDetailContent,
} from '@/components/client-portal-figma/ClientPortalExtendRebookTermsView';
import {
  ClientPortalRequestAmendmentView,
  type ClientPortalRequestAmendmentContent,
} from '@/components/client-portal-figma/ClientPortalRequestAmendmentView';
import { ClientPortalRequestConfirmSelectionView } from '@/components/client-portal-figma/ClientPortalRequestConfirmSelectionView';
import { ClientPortalRequestDetailView } from '@/components/client-portal-figma/ClientPortalRequestDetailView';
import { cn } from '@/lib/utils';

const DEFAULT_CLIENT_VIEW_OPTIONS_HREF = '/client/requests/1' as const;

function shortlistReadyHrefForRow(row: ClientPortalMyRequestRow, viewOptionsHref: string): string {
  const perRow = `/client/requests/${row.id}`;
  const pathOnly = (viewOptionsHref.split('?')[0] ?? viewOptionsHref).replace(/\/$/, '');
  const idFromHref = pathOnly.split('/').filter(Boolean).pop();
  if (idFromHref === row.id) return viewOptionsHref;
  return perRow;
}

export type ClientPortalFigmaDashboardProps = {
  className?: string;
  activeMainView: ClientPortalFigmaMainView;
  onMainViewChange?: (view: ClientPortalFigmaMainView) => void;
  /** Back from confirm-selection URL route → request detail. */
  onRequestConfirmBack?: () => void;
  /** Back from extend-rebook URL route → dashboard hub (or previous step when host manages sub-views). */
  onExtendRebookBack?: () => void;
  /** Extend/rebook shell → open request amendment (same route stack). */
  onRequestAmendment?: () => void;
  /** Back from request-amendment → previous shell (e.g. extend detail or hub). */
  onRequestAmendmentBack?: () => void;
  /** Copy for amendment header (property · reference). */
  requestAmendmentContent?: ClientPortalRequestAmendmentContent;
  /** Booking detail body for extend/rebook route (`?booking=confirmed` vs active stay). */
  extendRebookBookingDetail?: ClientPortalExtendRebookBookingDetailContent;
  /** Dashboard “View options” + My Requests shortlist-ready badge target base (request id in path). */
  viewOptionsHref?: string;
  /** Back from request-detail URL route → hub (default: dashboard tab). */
  onRequestDetailBack?: () => void;
  /** Called when the top-bar toggle button is pressed. */
  onToggleSidebar?: () => void;
};

/** Main column: top chrome + home or payment schedule from sidebar selection. */
export function ClientPortalFigmaDashboard({
  className,
  activeMainView,
  onMainViewChange,
  onRequestConfirmBack,
  onExtendRebookBack,
  onRequestAmendment,
  onRequestAmendmentBack,
  requestAmendmentContent,
  extendRebookBookingDetail,
  viewOptionsHref,
  onRequestDetailBack,
  onToggleSidebar,
}: ClientPortalFigmaDashboardProps) {
  const mainRef = useRef<HTMLElement>(null);
  const resolvedViewOptionsHref = viewOptionsHref ?? DEFAULT_CLIENT_VIEW_OPTIONS_HREF;

  useEffect(() => {
    const el = mainRef.current;
    if (el) el.scrollTop = 0;
  }, [activeMainView]);

  return (
    <main
      ref={mainRef}
      className={cn(
        'flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-auto bg-[#F6F6F4]',
        activeMainView === 'request-detail'
          ? 'pb-0'
          : activeMainView === 'dashboard' ||
              activeMainView === 'new-request' ||
              activeMainView === 'my-requests' ||
              activeMainView === 'my-bookings' ||
              activeMainView === 'notifications' ||
              activeMainView === 'settings' ||
              activeMainView === 'request-confirm' ||
              activeMainView === 'request-amendment' ||
              activeMainView === 'extend-rebook' ||
              activeMainView === 'payments' ||
              activeMainView === 'make-payment'
            ? 'pb-20 sm:pb-24'
            : 'pb-12',
        className,
      )}
    >
      <header className="sticky top-0 z-20 shrink-0 border-b border-[#e9eaeb] bg-white shadow-[0px_1px_0px_rgba(10,13,18,0.04)]">
        <ClientPortalMainTopBar onToggleSidebar={onToggleSidebar} />
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-10 pt-6">
        {activeMainView === 'dashboard' ? (
          <ClientPortalDashboardHomeView
            viewOptionsHref={resolvedViewOptionsHref}
            onNavigateToPayments={onMainViewChange ? () => onMainViewChange('payments') : undefined}
          />
        ) : null}
        {activeMainView === 'new-request' ? <ClientPortalNewRequestView /> : null}
        {activeMainView === 'my-requests' ? (
          <ClientPortalMyRequestsView
            onNewRequest={onMainViewChange ? () => onMainViewChange('new-request') : undefined}
            resolveShortlistReadyHref={(row) => shortlistReadyHrefForRow(row, resolvedViewOptionsHref)}
          />
        ) : null}
        {activeMainView === 'my-bookings' ? <ClientPortalMyBookingsView /> : null}
        {activeMainView === 'notifications' ? <ClientPortalNotificationsView /> : null}
        {activeMainView === 'settings' ? <ClientPortalSettingsView /> : null}
        {activeMainView === 'request-detail' ? (
          <ClientPortalRequestDetailView
            onBack={onRequestDetailBack ?? (() => onMainViewChange?.('dashboard'))}
          />
        ) : null}
        {activeMainView === 'request-confirm' ? (
          <ClientPortalRequestConfirmSelectionView
            onBack={onRequestConfirmBack ?? (() => onMainViewChange?.('dashboard'))}
          />
        ) : null}
        {activeMainView === 'extend-rebook' ? (
          <ClientPortalExtendRebookTermsView
            onBack={onExtendRebookBack ?? (() => onMainViewChange?.('dashboard'))}
            onRequestAmendment={onRequestAmendment}
            content={extendRebookBookingDetail}
          />
        ) : null}
        {activeMainView === 'request-amendment' ? (
          <ClientPortalRequestAmendmentView
            onBack={onRequestAmendmentBack ?? (() => onMainViewChange?.('dashboard'))}
            content={requestAmendmentContent}
          />
        ) : null}
        {activeMainView === 'payments' ? (
          <section
            className="flex w-full flex-col gap-8 px-8 pb-16 sm:pb-20 lg:pb-24"
            aria-label="Payment schedule"
          >
            <div className="flex flex-col gap-2">
              <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0b1d37]">Payment Schedule</h1>
              <p className="font-avenir-regular max-w-2xl text-sm font-normal leading-5 text-[#535862]">
                All payments due soon across your active bookings.
              </p>
            </div>
            <ClientPortalPaymentSchedulePanel
              onPayNow={onMainViewChange ? () => onMainViewChange('make-payment') : undefined}
            />
          </section>
        ) : null}
        {activeMainView === 'make-payment' ? (
          <ClientPortalMakePaymentView
            onBackToSchedule={() => onMainViewChange?.('payments')}
          />
        ) : null}
      </div>
    </main>
  );
}
