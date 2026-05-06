'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Legacy URL — canonical client portal is `/client` (static export: client-side replace).
 */
export default function ClientPortalFigmaLegacyPathRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/client');
  }, [router]);
  return (
    <div className="flex min-h-svh items-center justify-center bg-white text-sm text-[#4B4E53]">
      Redirecting…
    </div>
  );
}
