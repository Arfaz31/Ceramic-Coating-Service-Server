import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constant';
import { UserController } from './user.controller';

const router = Router();

router.post(
  '/create-admin',
  auth(USER_ROLE.SUPER_ADMIN),
  UserController.createAdmin,
);

export const UserRoutes = router;
