'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  ADMIN_PORTAL_FIGMA_VIEW_QUERY_KEY,
  buildAdminPortalFigmaHubHrefWithView,
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

/** Full desktop frame — admin shell reusing client Figma sidebar + top bar (`/admin/portal-figma`). */
export function AdminPortalFigmaScreen({
  className,
  adminProfileCard = DEFAULT_ADMIN_PROFILE,
  userInitials = 'AD',
}: {
  className?: string;
  adminProfileCard?: { initials: string; name: string; subtitle: string };
  userInitials?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signOut } = useAuth();
  const [mainView, setMainView] = useState<AdminPortalFigmaMainView>(() => {
    const fromUrl = parseAdminPortalMainViewParam(searchParams.get(ADMIN_PORTAL_FIGMA_VIEW_QUERY_KEY));
    return fromUrl ?? 'dashboard';
  });

  const viewParam = searchParams.get(ADMIN_PORTAL_FIGMA_VIEW_QUERY_KEY);
  useEffect(() => {
    const next = parseAdminPortalMainViewParam(viewParam);
    if (next) setMainView(next);
  }, [viewParam]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [requestsStatusFilter, setRequestsStatusFilter] = useState<AdminPortalRequestsFilterTab>('all');
  const [bookingsStatusFilter, setBookingsStatusFilter] = useState<AdminPortalBookingsFilterTab>('all');
  const [paymentsStatusFilter, setPaymentsStatusFilter] = useState<AdminPortalPaymentsFilterTab>('all');
  const [adminBookingDetailRow, setAdminBookingDetailRow] = useState<AdminPortalBookingTableRow | null>(null);
  const [adminPaymentDetailRow, setAdminPaymentDetailRow] = useState<AdminPortalPaymentTableRow | null>(null);

  const handleMainViewChange = useCallback(
    (view: AdminPortalFigmaMainView) => {
      setMainView(view);
      router.replace(buildAdminPortalFigmaHubHrefWithView(view), { scroll: false });
      if (view !== 'bookings') {
        setAdminBookingDetailRow(null);
      }
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

  const handleBookingRowView = useCallback((row: AdminPortalBookingTableRow) => {
    setAdminPaymentDetailRow(null);
    setAdminBookingDetailRow(row);
  }, []);

  const handleAdminBookingDetailClose = useCallback(() => {
    setAdminBookingDetailRow(null);
  }, []);

  const handlePaymentRowView = useCallback(
    (row: AdminPortalPaymentTableRow) => {
      setAdminBookingDetailRow(null);
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
        adminBookingDetailRow={adminBookingDetailRow}
        onAdminBookingDetailClose={handleAdminBookingDetailClose}
        onBookingRowView={handleBookingRowView}
        adminPaymentDetailRow={adminPaymentDetailRow}
        onAdminPaymentDetailClose={handleAdminPaymentDetailClose}
        onPaymentRowView={handlePaymentRowView}
        onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
      />
    </div>
  );
}
