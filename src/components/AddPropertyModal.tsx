'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DefaultValues } from 'react-hook-form';
import { Building2, Upload, Wand2 } from 'lucide-react';

import { BH_HUB_AUTH_CARD_OUTER_COLUMN } from '@/components/auth/bookingHubAuthCardShell';
import {
  ADD_PROPERTY_MANUAL_DEFAULTS,
  type PropertyForm,
} from '@/components/property-manual-listing/propertyManualListingSchema';
import {
  PropertyManualListingForm,
  type PropertyManualListingFormHandle,
} from '@/components/property-manual-listing/PropertyManualListingForm';
import { cn } from '@/lib/utils';

export type { PropertyForm } from '@/components/property-manual-listing/propertyManualListingSchema';
export { PARTNER_MANUAL_LISTING_EDIT_SCREENSHOT_PRESET } from '@/components/property-manual-listing/propertyManualListingSchema';

export type AddPropertyModalInitialManualListing = {
  title: string;
  subtitle: string;
  values: DefaultValues<PropertyForm>;
};

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PropertyForm) => void;
  /** When `inline`, renders in the dashboard main column (no fullscreen backdrop). */
  variant?: 'overlay' | 'inline';
  /**
   * Opens the manual listing form directly with headings + merged defaults (partner Edit Property).
   * Photos are seeded separately (minimum 5) when this is set on open.
   */
  initialManualListing?: AddPropertyModalInitialManualListing | null;
}

type AddPropertyModalPhase = 'listing-method' | 'property-form';

