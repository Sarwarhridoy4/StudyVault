import { Router } from 'express';
import { CourseModuleController } from './coursemodule.controller';
import auth from '../../middlewares/auth';
import rbac from '../../middlewares/rbac';
import { validate } from '../../middlewares/validation';
import { sanitizeBody } from '../../middlewares/sanitize';
import { createCourseModuleSchema, batchLinkSchema } from './coursemodule.validation';

const router = Router();

// Module linking/unlinking (Admin only)
router.post(
  '/link',
  auth,
  rbac,
  sanitizeBody(['courseId', 'moduleId', 'order']),
  validate(createCourseModuleSchema),
  CourseModuleController.linkModule
);

router.delete(
  '/unlink/:courseId/:moduleId',
  auth,
  rbac,
  CourseModuleController.unlinkModule
);

router.get(
  '/course/:courseId/modules',
  auth,
  rbac,
  CourseModuleController.getCourseModules
);

router.get(
  '/module/:moduleId/courses',
  auth,
  rbac,
  CourseModuleController.getModuleCourses
);

// Batch operations (Admin only)
router.post(
  '/batch/link',
  auth,
  rbac,
  sanitizeBody(['courseId', 'modules']),
  validate(batchLinkSchema),
  CourseModuleController.batchLinkModules
);

router.post(
  '/batch/unlink/:courseId',
  auth,
  rbac,
  sanitizeBody(['moduleIds']),
  CourseModuleController.batchUnlinkModules
);

export default router;
