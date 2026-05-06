'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronRight, LayoutGrid, LayoutList, MapPin, Search, ShieldCheck } from 'lucide-react';

import {
  AdminPortalPartnerTypePills,
  type AdminPortalPartnerTypeTab,
} from '@/components/client-portal-figma/AdminPortalPartnerTypePills';
import {
  AdminPortalPropertyListingStatusPills,
  type AdminPortalPropertyListingTab,
} from '@/components/client-portal-figma/AdminPortalPropertyListingStatusPills';
import { PortalPropertyDirectoryCard } from '@/components/client-portal-figma/PortalPropertyDirectoryCard';
import { cn } from '@/lib/utils';

import type { LatLngBoundsLiteral } from '@/components/client-portal-figma/AdminPortalPropertiesLeafletMap';

const AdminPortalPropertiesLeafletMap = dynamic(
  () => import('@/components/client-portal-figma/AdminPortalPropertiesLeafletMap'),
  {
    ssr: false,
    loading: () => (
      <div
        className="mt-6 min-h-[520px] w-full animate-pulse rounded-xl border border-solid border-[#e9eaeb] bg-[#F6F6F4]"
        aria-hidden
      />
    ),
  },
);

export type { AdminPortalPropertyListingTab } from '@/components/client-portal-figma/AdminPortalPropertyListingStatusPills';

export type AdminPortalPropertyListingKind = Exclude<AdminPortalPropertyListingTab, 'all'>;
export type AdminPortalPropertyPartnerKind = Exclude<AdminPortalPartnerTypeTab, 'all'>;
export type AdminPortalPropertyOpsStatus = 'active' | 'inactive';

export type AdminPortalPropertyTableRow = {
  id: string;
  propertyName: string;
  partnerName: string;
  location: string;
  /** Shown on cards view (e.g. Apartment). */
  propertyType: string;
  beds: number;
  guests: number;
  vatRegistered: boolean;
  /** Admin approval badge; `null` renders an empty cell / no overlay on card. */
  reviewApproved: boolean | null;
  /** Stable seed for card hero image (`picsum.photos`). */
  cardImageSeed: string;
  /** Map marker position (UK). */
  latitude: number;
  longitude: number;
  /** Demo nightly rate for map popup. */
  nightlyFromGbp: number;
  listingKind: AdminPortalPropertyListingKind;
  partnerKind: AdminPortalPropertyPartnerKind;
  opsStatus: AdminPortalPropertyOpsStatus;
};

const MOCK_ROWS: AdminPortalPropertyTableRow[] = [
  {
    id: '1',
    propertyName: 'Victoria Apartments',
    partnerName: 'City Living Ltd',
    location: 'Bristol, BS1 4DJ',
    propertyType: 'Apartment',
    beds: 3,
    guests: 6,
    vatRegistered: true,
    reviewApproved: true,
    cardImageSeed: 'bh-prop-victoria',
    latitude: 51.4545,
    longitude: -2.5879,
    nightlyFromGbp: 95,
    listingKind: 'available',
    partnerKind: 'management-company',
    opsStatus: 'active',
  },
  {
    id: '2',
    propertyName: 'Station House',
    partnerName: 'Haven Properties',
    location: 'Birmingham, B2 4QA',
    propertyType: 'Townhouse',
    beds: 2,
    guests: 4,
    vatRegistered: false,
    reviewApproved: true,
    cardImageSeed: 'bh-prop-station',
    latitude: 52.4862,
    longitude: -1.8904,
    nightlyFromGbp: 88,
    listingKind: 'available',
    partnerKind: 'management-company',
    opsStatus: 'active',
  },
  {
    id: '3',
    propertyName: 'Riverside Court',
    partnerName: 'Metro Stays',
    location: 'Leeds, LS1 4DY',
    propertyType: 'Apartment',
    beds: 4,
    guests: 8,
    vatRegistered: true,
    reviewApproved: null,
    cardImageSeed: 'bh-prop-riverside',
    latitude: 53.8008,
    longitude: -1.5491,
    nightlyFromGbp: 102,
    listingKind: 'unavailable',
    partnerKind: 'host-operator',
    opsStatus: 'active',
  },
  {
    id: '4',
    propertyName: 'Harbour Studios',
    partnerName: 'Haven Properties',
    location: 'Liverpool, L1 8JQ',
    propertyType: 'Studio',
    beds: 1,
    guests: 2,
    vatRegistered: false,
    reviewApproved: null,
    cardImageSeed: 'bh-prop-harbour',
    latitude: 53.4084,
    longitude: -2.9916,
    nightlyFromGbp: 72,
    listingKind: 'inactive',
    partnerKind: 'management-company',
    opsStatus: 'inactive',
  },
  {
    id: '5',
    propertyName: 'Canal View Suites',
    partnerName: 'City Living Ltd',
    location: 'Manchester, M1 5AN',
    propertyType: 'Serviced apartment',
    beds: 2,
    guests: 4,
    vatRegistered: true,
    reviewApproved: true,
    cardImageSeed: 'bh-prop-canal',
    latitude: 53.4808,
    longitude: -2.2426,
    nightlyFromGbp: 110,
    listingKind: 'approved',
    partnerKind: 'management-company',
    opsStatus: 'active',
  },
  {
    id: '6',
    propertyName: 'Queens Terrace',
    partnerName: 'Keystone Homes',
    location: 'Nottingham, NG1 6FQ',
    propertyType: 'House',
    beds: 3,
    guests: 5,
    vatRegistered: false,
    reviewApproved: true,
    cardImageSeed: 'bh-prop-queens',
    latitude: 52.9548,
    longitude: -1.1581,
    nightlyFromGbp: 84,
    listingKind: 'available',
    partnerKind: 'landlord-investor',
    opsStatus: 'active',
  },
  {
    id: '7',
    propertyName: 'Metro Lofts',
    partnerName: 'Urban Stay Group',
    location: 'London, E1 6AN',
    propertyType: 'Loft',
    beds: 2,
    guests: 3,
    vatRegistered: true,
    reviewApproved: null,
    cardImageSeed: 'bh-prop-metro',
    latitude: 51.5074,
    longitude: -0.1278,
    nightlyFromGbp: 125,
    listingKind: 'available',
    partnerKind: 'host-operator',
    opsStatus: 'active',
  },
  {
    id: '8',
    propertyName: 'Northern Quarter Studio',
    partnerName: 'Aspire Apartments',
    location: 'Manchester, M4 1HQ',
    propertyType: 'Studio',
    beds: 1,
    guests: 2,
    vatRegistered: true,
    reviewApproved: true,
    cardImageSeed: 'bh-prop-nq',
    latitude: 53.4849,
    longitude: -2.2344,
    nightlyFromGbp: 79,
    listingKind: 'available',
    partnerKind: 'landlord-investor',
    opsStatus: 'active',
  },
];

