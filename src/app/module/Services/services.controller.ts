import CatchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ServicesService } from './services.service';
import httpStatus from 'http-status';

const createService = CatchAsync(async (req, res) => {
  const files = req.files as { [key: string]: Express.Multer.File[] };

  const result = await ServicesService.createService(req.body, files);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Service created successfully',
    data: result,
  });
});

const getAllServicesFromDB = CatchAsync(async (req, res) => {
  const result = await ServicesService.getAllServices(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Services fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

export const ServicesController = { createService, getAllServicesFromDB };
