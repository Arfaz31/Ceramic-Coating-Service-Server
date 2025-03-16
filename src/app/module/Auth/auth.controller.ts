import { config } from '../../config';
import CatchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthService } from './auth.services';
import httpStatus from 'http-status';

const signUpUser = CatchAsync(async (req, res) => {
  const result = await AuthService.signUp(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const loginUser = CatchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);
  const { refreshToken } = result;
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    // domain: 'hospitalmanagement.atctechlimited.com',
    secure: config.NODE_ENV === 'production',
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged in successfully',
    data: result,
  });
});

const changePassword = CatchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthService.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated succesfully!',
    data: result,
  });
});

const generateAccessTokeViaRefreshToken = CatchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  });
});

const forgetPassword = CatchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.forgetPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset link is generated succesfully!',
    data: result,
  });
});

const resetPassword = CatchAsync(async (req, res) => {
  const token = req.headers.authorization;

  const result = await AuthService.resetPassword(req.body, token as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset succesful!',
    data: result,
  });
});

export const AuthController = {
  signUpUser,
  loginUser,
  changePassword,
  generateAccessTokeViaRefreshToken,
  forgetPassword,
  resetPassword,
};
