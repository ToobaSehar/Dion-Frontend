import { z } from 'zod';

const passwordPolicySchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[a-z]/, 'Must contain a lowercase letter')
  .regex(/[0-9]/, 'Must contain a number')
  .regex(/[^A-Za-z0-9]/, 'Must contain a special character');

/** Object shape only (use with `.merge()`; add match `refine` on the combined schema). */
export const accountPasswordObjectSchema = z.object({
  password: passwordPolicySchema,
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the client terms and conditions',
  }),
});

export const accountPasswordMatchRefine = {
  fn: (data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword,
  message: "Passwords don't match" as const,
  path: ['confirmPassword'] as const,
};

/** Standalone password + terms step (booking step 3, or composed into client signup). */
export const accountPasswordStepSchema = accountPasswordObjectSchema.refine(accountPasswordMatchRefine.fn, {
  message: accountPasswordMatchRefine.message,
  path: [accountPasswordMatchRefine.path[0]],
});

export type AccountPasswordStepValues = z.infer<typeof accountPasswordStepSchema>;
