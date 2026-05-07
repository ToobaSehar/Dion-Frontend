'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import { cn } from '@/lib/utils';

export type AdminPartnerPropertyPhotoGalleryModalProps = {
  open: boolean;
  onClose: () => void;
  propertyName: string;
  imageSeeds: readonly string[];
};

function picsumSrc(seed: string, w: number, h: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

/**
 * Full-screen gallery overlay for **Partner detail → Properties** photo cells — header + black stage + thumbnail strip.
 */
export function AdminPartnerPropertyPhotoGalleryModal({
  open,
  onClose,
  propertyName,
  imageSeeds,
}: AdminPartnerPropertyPhotoGalleryModalProps) {
  const titleId = useId();
  const [index, setIndex] = useState(0);
  const count = imageSeeds.length;

  const seedsKey = imageSeeds.join('\u0001');

  useEffect(() => {
    if (open) {
      setIndex(0);
    }
  }, [open, propertyName, seedsKey]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'ArrowLeft' && count > 1) {
        e.preventDefault();
        setIndex((i) => (i - 1 + count) % count);
      }
      if (e.key === 'ArrowRight' && count > 1) {
        e.preventDefault();
        setIndex((i) => (i + 1) % count);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, count, onClose]);

  const goPrev = useCallback(() => {
    if (count <= 1) return;
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    if (count <= 1) return;
    setIndex((i) => (i + 1) % count);
  }, [count]);

  if (!open || count === 0) {
    return null;
  }

  const seed = imageSeeds[index] ?? imageSeeds[0];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
        aria-label="Close gallery"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="font-avenir-regular relative flex max-h-[min(92vh,880px)] w-full max-w-[min(100%,960px)] flex-col overflow-hidden rounded-xl bg-white shadow-[0_24px_48px_rgba(11,29,55,0.18)]"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-solid border-[#e9eaeb] bg-white px-5 py-4 sm:px-6">
          <p id={titleId} className="min-w-0 text-sm font-semibold leading-5 text-[#0B1D37] sm:text-base">
            {propertyName} — Photo {index + 1} of {count}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-[#4B4E53] transition-colors hover:bg-[#F6F6F4] hover:text-[#0B1D37]"
            aria-label="Close"
          >
            <X className="size-5" strokeWidth={2} aria-hidden />
          </button>
        </header>

        <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black px-10 py-6 sm:px-14 sm:py-8">
          <img
            src={picsumSrc(seed, 1200, 800)}
            alt=""
            className="max-h-[min(52vh,480px)] w-full max-w-full object-contain"
          />
          {count > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 sm:left-4 sm:size-11"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-8 sm:size-9" strokeWidth={2} aria-hidden />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 sm:right-4 sm:size-11"
                aria-label="Next photo"
              >
                <ChevronRight className="size-8 sm:size-9" strokeWidth={2} aria-hidden />
              </button>
            </>
          ) : null}
        </div>

        <footer className="shrink-0 border-t border-solid border-[#e9eaeb] bg-white px-5 py-4 sm:px-6">
          {/* Vertical padding reserves space so `ring` + `ring-offset` are not clipped by `overflow-x-auto`. */}
          <div className="flex gap-2 overflow-x-auto px-0.5 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {imageSeeds.map((thumbSeed, i) => {
              const selected = i === index;
              return (
                <button
                  key={`${thumbSeed}-${i}`}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Photo ${i + 1}`}
                  aria-current={selected ? 'true' : undefined}
                  className={cn(
                    'relative shrink-0 overflow-hidden rounded-md ring-2 ring-offset-2 ring-offset-white transition-shadow',
                    selected ? 'ring-[#0B1D37]' : 'ring-transparent hover:ring-[#e9eaeb]',
                  )}
                >
                  <img
                    src={picsumSrc(thumbSeed, 160, 160)}
                    alt=""
                    className="size-14 object-cover sm:size-16"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              );
            })}
          </div>
        </footer>
      </div>
    </div>
  );
}
