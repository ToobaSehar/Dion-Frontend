/**
 * Main content + sidebar selection for the admin portal Figma shell (`/admin/portal-figma`).
 */

import {
  ADMIN_PORTAL_BOOKINGS_TAB_ITEMS,
  type AdminPortalBookingsFilterTab,
} from '@/components/client-portal-figma/AdminPortalBookingsStatusPills';

export type AdminPortalFigmaMainView =
  | 'dashboard'
  | 'alerts'
  | 'requests'
  | 'bookings'
  | 'payments'
  | 'payouts'
  | 'invoices'
  | 'clients'
  | 'partners'
  | 'properties';

/** Deep-link tab when returning from `/admin/portal-figma/requests/[id]` (static export–friendly client read). */
export const ADMIN_PORTAL_FIGMA_VIEW_QUERY_KEY = 'view' as const;

/** When `view=bookings`, optional filter tab for the directory (`AdminPortalBookingsStatusPills`). */
export const ADMIN_PORTAL_FIGMA_BOOKINGS_FILTER_QUERY_KEY = 'bookingsStatus' as const;

const BOOKINGS_FILTER_IDS = new Set(
  ADMIN_PORTAL_BOOKINGS_TAB_ITEMS.map((t) => t.id as AdminPortalBookingsFilterTab),
);

export function parseAdminPortalBookingsFilterParam(
  raw: string | null | undefined,
): AdminPortalBookingsFilterTab | null {
  if (raw == null || raw === '') return null;
  return BOOKINGS_FILTER_IDS.has(raw as AdminPortalBookingsFilterTab) ? (raw as AdminPortalBookingsFilterTab) : null;
}

const ADMIN_PORTAL_FIGMA_MAIN_VIEWS: readonly AdminPortalFigmaMainView[] = [
  'dashboard',
  'alerts',
  'requests',
  'bookings',
  'payments',
  'payouts',
  'invoices',
  'clients',
  'partners',
  'properties',
] as const;

export function parseAdminPortalMainViewParam(raw: string | null | undefined): AdminPortalFigmaMainView | null {
  if (raw == null || raw === '') return null;
  return (ADMIN_PORTAL_FIGMA_MAIN_VIEWS as readonly string[]).includes(raw)
    ? (raw as AdminPortalFigmaMainView)
    : null;
}

export type BuildAdminPortalFigmaHubOptions = {
  /** When navigating to the hub **Bookings** view, pre-select this status tab (omit or `all` for no query param). */
  bookingsStatus?: AdminPortalBookingsFilterTab;
};

/** Tab deep-link for `/admin/portal-figma` (used when leaving request / booking / partner detail). */
export function buildAdminPortalFigmaHubHrefWithView(
  view: AdminPortalFigmaMainView,
  options?: BuildAdminPortalFigmaHubOptions,
): string {
  const params = new URLSearchParams();
  params.set(ADMIN_PORTAL_FIGMA_VIEW_QUERY_KEY, view);
  if (
    view === 'bookings' &&
    options?.bookingsStatus != null &&
    options.bookingsStatus !== 'all'
  ) {
    params.set(ADMIN_PORTAL_FIGMA_BOOKINGS_FILTER_QUERY_KEY, options.bookingsStatus);
  }
  return `/admin/portal-figma?${params.toString()}`;
}

/** Booking detail at `/admin/portal-figma/bookings/[bookingRowId]` (same pattern as partner `/payouts/[payoutRowId]`). */
export function adminPortalBookingDetailHref(bookingRowId: string): string {
  return `/admin/portal-figma/bookings/${encodeURIComponent(bookingRowId)}`;
}

/** Request detail at `/admin/portal-figma/requests/[id]`. */
export function adminPortalRequestDetailHref(requestId: string): string {
  return `/admin/portal-figma/requests/${encodeURIComponent(requestId)}`;
}

/** Partner detail at `/admin/portal-figma/partners/[partnerId]`. */
export function adminPortalPartnerDetailHref(partnerId: string): string {
  return `/admin/portal-figma/partners/${encodeURIComponent(partnerId)}`;
}

/** Client detail at `/admin/portal-figma/clients/[clientId]`. */
export function adminPortalClientDetailHref(clientId: string): string {
  return `/admin/portal-figma/clients/${encodeURIComponent(clientId)}`;
}
