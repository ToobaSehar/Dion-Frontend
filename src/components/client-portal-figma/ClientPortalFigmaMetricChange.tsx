'use client';

import Image from 'next/image';
import { clientPortalFigmaAssets } from '@/components/client-portal-figma/figmaAssets';
import { cn } from '@/lib/utils';

export type ClientPortalFigmaMetricChangeProps = {
  value: string;
  className?: string;
};

/** Figma `_Change` with `trend-up-01` + green percent (`5002:371745` pattern). */
export function ClientPortalFigmaMetricChange({ value, className }: ClientPortalFigmaMetricChangeProps) {
  return (
    <div className={cn('flex shrink-0 items-center justify-center gap-1', className)}>
      <span className="relative size-4 shrink-0 overflow-hidden">
        <Image src={clientPortalFigmaAssets.trendUp} alt="" width={16} height={16} className="object-contain" />
      </span>
      <p className="font-avenir-regular shrink-0 whitespace-nowrap text-center text-sm font-medium leading-5 text-[#067647]">
        {value}
      </p>
    </div>
  );
}