export default function AddPropertyModal({
  isOpen,
  onClose,
  onSubmit,
  variant = 'overlay',
  initialManualListing = null,
}: AddPropertyModalProps) {
  const [modalPhase, setModalPhase] = useState<AddPropertyModalPhase>('listing-method');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formResetKey, setFormResetKey] = useState(0);
  const formRef = useRef<PropertyManualListingFormHandle>(null);
  const prevPhaseRef = useRef<AddPropertyModalPhase>('listing-method');

  const formDataBackupKey = 'addPropertyFormBackup';
  const photoFilesBackupKey = 'addPropertyPhotosBackup';

  const mergedDefaults = useMemo(
    () =>
      initialManualListing
        ? { ...ADD_PROPERTY_MANUAL_DEFAULTS, ...initialManualListing.values }
        : ADD_PROPERTY_MANUAL_DEFAULTS,
    [initialManualListing],
  );

  const clearFormBackup = useCallback(() => {
    try {
      sessionStorage.removeItem(formDataBackupKey);
      sessionStorage.removeItem(photoFilesBackupKey);
    } catch (err) {
      console.error('Error clearing form backup:', err);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      prevPhaseRef.current = 'listing-method';
      return;
    }
    clearFormBackup();
    if (initialManualListing) {
      setModalPhase('property-form');
      setFormResetKey((k) => k + 1);
    } else {
      setModalPhase('listing-method');
    }
  }, [isOpen, initialManualListing, clearFormBackup]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = prevPhaseRef.current;
    if (modalPhase === 'property-form' && prev !== 'property-form' && !initialManualListing) {
      setFormResetKey((k) => k + 1);
    }
    prevPhaseRef.current = modalPhase;
  }, [isOpen, modalPhase, initialManualListing]);

  const isNativeCameraBusy = () => formRef.current?.isNativeCameraBusy() ?? false;

  const handlePropertyFormSubmit = async (data: PropertyForm & { photos: FileList | null }) => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit(data as PropertyForm);
      clearFormBackup();
      onClose();
    } catch {
      setError('Failed to add property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setModalPhase('listing-method');
    clearFormBackup();
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  const isInline = variant === 'inline';

  return (
    <div
      className={
          isInline
            ? cn(
                'relative z-10 flex min-h-0 w-full flex-1 flex-col',
                modalPhase === 'listing-method' && 'overflow-y-auto',
              )
            : cn(
                'fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 backdrop-blur-sm',
                modalPhase === 'listing-method' ? 'bg-[#F4F5F7]' : 'bg-black/50',
              )
      }
      onClick={
        isInline
          ? undefined
          : (e) => {
              if (isNativeCameraBusy()) {
                e.stopPropagation();
                return;
              }
              if (e.target === e.currentTarget) {
                handleClose();
              }
            }
      }
    >
      {modalPhase === 'listing-method' ? (
          <div
            className={cn('mx-auto w-full max-w-3xl', isInline && 'min-h-0 flex-1')}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mb-6 px-0 pt-1 sm:mb-8">
              <button
                type="button"
                onClick={() => {
                  if (isNativeCameraBusy()) {
                    alert('Please wait for the camera operation to complete');
                    return;
                  }
                  handleClose();
                }}
                className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#E5E7EB]/80 hover:text-[#1A2B48]"
                disabled={isNativeCameraBusy()}
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="mx-auto max-w-xl px-10 text-center sm:px-14">
                <h2
                  className="font-avenir-bold text-xl tracking-tight text-[#1A2B48] sm:text-2xl"
                  style={{ fontFamily: 'var(--font-avenir-bold)' }}
                >
                  List a Property
                </h2>
                <p className="mt-2 font-avenir text-sm font-medium leading-relaxed text-[#6B7280] sm:text-base">
                  Add your property details to start receiving business bookings
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-8">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setModalPhase('property-form')}
                  className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-8 transition-all hover:border-[#66B2B2]/50 hover:bg-[#FAFAFA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#66B2B2] focus-visible:ring-offset-2 sm:min-h-[148px] sm:py-10"
                >
                  <Building2 className="h-10 w-10 shrink-0 text-[#6B7280]" strokeWidth={1.5} aria-hidden />
                  <span className="text-center font-avenir text-sm font-semibold text-[#1A2B48] sm:text-base">
                    Manual Listing
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalPhase('property-form')}
                  className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-8 transition-all hover:border-[#66B2B2]/50 hover:bg-[#FAFAFA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#66B2B2] focus-visible:ring-offset-2 sm:min-h-[148px] sm:py-10"
                >
                  <Upload className="h-10 w-10 shrink-0 text-[#6B7280]" strokeWidth={1.5} aria-hidden />
                  <span className="text-center font-avenir text-sm font-semibold text-[#1A2B48] sm:text-base">
                    CSV Bulk Upload
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalPhase('property-form')}
                  className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-8 transition-all hover:border-[#66B2B2]/50 hover:bg-[#FAFAFA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#66B2B2] focus-visible:ring-offset-2 sm:min-h-[148px] sm:py-10"
                >
                  <Wand2 className="h-10 w-10 shrink-0 text-[#6B7280]" strokeWidth={1.5} aria-hidden />
                  <span className="text-center font-avenir text-sm font-semibold text-[#1A2B48] sm:text-base">
                    Airbnb Import
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              BH_HUB_AUTH_CARD_OUTER_COLUMN,
              'font-avenir-regular pb-12 sm:pb-16',
              isInline && 'min-h-0 flex-1',
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mb-6 px-0 pt-1 sm:mb-8">
              <button
                type="button"
                onClick={() => {
                  if (isNativeCameraBusy()) {
                    alert('Please wait for the camera operation to complete');
                    return;
                  }
                  if (initialManualListing) {
                    handleClose();
                    return;
                  }
                  setModalPhase('listing-method');
                }}
                className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#E5E7EB]/80 hover:text-[#1A2B48]"
                disabled={isNativeCameraBusy()}
                aria-label={initialManualListing ? 'Close' : 'Back to listing options'}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isNativeCameraBusy()) {
                    alert('Please wait for the camera operation to complete');
                    return;
                  }
                  handleClose();
                }}
                className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#E5E7EB]/80 hover:text-[#1A2B48]"
                disabled={isNativeCameraBusy()}
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="mx-auto max-w-xl px-10 text-center sm:px-14">
                <h2
                  className="font-avenir-bold text-xl tracking-tight text-[#1A2B48] sm:text-2xl"
                  style={{ fontFamily: 'var(--font-avenir-bold)' }}
                >
                  {initialManualListing?.title ?? 'List a Property'}
                </h2>
                <p className="mt-2 font-avenir text-sm font-medium leading-relaxed text-[#6B7280] sm:text-base">
                  {initialManualListing?.subtitle ?? 'Add your property details to start receiving business bookings'}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-8">
              <PropertyManualListingForm
                ref={formRef}
                resetKey={formResetKey}
                defaultValues={mergedDefaults}
                seedPhotosFromPublicPath={initialManualListing ? '/blue-teal.webp' : null}
                submitError={error}
                loading={loading}
                onSubmit={handlePropertyFormSubmit}
              />
            </div>
          </div>
        )}
      </div>
  );
}
