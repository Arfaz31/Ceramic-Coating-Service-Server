import { USER_ROLE } from '../module/User/user.constant';
import CatchAsync from '../utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { jwtHelpers } from '../utils/JWTHelpers';
import { config } from '../config';
import AppError from '../Error/AppError';
import { User } from '../module/User/user.model';

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }
    const decoded = jwtHelpers.verifyToken(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, id, iat } = decoded;

    const user = await User.findOne({ id });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const isDeleted = user?.isDeleted;
    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'Your account has been deleted');
    }

    //check if password changed after the token was issued. if that then the previous jwt token will be invalid
    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
