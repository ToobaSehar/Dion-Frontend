'use client';

import { useMemo, useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';

import {
  AdminPortalPartnerTypePills,
  type AdminPortalPartnerTypeTab,
} from '@/components/client-portal-figma/AdminPortalPartnerTypePills';
import { cn } from '@/lib/utils';

export type { AdminPortalPartnerTypeTab } from '@/components/client-portal-figma/AdminPortalPartnerTypePills';

export type AdminPortalPartnerTypeKind = Exclude<AdminPortalPartnerTypeTab, 'all'>;

export type AdminPortalPartnerRowStatus = 'active';

export type AdminPortalPartnerTableRow = {
  id: string;
  businessName: string;
  contact: string;
  email: string;
  phone: string;
  type: string;
  typeKind: AdminPortalPartnerTypeKind;
  properties: string;
  status: AdminPortalPartnerRowStatus;
};

const MOCK_ROWS: AdminPortalPartnerTableRow[] = [
  {
    id: '1',
    businessName: 'City Living Ltd',
    contact: 'Mark Thompson',
    email: 'mark@cityliving.co.uk',
    phone: '07700 900123',
    type: 'Management Company',
    typeKind: 'management-company',
    properties: '12',
    status: 'active',
  },
  {
    id: '2',
    businessName: 'Haven Properties',
    contact: 'Claire Roberts',
    email: 'claire@haven.co.uk',
    phone: '07700 900456',
    type: 'Management Company',
    typeKind: 'management-company',
    properties: '8',
    status: 'active',
  },
  {
    id: '3',
    businessName: 'Urban Stay Group',
    contact: 'James Wilson',
    email: 'james@urbanstay.com',
    phone: '07700 900789',
    type: 'Host / Operator',
    typeKind: 'host-operator',
    properties: '15',
    status: 'active',
  },
  {
    id: '4',
    businessName: 'Keystone Homes',
    contact: 'Rachel Lee',
    email: 'rachel@keystonehomes.co.uk',
    phone: '07700 900321',
    type: 'Landlord / Investor',
    typeKind: 'landlord-investor',
    properties: '3',
    status: 'active',
  },
  {
    id: '5',
    businessName: 'Metro Lettings',
    contact: 'Paul Anderson',
    email: 'paul@metrolettings.com',
    phone: '07700 900654',
    type: 'Management Company',
    typeKind: 'management-company',
    properties: '20',
    status: 'active',
  },
  {
    id: '6',
    businessName: 'Aspire Apartments',
    contact: 'Sophie Turner',
    email: 'sophie@aspire.co.uk',
    phone: '07700 900987',
    type: 'Landlord / Investor',
    typeKind: 'landlord-investor',
    properties: '5',
    status: 'active',
  },
];

function rowMatchesType(row: AdminPortalPartnerTableRow, tab: AdminPortalPartnerTypeTab): boolean {
  if (tab === 'all') return true;
  return row.typeKind === tab;
}

function rowMatchesSearch(row: AdminPortalPartnerTableRow, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.trim().toLowerCase();
  return (
    row.businessName.toLowerCase().includes(s) ||
    row.contact.toLowerCase().includes(s) ||
    row.email.toLowerCase().includes(s) ||
    row.type.toLowerCase().includes(s)
  );
}

export type AdminPortalPartnersViewProps = {
  className?: string;
  rows?: AdminPortalPartnerTableRow[];
};

const thClass =
  'font-avenir-regular px-4 py-3 text-left text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680] sm:px-5';
const tdClass = 'font-avenir-regular px-4 py-3.5 text-sm leading-5 text-[#0B1D37] sm:px-5';

/**
 * Admin **Partners** — search + type pills + directory table (static data), aligned with `AdminPortalClientsView` chrome and teal accents.
 */
export function AdminPortalPartnersView({ className, rows = MOCK_ROWS }: AdminPortalPartnersViewProps) {
  const [partnerType, setPartnerType] = useState<AdminPortalPartnerTypeTab>('all');
  const [search, setSearch] = useState('');

  const visible = useMemo(() => {
    return rows.filter((r) => rowMatchesType(r, partnerType) && rowMatchesSearch(r, search));
  }, [rows, partnerType, search]);

  return (
    <div className={cn('flex w-full min-w-0 max-w-full flex-col px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0B1D37] sm:text-[28px] sm:leading-9">
        Partners
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
            placeholder="Search by name, email or type..."
            className="font-avenir-regular w-full rounded-lg border border-solid border-[#e9eaeb] bg-white py-2.5 pl-11 pr-4 text-sm leading-5 text-[#0B1D37] outline-none transition-shadow placeholder:text-[#717680] focus:border-[#00BAB5] focus:ring-2 focus:ring-[#00BAB5]/25"
            aria-label="Search partners"
          />
        </div>
        <AdminPortalPartnerTypePills value={partnerType} onChange={setPartnerType} className="min-w-0 shrink-0 lg:max-w-[52%]" />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
        <div className="overflow-x-auto">
          <table className="min-w-[920px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e9eaeb] bg-white">
                <th className={thClass}>Business name</th>
                <th className={thClass}>Contact</th>
                <th className={thClass}>Email</th>
                <th className={thClass}>Phone</th>
                <th className={thClass}>Type</th>
                <th className={cn(thClass, 'text-right')}>Properties</th>
                <th className={thClass}>Status</th>
                <th className={cn(thClass, 'w-[1%] whitespace-nowrap pr-6')} aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="font-avenir-regular px-5 py-12 text-center text-sm text-[#717680]">
                    No partners match your filters.
                  </td>
                </tr>
              ) : (
                visible.map((row) => (
                  <tr key={row.id} className="border-b border-[#e9eaeb] last:border-b-0">
                    <td className={cn(tdClass, 'font-semibold')}>{row.businessName}</td>
                    <td className={tdClass}>{row.contact}</td>
                    <td className={tdClass}>{row.email}</td>
                    <td className={tdClass}>{row.phone}</td>
                    <td className={tdClass}>{row.type}</td>
                    <td className={cn(tdClass, 'text-right tabular-nums')}>{row.properties}</td>
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
