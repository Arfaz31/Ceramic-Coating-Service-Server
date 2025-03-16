import AppError from '../../Error/AppError';
import { User } from '../User/user.model';
import { TAuth } from './auth.interface';
import httpStatus from 'http-status';
import * as bcrypt from 'bcrypt';
import { jwtHelpers } from '../../utils/JWTHelpers';
import { config } from '../../config';
import { Secret } from 'jsonwebtoken';

export const login = async (payload: TAuth) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'user is deleted');
  }

  const comparePassword = await bcrypt.compare(payload.password, user.password);
  if (!comparePassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password does not match');
  }

  const JwtPayload = {
    _id: user._id,
    email: user.email,
    userName: user.userName,
    contact: user.contact,
    role: user.role,
    profileImg: user.profileImg,
  };

  const accessToken = jwtHelpers.generateToken(
    JwtPayload,
    config.jwt_access_secret as Secret,
    config.jwt_access_expire_in as string,
  );
  const refreshToken = jwtHelpers.generateToken(
    JwtPayload,
    config.jwt_refresh_secret as Secret,
    config.jwt_refresh_expire_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  login,
};
