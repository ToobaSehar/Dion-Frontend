'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';

import {
  buildAdminPortalFigmaHubHrefWithView,
  type AdminPortalFigmaMainView,
} from '@/components/client-portal-figma/adminPortalFigmaMainView';
import {
  AdminPortalRequestDetailView,
  getAdminRequestDetailForTableRow,
} from '@/components/client-portal-figma/AdminPortalRequestDetailView';
import { getAdminPortalRequestMockRowById } from '@/components/client-portal-figma/AdminPortalRequestsView';
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
 * Standalone admin request detail under `/admin/portal-figma/requests/[id]` —
 * sidebar + top bar + inner scroll pane (same containment as {@link AdminPortalFigmaBookingDetailScreen}).
 */
export function AdminPortalFigmaRequestDetailScreen({
  requestId,
  className,
  adminProfileCard = DEFAULT_ADMIN_PROFILE,
  userInitials = 'AD',
}: {
  requestId: string;
  className?: string;
  adminProfileCard?: { initials: string; name: string; subtitle: string };
  userInitials?: string;
}) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  const row = requestId ? getAdminPortalRequestMockRowById(requestId) : undefined;

  useEffect(() => {
    const el = contentScrollRef.current;
    if (el) el.scrollTop = 0;
  }, [requestId]);

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

  const handleBackToRequests = useCallback(() => {
    router.push(buildAdminPortalFigmaHubHrefWithView('requests'));
  }, [router]);

  if (!requestId || !row) {
    notFound();
  }

  const detail = getAdminRequestDetailForTableRow(row);

  return (
    <div
      className={cn(
        'font-avenir-regular flex h-svh min-h-0 w-full overflow-hidden bg-white text-[#0b1d37]',
        className,
      )}
    >
      <ClientPortalSidebar
        portal="admin"
        activeMainView="requests"
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
          <AdminPortalRequestDetailView detail={detail} onBack={handleBackToRequests} />
        </div>
      </main>
    </div>
  );
}
