import { AdminPortalFigmaClientDetailScreen } from '@/components/client-portal-figma/AdminPortalFigmaClientDetailScreen';
import { ADMIN_PORTAL_CLIENT_STATIC_PARAM_IDS } from '@/lib/admin-portal-client-static-param-ids';

export function generateStaticParams() {
  return ADMIN_PORTAL_CLIENT_STATIC_PARAM_IDS.map((clientId) => ({ clientId }));
}

type PageProps = {
  params: { clientId: string };
};

/**
 * Admin Figma mock — client detail at `/admin/portal-figma/clients/[clientId]`
 * (pre-rendered for `output: 'export'`).
 */
export default function AdminPortalFigmaClientDetailPage({ params }: PageProps) {
  return <AdminPortalFigmaClientDetailScreen clientId={params.clientId} />;
}
