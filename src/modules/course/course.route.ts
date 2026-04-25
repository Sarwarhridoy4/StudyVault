import { Router } from 'express';
import { CourseController } from './course.controller';
import auth from '../../middlewares/auth';
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
  upload.single('image'),
  sanitizeBody(['title', 'shortDescription', 'description', 'category', 'difficulty', 'price', 'image']),
  validate(createCourseSchema),
  CourseController.createCourse
);

router.patch(
  '/:id',
  auth,
  upload.single('image'),
  sanitizeBody(['title', 'shortDescription', 'description', 'category', 'difficulty', 'price', 'image']),
  validate(updateCourseSchema),
  CourseController.updateCourse
);

router.delete('/:id', auth, CourseController.deleteCourse);

// Course-Module relationship routes (simple link/unlink - push/pop module ObjectIds)
router.get('/:courseId/modules', auth, CourseController.getCourseModules);
router.post('/:courseId/link/:moduleId', auth, CourseController.linkModule);
router.delete('/:courseId/unlink/:moduleId', auth, CourseController.unlinkModule);

export default router;
