'use client';

import Image from 'next/image';

/**
 * Right column for login — Figma `5024:375839` (Split quote image 03, Desktop).
 * https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=5024-375839
 *
 * Visual-only carousel controls (no behaviour change vs design).
 */
const QUOTE_TEXT =
  '"Untitled has saved us thousands of hours of work. We\'re able to spin up projects  faster and take on more clients."';

function StarIcon() {
  return (
    <span className="relative inline-block size-5 shrink-0" aria-hidden>
      <Image
        src="/auth/login-star-bg.png"
        alt=""
        width={20}
        height={20}
        className="pointer-events-none absolute left-0 top-0 size-5 object-contain"
      />
      <Image
        src="/auth/login-star.png"
        alt=""
        width={20}
        height={20}
        className="pointer-events-none relative size-5 object-contain"
      />
    </span>
  );
}

export function LoginDesktopMarketingPanel() {
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col self-stretch py-6 pr-6 pt-6">
      <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-[20px]">
        <Image
          src="/auth/login-desktop-hero.png"
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 1536px) 42vw, 0px"
          priority={false}
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center bg-gradient-to-b from-transparent to-black/40 px-5 pb-5 pt-24">
          <div className="w-full rounded-2xl border border-white/30 bg-white/30 p-5 backdrop-blur-[12px]">
            <p className="font-avenir-regular whitespace-pre-wrap text-[30px] font-semibold leading-[38px] text-white">
              {QUOTE_TEXT}
            </p>
            <div className="mt-8 flex w-full flex-col gap-2">
              <div className="flex w-full items-start gap-4">
                <p className="font-avenir-regular min-w-0 flex-1 text-2xl font-semibold leading-8 text-white">
                  Lulu Meyers
                </p>
                <div className="flex shrink-0 gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
              </div>
              <div className="flex w-full flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-1 text-white">
                  <p className="font-avenir-regular text-base font-semibold leading-6">Product Manager, Hourglass</p>
                  <p className="font-avenir-regular text-sm font-medium leading-5">Web Design Agency</p>
                </div>
                <div className="flex shrink-0 gap-8" aria-hidden>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="flex size-14 shrink-0 items-center justify-center rounded-full border border-white/50 bg-transparent p-0 outline-none"
                  >
                    <Image src="/auth/login-arrow-left.png" alt="" width={24} height={24} className="size-6" />
                  </button>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="flex size-14 shrink-0 items-center justify-center rounded-full border border-white/50 bg-transparent p-0 outline-none"
                  >
                    <Image src="/auth/login-arrow-right.png" alt="" width={24} height={24} className="size-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
