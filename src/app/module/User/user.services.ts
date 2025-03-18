import { startSession } from 'mongoose';
import { User } from './user.model';
import AppError from '../../Error/AppError';
import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { USER_ROLE } from './user.constant';
import { Admin } from '../Admin/admin.model';

interface TAdmin {
  name: string;
  email: string;
  password: string;
  contact: string;
  gender: string;
  address?: string;
}

const createAdmin = async (payload: TAdmin) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email: payload.email }).session(
      session,
    );
    if (existingUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'You already have an account');
    }

    // Generate unique username
    const emailPrefix = payload.email.split('@')[0];
    const shortUuid = uuidv4().slice(0, 6);
    const userName = `${emailPrefix}_${shortUuid}`;

    const userData = {
      userName: userName,
      email: payload.email,
      password: payload.password,
      role: USER_ROLE.ADMIN,
      contact: payload.contact,
    };

    // Create User inside the transaction
    const newUser = await User.create([userData], { session });

    // Prepare Customer Data
    const adminData = {
      userId: newUser[0]._id,
      name: payload.name,
      userName: userName,
      email: payload.email,
      contact: payload.contact,
      gender: payload.gender,
      address: payload.address,
    };

    // Create admin inside the transaction
    await Admin.create([adminData], { session });

    await session.commitTransaction();
    session.endSession();

    return newUser[0]; // Return the created user
  } catch (error) {
    await session.abortTransaction(); // Rollback changes if an error occurs
    session.endSession();
    throw error;
  }
};

export const UserService = { createAdmin };
