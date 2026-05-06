import { ClientPortalBookingDetailRouteClient } from '@/components/client-portal-figma/ClientPortalBookingDetailRouteClient';

/**
 * Required for `output: 'export'` — pre-renders `/client/bookings/[id]` HTML at build time.
 */
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
}

type PageProps = {
  params: { id: string };
};

export default function ClientBookingDetailPage({ params }: PageProps) {
  return <ClientPortalBookingDetailRouteClient bookingId={params.id} />;
}
