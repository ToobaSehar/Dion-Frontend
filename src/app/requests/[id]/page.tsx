import { AdminPortalRequestDetailRouteClient } from '@/components/client-portal-figma/AdminPortalRequestDetailRouteClient';
import { ADMIN_PORTAL_REQUEST_STATIC_PARAM_IDS } from '@/lib/admin-portal-request-static-param-ids';

export function generateStaticParams() {
  return ADMIN_PORTAL_REQUEST_STATIC_PARAM_IDS.map((id) => ({ id }));
}

type PageProps = {
  params: { id: string };
};

/**
 * Standalone admin request detail (Figma mock) — `/requests/[id]`.
 * Pre-rendered for static export (`output: 'export'`).
 */
export default function AdminPortalRequestDetailRoutePage({ params }: PageProps) {
  return <AdminPortalRequestDetailRouteClient id={params.id} />;
}
