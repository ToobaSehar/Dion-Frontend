'use client';

import { cn } from '@/lib/utils';

/** Figma `5039:376910` — Check icon: 20×20, radius 10px, Gray/300 shell; check mark per met/unmet. */
function PasswordRuleCheckIcon({ met }: { met: boolean }) {
  return (
    <span
      className={cn(
        'relative mt-0.5 size-5 shrink-0 overflow-hidden rounded-[10px]',
        met ? 'bg-booking-teal' : 'bg-[#d5d7da]',
      )}
      aria-hidden
    >
      <svg
        className={cn(
          'pointer-events-none absolute left-1/2 top-1/2 size-[11px] -translate-x-1/2 -translate-y-1/2',
          met ? 'text-white' : 'text-[#717680]',
        )}
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.25 6.1 4.85 8.65 9.75 3.35"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export type BookingHubPasswordRequirementChecklistProps = {
  /** Live password value for checklist rows (same rules as schema; display-only). */
  passwordStrengthPreview?: string;
};

/**
 * Password requirement rows (Figma `5039:376910`): check + copy per rule.
 * Used by `AccountPasswordStep` checklist variant and anywhere the same rules should appear.
 */
export function BookingHubPasswordRequirementChecklist({
  passwordStrengthPreview = '',
}: BookingHubPasswordRequirementChecklistProps) {
  const pv = passwordStrengthPreview;
  const checklistRowsThree = [
    { met: pv.length >= 8, label: 'Must be at least 8 characters' },
    {
      met: /[A-Z]/.test(pv) && /[a-z]/.test(pv),
      label: 'Must contain upper and lowercase letters',
    },
    {
      met: /[0-9]/.test(pv) && /[^A-Za-z0-9]/.test(pv),
      label: 'Must contain a number and a special character',
    },
  ] as const;

  return (
    <div className="flex w-full flex-col gap-3" aria-live="polite">
      {checklistRowsThree.map((row) => (
        <div key={row.label} className="flex w-full min-w-0 items-start gap-2" title={row.label}>
          <PasswordRuleCheckIcon met={row.met} />
          <p className="min-w-0 flex-1 font-avenir-regular text-xs font-normal leading-5 text-[#535862] sm:text-sm">
            {row.label}
          </p>
        </div>
      ))}
    </div>
  );
}
