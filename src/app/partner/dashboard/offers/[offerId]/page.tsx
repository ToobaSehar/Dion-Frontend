import { PartnerOfferDetailRouteClient } from '@/components/client-portal-figma/PartnerOfferDetailRouteClient';
import { PARTNER_OFFER_DETAIL_STATIC_PARAM_IDS } from '@/lib/partner-offer-static-param-ids';

export function generateStaticParams() {
  return PARTNER_OFFER_DETAIL_STATIC_PARAM_IDS.map((offerId) => ({ offerId }));
}

type PageProps = {
  params: { offerId: string };
};

export default function PartnerOfferDetailPage({ params }: PageProps) {
  return <PartnerOfferDetailRouteClient offerId={params.offerId} />;
}
