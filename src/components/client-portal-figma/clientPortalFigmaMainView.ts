/**
 * Main content column view for the client portal Figma shell (sidebar + dashboard).
 * Drives which block is shown beside the sidebar.
 */
export type ClientPortalFigmaMainView =
  | 'dashboard'
  | 'payments'
  | 'make-payment'
  | 'new-request'
  | 'my-requests'
  | 'my-bookings'
  | 'notifications'
  | 'settings'
  | 'request-detail'
  | 'request-confirm'
  | 'request-amendment'
  | 'extend-rebook';

/** `/client` search param — read once on hub load to open the matching tab, then stripped from the URL. */
export const CLIENT_PORTAL_HUB_VIEW_QUERY_KEY = 'view' as const;

export const CLIENT_PORTAL_HUB_MY_REQUESTS_HREF = '/client?view=my-requests' as const;

export const CLIENT_PORTAL_HUB_MY_BOOKINGS_HREF = '/client?view=my-bookings' as const;
