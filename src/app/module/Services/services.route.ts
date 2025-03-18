import { Router } from 'express';
import { ServicesController } from './services.controller';
import { USER_ROLE } from '../User/user.constant';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  '/create-service',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  ServicesController.createService,
);

router.get(
  '/all-services',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  ServicesController.getAllServicesFromDB,
);

export const ServicesRoutes = router;
