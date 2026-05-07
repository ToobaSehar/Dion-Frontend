'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, ChevronRight, Download, Receipt, Search } from 'lucide-react';

import {
  AdminPortalInvoicesStatusPills,
  type AdminPortalInvoicesFilterTab,
} from '@/components/client-portal-figma/AdminPortalInvoicesStatusPills';
import { BookingHubPrimaryButton, BookingHubSecondaryButton } from '@/components/booking-hub-button';
import { cn } from '@/lib/utils';

export type { AdminPortalInvoicesFilterTab } from '@/components/client-portal-figma/AdminPortalInvoicesStatusPills';

export type AdminPortalInvoiceRowKind = 'vat' | 'commission' | 'credit';

export type AdminPortalInvoicePartyRole = 'client' | 'partner';

export type AdminPortalInvoiceRowStatus = 'paid' | 'overdue' | 'issued';

export type AdminPortalInvoiceTableRow = {
  id: string;
  reference: string;
  /** Display label in the Type column */
  typeLabel: string;
  kind: AdminPortalInvoiceRowKind;
  partyName: string;
  partyRole: AdminPortalInvoicePartyRole;
  bookingRef: string;
  issued: string;
  due: string;
  net: string;
  vat: string;
  total: string;
  status: AdminPortalInvoiceRowStatus;
};

const MOCK_ROWS: AdminPortalInvoiceTableRow[] = [
  {
    id: '1',
    reference: 'INV-BH-2024-0211',
    typeLabel: 'VAT Invoice',
    kind: 'vat',
    partyName: 'Acme Council',
    partyRole: 'client',
    bookingRef: 'BK-2024-0891',
    issued: '20 Mar 2024',
    due: '19 Apr 2024',
    net: '£7,380',
    vat: '£1,476',
    total: '£8,856',
    status: 'paid',
  },
  {
    id: '2',
    reference: 'INV-BH-2024-0204',
    typeLabel: 'VAT Invoice',
    kind: 'vat',
    partyName: 'Northern Housing',
    partyRole: 'client',
    bookingRef: 'BK-2024-0888',
    issued: '12 Mar 2024',
    due: '11 Apr 2024',
    net: '£5,200',
    vat: '£1,040',
    total: '£6,240',
    status: 'issued',
  },
  {
    id: '3',
    reference: 'INV-BH-2024-0198',
    typeLabel: 'VAT Invoice',
    kind: 'vat',
    partyName: 'BuildCo Ltd',
    partyRole: 'client',
    bookingRef: 'BK-2024-0876',
    issued: '28 Feb 2024',
    due: '29 Mar 2024',
    net: '£4,100',
    vat: '£820',
    total: '£4,920',
    status: 'overdue',
  },
  {
    id: '4',
    reference: 'COMM-BH-2024-0044',
    typeLabel: 'Commission Invoice',
    kind: 'commission',
    partyName: 'Haven Properties',
    partyRole: 'partner',
    bookingRef: 'BK-2024-0891',
    issued: '21 Mar 2024',
    due: '20 Apr 2024',
    net: '£612',
    vat: '£122',
    total: '£734',
    status: 'paid',
  },
  {
    id: '5',
    reference: 'COMM-BH-2024-0090',
    typeLabel: 'Commission Invoice',
    kind: 'commission',
    partyName: 'Aspire Apartments',
    partyRole: 'partner',
    bookingRef: 'BK-2024-0842',
    issued: '8 Feb 2024',
    due: '10 Mar 2024',
    net: '£540',
    vat: '£108',
    total: '£648',
    status: 'issued',
  },
  {
    id: '6',
    reference: 'CN-BH-2024-0012',
    typeLabel: 'Credit Note',
    kind: 'credit',
    partyName: 'TechStart Inc',
    partyRole: 'client',
    bookingRef: 'BK-2024-0860',
    issued: '15 Jan 2024',
    due: '—',
    net: '£2,400',
    vat: '£480',
    total: '£2,880',
    status: 'paid',
  },
  {
    id: '7',
    reference: 'CN-BH-2024-0018',
    typeLabel: 'Credit Note',
    kind: 'credit',
    partyName: 'Retail Group',
    partyRole: 'client',
    bookingRef: 'BK-2024-0855',
    issued: '3 Feb 2024',
    due: '—',
    net: '£6,200',
    vat: '£1,240',
    total: '£7,440',
    status: 'issued',
  },
];

const statCardShell =
  'rounded-xl border border-solid border-[#e9eaeb] bg-white p-5 shadow-[0_1px_2px_rgba(11,29,55,0.06)] sm:p-6';

const thClass =
  'font-avenir-regular px-4 py-3 text-left text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680] sm:px-5';
const tdClass = 'font-avenir-regular px-4 py-3.5 text-sm leading-5 text-[#0B1D37] sm:px-5';
const tdMuted = 'font-avenir-regular px-4 py-3.5 text-sm leading-5 text-[#717680] sm:px-5';

