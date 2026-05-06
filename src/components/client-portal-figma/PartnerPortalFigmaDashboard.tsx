'use client';

import { useEffect, useRef, type ComponentProps } from 'react';

import { useRouter } from 'next/navigation';

import AddPropertyModal from '@/components/AddPropertyModal';
import type { PartnerPortalFigmaMainView } from '@/components/client-portal-figma/partnerPortalFigmaMainView';
import { ClientPortalMainTopBar } from '@/components/client-portal-figma/ClientPortalMainTopBar';
import { ClientPortalNotificationsView } from '@/components/client-portal-figma/ClientPortalNotificationsView';
import { ClientPortalSettingsView } from '@/components/client-portal-figma/ClientPortalSettingsView';
import { PartnerPortalDashboardHomeView } from '@/components/client-portal-figma/PartnerPortalDashboardHomeView';
import { partnerPayoutBreakdownHref } from '@/components/client-portal-figma/partnerPayoutBreakdownData';
import { PartnerPortalPayoutsView } from '@/components/client-portal-figma/PartnerPortalPayoutsView';
import { PartnerMyBookingsView } from '@/components/client-portal-figma/PartnerMyBookingsView';
import { PartnerMyOffersView } from '@/components/client-portal-figma/PartnerMyOffersView';
import { PartnerMyPropertiesView } from '@/components/client-portal-figma/PartnerMyPropertiesView';
import { PartnerRequestsInMyAreaView } from '@/components/client-portal-figma/PartnerRequestsInMyAreaView';
import { cn } from '@/lib/utils';

export type PartnerPortalFigmaDashboardProps = {
  className?: string;
  activeMainView: PartnerPortalFigmaMainView;
  userInitials: string;
  firstName: string;
  onAddProperty: () => void;
  onViewRequest: () => void;
  onAddNow: () => void;
  onCompleteProfile: () => void;
  listPropertyOpen: boolean;
  onCloseListProperty: () => void;
  onSubmitListProperty: (data: unknown) => void | Promise<void>;
  addPropertyInitialManual?: ComponentProps<typeof AddPropertyModal>['initialManualListing'];
  onEditPartnerProperty?: () => void;
  /** Called when the top-bar toggle button is pressed. */
  onToggleSidebar?: () => void;
};

export function PartnerPortalFigmaDashboard({
  className,
  activeMainView,
  userInitials,
  firstName,
  onAddProperty,
  onViewRequest,
  onAddNow,
  onCompleteProfile,
  listPropertyOpen,
  onCloseListProperty,
  onSubmitListProperty,
  addPropertyInitialManual = null,
  onEditPartnerProperty,
  onToggleSidebar,
}: PartnerPortalFigmaDashboardProps) {
  const router = useRouter();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (el) el.scrollTop = 0;
  }, [activeMainView, listPropertyOpen]);

  return (
    <main
      ref={mainRef}
      className={cn(
        'flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-auto bg-[#F6F6F4]',
        'pb-20 sm:pb-24',
        className,
      )}
    >
      <header className="sticky top-0 z-20 shrink-0 border-b border-[#e9eaeb] bg-white shadow-[0px_1px_0px_rgba(10,13,18,0.04)]">
        <ClientPortalMainTopBar userInitials={userInitials} onToggleSidebar={onToggleSidebar} />
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-10 pt-6">
        {listPropertyOpen ? (
          <div className="flex min-h-0 w-full flex-1 flex-col px-6 pb-16 sm:px-8 lg:px-10">
            <AddPropertyModal
              variant="inline"
              isOpen={listPropertyOpen}
              onClose={onCloseListProperty}
              initialManualListing={addPropertyInitialManual}
              onSubmit={
                onSubmitListProperty as NonNullable<ComponentProps<typeof AddPropertyModal>['onSubmit']>
              }
            />
          </div>
        ) : (
          <>
            {activeMainView === 'requests-in-my-area' ? (
              <PartnerRequestsInMyAreaView />
            ) : activeMainView === 'my-offers' ? (
              <PartnerMyOffersView />
            ) : activeMainView === 'my-bookings' ? (
              <PartnerMyBookingsView />
            ) : activeMainView === 'my-properties' ? (
              <PartnerMyPropertiesView onAddProperty={onAddProperty} onEditProperty={onEditPartnerProperty} />
            ) : activeMainView === 'payouts' ? (
              <PartnerPortalPayoutsView
                onPayoutBreakdownNavigate={(payoutRowId) => router.push(partnerPayoutBreakdownHref(payoutRowId))}
              />
            ) : activeMainView === 'dashboard' ? (
              <PartnerPortalDashboardHomeView
                firstName={firstName}
                onAddProperty={onAddProperty}
                onViewRequest={onViewRequest}
                onAddNow={onAddNow}
                onCompleteProfile={onCompleteProfile}
              />
            ) : null}
            {activeMainView === 'notifications' ? <ClientPortalNotificationsView /> : null}
            {activeMainView === 'settings' ? <ClientPortalSettingsView variant="partner" /> : null}
          </>
        )}
      </div>
    </main>
  );
}
