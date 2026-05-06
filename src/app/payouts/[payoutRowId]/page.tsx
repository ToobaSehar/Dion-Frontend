import { PartnerPayoutBreakdownRouteClient } from '@/components/client-portal-figma/PartnerPayoutBreakdownRouteClient';

/** Static export — matches seeded payout row ids with breakdown (`partnerPayoutBreakdownData`). */
export function generateStaticParams() {
  return [
    { payoutRowId: '2' },
    { payoutRowId: '3' },
    { payoutRowId: '4' },
    { payoutRowId: '5' },
  ];
}

type PageProps = {
  params: { payoutRowId: string };
};

export default function PartnerPayoutBreakdownPage({ params }: PageProps) {
  return <PartnerPayoutBreakdownRouteClient payoutRowId={params.payoutRowId} />;
}
