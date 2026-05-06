'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Target } from 'lucide-react';

import { BookingHubPrimaryButton, BookingHubSecondaryButton } from '@/components/booking-hub-button';
import { cn } from '@/lib/utils';

import {
  INTERNAL_SPEC_BODY,
  INTERNAL_SPEC_DISTANCE_INPUT,
  INTERNAL_SPEC_ICON_WRAP,
  INTERNAL_SPEC_ROW_SHELL,
  INTERNAL_SPEC_TITLE,
  INTERNAL_SPEC_VALUE,
} from './internalSpecTokens';

export type InternalDistanceSpecCardProps = {
  /** Main heading (sentence case in code; styled uppercase in UI). */
  title?: string;
  /** Supporting line under the title. Omit to use the default line, which includes the current saved miles. */
  description?: string;
  /** Initial radius in miles (UI-only until wired to an API). */
  defaultMiles?: number;
  className?: string;
  /** Optional icon override for other “radius spec” variants on other screens. */
  icon?: ReactNode;
  /** Called after a successful local Save (valid number committed). */
  onSave?: (miles: number) => void;
};

function clampMiles(raw: number): number {
  if (!Number.isFinite(raw) || raw < 1) return 1;
  if (raw > 999) return 999;
  return Math.round(raw);
}

/**
 * Internal-only distance spec row: read view + Override → same row layout with miles field,
 * **Cancel** (secondary) and **Save** (primary). Reuse on admin screens for the same pattern.
 */
export function InternalDistanceSpecCard({
  title = 'Matching radius (internal)',
  description,
  defaultMiles = 50,
  className,
  icon,
  onSave,
}: InternalDistanceSpecCardProps) {
  const inputId = useId();
  const [savedMiles, setSavedMiles] = useState(defaultMiles);
  const [draftMiles, setDraftMiles] = useState(String(defaultMiles));
  const [isEditing, setIsEditing] = useState(false);
  const lastSyncedDefaultMilesRef = useRef(defaultMiles);

  /** Only reset local miles when **`defaultMiles`** changes from the parent — not when edit mode toggles (that was clearing overrides after Save). */
  useEffect(() => {
    if (lastSyncedDefaultMilesRef.current === defaultMiles) return;
    lastSyncedDefaultMilesRef.current = defaultMiles;
    setSavedMiles(defaultMiles);
    if (!isEditing) {
      setDraftMiles(String(defaultMiles));
    }
  }, [defaultMiles, isEditing]);

  const openOverride = useCallback(() => {
    setDraftMiles(String(savedMiles));
    setIsEditing(true);
  }, [savedMiles]);

  const commitSave = useCallback(() => {
    const parsed = clampMiles(Number.parseFloat(draftMiles.replace(/,/g, '')));
    setSavedMiles(parsed);
    setDraftMiles(String(parsed));
    setIsEditing(false);
    onSave?.(parsed);
  }, [draftMiles, onSave]);

  const cancelEdit = useCallback(() => {
    setDraftMiles(String(savedMiles));
    setIsEditing(false);
  }, [savedMiles]);

  const supportingText =
    description ??
    `Default ${savedMiles} mi from Bristol. Not visible to client or partners.`;

  const leftColumn = (
    <div className="flex min-w-0 flex-1 items-start gap-3">
      <div className={INTERNAL_SPEC_ICON_WRAP} aria-hidden>
        {icon ?? <Target strokeWidth={2} aria-hidden />}
      </div>
      <div className="min-w-0 flex-1">
        <p className={INTERNAL_SPEC_TITLE}>{title}</p>
        <p className={INTERNAL_SPEC_BODY}>{supportingText}</p>
      </div>
    </div>
  );

  return (
    <div className={cn(INTERNAL_SPEC_ROW_SHELL, className)}>
      {!isEditing ? (
        <>
          {leftColumn}
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 sm:gap-4">
            <span className={INTERNAL_SPEC_VALUE}>{savedMiles} mi</span>
            <BookingHubSecondaryButton type="button" size="sm" contentSized onClick={openOverride}>
              Override
            </BookingHubSecondaryButton>
          </div>
        </>
      ) : (
        <>
          {leftColumn}
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
            <label htmlFor={inputId} className="sr-only">
              {title} in miles
            </label>
            <input
              id={inputId}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={draftMiles}
              onChange={(e) => setDraftMiles(e.target.value)}
              className={INTERNAL_SPEC_DISTANCE_INPUT}
            />
            <span className="font-avenir-regular text-sm font-medium leading-5 text-[#4B4E53]">miles</span>
            <BookingHubSecondaryButton type="button" size="sm" contentSized onClick={cancelEdit}>
              Cancel
            </BookingHubSecondaryButton>
            <BookingHubPrimaryButton type="button" size="sm" contentSized onClick={commitSave}>
              Save
            </BookingHubPrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}
