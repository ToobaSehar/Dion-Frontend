import { ClientPortalRequestConfirmRouteClient } from '@/components/client-portal-figma/ClientPortalRequestConfirmRouteClient';

/** Required for `output: 'export'` with dynamic `[id]`. */
export function generateStaticParams() {
  return [{ id: '1' }];
}

type PageProps = {
  params: { id: string };
};

export default function ClientRequestConfirmPage({ params }: PageProps) {
  return <ClientPortalRequestConfirmRouteClient requestId={params.id} />;
}
