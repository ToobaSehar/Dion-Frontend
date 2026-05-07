import type { AdminPortalPropertyTableRow } from '@/components/client-portal-figma/AdminPortalPropertiesView';
import { getAdminPortalPropertyMockRowsForPartnerName } from '@/components/client-portal-figma/AdminPortalPropertiesView';

/** Row model for **Partner detail → Properties** (matches admin directory badges + photography overlay). */
export type AdminPartnerDetailPropertyRow = {
  id: string;
  cardImageSeed: string;
  /** When set, shows a `+N` overlay on the thumbnail (additional photos). */
  extraPhotoCount: number | null;
  propertyName: string;
  location: string;
  beds: number;
  rateExcVatLabel: string;
  vatRegistered: boolean;
  reviewApproved: boolean | null;
  listingAvailable: boolean;
  opsStatus: 'active' | 'inactive';
};

function mapAdminPropertyRow(row: AdminPortalPropertyTableRow): AdminPartnerDetailPropertyRow {
  const listingAvailable = row.listingKind !== 'unavailable' && row.listingKind !== 'inactive';
  const extra =
    Number.parseInt(row.id, 10) % 4 === 0 ? 2 : Number.parseInt(row.id, 10) % 5 === 0 ? 1 : null;

  return {
    id: row.id,
    cardImageSeed: row.cardImageSeed,
    extraPhotoCount: extra,
    propertyName: row.propertyName,
    location: row.location,
    beds: row.beds,
    rateExcVatLabel: `£${row.nightlyFromGbp} exc VAT`,
    vatRegistered: row.vatRegistered,
    reviewApproved: row.reviewApproved,
    listingAvailable,
    opsStatus: row.opsStatus,
  };
}

/** Curated **City Living Ltd** tab (partner mock id `1`) — aligns with partner-detail design snapshots. */
const CITY_LIVING_DETAIL_TAB_ROWS: AdminPartnerDetailPropertyRow[] = [
  {
    id: 'cl-1',
    cardImageSeed: 'bh-prop-victoria',
    extraPhotoCount: 2,
    propertyName: 'Victoria Apartments',
    location: 'Bristol, BS1 4DJ',
    beds: 2,
    rateExcVatLabel: '£82 exc VAT',
    vatRegistered: true,
    reviewApproved: true,
    listingAvailable: true,
    opsStatus: 'active',
  },
  {
    id: 'cl-2',
    cardImageSeed: 'bh-prop-canal',
    extraPhotoCount: null,
    propertyName: 'Canal View Suites',
    location: 'Manchester, M1 5AN',
    beds: 2,
    rateExcVatLabel: '£110 exc VAT',
    vatRegistered: true,
    reviewApproved: true,
    listingAvailable: true,
    opsStatus: 'active',
  },
  {
    id: 'cl-3',
    cardImageSeed: 'bh-prop-clifton-demo',
    extraPhotoCount: 1,
    propertyName: 'Clifton Heights',
    location: 'Bristol, BS8 1JU',
    beds: 2,
    rateExcVatLabel: '£76 exc VAT',
    vatRegistered: false,
    reviewApproved: null,
    listingAvailable: true,
    opsStatus: 'active',
  },
  {
    id: 'cl-4',
    cardImageSeed: 'bh-prop-temple-demo',
    extraPhotoCount: null,
    propertyName: 'Temple Quay Apartment',
    location: 'Bristol, BS1 6DG',
    beds: 1,
    rateExcVatLabel: '£68 exc VAT',
    vatRegistered: true,
    reviewApproved: true,
    listingAvailable: false,
    opsStatus: 'active',
  },
  {
    id: 'cl-5',
    cardImageSeed: 'bh-prop-oldmarket-demo',
    extraPhotoCount: null,
    propertyName: 'Old Market Studios',
    location: 'Bristol, BS2 0JA',
    beds: 1,
    rateExcVatLabel: '£55 exc VAT',
    vatRegistered: false,
    reviewApproved: true,
    listingAvailable: false,
    opsStatus: 'inactive',
  },
  {
    id: 'cl-6',
    cardImageSeed: 'bh-prop-harbour-demo',
    extraPhotoCount: 3,
    propertyName: 'Harbourside House',
    location: 'Bristol, BS1 5SY',
    beds: 4,
    rateExcVatLabel: '£140 exc VAT',
    vatRegistered: true,
    reviewApproved: true,
    listingAvailable: true,
    opsStatus: 'active',
  },
];

