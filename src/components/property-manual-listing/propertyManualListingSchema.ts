import type { DefaultValues } from 'react-hook-form';
import { z } from 'zod';

import type { BookingHubSelectOption } from '@/components/booking-hub-select/BookingHubSelectField';

export const propertyManualListingSchema = z
  .object({
    propertyName: z.string().min(1, 'Property name is required'),
    houseAddress: z.string().min(5, 'House address must be at least 5 characters'),
    locality: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    county: z.string().min(1, 'County is required'),
    country: z.string().min(1, 'Country is required'),
    postcode: z.string().regex(/^[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][A-Z]{2}$/i, 'Please enter a valid UK postcode'),
    propertyType: z.enum(['House', 'Flat', 'Apartment', 'Townhouse', 'Other'], {
      required_error: 'Please select a property type',
    }),
    bedrooms: z.number().min(1, 'Must have at least 1 bedroom'),
    beds: z.number().min(1, 'Must have at least 1 bed'),
    bedsBreakdown: z.string().optional(),
    bathrooms: z.number().min(1, 'Must have at least 1 bathroom'),
    maxOccupancy: z.number().min(1, 'Must accommodate at least 1 person'),
    parkingType: z.enum(['Driveway', 'Off-Street', 'Secure Bay', 'On-Street']).optional(),
    nightlyRate: z.coerce.number().positive('Enter the all-inclusive nightly rate (£)'),
    photos: z.any().refine((files) => {
      if (!files || !(files instanceof FileList) || files.length === 0) return false;
      return files.length >= 5;
    }, 'Minimum 5 photos are required'),
    workspaceDesk: z.boolean(),
    highSpeedWifi: z.boolean(),
    smartTv: z.boolean(),
    fullyEquippedKitchen: z.boolean(),
    livingDiningSpace: z.boolean(),
    washingMachine: z.boolean(),
    ironIroningBoard: z.boolean(),
    linenTowelsProvided: z.boolean(),
    consumablesProvided: z.boolean(),
    smokeAlarm: z.boolean(),
    coAlarm: z.boolean(),
    fireExtinguisherBlanket: z.boolean(),
    epc: z.boolean(),
    gasSafetyCertificate: z.boolean(),
    eicr: z.boolean(),
    additionalInfo: z.string().optional(),
    vatRegistered: z.boolean(),
    vatDetails: z.string().optional(),
    /** Required (checked) when VAT Registered is on — matches partner listing comps. */
    vatProvideInvoiceAgreement: z.boolean(),
    comments: z.string().optional(),
    airbnb: z.string().url().optional().or(z.literal('')),
    paymentMethod: z
      .object({
        bankName: z.string().optional(),
        accountNumber: z.string().optional(),
        sortCode: z.string().optional(),
        accountHolderName: z.string().optional(),
        preferredPaymentMethod: z.enum(['bank_transfer', 'paypal', 'stripe', 'other']).optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.vatRegistered) return;
    const num = (data.vatDetails || '').trim();
    if (num.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'VAT registration number is required',
        path: ['vatDetails'],
      });
    }
    if (!data.vatProvideInvoiceAgreement) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please confirm you agree to provide a VAT invoice when requested',
        path: ['vatProvideInvoiceAgreement'],
      });
    }
  });

export type PropertyForm = z.infer<typeof propertyManualListingSchema>;

export const MANUAL_PROPERTY_TYPE_OPTIONS: BookingHubSelectOption[] = [
  { value: 'House', label: 'House' },
  { value: 'Flat', label: 'Flat' },
  { value: 'Apartment', label: 'Apartment' },
  { value: 'Townhouse', label: 'Townhouse' },
  { value: 'Other', label: 'Other' },
];

export const MANUAL_PARKING_OPTIONS: BookingHubSelectOption[] = [
  { value: 'Driveway', label: 'Driveway' },
  { value: 'Off-Street', label: 'Off-Street' },
  { value: 'Secure Bay', label: 'Secure Bay' },
  { value: 'On-Street', label: 'On-Street' },
];

/** Matches `BookingRequestFlow` `BH_BR_CENTERED_NAV_MAX_W` for primary/secondary actions. */
export const BH_ADD_PROPERTY_NAV_MAX_W = 'mx-auto w-full min-w-0 sm:max-w-[calc((100%-1rem)/2)]';

export const ADD_PROPERTY_MANUAL_DEFAULTS: DefaultValues<PropertyForm> = {
  propertyName: '',
  houseAddress: '',
  locality: '',
  city: 'As per address',
  county: 'As per address',
  country: 'United Kingdom',
  postcode: 'M1 1AE',
  bedrooms: 1,
  beds: 1,
  bedsBreakdown: '',
  bathrooms: 1,
  maxOccupancy: 1,
  workspaceDesk: false,
  highSpeedWifi: false,
  smartTv: false,
  fullyEquippedKitchen: false,
  livingDiningSpace: false,
  washingMachine: false,
  ironIroningBoard: false,
  linenTowelsProvided: false,
  consumablesProvided: false,
  smokeAlarm: false,
  coAlarm: false,
  fireExtinguisherBlanket: false,
  epc: false,
  gasSafetyCertificate: false,
  eicr: false,
  additionalInfo: '',
  nightlyRate: undefined,
  vatRegistered: false,
  vatDetails: '',
  vatProvideInvoiceAgreement: false,
  comments: '',
  airbnb: '',
  paymentMethod: undefined,
} as DefaultValues<PropertyForm>;

export const PARTNER_MANUAL_LISTING_EDIT_SCREENSHOT_PRESET: DefaultValues<PropertyForm> = {
  propertyName: 'Northern Quarter Studio',
  houseAddress: '28 Hilton St, Manchester M1 1JQ',
  locality: '',
  city: 'Manchester',
  county: 'Greater Manchester',
  country: 'United Kingdom',
  postcode: 'M1 1JQ',
  propertyType: 'Flat',
  bedrooms: 1,
  beds: 1,
  bedsBreakdown: '',
  bathrooms: 1,
  maxOccupancy: 2,
  parkingType: undefined,
  nightlyRate: 65,
  workspaceDesk: true,
  highSpeedWifi: true,
  smartTv: true,
  fullyEquippedKitchen: true,
  livingDiningSpace: false,
  washingMachine: false,
  ironIroningBoard: false,
  linenTowelsProvided: false,
  consumablesProvided: false,
  smokeAlarm: true,
  coAlarm: true,
  fireExtinguisherBlanket: false,
  epc: false,
  gasSafetyCertificate: false,
  eicr: false,
  additionalInfo: '',
  vatRegistered: false,
  vatDetails: '',
  vatProvideInvoiceAgreement: false,
  comments: '',
  airbnb: '',
  paymentMethod: undefined,
};
