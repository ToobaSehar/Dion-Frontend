'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';

import {
  AdminPortalPaymentsStatusPills,
  type AdminPortalPaymentsFilterTab,
} from '@/components/client-portal-figma/AdminPortalPaymentsStatusPills';
import { BookingHubPrimaryButton, BookingHubSecondaryButton } from '@/components/booking-hub-button';
import { cn } from '@/lib/utils';

export type { AdminPortalPaymentsFilterTab } from '@/components/client-portal-figma/AdminPortalPaymentsStatusPills';

export type AdminPortalPaymentRowStatus = 'pending' | 'paid' | 'failed' | 'overdue' | 'refunded';

export type AdminPortalPaymentMethod = 'Card' | 'Bank Transfer';

export type AdminPortalPaymentTableRow = {
  id: string;
  bookingRef: string;
  client: string;
  company: string;
  property: string;
  totalAmount: string;
  method: AdminPortalPaymentMethod;
  status: AdminPortalPaymentRowStatus;
  dueDate: string;
};

const MOCK_ROWS: AdminPortalPaymentTableRow[] = [
  /** Dummy bank-transfer awaiting receipt confirmation — visible when filtering Pending from dashboard Action required. */
  {
    id: 'bank-transfer-unconfirmed-demo',
    bookingRef: 'BK-2026-0198',
    client: 'Rachel Owen',
    company: 'Acme Council',
    property: 'Dockside House – Manchester',
    totalAmount: '£3,840',
    method: 'Bank Transfer',
    status: 'pending',
    dueDate: '22 Apr 2026',
  },
  {
    id: '1',
    bookingRef: 'BK-2024-0891',
    client: 'Sarah Mitchell',
    company: 'Acme Council',
    property: 'Station House',
    totalAmount: '£7,200',
    method: 'Card',
    status: 'paid',
    dueDate: '25 Mar 2024',
  },
  {
    id: '2',
    bookingRef: 'BK-2024-0887',
    client: 'David Brown',
    company: 'Northern Housing',
    property: 'Victoria Apartments',
    totalAmount: '£9,600',
    method: 'Bank Transfer',
    status: 'overdue',
    dueDate: '18 Mar 2024',
  },
  {
    id: '3',
    bookingRef: 'BK-2024-0884',
    client: 'James Chen',
    company: 'BuildCo Ltd',
    property: 'Riverside Court',
    totalAmount: '£5,320',
    method: 'Card',
    status: 'pending',
    dueDate: '28 Mar 2024',
  },
  {
    id: '4',
    bookingRef: 'BK-2024-0879',
    client: 'Emma Wilson',
    company: 'TechStart Inc',
    property: 'Harbour Studios',
    totalAmount: '£4,200',
    method: 'Card',
    status: 'failed',
    dueDate: '12 Mar 2024',
  },
  {
    id: '5',
    bookingRef: 'BK-2024-0872',
    client: 'Anna Williams',
    company: 'Retail Group',
    property: 'Canal View Suites',
    totalAmount: '£3,200',
    method: 'Bank Transfer',
    status: 'paid',
    dueDate: '1 Feb 2024',
  },
  {
    id: '6',
    bookingRef: 'BK-2024-0865',
    client: 'Lisa Park',
    company: 'Logistics UK',
    property: 'Queens Terrace',
    totalAmount: '£8,100',
    method: 'Card',
    status: 'refunded',
    dueDate: '22 Jan 2024',
  },
  {
    id: '7',
    bookingRef: 'BK-2024-0858',
    client: 'Tom Harris',
    company: 'Energy Co',
    property: 'Metro Lofts',
    totalAmount: '£2,450',
    method: 'Card',
    status: 'pending',
    dueDate: '5 Apr 2024',
  },
];

function statusBadgeClass(status: AdminPortalPaymentRowStatus): string {
  switch (status) {
    case 'paid':
      return 'bg-[#00BAB5] text-white';
    case 'pending':
      return 'bg-[#E8A23E] text-white';
    case 'overdue':
      return 'bg-[#F04438] text-white';
    case 'failed':
      return 'bg-[#F04438] text-white';
    case 'refunded':
      return 'bg-[#E9EAEB] text-[#4B4E53]';
  }
}

function statusLabel(status: AdminPortalPaymentRowStatus): string {
  switch (status) {
    case 'paid':
      return 'Paid';
    case 'pending':
      return 'Pending';
    case 'overdue':
      return 'Overdue';
    case 'failed':
      return 'Failed';
    case 'refunded':
      return 'Refunded';
  }
}

