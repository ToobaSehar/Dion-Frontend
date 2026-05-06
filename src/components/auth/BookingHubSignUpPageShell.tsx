'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { BH_GRID_SHELL_CLASSES } from '@/components/booking-hub-grid';
import {
  BH_HUB_AUTH_CARD_OUTER_COLUMN,
  BH_HUB_AUTH_CARD_PAGE_CLASSES,
} from '@/components/auth/bookingHubAuthCardShell';

export type BookingHubSignUpPageShellVariant = 'default' | 'hubCard';

/**
 * Login + client signup shell: page background `#F6F6F4` (Booking Hub off-white), decorative grid, content width aligned with
 * `BookingRequestFlow` form card (`max-w-2xl` / `lg:max-w-4xl` / `xl:max-w-5xl` + same horizontal padding)
 * so hub inputs match check-in / check-out field width.
 *
 * `hubCard` — same outer column + page chrome as public booking request (`#F6F6F4`, no decorative grid);
 * children should render hero outside + `BH_HUB_AUTH_CARD_WHITE` for the form block.
 */
function BookingHubSignUpDecorativeBackground() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-[-160px] size-[480px] -translate-x-1/2 select-none sm:top-[-220px] sm:size-[640px] md:top-[-264px] md:size-[768px]"
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e9eaeb 1px, transparent 1px),
            linear-gradient(to bottom, #e9eaeb 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}

export function BookingHubSignUpPageShell({
  children,
  variant = 'default',
}: {
  children: ReactNode;
  variant?: BookingHubSignUpPageShellVariant;
}) {
  if (variant === 'hubCard') {
    return (
      <div className={BH_HUB_AUTH_CARD_PAGE_CLASSES}>
        <div
          className={cn(
            'relative z-[1] flex w-full flex-col items-center text-[#0b1d37]',
            'justify-center md:justify-start',
            BH_GRID_SHELL_CLASSES,
            'py-6 sm:py-8 md:py-12 lg:py-16',
          )}
        >
          <div className={BH_HUB_AUTH_CARD_OUTER_COLUMN}>{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-svh w-full flex-col bg-booking-bg text-[#0b1d37] md:min-h-[960px]">
      <BookingHubSignUpDecorativeBackground />
      <div
        className={cn(
          'relative z-[1] flex w-full flex-col items-center',
          'justify-center md:justify-start',
          BH_GRID_SHELL_CLASSES,
          'py-6 sm:py-8 md:py-12 lg:py-16',
        )}
      >
        <div className="mx-auto flex w-full min-w-0 max-w-[42rem] flex-col gap-8 lg:max-w-[56rem] xl:max-w-bh-3xl">
          {children}
        </div>
      </div>
    </div>
  );
}
