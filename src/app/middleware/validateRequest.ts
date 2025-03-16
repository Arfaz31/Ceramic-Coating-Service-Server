import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';
import CatchAsync from '../utils/catchAsync';

export const validateRequest = (Schema: AnyZodObject) => {
  return CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await Schema.parseAsync({
      body: req.body,
    });
    next();
  });
};

export const validateRequestCookies = (schema: AnyZodObject) => {
  return CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedCookies = await schema.parseAsync({
      cookies: req.cookies,
    });

    req.cookies = parsedCookies.cookies;

    next();
  });
};
