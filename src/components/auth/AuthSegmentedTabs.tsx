'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';

export type AuthSegmentedTabsActive = 'sign-up' | 'log-in';

export type AuthSegmentedTabsProps = {
  active: AuthSegmentedTabsActive;
  signUpHref: string;
  logInHref: string;
  className?: string;
};

/** Equal-width cells; inactive area reads as `#F6F6F4` tray behind the sliding white pill. */
const tabCell =
  'relative z-10 flex min-h-9 w-full min-w-0 items-center justify-center rounded-[7px] px-3 py-2 text-sm font-semibold leading-5 transition-colors';

const tabInactive = `${tabCell} text-[#717680] hover:text-[#414651] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1d37]/15 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F6F4]`;

const tabActive = `${tabCell} text-[#414651]`;

/**
 * Sign up vs Log in toggle — sliding pill (`transform`); tray base `#F6F6F4`, equal column widths.
 * Inactive tab uses immediate full-page navigation (`window.location.assign`).
 */
export function AuthSegmentedTabs({ active, signUpHref, logInHref, className }: AuthSegmentedTabsProps) {
  return (
    <nav className={cn('w-full', className)} aria-label="Sign up or log in">
      <div className="w-full rounded-xl bg-[#F6F6F4] p-1">
        <div className="relative grid min-h-9 w-full grid-cols-2">
          <div
            className={cn(
              'pointer-events-none absolute inset-y-0 left-0 z-0 w-1/2 rounded-lg border border-[#d5d7da] bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:duration-150 motion-reduce:ease-linear',
              active === 'log-in' && 'translate-x-full',
            )}
            aria-hidden
          />
          {active === 'sign-up' ? (
            <span className={tabActive} aria-current="page">
              Sign up
            </span>
          ) : (
            <Link
              href={signUpHref}
              onClick={(e) => {
                e.preventDefault();
                window.location.assign(signUpHref);
              }}
              className={tabInactive}
            >
              Sign up
            </Link>
          )}
          {active === 'log-in' ? (
            <span className={tabActive} aria-current="page">
              Log in
            </span>
          ) : (
            <Link
              href={logInHref}
              onClick={(e) => {
                e.preventDefault();
                window.location.assign(logInHref);
              }}
              className={tabInactive}
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
