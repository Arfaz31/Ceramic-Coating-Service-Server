import { z } from 'zod';

export const CreateAdminValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    contact: z.string().min(1, 'Contact number is required'),
    gender: z.enum(['Male', 'Female', 'Other'], {
      required_error: 'Gender is required',
    }),
    address: z.string().optional(),
  }),
});

export const UpdateUserValidationSchema = z.object({
  body: z.object({
    targetUserId: z.string().optional(),
    name: z.string().optional(),
    contact: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    address: z.string().optional(),
  }),
});
