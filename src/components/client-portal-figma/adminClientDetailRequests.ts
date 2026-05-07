import type { AdminPortalRequestRowStatus } from '@/components/client-portal-figma/AdminPortalRequestsView';

export type AdminClientDetailRequestRow = {
  id: string;
  /** Mock row id for `/admin/portal-figma/requests/[id]`. */
  requestRowId: string;
  reference: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: AdminPortalRequestRowStatus;
};

/** Curated **Acme Council** (client mock id `1`) — matches client-detail Requests tab design. */
const ACME_COUNCIL_REQUEST_ROWS: AdminClientDetailRequestRow[] = [
  {
    id: 'ac-rq-156',
    requestRowId: '99',
    reference: 'RQ-2024-0156',
    location: 'Bristol',
    checkIn: '15 Apr 2024',
    checkOut: '15 Jul 2024',
    guests: 2,
    status: 'new',
  },
  {
    id: 'ac-rq-155',
    requestRowId: '9',
    reference: 'RQ-2024-0155',
    location: 'Manchester',
    checkIn: '1 Apr 2024',
    checkOut: '30 Jun 2024',
    guests: 1,
    status: 'in-progress',
  },
];

export function getAdminClientDetailRequestRows(clientId: string): AdminClientDetailRequestRow[] {
  if (clientId === '1') {
    return ACME_COUNCIL_REQUEST_ROWS;
  }
  return [];
}
