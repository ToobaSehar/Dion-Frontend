'use client';

import { AdminPortalActionRequiredSection } from '@/components/client-portal-figma/AdminPortalActionRequiredSection';
import { AdminPortalDashboardBusinessMetricsSection } from '@/components/client-portal-figma/AdminPortalDashboardBusinessMetricsSection';
import { cn } from '@/lib/utils';

export type AdminPortalDashboardHomeViewProps = {
  className?: string;
  onNewRequestsReview?: () => void;
  onPartnerCancellationsResolve?: () => void;
  onBankTransfersUnconfirmedConfirm?: () => void;
};

export function AdminPortalDashboardHomeView({
  className,
  onNewRequestsReview,
  onPartnerCancellationsResolve,
  onBankTransfersUnconfirmedConfirm,
}: AdminPortalDashboardHomeViewProps) {
  return (
    <div className={cn('flex w-full min-w-0 max-w-full flex-col gap-10 px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0B1D37] sm:text-[28px] sm:leading-9">
        Dashboard
      </h1>
      <div className="flex flex-col gap-10">
        <AdminPortalActionRequiredSection
          onNewRequestsReview={onNewRequestsReview}
          onPartnerCancellationsResolve={onPartnerCancellationsResolve}
          onBankTransfersUnconfirmedConfirm={onBankTransfersUnconfirmedConfirm}
        />
        <AdminPortalDashboardBusinessMetricsSection />
      </div>
    </div>
  );
}
