import { config } from '../../config';
import CatchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthService } from './auth.services';
import httpStatus from 'http-status';

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

export const AuthController = {
  loginUser,
};
