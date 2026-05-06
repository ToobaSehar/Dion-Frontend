'use client';

import { cn } from '@/lib/utils';

export type AdminPortalFigmaPlaceholderViewProps = {
  className?: string;
  title: string;
  description?: string;
};

/** Lightweight shell for non-dashboard admin Figma nav targets (no API wiring). */
export function AdminPortalFigmaPlaceholderView({
  className,
  title,
  description = 'This area uses the same portal shell as the client Figma preview. Dashboard shows the operational queue.',
}: AdminPortalFigmaPlaceholderViewProps) {
  return (
    <div className={cn('flex w-full flex-col px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <div className="max-w-2xl rounded-xl border border-[#e9eaeb] bg-white p-6 shadow-[0_1px_2px_rgba(11,29,55,0.06)] sm:p-8">
        <h1 className="font-avenir-regular text-xl font-semibold text-[#0B1D37] sm:text-2xl">{title}</h1>
        <p className="font-avenir-regular mt-2 text-sm leading-6 text-[#4B4E53]">{description}</p>
      </div>
    </div>
  );
}
