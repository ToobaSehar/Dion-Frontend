'use client';



import { useCallback } from 'react';



import { useRouter } from 'next/navigation';



import type { ClientPortalFigmaMainView } from '@/components/client-portal-figma/clientPortalFigmaMainView';

import { DEFAULT_CLIENT_PORTAL_REQUEST_DETAIL } from '@/components/client-portal-figma/ClientPortalRequestDetailView';

import { ClientPortalFigmaDashboard } from '@/components/client-portal-figma/ClientPortalFigmaDashboard';

import { ClientPortalSidebar } from '@/components/client-portal-figma/ClientPortalSidebar';

import { cn } from '@/lib/utils';



const CLIENT_PORTAL_HUB_PATH = '/client' as const;



export type ClientPortalRequestAmendmentRouteClientProps = {

  className?: string;

  requestId: string;

};



/**

 * Client portal shell for **request amendment** at `/client/requests/[id]/amendment`

 * (opened from request-detail Confirm Selection when shortlist is chosen).

 */

export function ClientPortalRequestAmendmentRouteClient({

  className,

  requestId,

}: ClientPortalRequestAmendmentRouteClientProps) {

  const router = useRouter();



  const goToPortalHub = useCallback(() => {

    router.push(CLIENT_PORTAL_HUB_PATH);

  }, [router]);



  const handleMainViewChange = useCallback(

    (_view: ClientPortalFigmaMainView) => {

      goToPortalHub();

    },

    [goToPortalHub],

  );



  const handleAmendmentBack = useCallback(() => {

    router.push(`/client/requests/${encodeURIComponent(requestId)}`);

  }, [router, requestId]);



  const amendmentCopy = {

    propertyTitle: DEFAULT_CLIENT_PORTAL_REQUEST_DETAIL.locationTitle,

    referenceCode: `BH-${requestId}`,

  };



  return (

    <div

      className={cn(

        'font-avenir-regular flex h-svh min-h-0 w-full overflow-hidden bg-white text-[#0b1d37]',

        className,

      )}

    >

      <ClientPortalSidebar activeMainView="request-amendment" onMainViewChange={handleMainViewChange} />

      <ClientPortalFigmaDashboard

        activeMainView="request-amendment"

        onMainViewChange={handleMainViewChange}

        onRequestAmendmentBack={handleAmendmentBack}

        requestAmendmentContent={amendmentCopy}

      />

    </div>

  );

}


