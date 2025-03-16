/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodArray, ZodEffects, ZodRecord } from 'zod';
import CatchAsync from '../utils/catchAsync';
export const validateFileRequest = (
  schema: AnyZodObject | ZodEffects<any> | ZodArray<any> | ZodRecord<any>,
) => {
  return CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedFile = await schema.parseAsync({
      files: req.files,
    });
    req.files = parsedFile.files; //If the validation is successful, the validated file data replaces the original req.files.
    next();
  });
};
