import { startSession } from 'mongoose';
import { User } from './user.model';
import AppError from '../../Error/AppError';
import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { USER_ROLE, userSearchableFields } from './user.constant';
import { Admin } from '../Admin/admin.model';
import QueryBuilder from '../../Builder/QueryBuilder';
import { Customer } from '../Customer/customer.model';
import { TImageFile } from '../../interface/image.interface';
import { JwtPayload } from 'jsonwebtoken';

interface TAdmin {
  name: string;
  email: string;
  password: string;
  contact: string;
  gender: string;
  address?: string;
}

interface TUpdateUser {
  targetUserId?: string;
  name?: string;
  contact?: string;
  gender?: string;
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

const updateUserProfileData = async (
  user: JwtPayload, // Logged-in user
  data: TUpdateUser,
  profileImg?: TImageFile,
) => {
  const { id: currentUserId, role } = user;

  let targetUserId = currentUserId; // Default to current user

  if (role === USER_ROLE.SUPER_ADMIN && data.targetUserId) {
    targetUserId = data.targetUserId; // Allow SUPER_ADMIN to target other users
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }

  // Prevent ADMIN and CUSTOMER from updating other users
  if (
    (role === USER_ROLE.ADMIN || role === USER_ROLE.CUSTOMER) &&
    targetUserId !== currentUserId
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not allowed to update other users’ profiles',
    );
  }

  const profileImagePath = (profileImg && profileImg.path) || '';

  // User model update data
  const userData = {
    contact: data.contact,
    profileImg: profileImagePath,
  };

  // Start a transaction
  const session = await startSession();
  session.startTransaction();

  try {
    // Update the User model
    await User.findByIdAndUpdate(targetUserId, userData, {
      new: true,
      session,
    });

    let updatedProfile = null;

    // Update role-specific models
    if (targetUser.role === USER_ROLE.ADMIN) {
      const adminData = {
        name: data.name,
        contact: data.contact,
        gender: data.gender,
        address: data.address,
        profileImg: profileImagePath,
      };
      updatedProfile = await Admin.findOneAndUpdate(
        { userId: targetUserId },
        adminData,
        { new: true, session },
      );
    } else if (targetUser.role === USER_ROLE.CUSTOMER) {
      const customerData = {
        name: data.name,
        contact: data.contact,
        gender: data.gender,
        address: data.address,
        profileImg: profileImagePath,
      };
      updatedProfile = await Customer.findOneAndUpdate(
        { userId: targetUserId },
        customerData,
        { new: true, session },
      );
    }

    await session.commitTransaction();
    session.endSession();

    return updatedProfile;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const softDeleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const UserService = {
  createAdmin,
  getAllUsersFromDB,
  getSingleUserFromDB,
  getMeFromDB,
  updateUserProfileData,
  softDeleteUserFromDB,
};
