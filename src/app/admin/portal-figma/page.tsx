import { Suspense } from 'react';

import { AdminPortalFigmaScreen } from '@/components/client-portal-figma/AdminPortalFigmaScreen';

function AdminPortalFigmaPageFallback() {
  return (
    <div className="flex h-dvh min-h-0 w-full items-center justify-center bg-[#F6F6F4] font-avenir-regular text-sm text-[#4B4E53]">
      Loading…
    </div>
  );
}

export default function AdminPortalFigmaPage() {
  return (
    <Suspense fallback={<AdminPortalFigmaPageFallback />}>
      <AdminPortalFigmaScreen />
    </Suspense>
  );
}
