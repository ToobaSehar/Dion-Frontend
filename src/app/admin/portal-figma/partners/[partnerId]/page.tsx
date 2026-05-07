import { AdminPortalFigmaPartnerDetailScreen } from '@/components/client-portal-figma/AdminPortalFigmaPartnerDetailScreen';
import { ADMIN_PORTAL_PARTNER_STATIC_PARAM_IDS } from '@/lib/admin-portal-partner-static-param-ids';

export function generateStaticParams() {
  return ADMIN_PORTAL_PARTNER_STATIC_PARAM_IDS.map((partnerId) => ({ partnerId }));
}

type PageProps = {
  params: { partnerId: string };
};

/**
 * Admin Figma mock — partner detail at `/admin/portal-figma/partners/[partnerId]`
 * (pre-rendered for `output: 'export'`).
 */
export default function AdminPortalFigmaPartnerDetailPage({ params }: PageProps) {
  return <AdminPortalFigmaPartnerDetailScreen partnerId={params.partnerId} />;
}
