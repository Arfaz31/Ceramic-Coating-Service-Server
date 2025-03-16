import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import { USER_ROLE } from './user.constant';
import bcrypt from 'bcrypt';
import { config } from '../../config';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE'],
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    passwordChangedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

//password field won't be shown in json response
userSchema.methods.toJSON = function () {
  const userObject = this.toObject(); //convert monogoDB document to plain js object
  delete userObject.password;
  return userObject;
};

//password hash by bcrypt
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  // Only hash the password if it has been modified (i.e., during password changes). With this update, when you change fields like status or any other non-password-related fields, the password will remain unchanged in the database.
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  next();
});

//check if password changed after the token was issued. if that then the previous jwt token will be invalid
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000; //at first getTime () method converts the UTC time in seconds then it convert in miliseconds / 1000
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
