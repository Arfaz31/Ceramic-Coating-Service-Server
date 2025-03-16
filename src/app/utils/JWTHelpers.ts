import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { USER_ROLE } from '../module/User/user.constant';

interface JwtPayload {
  id: string;
  userName: string;
  email: string;
  contact: string;
  role: keyof typeof USER_ROLE;
  profileImg?: string;
}

const generateToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expiresIn: string | number,
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
