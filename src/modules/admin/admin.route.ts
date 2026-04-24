import { Router } from 'express';
import auth from '../../middlewares/auth';
import rbac from '../../middlewares/rbac';
import { AdminController } from './admin.controller';

const router = Router();

// All admin routes require authentication AND ADMIN role
router.use(auth, rbac('ADMIN'));

router.get('/modules', AdminController.getAllModules);
router.patch('/modules/:id', AdminController.updateModule);
router.delete('/modules/:id', AdminController.deleteModule);
router.get('/courses', AdminController.getAllCourses);
router.get('/users', AdminController.getAllUsers);

export default router;
