import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  id?: string;
  name: string;
  userName: string;
  email: string;
  password: string;
  gender: 'MALE' | 'FEMALE';
  role: keyof typeof USER_ROLE;
  contact: string;
  address: string;
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
