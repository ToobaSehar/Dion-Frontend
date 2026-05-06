'use client';

import BookingRequestFlow from '@/components/booking-request/BookingRequestFlow';
import { cn } from '@/lib/utils';

export type ClientPortalNewRequestViewProps = {
  className?: string;
};

/** New Request — same `BookingRequestFlow` as `/booking-request`, embedded in the Figma client shell (white card variant). */
export function ClientPortalNewRequestView({ className }: ClientPortalNewRequestViewProps) {
  return (
    <div className={cn('flex w-full flex-col px-4 pb-20 sm:px-8 sm:pb-24', className)} aria-label="New booking request">
      <BookingRequestFlow variant="clientPortalShell" />
    </div>
  );
}
