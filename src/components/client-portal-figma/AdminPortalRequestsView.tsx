'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';

import {
  AdminPortalRequestsStatusPills,
  type AdminPortalRequestsFilterTab,
} from '@/components/client-portal-figma/AdminPortalRequestsStatusPills';
import { cn } from '@/lib/utils';

export type { AdminPortalRequestsFilterTab } from '@/components/client-portal-figma/AdminPortalRequestsStatusPills';

export type AdminPortalRequestRowStatus =
  | 'new'
  | 'in-progress'
  | 'shortlisted'
  | 'confirmed'
  | 'cancelled'
  | 'expired';

export type AdminPortalRequestTableRow = {
  id: string;
  reference: string;
  client: string;
  company: string;
  location: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  budgetExcVat: string;
  status: AdminPortalRequestRowStatus;
  offers: string;
};

const MOCK_ROWS: AdminPortalRequestTableRow[] = [
  /** Rich demo detail for this reference (`DETAIL_BY_REFERENCE`); dummy URL id `99` for static export / dev. */
  {
    id: '99',
    reference: 'RQ-2024-0156',
    client: 'James Davies',
    company: 'Acme Council',
    location: 'Bristol',
    checkIn: '15 Apr 2024',
    checkOut: '15 Jul 2024',
    nights: 91,
    guests: 2,
    budgetExcVat: '£85',
    status: 'new',
    offers: '6',
  },
  {
    id: '9',
    reference: 'RQ-2024-0155',
    client: 'James Davies',
    company: 'Acme Council',
    location: 'Manchester',
    checkIn: '1 Apr 2024',
    checkOut: '30 Jun 2024',
    nights: 91,
    guests: 1,
    budgetExcVat: '£88',
    status: 'in-progress',
    offers: '2',
  },
  {
    id: '1',
    reference: 'BR-2024-0891',
    client: 'Sarah Mitchell',
    company: 'Acme Council',
    location: 'Manchester',
    checkIn: '12 Mar 2026',
    checkOut: '18 Mar 2026',
    nights: 6,
    guests: 4,
    budgetExcVat: '£1,200',
    status: 'new',
    offers: '0',
  },
  {
    id: '2',
    reference: 'BR-2024-0890',
    client: 'James Chen',
    company: 'BuildCo Ltd',
    location: 'Birmingham',
    checkIn: '15 Mar 2026',
    checkOut: '22 Mar 2026',
    nights: 7,
    guests: 6,
    budgetExcVat: '£2,100',
    status: 'in-progress',
    offers: '2',
  },
  {
    id: '3',
    reference: 'BR-2024-0889',
    client: 'Emma Wilson',
    company: 'TechStart Inc',
    location: 'Leeds',
    checkIn: '20 Mar 2026',
    checkOut: '27 Mar 2026',
    nights: 7,
    guests: 2,
    budgetExcVat: '£980',
    status: 'shortlisted',
    offers: '4',
  },
  {
    id: '4',
    reference: 'BR-2024-0888',
    client: 'David Brown',
    company: 'Logistics UK',
    location: 'Liverpool',
    checkIn: '1 Apr 2026',
    checkOut: '30 Apr 2026',
    nights: 29,
    guests: 8,
    budgetExcVat: '£4,500',
    status: 'confirmed',
    offers: '3',
  },
  {
    id: '5',
    reference: 'BR-2024-0885',
    client: 'Lisa Park',
    company: 'Retail Group',
    location: 'Bristol',
    checkIn: '5 Mar 2026',
    checkOut: '12 Mar 2026',
    nights: 7,
    guests: 3,
    budgetExcVat: '£1,450',
    status: 'cancelled',
    offers: '—',
  },
  {
    id: '6',
    reference: 'BR-2024-0882',
    client: 'Tom Harris',
    company: 'Finance Hub',
    location: 'Cardiff',
    checkIn: '10 Feb 2026',
    checkOut: '17 Feb 2026',
    nights: 7,
    guests: 2,
    budgetExcVat: '£890',
    status: 'expired',
    offers: '1',
  },
  {
    id: '7',
    reference: 'BR-2024-0881',
    client: 'Anna Kowalski',
    company: 'Acme Council',
    location: 'London',
    checkIn: '28 Mar 2026',
    checkOut: '4 Apr 2026',
    nights: 7,
    guests: 5,
    budgetExcVat: '£3,200',
    status: 'new',
    offers: '0',
  },
  {
    id: '8',
    reference: 'BR-2024-0879',
    client: 'Mark Taylor',
    company: 'Energy Co',
    location: 'Edinburgh',
    checkIn: '8 Apr 2026',
    checkOut: '15 Apr 2026',
    nights: 7,
    guests: 4,
    budgetExcVat: '£1,780',
    status: 'in-progress',
    offers: '1',
  },
];

