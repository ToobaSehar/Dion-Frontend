'use client';

import Image from 'next/image';
import { ClientPortalFigmaOnlineDot } from '@/components/client-portal-figma/ClientPortalFigmaOnlineDot';
import { cn } from '@/lib/utils';

export type ClientPortalFigmaMemberRowProps = {
  name: string;
  subtitle: string;
  avatarSrc: string;
  /** Figma `_Feed item base` avatar mask: circle vs rounded square */
  avatarVariant?: 'circle' | 'rounded';
  /** Figma fallback tint behind photo */
  avatarTintClass: string;
  showNotificationDot?: boolean;
  className?: string;
};

export function ClientPortalFigmaMemberRow({
  name,
  subtitle,
  avatarSrc,
  avatarVariant = 'rounded',
  avatarTintClass,
  showNotificationDot,
  className,
}: ClientPortalFigmaMemberRowProps) {
  const round = avatarVariant === 'circle' ? 'rounded-[200px]' : 'rounded-[24px]';
  return (
    <div className={cn('relative flex w-full shrink-0 items-start gap-3', className)}>
      <div
        className={cn(
          'relative size-8 shrink-0 overflow-hidden border-[0.75px] border-solid border-[rgba(0,0,0,0.08)]',
          round,
        )}
      >
        <div aria-hidden className={cn('pointer-events-none absolute inset-0', avatarTintClass, round)} />
        <Image src={avatarSrc} alt="" fill className={cn('object-cover', round)} sizes="32px" />
        <ClientPortalFigmaOnlineDot className="bottom-[-0.75px] right-[-0.75px] rounded-[4px]" />
      </div>
      <div className="relative flex min-w-0 flex-1 flex-col items-start">
        <div className="flex w-full items-center gap-2">
          <p className="font-avenir-regular shrink-0 whitespace-nowrap text-sm font-medium leading-5 text-[#414651]">{name}</p>
        </div>
        <p className="font-avenir-regular w-full text-sm font-normal leading-5 text-[#535862]">{subtitle}</p>
      </div>
      {showNotificationDot ? (
        <span className="absolute right-0 top-0 size-2.5" aria-hidden>
          <span className="absolute left-px top-px size-2 rounded-full bg-[#f04438]" />
        </span>
      ) : null}
    </div>
  );
}
