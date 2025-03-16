import htttpStatus from 'http-status';
import CatchAsync from '../utils/catchAsync';
import AppError from '../Error/AppError';
export const parseBodyForFormData = CatchAsync(async (req, res, next) => {
  if (!req.body.data) {
    throw new AppError(
      htttpStatus.BAD_REQUEST,
      'Please provide data in the body under data key',
    );
  }
  req.body = JSON.parse(req.body.data);
  next();
});
