import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import { AdminController } from './admin.controller';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  AdminController.getAllAdminsFromDB,
);

export const AdminRoutes = router;
