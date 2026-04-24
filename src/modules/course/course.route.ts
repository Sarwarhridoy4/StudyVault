import { Router } from 'express';
import { CourseController } from './course.controller';
import auth from '../../middlewares/auth';
import rbac from '../../middlewares/rbac';
import { validate } from '../../middlewares/validation';
import { sanitizeBody } from '../../middlewares/sanitize';
import { createCourseSchema, updateCourseSchema } from './course.validation';
import { upload } from '../../middlewares/upload';

const router = Router();

// Public routes
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);

// Protected routes (with file upload handling)
router.post(
  '/',
  auth,
  rbac,
  upload.single('image'),
  sanitizeBody(['title', 'shortDescription', 'description', 'category', 'difficulty', 'price', 'createdBy']),
  validate(createCourseSchema),
  CourseController.createCourse
);

router.patch(
  '/:id',
  auth,
  rbac,
  upload.single('image'),
  sanitizeBody(['title', 'shortDescription', 'description', 'category', 'difficulty', 'price']),
  validate(updateCourseSchema),
  CourseController.updateCourse
);

router.delete('/:id', auth, rbac, CourseController.deleteCourse);

export default router;
