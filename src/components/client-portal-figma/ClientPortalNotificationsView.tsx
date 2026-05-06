'use client';

import { AlertTriangle, ArrowRight, CheckCircle2, FileText } from 'lucide-react';

import { cn } from '@/lib/utils';

const INK = '#0B1D37';
const TEAL = '#00BAB5';
const ALERT_ICON = 'rgb(253, 176, 34)';
const SURFACE = '#F6F6F4';
const MUTED = '#4B4E53';

/** Thin outlined circle + check; `currentColor` drives stroke → brand ink. */
const NOTIFICATION_ICON_CLASS = 'size-[22px] shrink-0 text-[#0B1D37]';

type NotificationEntry =
  | {
      id: string;
      variant: 'unread';
      unreadLeadingIcon: 'document' | 'alert';
      message: string;
      timestamp: string;
      actionLabel?: string;
    }
  | {
      id: string;
      variant: 'read';
      message: string;
      timestamp: string;
      actionLabel?: string;
    };

const NOTIFICATIONS: NotificationEntry[] = [
  {
    id: '1',
    variant: 'unread',
    unreadLeadingIcon: 'document',
    message: 'Your shortlist for Bristol is ready — 3 properties to review.',
    timestamp: 'Today · 09:14',
    actionLabel: 'View Shortlist',
  },
  {
    id: '2',
    variant: 'unread',
    unreadLeadingIcon: 'alert',
    message: 'A payment of £2,400 is due on 15 Mar for Victoria Apartments.',
    timestamp: 'Today · 08:02',
    actionLabel: 'View Details',
  },
  {
    id: '3',
    variant: 'read',
    message: 'Your booking at Harbour View Apartments has been confirmed.',
    timestamp: 'Yesterday · 16:30',
    actionLabel: 'View Booking',
  },
  {
    id: '4',
    variant: 'read',
    message: 'Payment of £1,800 received for Station House.',
    timestamp: 'Mon 24 Feb · 11:20',
  },
];

function NotificationLeadingIcon() {
  return (
    <CheckCircle2
      className={NOTIFICATION_ICON_CLASS}
      strokeWidth={1.25}
      aria-hidden
    />
  );
}

const UNREAD_ICON_CLASS = 'size-[22px] shrink-0';

function UnreadNotificationLeadingIcon({ kind }: { kind: 'document' | 'alert' }) {
  if (kind === 'document') {
    return (
      <FileText className={UNREAD_ICON_CLASS} strokeWidth={1.25} style={{ color: TEAL }} aria-hidden />
    );
  }
  return (
    <AlertTriangle
      className={UNREAD_ICON_CLASS}
      strokeWidth={1.25}
      style={{ color: ALERT_ICON }}
      aria-hidden
    />
  );
}

function ActionLinkArrow() {
  return (
    <ArrowRight
      className="size-4 shrink-0 text-[#00BAB5]"
      strokeWidth={1.25}
      aria-hidden
    />
  );
}

export type ClientPortalNotificationsViewProps = {
  className?: string;
};

/**
 * **Notifications** — client Figma shell (static list until API wiring).
 */
export function ClientPortalNotificationsView({ className }: ClientPortalNotificationsViewProps) {
  return (
    <div className={cn('flex w-full flex-col gap-8 bg-[#F6F6F4] px-6 pb-20 pt-2 sm:px-8 sm:pb-24', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h1
            className="font-avenir-regular text-2xl font-semibold leading-8 sm:text-[30px] sm:leading-[38px]"
            style={{ color: INK }}
          >
            Notifications
          </h1>
          <p className="font-avenir-regular text-sm font-normal leading-5" style={{ color: MUTED }}>
            Your recent activity and alerts.
          </p>
        </div>
        <button
          type="button"
          className="font-avenir-regular shrink-0 self-start text-sm font-semibold leading-5 hover:opacity-90 sm:pt-1"
          style={{ color: TEAL }}
        >
          Mark all as read
        </button>
      </div>

      <ul className="flex flex-col gap-3 sm:gap-4" role="list" aria-label="Notifications">
        {NOTIFICATIONS.map((item) => {
          if (item.variant === 'unread') {
            return (
              <li
                key={item.id}
                className="overflow-hidden rounded-xl border border-[#e9eaeb] border-l-4 border-l-[#00BAB5] bg-white shadow-[0px_1px_3px_rgba(10,13,18,0.08)]"
              >
                <div className="flex min-w-0 flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5">
                  <div className="flex min-w-0 flex-1 items-start gap-4 sm:items-center">
                    <div
                      className="flex size-11 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: SURFACE }}
                    >
                      <UnreadNotificationLeadingIcon kind={item.unreadLeadingIcon} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-avenir-regular text-base font-semibold leading-6" style={{ color: INK }}>
                        {item.message}
                      </p>
                      <p className="font-avenir-regular mt-1 text-sm font-normal leading-5" style={{ color: MUTED }}>
                        {item.timestamp}
                      </p>
                    </div>
                  </div>
                  {item.actionLabel ? (
                    <button
                      type="button"
                      className="font-avenir-regular inline-flex shrink-0 items-center gap-1.5 self-end text-sm font-semibold leading-5 hover:opacity-90 sm:self-center"
                      style={{ color: TEAL }}
                    >
                      {item.actionLabel}
                      <ActionLinkArrow />
                    </button>
                  ) : null}
                </div>
              </li>
            );
          }

          return (
            <li
              key={item.id}
              className="flex flex-col gap-4 py-1 pl-5 pr-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:py-2 sm:pl-6 sm:pr-5"
            >
              <div className="flex min-w-0 flex-1 items-start gap-4 sm:items-center">
                <div className="flex size-11 shrink-0 items-center justify-center">
                  <NotificationLeadingIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-avenir-regular text-base font-normal leading-6" style={{ color: MUTED }}>
                    {item.message}
                  </p>
                  <p className="font-avenir-regular mt-1 text-sm font-normal leading-5" style={{ color: MUTED }}>
                    {item.timestamp}
                  </p>
                </div>
              </div>
              {item.actionLabel ? (
                <button
                  type="button"
                  className="font-avenir-regular inline-flex shrink-0 items-center gap-1.5 self-end text-sm font-semibold leading-5 hover:opacity-90 sm:self-center"
                  style={{ color: TEAL }}
                >
                  {item.actionLabel}
                  <ActionLinkArrow />
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
