'use client';

import { ChevronRight } from 'lucide-react';

import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import {
  PORTAL_ALERT_DOT_CRITICAL_CLASS,
  PORTAL_ALERT_DOT_WARNING_CLASS,
} from '@/components/client-portal-figma/portalAlertListTokens';
import { cn } from '@/lib/utils';

const INK = '#0B1D37';
const MUTED = '#4B4E53';
const SUBTLE = '#717680';

export type AdminPortalAlertPriority = 'critical' | 'warning';

export type AdminPortalAlertRowProps = {
  /** Critical → red dot (`#F04438`); warning → amber (`#E8A23E`) — same as action-required / partner lists. */
  priority: AdminPortalAlertPriority;
  title: string;
  subtitle: string;
  timeLabel: string;
  primaryActionLabel: string;
  onPrimaryAction?: () => void;
  resolveLabel?: string;
  onResolve?: () => void;
  className?: string;
};

/**
 * Single alert row — reusable list cell for admin Alerts (and similar operational queues).
 * Layout: priority dot + copy (left), timestamp + primary CTA + resolve link (right).
 */
export function AdminPortalAlertRow({
  priority,
  title,
  subtitle,
  timeLabel,
  primaryActionLabel,
  onPrimaryAction,
  resolveLabel = 'Mark as resolved',
  onResolve,
  className,
}: AdminPortalAlertRowProps) {
  return (
    <li
      className={cn(
        'font-avenir-regular flex w-full min-w-0 flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-5 lg:px-10',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
        <span
          className={cn(
            'mt-1.5 size-2 shrink-0 rounded-full',
            priority === 'critical' ? PORTAL_ALERT_DOT_CRITICAL_CLASS : PORTAL_ALERT_DOT_WARNING_CLASS,
          )}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-snug sm:text-base" style={{ color: INK }}>
            {title}
          </p>
          <p className="mt-0.5 text-[13px] font-normal leading-5 sm:text-sm" style={{ color: MUTED }}>
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
        <p className="font-avenir-regular whitespace-nowrap text-[13px] font-normal leading-5 sm:text-sm" style={{ color: SUBTLE }}>
          {timeLabel}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <BookingHubPrimaryButton
            type="button"
            size="sm"
            className="min-w-0 shrink-0 sm:min-w-[9rem]"
            onClick={onPrimaryAction}
            iconTrailing={<ChevronRight className="size-4" strokeWidth={2} aria-hidden />}
          >
            {primaryActionLabel}
          </BookingHubPrimaryButton>
          <button
            type="button"
            onClick={onResolve}
            className="font-avenir-regular text-left text-sm font-normal leading-5 text-[#717680] underline decoration-[#717680] underline-offset-2 transition-colors hover:text-[#0B1D37] hover:decoration-[#0B1D37] sm:text-right"
          >
            {resolveLabel}
          </button>
        </div>
      </div>
    </li>
  );
}
