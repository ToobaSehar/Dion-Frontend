'use client';

import { useMemo, useState } from 'react';
import { ArrowDownUp, ChevronRight, Search } from 'lucide-react';

import {
  AdminPortalBookingsStatusPills,
  type AdminPortalBookingsFilterTab,
} from '@/components/client-portal-figma/AdminPortalBookingsStatusPills';
import { cn } from '@/lib/utils';

export type { AdminPortalBookingsFilterTab } from '@/components/client-portal-figma/AdminPortalBookingsStatusPills';

export type AdminPortalBookingRowStatus =
  | 'awaiting-payment'
  | 'confirmed'
  | 'checked-in'
  | 'completed'
  | 'cancelled';

export type AdminPortalBookingTableRow = {
  id: string;
  reference: string;
  bookingGroup: string | null;
  client: string;
  company: string;
  partner: string;
  property: string;
  checkIn: string;
  totalAmount: string;
  status: AdminPortalBookingRowStatus;
};

const MOCK_ROWS: AdminPortalBookingTableRow[] = [
  {
    id: 'bk-2024-0865-awaiting',
    reference: 'BK-2024-0865',
    bookingGroup: null,
    client: 'Emma Watson',
    company: 'Leeds City Partners',
    partner: 'Metro Lettings',
    property: 'Park Lane Residences',
    checkIn: '15 Mar 2024',
    totalAmount: '£9,504',
    status: 'awaiting-payment',
  },
  {
    id: 'partner-bk-0891',
    reference: 'BK-2024-0891',
    bookingGroup: null,
    client: 'James Davies',
    company: 'Acme Council',
    partner: 'City Living Ltd',
    property: 'Victoria Apartments',
    checkIn: '1 Apr 2024',
    totalAmount: '£8,856',
    status: 'checked-in',
  },
  {
    id: 'partner-bk-0887',
    reference: 'BK-2024-0887',
    bookingGroup: null,
    client: 'Sarah Mitchell',
    company: 'Northern Housing',
    partner: 'City Living Ltd',
    property: 'London Bridge Apartments',
    checkIn: '10 Apr 2024',
    totalAmount: '£7,956',
    status: 'confirmed',
  },
  {
    id: '1',
    reference: 'BK-2024-0830',
    bookingGroup: 'BG-2024-0041',
    client: 'Tom Richards',
    company: 'Midlands Corp',
    partner: 'City Living Ltd',
    property: 'Battersea Rise House',
    checkIn: '1 Feb 2024',
    totalAmount: '£7,200',
    status: 'completed',
  },
  {
    id: '2',
    reference: 'BK-2024-0827',
    bookingGroup: null,
    client: 'David Brown',
    company: 'Acme Council',
    partner: 'City Living Ltd',
    property: 'Victoria Apartments',
    checkIn: '15 Mar 2024',
    totalAmount: '£9,600',
    status: 'confirmed',
  },
  {
    id: '3',
    reference: 'BK-2024-0878',
    bookingGroup: 'BG-2024-0038',
    client: 'Tom Richards',
    company: 'Midlands Corp',
    partner: 'Urban Stay Group',
    property: 'Canal View Suites',
    checkIn: '20 Mar 2024',
    totalAmount: '£10,260',
    status: 'awaiting-payment',
  },
  {
    id: '4',
    reference: 'BK-2024-0815',
    bookingGroup: null,
    client: 'James Chen',
    company: 'TechStart Inc',
    partner: 'Metro Stays',
    property: 'Harbour Studios',
    checkIn: '10 Jan 2024',
    totalAmount: '£4,200',
    status: 'checked-in',
  },
  {
    id: '5',
    reference: 'BK-2024-0842',
    bookingGroup: 'BG-2024-0039',
    client: 'David Brown',
    company: 'Capital Relocations',
    partner: 'Aspire Apartments',
    property: 'Riverside Quarter',
    checkIn: '1 Mar 2024',
    totalAmount: '£11,340',
    status: 'checked-in',
  },
  {
    id: 'partner-bk-0756',
    reference: 'BK-2024-0756',
    bookingGroup: null,
    client: 'David Brown',
    company: 'Capital Relocations',
    partner: 'City Living Ltd',
    property: 'Victoria Apartments',
    checkIn: '1 Jan 2024',
    totalAmount: '£11,340',
    status: 'completed',
  },
  {
    id: '6',
    reference: 'BK-2024-0798',
    bookingGroup: null,
    client: 'Lisa Park',
    company: 'Logistics UK',
    partner: 'Haven Properties',
    property: 'Queens Terrace',
    checkIn: '28 Feb 2024',
    totalAmount: '£8,100',
    status: 'completed',
  },
];

function statusBadgeClass(status: AdminPortalBookingRowStatus): string {
  switch (status) {
    case 'awaiting-payment':
      return 'bg-[#FDB022] text-white';
    case 'confirmed':
      return 'bg-[#00BAB5] text-white';
    case 'checked-in':
      return 'bg-[#0B1D37] text-white';
    case 'completed':
      return 'bg-[#E9EAEB] text-[#4B4E53]';
    case 'cancelled':
      return 'bg-[#f6f6f4] text-[#F04438]';
  }
}

function statusLabel(status: AdminPortalBookingRowStatus): string {
  switch (status) {
    case 'awaiting-payment':
      return 'Awaiting Payment';
    case 'confirmed':
      return 'Confirmed';
    case 'checked-in':
      return 'Checked In';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
  }
}

export function getAdminPortalBookingMockRowById(id: string): AdminPortalBookingTableRow | undefined {
  return MOCK_ROWS.find((row) => row.id === id);
}

