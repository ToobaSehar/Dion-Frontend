import { AdminPortalFigmaRequestDetailScreen } from '@/components/client-portal-figma/AdminPortalFigmaRequestDetailScreen';
import { ADMIN_PORTAL_REQUEST_STATIC_PARAM_IDS } from '@/lib/admin-portal-request-static-param-ids';

export function generateStaticParams() {
  return ADMIN_PORTAL_REQUEST_STATIC_PARAM_IDS.map((id) => ({ id }));
}

type PageProps = {
  params: { id: string };
};

/**
 * Admin Figma mock — request detail at `/admin/portal-figma/requests/[id]`
 * (same shell as `/admin/portal-figma`; pre-rendered for `output: 'export'`).
 */
export default function AdminPortalFigmaRequestDetailPage({ params }: PageProps) {
  return <AdminPortalFigmaRequestDetailScreen requestId={params.id} />;
}
