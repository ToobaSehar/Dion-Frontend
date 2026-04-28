import { z } from 'zod';

/** Step 1 — accommodation fields only (dates validated separately in the flow). */
export const bookingRequestStep1Schema = z.object({
  city: z.string().min(1, 'Please fill this field'),
  projectPostcode: z.string().min(1, 'Please fill this field'),
  teamSize: z.string().min(1, 'Please fill this field'),
});

const passwordStrength = z
  .string()
  .min(1, 'Please fill this field')
  .superRefine((password, ctx) => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('an uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('a lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('a number');
    if (!/[^A-Za-z0-9]/.test(password)) errors.push('a special character');
    if (errors.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Password must contain ${errors.join(', ')}.`,
      });
    }
  });

export const bookingRequestFormSchema = z
  .object({
    city: z.string().min(1, 'Please fill this field'),
    projectPostcode: z.string().min(1, 'Please fill this field'),
    teamSize: z.string().min(1, 'Please fill this field'),
    budgetPerPerson: z.string().optional().default(''),
    paymentFrequency: z.string().optional(),
    specialRequirements: z.string().optional(),
    name: z.string().min(1, 'Please fill this field'),
    companyName: z.string().min(1, 'Please fill this field'),
    email: z.string().min(1, 'Please fill this field').email('Please enter a valid email address.'),
    phone: z.string().min(1, 'Please fill this field'),
    password: passwordStrength,
    confirmPassword: z.string().min(1, 'Please fill this field'),
    termsAccepted: z.boolean().refine((v) => v === true, {
      message: 'You must agree to the client terms and conditions',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match. Please try again.',
      });
    }
  });

export type BookingRequestFormValues = z.infer<typeof bookingRequestFormSchema>;
