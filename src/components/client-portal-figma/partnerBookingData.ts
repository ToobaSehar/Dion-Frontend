/**
 * Static partner **My Bookings** rows + detail payload until API wiring.
 * Detail routes: `/partner/dashboard/bookings/[bookingRowId]`.
 */

export type PartnerMyBookingRowStatus =
  | 'checked-in'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

export type PartnerMyBookingRow = {
  id: string;
  bookingId: string;
  propertyName: string;
  dateRange: string;
  guests: number;
  priceFormatted: string;
  status: PartnerMyBookingRowStatus;
};

export type PartnerBookingDetail = PartnerMyBookingRow & {
  checkInDisplay: string;
  checkOutDisplay: string;
  nights: number;
  clientCompany: string;
  propertyAddress: string;
  /** Gross total shown on booking details (may differ from list teaser amount). */
  totalBookingValueGross: string;
  checkInInstructions: string;
  /** Shown on completed bookings — structured instruction rows (defaults to em dash). */
  checkInAccessMethod?: string;
  checkInKeyLockboxCode?: string;
  checkInParking?: string;
  checkInArrivalNotes?: string;
  /** Partner payout summary card */
  netPayoutAmount: string;
  scheduledReleaseDateDisplay: string;
  payoutStatusBadge: string;
  payoutScheduledLine: string;
  /** Amber “add instructions” strip — shell until API wiring */
  showCheckInInstructionsActionBanner: boolean;
};

const BASE_ROWS: PartnerMyBookingRow[] = [
  {
    id: '1',
    bookingId: 'BH-2024-0847',
    propertyName: 'City Centre Apartment',
    dateRange: '15 Mar – 10 May 2024',
    guests: 2,
    priceFormatted: '£4,680',
    status: 'checked-in',
  },
  {
    id: '2',
    bookingId: 'BH-2024-0512',
    propertyName: 'Harbour Studios',
    dateRange: '1 Apr – 30 Jun 2024',
    guests: 4,
    priceFormatted: '£8,240',
    status: 'confirmed',
  },
  {
    id: '3',
    bookingId: 'BH-2024-0299',
    propertyName: 'Riverside Court',
    dateRange: '10 Apr – 5 Jun 2024',
    guests: 3,
    priceFormatted: '£5,320',
    status: 'in-progress',
  },
  {
    id: '4',
    bookingId: 'BH-2023-9910',
    propertyName: 'Queens Terrace',
    dateRange: '1 Oct – 31 Dec 2024',
    guests: 2,
    priceFormatted: '£8,100',
    status: 'completed',
  },
  {
    id: '5',
    bookingId: 'BH-2024-0100',
    propertyName: 'Canal View Suites',
    dateRange: '12 May – 12 Jul 2024',
    guests: 2,
    priceFormatted: '£3,200',
    status: 'cancelled',
  },
];