function rowMatchesTab(row: AdminPortalInvoiceTableRow, tab: AdminPortalInvoicesFilterTab): boolean {
  if (tab === 'all') return true;
  if (tab === 'vat') return row.kind === 'vat';
  if (tab === 'commission') return row.kind === 'commission';
  return row.kind === 'credit';
}

function rowMatchesSearch(row: AdminPortalInvoiceTableRow, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.trim().toLowerCase();
  const roleLabel = row.partyRole === 'client' ? 'client' : 'partner';
  return (
    row.reference.toLowerCase().includes(s) ||
    row.partyName.toLowerCase().includes(s) ||
    row.bookingRef.toLowerCase().includes(s) ||
    row.typeLabel.toLowerCase().includes(s) ||
    roleLabel.includes(s)
  );
}

function statusBadgeClass(status: AdminPortalInvoiceRowStatus): string {
  switch (status) {
    case 'paid':
      return 'bg-[#00BAB5] text-white';
    case 'overdue':
      return 'bg-[#F04438] text-white';
    case 'issued':
      return 'bg-[#0B1D37] text-white';
  }
}

function statusLabel(status: AdminPortalInvoiceRowStatus): string {
  switch (status) {
    case 'paid':
      return 'Paid';
    case 'overdue':
      return 'Overdue';
    case 'issued':
      return 'Issued';
  }
}

function rowSurfaceClass(status: AdminPortalInvoiceRowStatus): string {
  if (status === 'overdue') return 'bg-[#FEF3F2]';
  return 'bg-white';
}

function partyRoleLabel(role: AdminPortalInvoicePartyRole): string {
  return role === 'client' ? 'Client' : 'Partner';
}

