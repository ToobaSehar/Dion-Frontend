'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  ADMIN_PORTAL_FIGMA_BOOKINGS_FILTER_QUERY_KEY,
  ADMIN_PORTAL_FIGMA_VIEW_QUERY_KEY,
  adminPortalBookingDetailHref,
  buildAdminPortalFigmaHubHrefWithView,
  parseAdminPortalBookingsFilterParam,
  parseAdminPortalMainViewParam,
} from '@/components/client-portal-figma/adminPortalFigmaMainView';

import type { AdminPortalFigmaMainView } from '@/components/client-portal-figma/adminPortalFigmaMainView';
import { AdminPortalFigmaDashboard } from '@/components/client-portal-figma/AdminPortalFigmaDashboard';
import type { AdminPortalBookingTableRow } from '@/components/client-portal-figma/AdminPortalBookingsView';
import type { AdminPortalPaymentTableRow } from '@/components/client-portal-figma/AdminPortalPaymentsView';
import type { AdminPortalBookingsFilterTab } from '@/components/client-portal-figma/AdminPortalBookingsStatusPills';
import type { AdminPortalPaymentsFilterTab } from '@/components/client-portal-figma/AdminPortalPaymentsStatusPills';
import type { AdminPortalRequestsFilterTab } from '@/components/client-portal-figma/AdminPortalRequestsStatusPills';
import { ClientPortalSidebar } from '@/components/client-portal-figma/ClientPortalSidebar';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

const DEFAULT_ADMIN_PROFILE = {
  initials: 'AD',
  name: 'Admin User',
  subtitle: 'Platform Admin',
} as const;

export type AdminPortalFigmaScreenProps = {
  className?: string;
  adminProfileCard?: { initials: string; name: string; subtitle: string };
  userInitials?: string;
};

/**
 * Hub state + routing — mirrors {@link ClientPortalFigmaScreenInner} (`useSearchParams` lives here).
 */
