import { Suspense } from 'react';

import { ClientPortalExtendRebookRouteClient } from '@/components/client-portal-figma/ClientPortalExtendRebookRouteClient';

export default function ClientExtendRebookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-[#F6F6F4] font-avenir-regular text-sm text-[#4B4E53]">
          Loading…
        </div>
      }
    >
      <ClientPortalExtendRebookRouteClient />
    </Suspense>
  );
}
