'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const CARD_CLASS =
  'flex flex-col gap-0 rounded-xl border border-[#e9eaeb] bg-white p-5 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:p-6';

const TITLE_CLASS =
  'font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37] sm:text-lg sm:leading-7';

const LABEL_CLASS = 'font-avenir-regular text-sm font-normal leading-5 text-[#717680]';

const VALUE_CLASS = 'font-avenir-regular text-sm font-semibold leading-5 text-[#0b1d37] sm:text-base sm:leading-6';

export type PortalClientInfoRowProps = {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  subtext?: ReactNode;
  className?: string;
};

/**
 * Single labelled row for portal info cards — optional teal icon, label, value, optional subtext; dividers between rows when stacked.
 */
export function PortalClientInfoRow({ icon, label, value, subtext, className }: PortalClientInfoRowProps) {
  return (
    <div className={cn('flex gap-4 py-4', className)}>
      {icon ? <div className="mt-0.5 shrink-0 text-[#00BAB5]">{icon}</div> : null}
      <div className="min-w-0 flex-1">
        <p className={LABEL_CLASS}>{label}</p>
        <p className={cn(VALUE_CLASS, subtext ? 'mt-1' : 'mt-0.5')}>{value}</p>
        {subtext ? <p className="font-avenir-regular mt-1 text-sm font-normal leading-5 text-[#717680]">{subtext}</p> : null}
      </div>
    </div>
  );
}

export type PortalClientInfoCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
  titleId?: string;
};

/** White card shell with heading and stacked `PortalClientInfoRow` children. */
export function PortalClientInfoCard({ title, children, className, titleId }: PortalClientInfoCardProps) {
  const headingId = titleId ?? `portal-info-card-${title.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <section className={cn(CARD_CLASS, className)} aria-labelledby={headingId}>
      <h2 id={headingId} className={TITLE_CLASS}>
        {title}
      </h2>
      <div className="mt-4 flex flex-col divide-y divide-[#e9eaeb] border-t border-[#e9eaeb]">{children}</div>
    </section>
  );
}

export type PortalClientStatusBannerProps = {
  badgeLabel: string;
  message: ReactNode;
  className?: string;
  icon?: ReactNode;
};

/** Inline status strip — navy pill + supporting copy; used on request detail and similar flows. */
export function PortalClientStatusBanner({ badgeLabel, message, className, icon }: PortalClientStatusBannerProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-xl border border-[#e9eaeb] bg-[#eef2f6] px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4',
        className,
      )}
    >
      <span className="font-avenir-regular inline-flex shrink-0 items-center rounded-full bg-[#0B1D37] px-3 py-1 text-xs font-semibold leading-[18px] text-white">
        {badgeLabel}
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        {icon}
        <p className="font-avenir-regular min-w-0 text-sm font-normal leading-5 text-[#414651] sm:text-base sm:leading-6">{message}</p>
      </div>
    </div>
  );
}