function rowSurfaceClass(status: AdminPortalPaymentRowStatus): string {
  switch (status) {
    case 'overdue':
      return 'bg-[#FEF3F2]';
    case 'failed':
      return 'bg-[#F0F9FF]';
    default:
      return 'bg-white';
  }
}

function rowMatchesFilter(row: AdminPortalPaymentTableRow, tab: AdminPortalPaymentsFilterTab): boolean {
  if (tab === 'all') return true;
  return row.status === tab;
}

export type AdminPortalPaymentsViewProps = {
  className?: string;
  rows?: AdminPortalPaymentTableRow[];
  /** Controlled filter — pass with `onStatusFilterChange` when the shell sets the tab (e.g. dashboard Confirm). */
  statusFilter?: AdminPortalPaymentsFilterTab;
  onStatusFilterChange?: (tab: AdminPortalPaymentsFilterTab) => void;
  /** Opens the booking for this payment row in the Bookings shell (`AdminPortalBookingDetailView`). */
  onViewPayment?: (row: AdminPortalPaymentTableRow) => void;
};

const thClass =
  'font-avenir-regular px-4 py-3 text-left text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680] sm:px-5';
const tdClass = 'font-avenir-regular px-4 py-3.5 text-sm leading-5 text-[#0B1D37] sm:px-5';

const paymentsTableCompactBtnClass = cn(
  'shrink-0 !min-w-0 w-fit min-h-[30px] !gap-1 !px-2 !py-1',
  '[&_span.relative.inline-flex]:text-xs [&_span.relative.inline-flex]:leading-[18px]',
  '[&_span.inline-flex.size-5]:!size-4 [&_span.inline-flex.size-5_svg]:!size-4',
);

