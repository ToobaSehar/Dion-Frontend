import { ClientPortalRequestAmendmentRouteClient } from '@/components/client-portal-figma/ClientPortalRequestAmendmentRouteClient';



/**

 * Required for `output: 'export'` — pre-renders `/client/requests/[id]/amendment` HTML at build time.

 */

export function generateStaticParams() {

  return [{ id: '1' }];

}



type PageProps = {

  params: { id: string };

};



export default function ClientRequestAmendmentPage({ params }: PageProps) {

  return <ClientPortalRequestAmendmentRouteClient requestId={params.id} />;

}


