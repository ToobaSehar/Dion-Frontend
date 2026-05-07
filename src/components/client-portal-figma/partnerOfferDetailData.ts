/** Shared fields for single-property offer detail mocks (submitted + unsuccessful). */
export type PartnerSinglePropertyOfferShared = {
  offerId: string;
  statusLabel: string;
  statusBadgeClass: string;
  metaLocation: string;
  metaGuestsLabel: string;
  metaNightsLabel: string;
  metaBudgetLabel: string;
  requestSummary: {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    submittedDate: string;
    availabilityConfirmed: boolean;
  };
  propertyOffered: {
    name: string;
    address: string;
    roomSummary: string;
    vatMode: 'no-vat' | 'vat';
    nightlyRate: string;
    nights: number;
    subtotal: string;
    propertyTotal: string;
    partnerNote: string;
  };
  offerSummary: {
    propertyName: string;
    nights: number;
    nightlyRate: string;
    lineTotal: string;
    noVatNote: string;
    accommodationTotal: string;
    vatTotal: string;
    totalOfferValue: string;
  };
  commissionFooter: string;
};

/** Submitted offer — single property + calculator summary (Figma mock). */
export type PartnerSubmittedOfferDetailContent = PartnerSinglePropertyOfferShared & { kind: 'submitted' };

/** Unsuccessful offer — same layout; Offer Summary uses document icon (Figma mock). */
export type PartnerUnsuccessfulOfferDetailContent = PartnerSinglePropertyOfferShared & { kind: 'unsuccessful' };

/** Accepted offer — multiple properties + document summary + View Booking (Figma mock). */
export type PartnerAcceptedOfferPropertyCard = {
  id: string;
  name: string;
  address: string;
  roomSummary: string;
  nightlyRate: string;
  nights: number;
  subtotal: string;
  vatAmount: string;
  vatNumber: string;
  propertyTotal: string;
  partnerNote?: string;
};

export type PartnerAcceptedOfferSummaryBlock = {
  propertyName: string;
  nights: number;
  nightlyRate: string;
  netAmount: string;
  vatAmount: string;
  propertyTotal: string;
};

export type PartnerAcceptedOfferDetailContent = {
  kind: 'accepted';
  offerId: string;
  statusLabel: string;
  statusBadgeClass: string;
  metaLocation: string;
  metaGuestsLabel: string;
  metaNightsLabel: string;
  metaBudgetLabel: string;
  referenceId: string;
  requestSummary: PartnerSinglePropertyOfferShared['requestSummary'];
  properties: PartnerAcceptedOfferPropertyCard[];
  offerSummaryBlocks: PartnerAcceptedOfferSummaryBlock[];
  accommodationTotal: string;
  vatTotal: string;
  totalOfferValue: string;
  commissionFooter: string;
  /** Partner booking row id (`/partner/dashboard/bookings/[id]`). */
  viewBookingRowId: string;
};

export type PartnerOfferDetailUnion =
  | PartnerSubmittedOfferDetailContent
  | PartnerAcceptedOfferDetailContent
  | PartnerUnsuccessfulOfferDetailContent;

/** Fills only — same tokens as `PartnerMyOffersView` `offerStatusPillClass`; pill shell applied in the view. */
const OFFER_STATUS_PILL_SUBMITTED = 'bg-[#E8A23E] text-white';
const OFFER_STATUS_PILL_ACCEPTED = 'bg-[#00BAB5] text-white';
const OFFER_STATUS_PILL_UNSUCCESSFUL = 'bg-[#F6F6F4] text-[#4B4E53]';

