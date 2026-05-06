import { PartnerBookingDetailRouteClient } from '@/components/client-portal-figma/PartnerBookingDetailRouteClient';

/** Static export — pre-render booking detail shells for seeded row ids (`partnerBookingData`). */
export function generateStaticParams() {
  return [{ bookingRowId: '1' }, { bookingRowId: '2' }, { bookingRowId: '3' }, { bookingRowId: '4' }, { bookingRowId: '5' }];
}

type PageProps = {
  params: { bookingRowId: string };
};

export default function PartnerBookingDetailPage({ params }: PageProps) {
  return <PartnerBookingDetailRouteClient bookingRowId={params.bookingRowId} />;
}