/** Figma admin mock — resolve a table row by stable mock `id` (e.g. for `/requests/[id]`). */
export function getAdminPortalRequestMockRowById(id: string): AdminPortalRequestTableRow | undefined {
  return MOCK_ROWS.find((row) => row.id === id);
}

function statusBadgeClass(status: AdminPortalRequestRowStatus): string {
  switch (status) {
    case 'new':
      return 'bg-[#E8A23E] text-white';
    case 'in-progress':
    case 'shortlisted':
      return 'bg-[#0B1D37] text-white';
    case 'confirmed':
      return 'bg-[#00BAB5] text-white';
    case 'cancelled':
      return 'bg-[#f6f6f4] text-[#F04438]';
    case 'expired':
      return 'bg-[#E9EAEB] text-[#4B4E53]';
  }
}

function statusLabel(status: AdminPortalRequestRowStatus): string {
  switch (status) {
    case 'new':
      return 'New';
    case 'in-progress':
      return 'In Progress';
    case 'shortlisted':
      return 'Shortlisted';
    case 'confirmed':
      return 'Confirmed';
    case 'cancelled':
      return 'Cancelled';
    case 'expired':
      return 'Expired';
  }
}

/** Shared pill styling for request row status (directory + client-detail Requests tab). */
export function adminPortalRequestRowStatusBadgeClass(status: AdminPortalRequestRowStatus): string {
  return statusBadgeClass(status);
}

export function adminPortalRequestRowStatusLabel(status: AdminPortalRequestRowStatus): string {
  return statusLabel(status);
}

function rowMatchesFilter(row: AdminPortalRequestTableRow, tab: AdminPortalRequestsFilterTab): boolean {
  if (tab === 'all') return true;
  if (tab === 'in-progress') return row.status === 'in-progress';
  return row.status === tab;
}

function rowMatchesSearch(row: AdminPortalRequestTableRow, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.trim().toLowerCase();
  return (
    row.reference.toLowerCase().includes(s) ||
    row.client.toLowerCase().includes(s) ||
    row.company.toLowerCase().includes(s) ||
    row.location.toLowerCase().includes(s)
  );
}

export type AdminPortalRequestsViewProps = {
  className?: string;
  rows?: AdminPortalRequestTableRow[];
  /** Controlled filter — pass with `onStatusFilterChange` when the shell sets the tab (e.g. dashboard Review). */
  statusFilter?: AdminPortalRequestsFilterTab;
  onStatusFilterChange?: (tab: AdminPortalRequestsFilterTab) => void;
  /** When set, View opens the admin request detail shell (`AdminPortalRequestDetailView` via shell state). */
  onViewRequest?: (row: AdminPortalRequestTableRow) => void;
  /** When set, View links to `${viewHrefPrefix}/${row.id}` (standalone route). Overrides `onViewRequest` for navigation. */
  viewHrefPrefix?: string;
};

const thClass =
  'font-avenir-regular px-4 py-3 text-left text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680] sm:px-5';
const tdClass = 'font-avenir-regular px-4 py-3.5 text-sm leading-5 text-[#0B1D37] sm:px-5';

/**
 * Admin **Requests** — search, status pills (`AdminPortalRequestsStatusPills`), and dense table (static data).
 */
