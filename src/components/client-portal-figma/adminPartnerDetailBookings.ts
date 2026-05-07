export type AdminPartnerDetailBookingRowStatus = 'checked-in' | 'confirmed' | 'completed';

export type AdminPartnerDetailBookingRow = {
  id: string;
  /** Mock row id for `/admin/portal-figma/bookings/[bookingRowId]`. */
  bookingRowId: string;
  reference: string;
  /** Company / client label as shown in partner bookings directory. */
  client: string;
  property: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
  status: AdminPartnerDetailBookingRowStatus;
};

/** Curated **City Living Ltd** (partner mock id `1`) — matches partner-detail Bookings tab design. */
const CITY_LIVING_BOOKING_ROWS: AdminPartnerDetailBookingRow[] = [
  {
    id: 'pb-cl-1',
    bookingRowId: 'partner-bk-0891',
    reference: 'BK-2024-0891',
    client: 'Acme Council',
    property: 'Victoria Apartments',
    checkIn: '1 Apr 2024',
    checkOut: '30 Jun 2024',
    totalAmount: '£8,856',
    status: 'checked-in',
  },
  {
    id: 'pb-cl-2',
    bookingRowId: 'partner-bk-0887',
    reference: 'BK-2024-0887',
    client: 'Northern Housing',
    property: 'London Bridge Apartments',
    checkIn: '10 Apr 2024',
    checkOut: '10 Jul 2024',
    totalAmount: '£7,956',
    status: 'confirmed',
  },
  {
    id: 'pb-cl-3',
    bookingRowId: '1',
    reference: 'BK-2024-0830',
    client: 'Midlands Corp',
    property: 'Battersea Rise House',
    checkIn: '1 Feb 2024',
    checkOut: '1 Mar 2024',
    totalAmount: '£7,200',
    status: 'completed',
  },
  {
    id: 'pb-cl-4',
    bookingRowId: 'partner-bk-0756',
    reference: 'BK-2024-0756',
    client: 'Capital Relocations',
    property: 'Victoria Apartments',
    checkIn: '1 Jan 2024',
    checkOut: '28 Feb 2024',
    totalAmount: '£11,340',
    status: 'completed',
  },
];

export function getAdminPartnerDetailBookingRows(partnerId: string): AdminPartnerDetailBookingRow[] {
  if (partnerId === '1') {
    return CITY_LIVING_BOOKING_ROWS;
  }
  return [];
}

export function partnerDetailBookingStatusBadgeClass(status: AdminPartnerDetailBookingRowStatus): string {
  switch (status) {
    case 'checked-in':
      return 'bg-[#0B1D37] text-white';
    case 'confirmed':
      return 'bg-[#00BAB5] text-white';
    case 'completed':
      return 'bg-[#E9EAEB] text-[#4B4E53]';
  }
}

export function partnerDetailBookingStatusLabel(status: AdminPartnerDetailBookingRowStatus): string {
  switch (status) {
    case 'checked-in':
      return 'Checked In';
    case 'confirmed':
      return 'Confirmed';
    case 'completed':
      return 'Completed';
  }
}
