'use client';

import { Suspense, useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import {
  CLIENT_PORTAL_HUB_VIEW_QUERY_KEY,
  type ClientPortalFigmaMainView,
} from '@/components/client-portal-figma/clientPortalFigmaMainView';
import { ClientPortalFigmaDashboard } from '@/components/client-portal-figma/ClientPortalFigmaDashboard';
import { ClientPortalSidebar } from '@/components/client-portal-figma/ClientPortalSidebar';
import { cn } from '@/lib/utils';

function hubMainViewFromSearchParams(searchParams: ReturnType<typeof useSearchParams>): ClientPortalFigmaMainView {
  const tab = searchParams.get(CLIENT_PORTAL_HUB_VIEW_QUERY_KEY);
  if (tab === 'my-requests') return 'my-requests';
  if (tab === 'my-bookings') return 'my-bookings';
  return 'dashboard';
}

function ClientPortalFigmaScreenInner({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mainView, setMainView] = useState<ClientPortalFigmaMainView>(() =>
    hubMainViewFromSearchParams(searchParams),
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const tab = searchParams.get(CLIENT_PORTAL_HUB_VIEW_QUERY_KEY);
    if (tab === 'my-requests') {
      setMainView('my-requests');
      router.replace('/client', { scroll: false });
      return;
    }
    if (tab === 'my-bookings') {
      setMainView('my-bookings');
      router.replace('/client', { scroll: false });
    }
  }, [router, searchParams]);

  return (
    <div
      className={cn(
        'font-avenir-regular flex h-svh min-h-0 w-full overflow-hidden bg-white text-[#0b1d37]',
        className,
      )}
    >
      <ClientPortalSidebar
        activeMainView={mainView}
        onMainViewChange={setMainView}
        isCollapsed={sidebarCollapsed}
      />
      <ClientPortalFigmaDashboard
        activeMainView={mainView}
        onMainViewChange={setMainView}
        onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
      />
    </div>
  );
}

/** Full desktop frame — Figma `Desktop` (`1765:460094`). */
export function ClientPortalFigmaScreen({ className }: { className?: string }) {
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            'font-avenir-regular flex min-h-svh items-center justify-center bg-[#F6F6F4] text-sm text-[#4B4E53]',
            className,
          )}
        >
          Loading…
        </div>
      }
    >
      <ClientPortalFigmaScreenInner className={className} />
    </Suspense>
  );
}
