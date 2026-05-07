'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';

import {
  buildAdminPortalFigmaHubHrefWithView,
  type AdminPortalFigmaMainView,
} from '@/components/client-portal-figma/adminPortalFigmaMainView';
import {
  AdminPortalBookingDetailView,
  resolveAdminBookingDetail,
} from '@/components/client-portal-figma/AdminPortalBookingDetailView';
import { getAdminPortalBookingMockRowById } from '@/components/client-portal-figma/AdminPortalBookingsView';
import { ClientPortalMainTopBar } from '@/components/client-portal-figma/ClientPortalMainTopBar';
import { ClientPortalSidebar } from '@/components/client-portal-figma/ClientPortalSidebar';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

const DEFAULT_ADMIN_PROFILE = {
  initials: 'AD',
  name: 'Admin User',
  subtitle: 'Platform Admin',
} as const;

const shellBg = 'bg-[#F6F6F4]';

/**
 * Standalone admin booking detail under `/admin/portal-figma/bookings/[bookingRowId]` —
 * sidebar + top bar + inner scroll pane (same scroll containment as {@link AdminPortalFigmaDashboard}
 * bookings/payments: `main` is `overflow-hidden`, content scrolls in a `flex-1 min-h-0` child).
 */
export function AdminPortalFigmaBookingDetailScreen({
  bookingRowId,
  className,
  adminProfileCard = DEFAULT_ADMIN_PROFILE,
  userInitials = 'AD',
}: {
  bookingRowId: string;
  className?: string;
  adminProfileCard?: { initials: string; name: string; subtitle: string };
  userInitials?: string;
}) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  const row = bookingRowId ? getAdminPortalBookingMockRowById(bookingRowId) : undefined;

  useEffect(() => {
    const el = contentScrollRef.current;
    if (el) el.scrollTop = 0;
  }, [bookingRowId]);

  const handleMainViewChange = useCallback(
    (view: AdminPortalFigmaMainView) => {
      router.push(buildAdminPortalFigmaHubHrefWithView(view));
    },
    [router],
  );

  const handleAdminLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleBackToBookings = useCallback(() => {
    const r = getAdminPortalBookingMockRowById(bookingRowId);
    router.push(
      buildAdminPortalFigmaHubHrefWithView('bookings', {
        bookingsStatus: r?.status ?? 'all',
      }),
    );
  }, [router, bookingRowId]);

  if (!bookingRowId || !row) {
    notFound();
  }

  const detail = resolveAdminBookingDetail(row);

  return (
    <div
      className={cn(
        'font-avenir-regular flex h-svh min-h-0 w-full overflow-hidden bg-white text-[#0b1d37]',
        className,
      )}
    >
      <ClientPortalSidebar
        portal="admin"
        activeMainView="bookings"
        onMainViewChange={handleMainViewChange}
        isCollapsed={sidebarCollapsed}
        adminProfileCard={adminProfileCard}
        adminOnLogout={handleAdminLogout}
      />
      <main
        className={cn(
          'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden',
          shellBg,
        )}
      >
        <header className="sticky top-0 z-20 shrink-0 border-b border-[#e9eaeb] bg-white shadow-[0px_1px_0px_rgba(10,13,18,0.04)]">
          <ClientPortalMainTopBar userInitials={userInitials} onToggleSidebar={() => setSidebarCollapsed((c) => !c)} />
        </header>
        <div
          ref={contentScrollRef}
          className={cn(
            'flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden py-6',
            'pb-16 sm:pb-20 lg:pb-24',
          )}
        >
          <AdminPortalBookingDetailView detail={detail} onBack={handleBackToBookings} />
        </div>
      </main>
    </div>
  );
}