function PaymentRowActionsBar({
  status,
  isConfirmReceiptOpen = false,
  onOpenConfirmReceipt = () => {},
  onCancelConfirmReceipt = () => {},
  onFinalConfirmReceipt = () => {},
  onViewPayment,
}: {
  status: AdminPortalPaymentRowStatus;
  isConfirmReceiptOpen?: boolean;
  onOpenConfirmReceipt?: () => void;
  onCancelConfirmReceipt?: () => void;
  onFinalConfirmReceipt?: () => void;
  onViewPayment?: () => void;
}) {
  const hasView = Boolean(onViewPayment);
  const viewBtn = (
    <button
      type="button"
      disabled={!hasView}
      onClick={() => hasView && onViewPayment?.()}
      className={cn(
        'font-avenir-regular inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold transition-colors',
        hasView
          ? 'cursor-pointer text-[#00BAB5] hover:text-[#008884]'
          : 'cursor-not-allowed text-[#A4A7AE]',
      )}
    >
      View
      <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
    </button>
  );

  if (status === 'overdue') {
    if (isConfirmReceiptOpen) {
      return (
        <div className="flex w-full min-w-0 items-start justify-between gap-4">
          <div className="min-w-0 flex-1" role="region" aria-label="Confirm receipt">
            <div className="flex gap-2">
              <AlertTriangle
                className="mt-0.5 size-5 shrink-0 text-[#F79009]"
                strokeWidth={2}
                aria-hidden
              />
              <p className="font-avenir-regular text-sm leading-5 text-[#0B1D37]">
                Confirm payment received? This will mark the payment as paid and trigger booking confirmation.
              </p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <BookingHubPrimaryButton
                type="button"
                size="sm"
                className={paymentsTableCompactBtnClass}
                onClick={onFinalConfirmReceipt}
              >
                Confirm Receipt
              </BookingHubPrimaryButton>
              <button
                type="button"
                onClick={onCancelConfirmReceipt}
                className="font-avenir-regular text-sm font-semibold text-[#717680] transition-colors hover:text-[#0B1D37]"
              >
                Cancel
              </button>
            </div>
          </div>
          {viewBtn}
        </div>
      );
    }

    return (
      <div className="flex w-full min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 flex-nowrap items-center gap-2">
          <BookingHubSecondaryButton
            type="button"
            size="sm"
            className={paymentsTableCompactBtnClass}
            iconTrailing={<ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />}
          >
            Contact Client
          </BookingHubSecondaryButton>
          <BookingHubPrimaryButton
            type="button"
            size="sm"
            className={paymentsTableCompactBtnClass}
            iconTrailing={<ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />}
            onClick={onOpenConfirmReceipt}
          >
            Confirm Receipt
          </BookingHubPrimaryButton>
        </div>
        {viewBtn}
      </div>
    );
  }
  if (status === 'failed') {
    return (
      <div className="flex w-full min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 flex-nowrap items-center gap-2">
          <BookingHubPrimaryButton
            type="button"
            size="sm"
            className={paymentsTableCompactBtnClass}
            iconTrailing={<ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />}
          >
            Retry Payment
          </BookingHubPrimaryButton>
          <BookingHubSecondaryButton
            type="button"
            size="sm"
            className={paymentsTableCompactBtnClass}
            iconTrailing={<ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />}
          >
            Contact Client
          </BookingHubSecondaryButton>
        </div>
        {viewBtn}
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 items-center justify-end">
      {viewBtn}
    </div>
  );
}

/**
 * Admin **Payments** — status filters, row tinting for operational states, and dense table (static data until API wiring).
 * Teal / amber / ink tokens align with existing portal tables (`AdminPortalBookingsView`, `PartnerPortalPayoutsView`).
 */
export function AdminPortalPaymentsView({
  className,
  rows = MOCK_ROWS,
  statusFilter: controlledFilter,
  onStatusFilterChange,
  onViewPayment,
}: AdminPortalPaymentsViewProps) {
  const [internalFilter, setInternalFilter] = useState<AdminPortalPaymentsFilterTab>('all');
  const isControlled = controlledFilter !== undefined && onStatusFilterChange !== undefined;
  const filter = isControlled ? controlledFilter : internalFilter;
  const setFilter = isControlled ? onStatusFilterChange : setInternalFilter;
  const [confirmReceiptRowId, setConfirmReceiptRowId] = useState<string | null>(null);

  useEffect(() => {
    setConfirmReceiptRowId(null);
  }, [filter]);

  const visible = useMemo(() => rows.filter((r) => rowMatchesFilter(r, filter)), [rows, filter]);

  return (
    <div className={cn('flex w-full min-w-0 max-w-full flex-col px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0B1D37] sm:text-[28px] sm:leading-9">
        Payments
      </h1>

      <AdminPortalPaymentsStatusPills value={filter} onChange={setFilter} className="mt-6" />

      <div className="mt-6 overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1020px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e9eaeb] bg-white">
                <th className={thClass}>Booking ref</th>
                <th className={thClass}>Client</th>
                <th className={thClass}>Company</th>
                <th className={thClass}>Property</th>
                <th className={thClass}>Total amount</th>
                <th className={thClass}>Method</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Due date</th>
                <th className={cn(thClass, 'min-w-[220px] pr-6')} colSpan={2}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={10} className="font-avenir-regular px-5 py-12 text-center text-sm text-[#717680]">
                    No payments match your filters.
                  </td>
                </tr>
              ) : (
                visible.map((row) => (
                  <tr
                    key={row.id}
                    className={cn('border-b border-[#e9eaeb] last:border-b-0', rowSurfaceClass(row.status))}
                  >
                    <td className={cn(tdClass, 'font-medium')}>{row.bookingRef}</td>
                    <td className={tdClass}>{row.client}</td>
                    <td className={tdClass}>{row.company}</td>
                    <td className={tdClass}>{row.property}</td>
                    <td className={tdClass}>{row.totalAmount}</td>
                    <td className={tdClass}>{row.method}</td>
                    <td className={tdClass}>
                      <span
                        className={cn(
                          'font-avenir-regular inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                          statusBadgeClass(row.status),
                        )}
                      >
                        {statusLabel(row.status)}
                      </span>
                    </td>
                    <td className={tdClass}>{row.dueDate}</td>
                    <td className={cn(tdClass, 'min-w-0 pr-6')} colSpan={2}>
                      <PaymentRowActionsBar
                        status={row.status}
                        isConfirmReceiptOpen={confirmReceiptRowId === row.id}
                        onOpenConfirmReceipt={() => setConfirmReceiptRowId(row.id)}
                        onCancelConfirmReceipt={() => setConfirmReceiptRowId(null)}
                        onFinalConfirmReceipt={() => setConfirmReceiptRowId(null)}
                        onViewPayment={onViewPayment ? () => onViewPayment(row) : undefined}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