export type AdminPortalPropertiesViewMode = 'list' | 'cards' | 'map';

function rowMatchesListing(row: AdminPortalPropertyTableRow, tab: AdminPortalPropertyListingTab): boolean {
  if (tab === 'all') return true;
  return row.listingKind === tab;
}

function rowMatchesPartnerKind(row: AdminPortalPropertyTableRow, tab: AdminPortalPartnerTypeTab): boolean {
  if (tab === 'all') return true;
  return row.partnerKind === tab;
}

function rowMatchesSearch(row: AdminPortalPropertyTableRow, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.trim().toLowerCase();
  return (
    row.propertyName.toLowerCase().includes(s) ||
    row.location.toLowerCase().includes(s) ||
    row.partnerName.toLowerCase().includes(s) ||
    row.propertyType.toLowerCase().includes(s)
  );
}

function pointInBounds(lat: number, lng: number, b: LatLngBoundsLiteral): boolean {
  return lat >= b.south && lat <= b.north && lng >= b.west && lng <= b.east;
}

export type AdminPortalPropertiesViewProps = {
  className?: string;
  rows?: AdminPortalPropertyTableRow[];
};

const thClass =
  'font-avenir-regular px-4 py-3 text-left text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680] sm:px-5';
const tdClass = 'font-avenir-regular px-4 py-3.5 text-sm leading-5 text-[#0B1D37] sm:px-5';

const viewToggleBtn =
  'font-avenir-regular inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold leading-5 transition-colors sm:px-4';

/**
 * Admin **Properties** — list / cards / map switcher, search, dual filter rows, and directory (static data).
 * Reuses partner-type pills for the category row (`AdminPortalPartnerTypePills`).
 */
