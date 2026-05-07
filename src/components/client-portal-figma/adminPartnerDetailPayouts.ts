export type AdminPartnerDetailPayoutStatus = 'scheduled' | 'hold' | 'released';

export type AdminPartnerDetailPayoutAction = 'hold' | 'release' | null;

export type AdminPartnerDetailPayoutRow = {
  id: string;
  bookingRef: string;
  property: string;
  checkIn: string;
  netPayout: string;
  status: AdminPartnerDetailPayoutStatus;
  scheduledDate: string;
  action: AdminPartnerDetailPayoutAction;
};

/** Curated **City Living Ltd** (partner mock id `1`) — matches partner-detail Payouts tab design. */
const CITY_LIVING_PAYOUT_ROWS: AdminPartnerDetailPayoutRow[] = [
  {
    id: 'pp-cl-1',
    bookingRef: 'BK-2024-0891',
    property: 'Victoria Apartments',
    checkIn: '1 Apr 2024',
    netPayout: '£6,642',
    status: 'scheduled',
    scheduledDate: '2 Apr 2024',
    action: 'hold',
  },
  {
    id: 'pp-cl-2',
    bookingRef: 'BK-2024-0887',
    property: 'London Bridge Apartments',
    checkIn: '10 Apr 2024',
    netPayout: '£5,967',
    status: 'hold',
    scheduledDate: '11 Apr 2024',
    action: 'release',
  },
  {
    id: 'pp-cl-3',
    bookingRef: 'BK-2024-0830',
    property: 'Battersea Rise House',
    checkIn: '1 Feb 2024',
    netPayout: '£5,400',
    status: 'released',
    scheduledDate: '2 Feb 2024',
    action: null,
  },
  {
    id: 'pp-cl-4',
    bookingRef: 'BK-2024-0756',
    property: 'Victoria Apartments',
    checkIn: '1 Jan 2024',
    netPayout: '£8,505',
    status: 'released',
    scheduledDate: '2 Jan 2024',
    action: null,
  },
];

export function getAdminPartnerDetailPayoutRows(partnerId: string): AdminPartnerDetailPayoutRow[] {
  if (partnerId === '1') {
    return CITY_LIVING_PAYOUT_ROWS;
  }
  return [];
}

export function partnerDetailPayoutStatusBadgeClass(status: AdminPartnerDetailPayoutStatus): string {
  switch (status) {
    case 'scheduled':
      return 'bg-[#0B1D37] text-white';
    case 'hold':
      return 'bg-[#F79009] text-white';
    case 'released':
      return 'bg-[#00BAB5] text-white';
  }
}

export function partnerDetailPayoutStatusLabel(status: AdminPartnerDetailPayoutStatus): string {
  switch (status) {
    case 'scheduled':
      return 'Scheduled';
    case 'hold':
      return 'Hold';
    case 'released':
      return 'Released';
  }
}
