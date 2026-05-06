'use client';

import { cn } from '@/lib/utils';
import { AuthSegmentedTabs, type AuthSegmentedTabsProps } from '@/components/auth/AuthSegmentedTabs';

/**
 * Primary stack width for client hub auth (white card): segmented tabs, Get started / Sign in,
 * SSO block, footer links — matches Figma narrow column (`360px` → `480px` at `lg`).
 */
export const BH_AUTH_HUB_PRIMARY_STACK_WIDTH =
  'mx-auto w-full max-w-[360px] lg:max-w-[480px]';

/**
 * Sign up / Log in toggle for **client** hub screens (`/auth/signup/client`, `/auth/login?type=client` hub layout).
 * Same horizontal bounds as the primary CTA in that card. For other widths, use `AuthSegmentedTabs` with `className`.
 */
export function AuthHubSegmentedTabs({ className, ...props }: AuthSegmentedTabsProps) {
  return (
    <AuthSegmentedTabs
      {...props}
      className={cn(BH_AUTH_HUB_PRIMARY_STACK_WIDTH, 'shrink-0', className)}
    />
  );
}
