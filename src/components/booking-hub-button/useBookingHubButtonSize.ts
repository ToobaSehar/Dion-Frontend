'use client';

import { useSyncExternalStore } from 'react';
import type { BookingHubButtonSize } from './bookingHubButtonTypes';

/**
 * Maps viewport width to hub button size — aligned with Tailwind `screens` (default theme):
 * - **below md (768px)** → `sm` (phones / narrow)
 * - **md – lg** → `md` (tablet)
 * - **lg – xl** → `lg` (laptop)
 * - **≥ xl (1280px)** → `xl` (desktop)
 */
function getBookingHubButtonSizeFromWindow(): BookingHubButtonSize {
  if (typeof window === 'undefined') return 'md';
  if (window.matchMedia('(min-width: 1280px)').matches) return 'xl';
  if (window.matchMedia('(min-width: 1024px)').matches) return 'lg';
  if (window.matchMedia('(min-width: 768px)').matches) return 'md';
  return 'sm';
}

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const queries = [
    window.matchMedia('(min-width: 1280px)'),
    window.matchMedia('(min-width: 1024px)'),
    window.matchMedia('(min-width: 768px)'),
  ];
  queries.forEach((mq) => mq.addEventListener('change', onChange));
  return () => queries.forEach((mq) => mq.removeEventListener('change', onChange));
}

/**
 * Responsive `BookingHubButtonSize` for use with hub buttons when you need a **fixed** `size` prop from JS.
 * For **no layout shift** (SSR + hydration + all browsers), prefer **`responsive`** on the button components
 * (CSS breakpoints) instead of this hook — see `BookingHubButtonBaseProps['responsive']`.
 * Server snapshot is `md`; client may differ → one-frame jump if used for dimensions.
 */
export function useBookingHubButtonSize(): BookingHubButtonSize {
  return useSyncExternalStore(subscribe, getBookingHubButtonSizeFromWindow, () => 'md');
}
