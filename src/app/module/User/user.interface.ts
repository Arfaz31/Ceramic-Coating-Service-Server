import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  id?: string;
  userName: string;
  email: string;
  password: string;
  role: keyof typeof USER_ROLE;
  contact: string;
  profileImg?: string;
  isDeleted: boolean;
  passwordChangedAt?: Date;
};

export interface UserModel extends Model<TUser> {
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
