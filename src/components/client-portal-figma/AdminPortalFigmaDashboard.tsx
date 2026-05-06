'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

import type { AdminPortalFigmaMainView } from '@/components/client-portal-figma/adminPortalFigmaMainView';
import { AdminPortalDashboardHomeView } from '@/components/client-portal-figma/AdminPortalDashboardHomeView';
import { AdminPortalAlertsView } from '@/components/client-portal-figma/AdminPortalAlertsView';
import { AdminPortalFigmaPlaceholderView } from '@/components/client-portal-figma/AdminPortalFigmaPlaceholderView';
import {
  AdminPortalBookingDetailView,
  resolveAdminBookingDetail,
  resolveAdminBookingDetailFromPayment,
} from '@/components/client-portal-figma/AdminPortalBookingDetailView';
import type { AdminPortalBookingTableRow } from '@/components/client-portal-figma/AdminPortalBookingsView';
import { AdminPortalBookingsView } from '@/components/client-portal-figma/AdminPortalBookingsView';
import type { AdminPortalPaymentTableRow } from '@/components/client-portal-figma/AdminPortalPaymentsView';
import { AdminPortalClientsView } from '@/components/client-portal-figma/AdminPortalClientsView';
import { AdminPortalPartnersView } from '@/components/client-portal-figma/AdminPortalPartnersView';
import { AdminPortalPropertiesView } from '@/components/client-portal-figma/AdminPortalPropertiesView';
import { AdminPortalPaymentsView } from '@/components/client-portal-figma/AdminPortalPaymentsView';
import { AdminPortalPayoutsView } from '@/components/client-portal-figma/AdminPortalPayoutsView';
import type { AdminPortalBookingsFilterTab } from '@/components/client-portal-figma/AdminPortalBookingsStatusPills';
import type { AdminPortalPaymentsFilterTab } from '@/components/client-portal-figma/AdminPortalPaymentsStatusPills';
import type { AdminPortalRequestsFilterTab } from '@/components/client-portal-figma/AdminPortalRequestsStatusPills';
import { AdminPortalRequestsView } from '@/components/client-portal-figma/AdminPortalRequestsView';
import { ClientPortalMainTopBar } from '@/components/client-portal-figma/ClientPortalMainTopBar';
import { cn } from '@/lib/utils';

export type AdminPortalFigmaDashboardProps = {
  className?: string;
  activeMainView: AdminPortalFigmaMainView;
  userInitials?: string;
  /** When set, shown instead of the default Figma dashboard home when `activeMainView` is `dashboard`. */
  dashboardSlot?: ReactNode;
  /** Dashboard → New requests → Review: opens Requests with status filter “New”. */
  onNewRequestsReview?: () => void;
  /** Lifted Requests status tab when shell coordinates navigation (portal-figma). */
  requestsStatusFilter?: AdminPortalRequestsFilterTab;
  onRequestsStatusFilterChange?: (tab: AdminPortalRequestsFilterTab) => void;
  /** Dashboard → Partner cancellations → Resolve: opens Bookings with status filter “Cancelled”. */
  onPartnerCancellationsResolve?: () => void;
  bookingsStatusFilter?: AdminPortalBookingsFilterTab;
  onBookingsStatusFilterChange?: (tab: AdminPortalBookingsFilterTab) => void;
  /** Dashboard → Bank transfers unconfirmed → Confirm: opens Payments with status filter “Pending”. */
  onBankTransfersUnconfirmedConfirm?: () => void;
  paymentsStatusFilter?: AdminPortalPaymentsFilterTab;
  onPaymentsStatusFilterChange?: (tab: AdminPortalPaymentsFilterTab) => void;
  /** When set, shows booking detail instead of the bookings table (portal-figma). */
  adminBookingDetailRow?: AdminPortalBookingTableRow | null;
  onAdminBookingDetailClose?: () => void;
  onBookingRowView?: (row: AdminPortalBookingTableRow) => void;
  /** When set, shows payment detail instead of the payments table (portal-figma). */
  adminPaymentDetailRow?: AdminPortalPaymentTableRow | null;
  onAdminPaymentDetailClose?: () => void;
  onPaymentRowView?: (row: AdminPortalPaymentTableRow) => void;
  /** Called when the top-bar toggle button is pressed. */
  onToggleSidebar?: () => void;
};

