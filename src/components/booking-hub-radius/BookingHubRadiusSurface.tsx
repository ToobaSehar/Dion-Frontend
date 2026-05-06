'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { bhRounded, type BookingHubRadiusToken } from './bookingHubRadius';

export type BookingHubRadiusSurfaceProps = {
  /** Figma radius token (`6377:75052`). */
  radius: BookingHubRadiusToken;
  className?: string;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'>;

/**
 * Wrapper that applies **`bhRounded(radius)`** so surfaces (cards, inputs shells, chips)
 * stay aligned with the **Radius** foundation frame.
 */
export function BookingHubRadiusSurface({ radius, className, children, ...rest }: BookingHubRadiusSurfaceProps) {
  return (
    <div className={cn(bhRounded(radius), className)} {...rest}>
      {children}
    </div>
  );
}
