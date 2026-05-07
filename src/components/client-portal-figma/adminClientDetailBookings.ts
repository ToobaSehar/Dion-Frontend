import type { AdminPartnerDetailBookingRowStatus } from '@/components/client-portal-figma/adminPartnerDetailBookings';

export type AdminClientDetailBookingRow = {
  id: string;
  bookingRowId: string;
  reference: string;
  property: string;
  partner: string;
  checkIn: string;
  totalAmount: string;
  status: AdminPartnerDetailBookingRowStatus;
};

/** Curated **Acme Council** (client mock id `1`) — matches client-detail Bookings tab design. */
const ACME_COUNCIL_CLIENT_BOOKING_ROWS: AdminClientDetailBookingRow[] = [
  {
    id: 'cb-ac-1',
    bookingRowId: 'partner-bk-0891',
    reference: 'BK-2024-0891',
    property: 'Victoria Apartments',
    partner: 'City Living Ltd',
    checkIn: '1 Apr 2024',
    totalAmount: '£8,856',
    status: 'checked-in',
  },
  {
    id: 'cb-ac-2',
    bookingRowId: 'partner-bk-0887',
    reference: 'BK-2024-0887',
    property: 'Station House',
    partner: 'Haven Properties',
    checkIn: '10 Apr 2024',
    totalAmount: '£7,956',
    status: 'confirmed',
  },
];

export function getAdminClientDetailBookingRows(clientId: string): AdminClientDetailBookingRow[] {
  if (clientId === '1') {
    return ACME_COUNCIL_CLIENT_BOOKING_ROWS;
  }
  return [];
}
