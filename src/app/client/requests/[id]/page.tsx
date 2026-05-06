import { ClientPortalRequestDetailRouteClient } from '@/components/client-portal-figma/ClientPortalRequestDetailRouteClient';

/**
 * Required for `output: 'export'` — pre-renders `/client/requests/[id]` HTML at build time.
 */
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];
}

type PageProps = {
  params: { id: string };
};

export default function ClientRequestDetailPage({ params }: PageProps) {
  return <ClientPortalRequestDetailRouteClient requestId={params.id} />;
}