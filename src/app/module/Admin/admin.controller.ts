import CatchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

import httpStatus from 'http-status';
import { AdminService } from './admin.services';

const getAllAdminsFromDB = CatchAsync(async (req, res) => {
  const result = await AdminService.getAlladminsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

export const AdminController = { getAllAdminsFromDB };
