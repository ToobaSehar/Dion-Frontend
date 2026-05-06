import type { AdminPortalBookingRowStatus, AdminPortalBookingTableRow } from '@/components/client-portal-figma/AdminPortalBookingsView';
import type { AdminPortalPaymentRowStatus, AdminPortalPaymentTableRow } from '@/components/client-portal-figma/AdminPortalPaymentsView';

const PARTNER_NAMES = [
  'Urban Stay Group',
  'Haven Properties',
  'Metro Lettings',
  'Aspire Apartments',
  'City Living Ltd',
] as const;

function partnerNameForProperty(property: string): string {
  let n = 0;
  for (let i = 0; i < property.length; i++) n += property.charCodeAt(i);
  return PARTNER_NAMES[n % PARTNER_NAMES.length]!;
}

function bookingStatusFromPaymentStatus(status: AdminPortalPaymentRowStatus): AdminPortalBookingRowStatus {
  switch (status) {
    case 'paid':
      return 'completed';
    case 'pending':
    case 'overdue':
      return 'awaiting-payment';
    case 'failed':
      return 'cancelled';
    case 'refunded':
      return 'completed';
  }
}

/**
 * Maps a payments table row to a synthetic booking row so `resolveAdminBookingDetailFromPayment`
 * can render booking detail that matches the payment line (not curated presets by ref alone).
 */
export function bookingTableRowFromPaymentRow(payment: AdminPortalPaymentTableRow): AdminPortalBookingTableRow {
  return {
    id: `payment-open-${payment.id}`,
    reference: payment.bookingRef,
    bookingGroup: null,
    client: payment.client,
    company: payment.company,
    partner: partnerNameForProperty(payment.property),
    property: payment.property,
    checkIn: payment.dueDate,
    totalAmount: payment.totalAmount,
    status: bookingStatusFromPaymentStatus(payment.status),
  };
}