export function AdminPortalRequestsView({
  className,
  rows = MOCK_ROWS,
  statusFilter: controlledFilter,
  onStatusFilterChange,
  onViewRequest,
  viewHrefPrefix,
}: AdminPortalRequestsViewProps) {
  const [internalFilter, setInternalFilter] = useState<AdminPortalRequestsFilterTab>('all');
  const isControlled = controlledFilter !== undefined && onStatusFilterChange !== undefined;
  const filter = isControlled ? controlledFilter : internalFilter;
  const setFilter = isControlled ? onStatusFilterChange : setInternalFilter;
  const [search, setSearch] = useState('');

  const visible = useMemo(() => {
    return rows.filter((r) => rowMatchesFilter(r, filter) && rowMatchesSearch(r, search));
  }, [rows, filter, search]);

  return (
    <div className={cn('flex w-full min-w-0 max-w-full flex-col px-6 pb-0 sm:px-8 lg:px-10', className)}>
      <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0B1D37] sm:text-[28px] sm:leading-9">
        Requests
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
          placeholder="Search by reference, client, company or location..."
          className="font-avenir-regular w-full rounded-lg border border-solid border-[#e9eaeb] bg-white py-2.5 pl-11 pr-4 text-sm leading-5 text-[#0B1D37] outline-none transition-shadow placeholder:text-[#717680] focus:border-[#00BAB5] focus:ring-2 focus:ring-[#00BAB5]/25"
          aria-label="Search requests"
        />
      </div>

      <AdminPortalRequestsStatusPills value={filter} onChange={setFilter} className="mt-4" />

      <div className="mt-6 overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
        <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="min-w-[1100px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e9eaeb] bg-white">
                <th className={thClass}>Reference</th>
                <th className={thClass}>Client</th>
                <th className={thClass}>Company</th>
                <th className={thClass}>Location</th>
                <th className={thClass}>Check-in</th>
                <th className={thClass}>Check-out</th>
                <th className={thClass}>Nights</th>
                <th className={thClass}>Guests</th>
                <th className={thClass}>Budget exc VAT</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Offers</th>
                <th className={cn(thClass, 'w-[1%] whitespace-nowrap pr-6')} aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={12} className="font-avenir-regular px-5 py-12 text-center text-sm text-[#717680]">
                    No requests match your filters.
                  </td>
                </tr>
              ) : (
                visible.map((row) => (
                  <tr key={row.id} className="border-b border-[#e9eaeb] last:border-b-0">
                    <td className={cn(tdClass, 'font-medium')}>{row.reference}</td>
                    <td className={tdClass}>{row.client}</td>
                    <td className={tdClass}>{row.company}</td>
                    <td className={tdClass}>{row.location}</td>
                    <td className={tdClass}>{row.checkIn}</td>
                    <td className={tdClass}>{row.checkOut}</td>
                    <td className={tdClass}>{row.nights}</td>
                    <td className={tdClass}>{row.guests}</td>
                    <td className={tdClass}>{row.budgetExcVat}</td>
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
                    <td className={tdClass}>{row.offers}</td>
                    <td className={cn(tdClass, 'pr-6')}>
                      {(() => {
                        const href =
                          viewHrefPrefix != null && viewHrefPrefix !== ''
                            ? `${viewHrefPrefix.replace(/\/$/, '')}/${encodeURIComponent(row.id)}`
                            : null;
                        const hasButtonHandler = Boolean(onViewRequest);
                        const activeClass =
                          'font-avenir-regular inline-flex items-center gap-0.5 text-sm font-semibold transition-colors cursor-pointer text-[#00BAB5] hover:text-[#008884]';
                        const disabledClass =
                          'font-avenir-regular inline-flex items-center gap-0.5 text-sm font-semibold transition-colors cursor-not-allowed text-[#A4A7AE]';
                        if (href) {
                          return (
                            <Link href={href} className={activeClass}>
                              View
                              <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                            </Link>
                          );
                        }
                        return (
                          <button
                            type="button"
                            disabled={!hasButtonHandler}
                            onClick={() => hasButtonHandler && onViewRequest?.(row)}
                            className={hasButtonHandler ? activeClass : disabledClass}
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
