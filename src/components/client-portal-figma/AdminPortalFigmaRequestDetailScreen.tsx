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
 * same shell as {@link AdminPortalFigmaScreen} (sidebar + top bar + scroll region).
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
  const mainRef = useRef<HTMLElement>(null);

  const row = requestId ? getAdminPortalRequestMockRowById(requestId) : undefined;

  useEffect(() => {
    const mainEl = mainRef.current;
    if (mainEl) mainEl.scrollTop = 0;
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
        ref={mainRef}
        className={cn(
          'flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden',
          shellBg,
        )}
      >
        <header className="sticky top-0 z-20 shrink-0 border-b border-[#e9eaeb] bg-white shadow-[0px_1px_0px_rgba(10,13,18,0.04)]">
          <ClientPortalMainTopBar userInitials={userInitials} onToggleSidebar={() => setSidebarCollapsed((c) => !c)} />
        </header>
        <div className="flex w-full min-w-0 flex-col py-6">
          <AdminPortalRequestDetailView detail={detail} onBack={handleBackToRequests} />
        </div>
      </main>
    </div>
  );
}
