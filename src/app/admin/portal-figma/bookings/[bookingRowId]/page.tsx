import { AdminPortalFigmaBookingDetailScreen } from '@/components/client-portal-figma/AdminPortalFigmaBookingDetailScreen';
import { ADMIN_PORTAL_BOOKING_STATIC_PARAM_IDS } from '@/lib/admin-portal-booking-static-param-ids';

export function generateStaticParams() {
  return ADMIN_PORTAL_BOOKING_STATIC_PARAM_IDS.map((bookingRowId) => ({ bookingRowId }));
}

type PageProps = {
  params: { bookingRowId: string };
};

/**
 * Admin Figma mock — booking detail at `/admin/portal-figma/bookings/[bookingRowId]`
 * (dedicated route like partner `/payouts/[payoutRowId]`; pre-rendered for `output: 'export'`).
 */
export default function AdminPortalFigmaBookingDetailPage({ params }: PageProps) {
  return <AdminPortalFigmaBookingDetailScreen bookingRowId={params.bookingRowId} />;
}