function rowMatchesFilter(row: AdminPortalBookingTableRow, tab: AdminPortalBookingsFilterTab): boolean {
  if (tab === 'all') return true;
  return row.status === tab;
}

function rowMatchesSearch(row: AdminPortalBookingTableRow, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.trim().toLowerCase();
  const group = row.bookingGroup ?? '';
  return (
    row.reference.toLowerCase().includes(s) ||
    group.toLowerCase().includes(s) ||
    row.client.toLowerCase().includes(s) ||
    row.company.toLowerCase().includes(s) ||
    row.partner.toLowerCase().includes(s) ||
    row.property.toLowerCase().includes(s) ||
    row.checkIn.toLowerCase().includes(s) ||
    row.totalAmount.toLowerCase().includes(s)
  );
}

export type AdminPortalBookingsViewProps = {
  className?: string;
  rows?: AdminPortalBookingTableRow[];
  /** Controlled filter — pass with `onStatusFilterChange` when the shell sets the tab (e.g. dashboard Resolve). */
  statusFilter?: AdminPortalBookingsFilterTab;
  onStatusFilterChange?: (tab: AdminPortalBookingsFilterTab) => void;
  /** When set, rows with a static detail shell open it on View (`AdminPortalBookingDetailView`). */
  onViewBooking?: (row: AdminPortalBookingTableRow) => void;
};

const thClass =
  'font-avenir-regular px-4 py-3 text-left text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680] sm:px-5';
const tdClass = 'font-avenir-regular px-4 py-3.5 text-sm leading-5 text-[#0B1D37] sm:px-5';

/**
 * Admin **Bookings** — search, status pills, and table shell (static data until API wiring).
 * Colours align with client/partner booking pills (`ClientPortalMyBookingsView`, `PartnerMyBookingsView`).
 */
export function AdminPortalBookingsView({
  className,
  rows = MOCK_ROWS,
  statusFilter: controlledFilter,
  onStatusFilterChange,
  onViewBooking,
}: AdminPortalBookingsViewProps) {
  const [internalFilter, setInternalFilter] = useState<AdminPortalBookingsFilterTab>('all');
  const isControlled = controlledFilter !== undefined && onStatusFilterChange !== undefined;
  const filter = isControlled ? controlledFilter : internalFilter;
  const setFilter = isControlled ? onStatusFilterChange : setInternalFilter;
  const [search, setSearch] = useState('');

  const visible = useMemo(() => {
    return rows.filter((r) => rowMatchesFilter(r, filter) && rowMatchesSearch(r, search));
  }, [rows, filter, search]);

  return (
    <div className={cn('flex w-full min-w-0 max-w-full flex-col px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0B1D37] sm:text-[28px] sm:leading-9">
        Bookings
      </h1>

      <div className="relative mt-6">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#717680]"
          strokeWidth={2}
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by reference, client, company, partner or property..."
          className="font-avenir-regular w-full rounded-lg border border-solid border-[#e9eaeb] bg-white py-2.5 pl-11 pr-4 text-sm leading-5 text-[#0B1D37] outline-none transition-shadow placeholder:text-[#717680] focus:border-[#00BAB5] focus:ring-2 focus:ring-[#00BAB5]/25"
          aria-label="Search bookings"
        />
      </div>

      <AdminPortalBookingsStatusPills value={filter} onChange={setFilter} className="mt-4" />

      <div className="mt-6 overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e9eaeb] bg-white">
                <th className={thClass}>Reference</th>
                <th className={thClass}>Booking group</th>
                <th className={thClass}>Client</th>
                <th className={thClass}>Company</th>
                <th className={thClass}>Partner</th>
                <th className={thClass}>Property</th>
                <th className={thClass}>
                  <span className="inline-flex items-center gap-1.5">
                    Check-in
                    <ArrowDownUp className="size-3.5 shrink-0 text-[#717680]" strokeWidth={2} aria-hidden />
                  </span>
                </th>
                <th className={thClass}>Total amount</th>
                <th className={thClass}>Status</th>
                <th className={cn(thClass, 'w-[1%] whitespace-nowrap pr-6')} aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={10} className="font-avenir-regular px-5 py-12 text-center text-sm text-[#717680]">
                    No bookings match your filters.
                  </td>
                </tr>
              ) : (
                visible.map((row) => (
                  <tr key={row.id} className="border-b border-[#e9eaeb] last:border-b-0">
                    <td className={cn(tdClass, 'font-medium')}>{row.reference}</td>
                    <td className={tdClass}>{row.bookingGroup ?? '—'}</td>
                    <td className={tdClass}>{row.client}</td>
                    <td className={tdClass}>{row.company}</td>
                    <td className={tdClass}>{row.partner}</td>
                    <td className={tdClass}>{row.property}</td>
                    <td className={tdClass}>{row.checkIn}</td>
                    <td className={tdClass}>{row.totalAmount}</td>
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
                    <td className={cn(tdClass, 'pr-6')}>
                      {(() => {
                        const hasHandler = Boolean(onViewBooking);
                        return (
                          <button
                            type="button"
                            disabled={!hasHandler}
                            onClick={() => hasHandler && onViewBooking?.(row)}
                            className={cn(
                              'font-avenir-regular inline-flex items-center gap-0.5 text-sm font-semibold transition-colors',
                              !hasHandler
                                ? 'cursor-not-allowed text-[#A4A7AE]'
                                : 'cursor-pointer text-[#00BAB5] hover:text-[#008884]',
                            )}
                          >
                            View
                            <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                          </button>
                        );
                      })()}
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