export function AdminPortalPropertiesView({ className, rows = MOCK_ROWS }: AdminPortalPropertiesViewProps) {
  const [viewMode, setViewMode] = useState<AdminPortalPropertiesViewMode>('list');
  const [listingTab, setListingTab] = useState<AdminPortalPropertyListingTab>('all');
  const [partnerTab, setPartnerTab] = useState<AdminPortalPartnerTypeTab>('all');
  const [search, setSearch] = useState('');
  const [mapViewportFilter, setMapViewportFilter] = useState(false);
  const [mapBounds, setMapBounds] = useState<LatLngBoundsLiteral | null>(null);

  const handleViewPropertyFromMap = useCallback((id: string) => {
    void id;
  }, []);

  useEffect(() => {
    if (viewMode !== 'map') {
      setMapViewportFilter(false);
    }
  }, [viewMode]);

  const baseVisible = useMemo(() => {
    return rows.filter(
      (r) =>
        rowMatchesListing(r, listingTab) &&
        rowMatchesPartnerKind(r, partnerTab) &&
        rowMatchesSearch(r, search),
    );
  }, [rows, listingTab, partnerTab, search]);

  const visible = useMemo(() => {
    if (viewMode !== 'map' || !mapViewportFilter || !mapBounds) return baseVisible;
    return baseVisible.filter((r) => pointInBounds(r.latitude, r.longitude, mapBounds));
  }, [baseVisible, viewMode, mapViewportFilter, mapBounds]);

  return (
    <div className={cn('flex w-full min-w-0 max-w-full flex-col px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0B1D37] sm:text-[28px] sm:leading-9">
          Properties
        </h1>
        <div
          className="inline-flex shrink-0 rounded-lg border border-solid border-[#e9eaeb] bg-[#F6F6F4] p-1"
          role="group"
          aria-label="Property directory view"
        >
          {(
            [
              { id: 'list' as const, label: 'List', Icon: LayoutList },
              { id: 'cards' as const, label: 'Cards', Icon: LayoutGrid },
              { id: 'map' as const, label: 'Map', Icon: MapPin },
            ] as const
          ).map(({ id, label, Icon }) => {
            const selected = viewMode === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setViewMode(id)}
                className={cn(
                  viewToggleBtn,
                  selected
                    ? 'bg-[#0B1D37] text-white shadow-sm'
                    : 'text-[#4B4E53] hover:bg-white/80 hover:text-[#0B1D37]',
                )}
              >
                <Icon className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                {label}
              </button>
            );
          })}
        </div>
      </div>

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
          placeholder="Search by property name, town, or postcode..."
          className="font-avenir-regular w-full rounded-lg border border-solid border-[#e9eaeb] bg-white py-2.5 pl-11 pr-4 text-sm leading-5 text-[#0B1D37] outline-none transition-shadow placeholder:text-[#717680] focus:border-[#00BAB5] focus:ring-2 focus:ring-[#00BAB5]/25"
          aria-label="Search properties"
        />
      </div>

      <AdminPortalPropertyListingStatusPills value={listingTab} onChange={setListingTab} className="mt-4" />
      <AdminPortalPartnerTypePills
        value={partnerTab}
        onChange={setPartnerTab}
        className="mt-3"
        justify="start"
        ariaLabel="Filter properties by partner category"
      />

      {viewMode === 'list' ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
          <div className="overflow-x-auto">
            <table className="min-w-[960px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e9eaeb] bg-white">
                  <th className={thClass}>Property name</th>
                  <th className={thClass}>Partner</th>
                  <th className={thClass}>Location</th>
                  <th className={cn(thClass, 'text-right')}>Beds</th>
                  <th className={thClass}>VAT</th>
                  <th className={thClass}>Approved</th>
                  <th className={thClass}>Status</th>
                  <th className={cn(thClass, 'w-[1%] whitespace-nowrap pr-6')} aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="font-avenir-regular px-5 py-12 text-center text-sm text-[#717680]">
                      No properties match your filters.
                    </td>
                  </tr>
                ) : (
                  visible.map((row) => (
                    <tr key={row.id} className="border-b border-[#e9eaeb] last:border-b-0">
                      <td className={cn(tdClass, 'font-semibold')}>{row.propertyName}</td>
                      <td className={tdClass}>
                        <button
                          type="button"
                          className="font-avenir-regular text-left text-sm font-semibold text-[#00BAB5] transition-colors hover:text-[#008884] hover:underline"
                        >
                          {row.partnerName}
                        </button>
                      </td>
                      <td className={tdClass}>{row.location}</td>
                      <td className={cn(tdClass, 'text-right tabular-nums')}>{row.beds}</td>
                      <td className={tdClass}>
                        <span
                          className={cn(
                            'font-avenir-regular inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                            row.vatRegistered ? 'bg-[#00BAB5] text-white' : 'bg-[#E9EAEB] text-[#4B4E53]',
                          )}
                        >
                          {row.vatRegistered ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className={tdClass}>
                        {row.reviewApproved ? (
                          <span className="font-avenir-regular inline-flex items-center gap-1 rounded-full bg-[#0B1D37] px-2.5 py-1 text-xs font-semibold leading-[18px] text-white">
                            <ShieldCheck className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
                            Approved
                          </span>
                        ) : (
                          <span className="text-[#717680]">—</span>
                        )}
                      </td>
                      <td className={tdClass}>
                        <span
                          className={cn(
                            'font-avenir-regular inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                            row.opsStatus === 'active' ? 'bg-[#00BAB5] text-white' : 'bg-[#E9EAEB] text-[#4B4E53]',
                          )}
                        >
                          {row.opsStatus === 'active' ? 'Active' : 'Inactive'}
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
      ) : viewMode === 'cards' ? (
        <ul
          className="mt-6 grid list-none grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          role="list"
          aria-label="Properties in card layout"
        >
          {visible.length === 0 ? (
            <li className="col-span-full py-12 text-center text-sm text-[#717680]">No properties match your filters.</li>
          ) : (
            visible.map((row) => <PortalPropertyDirectoryCard key={row.id} row={row} />)
          )}
        </ul>
      ) : (
        <AdminPortalPropertiesLeafletMap
          properties={visible}
          viewportFilter={mapViewportFilter}
          onViewportFilterChange={setMapViewportFilter}
          onMapBoundsChange={setMapBounds}
          onViewProperty={handleViewPropertyFromMap}
        />
      )}
    </div>
  );
}