const DETAIL_BY_OFFER_ID: Record<string, PartnerOfferDetailUnion> = {
  '2': {
    kind: 'accepted',
    offerId: '2',
    statusLabel: 'Accepted',
    statusBadgeClass: OFFER_STATUS_PILL_ACCEPTED,
    metaLocation: 'Birmingham',
    metaGuestsLabel: '4 guests',
    metaNightsLabel: '92 nights',
    metaBudgetLabel: '£130/night budget',
    referenceId: 'BH-2024-0834',
    requestSummary: {
      location: 'Birmingham',
      checkIn: '1 May 2024',
      checkOut: '1 Aug 2024',
      guests: '4',
      submittedDate: '15 Feb 2024',
      availabilityConfirmed: true,
    },
    properties: [
      {
        id: 'p1',
        name: 'City Centre Apartment',
        address: '22 Colmore Row, Birmingham B3 2BH',
        roomSummary: '2 beds · Apartment · 2 guests',
        nightlyRate: '£95.00',
        nights: 92,
        subtotal: '£8740.00',
        vatAmount: '£1748.00',
        vatNumber: 'GB123456789',
        propertyTotal: '£10488.00',
      },
      {
        id: 'p2',
        name: 'Castlefield Townhouse',
        address: '8 Brindleyplace, Birmingham B1 2HL',
        roomSummary: '3 beds · Townhouse · 4 guests',
        nightlyRate: '£120.00',
        nights: 92,
        subtotal: '£11040.00',
        vatAmount: '£2208.00',
        vatNumber: 'GB123456789',
        propertyTotal: '£13248.00',
        partnerNote: 'Parking available on-site.',
      },
    ],
    offerSummaryBlocks: [
      {
        propertyName: 'City Centre Apartment',
        nights: 92,
        nightlyRate: '£95.00',
        netAmount: '£8740.00',
        vatAmount: '£1748.00',
        propertyTotal: '£10488.00',
      },
      {
        propertyName: 'Castlefield Townhouse',
        nights: 92,
        nightlyRate: '£120.00',
        netAmount: '£11040.00',
        vatAmount: '£2208.00',
        propertyTotal: '£13248.00',
      },
    ],
    accommodationTotal: '£19780.00',
    vatTotal: '£3956.00',
    totalOfferValue: '£23736.00',
    commissionFooter:
      'Booking Hub commission (15% + VAT) and payment processing fees will be deducted from your payout',
    viewBookingRowId: '1',
  },
  '5': {
    kind: 'submitted',
    offerId: '5',
    statusLabel: 'Submitted',
    statusBadgeClass: OFFER_STATUS_PILL_SUBMITTED,
    metaLocation: 'Leeds',
    metaGuestsLabel: '3 guests',
    metaNightsLabel: '84 nights',
    metaBudgetLabel: '£120/night budget',
    requestSummary: {
      location: 'Leeds',
      checkIn: '1 Apr 2024',
      checkOut: '24 Jun 2024',
      guests: '3',
      submittedDate: '18 Feb 2024',
      availabilityConfirmed: true,
    },
    propertyOffered: {
      name: 'Northern Quarter Studio',
      address: '28 Hilton St, Leeds LS1 4DL',
      roomSummary: '1 beds · Studio · 2 guests',
      vatMode: 'no-vat',
      nightlyRate: '£110.00',
      nights: 84,
      subtotal: '£9240.00',
      propertyTotal: '£9240.00',
      partnerNote: 'Central location, ideal for short commutes.',
    },
    offerSummary: {
      propertyName: 'Northern Quarter Studio',
      nights: 84,
      nightlyRate: '£110.00',
      lineTotal: '£9240.00',
      noVatNote: 'No VAT applicable',
      accommodationTotal: '£9240.00',
      vatTotal: '£0.00',
      totalOfferValue: '£9240.00',
    },
    commissionFooter:
      'Booking Hub commission (15% + VAT) and payment processing fees will be deducted from your payout',
  },
  '1': {
    kind: 'submitted',
    offerId: '1',
    statusLabel: 'Submitted',
    statusBadgeClass: OFFER_STATUS_PILL_SUBMITTED,
    metaLocation: 'Manchester',
    metaGuestsLabel: '2 guests',
    metaNightsLabel: '56 nights',
    metaBudgetLabel: '£80/night budget',
    requestSummary: {
      location: 'Manchester',
      checkIn: '15 Mar 2024',
      checkOut: '10 May 2024',
      guests: '2',
      submittedDate: '20 Feb 2024',
      availabilityConfirmed: true,
    },
    propertyOffered: {
      name: 'City Centre Apartment',
      address: '42 Deansgate, Manchester M3 2BW',
      roomSummary: '2 beds · Apartment · 2 guests',
      vatMode: 'vat',
      nightlyRate: '£78.00',
      nights: 56,
      subtotal: '£4368.00',
      propertyTotal: '£4368.00',
      partnerNote: 'Close to transport links and city centre amenities.',
    },
    offerSummary: {
      propertyName: 'City Centre Apartment',
      nights: 56,
      nightlyRate: '£78.00',
      lineTotal: '£4368.00',
      noVatNote: 'VAT applied at property rate where applicable',
      accommodationTotal: '£4368.00',
      vatTotal: '£873.60',
      totalOfferValue: '£5241.60',
    },
    commissionFooter:
      'Booking Hub commission (15% + VAT) and payment processing fees will be deducted from your payout',
  },
  '3': {
    kind: 'submitted',
    offerId: '3',
    statusLabel: 'Submitted',
    statusBadgeClass: OFFER_STATUS_PILL_SUBMITTED,
    metaLocation: 'Birmingham',
    metaGuestsLabel: '4 guests',
    metaNightsLabel: '91 nights',
    metaBudgetLabel: '£72/night budget',
    requestSummary: {
      location: 'Birmingham',
      checkIn: '10 Apr 2024',
      checkOut: '10 Jul 2024',
      guests: '4',
      submittedDate: '5 Mar 2024',
      availabilityConfirmed: true,
    },
    propertyOffered: {
      name: 'Victoria House',
      address: '18 Victoria Square, Birmingham B1 1BD',
      roomSummary: '3 beds · House · 4 guests',
      vatMode: 'vat',
      nightlyRate: '£70.00',
      nights: 91,
      subtotal: '£6370.00',
      propertyTotal: '£6370.00',
      partnerNote: 'Quiet residential street with allocated parking.',
    },
    offerSummary: {
      propertyName: 'Victoria House',
      nights: 91,
      nightlyRate: '£70.00',
      lineTotal: '£6370.00',
      noVatNote: 'VAT applied at property rate where applicable',
      accommodationTotal: '£6370.00',
      vatTotal: '£1274.00',
      totalOfferValue: '£7644.00',
    },
    commissionFooter:
      'Booking Hub commission (15% + VAT) and payment processing fees will be deducted from your payout',
  },
  '4': {
    kind: 'unsuccessful',
    offerId: '4',
    statusLabel: 'Unsuccessful',
    statusBadgeClass: OFFER_STATUS_PILL_UNSUCCESSFUL,
    metaLocation: 'Manchester',
    metaGuestsLabel: '2 guests',
    metaNightsLabel: '28 nights',
    metaBudgetLabel: '£70/night budget',
    requestSummary: {
      location: 'Manchester',
      checkIn: '20 Mar 2024',
      checkOut: '17 Apr 2024',
      guests: '2',
      submittedDate: '10 Feb 2024',
      availabilityConfirmed: true,
    },
    propertyOffered: {
      name: 'Northern Quarter Studio',
      address: '28 Hilton St, Manchester M1 1JQ',
      roomSummary: '1 beds · Studio · 2 guests',
      vatMode: 'no-vat',
      nightlyRate: '£65.00',
      nights: 28,
      subtotal: '£1820.00',
      propertyTotal: '£1820.00',
      partnerNote: '',
    },
    offerSummary: {
      propertyName: 'Northern Quarter Studio',
      nights: 28,
      nightlyRate: '£65.00',
      lineTotal: '£1820.00',
      noVatNote: 'No VAT applicable',
      accommodationTotal: '£1820.00',
      vatTotal: '£0.00',
      totalOfferValue: '£1820.00',
    },
    commissionFooter:
      'Booking Hub commission (15% + VAT) and payment processing fees will be deducted from your payout',
  },
};

export function getPartnerOfferDetailByOfferId(offerId: string): PartnerOfferDetailUnion | null {
  return DETAIL_BY_OFFER_ID[offerId] ?? null;
}
