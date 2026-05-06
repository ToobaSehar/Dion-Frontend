'use client';

import { Check } from 'lucide-react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const interProgress = Inter({ subsets: ['latin'], display: 'swap' });

/** Figma `1141:81479` — Booking Hub step progress (horizontal strip). */
export type BookingHubStepProgressItem = {
  title: string;
  subtitle?: string;
};

type StepVisualState = 'complete' | 'current' | 'incomplete';

function stepState(index: number, currentStep: number): StepVisualState {
  if (index < currentStep - 1) return 'complete';
  if (index === currentStep - 1) return 'current';
  return 'incomplete';
}

function StepIcon({ state }: { state: StepVisualState }) {
  if (state === 'complete') {
    return (
      <div
        className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#00BAB5]"
        aria-hidden
      >
        <Check className="size-3 text-white" strokeWidth={2.5} aria-hidden />
      </div>
    );
  }
  if (state === 'current') {
    return (
      <div
        className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#00BAB5] shadow-[0px_0px_0px_2px_#ffffff,0px_0px_0px_4px_#00BAB5]"
        aria-hidden
      >
        <span className="block size-2 rounded-full bg-white" />
      </div>
    );
  }
  return (
    <div
      className="relative box-border flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border-[1.5px] border-solid border-[#E9EAEB] bg-white"
      aria-hidden
    >
      <span className="block size-2 rounded-full bg-[#E9EAEB]" />
    </div>
  );
}

export type BookingHubStepProgressIndicatorProps = {
  steps: BookingHubStepProgressItem[];
  /** 1-based index of the active step. */
  currentStep: number;
  className?: string;
  /** Announced to assistive tech (e.g. booking flow context). */
  ariaLabel?: string;
};

export function BookingHubStepProgressIndicator({
  steps,
  currentStep,
  className,
  ariaLabel,
}: BookingHubStepProgressIndicatorProps) {
  const n = steps.length;
  const safeCurrent = Math.min(Math.max(currentStep, 1), n);

  if (n < 1) return null;

  const connectorSegmentCount = Math.max(0, n - 1);
  /** `gap-4` (16px) between columns — connector math must stay in sync. */
  const gapCount = n - 1;
  const connectorStyle =
    connectorSegmentCount > 0
      ? {
          left: `calc((100% - ${gapCount}rem) / ${2 * n})`,
          width: `calc((100% - ${gapCount}rem) * ${gapCount} / ${n} + ${gapCount}rem)`,
        }
      : undefined;

  return (
    <nav
      className={cn('relative w-full', interProgress.className, className)}
      aria-label={ariaLabel ?? 'Progress steps'}
    >
      <span className="sr-only">
        Step {safeCurrent} of {n}
        {steps[safeCurrent - 1]?.title ? `: ${steps[safeCurrent - 1]!.title}` : ''}
      </span>

      {connectorSegmentCount > 0 ? (
        <div
          className="pointer-events-none absolute top-[12px] z-0 flex h-0.5 -translate-y-1/2"
          style={connectorStyle}
          aria-hidden
        >
          {Array.from({ length: connectorSegmentCount }, (_, i) => (
            <div
              key={i}
              className={cn('h-full flex-1', safeCurrent > i + 1 ? 'bg-[#00BAB5]' : 'bg-[#E9EAEB]')}
            />
          ))}
        </div>
      ) : null}

      <ol className="relative z-10 m-0 flex list-none items-start justify-center gap-4 p-0">
        {steps.map((item, index) => {
          const state = stepState(index, safeCurrent);
          const titleClass =
            state === 'current'
              ? 'font-semibold text-[#008884]'
              : 'font-semibold text-[#414651]';
          const subtitleClass =
            state === 'current' ? 'font-normal text-[#00BAB5]' : 'font-normal text-[#535862]';

          return (
            <li
              key={`${item.title}-${index}`}
              className="flex min-w-0 flex-1 flex-col items-center gap-3"
              aria-current={state === 'current' ? 'step' : undefined}
            >
              <StepIcon state={state} />
              <div
                className={cn(
                  'flex w-full shrink-0 flex-col items-center text-center text-sm leading-5',
                  item.subtitle ? 'gap-1' : '',
                )}
              >
                <p className={cn('m-0 w-full shrink-0', titleClass)}>{item.title}</p>
                {item.subtitle ? (
                  <p className={cn('m-0 w-full shrink-0', subtitleClass)}>{item.subtitle}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
