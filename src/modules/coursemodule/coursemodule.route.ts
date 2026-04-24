import { Router } from 'express';
import { CourseModuleController } from './coursemodule.controller';
import auth from '../../middlewares/auth';
import rbac from '../../middlewares/rbac';
import { validate } from '../../middlewares/validation';
import { createCourseModuleSchema, batchLinkSchema } from './coursemodule.validation';

const router = Router();

router.use(auth, rbac);

// Backward-compatible endpoints
router.post('/link', validate(createCourseModuleSchema), CourseModuleController.linkModule);
router.post('/batch/link', validate(batchLinkSchema), CourseModuleController.batchLinkModules);
router.post('/batch/unlink/:courseId', CourseModuleController.batchUnlinkModules);

// Simplified admin course-module routes
router.get('/courses/:courseId/modules', CourseModuleController.getCourseModules);
router.get('/modules/:moduleId/courses', CourseModuleController.getModuleCourses);
router.post('/courses/:courseId/modules', CourseModuleController.linkCourseModules);
router.delete('/courses/:courseId/modules', CourseModuleController.unlinkCourseModules);
router.delete('/courses/:courseId/modules/:moduleId', CourseModuleController.unlinkModule);

export default router;
