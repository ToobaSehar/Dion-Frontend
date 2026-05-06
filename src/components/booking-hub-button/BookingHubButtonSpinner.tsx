import { cn } from '@/lib/utils';

/**
 * **20×20** slot — matches Figma `Buttons/Button loading icon` (see
 * `booking-hub-primary-button-states-focused-disabled-loading.md` §7):
 * full track @ **30%** opacity + **90°** arc (**2** px stroke, **round** caps), `currentColor` **#00e9e3** on Primary.
 */
export function BookingHubButtonSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('size-5 shrink-0 animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 20"
      width={20}
      height={20}
      aria-hidden
    >
      <circle
        cx="10"
        cy="10"
        r="9"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.3}
      />
      {/*
        Arc from 270° → 360° (Figma `Line` ellipse): start (10,1), end (19,10), r=9.
      */}
      <path
        d="M 10 1 A 9 9 0 0 1 19 10"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
