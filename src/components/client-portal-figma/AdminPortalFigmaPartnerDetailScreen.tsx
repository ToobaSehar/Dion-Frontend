'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';

import {
  buildAdminPortalFigmaHubHrefWithView,
  type AdminPortalFigmaMainView,
} from '@/components/client-portal-figma/adminPortalFigmaMainView';
import {
  AdminPortalPartnerDetailView,
  resolveAdminPartnerDetail,
} from '@/components/client-portal-figma/AdminPortalPartnerDetailView';
import { getAdminPortalPartnerMockRowById } from '@/components/client-portal-figma/AdminPortalPartnersView';
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
 * Standalone admin partner detail under `/admin/portal-figma/partners/[partnerId]` —
 * sidebar stays **Partners** until the user opens a property **View** modal; while open, **Properties** is
 * highlighted. Closing the modal navigates to the hub **Properties** view (global directory), not the partner
 * properties tab (reset when `partnerId` changes).
 */
export function AdminPortalFigmaPartnerDetailScreen({
  partnerId,
  className,
  adminProfileCard = DEFAULT_ADMIN_PROFILE,
  userInitials = 'AD',
}: {
  partnerId: string;
  className?: string;
  adminProfileCard?: { initials: string; name: string; subtitle: string };
  userInitials?: string;
}) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  /** While the partner property **View** modal is open, shell sidebar highlights **Properties**. */
  const [propertiesSidebarLatched, setPropertiesSidebarLatched] = useState(false);
  /** Avoid treating the initial `open: false` sync as a user-close; also skip navigate on unmount-only signals. */
  const propertyDetailModalWasOpenedRef = useRef(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  const row = partnerId ? getAdminPortalPartnerMockRowById(partnerId) : undefined;

  useEffect(() => {
    const el = contentScrollRef.current;
    if (el) el.scrollTop = 0;
  }, [partnerId]);

  useEffect(() => {
    setPropertiesSidebarLatched(false);
    propertyDetailModalWasOpenedRef.current = false;
  }, [partnerId]);

  const handlePropertyDetailModalOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        propertyDetailModalWasOpenedRef.current = true;
        setPropertiesSidebarLatched(true);
        return;
      }
      if (propertyDetailModalWasOpenedRef.current) {
        propertyDetailModalWasOpenedRef.current = false;
        router.push(buildAdminPortalFigmaHubHrefWithView('properties'));
      }
    },
    [router],
  );

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

  const handleBackToPartners = useCallback(() => {
    router.push(buildAdminPortalFigmaHubHrefWithView('partners'));
  }, [router]);

  if (!partnerId || !row) {
    notFound();
  }

  const detail = resolveAdminPartnerDetail(row);

  return (
    <div
      className={cn(
        'font-avenir-regular flex h-svh min-h-0 w-full overflow-hidden bg-white text-[#0b1d37]',
        className,
      )}
    >
      <ClientPortalSidebar
        portal="admin"
        activeMainView={propertiesSidebarLatched ? 'properties' : 'partners'}
        onMainViewChange={handleMainViewChange}
        isCollapsed={sidebarCollapsed}
        adminProfileCard={adminProfileCard}
        adminOnLogout={handleAdminLogout}
      />
      <main className={cn('flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden', shellBg)}>
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
          <AdminPortalPartnerDetailView
            key={partnerId}
            partnerId={partnerId}
            detail={detail}
            onBack={handleBackToPartners}
            initialTab="properties"
            onPropertyDetailModalOpenChange={handlePropertyDetailModalOpenChange}
          />
        </div>
      </main>
    </div>
  );
}
