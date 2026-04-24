import { Router } from 'express';
import { CourseController } from './course.controller';
import auth from '../../middlewares/auth';
import rbac from '../../middlewares/rbac';

const router = Router();

// Public routes
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);

// Protected routes
router.post('/', auth, rbac, CourseController.createCourse);
router.patch('/:id', auth, rbac, CourseController.updateCourse);
router.delete('/:id', auth, rbac, CourseController.deleteCourse);

export default router;
