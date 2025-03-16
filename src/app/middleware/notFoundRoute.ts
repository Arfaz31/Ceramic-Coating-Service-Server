import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
export const notFoundRoute = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!res.headersSent) {
    res
      .status(httpStatus.NOT_FOUND)
      .json({ success: false, message: 'Route not found' });
  } else {
    next();
  }
};

export default notFoundRoute;
