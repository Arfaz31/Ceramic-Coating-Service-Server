import CatchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CustomerService } from './customer.services';
import httpStatus from 'http-status';

const getAllCustomersFromDB = CatchAsync(async (req, res) => {
  const result = await CustomerService.getAllCustomersFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customers fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

export const CustomerController = { getAllCustomersFromDB };