export function AdminPortalFigmaDashboard({
  className,
  activeMainView,
  userInitials = 'AD',
  dashboardSlot,
  onNewRequestsReview,
  requestsStatusFilter,
  onRequestsStatusFilterChange,
  onPartnerCancellationsResolve,
  bookingsStatusFilter,
  onBookingsStatusFilterChange,
  onBankTransfersUnconfirmedConfirm,
  paymentsStatusFilter,
  onPaymentsStatusFilterChange,
  adminBookingDetailRow,
  onAdminBookingDetailClose,
  onBookingRowView,
  adminPaymentDetailRow,
  onAdminPaymentDetailClose,
  onPaymentRowView,
  onToggleSidebar,
}: AdminPortalFigmaDashboardProps) {
  const mainRef = useRef<HTMLElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const requestsShellTightBottom = activeMainView === 'requests';
  /** Bookings / payments list + detail: lock scroll to inner pane (no outer/main scrollbar). */
  const isBookingsShell = activeMainView === 'bookings';
  const isPaymentsShell = activeMainView === 'payments';
  const isBookingsOrPaymentsShell = isBookingsShell || isPaymentsShell;

  useEffect(() => {
    const mainEl = mainRef.current;
    if (mainEl) mainEl.scrollTop = 0;
    const contentEl = contentScrollRef.current;
    if (contentEl) contentEl.scrollTop = 0;
  }, [activeMainView, adminBookingDetailRow, adminPaymentDetailRow]);

  const shellBg = 'bg-[#F6F6F4]';

  const mainOverflowClass = isBookingsOrPaymentsShell
    ? 'overflow-hidden'
    : requestsShellTightBottom
      ? 'overflow-y-auto overflow-x-auto pb-0'
      : 'overflow-y-auto overflow-x-auto pb-20 sm:pb-24';

  return (
    <main
      ref={mainRef}
      className={cn('flex min-h-0 min-w-0 flex-1 flex-col', shellBg, mainOverflowClass, className)}
    >
      <header className="sticky top-0 z-20 shrink-0 border-b border-[#e9eaeb] bg-white shadow-[0px_1px_0px_rgba(10,13,18,0.04)]">
        <ClientPortalMainTopBar userInitials={userInitials} onToggleSidebar={onToggleSidebar} />
      </header>

      <div
        ref={contentScrollRef}
        className={cn(
          'flex w-full min-w-0 flex-col gap-10 pt-6',
          isBookingsOrPaymentsShell &&
            'min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-16 sm:pb-20 lg:pb-24 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0',
        )}
      >
        {activeMainView === 'dashboard' ? (
          dashboardSlot != null ? (
            dashboardSlot
          ) : (
            <AdminPortalDashboardHomeView
              onNewRequestsReview={onNewRequestsReview}
              onPartnerCancellationsResolve={onPartnerCancellationsResolve}
              onBankTransfersUnconfirmedConfirm={onBankTransfersUnconfirmedConfirm}
            />
          )
        ) : null}
        {activeMainView === 'alerts' ? <AdminPortalAlertsView /> : null}
        {activeMainView === 'requests' ? (
          <AdminPortalRequestsView
            statusFilter={requestsStatusFilter}
            onStatusFilterChange={onRequestsStatusFilterChange}
            viewHrefPrefix="/admin/portal-figma/requests"
          />
        ) : null}
        {activeMainView === 'bookings' ? (
          (() => {
            if (adminPaymentDetailRow != null && onAdminPaymentDetailClose) {
              const detail = resolveAdminBookingDetailFromPayment(adminPaymentDetailRow);
              return <AdminPortalBookingDetailView detail={detail} onBack={onAdminPaymentDetailClose} />;
            }
            const detail = adminBookingDetailRow != null ? resolveAdminBookingDetail(adminBookingDetailRow) : null;
            if (detail && onAdminBookingDetailClose) {
              return <AdminPortalBookingDetailView detail={detail} onBack={onAdminBookingDetailClose} />;
            }
            return (
              <AdminPortalBookingsView
                statusFilter={bookingsStatusFilter}
                onStatusFilterChange={onBookingsStatusFilterChange}
                onViewBooking={onBookingRowView}
              />
            );
          })()
        ) : null}
        {activeMainView === 'payments' ? (
          <AdminPortalPaymentsView
            statusFilter={paymentsStatusFilter}
            onStatusFilterChange={onPaymentsStatusFilterChange}
            onViewPayment={onPaymentRowView}
          />
        ) : null}
        {activeMainView === 'payouts' ? <AdminPortalPayoutsView /> : null}
        {activeMainView === 'clients' ? <AdminPortalClientsView /> : null}
        {activeMainView === 'partners' ? <AdminPortalPartnersView /> : null}
        {activeMainView === 'properties' ? <AdminPortalPropertiesView /> : null}
      </div>
    </main>
  );
}
