import { startSession } from 'mongoose';
import { User } from './user.model';
import AppError from '../../Error/AppError';
import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { USER_ROLE, userSearchableFields } from './user.constant';
import { Admin } from '../Admin/admin.model';
import QueryBuilder from '../../Builder/QueryBuilder';
import { Customer } from '../Customer/customer.model';

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

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

const getMeFromDB = async (id: string, role: string) => {
  let result = null;
  if (role === USER_ROLE.CUSTOMER) {
    result = await Customer.findOne({ id });
  }
  if (role === USER_ROLE.ADMIN) {
    result = await Admin.findOne({ id });
  }

  return result;
};

export const UserService = {
  createAdmin,
  getAllUsersFromDB,
  getSingleUserFromDB,
  getMeFromDB,
};