const DETAIL_BY_ROW_ID: Record<string, Omit<PartnerBookingDetail, keyof PartnerMyBookingRow>> = {
  '1': {
    checkInDisplay: '15 Mar 2024',
    checkOutDisplay: '10 May 2024',
    nights: 56,
    clientCompany: 'Acme Corporation Ltd',
    propertyAddress: '14 Deansgate, Manchester M3 1RG',
    totalBookingValueGross: '£5,200',
    checkInInstructions:
      'No instructions added yet. These will be auto-sent to the client 24 hours before check-in.',
    netPayoutAmount: '£4,680',
    scheduledReleaseDateDisplay: '16 March 2024',
    payoutStatusBadge: 'Scheduled',
    payoutScheduledLine: 'Payout scheduled — releasing on 16 Mar 2024',
    showCheckInInstructionsActionBanner: true,
  },
  '2': {
    checkInDisplay: '1 Apr 2024',
    checkOutDisplay: '30 Jun 2024',
    nights: 91,
    clientCompany: 'Northwind Logistics PLC',
    propertyAddress: 'Unit 2, Harbour Walk, Liverpool L3 1DP',
    totalBookingValueGross: '£8,240',
    checkInInstructions:
      'No instructions added yet. These will be auto-sent to the client 24 hours before check-in.',
    netPayoutAmount: '£8,240',
    scheduledReleaseDateDisplay: '2 April 2024',
    payoutStatusBadge: 'Scheduled',
    payoutScheduledLine: 'Payout scheduled — releasing on 2 Apr 2024',
    showCheckInInstructionsActionBanner: true,
  },
  '3': {
    checkInDisplay: '10 Apr 2024',
    checkOutDisplay: '5 Jun 2024',
    nights: 56,
    clientCompany: 'Globex Holdings Ltd',
    propertyAddress: '88 Riverside Court, Leeds LS1 4DY',
    totalBookingValueGross: '£5,320',
    checkInInstructions:
      'No instructions added yet. These will be auto-sent to the client 24 hours before check-in.',
    netPayoutAmount: '£5,320',
    scheduledReleaseDateDisplay: '11 April 2024',
    payoutStatusBadge: 'Scheduled',
    payoutScheduledLine: 'Payout scheduled — releasing on 11 Apr 2024',
    showCheckInInstructionsActionBanner: true,
  },
  '4': {
    checkInDisplay: '1 Oct 2024',
    checkOutDisplay: '31 Dec 2024',
    nights: 92,
    clientCompany: 'Sterling Facilities Group',
    propertyAddress: 'Queens Terrace, Newcastle NE1 5BF',
    totalBookingValueGross: '£8,100',
    checkInInstructions:
      'No instructions added yet. These will be auto-sent to the client 24 hours before check-in.',
    checkInAccessMethod: '—',
    checkInKeyLockboxCode: '—',
    checkInParking: '—',
    checkInArrivalNotes: '—',
    netPayoutAmount: '£3,850',
    scheduledReleaseDateDisplay: '1 March 2024',
    payoutStatusBadge: 'Released',
    payoutScheduledLine: 'Payout released on 16 Mar 2024',
    showCheckInInstructionsActionBanner: false,
  },
  '5': {
    checkInDisplay: '12 May 2024',
    checkOutDisplay: '12 Jul 2024',
    nights: 61,
    clientCompany: 'Contoso Council',
    propertyAddress: 'Canal View Suites, Birmingham B1 2JP',
    totalBookingValueGross: '£3,200',
    checkInInstructions:
      'No instructions added yet. These will be auto-sent to the client 24 hours before check-in.',
    netPayoutAmount: '—',
    scheduledReleaseDateDisplay: '—',
    payoutStatusBadge: 'Cancelled',
    payoutScheduledLine: 'No payout — booking cancelled.',
    showCheckInInstructionsActionBanner: false,
  },
};

/** Default list rows — same order as static detail params. */
export const DEFAULT_PARTNER_BOOKINGS: PartnerMyBookingRow[] = BASE_ROWS;

export function bookingStatusPillClass(status: PartnerMyBookingRowStatus): string {
  switch (status) {
    case 'checked-in':
      return 'bg-[#0B1D37] text-white';
    case 'confirmed':
      return 'bg-[#00BAB5] text-white';
    case 'in-progress':
      return 'bg-[#E8A23E] text-white';
    case 'completed':
      return 'bg-[#E9EAEB] text-[#4B4E53]';
    case 'cancelled':
      return 'bg-[#f6f6f4] text-[#F04438]';
  }
}

/** Teal pills for Scheduled / Released on payout card; neutral / warning otherwise */
export function partnerBookingPayoutBadgeClass(badge: string): string {
  const b = badge.trim().toLowerCase();
  if (b === 'scheduled' || b === 'released') return 'bg-booking-teal text-white';
  if (b === 'paid') return 'bg-[#E9EAEB] text-[#4B4E53]';
  return 'bg-[#f6f6f4] text-[#F04438]';
}

export function bookingStatusLabel(status: PartnerMyBookingRowStatus): string {
  switch (status) {
    case 'checked-in':
      return 'Checked In';
    case 'confirmed':
      return 'Confirmed';
    case 'in-progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
  }
}

export function getPartnerBookingDetailByRowId(rowId: string): PartnerBookingDetail | undefined {
  const row = BASE_ROWS.find((r) => r.id === rowId);
  const ext = DETAIL_BY_ROW_ID[rowId];
  if (!row || !ext) return undefined;
  return { ...row, ...ext };
}
