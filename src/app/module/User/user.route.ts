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

router.get(
  '/all-users',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  UserController.getAllUsersFromDB,
);

router.get(
  '/me',
  auth(...Object.values(USER_ROLE)),
  UserController.getMeFromDB,
);

router.get(
  '/single-user/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  UserController.getSingleUserFromDB,
);

export const UserRoutes = router;
