/**
 * Main content + sidebar selection for the admin portal Figma shell (`/admin/portal-figma`).
 */
export type AdminPortalFigmaMainView =
  | 'dashboard'
  | 'alerts'
  | 'requests'
  | 'bookings'
  | 'payments'
  | 'payouts'
  | 'clients'
  | 'partners'
  | 'properties';

/** Deep-link tab when returning from `/admin/portal-figma/requests/[id]` (static export–friendly client read). */
export const ADMIN_PORTAL_FIGMA_VIEW_QUERY_KEY = 'view' as const;

const ADMIN_PORTAL_FIGMA_MAIN_VIEWS: readonly AdminPortalFigmaMainView[] = [
  'dashboard',
  'alerts',
  'requests',
  'bookings',
  'payments',
  'payouts',
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

/** Tab deep-link for `/admin/portal-figma` (used when leaving request detail). */
export function buildAdminPortalFigmaHubHrefWithView(view: AdminPortalFigmaMainView): string {
  return `/admin/portal-figma?${ADMIN_PORTAL_FIGMA_VIEW_QUERY_KEY}=${encodeURIComponent(view)}`;
}
