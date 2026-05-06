/**
 * Paths pre-rendered for `/requests/[id]` when using `output: 'export'`.
 * Keep in sync with mock row `id` values in `AdminPortalRequestsView` (`MOCK_ROWS`).
 */
export const ADMIN_PORTAL_REQUEST_STATIC_PARAM_IDS = [
  /** Rich demo row (`DETAIL_BY_REFERENCE`); URL uses dummy id `99`, not a real booking id. */
  '99',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
] as const;
