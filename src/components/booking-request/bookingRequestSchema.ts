import { z } from 'zod';

/** Step 1 shape — types only; no client-side field rules in the booking flow. */
export const bookingRequestStep1Schema = z.object({
  city: z.string(),
  projectPostcode: z.string(),
  teamSize: z.string(),
});

/** Booking request form shape — permissive strings/boolean for typing only (no Zod validation rules). */
export const bookingRequestFormSchema = z.object({
  city: z.string(),
  projectPostcode: z.string(),
  teamSize: z.string(),
  budgetPerPerson: z.string().optional().default(''),
  paymentFrequency: z.string().optional().default(''),
  specialRequirements: z.string().optional().default(''),
  name: z.string(),
  companyName: z.string(),
  email: z.string(),
  phone: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
  termsAccepted: z.boolean(),
});

export type BookingRequestFormValues = z.infer<typeof bookingRequestFormSchema>;
