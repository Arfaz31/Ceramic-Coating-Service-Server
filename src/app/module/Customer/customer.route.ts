import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';

import { CustomerController } from './customer.controller';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  CustomerController.getAllCustomersFromDB,
);

export const CustomerRoutes = router;
