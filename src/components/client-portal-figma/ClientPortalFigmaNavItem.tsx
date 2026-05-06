'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ClientPortalFigmaNavItemProps = {
  label: string;
  /** Raster/SVG path from `clientPortalSidebarFigmaAssets` (used when `icon` is omitted). */
  iconSrc?: string;
  /** Optional inline icon (e.g. Lucide) when not using `iconSrc`. */
  icon?: ReactNode;
  active?: boolean;
  badge?: string;
  className?: string;
  /** When set, the row is a focusable control (e.g. primary navigation). */
  onClick?: () => void;
  /** When true, hides the label and centres the icon (collapsed sidebar). */
  iconOnly?: boolean;
};

/** SVG-as-`<img>` uses fixed stroke colours — tint via `mask-image` + `background-color` for exact brand hex. */
function NavRasterIcon({ iconSrc, active }: { iconSrc: string; active: boolean | undefined }) {
  return (
    <span
      aria-hidden
      className={cn(
        'block h-5 w-5 shrink-0 bg-[#4B4E53] transition-colors duration-150 ease-out [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]',
        active ? 'bg-[#00BAB5] group-hover:bg-[#00BAB5]' : 'group-hover:bg-[#0B1D37]',
      )}
      style={{
        WebkitMaskImage: `url(${iconSrc})`,
        maskImage: `url(${iconSrc})`,
      }}
    />
  );
}

const rowClass = (active: boolean | undefined) =>
  cn(
    'group relative flex min-w-0 flex-1 items-center gap-[12px] px-[12px] py-[8px] text-[#4B4E53] transition-colors duration-150 ease-out',
    active
      ? 'rounded-[6px] bg-[#F6F6F4] text-[#00BAB5] hover:bg-[#F6F6F4] hover:text-[#00BAB5]'
      : 'rounded-[6px] bg-transparent hover:text-[#0B1D37]',
  );

/**
 * `_Nav item base` — Figma node `1765:460095` (child rows under Navigation / Footer).
 * Spacing and radii match MCP `get_design_context` (gap 8 / 12px, pill 6px, task badge 16px).
 */
export function ClientPortalFigmaNavItem({
  label,
  iconSrc,
  icon,
  active,
  badge,
  className,
  onClick,
  iconOnly,
}: ClientPortalFigmaNavItemProps) {
  const interactive = Boolean(onClick);

  const iconEl = (
    <div className="relative flex size-5 shrink-0 items-center justify-center overflow-visible">
      {icon ?? (iconSrc ? <NavRasterIcon iconSrc={iconSrc} active={active} /> : null)}
    </div>
  );

  const innerLeading = iconOnly ? (
    <div className="flex items-center justify-center">{iconEl}</div>
  ) : (
    <div className="relative flex min-w-0 flex-1 items-center gap-[8px]">
      {iconEl}
      <p className="font-avenir-regular relative shrink-0 whitespace-nowrap text-[14px] font-light leading-[20px] not-italic text-current">
        {label}
      </p>
    </div>
  );

  const innerBadge = !iconOnly && badge ? (
    <div className="relative flex shrink-0 items-center rounded-[16px] border border-[#e9eaeb] bg-[#fafafa] px-[8px] py-[2px]">
      <p className="font-avenir-regular relative shrink-0 whitespace-nowrap text-center text-[12px] font-light leading-[18px] not-italic text-current">
        {badge}
      </p>
    </div>
  ) : null;

  const rowCls = cn(rowClass(active), iconOnly && 'justify-center px-0');

  return (
    <div className={cn('relative flex w-full shrink-0 items-center overflow-visible py-[2px]', className)}>
      {interactive ? (
        <button
          type="button"
          onClick={onClick}
          aria-label={iconOnly ? label : undefined}
          className={cn(
            rowCls,
            'w-full cursor-pointer border-0 text-left outline-none',
            'focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-1',
          )}
        >
          {innerLeading}
          {innerBadge}
        </button>
      ) : (
        <div className={rowCls}>
          {innerLeading}
          {innerBadge}
        </div>
      )}
    </div>
  );
}