function csvEscape(cell: string): string {
  const safe = cell.replace(/"/g, '""');
  return `"${safe}"`;
}

export type AdminPortalInvoicesViewProps = {
  className?: string;
  rows?: AdminPortalInvoiceTableRow[];
};

/**
 * Admin **Invoices** — VAT (INV-BH), commission (COMM-BH), and credit notes (CN-BH); static reference data until API wiring.
 */
export function AdminPortalInvoicesView({ className, rows = MOCK_ROWS }: AdminPortalInvoicesViewProps) {
  const [tab, setTab] = useState<AdminPortalInvoicesFilterTab>('vat');
  const [search, setSearch] = useState('');

  const visible = useMemo(() => rows.filter((r) => rowMatchesTab(r, tab) && rowMatchesSearch(r, search)), [rows, tab, search]);

  const overdueCount = useMemo(() => rows.filter((r) => r.status === 'overdue').length, [rows]);

  const exportCsv = () => {
    const header = [
      'Reference',
      'Type',
      'Party',
      'Party role',
      'Booking',
      'Issued',
      'Due',
      'Net',
      'VAT',
      'Total',
      'Status',
    ];
    const lines = visible.map((r) =>
      [
        r.reference,
        r.typeLabel,
        r.partyName,
        partyRoleLabel(r.partyRole),
        r.bookingRef,
        r.issued,
        r.due,
        r.net,
        r.vat,
        r.total,
        statusLabel(r.status),
      ]
        .map(csvEscape)
        .join(','),
    );
    const body = [header.map(csvEscape).join(','), ...lines].join('\r\n');
    const blob = new Blob(['\ufeff', body], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'booking-hub-invoices.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn('flex w-full min-w-0 max-w-full flex-col px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <div className="flex flex-col gap-4">
        <section
          className="rounded-xl border border-solid border-[#FECDCA] bg-[#FEF3F2] p-4 shadow-[0_1px_2px_rgba(11,29,55,0.06)] sm:p-5"
          aria-labelledby="admin-invoices-vat-blocked-heading"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
            <div className="flex min-w-0 gap-3 sm:gap-4">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F04438] text-white"
                aria-hidden
              >
                <AlertTriangle className="size-5" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h2 id="admin-invoices-vat-blocked-heading" className="font-avenir-regular text-base font-semibold leading-6 text-[#0B1D37]">
                  Commission invoice generation blocked – Booking Hub VAT number missing
                </h2>
                <p className="font-avenir-regular mt-1 text-sm font-normal leading-5 text-[#4B4E53]">
                  Required to issue COMM-BH- invoices. Add the VAT number in Admin Settings before any further commission invoice can be raised.
                </p>
              </div>
            </div>
            <BookingHubPrimaryButton
              type="button"
              className="shrink-0 lg:self-center"
              iconTrailing={<ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />}
            >
              Open Admin Settings →
            </BookingHubPrimaryButton>
          </div>
        </section>

        <section
          className="rounded-xl border border-solid border-[#FEDF89] bg-[#FFFAEB] p-4 shadow-[0_1px_2px_rgba(11,29,55,0.06)] sm:p-5"
          aria-labelledby="admin-invoices-commission-failures-heading"
        >
          <div className="flex gap-3 sm:gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E8A23E] text-white" aria-hidden>
              <AlertTriangle className="size-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h2 id="admin-invoices-commission-failures-heading" className="font-avenir-regular text-base font-semibold leading-6 text-[#0B1D37]">
                Commission invoice failures requiring manual resolution
              </h2>
              <p className="font-avenir-regular mt-1 text-sm font-normal leading-5 text-[#4B4E53]">
                COMM-BH-2024-0090 – Aspire Apartments – BK-2024-0842 – Xero contact missing tax ID – payout proceeded, invoice needs manual fix.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#00BAB5]/12 text-[#00BAB5]" aria-hidden>
            <Receipt className="size-5" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0B1D37] sm:text-[28px] sm:leading-9">
              Invoices
            </h1>
            <p className="font-avenir-regular mt-1 max-w-[640px] text-sm leading-5 text-[#4B4E53]">
              VAT invoices (INV-BH), commission invoices (COMM-BH), and credit notes (CN-BH) – sequential numbering.
            </p>
          </div>
        </div>
        <BookingHubSecondaryButton
          type="button"
          className="shrink-0 sm:mt-1"
          iconLeading={<Download className="size-4 shrink-0" strokeWidth={2} aria-hidden />}
          onClick={exportCsv}
        >
          Export CSV
        </BookingHubSecondaryButton>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={cn(statCardShell)}>
          <p className="font-avenir-regular text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#4B4E53]">
            Total invoiced
          </p>
          <p className="font-avenir-regular mt-2 text-[28px] font-semibold leading-8 tracking-tight text-[#0B1D37] sm:text-[32px] sm:leading-9">
            £36,576
          </p>
        </div>
        <div className={cn(statCardShell)}>
          <p className="font-avenir-regular text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#4B4E53]">
            Commission billed
          </p>
          <p className="font-avenir-regular mt-2 text-[28px] font-semibold leading-8 tracking-tight text-[#0B1D37] sm:text-[32px] sm:leading-9">
            £2,574
          </p>
        </div>
        <div className={cn(statCardShell)}>
          <p className="font-avenir-regular text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#4B4E53]">
            Refunded (credit notes)
          </p>
          <p className="font-avenir-regular mt-2 text-[28px] font-semibold leading-8 tracking-tight text-[#0B1D37] sm:text-[32px] sm:leading-9">
            £9,504
          </p>
        </div>
        <div className={cn(statCardShell)}>
          <p className="font-avenir-regular text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#4B4E53]">
            Overdue
          </p>
          <p className="font-avenir-regular mt-2 text-[28px] font-semibold leading-8 tracking-tight text-[#F04438] sm:text-[32px] sm:leading-9">
            {overdueCount}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <AdminPortalInvoicesStatusPills value={tab} onChange={setTab} className="shrink-0" />
        <div className="relative w-full min-w-0 sm:max-w-[380px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#717680]"
            strokeWidth={2}
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice, party, booking..."
            className="font-avenir-regular w-full rounded-lg border border-solid border-[#e9eaeb] bg-white py-2.5 pl-11 pr-4 text-sm leading-5 text-[#0B1D37] outline-none transition-shadow placeholder:text-[#717680] focus:border-[#00BAB5] focus:ring-2 focus:ring-[#00BAB5]/25"
            aria-label="Search invoices"
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e9eaeb] bg-white">
                <th className={thClass}>Reference</th>
                <th className={thClass}>Type</th>
                <th className={thClass}>Party</th>
                <th className={thClass}>Booking</th>
                <th className={thClass}>Issued</th>
                <th className={thClass}>Due</th>
                <th className={thClass}>Net</th>
                <th className={thClass}>VAT</th>
                <th className={thClass}>Total amount</th>
                <th className={thClass}>Status</th>
                <th className={cn(thClass, 'w-[1%] whitespace-nowrap pr-6')} aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={11} className="font-avenir-regular px-5 py-12 text-center text-sm text-[#717680]">
                    No invoices match your filters.
                  </td>
                </tr>
              ) : (
                visible.map((row) => (
                  <tr key={row.id} className={cn('border-b border-[#e9eaeb] last:border-b-0', rowSurfaceClass(row.status))}>
                    <td className={cn(tdClass, 'font-semibold text-[#0B1D37]')}>{row.reference}</td>
                    <td className={tdMuted}>{row.typeLabel}</td>
                    <td className={tdClass}>
                      <span className="block font-medium text-[#0B1D37]">{row.partyName}</span>
                      <span className="font-avenir-regular mt-0.5 block text-xs leading-[18px] text-[#717680]">
                        {partyRoleLabel(row.partyRole)}
                      </span>
                    </td>
                    <td className={tdMuted}>{row.bookingRef}</td>
                    <td className={tdMuted}>{row.issued}</td>
                    <td className={tdMuted}>{row.due}</td>
                    <td className={tdMuted}>{row.net}</td>
                    <td className={tdMuted}>{row.vat}</td>
                    <td className={cn(tdClass, 'font-semibold text-[#0B1D37]')}>{row.total}</td>
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
                      <button
                        type="button"
                        className="font-avenir-regular inline-flex items-center gap-0.5 text-sm font-semibold text-[#00BAB5] transition-colors hover:text-[#008884]"
                      >
                        PDF
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
