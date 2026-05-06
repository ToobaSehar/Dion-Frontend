import { differenceInDays } from 'date-fns';

export type BookingDateRange = { id: string; startDate: string; endDate: string };

export function formatDateForDisplay(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function parseYmd(dateString: string): Date {
  const [y, m, d] = dateString.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function totalNightsAcrossBookings(bookings: BookingDateRange[]): number {
  let total = 0;
  for (const b of bookings) {
    if (!b.startDate || !b.endDate) continue;
    const diff = differenceInDays(parseYmd(b.endDate), parseYmd(b.startDate));
    if (diff > 0) total += diff;
  }
  return total;
}
