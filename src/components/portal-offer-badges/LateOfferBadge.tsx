import { Clock } from 'lucide-react';

import { cn } from '@/lib/utils';

import { LATE_OFFER_BADGE_FRAME, LATE_OFFER_BADGE_ICON_CLASS } from './lateOfferBadgeTokens';

export type LateOfferBadgeProps = {
  className?: string;
};

/** Small pill beside a partner name when an offer arrived after the shortlist window (admin UI). */
export function LateOfferBadge({ className }: LateOfferBadgeProps) {
  return (
    <span className={cn(LATE_OFFER_BADGE_FRAME, className)} role="status">
      <Clock className={LATE_OFFER_BADGE_ICON_CLASS} strokeWidth={2} aria-hidden />
      Late offer
    </span>
  );
}
