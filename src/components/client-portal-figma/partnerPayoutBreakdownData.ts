/**
 * Static payout breakdown rows paired with `partnerPortalPayoutsDefaultTableRows[].id`
 * until API wiring.
 */

import type { PartnerPayoutRowStatus } from '@/components/client-portal-figma/PartnerPortalPayoutsView';

export type PartnerPayoutBreakdownDetail = {
  payoutRowId: string;
  bookingRef: string;
  propertyName: string;
  status: PartnerPayoutRowStatus;
  statusLabel: string;
  accommodationExcVat: string;
  vatOnAccommodation: string;
  /** Renders VAT accommodation line as muted secondary copy (e.g. “Not applicable”). */
  vatOnAccommodationMuted?: boolean;
  totalClientPays: string;
  commission: string;
  vatOnCommission: string;
  stripeFee: string;
  netPayout: string;
  /** When true, show primary “Generate VAT Invoice for Client” CTA (held / failed shells). */
  showGenerateVatInvoiceButton?: boolean;
  /** “Payout Status” summary card — primary value (short label). */
  payoutStatusSummaryValue: string;
  /** “Payout Status” card — release date column (em dash when none). */
  payoutReleaseDateSummary: string;
  /** Footnote under payout status grid (e.g. Stripe onboarding). */
  payoutStatusFooterNote?: string;
  bookingCheckInDisplay: string;
  bookingCheckOutDisplay: string;
  bookingGuestsDisplay: string;
  bookingTotalValueDisplay: string;
};

const DETAIL_BY_ROW_ID: Record<string, PartnerPayoutBreakdownDetail> = {
  '2': {
    payoutRowId: '2',
    bookingRef: 'BH-2024-0912',
    propertyName: 'Northern Quarter Studio',
    status: 'held',
    statusLabel: 'Held – releases after check-in',
    accommodationExcVat: '£1,208.33',
    vatOnAccommodation: '£241.67',
    totalClientPays: '£1,450.00',
    commission: '-£217.50',
    vatOnCommission: '-£43.50',
    stripeFee: '-£20.50',
    netPayout: '£1,168.50',
    showGenerateVatInvoiceButton: true,
    payoutStatusSummaryValue: 'Held',
    payoutReleaseDateSummary: '24 Mar 2024',
    payoutStatusFooterNote:
      'This payout is held until guest check-in. It will move to scheduled release after check-in is confirmed.',
    bookingCheckInDisplay: '23 March 2024',
    bookingCheckOutDisplay: '22 April 2024',
    bookingGuestsDisplay: '4',
    bookingTotalValueDisplay: '£1,450.00',
  },
  '3': {
    payoutRowId: '3',
    bookingRef: 'BH-2024-0756',
    propertyName: 'City Centre Apartment',
    status: 'released',
    statusLabel: 'Released',
    accommodationExcVat: '£3,850.00',
    vatOnAccommodation: 'Not applicable',
    vatOnAccommodationMuted: true,
    totalClientPays: '£3,850.00',
    commission: '-£577.50',
    vatOnCommission: '-£115.50',
    stripeFee: '-£54.10',
    netPayout: '£3,102.90',
    showGenerateVatInvoiceButton: false,
    payoutStatusSummaryValue: 'Released',
    payoutReleaseDateSummary: '6 Jan 2024',
    payoutStatusFooterNote: 'Payout released on 6 Jan 2024.',
    bookingCheckInDisplay: '5 January 2024',
    bookingCheckOutDisplay: '15 February 2024',
    bookingGuestsDisplay: '3',
    bookingTotalValueDisplay: '£3,850.00',
  },
  '4': {
    payoutRowId: '4',
    bookingRef: 'BH-2024-0698',
    propertyName: 'Northern Quarter Studio',
    status: 'failed',
    statusLabel: 'Failed – contact Booking Hub',
    accommodationExcVat: '£1,833.33',
    vatOnAccommodation: '£366.67',
    totalClientPays: '£2,200.00',
    commission: '-£330.00',
    vatOnCommission: '-£66.00',
    stripeFee: '-£31.00',
    netPayout: '£1,773.00',
    showGenerateVatInvoiceButton: true,
    payoutStatusSummaryValue: 'Failed',
    payoutReleaseDateSummary: '2 Feb 2024',
    payoutStatusFooterNote:
      'This payout could not be completed. Contact Booking Hub if you need help resolving this issue.',
    bookingCheckInDisplay: '1 February 2024',
    bookingCheckOutDisplay: '28 February 2024',
    bookingGuestsDisplay: '2',
    bookingTotalValueDisplay: '£2,200.00',
  },
  '5': {
    payoutRowId: '5',
    bookingRef: 'BH-2024-0601',
    propertyName: 'City Centre Apartment',
    status: 'blocked',
    statusLabel: 'Blocked – complete Stripe onboarding',
    accommodationExcVat: '£980.00',
    vatOnAccommodation: 'Not applicable',
    vatOnAccommodationMuted: true,
    totalClientPays: '£980.00',
    commission: '-£147.00',
    vatOnCommission: '-£29.40',
    stripeFee: '-£13.77',
    netPayout: '£789.83',
    showGenerateVatInvoiceButton: false,
    payoutStatusSummaryValue: 'Blocked',
    payoutReleaseDateSummary: '—',
    payoutStatusFooterNote: 'Complete your Stripe onboarding to receive this payout.',
    bookingCheckInDisplay: '10 April 2024',
    bookingCheckOutDisplay: '8 May 2024',
    bookingGuestsDisplay: '1',
    bookingTotalValueDisplay: '£980.00',
  },
};

export function partnerPayoutBreakdownHref(payoutRowId: string): string {
  return `/payouts/${encodeURIComponent(payoutRowId)}`;
}

export function getPartnerPayoutBreakdownByRowId(rowId: string): PartnerPayoutBreakdownDetail | undefined {
  return DETAIL_BY_ROW_ID[rowId];
}

export function partnerPayoutBreakdownHasDetail(rowId: string): boolean {
  return Boolean(DETAIL_BY_ROW_ID[rowId]);
}
