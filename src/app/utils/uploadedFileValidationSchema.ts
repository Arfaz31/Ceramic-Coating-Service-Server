import { z } from 'zod';
const maxUploadSize = 10 * 1024 * 1024; // 10MB

const acceptedFileTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'png',
  'jpeg',
  'jpg',
] as const;

const UploadedFileZodSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.enum(acceptedFileTypes),
  path: z.string(),
  size: z
    .number()
    .refine(
      (size) => size <= maxUploadSize,
      'File size must be less than 5 mb',
    ),
  filename: z.string(),
});

export const UploadedFilesArrayZodSchema = z.object({
  // files: z.record(z.string(), z.array(UploadedFileZodSchema)).refine((files) => {
  //   return Object.keys(files).length > 0;
  // }, "File is required"),
  files: z.record(z.string(), z.array(UploadedFileZodSchema)).optional(), // Mark files as optional
});
