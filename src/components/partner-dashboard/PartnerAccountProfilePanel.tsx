'use client';

import { type ReactNode } from 'react';
import { Save } from 'lucide-react';

import { BookingHubInputField } from '@/components/BookingHubInputField';
import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import { BookingHubSelectField, type BookingHubSelectOption } from '@/components/booking-hub-select';
import { cn } from '@/lib/utils';

const INK = '#0B1D37';
const MUTED = '#4B4E53';

/** Client portal request-row pills (`ClientPortalMyRequestsView`): submitted amber, cancelled red ink, confirmed teal. */
const PILL_SUCCESS_CLASS =
  'inline-flex max-w-full items-center rounded-full bg-[#00BAB5] px-4 py-2 text-sm font-medium leading-5 text-white';
const PILL_ERROR_CLASS =
  'inline-flex max-w-full items-center rounded-full border border-[#FECDCA] bg-[#F6F6F4] px-4 py-2 text-sm font-medium leading-5 text-[#F04438]';

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-avenir-regular text-sm font-semibold leading-5 text-[#0B1D37]">{children}</span>
  );
}

/**
 * Partner type is fixed for Phase 1 accounts (landlord role). UI matches the Account & Profile spec;
 * the control is disabled so we do not imply unsupported persistence.
 */
const PARTNER_TYPE_OPTIONS: BookingHubSelectOption[] = [
  { value: 'accommodation-provider', label: 'Accommodation provider' },
];
const PARTNER_TYPE_VALUE = 'accommodation-provider';

export type PartnerAccountProfilePanelProps = {
  className?: string;
  contactName: string;
  signInEmail: string;
  businessName: string;
  onBusinessNameChange: (value: string) => void;
  businessEmail: string;
  onBusinessEmailChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  businessAddress: string;
  onBusinessAddressChange: (value: string) => void;
  updateSuccess: boolean;
  updateError: string | null;
  onSave: () => void;
};

/**
 * **Account & Profile** — partner dashboard tab: business details grid, hub inputs/select/button,
 * status pills using the same amber/red/teal semantics as the client portal request list.
 */
export function PartnerAccountProfilePanel({
  className,
  contactName,
  signInEmail,
  businessName,
  onBusinessNameChange,
  businessEmail,
  onBusinessEmailChange,
  phone,
  onPhoneChange,
  businessAddress,
  onBusinessAddressChange,
  updateSuccess,
  updateError,
  onSave,
}: PartnerAccountProfilePanelProps) {
  const emailHelper =
    signInEmail.trim().length > 0 ? `Sign-in email: ${signInEmail}` : undefined;

  return (
    <div className={cn('flex w-full min-w-0 flex-col gap-6 sm:gap-8', className)}>
      <div className="flex min-w-0 flex-col gap-2">
        <h1
          className="font-avenir-regular text-2xl font-semibold leading-8 sm:text-[30px] sm:leading-[38px]"
          style={{ color: INK }}
        >
          Account & Profile
        </h1>
        <p className="font-avenir-regular text-sm font-normal leading-5" style={{ color: MUTED }}>
          Manage your business details and Stripe onboarding.
        </p>
      </div>

      <section
        className="overflow-hidden rounded-xl border border-[#e9eaeb] bg-white shadow-[0px_1px_3px_rgba(10,13,18,0.08)]"
        aria-labelledby="partner-business-details-heading"
      >
        <div className="flex flex-col gap-6 p-5 sm:gap-8 sm:p-6 lg:p-8">
          <h2
            id="partner-business-details-heading"
            className="font-avenir-regular text-lg font-semibold leading-7 sm:text-xl sm:leading-8"
            style={{ color: INK }}
          >
            Business Details
          </h2>

          <div className="grid w-full min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6 lg:gap-x-8 lg:gap-y-7">
            <div className="min-w-0 sm:col-span-1">
              <BookingHubInputField
                id="partner-account-business-name"
                name="businessName"
                type="text"
                label={<FieldLabel>Business Name</FieldLabel>}
                value={businessName}
                onChange={(e) => onBusinessNameChange(e.target.value)}
                autoComplete="organization"
                placeholder="Enter business name"
                size="md"
              />
            </div>

            <div className="min-w-0 sm:col-span-1">
              <BookingHubSelectField
                id="partner-account-partner-type"
                name="partnerType"
                label={<FieldLabel>Partner Type</FieldLabel>}
                size="md"
                options={PARTNER_TYPE_OPTIONS}
                value={PARTNER_TYPE_VALUE}
                onValueChange={() => {}}
                disabled
              />
            </div>

            <div className="min-w-0 sm:col-span-1">
              <BookingHubInputField
                id="partner-account-contact-name"
                name="contactName"
                type="text"
                label={<FieldLabel>Contact Name</FieldLabel>}
                value={contactName}
                disabled
                autoComplete="name"
                size="md"
              />
            </div>

            <div className="min-w-0 sm:col-span-1">
              <BookingHubInputField
                id="partner-account-business-email"
                name="businessEmail"
                type="email"
                label={<FieldLabel>Email</FieldLabel>}
                value={businessEmail}
                onChange={(e) => onBusinessEmailChange(e.target.value)}
                autoComplete="email"
                placeholder="name@company.co.uk"
                helperText={emailHelper}
                size="md"
              />
            </div>

            <div className="min-w-0 sm:col-span-1">
              <BookingHubInputField
                id="partner-account-phone"
                name="phone"
                type="tel"
                label={<FieldLabel>Phone</FieldLabel>}
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                autoComplete="tel"
                placeholder="Enter phone number"
                size="md"
              />
            </div>

            <div className="min-w-0 sm:col-span-1">
              <BookingHubInputField
                id="partner-account-business-address"
                name="businessAddress"
                multiline
                rows={3}
                label={<FieldLabel>Business Address</FieldLabel>}
                value={businessAddress}
                onChange={(e) => onBusinessAddressChange(e.target.value)}
                autoComplete="street-address"
                placeholder="Enter business address"
                size="md"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-2">
              {updateSuccess ? (
                <div role="status" className={PILL_SUCCESS_CLASS}>
                  <span className="font-avenir-regular">Information updated successfully</span>
                </div>
              ) : null}
              {updateError ? (
                <div role="alert" className={PILL_ERROR_CLASS}>
                  <span className="font-avenir-regular break-words">{updateError}</span>
                </div>
              ) : null}
            </div>

            <div className="flex w-full shrink-0 justify-end sm:w-auto">
              <BookingHubPrimaryButton
                type="button"
                responsive
                iconLeading={<Save className="size-5" strokeWidth={2} aria-hidden />}
                onClick={onSave}
              >
                Save Changes
              </BookingHubPrimaryButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
