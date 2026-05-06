'use client';

import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import { PORTAL_DASHBOARD_SECTION_HEADING_CLASS } from '@/components/client-portal-figma/portalDashboardSectionHeading';
import {
  PORTAL_ALERT_DOT_CRITICAL_CLASS,
  PORTAL_ALERT_DOT_WARNING_CLASS,
} from '@/components/client-portal-figma/portalAlertListTokens';
import { cn } from '@/lib/utils';

const INK = '#0B1D37';
const MUTED = '#4B4E53';

type Priority = 'high' | 'medium';

export type AdminPortalActionRow = {
  id: string;
  priority: Priority;
  title: string;
  description: string;
  count: number;
  ctaLabel: string;
};

const DEFAULT_ROWS: AdminPortalActionRow[] = [
  {
    id: 'new-requests',
    priority: 'high',
    title: 'New requests',
    description: 'Shortlist not yet built',
    count: 3,
    ctaLabel: 'Review',
  },
  {
    id: 'partner-cancellations',
    priority: 'high',
    title: 'Partner cancellations',
    description: 'Bookings at risk',
    count: 1,
    ctaLabel: 'Resolve',
  },
  {
    id: 'check-in-missing',
    priority: 'high',
    title: 'Check-in instructions missing',
    description: 'Check-in within 48 hours',
    count: 2,
    ctaLabel: 'Chase',
  },
  {
    id: 'shortlists-publish',
    priority: 'medium',
    title: 'Shortlists ready to publish',
    description: 'Offers reviewed – awaiting publish',
    count: 2,
    ctaLabel: 'Publish',
  },
  {
    id: 'payments-overdue',
    priority: 'medium',
    title: 'Payments overdue',
    description: 'Client payment not received',
    count: 1,
    ctaLabel: 'View',
  },
  {
    id: 'payouts-failed',
    priority: 'medium',
    title: 'Payouts failed',
    description: 'Partner payout attempt failed',
    count: 1,
    ctaLabel: 'View',
  },
  {
    id: 'bank-unconfirmed',
    priority: 'medium',
    title: 'Bank transfers unconfirmed',
    description: 'Receipt not yet confirmed',
    count: 2,
    ctaLabel: 'Confirm',
  },
];

export type AdminPortalActionRequiredSectionProps = {
  className?: string;
  rows?: AdminPortalActionRow[];
  /** Opens Requests with the “New” filter (dashboard first row — New requests → Review). */
  onNewRequestsReview?: () => void;
  /** Opens Bookings with the “Cancelled” filter (Partner cancellations → Resolve). */
  onPartnerCancellationsResolve?: () => void;
  /** Opens Payments with the “Pending” filter (Bank transfers unconfirmed → Confirm). */
  onBankTransfersUnconfirmedConfirm?: () => void;
};

/**
 * Admin dashboard **Action required** queue — static presentation shell (counts per design reference).
 */
export function AdminPortalActionRequiredSection({
  className,
  rows = DEFAULT_ROWS,
  onNewRequestsReview,
  onPartnerCancellationsResolve,
  onBankTransfersUnconfirmedConfirm,
}: AdminPortalActionRequiredSectionProps) {
  return (
    <section className={cn('w-full min-w-0 max-w-full', className)} aria-labelledby="admin-action-required-heading">
      <h2 id="admin-action-required-heading" className={PORTAL_DASHBOARD_SECTION_HEADING_CLASS}>
        Action required
      </h2>

      <div
        className="overflow-hidden rounded-xl border border-solid bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]"
        style={{ borderColor: '#e9eaeb' }}
      >
        <ul className="divide-y divide-[#e9eaeb]">
          {rows.map((row) => (
            <li
              key={row.id}
              className="font-avenir-regular flex w-full min-w-0 items-center justify-between gap-6 px-5 py-4 sm:gap-8 sm:px-8 sm:py-5 lg:px-10"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                <span
                  className={cn(
                    'mt-1.5 size-2 shrink-0 rounded-full',
                    row.priority === 'high' ? PORTAL_ALERT_DOT_CRITICAL_CLASS : PORTAL_ALERT_DOT_WARNING_CLASS,
                  )}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold leading-snug sm:text-base" style={{ color: INK }}>
                    {row.title}
                  </p>
                  <p className="mt-0.5 text-[13px] font-normal leading-5 sm:text-sm" style={{ color: MUTED }}>
                    {row.description}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-4 sm:gap-6">
                <span
                  className="tabular-nums text-[15px] font-semibold sm:text-base"
                  style={{ color: INK }}
                  aria-label={`${row.count} items`}
                >
                  {row.count}
                </span>
                <BookingHubPrimaryButton
                  type="button"
                  size="sm"
                  className="min-w-[7.25rem] shrink-0 sm:min-w-[7.75rem]"
                  iconTrailing={<span aria-hidden className="text-base font-normal leading-none">→</span>}
                  onClick={
                    row.id === 'new-requests'
                      ? onNewRequestsReview
                      : row.id === 'partner-cancellations'
                        ? onPartnerCancellationsResolve
                        : row.id === 'bank-unconfirmed'
                          ? onBankTransfersUnconfirmedConfirm
                          : undefined
                  }
                >
                  {row.ctaLabel}
                </BookingHubPrimaryButton>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
