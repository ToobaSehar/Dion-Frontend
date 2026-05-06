'use client';

import { useMemo } from 'react';
import { notFound, useRouter } from 'next/navigation';

import {
  AdminPortalRequestDetailView,
  getAdminRequestDetailForTableRow,
} from '@/components/client-portal-figma/AdminPortalRequestDetailView';
import { getAdminPortalRequestMockRowById } from '@/components/client-portal-figma';

export type AdminPortalRequestDetailRouteClientProps = {
  id: string;
};

/** Client body for standalone `/requests/[id]` (static export + Figma mock). */
export function AdminPortalRequestDetailRouteClient({ id }: AdminPortalRequestDetailRouteClientProps) {
  const router = useRouter();
  const row = useMemo(() => (id ? getAdminPortalRequestMockRowById(id) : undefined), [id]);

  if (!id || !row) {
    notFound();
  }

  const detail = getAdminRequestDetailForTableRow(row);

  return (
    <div className="fixed inset-0 z-[100] flex min-h-0 flex-col overflow-y-auto overflow-x-hidden bg-[#F6F6F4] font-avenir-regular text-[#0b1d37]">
      <AdminPortalRequestDetailView detail={detail} onBack={() => router.push('/admin/portal-figma')} />
    </div>
  );
}
