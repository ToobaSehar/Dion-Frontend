'use client';

import { useMemo, useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';

import {
  AdminPortalClientsSectorPills,
  type AdminPortalClientsSectorTab,
} from '@/components/client-portal-figma/AdminPortalClientsSectorPills';
import { cn } from '@/lib/utils';

export type { AdminPortalClientsSectorTab } from '@/components/client-portal-figma/AdminPortalClientsSectorPills';

export type AdminPortalClientSectorKind = Exclude<AdminPortalClientsSectorTab, 'all'>;

export type AdminPortalClientRowStatus = 'active';

export type AdminPortalClientTableRow = {
  id: string;
  company: string;
  sector: string;
  sectorKind: AdminPortalClientSectorKind;
  contact: string;
  email: string;
  phone: string;
  bookings: string;
  status: AdminPortalClientRowStatus;
};

const MOCK_ROWS: AdminPortalClientTableRow[] = [
  {
    id: '1',
    company: 'Acme Council',
    sector: 'Councils / Housing Providers',
    sectorKind: 'councils-housing-providers',
    contact: 'James Davies',
    email: 'j.davies@acme.gov.uk',
    phone: '+44 7700 900123',
    bookings: '2',
    status: 'active',
  },
  {
    id: '2',
    company: 'Northern Housing',
    sector: 'Councils / Housing Providers',
    sectorKind: 'councils-housing-providers',
    contact: 'Sarah Mitchell',
    email: 's.mitchell@northernhousing.org.uk',
    phone: '+44 7700 900456',
    bookings: '1',
    status: 'active',
  },
  {
    id: '3',
    company: 'BuildCo Ltd',
    sector: 'Contractors',
    sectorKind: 'contractors',
    contact: 'David Brown',
    email: 'd.brown@buildco.example',
    phone: '+44 7700 900789',
    bookings: '3',
    status: 'active',
  },
  {
    id: '4',
    company: 'Atlas Adjusting',
    sector: 'Insurance / Loss Adjusters',
    sectorKind: 'insurance-loss-adjusters',
    contact: 'Emma Wilson',
    email: 'e.wilson@atlasadjusting.example',
    phone: '+44 7700 900321',
    bookings: '1',
    status: 'active',
  },
  {
    id: '5',
    company: 'TechStart Inc',
    sector: 'Other',
    sectorKind: 'other',
    contact: 'James Chen',
    email: 'j.chen@techstart.example',
    phone: '+44 7700 900654',
    bookings: '0',
    status: 'active',
  },
  {
    id: '6',
    company: 'Logistics UK',
    sector: 'Contractors',
    sectorKind: 'contractors',
    contact: 'Lisa Park',
    email: 'l.park@logisticsuk.example',
    phone: '+44 7700 900987',
    bookings: '2',
    status: 'active',
  },
];

function rowMatchesSector(row: AdminPortalClientTableRow, tab: AdminPortalClientsSectorTab): boolean {
  if (tab === 'all') return true;
  return row.sectorKind === tab;
}

function rowMatchesSearch(row: AdminPortalClientTableRow, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.trim().toLowerCase();
  return (
    row.company.toLowerCase().includes(s) ||
    row.contact.toLowerCase().includes(s) ||
    row.email.toLowerCase().includes(s) ||
    row.sector.toLowerCase().includes(s)
  );
}

export type AdminPortalClientsViewProps = {
  className?: string;
  rows?: AdminPortalClientTableRow[];
};

const thClass =
  'font-avenir-regular px-4 py-3 text-left text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680] sm:px-5';
const tdClass = 'font-avenir-regular px-4 py-3.5 text-sm leading-5 text-[#0B1D37] sm:px-5';

/**
 * Admin **Clients** — search + sector pills (pills align end on large screens) and client directory table (static data).
 * Active pill + View link use brand teal (`#00BAB5`) like other admin tables.
 */
export function AdminPortalClientsView({ className, rows = MOCK_ROWS }: AdminPortalClientsViewProps) {
  const [sector, setSector] = useState<AdminPortalClientsSectorTab>('all');
  const [search, setSearch] = useState('');

  const visible = useMemo(() => {
    return rows.filter((r) => rowMatchesSector(r, sector) && rowMatchesSearch(r, search));
  }, [rows, sector, search]);

  return (
    <div className={cn('flex w-full min-w-0 max-w-full flex-col px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0B1D37] sm:text-[28px] sm:leading-9">
        Clients
      </h1>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#717680]"
            strokeWidth={2}
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company, contact, email or sector..."
            className="font-avenir-regular w-full rounded-lg border border-solid border-[#e9eaeb] bg-white py-2.5 pl-11 pr-4 text-sm leading-5 text-[#0B1D37] outline-none transition-shadow placeholder:text-[#717680] focus:border-[#00BAB5] focus:ring-2 focus:ring-[#00BAB5]/25"
            aria-label="Search clients"
          />
        </div>
        <AdminPortalClientsSectorPills value={sector} onChange={setSector} className="min-w-0 shrink-0 lg:max-w-[52%]" />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e9eaeb] bg-white">
                <th className={thClass}>Company</th>
                <th className={thClass}>Sector</th>
                <th className={thClass}>Contact</th>
                <th className={thClass}>Email</th>
                <th className={thClass}>Phone</th>
                <th className={thClass}>Bookings</th>
                <th className={thClass}>Status</th>
                <th className={cn(thClass, 'w-[1%] whitespace-nowrap pr-6')} aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="font-avenir-regular px-5 py-12 text-center text-sm text-[#717680]">
                    No clients match your filters.
                  </td>
                </tr>
              ) : (
                visible.map((row) => (
                  <tr key={row.id} className="border-b border-[#e9eaeb] last:border-b-0">
                    <td className={cn(tdClass, 'font-semibold')}>{row.company}</td>
                    <td className={tdClass}>{row.sector}</td>
                    <td className={tdClass}>{row.contact}</td>
                    <td className={tdClass}>{row.email}</td>
                    <td className={tdClass}>{row.phone}</td>
                    <td className={tdClass}>{row.bookings}</td>
                    <td className={tdClass}>
                      <span className="font-avenir-regular inline-flex rounded-full bg-[#00BAB5] px-2.5 py-1 text-xs font-semibold leading-[18px] text-white">
                        Active
                      </span>
                    </td>
                    <td className={cn(tdClass, 'pr-6 text-right')}>
                      <button
                        type="button"
                        className="font-avenir-regular inline-flex items-center justify-end gap-0.5 text-sm font-semibold text-[#00BAB5] transition-colors hover:text-[#008884]"
                      >
                        View
                        <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                      </button>
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
