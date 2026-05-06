import { PartnerSubmitOfferRouteClient } from '@/components/client-portal-figma/PartnerSubmitOfferRouteClient';

/** Required for `output: 'export'` — pre-renders submit-offer HTML at build time (matches static area requests). */
export function generateStaticParams() {
  return [{ requestId: '1' }, { requestId: '2' }, { requestId: '3' }, { requestId: '4' }];
}

type PageProps = {
  params: { requestId: string };
};

export default function PartnerSubmitOfferPage({ params }: PageProps) {
  return <PartnerSubmitOfferRouteClient requestId={params.requestId} />;
}
