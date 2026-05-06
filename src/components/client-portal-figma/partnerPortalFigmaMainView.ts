/**
 * Main content + sidebar selection for the partner portal Figma shell (`/partner/dashboard`).
 */
export type PartnerPortalFigmaMainView =
  | 'dashboard'
  | 'requests-in-my-area'
  | 'my-offers'
  | 'my-bookings'
  | 'my-properties'
  | 'payouts'
  | 'contact-info'
  | 'notifications'
  | 'settings';

/** `/partner/dashboard` search param — deep-link main pane (e.g. after returning from submit offer). */
export const PARTNER_PORTAL_HUB_VIEW_QUERY_KEY = 'view' as const;

export const PARTNER_PORTAL_HUB_REQUESTS_IN_MY_AREA_HREF =
  `/partner/dashboard?${PARTNER_PORTAL_HUB_VIEW_QUERY_KEY}=requests-in-my-area` as const;

export const PARTNER_PORTAL_HUB_MY_BOOKINGS_HREF =
  `/partner/dashboard?${PARTNER_PORTAL_HUB_VIEW_QUERY_KEY}=my-bookings` as const;

/** Dedicated payouts hub (partner shell + payouts table). */
export const PARTNER_PORTAL_PAYOUTS_HREF = '/payouts' as const;

export function partnerHubMainViewFromSearchParam(raw: string | null): PartnerPortalFigmaMainView {
  if (!raw) return 'dashboard';
  switch (raw) {
    case 'requests-in-my-area':
    case 'my-offers':
    case 'my-bookings':
    case 'my-properties':
    case 'payouts':
    case 'notifications':
    case 'settings':
      return raw;
    default:
      return 'dashboard';
  }
}