function AdminPortalFigmaScreenInner({
  className,
  adminProfileCard = DEFAULT_ADMIN_PROFILE,
  userInitials = 'AD',
}: AdminPortalFigmaScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signOut } = useAuth();
  const [mainView, setMainView] = useState<AdminPortalFigmaMainView>(() => {
    const fromUrl = parseAdminPortalMainViewParam(searchParams.get(ADMIN_PORTAL_FIGMA_VIEW_QUERY_KEY));
    return fromUrl ?? 'dashboard';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [requestsStatusFilter, setRequestsStatusFilter] = useState<AdminPortalRequestsFilterTab>('all');
  const [bookingsStatusFilter, setBookingsStatusFilter] = useState<AdminPortalBookingsFilterTab>(() => {
    const fromUrl = parseAdminPortalMainViewParam(searchParams.get(ADMIN_PORTAL_FIGMA_VIEW_QUERY_KEY));
    if (fromUrl !== 'bookings') return 'all';
    return (
      parseAdminPortalBookingsFilterParam(searchParams.get(ADMIN_PORTAL_FIGMA_BOOKINGS_FILTER_QUERY_KEY)) ?? 'all'
    );
  });
  const [paymentsStatusFilter, setPaymentsStatusFilter] = useState<AdminPortalPaymentsFilterTab>('all');
  const [adminPaymentDetailRow, setAdminPaymentDetailRow] = useState<AdminPortalPaymentTableRow | null>(null);

  const viewParam = searchParams.get(ADMIN_PORTAL_FIGMA_VIEW_QUERY_KEY);
  const bookingsFilterParam = searchParams.get(ADMIN_PORTAL_FIGMA_BOOKINGS_FILTER_QUERY_KEY);
  useEffect(() => {
    const next = parseAdminPortalMainViewParam(viewParam);
    if (next) setMainView(next);
  }, [viewParam]);
  useEffect(() => {
    const nextView = parseAdminPortalMainViewParam(viewParam);
    if (nextView !== 'bookings') return;
    setBookingsStatusFilter(parseAdminPortalBookingsFilterParam(bookingsFilterParam) ?? 'all');
  }, [viewParam, bookingsFilterParam]);

  const handleMainViewChange = useCallback(
    (view: AdminPortalFigmaMainView) => {
      setMainView(view);
      router.replace(buildAdminPortalFigmaHubHrefWithView(view), { scroll: false });
      if (view !== 'payments') {
        setAdminPaymentDetailRow(null);
      }
      if (view === 'requests') {
        setRequestsStatusFilter('all');
      }
      if (view === 'bookings') {
        setBookingsStatusFilter('all');
      }
      if (view === 'payments') {
        setPaymentsStatusFilter('all');
      }
    },
    [router],
  );

  const handleNewRequestsReview = useCallback(() => {
    setRequestsStatusFilter('new');
    setMainView('requests');
    router.replace(buildAdminPortalFigmaHubHrefWithView('requests'), { scroll: false });
  }, [router]);

  const handlePartnerCancellationsResolve = useCallback(() => {
    setBookingsStatusFilter('cancelled');
    setMainView('bookings');
    router.replace(buildAdminPortalFigmaHubHrefWithView('bookings'), { scroll: false });
  }, [router]);

  const handleBankTransfersUnconfirmedConfirm = useCallback(() => {
    setPaymentsStatusFilter('pending');
    setMainView('payments');
    router.replace(buildAdminPortalFigmaHubHrefWithView('payments'), { scroll: false });
  }, [router]);

  const handleBookingRowView = useCallback(
    (row: AdminPortalBookingTableRow) => {
      setAdminPaymentDetailRow(null);
      router.push(adminPortalBookingDetailHref(row.id));
    },
    [router],
  );

  const handlePaymentRowView = useCallback(
    (row: AdminPortalPaymentTableRow) => {
      setAdminPaymentDetailRow(row);
      setBookingsStatusFilter('all');
      router.replace(buildAdminPortalFigmaHubHrefWithView('bookings'));
      setMainView('bookings');
    },
    [router],
  );

  const handleAdminPaymentDetailClose = useCallback(() => {
    setAdminPaymentDetailRow(null);
    router.replace(buildAdminPortalFigmaHubHrefWithView('payments'));
    setMainView('payments');
  }, [router]);

  const handleAdminLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div
      className={cn(
        'font-avenir-regular flex h-svh min-h-0 w-full overflow-hidden bg-white text-[#0b1d37]',
        className,
      )}
    >
      <ClientPortalSidebar
        portal="admin"
        activeMainView={mainView}
        onMainViewChange={handleMainViewChange}
        isCollapsed={sidebarCollapsed}
        adminProfileCard={adminProfileCard}
        adminOnLogout={handleAdminLogout}
      />
      <AdminPortalFigmaDashboard
        activeMainView={mainView}
        userInitials={userInitials}
        onNewRequestsReview={handleNewRequestsReview}
        onPartnerCancellationsResolve={handlePartnerCancellationsResolve}
        onBankTransfersUnconfirmedConfirm={handleBankTransfersUnconfirmedConfirm}
        requestsStatusFilter={requestsStatusFilter}
        onRequestsStatusFilterChange={setRequestsStatusFilter}
        bookingsStatusFilter={bookingsStatusFilter}
        onBookingsStatusFilterChange={setBookingsStatusFilter}
        paymentsStatusFilter={paymentsStatusFilter}
        onPaymentsStatusFilterChange={setPaymentsStatusFilter}
        onBookingRowView={handleBookingRowView}
        adminPaymentDetailRow={adminPaymentDetailRow}
        onAdminPaymentDetailClose={handleAdminPaymentDetailClose}
        onPaymentRowView={handlePaymentRowView}
        onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
      />
    </div>
  );
}

/**
 * Full desktop frame — admin shell reusing client Figma sidebar + top bar (`/admin/portal-figma`).
 * Same **`Suspense` + inner split** as {@link ClientPortalFigmaScreen} so `useSearchParams` is isolated from the static shell.
 */
export function AdminPortalFigmaScreen({ className, adminProfileCard, userInitials }: AdminPortalFigmaScreenProps) {
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            'flex h-dvh min-h-0 w-full items-center justify-center bg-[#F6F6F4] font-avenir-regular text-sm text-[#4B4E53]',
            className,
          )}
        >
          Loading…
        </div>
      }
    >
      <AdminPortalFigmaScreenInner
        className={className}
        adminProfileCard={adminProfileCard}
        userInitials={userInitials}
      />
    </Suspense>
  );
}