/**
 * Properties listed under **Partner detail → Properties** for static demo data.
 * Partner `1` uses curated rows; other partners reuse global property mocks filtered by business name.
 */
export function getAdminPartnerDetailPropertyRows(partnerId: string, partnerName: string): AdminPartnerDetailPropertyRow[] {
  if (partnerId === '1') {
    return CITY_LIVING_DETAIL_TAB_ROWS;
  }
  return getAdminPortalPropertyMockRowsForPartnerName(partnerName).map(mapAdminPropertyRow);
}

/**
 * Picsum seeds for the partner-property gallery modal — first image matches the table thumbnail;
 * extras use deterministic suffixes so each slide is distinct.
 */
export function partnerDetailPropertyGallerySeeds(row: AdminPartnerDetailPropertyRow): string[] {
  const extra = row.extraPhotoCount ?? 0;
  const total = Math.max(1, 1 + extra);
  return Array.from({ length: total }, (_, i) =>
    i === 0 ? row.cardImageSeed : `${row.cardImageSeed}-gal-${i + 1}`,
  );
}

export type AdminPartnerNetworkDoc = {
  title: string;
  uploadedLabel: string;
  verified: boolean;
};

export type AdminPartnerBookingHistoryRow = {
  bookingRef: string;
  client: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
  statusLabel: string;
  /** Navy pill (e.g. Checked In) vs amber (e.g. Awaiting Payment). */
  statusTone: 'navy' | 'amber';
};

export type AdminPartnerOfferSubmittedRow = {
  requestRef: string;
  dateSubmitted: string;
  priceOffered: string;
  statusLabel: string;
  statusTone: 'amber';
};

/** Full mock payload for **Partner detail → Properties → View** modal. */
export type AdminPartnerPropertyDetailContent = {
  propertyName: string;
  partnerName: string;
  propertyType: string;
  address: string;
  reviewApproved: boolean | null;
  opsActive: boolean;
  imageSeeds: readonly string[];
  bedrooms: number;
  maxGuests: number;
  parking: boolean;
  wifi: boolean;
  petFriendly: boolean;
  listingAvailable: boolean;
  nightlyRateLabel: string;
  vatRegistered: boolean;
  /** Shown in Pricing & VAT; use em dash when no number on file. */
  vatNumberDisplay: string;
  partnerNetworkDocs: readonly AdminPartnerNetworkDoc[];
  bookingHistoryRows: readonly AdminPartnerBookingHistoryRow[];
  offersSubmittedRows: readonly AdminPartnerOfferSubmittedRow[];
};

function guessPropertyType(propertyName: string): string {
  const n = propertyName.toLowerCase();
  if (n.includes('studio')) return 'Studio';
  if (n.includes('house') || n.includes('terrace')) return 'House';
  if (n.includes('suite') || n.includes('loft')) return 'Serviced apartment';
  return 'Apartment';
}

const VICTORIA_PARTNER_NETWORK_DOCS: AdminPartnerNetworkDoc[] = [
  { title: 'EPC Certificate', uploadedLabel: 'Uploaded 1 Jan 2024', verified: true },
  { title: 'Gas Safety Certificate', uploadedLabel: 'Uploaded 2 Jan 2024', verified: true },
  { title: 'EICR Certificate', uploadedLabel: 'Uploaded 3 Jan 2024', verified: true },
  { title: 'Public Liability Insurance', uploadedLabel: 'Uploaded 4 Jan 2024', verified: true },
  { title: 'ID Verification', uploadedLabel: 'Uploaded 5 Jan 2024', verified: true },
];

/** Curated patches per partner-property row id (Victoria matches design snapshot). */
const PROPERTY_DETAIL_PATCH: Partial<Record<string, Partial<AdminPartnerPropertyDetailContent>>> = {
  'cl-1': {
    bedrooms: 2,
    maxGuests: 4,
    propertyType: 'Apartment',
    parking: true,
    wifi: true,
    petFriendly: false,
    vatNumberDisplay: 'GB123456789',
    partnerNetworkDocs: VICTORIA_PARTNER_NETWORK_DOCS,
    bookingHistoryRows: [
      {
        bookingRef: 'BK-2024-0891',
        client: 'James Davies',
        checkIn: '1 Apr 2024',
        checkOut: '30 Jun 2024',
        totalAmount: '£8,856',
        statusLabel: 'Checked In',
        statusTone: 'navy',
      },
      {
        bookingRef: 'BK-2024-0892',
        client: 'Mike Johnson',
        checkIn: '1 May 2024',
        checkOut: '1 Aug 2024',
        totalAmount: '£8,200',
        statusLabel: 'Awaiting Payment',
        statusTone: 'amber',
      },
    ],
    offersSubmittedRows: [
      {
        requestRef: 'RQ-2024-0155',
        dateSubmitted: '9 Mar 2024',
        priceOffered: '£82/night exc VAT',
        statusLabel: 'Submitted',
        statusTone: 'amber',
      },
    ],
  },
  'cl-2': {
    propertyType: 'Serviced apartment',
    parking: true,
    wifi: true,
    petFriendly: false,
    vatNumberDisplay: 'GB987654321',
    partnerNetworkDocs: [{ title: 'EPC Certificate', uploadedLabel: 'Uploaded 12 Mar 2024', verified: true }],
  },
  'cl-3': {
    propertyType: 'Apartment',
    parking: false,
    wifi: true,
    petFriendly: false,
    vatNumberDisplay: '—',
    partnerNetworkDocs: [{ title: 'EPC Certificate', uploadedLabel: 'Uploaded 3 Feb 2024', verified: false }],
  },
  'cl-4': {
    propertyType: 'Apartment',
    parking: true,
    wifi: true,
    petFriendly: true,
    vatNumberDisplay: 'GB445566778',
    partnerNetworkDocs: [{ title: 'EPC Certificate', uploadedLabel: 'Uploaded 20 Nov 2023', verified: true }],
  },
  'cl-5': {
    propertyType: 'Studio',
    parking: false,
    wifi: true,
    petFriendly: false,
    vatNumberDisplay: '—',
    partnerNetworkDocs: [{ title: 'EPC Certificate', uploadedLabel: 'Uploaded 8 Aug 2023', verified: true }],
  },
  'cl-6': {
    propertyType: 'House',
    parking: true,
    wifi: true,
    petFriendly: false,
    vatNumberDisplay: 'GB223344556',
    partnerNetworkDocs: [{ title: 'EPC Certificate', uploadedLabel: 'Uploaded 5 May 2024', verified: true }],
  },
};

function defaultPartnerPropertyDetail(row: AdminPartnerDetailPropertyRow, partnerName: string): AdminPartnerPropertyDetailContent {
  const seeds = partnerDetailPropertyGallerySeeds(row);
  const checksum = row.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  return {
    propertyName: row.propertyName,
    partnerName,
    propertyType: guessPropertyType(row.propertyName),
    address: row.location,
    reviewApproved: row.reviewApproved,
    opsActive: row.opsStatus === 'active',
    imageSeeds: seeds,
    bedrooms: row.beds,
    maxGuests: Math.max(2, row.beds * 2),
    parking: checksum % 3 !== 0,
    wifi: true,
    petFriendly: checksum % 5 === 0,
    listingAvailable: row.listingAvailable,
    nightlyRateLabel: row.rateExcVatLabel,
    vatRegistered: row.vatRegistered,
    vatNumberDisplay: row.vatRegistered ? 'GB123456789' : '—',
    partnerNetworkDocs: [
      {
        title: 'EPC Certificate',
        uploadedLabel: 'Uploaded 15 Jun 2024',
        verified: row.reviewApproved === true,
      },
    ],
    bookingHistoryRows: [],
    offersSubmittedRows: [],
  };
}

/** Resolves modal copy from the properties-tab row + owning partner name. */
export function resolvePartnerPropertyDetail(
  row: AdminPartnerDetailPropertyRow,
  partnerName: string,
): AdminPartnerPropertyDetailContent {
  const base = defaultPartnerPropertyDetail(row, partnerName);
  const patch = PROPERTY_DETAIL_PATCH[row.id];
  return patch ? { ...base, ...patch } : base;
}
